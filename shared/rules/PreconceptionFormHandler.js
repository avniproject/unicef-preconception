import {
    RuleFactory,
    FormElementsStatusHelper,
    FormElementStatusBuilder,
    StatusBuilderAnnotationFactory,
    FormElementStatus,
    VisitScheduleBuilder,
    ProgramRule,
    RuleCondition
} from 'rules-config/rules';

import lib from '../../lib';

const validation = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'Validation');

@validation("85d7123b-fcd2-4a34-b579-cbe9dfe3e7d4", "Preconception Form Handler validation", 100.0)
class PreconceptionFormHandler {
    validate(programEnrolment) {
        const validationResults = [];
        if (programEnrolment.individual.isMale()) {
            validationResults.push(lib.C.createValidationError('maleEnrolmentToPreconceptionNotAllowed'));
        }
        return validationResults;
    }

    static exec(programEnrolment, validationErrors) {
        return new PreconceptionFormHandler().validate(programEnrolment);
    }
}


module.exports = {PreconceptionFormHandler};
