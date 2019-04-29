import lib from '../lib';
const _ = require("lodash");
const moment = require("moment");
import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';

const WithRegistrationStatusBuilder = StatusBuilderAnnotationFactory('individual', 'formElement');
const RegistrationViewFilter = RuleFactory("173abccc-2c3e-451e-a77e-524b28c4a224", "ViewFilter");
//const RegistrationDecisionRule = RuleFactory("173abccc-2c3e-451e-a77e-524b28c4a224", "Decision");



@RegistrationViewFilter("9452f291-431b-4040-b8d5-28b20bb798f8", "Preconception Registration View Filter", 100.0, {})
class PreconceptionRegistrationViewHandler {
    static exec(individual, formElementGroup) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new PreconceptionRegistrationViewHandler(), individual, formElementGroup);
    }    

   
    @WithRegistrationStatusBuilder
    counselHerToDelayPregnancyByUsingContraceptivesAsAgeIsLessThan20([], statusBuilder) {
        statusBuilder.show().when.ageInYears.is.lessThan(20);
        }

    @WithRegistrationStatusBuilder
    counselHerToAsAgeIsGreaterThan30([], statusBuilder) {
        statusBuilder.show().when.ageInYears.is.greaterThan(30);
        }

    @WithRegistrationStatusBuilder
    counselHerAboutEffectsOfConsanguenousMarrriageAndCongenitalAnomalies([], statusBuilder) {
        statusBuilder.show().when.valueInRegistration("Did you marry within relation?").is.yes;
        }
}

// @RegistrationDecisionRule("1b29c5b0-0080-4124-b137-898f6ad3d0d6", "Preconception Registration Decision", 100.0, {})
// class PreconceptionRegistrationDecisions {
//     static consanguineousMarraige(individual) {        
//         const complicationsBuilder = new ComplicationsBuilder({
//             individual: individual,
//             complicationsConcept: 'High Risk Conditions'
//         });
    
//         complicationsBuilder.addComplication("Consanguineous marriage")
//         .when.valueInRegistration("Did you marry within relation?")
//         .containsAnswerConceptName("Yes");

//         return complicationsBuilder.getComplications();
//     }

//     static counselToDoctor(individual,today) {
//         const complicationsBuilder = new ComplicationsBuilder({
//             individual: individual,
//             complicationsConcept: 'Age - less than 20'
//         });

//         complicationsBuilder.addComplication("Counsel her to delay pregnancy by using contraceptives")
//         .when.valueInRegistration("ageInMonths").lessThan(20);
//        
//             return complicationsBuilder.getComplications();
//     }

              
//     static exec(individual, decisions, context, today) {
//         decisions.registrationDecisions.push(PreconceptionRegistrationDecisions.consanguineousMarraige(individual));
//         decisions.registrationDecisions.push(PreconceptionRegistrationDecisions.counselToDoctor(individual,today));
//          return decisions;
  
//     }
// }


module.exports = {PreconceptionRegistrationViewHandler};//PreconceptionRegistrationDecisions

