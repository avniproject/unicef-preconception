import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';
import RuleHelper from "../shared/rules/RuleHelper";

const filter = RuleFactory('6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEnrolment', 'formElement');
const baselineDecision = RuleFactory("6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded", "Decision");

@filter('85e40848-141e-4957-9fa7-dc17e3c3ea52', 'Baseline View Handler', 100.0)
class BaselineFormHandler {
    static exec(programEnrolment, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new BaselineFormHandler(), programEnrolment, formElementGroup, today);
    }

    bmi(programEnrolment, formElement) {
        let height = programEnrolment.findObservation("Preconception Height", programEnrolment);
        let weight = programEnrolment.findObservation("Preconception Weight");
        return RuleHelper.createBMIFormElementStatus(height, weight, formElement);
    } 

    proteinRda(programEnrolment, formElement) {
        let protienIntake = programEnrolment.findObservation("Protein intake",programEnrolment);       
        return RuleHelper.createProtienRDAFormElementStatus(protienIntake, formElement);
    }
     
    calorieRda(programEnrolment, formElement) {
        let calorieIntake = programEnrolment.findObservation("Calorie intake",programEnrolment);
        return RuleHelper.createCalorieRDAFormElementStatus(calorieIntake,formElement);
     }
    
    @WithStatusBuilder
    totalNumberOfDeliveriesUndergone([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Gravida').greaterThan(0);
    }

    @WithStatusBuilder
    dateOfLastPregnancyOutcome([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Gravida').greaterThan(0);
    }

    @WithStatusBuilder
    lastPregnancyOutcome([], statusBuilder) {
        statusBuilder.skipAnswers("Don't know","Live birth and Still birth");
        statusBuilder.show().when.valueInEnrolment('Gravida').greaterThan(0);
    }

    @WithStatusBuilder
    liveBirthBirthWeightInKg([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Last pregnancy outcome')
            .containsAnyAnswerConceptName('Live Birth');
    }

    @WithStatusBuilder
    inWhichMonthWasTheFoetusAbortedOrChildDelivered([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Gravida').greaterThan(0);
    }

    @WithStatusBuilder
    doesChildHaveOrHadCongenitalAnomaly([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Last pregnancy outcome')
            .containsAnyAnswerConceptName('Live Birth','Still Birth');
    }

    @WithStatusBuilder
    ifYesSpecifyTheTypeOfAlochol([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Whether consumes alcohol')
            .containsAnyAnswerConceptName('Yes');
    }

    @WithStatusBuilder
    ifYesSpecifyTheTypeOfTabacco([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Whether consumes tobacco')
            .containsAnyAnswerConceptName('Yes');
    }

    @WithStatusBuilder
    preconceptionBaselineAdviceForDiet([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("BMI").lessThan(18.5)
        .or.when.valueInEnrolment("BMI").greaterThan(25);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForParity([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Parity").greaterThan(4);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForParityAndAge([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment("Parity").lessThan(1)
        .and.when.ageInMonths.greaterThan(35);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForOtherThanLiveBirth([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Last pregnancy outcome')
        .containsAnyAnswerConceptName("Abortion", "Still Birth",
         "Early Neonatal death within first 24 Hours of birth");
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForCongenitalAnomalies([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Congenital anomalies')
        .containsAnyAnswerConceptName("Yes");
    }
     
    @WithStatusBuilder
    preconceptionBaselineCounsellingForAlcoholConsumption([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Whether consumes alcohol')
        .containsAnyAnswerConceptName("Yes");
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForTobaccoConsumption([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Whether consumes tobacco')
        .containsAnyAnswerConceptName("Yes");
    }
    
    @WithStatusBuilder
    preconceptionBaselineCounsellingForCalorieIntake([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Calorie % RDA')
        .lessThan(70);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForProteinIntake([], statusBuilder) {
        statusBuilder.show().when.valueInEnrolment('Protein % RDA')
        .lessThan(70);
    }

    @WithStatusBuilder
    preconceptionBaselineCounsellingForChildSpacing([programEnrolment],statusBuilder) {
        let lastPregnancyOutcomeDate = programEnrolment.findObservation("Date of last pregnancy outcome",programEnrolment);
        let validationDate = new Date(2016,3,1);
        statusBuilder.show().whenItem(RuleHelper.dateAIsAfterB(lastPregnancyOutcomeDate, validationDate)).is.truthy;
    }

    // @WithStatusBuilder
    // resultOfLastPregnancyOutcome([], statusBuilder) {
    //     statusBuilder.skipAnswers("Don't know","Live birth and Still birth");
    // } 
}

@baselineDecision("79ccee95-0c94-41f9-8fff-8f26bf14eddc", "Baseline Form decisions", 100.0, {})
class BaselineDecision {
    static highRisks(programEnrolment) {
        let lastPregnancyOutcomeDate = programEnrolment.findObservation("Date of last pregnancy outcome",programEnrolment);
        let validationDate = new Date(2016,3,1);

        const complicationsBuilder = new ComplicationsBuilder({
            programEnrolment: programEnrolment,
            complicationsConcept: 'High Risk Mother'
        });

        complicationsBuilder.addComplication("Low BMI")
        .when.valueInEnrolment("BMI").lessThan(18.5);

        complicationsBuilder.addComplication("High BMI")
        .when.valueInEnrolment("BMI").greaterThan(25);
 
        complicationsBuilder.addComplication("Parity > 4")
            .when.valueInEnrolment("Parity").greaterThan(4);

        complicationsBuilder.addComplication("Parity is 0 & age> 35")
            .when.valueInEnrolment("Parity").lessThan(1)
            .and.when.ageInMonths.greaterThan(35);

        complicationsBuilder.addComplication('Last pregnancy outcome')
            .when.valueInEnrolment('Last pregnancy outcome')
            .containsAnyAnswerConceptName("Abortion", "Still Birth",
             "Early Neonatal death within first 24 Hours of birth");

        complicationsBuilder.addComplication('Congenital anomalies')
            .when.valueInEnrolment('Congenital anomalies')
            .containsAnyAnswerConceptName("Yes");
            
        complicationsBuilder.addComplication('Whether consumes tobacco')
            .when.valueInEnrolment('Whether consumes tobacco')
            .containsAnyAnswerConceptName("Yes");

        complicationsBuilder.addComplication('Whether consumes alcohol')
            .when.valueInEnrolment('Whether consumes alcohol')
            .containsAnyAnswerConceptName("Yes");

        complicationsBuilder.addComplication('Low Calorie intake')
            .when.valueInEnrolment('Calorie % RDA')
            .lessThan(70);

        complicationsBuilder.addComplication('Low Protein intake')
            .when.valueInEnrolment('Protein % RDA')
            .lessThan(70);
            
        complicationsBuilder.addComplication('Last Outcome after March 2016')
             .whenItem(RuleHelper.dateAIsAfterB(lastPregnancyOutcomeDate, validationDate)).is.truthy;
 
  
        return complicationsBuilder.getComplications();
    }

    static exec(programEnrolment, decisions, context, today) {
        decisions.enrolmentDecisions.push(BaselineDecision.highRisks(programEnrolment));
        return decisions;
    }
}



module.exports = {BaselineFormHandler,  BaselineDecision};
