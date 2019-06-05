const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./baseline/BaselineFormHandler'),
    require('./visit1/Visit1FormHandler'),
    require('./monthlyMonitoring/MonthlyMonitoringHandler'),
    require('./outcome/OutcomeFormHandler'),
    require('./exit/ExitFormHandler'),
    require('./cancel/PreconceptionCancelFormHandler')
);