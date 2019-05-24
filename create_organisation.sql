CREATE ROLE unicef_preconception_nashik NOINHERIT PASSWORD 'password';

GRANT unicef_preconception_nashik TO openchs;

GRANT ALL ON ALL TABLES IN SCHEMA public TO unicef_preconception_nashik;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO unicef_preconception_nashik;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO unicef_preconception_nashik;

INSERT into organisation(name, db_user, uuid, parent_organisation_id)
    SELECT 'UNICEF Preconception Nashik', 'unicef_preconception_nashik', '9f2f61e8-7559-4613-b490-f9b4f0eb5c03'  , id FROM organisation WHERE name = 'OpenCHS';
