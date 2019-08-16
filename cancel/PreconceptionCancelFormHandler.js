import { FormElementsStatusHelper, RuleFactory, StatusBuilderAnnotationFactory } from 'rules-config/rules';
const filters = RuleFactory("52fe4628-ac8a-4d9a-aa96-967b3964be1c", "ViewFilter");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filters("3b1929a5-0bc0-4e61-aacf-b235824d1915", "PreconceptionCancelFormHandler", 120.0, {})
class PreconceptionCancelFormHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper.getFormElementsStatusesWithoutDefaults(new PreconceptionCancelFormHandler(), programEncounter, formElementGroup, today);
    }

    @WithStatusBuilder    
    nextMonthlyVisitDate([programEncounter], statusBuilder) {
        statusBuilder.show().when.valueInLastEncounter("Last pregnancy outcome",["Outcome"])
        .not.containsAnswerConceptName("Live Birth")
        .or.whenItem(programEncounter.programEnrolment.isActive).is.not.truthy;
    }
}

module.exports = {PreconceptionCancelFormHandler};
