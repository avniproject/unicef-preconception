import { FormElementsStatusHelper, RuleFactory, FormElementStatus } from 'rules-config/rules';
import _ from 'lodash';
const filters = RuleFactory("52fe4628-ac8a-4d9a-aa96-967b3964be1c", "ViewFilter");

@filters("3b1929a5-0bc0-4e61-aacf-b235824d1915", "PreconceptionCancelFormHandler", 120.0, {})
class PreconceptionCancelFormHandler {

    // otherReason(programEncounter, formElement) {
    //     const cancelReasonObs = programEncounter.findCancelEncounterObservation('Visit cancel reason');
    //     const answer = cancelReasonObs && cancelReasonObs.getReadableValue();
    //     return new FormElementStatus(formElement.uuid, answer === 'Other');
    // }

    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper.getFormElementsStatusesWithoutDefaults(new PreconceptionCancelFormHandler(), programEncounter, formElementGroup, today);
    }
}

module.exports = {PreconceptionCancelFormHandler};
