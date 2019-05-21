const {RuleFactory, 
    StatusBuilderAnnotationFactory,
   // FormElementStatusBuilder,
    FormElementStatus, 
    FormElementsStatusHelper} = require('rules-config/rules');
const RuleHelper = require('../general/RuleHelper');

const filter = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'ViewFilter');
//const BaseLineValidation = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'Validation');
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

    proteinRda(programEncounter, formElement) {
        return new FormElementStatus(formElement.uuid, true, 89);
        // let protienIntake = programEncounter.findObservation("Protein intake",programEncounter);       
        // return RuleHelper.createProtienRDAFormElementStatus(protienIntake, formElement);
    }
     
    calorieRda(programEncounter, formElement) {
        let calorieIntake = programEncounter.findObservation("Calorie intake",programEncounter);
        return RuleHelper.createProtienRDAFormElementStatus(calorieIntake,formElement);
     }
    
    @WithStatusBuilder
    totalNumberOfDeliveriesUndergone([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Gravida').greaterThan(0);
    }

    @WithStatusBuilder
    dateOfLastPregnancyOutcome([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Gravida').greaterThan(0);
    }

    @WithStatusBuilder
    lastPregnancyOutcome([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Gravida').greaterThan(0);
    }

    @WithStatusBuilder
    liveBirthBirthWeightInKg([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Last pregnancy outcome')
            .containsAnyAnswerConceptName('Live Birth');
    }

    @WithStatusBuilder
    inWhichMonthWasTheFoetusAbortedOrChildDelivered([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Last pregnancy outcome')
            .containsAnyAnswerConceptName('Live Birth','Early Neonatal death within first 24 Hours of birth');
    }

    @WithStatusBuilder
    doesChildHaveOrHadCongenitalAnomaly([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Last pregnancy outcome')
            .containsAnyAnswerConceptName('Live Birth','Still Birth');
    }

    @WithStatusBuilder
    ifYesSpecifyTheTypeOfAlochol([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Alcohol consumption')
            .containsAnyAnswerConceptName('Yes');
    }

    @WithStatusBuilder
    ifYesSpecifyTheTypeOfTabacco([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Tobacco consumption')
            .containsAnyAnswerConceptName('Yes');
    }

    // @WithStatusBuilder
    // lastPregnancyOutcome([], statusBuilder){
    //     statusBuilder.skipAnswers('Live Birth and Still Birth');
    // }

    // lastPregnancyOutcome(programEncounter, formElement) {
    //     let formElementStatusBuilder = new FormElementStatusBuilder({programEncounter, formElement});
    //     formElementStatusBuilder.skipAnswers('Live Birth and Still Birth');
    //     return formElementStatusBuilder.build();
    // }
    
}

// @BaseLineValidation("0c1347c6-f9cc-44dc-98de-fbf3f25d0211", "Baseline Form Validation", 100.0)
// class BaselineValidationHandler {
//     validate(programEncounter) {
//         const validationResults = [];

//         if (programEncounter.findObservation("Height") >200 ||  programEncounter.findObservation("Height") < 100){
//             validationResults.push(lib.C.createValidationError('Height should be within 100-200 cms'));
//         }

//         if (programEncounter.findObservation("Weight") < 25 ||  programEncounter.findObservation("Weight") > 100){
//             validationResults.push(lib.C.createValidationError('Weight should be within 25-100 cms'));
//         }


//         return validationResults;
//     }
//     static exec(programEncounter, validationErrors) {
//         return new BaselineValidationHandler().validate(programEncounter);
//     }
// }

const baselineDecision = RuleFactory("6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded", "Decision");

@baselineDecision("79ccee95-0c94-41f9-8fff-8f26bf14eddc", "Baseline Form decisions", 100.0, {})
class BaselineDecision {
    static highRisks(programEncounter) {
        const complicationsBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: 'High Risk Conditions'
        });

        complicationsBuilder.addComplication("High Risk Mother").when
        .valueInEncounter("BMI").lessThanOrEqualTo(18.5);
 
        complicationsBuilder.addComplication("High Risk Mother")
            .when.valueInEncounter("Parity").greaterThan(4);

        complicationsBuilder.addComplication("High Risk Mother")
            .when.valueInEncounter("Parity").lessThan(1)
            .and.when.ageInMonths.greaterThan(35);

        complicationsBuilder.addComplication('High Risk Mother')
            .when.valueInEncounter('Last pregnancy outcome')
            .containsAnyAnswerConceptName("Abortion", "Still Birth",
             "Early Neonatal death within first 24 Hours of birth");

        complicationsBuilder.addComplication('High Risk Mother')
            .when.valueInEncounter('Congenital anomalies')
            .containsAnyAnswerConceptName("Yes");

            
        complicationsBuilder.addComplication('High Risk Mother')
            .when.valueInEncounter('Tobacco consumption')
            .containsAnyAnswerConceptName("Yes");

        complicationsBuilder.addComplication('High Risk Mother')
            .when.valueInEncounter('Alcohol consumption')
            .containsAnyAnswerConceptName("Yes");

        complicationsBuilder.addComplication('High Risk Mother')
            .when.valueInEncounter('Alcohol consumption')
            .containsAnyAnswerConceptName("Yes");

        complicationsBuilder.addComplication('High Risk Mother')
            .when.valueInEncounter('Alcohol consumption')
            .containsAnyAnswerConceptName("Yes");



        return complicationsBuilder.getComplications();
    }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(BaselineDecision.highRisks(programEncounter));
        return decisions;
    }
}



module.exports = {BaselineFormHandler,  BaselineDecision};//BaselineValidationHandler