const rulesConfigInfra = require('rules-config/infra');
const IDI = require('openchs-idi');
const secrets = require('../secrets.json');

module.exports = IDI.configure({
    "chs-admin": "admin",
    "org-admin": "admin@unicef",
    "secrets": secrets,
    "files": {
        "adminUsers": {
            // "prod": [],
            "dev": ["./users/dev-admin-user.json"],
            "staging": ["./users/dev-admin-user.json"],
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
        "catchments": ["./shared/catchments.json"],
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
            "locations/blocks.json",
            "locations/phcs.json",
            "locations/subcenters.json",
            "locations/villages.json",
            "locations/wadis.json",
        ],
        "programs": ["./shared/programs.json"],
        "encounterTypes": ["./shared/encounterTypes.json"],
        "operationalEncounterTypes": ["./operationalModules/operationalEncounterTypes.json"],
        "operationalPrograms": ["./operationalModules/operationalPrograms.json"],
        "operationalSubjectTypes": ["./operationalModules/operationalSubjectTypes.json"],
        "users": {
            "dev": ["./users/dev-users.json"],
            "staging": ["./users/staging-users.json"],
        },
        "rules": [
            "./shared/rules/index.js",
        ],
        "organisationSql": [],
    }
}, rulesConfigInfra);
