set role unicef_preconception_nashik;
set timezone to 'Asia/Kolkata';

with visit as (select *, NULLIF(regexp_replace(name, '\D', '', 'g'), '') :: numeric
                           + extract(years from age('2019-09-30', encounter_date_time)) * 12 +
                         extract(month from age('2019-09-30', encounter_date_time))                        as sepvisitno,
                         rank() over (partition by program_enrolment_id order by encounter_date_time desc) as ranking
               from program_encounter),
     newvisits as (select '{}'::jsonb                         as observations,
                          '2019-09-09'::TIMESTAMPTZ           as earliest_visit_date_time,
                          '2019-09-23'::TIMESTAMPTZ           as max_visit_date_time,
                          program_enrolment_id,
                          uuid_generate_v4()        uuid,
                          1                      as version,
                          63                     as encounter_type_id,
                          ('Visit ' || sepvisitno ) as name,
                          organisation_id
                   from visit
                   where ranking = 1
                     and sepvisitno notnull)
insert into program_encounter (observations,
                               earliest_visit_date_time,
                               max_visit_date_time,
                               program_enrolment_id,
                               uuid,
                               version,
                               encounter_type_id,
                               name,
                               organisation_id,
                               audit_id)
select *, create_audit((select id from users where username = 'dataimporter@precon')) from newvisits;

---------reschedule visit from sep 09 to aug 23
with visit as (select *,
                         rank() over (partition by program_enrolment_id order by encounter_date_time desc) as ranking
               from program_encounter),
    newvisits as (
               select '{}'::jsonb as observations,
      '2019-08-23'::TIMESTAMPTZ as earliest_visit_date_time,
      '2019-09-06'::TIMESTAMPTZ as max_visit_date_time,
      program_enrolment_id,
      uuid_generate_v4()        uuid,
      1 as version,
      62 as encounter_type_id,
     'Visit 13' as name,
      organisation_id
      from visit
      where ranking = 1
      and encounter_type_id = 62)

insert into program_encounter (observations,
                               earliest_visit_date_time,
                               max_visit_date_time,
                               program_enrolment_id,
                               uuid,
                               version,
                               encounter_type_id,
                               name,
                               organisation_id,
                               audit_id)
select *
    ,create_audit((select id from users where username = 'dataimporter@precon'))
from newvisits;

---------fix incorrect data imported
----------nulls were treated as zero -- fix them
update program_encounter set observations = jsonb_strip_nulls(observations
                              ||(CASE WHEN observations->>'1a512b73-3c11-4a4e-8c6c-fb6f625121f2' = '0' THEN '{"1a512b73-3c11-4a4e-8c6c-fb6f625121f2":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'470551a0-69ad-49ef-81fd-663c13c1004e' = '0' THEN '{"470551a0-69ad-49ef-81fd-663c13c1004e":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'7ac0d759-c50d-4971-88e0-84274224c839' = '0' THEN '{"7ac0d759-c50d-4971-88e0-84274224c839":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'7afcfc69-a301-4ad3-b0f2-b251141f8033' = '0' THEN '{"7afcfc69-a301-4ad3-b0f2-b251141f8033":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'902100eb-e799-41b9-be73-3844952bcdc7' = '0' THEN '{"902100eb-e799-41b9-be73-3844952bcdc7":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'9e1792f3-1111-4ecd-9821-5ed22a3a6d2c' = '0' THEN '{"9e1792f3-1111-4ecd-9821-5ed22a3a6d2c":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'a903ed61-a9ce-40f1-abc6-e49d91066051' = '0' THEN '{"a903ed61-a9ce-40f1-abc6-e49d91066051":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'bf79f9bf-1dc7-4bb5-8747-a9e2ab1e73f3' = '0' THEN '{"bf79f9bf-1dc7-4bb5-8747-a9e2ab1e73f3":null}' ELSE '{}' END)::jsonb
                              ||(CASE WHEN observations->>'d6bfbe2e-c301-4a26-8893-5236fd20f661' = '0' THEN '{"d6bfbe2e-c301-4a26-8893-5236fd20f661":null}' ELSE '{}' END)::jsonb
              );

update audit set last_modified_date_time = current_timestamp, last_modified_by_id = (select id from users where username = 'dataimporter@precon')
from program_encounter where program_encounter.audit_id = audit.id;

-----void incorrect work done by some anms before 23 aug
select * from program_encounter where earliest_visit_date_time > '2019-09-01';-- void all these

update audit set last_modified_by_id = (select id from users where username = 'dataimporter@precon'),
                 last_modified_date_time = current_timestamp where id in (596793,597342,598687);

insert into program_encounter (observations,
                               earliest_visit_date_time,
                               max_visit_date_time,
                               program_enrolment_id,
                               uuid,
                               version,
                               encounter_type_id,
                               name,
                               organisation_id,
                               audit_id)
values
      (jsonb'{}',TIMESTAMPTZ'2019-08-23',TIMESTAMPTZ'2019-09-06',26689,uuid_generate_v4(),1,63,'Visit 13', 34, create_audit((select id from users where username = 'dataimporter@precon'))),
      (jsonb'{}',TIMESTAMPTZ'2019-08-23',TIMESTAMPTZ'2019-09-06',26063,uuid_generate_v4(),1,63,'Visit 13', 34, create_audit((select id from users where username = 'dataimporter@precon')))
;