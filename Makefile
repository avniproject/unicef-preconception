
# <makefile>
# Objects: refdata, package
# Actions: clean, build, deploy
help:
	@IFS=$$'\n' ; \
	help_lines=(`fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//'`); \
	for help_line in $${help_lines[@]}; do \
	    IFS=$$'#' ; \
	    help_split=($$help_line) ; \
	    help_command=`echo $${help_split[0]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
	    help_info=`echo $${help_split[2]} | sed -e 's/^ *//' -e 's/ *$$//'` ; \
	    printf "%-30s %s\n" $$help_command $$help_info ; \
	done
# </makefile>

port:= $(if $(port),$(port),8021)
server:= $(if $(server),$(server),http://localhost)
server_url:=$(server):$(port)
su:=$(shell id -un)
org_name=UNICEF
org_admin_name=admin@unicef

poolId:=
clientId:=
username:=admin@unicef
password:=

auth:
	$(if $(poolId),$(eval token:=$(shell node scripts/token.js $(poolId) $(clientId) $(username) $(password))))
	@echo $(token)

auth_live:
	make auth poolId=$(OPENCHS_PROD_USER_POOL_ID) clientId=$(OPENCHS_PROD_APP_CLIENT_ID) username=admin@unicef password=$(password)

define _curl
	curl -X $(1) $(server_url)/$(2) -d $(3)  \
		-H "Content-Type: application/json"  \
		-H "USER-NAME: $(org_admin_name)"  \
		$(if $(token),-H "AUTH-TOKEN: $(token)",)
	@echo
	@echo
endef

define _curl_as_openchs
	curl -X $(1) $(server_url)/$(2) -d $(3)  \
		-H "Content-Type: application/json"  \
		-H "USER-NAME: admin"  \
		$(if $(token),-H "AUTH-TOKEN: $(token)",)
	@echo
	@echo
endef

define _curl_for_form_query_export
	@curl -X GET '$(server_url)/query/program/$(1)/encounter/$(2)'  \
		-H "Content-Type: application/json"  \
		-H "USER-NAME: $(org_admin_name)"  \
		$(if $(token),-H "AUTH-TOKEN: $(token)",)
	@echo
	@echo
endef


create_deploy: create_org deploy ##

# <create_org>
create_org:
	psql -U$(su) openchs < create_organisation.sql
# </create_org>

# <deploy>
deploy:create_admin_user_dev create_users_dev deploy_org_data deploy_refdata deploy_rules  

deploy_org_data:
	$(call _curl,POST,locations,@locations.json)
	$(call _curl,POST,catchments,@catchments.json)

create_admin_user_dev:
	$(call _curl_as_openchs,POST,users,@users/dev-admin-user.json)

create_users_dev:
	$(call _curl,POST,users,@users/dev-users.json)

deploy_subjects:
	$(call _curl,POST,operationalSubjectTypes,@operationalModules/operationalSubjectTypes.json)

deploy_refdata: deploy_subjects
	$(call _curl,POST,concepts,@registration/registrationConcepts.json)
	$(call _curl,POST,forms,@registration/registrationForm.json)

	$(call _curl,POST,concepts,@baseline/baselineConcepts.json)
	$(call _curl,POST,forms,@baseline/baselineForm.json)
	
	$(call _curl,POST,concepts,@visit/visitFormConcepts.json)
	$(call _curl,POST,forms,@visit/visitForm.json)


	$(call _curl,POST,concepts,@preconception/preconceptionConcepts.json)
	$(call _curl,POST,forms,@preconception/preconceptionProgramEnrolmentNullForm.json)

	$(call _curl,POST,programs,@programs.json)	
	$(call _curl,POST,encounterTypes,@encounterTypes.json)

	$(call _curl,POST,operationalPrograms,@operationalModules/operationalPrograms.json)
	$(call _curl,POST,operationalEncounterTypes,@operationalModules/operationalEncounterTypes.json)
	
	$(call _curl,POST,formMappings,@formMappings.json)

deploy_rules:
	node index.js "$(server_url)" "$(token)" "$(username)"
# </deploy>

deps:
	npm i
