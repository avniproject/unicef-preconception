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
const RegistrationValidation = RuleFactory('173abccc-2c3e-451e-a77e-524b28c4a224', 'Validation');
const RegistrationDecisionRule = RuleFactory("173abccc-2c3e-451e-a77e-524b28c4a224", "Decision");


@RegistrationViewFilter("9452f291-431b-4040-b8d5-28b20bb798f8", "Preconception Registration View Filter", 100.0, {})
class PreconceptionRegistrationViewHandler {
    static exec(individual, formElementGroup) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new PreconceptionRegistrationViewHandler(), individual, formElementGroup);
    }    

    @WithRegistrationStatusBuilder
    religion([], statusBuilder) {
        statusBuilder.skipAnswers('Jain','Sikh');
    }

    @WithRegistrationStatusBuilder
    whatIsYourOccupation([], statusBuilder) {
        statusBuilder.skipAnswers('Unemployed','Skilled manual','Professional/Technical',
        'Government Job','Private Job','Daily wage labourer','Shopkeeper','Other');
    }

    @WithRegistrationStatusBuilder
    counselHerAboutEffectsOfConsanguenousMarrriageAndCongenitalAnomalies([], statusBuilder) {
        statusBuilder.show().when.valueInRegistration("Consanguineous marriage").is.yes;
        }

    @WithRegistrationStatusBuilder
    counselHerToDelayPregnancyByUsingContraceptivesAsAgeIsLessThan20([], statusBuilder) {
        statusBuilder.show().when.ageInYears.is.lessThan(20);
        }

    @WithRegistrationStatusBuilder
    counselHerAndReferHerToPhcRhChForFurtherInvestigationsAndTreatmentAsAgeIsGreaterThan30([], statusBuilder) {
        statusBuilder.show().when.ageInYears.is.greaterThan(30);
        }

   
}


@RegistrationValidation("0c1347c6-f9cc-44dc-98de-fbf3f25d0211", "Registration Form Validation", 100.0)
class RegistrationValidationHandler {
    validate(individual) {
        const validationResults = [];
        if (individual.getAgeInYears() < 15 || individual.getAgeInYears() > 49  ) {
            validationResults.push(lib.C.createValidationError('Age is outside range 15-49 yrs'));
        }
        return validationResults;
    }
    static exec(individual, validationErrors) {
        return new RegistrationValidationHandler().validate(individual);
    }
}

@RegistrationDecisionRule("1b29c5b0-0080-4124-b137-898f6ad3d0d6", "Preconception Registration Decision", 100.0, {})
class PreconceptionRegistrationDecisions {
    static highRiskWoman(individual) {        
        const complicationsBuilder = new ComplicationsBuilder({
            individual: individual,
            complicationsConcept: 'High Risk Conditions'
        });
    
        complicationsBuilder.addComplication("Consanguineous marriage")
        .when.valueInRegistration("Consanguineous marriage")
        .containsAnswerConceptName("Yes") ;
        complicationsBuilder.addComplication("Age < 20").when.ageInYears.is.lessThan(20); 
        complicationsBuilder.addComplication("Age > 30").when.ageInYears.is.greaterThan(30);  


        return complicationsBuilder.getComplications();
    }
              
    static exec(individual, decisions, context, today) {
        decisions.registrationDecisions.push(PreconceptionRegistrationDecisions.highRiskWoman(individual));
        return decisions;
  
    }
}

module.exports = {PreconceptionRegistrationViewHandler, RegistrationValidationHandler, PreconceptionRegistrationDecisions};
