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

----------------------------------------------------------------------------------------------------
-- 2. Check if pregnancy outcome of still Birth shows up on the report.
--    Given an individual who has a pregnancy outcome of Still birth, the still birth count should increase by 1.
----------------------------------------------------------------------------------------------------
-- Create an individual. Note that there are a lot of optional fields that have been left blank.

select
  create_individual('f9cea0b4-d034-4dbd-a37f-1a11a9ee5074',
                    '024ac6d2-c297-4fd9-b06d-22547b4a6eb2', 'test', 'still birth', 'precon-staging', null, current_date);

-- Create program enrolment for this individual. Notice uuid of individual is same as what is provided before.
select create_program_enrolment('878f0884-6d40-4ee2-ab38-7ff157b7cd6a', 'Preconception ',
                                'f9cea0b4-d034-4dbd-a37f-1a11a9ee5074', 'precon-staging');

-- Create program encounter.
select create_program_encounter('e41d8e54-49e5-4a5d-b1d9-6084fce8faf2', '878f0884-6d40-4ee2-ab38-7ff157b7cd6a',
                                'precon-staging', 'Outcome', '{
  "Last pregnancy outcome": "Still Birth"
}');


----------------------------------------------------------------------------------------------------
-- Verify still birth count = 1
----------------------------------------------------------------------------------------------------

-- 2.1. Ensure voided individuals don't show up
update individual set is_voided = true where uuid = 'f9cea0b4-d034-4dbd-a37f-1a11a9ee5074';

----------------------------------------------------------------------------------------------------
-- Verify still birth count = 0
----------------------------------------------------------------------------------------------------
-- 2.2. Ensure voided program enrolments don't show up
update individual set is_voided = false where uuid = 'f9cea0b4-d034-4dbd-a37f-1a11a9ee5074';

update program_enrolment set is_voided = true where uuid = '878f0884-6d40-4ee2-ab38-7ff157b7cd6a';

----------------------------------------------------------------------------------------------------
-- Verify still birth count = 0
----------------------------------------------------------------------------------------------------
-- 2.3. Ensure voided program enrolments don't show up
update program_enrolment set is_voided = false where uuid = '878f0884-6d40-4ee2-ab38-7ff157b7cd6a';

update program_encounter set is_voided = true where uuid = 'e41d8e54-49e5-4a5d-b1d9-6084fce8faf2';

----------------------------------------------------------------------------------------------------
-- Verify still birth count = 0
----------------------------------------------------------------------------------------------------
-- 2.4. Pregnancy outcome not present when question is answered other than Still Birth
update program_encounter set is_voided = false where uuid = 'e41d8e54-49e5-4a5d-b1d9-6084fce8faf2';

select
  create_individual('53d9e24e-a6a9-4f8c-8586-adb6e27dd4bf',
                    '024ac6d2-c297-4fd9-b06d-22547b4a6eb2', 'test', 'non-stillbirth', 'precon-staging', null, '1995-01-01');

-- Create program enrolment for this individual. Notice uuid of individual is same as what is provided before.
select create_program_enrolment('e668be3d-783a-4e65-bd8e-ed293c1cdddb', 'Preconception ',
                                '53d9e24e-a6a9-4f8c-8586-adb6e27dd4bf', 'precon-staging');

-- Create program encounter.
select create_program_encounter('49fad06d-48ee-4305-a74a-e69c68a9fb8f', 'e668be3d-783a-4e65-bd8e-ed293c1cdddb',
                                'precon-staging', 'Outcome', '{
  "Last pregnancy outcome": "Live Birth"
}');
----------------------------------------------------------------------------------------------------
-- Verify still birth count = 0 and Live Birth = 1
----------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------
-- 3. Check Early neonatal death/Late neonatal death shows up on the report.
--    Given an individual who has a pregnancy outcome of live birth and neonatal death, the Early/Late neonatal death count should increase by 1.
----------------------------------------------------------------------------------------------------
-- Create an individual. Note that there are a lot of optional fields that have been left blank.

select
  create_individual('bdaef009-9c13-4e6b-af1b-c62187e1ebe5',
                    '458da2c1-0252-46d9-8d74-29ec4d548b4f', 'Meera', 'Jahan', 'precon-staging', null, '1993-02-16');

-- Create program enrolment for this individual. Notice uuid of individual is same as what is provided before.
select create_program_enrolment('aaecc01d-8ba5-42e3-a359-3378c8c8ea21', 'Preconception ',
                                'bdaef009-9c13-4e6b-af1b-c62187e1ebe5', 'precon-staging');

-- Create program encounter with late neonalat death
select create_program_encounter('cc5bb74b-70fe-4aa7-a037-7b6eb5e6176e', 'aaecc01d-8ba5-42e3-a359-3378c8c8ea21',
                                'precon-staging', 'Outcome', '{
  "Last pregnancy outcome": "Live Birth",
  "Follow-up of neonatal period": "Partial",
  "Child aive till 28th day": "NO",
  "Neonatal death": 12
}');


-- Create program encounter with early neonalat death
select create_program_encounter('cc5bb74c-71fe-4aa7-a037-7b6eb5e6176e', 'aaecc01d-8ba5-42e3-a359-3378c8c8ea21',
                                'precon-staging', 'Outcome', '{
  "Last pregnancy outcome": "Live Birth",
  "Follow-up of neonatal period": "YES",
  "Child alive till 28th day": "NO",
  "Neonatal death": 5
}');

----------------------------------------------------------------------------------------------------
-- Verify neonatal death count = 1
----------------------------------------------------------------------------------------------------

-- 3.1. Ensure voided individuals don't show up
update individual set is_voided = true where uuid = 'bdaef009-9c13-4e6b-af1b-c62187e1ebe5';

----------------------------------------------------------------------------------------------------
-- Verify neonatal death count = 0
----------------------------------------------------------------------------------------------------
-- 3.2. Ensure voided program enrolments don't show up
update individual set is_voided = false where uuid = 'bdaef009-9c13-4e6b-af1b-c62187e1ebe5';

update program_enrolment set is_voided = true where uuid = 'aaecc01d-8ba5-42e3-a359-3378c8c8ea21';


----------------------------------------------------------------------------------------------------
-- Verify neonatal death count = 0
----------------------------------------------------------------------------------------------------
-- 3.3. Pregnancy outcome is answered other than not neonatal death
update program_enrolment set is_voided = false where uuid = 'aaecc01d-8ba5-42e3-a359-3378c8c8ea21';

select
  create_individual('6c8262d3-d487-47e9-9c96-77dc41ea1bde',
                    'f6e00e7e-8574-42d5-abad-621271aceb63', 'Jeevan', 'lastname', 'precon-staging', null, '1995-01-01');

-- Create program enrolment for this individual. Notice uuid of individual is same as what is provided before.
select create_program_enrolment('a3855a32-c918-4083-b852-9c3d6e43f3cf', 'Preconception ',
                                '6c8262d3-d487-47e9-9c96-77dc41ea1bde', 'precon-staging');

-- Create program encounter.
select create_program_encounter('3db649d0-f97d-31fe-81d3-e7e9aa8bbb1b', 'a3855a32-c918-4083-b852-9c3d6e43f3cf',
                                'precon-staging', 'Outcome', '{
"Last pregnancy outcome": "Live Birth", 
"Follow-up of neonatal period": "NO" 
}');
----------------------------------------------------------------------------------------------------
-- Verify Early/Late neonatal death count = 0
----------------------------------------------------------------------------------------------------
