set role unicef_preconception_nashik;

----------------------------------------------------------------------------------------------------
-- 1. Check if pregnancy outcome of Abortion shows up on the report.
--    Given an individual who has a pregnancy outcome of abortion, the abortion count should increase by 1.
----------------------------------------------------------------------------------------------------
-- Clear all data created by this user. This ensures that the test is rerunnable
select clear_data('precon-staging');

-- Create an individual. Note that there are a lot of optional fields that have been left blank.
select
  create_individual('28fa7ada-c917-42f2-992c-a03d867a3663',
                    'ba9e67af-d911-4b91-81ca-993f3efae18d', 'A', 'B', 'precon-staging', null, current_date);

-- Create program enrolment for this individual. Notice uuid of individual is same as what is provided before.
select create_program_enrolment('d862ba8f-5951-4afb-acbf-3265863f0963', 'Preconception ',
                                '28fa7ada-c917-42f2-992c-a03d867a3663', 'precon-staging');

-- Create program encounter.
select create_program_encounter('139f5e4b-568d-4da0-808b-0cd7ca496705', 'd862ba8f-5951-4afb-acbf-3265863f0963',
                                'precon-staging', 'Outcome', '{
  "Last pregnancy outcome": "Abortion"
}');

----------------------------------------------------------------------------------------------------
-- Verify abortion count = 1
----------------------------------------------------------------------------------------------------
-- 1.1. Ensure voided individuals don't show up
update individual set is_voided = true where uuid = '28fa7ada-c917-42f2-992c-a03d867a3663';

----------------------------------------------------------------------------------------------------
-- Verify abortion count = 0
----------------------------------------------------------------------------------------------------
-- 1.2. Ensure voided program enrolments don't show up
update individual set is_voided = false where uuid = '28fa7ada-c917-42f2-992c-a03d867a3663';

update program_enrolment set is_voided = true where uuid = 'd862ba8f-5951-4afb-acbf-3265863f0963';

----------------------------------------------------------------------------------------------------
-- Verify abortion count = 0
----------------------------------------------------------------------------------------------------
-- 1.3. Ensure voided program enrolments don't show up
update program_enrolment set is_voided = false where uuid = 'd862ba8f-5951-4afb-acbf-3265863f0963';

update program_encounter set is_voided = true where uuid = '139f5e4b-568d-4da0-808b-0cd7ca496705';

----------------------------------------------------------------------------------------------------
-- Verify abortion count = 0
----------------------------------------------------------------------------------------------------
-- 1.4. Pregnancy outcome not present when question is not answered
update program_encounter set is_voided = false where uuid = '139f5e4b-568d-4da0-808b-0cd7ca496705';

select
  create_individual('e03b0042-b975-4d21-a800-b1c3b84b3018',
                    'ba9e67af-d911-4b91-81ca-993f3efae18d', 'A1', 'B1', 'precon-staging', null, current_date);

-- Create program enrolment for this individual. Notice uuid of individual is same as what is provided before.
select create_program_enrolment('a8ba1ed6-711e-4543-b81f-5a3d3dfc4747', 'Preconception ',
                                'e03b0042-b975-4d21-a800-b1c3b84b3018', 'precon-staging');

-- Create program encounter.
select create_program_encounter('139f5e4b-568d-4da0-808b-0cd7ca496705', 'a8ba1ed6-711e-4543-b81f-5a3d3dfc4747',
                                'precon-staging', 'Outcome');

----------------------------------------------------------------------------------------------------
-- Verify abortion count = 0
----------------------------------------------------------------------------------------------------
-- 1.5. Pregnancy outcome should not get counted if outcome is not Abortion
update program_encounter set is_voided = false where uuid = '139f5e4b-568d-4da0-808b-0cd7ca496705';

select
  create_individual('d25d37a5-db22-48ab-a030-e3a349d35b77',
                    'ba9e67af-d911-4b91-81ca-993f3efae18d', 'A1', 'B1', 'precon-staging', null, current_date);

-- Create program enrolment for this individual. Notice uuid of individual is same as what is provided before.
select create_program_enrolment('1a057f2e-8311-42f0-bc8d-8b8821809783', 'Preconception ',
                                'd25d37a5-db22-48ab-a030-e3a349d35b77', 'precon-staging');

-- Create program encounter.
select create_program_encounter('139f5e4b-568d-4da0-808b-0cd7ca496705', '1a057f2e-8311-42f0-bc8d-8b8821809783',
                                'precon-staging', 'Outcome', '{
  "Last pregnancy outcome": "Live birth and Still birth"
}');

----------------------------------------------------------------------------------------------------
-- Verify abortion count = 1
----------------------------------------------------------------------------------------------------