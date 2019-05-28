import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';

const RuleHelper = require('../general/RuleHelper');

const filter = RuleFactory('744f0d21-267f-4705-a0a8-32a78e513c03', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('2e5771b2-6b1b-429e-94e6-41e3dc44a09d', 'Visit 1 View Handler', 100.0)
class Visit1FormHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new Visit1FormHandler(), programEncounter, formElementGroup, today);
    }

    bmi(programEncounter, formElement) {
        let height = programEncounter.findObservation("Preconception Height", programEncounter);
        let weight = programEncounter.findObservation("Preconception Weight");
        return RuleHelper.createBMIFormElementStatus(height, weight, formElement);
    } 

    @WithStatusBuilder
    ironAndFolicAcid([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Preconception Hb').is.lessThan(12);
    }

    @WithStatusBuilder
    folicAcid([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Preconception Hb').is.greaterThan(12);
    }

    @WithStatusBuilder
    hypertensionTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Preconception hypertension')
            .is.yes;
    }   
   
    @WithStatusBuilder
    husbandsBloodGroup([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Blood group")
            .containsAnyAnswerConceptName("AB-", "O-", "A-", "B-");
    } 
    
    @WithStatusBuilder
    sickleCellAnaemiaElectrophoresis([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Sickle cell anaemia solubility test')
            .containsAnyAnswerConceptName("Positive");
    } 

    @WithStatusBuilder
    sickleCellAnaemiaTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Sickle cell anaemia solubility test')
            .containsAnyAnswerConceptName("Positive");
    } 

    @WithStatusBuilder
    bloodSugarLevelBSLOralGlucoseToleranceOGTTest([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception blood sugar random").is.greaterThan(140);
    }

    @WithStatusBuilder
    diabetesTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Preconception blood sugar ogt')
            .containsAnyAnswerConceptName("Positive");
    } 

    // @WithStatusBuilder
    // hypertension([], statusBuilder) {
    //     statusBuilder.show().when.valueInEncounter("Blood pressure- Systolic").is.greaterThan(120);
    // }

    // @WithStatusBuilder
    // hypertension([], statusBuilder) {
    //     statusBuilder.show().when.valueInEncounter("Blood pressure- Diastolic").is.greaterThan(80);
    // }

    @WithStatusBuilder
    hivTreatmentTaken([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('HIV')
            .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    husbandsHiv([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('HIV')
            .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    hivTreatmentForHusband([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Husband hiv')
            .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    vdrlTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('VDRL test Result')
            .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    husbandsVdrl([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('VDRL test Result')
            .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    husbandVdrlTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Husband's VDRL")
            .containsAnyAnswerConceptName("Positive");
    }
}

module.exports = {Visit1FormHandler};