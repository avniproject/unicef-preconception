import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';
import RuleHelper from "../shared/RuleHelper";

const filter = RuleFactory('744f0d21-267f-4705-a0a8-32a78e513c03', 'ViewFilter');
const visit1Decision = RuleFactory("744f0d21-267f-4705-a0a8-32a78e513c03", "Decision");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('2e5771b2-6b1b-429e-94e6-41e3dc44a09d', 'Visit 1 View Handler', 100.0)
class Visit1FormHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new Visit1FormHandler(), programEncounter, formElementGroup, today);
    }

    getObservationValueFromEntireEnrolment(conceptName,programEncounter) {
        return programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment(conceptName, programEncounter);
    }

    bmi(programEncounter, formElement) {
        let height = this.getObservationValueFromEntireEnrolment("Preconception Height", programEncounter);
        let weight = programEncounter.findObservation("Preconception Weight");
        return RuleHelper.createBMIFormElementStatusEnrolment(height, weight, formElement);
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
        statusBuilder.show().when.valueInEncounter('Preconception hypertension').is.yes;
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
    bloodSugarLevelBslOralGlucoseToleranceOgtTest([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception blood sugar random").is.greaterThan(140);
    }

    @WithStatusBuilder
    diabetesTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Preconception blood sugar ogt')
            .containsAnyAnswerConceptName("Positive");
    } 

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
    vdrlTreatmentForHusband([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Husband Vdrl")
            .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    rtiTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("RTI Symptoms")
        .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    rtiSymptomsForHusband([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("RTI Symptoms")
        .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    rtiTreatmentForHusband([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("RTI Symptoms for Husband")
        .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    tshTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("TSH").greaterThan(10);
    }
    
    @WithStatusBuilder
    anyOtherIllnessTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }

    @WithStatusBuilder
    ifAnyOtherIllnessSpecify([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }

    @WithStatusBuilder
    isWomanSufferingFromHypertensionDiagnosedByMo([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Blood pressure systolic").is.greaterThan(120)
        .or.when.valueInEncounter("Blood pressure diastolic").is.greaterThan(80);
    }

    @WithStatusBuilder
    preconceptionDietAdvice([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('BMI').is.greaterThan(25).or.is.lessThan(18);
    }
   
    @WithStatusBuilder
    preconceptionCounsellingForAnaemiaTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Preconception Hb').is.lessThan(12);
    }

    @WithStatusBuilder
    preconceptionCounsellingForSickleCellAnaemiaTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Sickle cell anaemia solubility test")
        .containsAnyAnswerConceptName("Positive");
    }
   
    @WithStatusBuilder
    preconceptionCounsellingForHypertensionTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception hypertension").is.yes;
    }
   
    @WithStatusBuilder
    preconceptionCounsellingRegardingAntiDInjection([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Blood group").containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
        .and.when.valueInEncounter("Husband blood group").containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
    }
   
    @WithStatusBuilder
    preconceptionCounsellingForDiabetesTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('HIV')
        .containsAnyAnswerConceptName("Positive");
    }
    
    @WithStatusBuilder
    preconceptionCounsellingHerForHivTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('HIV')
        .containsAnyAnswerConceptName("Positive");
    }
   
    @WithStatusBuilder
    preconceptionCounsellingHusbandForHivTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Husband hiv')
        .containsAnyAnswerConceptName("Positive");
    }
    
    @WithStatusBuilder
    preconceptionCounsellingBothForVdrlInfectionTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Husband Vdrl')
        .containsAnyAnswerConceptName("Positive").or.when.valueInEncounter('VDRL test Result')
        .containsAnyAnswerConceptName("Positive");
    }
    
    @WithStatusBuilder
    preconceptionCounsellingHerForRtiTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('RTI Symptoms')
        .containsAnyAnswerConceptName("Positive");
    }
   
    @WithStatusBuilder
    preconceptionCounsellingHusbandForRtiTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('RTI Symptoms for Husband')
        .containsAnyAnswerConceptName("Positive");
    }
    
    @WithStatusBuilder
    preconceptionCounsellingForOtherIllnessTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter('Any other illness')
        .containsAnyAnswerConceptName("Yes");
    }
    
    @WithStatusBuilder
    preconceptionCounsellingForHypothyroidismTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("TSH").greaterThan(12);
    }

}

@visit1Decision("3a619448-c4b2-4adb-9d84-26fbdfb14a60", "Visit1 Form decisions", 100.0, {})
class Visit1Decision {
    static highRisks(programEncounter) {
        const complicationsBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: 'High Risk Woman'
        });

        complicationsBuilder.addComplication("Low BMI")
        .when.valueInEncounter("BMI").lessThan(18.5);

        complicationsBuilder.addComplication("High BMI")
        .when.valueInEncounter("BMI").greaterThan(25);
 
        complicationsBuilder.addComplication("Haemoglobin < 12")
            .when.valueInEncounter("Preconception Hb").lessThan(12);

        complicationsBuilder.addComplication("Suffering from hypertension")
            .when.valueInEncounter("Preconception hypertension").is.yes;

        complicationsBuilder.addComplication("Rh Negative Blood Group")
            .when.valueInEncounter("Blood group").containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
            .and.when.valueInEncounter("Husband blood group").containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
       
        complicationsBuilder.addComplication('Sickle cell anaemia positive')
            .when.valueInEncounter('Sickle cell anaemia solubility test')
            .containsAnyAnswerConceptName("Positive");
            
        complicationsBuilder.addComplication('HIV positive')
            .when.valueInEncounter('HIV')
            .containsAnyAnswerConceptName("Positive");

        complicationsBuilder.addComplication("Husband's HIV positive")
            .when.valueInEncounter('Husband hiv')
            .containsAnyAnswerConceptName("Positive");

        complicationsBuilder.addComplication('VDRL test Result positive')
            .when.valueInEncounter('VDRL test Result')
            .containsAnyAnswerConceptName("Positive");

        complicationsBuilder.addComplication("Husband's VDRL positive")
            .when.valueInEncounter('Husband Vdrl')
            .containsAnyAnswerConceptName("Positive");
            
        complicationsBuilder.addComplication('RTI Symptoms positive')
            .when.valueInEncounter('RTI Symptoms')
            .containsAnyAnswerConceptName("Positive");
            
        complicationsBuilder.addComplication('RTI Symptoms for Husband positive')
            .when.valueInEncounter('RTI Symptoms for Husband')
            .containsAnyAnswerConceptName("Positive");

        complicationsBuilder.addComplication("TSH > 12")
             .when.valueInEncounter("TSH").greaterThan(12);
 
        complicationsBuilder.addComplication('Other illness')
            .when.valueInEncounter('Any other illness')
            .containsAnyAnswerConceptName("Yes");
       
  
        return complicationsBuilder.getComplications();
    }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(Visit1Decision.highRisks(programEncounter));
        return decisions;
    }
}



module.exports = {Visit1FormHandler,Visit1Decision};