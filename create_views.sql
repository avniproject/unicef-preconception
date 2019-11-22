set role unicef_preconception_nashik;
-------------

create or replace view precon_locations_view as
select wadi.id    wadi_id,
       wadi.title wadi,
       vill.id    village_id,
       vill.title village,
       subc.id    subcenter_id,
       subc.title subcenter,
       phc.id     phc_id,
       phc.title  phc,
       blck.id    block_id,
       blck.title block
from address_level wadi
       join address_level_type waditype on wadi.type_id = waditype.id and waditype.name = 'Wadi'
       join address_level vill on vill.id = wadi.parent_id
       join address_level_type villtype on vill.type_id = villtype.id and villtype.name = 'Village'
       join address_level subc on subc.id = vill.parent_id
       join address_level_type subctype on subc.type_id = subctype.id and subctype.name = 'Subcenter'
       join address_level phc on phc.id = subc.parent_id
       join address_level_type phctype on phc.type_id = phctype.id and phctype.name = 'Phc'
       join address_level blck on blck.id = phc.parent_id
       join address_level_type blcktype on blck.type_id = blcktype.id and blcktype.name = 'Block';

create or replace view precon_analysis_of_monthly_monitoring_base_view as
with allevents(individual_id,
       observations,
       name,
       exited) as (select individual_id, enl.observations, 'baseline', program_exit_date_time NOTNULL
                   from program_enrolment enl
                          join individual i on enl.individual_id = i.id
                   where not enl.is_voided
                     and not i.is_voided
    union all
    select individual_id, v1.observations, 'Visit 1', program_exit_date_time NOTNULL
    from program_encounter v1
           join program_enrolment enrolment on v1.program_enrolment_id = enrolment.id
           join encounter_type et on v1.encounter_type_id = et.id and et.name = 'Visit 1'
           join individual i on enrolment.individual_id = i.id
    where v1.encounter_date_time notnull
      and v1.cancel_date_time isnull
      and v1.is_voided = false
      and enrolment.is_voided = false
      and i.is_voided = false
    union all
    select individual_id, mm.observations, mm.name, program_exit_date_time NOTNULL
    from program_encounter mm
           join program_enrolment enrolment on mm.program_enrolment_id = enrolment.id
           join encounter_type et on mm.encounter_type_id = et.id and et.name = 'Monthly Monitoring'
           join individual i on enrolment.individual_id = i.id
    where mm.encounter_date_time notnull
      and mm.cancel_date_time isnull
      and mm.is_voided = false
      and enrolment.is_voided = false
      and i.is_voided = false)

select individual_id,
       name,
       jsonb_build_object(
         'uptDone', upt NOTNULL,
         'uptPositive', upt NOTNULL and upt = 'Positive',
         'uptNegative', upt NOTNULL and upt = 'Negative',
         'bmiLessThan16', bmi NOTNULL AND bmi < 16,
         'bmiBetween16And18', bmi NOTNULL AND bmi BETWEEN 16.01 AND 18.49,
         'bmiBetween18And22', bmi NOTNULL AND bmi BETWEEN 18.50 AND 22.99,
         'bmiBetween23And24', bmi NOTNULL AND bmi BETWEEN 23.00 AND 24.99,
         'bmiBetween25And29', bmi NOTNULL AND bmi BETWEEN 25.00 AND 29.99,
         'bmiGretaerThan30', bmi NOTNULL AND bmi >= 30.00,
         'bmiMissingData', bmi is null,
         'hbLessThan8', hb NOTNULL AND hb < 8,
         'hbBetween8And10', hb NOTNULL AND hb BETWEEN 8.00 AND 10.99,
         'hbEqual11', hb NOTNULL AND hb BETWEEN 11 AND 11.99,
         'hbGreaterThan12', hb NOTNULL AND hb >= 12,
         'hbMissingData', hb is null) as reasonmap,
       jsonb_build_object(
         'uptDone', upt,
         'uptPositive', upt,
         'uptNegative', upt,
         'bmiLessThan16', bmi,
         'bmiBetween16And18', bmi,
         'bmiBetween18And22', bmi,
         'bmiBetween23And24', bmi,
         'bmiBetween25And29', bmi,
         'bmiGretaerThan30', bmi,
         'bmiMissingData', bmi,
         'hbLessThan8', hb,
         'hbBetween8And10', hb,
         'hbEqual11', hb,
         'hbGreaterThan12', hb,
         'hbMissingData', hb)         as valuemap,
       jsonb_build_object(
         'uptDone', 'UPT',
         'uptPositive', 'UPT',
         'uptNegative', 'UPT',
         'bmiLessThan16', 'BMI',
         'bmiBetween16And18', 'BMI',
         'bmiBetween18And22', 'BMI',
         'bmiBetween23And24', 'BMI',
         'bmiBetween25And29', 'BMI',
         'bmiGretaerThan30', 'BMI',
         'bmiMissingData', 'BMI',
         'hbLessThan8', 'HB',
         'hbBetween8And10', 'HB',
         'hbEqual11', 'HB',
         'hbGreaterThan12', 'HB',
         'hbMissingData', 'HB')       as conceptmap,
       exited
from allevents
       join lateral (select single_select_coded(observations->'f475f6c0-d99c-419d-ba58-a49c92bebcef') :: TEXT upt,
                            (observations->>'7ac0d759-c50d-4971-88e0-84274224c839') :: NUMERIC                bmi,
                            (observations->>'470551a0-69ad-49ef-81fd-663c13c1004e') :: NUMERIC                hb) as spread (upt, bmi, hb) on true;

---------------
set role none;