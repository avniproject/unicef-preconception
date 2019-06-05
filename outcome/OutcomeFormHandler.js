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
    stillBirth([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Still Birth");
    } 

    @WithStatusBuilder
    weight([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live Birth");
    } 

    @WithStatusBuilder
    length([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live Birth");
    } 

    
    @WithStatusBuilder
    gestationalAge([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live Birth");
    } 

    @WithStatusBuilder
    congenitalAnomaly([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live Birth");
    } 

    @WithStatusBuilder
    followUpOfNeonatalPeriod([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Live Birth");
    } 

    
    @WithStatusBuilder
    neonatalDeath([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Follow-up of neonatal period").is.no;
    } 

    @WithStatusBuilder
    nextMonthlyVisitDate([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Last pregnancy outcome").containsAnyAnswerConceptName("Abortion","Still Birth");
    } 

    
    @WithStatusBuilder
    eventPregnancyOutcome([], statusBuilder) {
        statusBuilder.skipAnswers("Don't know","Live birth and Still birth", "Early Neonatal death within first 24 Hours of birth");
    } 
}


module.exports = {OutcomeFormHandler};