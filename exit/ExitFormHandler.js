const _ = require("lodash");
import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';

const WithRegistrationStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');
const ExitViewFilter = RuleFactory("faa2020a-2554-46bb-a217-3fb30cd1f5c1", "ViewFilter");

@ExitViewFilter("8c6d6669-5a87-4539-bc2c-db200a54900c", "ExitFormHandler", 100.0, {})
class ExitFormHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new ExitFormHandler(), programEncounter, formElementGroup, today);
    }

    @WithRegistrationStatusBuilder
    reasonForLossToFollowup([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Reason for exit")
        .containsAnyAnswerConceptName("Loss to follow-up");
    }

    @WithRegistrationStatusBuilder
    ifAnyOtherSpecify([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Reason for loss to followup")
        .containsAnyAnswerConceptName("Other");
    }
   
}

module.exports = {ExitFormHandler};
