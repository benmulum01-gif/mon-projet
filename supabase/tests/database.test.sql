begin;
select plan(14);

-- Two users, each with a workspace.
insert into auth.users (id, email, raw_user_meta_data, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'alice@example.com', '{"ui_locale":"fr","full_name":"Alice"}', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'bob@example.com', '{"ui_locale":"de"}', 'authenticated', 'authenticated');

select is((select ui_locale from public.profiles where id = '11111111-1111-1111-1111-111111111111'), 'fr',
  'signup stores the chosen interface language');
select is((select ui_locale from public.profiles where id = '22222222-2222-2222-2222-222222222222'), null,
  'unsupported signup language is ignored');

set local role authenticated;
set local request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select public.create_workspace('Alice Co', 'fr', array['fr','en'], 'Europe/Paris', 'eur') as ws_a \gset
select is((select currency::text from public.workspaces where id = :'ws_a'), 'EUR', 'currency is normalised');
select is((select role from public.workspace_members where workspace_id = :'ws_a'), 'owner', 'creator becomes owner');

insert into public.leads (workspace_id, full_name, preferred_locale) values (:'ws_a', 'Jean Dupont', 'fr');
insert into public.conversations (id, workspace_id, lead_id)
  select '33333333-3333-3333-3333-333333333333', :'ws_a', id from public.leads limit 1;
insert into public.messages (id, workspace_id, conversation_id, direction, status, body)
  values ('44444444-4444-4444-4444-444444444444', :'ws_a', '33333333-3333-3333-3333-333333333333', 'inbound', 'received', 'Bonjour');

select throws_ok(
  $$update public.messages set body = 'Hello' where id = '44444444-4444-4444-4444-444444444444'$$,
  'original message content is immutable', 'received messages cannot be rewritten');

insert into public.message_templates (id, workspace_id, kind, name)
  values ('55555555-5555-5555-5555-555555555555', :'ws_a', 'initial_contact', 'Welcome');
insert into public.template_variants (workspace_id, template_id, locale, body)
  values (:'ws_a', '55555555-5555-5555-5555-555555555555', 'fr', 'Bonjour {{first_name}}');
select is(public.template_missing_locales('55555555-5555-5555-5555-555555555555'), array['en'],
  'missing translation detected');
select throws_ok(
  format($$insert into public.automations (workspace_id, name, trigger, template_id, is_active)
    values (%L, 'Auto', 'lead_created', '55555555-5555-5555-5555-555555555555', true)$$, :'ws_a'),
  'automation template is missing translations', 'cannot activate with a missing translation');

insert into public.template_variants (workspace_id, template_id, locale, body)
  values (:'ws_a', '55555555-5555-5555-5555-555555555555', 'en', 'Hello {{first_name}}');
select lives_ok(
  format($$insert into public.automations (id, workspace_id, name, trigger, template_id, is_active)
    values ('66666666-6666-6666-6666-666666666666', %L, 'Auto', 'lead_created', '55555555-5555-5555-5555-555555555555', true)$$, :'ws_a'),
  'activation works once every language is covered');

delete from public.template_variants where locale = 'en';
select is((select is_active from public.automations where id = '66666666-6666-6666-6666-666666666666'), false,
  'removing a translation deactivates the automation');

select throws_ok(
  format($$update public.workspaces set comm_locales = array['xx'] where id = %L$$, :'ws_a'),
  'unsupported communication locale', 'unknown communication language rejected');

-- Bob must not see Alice's data.
set local request.jwt.claims to '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select is((select count(*)::int from public.leads), 0, 'other users cannot read leads');
select is((select count(*)::int from public.workspaces), 0, 'other users cannot read workspaces');
select throws_ok(
  format($$insert into public.leads (workspace_id, full_name) values (%L, 'Intruder')$$, :'ws_a'),
  '42501', null, 'other users cannot insert into a foreign workspace');

-- Anonymous visitors can submit the contact form but never read it.
set local role anon;
set local request.jwt.claims to '{"role":"anon"}';
insert into public.contact_requests (full_name, email, message, locale) values ('V', 'v@example.com', 'Hi', 'en');
select is((select count(*)::int from public.contact_requests), 0, 'contact requests are not readable');

select * from finish();
rollback;
