const _ = require('lodash');

module.exports = _.merge({},
    require('./registration/registrationFormHandler'),
    require('./baseline/BaselineFormHandler'),
);