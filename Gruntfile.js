const rulesConfigInfra = require('rules-config/infra');
const IDI = require('openchs-idi');
const secrets = require('../secrets.json');

module.exports = IDI.configure({
    "name": "unicef",
    "chs-admin": "admin",
    "org-name": "UNICEF",
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
        "formMappings": ["./formMappings.json"],
        "formDeletions": [],
        "formAdditions": [],
        "catchments": ["./catchments.json"],
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
            "./locations.json",
        ],
        "programs": ["./programs.json"],
        "encounterTypes": ["./encounterTypes.json"],
        "operationalEncounterTypes": ["./operationalModules/operationalEncounterTypes.json"],
        "operationalPrograms": ["./operationalModules/operationalPrograms.json"],
        "operationalSubjectTypes": ["operationalSubjectTypes.json"],
        "users": {
            "dev": ["./users/dev-users.json"],
            "staging": ["./users/staging-users.json"],
        },
        "rules": [
            "./rules.js",
        ],
        "organisationSql": [
            /* "create_organisation.sql"*/
        ]
    }
}, rulesConfigInfra);
