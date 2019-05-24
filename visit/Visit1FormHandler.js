const {RuleFactory, FormElementStatusBuilder, FormElementsStatusHelper} = require('rules-config/rules');
const filter = RuleFactory('formUuid', 'ViewFilter');
const RuleHelper = require('RuleHelper');

@filter('uuid', 'Skip logic for ', 100.0)
class Visit1FormHandler {
    static exec(programXXX, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new Visit1FormHandler(), programXXX, formElementGroup, today);
    }
}

module.exports = Visit1FormHandler;