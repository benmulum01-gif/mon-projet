-- SAVAN initial schema.
-- Stable, language-independent identifiers (enums, keys) are stored in the database;
-- their translations live only in the application dictionaries (messages/*.json).

-- ---------------------------------------------------------------------------
-- Supported languages. Adding a language = one row here + one dictionary file.
-- ---------------------------------------------------------------------------
create table public.locales (
  code text primary key check (code ~ '^[a-z]{2}$'),
  english_name text not null,
  native_name text not null
);
insert into public.locales (code, english_name, native_name) values
  ('en', 'English', 'English'),
  ('fr', 'French', 'Français');

alter table public.locales enable row level security;
create policy "locales are public" on public.locales for select using (true);

-- ---------------------------------------------------------------------------
-- Profiles: one per auth user. ui_locale = interface language preference.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  ui_locale text references public.locales (code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "users read own profile" on public.profiles for select using (id = auth.uid());
create policy "users update own profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  requested text := new.raw_user_meta_data ->> 'ui_locale';
begin
  insert into public.profiles (id, full_name, ui_locale)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    case when exists (select 1 from public.locales where code = requested) then requested end
  );
  return new;
end;
$$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Workspaces (one business). Language settings are deliberately separate:
--   default_comm_locale   -> language used with prospects when theirs is unknown
--   comm_locales          -> every language the business communicates in
--                            (each automation template needs a variant for each)
--   internal_ai_locale    -> language of AI summaries/insights for the team
--                            (null = the reader's interface language)
-- Time zone and currency are independent of any language.
-- ---------------------------------------------------------------------------
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  default_comm_locale text not null default 'en' references public.locales (code),
  comm_locales text[] not null default array['en'],
  internal_ai_locale text references public.locales (code),
  timezone text not null default 'UTC',
  currency char(3) not null default 'USD' check (currency ~ '^[A-Z]{3}$'),
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  constraint default_comm_locale_in_comm_locales check (default_comm_locale = any (comm_locales))
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index on public.workspace_members (user_id);

create function public.is_workspace_member(ws uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = auth.uid()
  );
$$;

create function public.is_workspace_admin(ws uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.workspace_members m
    where m.workspace_id = ws and m.user_id = auth.uid() and m.role in ('owner', 'admin')
  );
$$;

-- Every entry of comm_locales must be a supported locale.
create function public.validate_comm_locales() returns trigger
language plpgsql set search_path = '' as $$
begin
  if array_length(new.comm_locales, 1) is null then
    raise exception 'comm_locales cannot be empty';
  end if;
  if exists (
    select 1 from unnest(new.comm_locales) c
    where not exists (select 1 from public.locales l where l.code = c)
  ) then
    raise exception 'unsupported communication locale';
  end if;
  return new;
end;
$$;
create trigger workspaces_validate_comm_locales before insert or update on public.workspaces
  for each row execute function public.validate_comm_locales();

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
create policy "members read workspace" on public.workspaces for select using (public.is_workspace_member(id));
create policy "admins update workspace" on public.workspaces for update
  using (public.is_workspace_admin(id)) with check (public.is_workspace_admin(id));
create policy "members read memberships" on public.workspace_members for select
  using (public.is_workspace_member(workspace_id));

-- Creating a workspace also makes the caller its owner, atomically.
create function public.create_workspace(
  p_name text,
  p_default_comm_locale text,
  p_comm_locales text[],
  p_timezone text,
  p_currency text
) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  ws uuid;
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  insert into public.workspaces (name, default_comm_locale, comm_locales, timezone, currency, created_by)
  values (p_name, p_default_comm_locale, p_comm_locales, p_timezone, upper(p_currency), auth.uid())
  returning id into ws;
  insert into public.workspace_members (workspace_id, user_id, role) values (ws, auth.uid(), 'owner');
  return ws;
end;
$$;
revoke all on function public.create_workspace(text, text, text[], text, text) from public, anon;
grant execute on function public.create_workspace(text, text, text[], text, text) to authenticated;

-- ---------------------------------------------------------------------------
-- Leads. Business data is stored exactly as entered: never translated.
-- ---------------------------------------------------------------------------
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'appointment_booked', 'won', 'lost');
create type public.lead_source as enum ('website', 'referral', 'ads', 'social', 'phone', 'email', 'other');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 200),
  email text,
  phone text,
  company text,
  source public.lead_source not null default 'other',
  status public.lead_status not null default 'new',
  -- Language this prospect prefers to be contacted in (null = unknown).
  preferred_locale text references public.locales (code),
  value_cents bigint check (value_cents is null or value_cents >= 0),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on public.leads (workspace_id, status);
create index on public.leads (workspace_id, created_at desc);

alter table public.leads enable row level security;
create policy "members manage leads" on public.leads for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

-- ---------------------------------------------------------------------------
-- Conversations & messages. Originals are immutable; translations are
-- stored separately and only on explicit request.
-- ---------------------------------------------------------------------------
create type public.channel as enum ('email', 'sms', 'whatsapp', 'web_chat', 'phone');
create type public.message_direction as enum ('inbound', 'outbound');
create type public.message_status as enum ('received', 'draft', 'pending_approval', 'approved', 'sent');

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  channel public.channel not null default 'email',
  -- Language of this specific conversation, when known.
  locale text references public.locales (code),
  created_at timestamptz not null default now()
);
create index on public.conversations (workspace_id, lead_id);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  direction public.message_direction not null,
  status public.message_status not null,
  body text not null check (char_length(body) between 1 and 20000),
  locale text references public.locales (code),
  ai_generated boolean not null default false,
  automation_id uuid,
  author_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);
create index on public.messages (conversation_id, created_at);

-- The body of a received or sent message can never be rewritten.
create function public.protect_message_original() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.status in ('received', 'sent') and new.body is distinct from old.body then
    raise exception 'original message content is immutable';
  end if;
  return new;
end;
$$;
create trigger messages_protect_original before update on public.messages
  for each row execute function public.protect_message_original();

create table public.message_translations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  message_id uuid not null references public.messages (id) on delete cascade,
  target_locale text not null references public.locales (code),
  body text not null,
  created_at timestamptz not null default now(),
  unique (message_id, target_locale)
);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.message_translations enable row level security;
create policy "members manage conversations" on public.conversations for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members manage messages" on public.messages for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members manage translations" on public.message_translations for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

-- ---------------------------------------------------------------------------
-- Appointments
-- ---------------------------------------------------------------------------
create type public.appointment_status as enum ('scheduled', 'completed', 'cancelled', 'no_show');

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  lead_id uuid not null references public.leads (id) on delete cascade,
  starts_at timestamptz not null,
  duration_minutes integer not null default 30 check (duration_minutes between 5 and 600),
  location text,
  status public.appointment_status not null default 'scheduled',
  notes text,
  created_at timestamptz not null default now()
);
create index on public.appointments (workspace_id, starts_at);
alter table public.appointments enable row level security;
create policy "members manage appointments" on public.appointments for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

-- ---------------------------------------------------------------------------
-- Message templates, one variant per language, and automations.
-- ---------------------------------------------------------------------------
create type public.template_kind as enum (
  'initial_contact', 'follow_up', 'appointment_confirmation', 'appointment_reminder',
  'rescheduling', 'reactivation', 'internal_notification'
);
create type public.automation_trigger as enum (
  'lead_created', 'lead_status_changed', 'appointment_booked'
);

create table public.message_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  kind public.template_kind not null,
  name text not null check (char_length(name) between 1 and 120),
  created_at timestamptz not null default now()
);

create table public.template_variants (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  template_id uuid not null references public.message_templates (id) on delete cascade,
  locale text not null references public.locales (code),
  subject text,
  body text not null check (char_length(body) between 1 and 5000),
  updated_at timestamptz not null default now(),
  unique (template_id, locale)
);

create table public.automations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 120),
  trigger public.automation_trigger not null,
  template_id uuid not null references public.message_templates (id) on delete restrict,
  channel public.channel not null default 'email',
  delay_minutes integer not null default 0 check (delay_minutes between 0 and 43200),
  -- Inactive by default; outbound messages always wait for human approval in the MVP.
  is_active boolean not null default false,
  requires_approval boolean not null default true check (requires_approval),
  created_at timestamptz not null default now()
);

alter table public.messages
  add constraint messages_automation_fk foreign key (automation_id) references public.automations (id) on delete set null;

-- Locales of the workspace for which a template has no variant.
create function public.template_missing_locales(p_template uuid) returns text[]
language sql stable set search_path = '' as $$
  select coalesce(array_agg(c order by c), array[]::text[])
  from public.message_templates t
  join public.workspaces w on w.id = t.workspace_id
  cross join lateral unnest(w.comm_locales) c
  where t.id = p_template
    and not exists (
      select 1 from public.template_variants v where v.template_id = t.id and v.locale = c
    );
$$;

-- An automation cannot be activated while one of its translations is missing.
create function public.check_automation_activation() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.is_active and array_length(public.template_missing_locales(new.template_id), 1) > 0 then
    raise exception 'automation template is missing translations' using errcode = 'P0001', hint = 'missing_translations';
  end if;
  return new;
end;
$$;
create trigger automations_check_activation before insert or update on public.automations
  for each row execute function public.check_automation_activation();

-- Removing a variant or adding a communication language deactivates affected automations.
create function public.deactivate_incomplete_automations() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  ws uuid;
begin
  if tg_table_name = 'workspaces' then
    ws := new.id;
  else
    ws := old.workspace_id;
  end if;
  update public.automations a set is_active = false
  where a.workspace_id = ws and a.is_active
    and array_length(public.template_missing_locales(a.template_id), 1) > 0;
  return null;
end;
$$;
create trigger variants_deactivate after delete on public.template_variants
  for each row execute function public.deactivate_incomplete_automations();
create trigger workspaces_deactivate after update of comm_locales on public.workspaces
  for each row execute function public.deactivate_incomplete_automations();

alter table public.message_templates enable row level security;
alter table public.template_variants enable row level security;
alter table public.automations enable row level security;
create policy "members manage templates" on public.message_templates for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members manage variants" on public.template_variants for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));
create policy "members manage automations" on public.automations for all
  using (public.is_workspace_member(workspace_id)) with check (public.is_workspace_member(workspace_id));

-- ---------------------------------------------------------------------------
-- Billing: written only by the Stripe webhook (service role).
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  workspace_id uuid primary key references public.workspaces (id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text,
  status text,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  updated_at timestamptz not null default now()
);
alter table public.subscriptions enable row level security;
create policy "members read subscription" on public.subscriptions for select
  using (public.is_workspace_member(workspace_id));

-- ---------------------------------------------------------------------------
-- Public contact form. Anyone may submit; nobody can read through the API.
-- ---------------------------------------------------------------------------
create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  company text check (company is null or char_length(company) <= 200),
  message text not null check (char_length(message) between 1 and 5000),
  locale text not null references public.locales (code),
  created_at timestamptz not null default now()
);
alter table public.contact_requests enable row level security;
create policy "anyone can submit contact request" on public.contact_requests for insert
  to anon, authenticated with check (true);

-- updated_at maintenance
create function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger leads_touch before update on public.leads for each row execute function public.touch_updated_at();
create trigger variants_touch before update on public.template_variants for each row execute function public.touch_updated_at();
