const {RuleFactory, StatusBuilderAnnotationFactory,FormElementStatusBuilder, FormElementsStatusHelper} = require('rules-config/rules');
const RuleHelper = require('../general/RuleHelper');

const filter = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'ViewFilter');
const BaseLineValidation = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'Validation');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');


@filter('85e40848-141e-4957-9fa7-dc17e3c3ea52', 'Baseline View Handler', 100.0)
class BaselineFormHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new BaselineFormHandler(), programEncounter, formElementGroup, today);
    }

    bmi(programEncounter, formElement) {
        let height = programEncounter.findObservation("Height", programEncounter);
        let weight = programEncounter.findObservation("Weight");
        return RuleHelper.createBMIFormElementStatus(height, weight, formElement);
    }

    // @WithStatusBuilder
    // lastPregnancyOutcome([], statusBuilder){
    //     statusBuilder.skipAnswers('Live Birth and Still Birth');
    // }
    
    @WithStatusBuilder
    totalNumberOfDeliveriesUndergone([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Total number of conceptions').is.greaterThanOrEqualTo(0);
    }

    _statusBuilder(programEncounter, formElement) {
        return new FormElementStatusBuilder({
            programEncounter: programEncounter,
            formElement: formElement
        });
    }
}

@BaseLineValidation("0c1347c6-f9cc-44dc-98de-fbf3f25d0211", "Baseline Form Validation", 100.0)
class BaselineValidationHandler {
    validate(programEncounter) {
        const validationResults = [];

        if (programEncounter.findObservation("Height") >200 ||  programEncounter.findObservation("Height") < 100){
            validationResults.push(lib.C.createValidationError('Height should be within 100-200 cms'));
        }


        return validationResults;
    }
    static exec(programEncounter, validationErrors) {
        return new BaselineValidationHandler().validate(programEncounter);
    }
}

module.exports = {BaselineFormHandler, BaselineValidationHandler};