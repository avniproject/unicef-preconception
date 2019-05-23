import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';
import lib from '../lib';
const RuleHelper = require('../general/RuleHelper');


const filter = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'ViewFilter');
const BaseLineValidation = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'Validation');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');
const baselineDecision = RuleFactory("6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded", "Decision");

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
        let protienIntake = programEncounter.findObservation("Protein intake",programEncounter);       
        return RuleHelper.createProtienRDAFormElementStatus(protienIntake, formElement);
    }
     
    calorieRda(programEncounter, formElement) {
        let calorieIntake = programEncounter.findObservation("Calorie intake",programEncounter);
        return RuleHelper.createCalorieRDAFormElementStatus(calorieIntake,formElement);
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

    @WithStatusBuilder
    preconceptionBaselineAdviceForDiet([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("BMI").lessThan(18.5)
        .or.when.valueInEncounter("BMI").greaterThan(25);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForParity([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Parity").greaterThan(4);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForParityAndAge([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Parity").lessThan(1)
        .and.when.ageInMonths.greaterThan(35);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForOtherThanLiveBirth([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Last pregnancy outcome')
        .containsAnyAnswerConceptName("Abortion", "Still Birth",
         "Early Neonatal death within first 24 Hours of birth");
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForCongenitalAnomalies([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Congenital anomalies')
        .containsAnyAnswerConceptName("Yes");
    }
     
    @WithStatusBuilder
    preconceptionBaselineCounsellingForAlcoholConsumption([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Alcohol consumption')
        .containsAnyAnswerConceptName("Yes");
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForTobaccoConsumption([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Tobacco consumption')
        .containsAnyAnswerConceptName("Yes");
    }
    
    @WithStatusBuilder
    preconceptionBaselineCounsellingForCalorieIntake([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Calorie % RDA')
        .lessThan(70);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForProteinIntake([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Protein % RDA')
        .lessThan(70);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForChildSpacing([programEncounter],statusBuilder) {
        let lastPregnancyOutcomeDate = programEncounter.findObservation("Date of last pregnancy outcome",programEncounter);
        let validationDate = new Date(2016,3,1);
        statusBuilder.show().whenItem(RuleHelper.dateAIsAfterB(lastPregnancyOutcomeDate, validationDate)).is.truthy;
    }

    // @WithStatusBuilder
    // lastPregnancyOutcome([], statusBuilder){
    //     statusBuilder.skipAnswers('Live Birth and Still Birth');
    // }
}

@BaseLineValidation("0c1347c6-f9cc-44dc-98de-fbf3f25d0211", "Baseline Form Validation", 100.0)
class BaselineValidationHandler {
    validate(programEncounter) {
        const validationResults = [];
        let height = programEncounter.findObservation("Height", programEncounter);
        let weight = programEncounter.findObservation("Weight");

        if (height.getValue() >200 ||  height.getValue() < 100){
            validationResults.push(lib.C.createValidationError('Height should be within 100-200 cms'));
        }

        if (weight.getValue() < 25 ||  weight.getValue() > 100){
            validationResults.push(lib.C.createValidationError('Weight should be within 25-100 kg'));
        }


        return validationResults;
    }
    static exec(programEncounter, validationErrors) {
        return new BaselineValidationHandler().validate(programEncounter);
    }
}

@baselineDecision("79ccee95-0c94-41f9-8fff-8f26bf14eddc", "Baseline Form decisions", 100.0, {})
class BaselineDecision {
    static highRisks(programEncounter) {
        let lastPregnancyOutcomeDate = programEncounter.findObservation("Date of last pregnancy outcome",programEncounter);
        let validationDate = new Date(2016,3,1);

        const complicationsBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: 'High Risk Mother'
        });

        complicationsBuilder.addComplication("BMI")
        .when.valueInEncounter("BMI").lessThan(18.5)
        .or.when.valueInEncounter("BMI").greaterThan(25);
 
        complicationsBuilder.addComplication("Parity")
            .when.valueInEncounter("Parity").greaterThan(4);

        complicationsBuilder.addComplication("Parity")
            .when.valueInEncounter("Parity").lessThan(1)
            .and.when.ageInMonths.greaterThan(35);

        complicationsBuilder.addComplication('Last pregnancy outcome')
            .when.valueInEncounter('Last pregnancy outcome')
            .containsAnyAnswerConceptName("Abortion", "Still Birth",
             "Early Neonatal death within first 24 Hours of birth");

        complicationsBuilder.addComplication('Congenital anomalies')
            .when.valueInEncounter('Congenital anomalies')
            .containsAnyAnswerConceptName("Yes");

            
        complicationsBuilder.addComplication('Tobacco consumption')
            .when.valueInEncounter('Tobacco consumption')
            .containsAnyAnswerConceptName("Yes");

        complicationsBuilder.addComplication('Alcohol consumption')
            .when.valueInEncounter('Alcohol consumption')
            .containsAnyAnswerConceptName("Yes");

        complicationsBuilder.addComplication('Calorie % RDA')
            .when.valueInEncounter('Calorie % RDA')
            .lessThan(70);

        complicationsBuilder.addComplication('Protein % RDA')
            .when.valueInEncounter('Protein % RDA')
            .lessThan(70);
            
        complicationsBuilder.addComplication('Child born after March 2016')
             .whenItem(RuleHelper.dateAIsAfterB(lastPregnancyOutcomeDate, validationDate)).is.truthy;
 
  
        return complicationsBuilder.getComplications();
    }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(BaselineDecision.highRisks(programEncounter));
        return decisions;
    }
}



module.exports = {BaselineFormHandler, BaselineValidationHandler, BaselineDecision};