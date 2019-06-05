const _ = require("lodash");
import {
    RuleFactory,  
    FormElementsStatusHelper,
    FormElementStatusBuilder
} from 'rules-config/rules';

const ExitViewFilter = RuleFactory("c2efa6fd-32a4-49de-8d5a-c2bd3db43789", "ViewFilter");

@ExitViewFilter("8c6d6669-5a87-4539-bc2c-db200a54900c", "ExitFormHandler", 100.0, {})
class ExitFormHandler {
    static exec(programEnrolment, formElementGroup, today) {
        return FormElementsStatusHelper
        .getFormElementsStatuses(new ExitFormHandler(), programEnrolment, formElementGroup)
    }

    _getStatusBuilder(programExit, formElement) {
        return new FormElementStatusBuilder({
            programEnrolment: programExit,
            formElement
        });
    }
    
    reasonForExit(programExit, formElement) {
        const statusBuilder = this._getStatusBuilder(programExit, formElement);
        statusBuilder.skipAnswers('Shifted to other geographical area','Death','Completion','Other');
        return statusBuilder.build();
    }
    
    reasonForLossToFollowUp(programExit, formElement) {
        const statusBuilder = this._getStatusBuilder(programExit, formElement);
        statusBuilder.show().when.valueInExit("Reason for exit")
        .containsAnyAnswerConceptName("Loss to follow-up");       
        return statusBuilder.build();
    }
    
    ifAnyOtherReasonSpecify(programExit, formElement) {
        const statusBuilder = this._getStatusBuilder(programExit, formElement);
        statusBuilder.show().when.valueInExit("Reason for loss to followup")
        .containsAnyAnswerConceptName("Other");        
        return statusBuilder.build();
    }
   
}

module.exports = {ExitFormHandler};
