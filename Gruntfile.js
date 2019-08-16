const rulesConfigInfra = require('rules-config/infra');
const IDI = require('openchs-idi');

module.exports = IDI.configure({
    "chs-admin": "admin",
    "org-admin": {
        "dev": "admin@unicef",
        "uat": "admin@unicef",
        "staging": "admin@unicef",
        "prerelease": "admin@unicef",
        "prod": "admin@precon",
    },
    //Do not update the following line. Create a secrets file in the parent directory
    "secrets": '../secrets.json',
    "files": {
        "adminUsers": {
            // "prod": ["./prod-admin.json"],
            "dev": ["./users/dev-admin-user.json"],
            "staging": ["./users/dev-admin-user.json"],
            "uat": ["./users/dev-admin-user.json"],
            "prerelease": ["./users/dev-admin-user.json"],
        },
        "forms": [
            "./registration/registrationForm.json",
            "./baseline/baselineForm.json",
            "./visit1/visitForm.json",
            "./monthlyMonitoring/monthlyMonitoringForm.json",
            "./outcome/outcomeForm.json",
            "./cancel/preconceptionCancelForm.json",
            "./exit/exitForm.json"
        ],
        "formMappings": ["./shared/formMappings.json"],
        "formDeletions": [],
        "formAdditions": [],
        "catchments": {
            "dev": ["./shared/catchments.json"],
        },
        "checklistDetails": [],
        "concepts": [
            "./registration/registrationConcepts.json",
            "./baseline/baselineConcepts.json",
            "./visit1/visitFormConcepts.json",
            "./monthlyMonitoring/monthlyMonitoringConcepts.json",
            "./outcome/outcomeConcepts.json",
            "./cancel/preconceptionCancelConcepts.json",
            "./exit/exitFormConcepts.json"
        ],
        "locations": [
        ],
        "programs": ["./shared/programs.json"],
        "encounterTypes": ["./shared/encounterTypes.json"],
        "operationalEncounterTypes": ["./operationalModules/operationalEncounterTypes.json"],
        "operationalPrograms": ["./operationalModules/operationalPrograms.json"],
        "operationalSubjectTypes": ["./operationalModules/operationalSubjectTypes.json"],
        "users": {
            "dev": [
                "./users/dev-users.json",
                "./users/data-importer-user.json",
            ],
            "staging": ["./users/staging-users.json"],
            "uat": ["./users/uat-users.json"],
            "prerelease": ["./users/precon-users.json"]
        },
        "rules": [
            "./shared/rules/index.js",
        ],
        "organisationSql": [],
    }
}, rulesConfigInfra);
