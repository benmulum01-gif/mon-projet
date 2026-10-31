begin;
select plan(7);

insert into auth.users (id, email, raw_user_meta_data, aud, role)
values ('77777777-7777-7777-7777-777777777777', 'cgu@example.com', '{"terms_version":"2026-10-31"}', 'authenticated', 'authenticated');
select is((select terms_version from public.profiles where id = '77777777-7777-7777-7777-777777777777'), '2026-10-31', 'accepted terms version is recorded');
select isnt((select terms_accepted_at from public.profiles where id = '77777777-7777-7777-7777-777777777777'), null, 'acceptance date is recorded');

set local role anon;
select lives_ok($$select public.subscribe_newsletter('Lecteur@Example.com', 'fr', 'v1')$$, 'anonymous visitors can subscribe');
select lives_ok($$select public.subscribe_newsletter('lecteur@example.com', 'fr', 'v1')$$, 'subscribing twice does not reveal existing addresses');
select throws_ok($$select count(*) from public.newsletter_subscribers$$, '42501', null, 'subscriber list is not readable by visitors');
reset role;

select is((select consent_version from public.newsletter_subscribers where email = 'lecteur@example.com'), 'v1', 'consent version is stored');
select ok(public.unsubscribe_newsletter((select unsubscribe_token from public.newsletter_subscribers where email = 'lecteur@example.com')), 'one-click unsubscribe works');

select * from finish();
rollback;
