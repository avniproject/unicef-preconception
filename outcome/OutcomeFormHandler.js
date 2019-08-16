import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper
} from 'rules-config/rules';

const filter = RuleFactory('ceebf03d-5539-4f20-a49a-3ad12c4e98cc', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('3aa3d108-812c-4f2f-9166-5c4fd0f97a37', 'OutcomeFormHandler', 100.0)
class OutcomeFormHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new OutcomeFormHandler(), programEncounter, formElementGroup, today);
    }

    @WithStatusBuilder
    abortion([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Abortion");
    }
    
    @WithStatusBuilder
    gestationalAge([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Still Birth", "Live Birth", "Live birth and Still birth");
    }
    
    @WithStatusBuilder
    numberOfBabies([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Still Birth", "Live Birth", "Live birth and Still birth");
    }

    @WithStatusBuilder
    birthOutcomeOfBaby1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(1)
            .and.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live birth and Still birth");
    }

    @WithStatusBuilder
    genderOfBaby1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(1);
    }

    @WithStatusBuilder
    weightOfBaby1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(1);
    } 

    @WithStatusBuilder
    lengthOfBaby1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(1);
    } 

    @WithStatusBuilder
    congenitalAnomalyOfBaby1([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(1);
    }

    @WithStatusBuilder
    birthOutcomeOfBaby2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(2)
            .and.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live birth and Still birth");
    }

    @WithStatusBuilder
    genderOfBaby2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(2);
    }

    @WithStatusBuilder
    weightOfBaby2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(2);
    }

    @WithStatusBuilder
    lengthOfBaby2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(2);
    }

    @WithStatusBuilder
    congenitalAnomalyOfBaby2([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(2);
    }

    @WithStatusBuilder
    birthOutcomeOfBaby3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(3)
            .and.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live birth and Still birth");
    }

    @WithStatusBuilder
    genderOfBaby3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(3);
    }

    @WithStatusBuilder
    weightOfBaby3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(3);
    }

    @WithStatusBuilder
    lengthOfBaby3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(3);
    }

    @WithStatusBuilder
    congenitalAnomalyOfBaby3([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Number of babies").is.greaterThanOrEqualTo(3);
    }

    @WithStatusBuilder
    followUpOfNeonatalPeriod([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live Birth");
    } 

    @WithStatusBuilder
    childAliveTill28thDay([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Follow-up of neonatal period").containsAnyAnswerConceptName("Yes", "Partial");
    }

    @WithStatusBuilder
    neonatalDeath([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Child alive till 28th day").is.no;
    }

    @WithStatusBuilder
    motherAliveTill28thDay([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Follow-up of neonatal period").containsAnyAnswerConceptName("Yes", "Partial");
    }

    @WithStatusBuilder
    maternalDeath([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Mother alive till 28th day").is.no;
    }

    @WithStatusBuilder
    nextMonthlyVisitDate([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Abortion","Still Birth");
    } 

    
    @WithStatusBuilder
    eventPregnancyOutcome([], statusBuilder) {
        statusBuilder.skipAnswers("Don't know", "Early Neonatal death within first 24 Hours of birth");
    } 
}


module.exports = {OutcomeFormHandler};
