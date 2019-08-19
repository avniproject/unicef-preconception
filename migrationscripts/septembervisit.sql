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
