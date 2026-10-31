-- Compliance changes.

-- Payments are no longer processed on the site (invoice + PayPal), so the
-- Stripe mirror table is dropped: no unnecessary personal data is kept.
drop table if exists public.subscriptions;

-- Proof of acceptance of the terms of use (CGU) at sign-up.
alter table public.profiles
  add column terms_version text,
  add column terms_accepted_at timestamptz;

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  requested text := new.raw_user_meta_data ->> 'ui_locale';
begin
  insert into public.profiles (id, full_name, ui_locale, terms_version, terms_accepted_at)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    case when exists (select 1 from public.locales where code = requested) then requested end,
    nullif(new.raw_user_meta_data ->> 'terms_version', ''),
    case when new.raw_user_meta_data ? 'terms_version' then now() end
  );
  return new;
end;
$$;

-- Newsletter: explicit consent, recorded with the wording version and date.
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (char_length(email) between 3 and 320),
  locale text not null references public.locales (code),
  consent_version text not null,
  consented_at timestamptz not null default now(),
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  unsubscribed_at timestamptz
);
alter table public.newsletter_subscribers enable row level security;
-- No policies and no privileges: only reachable through the functions below.
revoke all on table public.newsletter_subscribers from anon, authenticated;

-- Subscribing never reveals whether an address is already registered.
create function public.subscribe_newsletter(p_email text, p_locale text, p_consent_version text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.newsletter_subscribers (email, locale, consent_version)
  values (lower(trim(p_email)), p_locale, p_consent_version)
  on conflict (email) do update
    set locale = excluded.locale, consent_version = excluded.consent_version,
        consented_at = now(), unsubscribed_at = null;
end;
$$;

-- One-click unsubscribe from the link in every newsletter.
create function public.unsubscribe_newsletter(p_token uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  found_row boolean;
begin
  update public.newsletter_subscribers set unsubscribed_at = coalesce(unsubscribed_at, now())
  where unsubscribe_token = p_token;
  get diagnostics found_row = row_count;
  return found_row;
end;
$$;

revoke all on function public.subscribe_newsletter(text, text, text) from public;
revoke all on function public.unsubscribe_newsletter(uuid) from public;
grant execute on function public.subscribe_newsletter(text, text, text) to anon, authenticated;
grant execute on function public.unsubscribe_newsletter(uuid) to anon, authenticated;

-- Retention: contact requests older than 3 years are deleted (CNIL guidance for
-- prospects). Call regularly (e.g. pg_cron: select public.purge_expired_data();).
create function public.purge_expired_data() returns void
language sql security definer set search_path = '' as $$
  delete from public.contact_requests where created_at < now() - interval '3 years';
  delete from public.newsletter_subscribers where unsubscribed_at < now() - interval '30 days';
$$;
revoke all on function public.purge_expired_data() from public, anon, authenticated;
