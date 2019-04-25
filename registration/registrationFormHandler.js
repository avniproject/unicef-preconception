import lib from '../lib';
import {
    StatusBuilderAnnotationFactory, 
    RuleFactory, 
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';

const WithRegistrationStatusBuilder = StatusBuilderAnnotationFactory('individual', 'formElement');
const RegistrationViewFilter = RuleFactory("173abccc-2c3e-451e-a77e-524b28c4a224", "ViewFilter");
const RegistrationDecisionRule = RuleFactory("173abccc-2c3e-451e-a77e-524b28c4a224", "Decision");



@RegistrationViewFilter("9452f291-431b-4040-b8d5-28b20bb798f8", "Preconception Registration View Filter", 100.0, {})
class PreconceptionRegistrationViewHandler {
    static exec(individual, formElementGroup) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new PreconceptionRegistrationViewHandler(), individual, formElementGroup);
    }

    
}

@RegistrationDecisionRule("1b29c5b0-0080-4124-b137-898f6ad3d0d6", "Preconception Decision", 100.0, {})
class PreconceptionRegistrationDecisions {
    static exec(programEncounter, decisions, context, today) {
        const highRiskBuilder = new ComplicationsBuilder({
            programEnrolment: programEncounter.programEnrolment,
            programEncounter: programEncounter,
            complicationsConcept: 'High Risk Conditions'
        });

      
        const consanguineousMarriage = (programEncounter) => {
            //return programEncounter.getObservationValue('Did you marry within relation?');
           return programEnrolment.formElementGroup("Consanguineous marriage").value;
        };

        highRiskBuilder.addComplication("Consanguineous marriage")
            .whenItem(consanguineousMarriage).is.equals("Yes");

        let consanguineousMarriageHighRisk = highRiskBuilder.getComplications();
        let highRiskConditions = lib.C.findValue(decisions['encounterDecisions'], 'High Risk Conditions');
        [].push.apply(highRiskConditions,consanguineousMarriageHighRisk.value);


return decisions;
}
}


module.exports = {PreconceptionRegistrationViewHandler,PreconceptionRegistrationDecisions};

