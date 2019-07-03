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

---------------
set role none;