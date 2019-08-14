select create_db_user('unicef_preconception_nashik', 'password');

INSERT into organisation(name, db_user, uuid, username_suffix, parent_organisation_id)
values ('UNICEF Preconception Nashik', 'unicef_preconception_nashik', '9f2f61e8-7559-4613-b490-f9b4f0eb5c03', 'precon'
    (select id FROM organisation WHERE name = 'OpenCHS'))
ON CONFLICT (uuid) DO NOTHING;
