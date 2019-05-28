const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./baseline/BaselineFormHandler'),
    require('./visit1/Visit1FormHandler')
);