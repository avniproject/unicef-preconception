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

module.exports = {PreconceptionRegistrationViewHandler};
