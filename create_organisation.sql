CREATE ROLE unicef NOINHERIT PASSWORD 'password';

GRANT unicef TO openchs;

GRANT ALL ON ALL TABLES IN SCHEMA public TO unicef;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO unicef;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO unicef;

INSERT into organisation(name, db_user, uuid, parent_organisation_id)
    SELECT 'UNICEF', 'unicef', '9f2f61e8-7559-4613-b490-f9b4f0eb5c03'  , id FROM organisation WHERE name = 'OpenCHS';
