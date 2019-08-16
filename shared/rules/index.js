const _ = require('lodash');

module.exports = _.merge({},
    require('../../registration/registrationFormHandler'),
    require('../../baseline/BaselineFormHandler'),
    require('../../visit1/Visit1FormHandler'),
    require('../../monthlyMonitoring/viewFilters'),
    require('../../monthlyMonitoring/decisions'),
    require('../../outcome/OutcomeFormHandler'),
    require('../../exit/PreconceptionExitFormHandler'),
    require('../../cancel/PreconceptionCancelFormHandler'),
    require('./visitScheduler'),
    require('../../baseline/programSummary'),
    require('./PreconceptionFormHandler'),
    require('../../shared/rules/eligibilityCheck.js')
);
