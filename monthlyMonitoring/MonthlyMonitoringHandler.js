import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper
} from 'rules-config/rules';
import moment from 'moment';
import RuleHelper from "../shared/rules/RuleHelper";

const filter = RuleFactory('3462178e-94e5-43d9-bc17-6cddad05c265', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

const visit1Date = ({programEnrolment}) => {
    return moment(programEnrolment.enrolmentDateTime).startOf('month').add(2, 'months').toDate();
};
const getVisitNumber = (programEncounter) => {
   let getObservationReadableValue = programEncounter.isCancelled() ? 'findCancelEncounterObservationReadableValue' : 'getObservationReadableValue';
   let followupDate = programEncounter[getObservationReadableValue]('Next monthly Visit Date');
   let visitNumber = Math.ceil(moment(followupDate).endOf('month').diff(visit1Date(programEncounter), 'months', true));
   return visitNumber; 
};

@filter('5a5fcbfe-f3b3-4e69-8f5d-2855c373bb95', 'MonthlyMonitoringHandler', 100.0)
class MonthlyMonitoringHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new MonthlyMonitoringHandler(), programEncounter, formElementGroup, today);
    }
    
    getObservationValueFromEntireEnrolment(conceptName,programEncounter) {
        return programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment(conceptName, programEncounter);
    }

    @WithStatusBuilder
    bmi([programEncounter, formElement],statusBuilder) {
        let height = this.getObservationValueFromEntireEnrolment("Preconception Height", programEncounter);
        let weight = programEncounter.findObservation("Preconception Weight");    
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
        statusBuilder.value(RuleHelper.calculateBMIStatusBuiler(height,weight));
        return statusBuilder.build();
     } 

    @WithStatusBuilder
    counselHerToDelayPregnancyByUsingContraceptives([], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.lessThan(20);
    }

    @WithStatusBuilder
    couselHerToVisitPhcRhChForFurtherInvestigationsAndTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.greaterThan(35);  
    }

    @WithStatusBuilder
    dietAdviceToIncreaseOrIncreaseWeightRespectivelyAsPerDietChart([], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("BMI").is.lessThan(18.5)
        .or.when.latestValueInEntireEnrolment("BMI").is.greaterThan(25.0);   
    }

    @WithStatusBuilder
    counselHerToQuitTobaccoConsumption([], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Tobacco consumption")
        .containsAnyAnswerConceptName("Yes");  
    }

    @WithStatusBuilder
    counselHerToQuitAlcoholConsumption([], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Alcohol consumption").is.yes;
    }
    
    @WithStatusBuilder
    counselHerToIncreaseWholeCerealsInDiet([], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Calorie % RDA").is.lessThan(70);
    }

    @WithStatusBuilder
    counselHerToIncreaseProteinsInDiet([programEncounter], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Protein % RDA").is.lessThan(70);
    }

    @WithStatusBuilder
    counselHerForAnaemiaTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("Preconception Hb").is.lessThan(12);
    }

   
    @WithStatusBuilder
    counselHerForHypertensionTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('Preconception hypertension').is.yes;
    }

    @WithStatusBuilder  
    counselHerForDiabetesTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('Preconception blood sugar ogt')
        .containsAnyAnswerConceptName("Positive");
    }
  
    @WithStatusBuilder
    counselHerForSickleCellAnaemiaTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("Sickle cell anaemia solubility test").containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    counselHerForHivTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("HIV").containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    counselHerForVdrlInfectionTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("VDRL test Result")
        .containsAnyAnswerConceptName("Positive");
    }

    @WithStatusBuilder
    counselHerForRtiStiTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("RTI Symptoms").containsAnyAnswerConceptName("Yes");
    }

    @WithStatusBuilder
    counselHerForTshTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("TSH").is.greaterThan(10);
    }

    @WithStatusBuilder
    counselHerForOtherIllnessTreatment([], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("Any other illness").containsAnyAnswerConceptName("Yes");
    }

    @WithStatusBuilder
    counselWomanToTakeAntiDInjection([programEncounter], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Blood group").containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
        .and.when.latestValueInEntireEnrolment("Husband blood group")
        .containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
    }
    @WithStatusBuilder
    uptDoneIfPeriodMissed([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Missed period").is.yes;
    }

    @WithStatusBuilder
    haemoglobin([programEncounter], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").
        containsAnyAnswerConceptName("Positive")
        .and.whenItem(getVisitNumber(programEncounter)).equalsOneOf(4,7,10,13,16,19,22);
        //4,7,10,13,16,19,22 every three months  equalsOneOf   
    }

    @WithStatusBuilder
    weight([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
    }


    @WithStatusBuilder
    anyRtiSymptoms([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");  
    }

    @WithStatusBuilder
    whetherRtiTreatmentTaken([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("RTI Symptoms").containsAnyAnswerConceptName("Yes");
    }

    @WithStatusBuilder
    anyOtherIllness([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");    }
    
    @WithStatusBuilder
    ifAnyOtherIllnessSpecify([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }   
    
    @WithStatusBuilder
    anyOtherIllnessTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }

    @WithStatusBuilder
    dewormingTabletReceivedAlbendazole([programEncounter], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed")
        .containsAnyAnswerConceptName("Positive")
        .and.whenItem(getVisitNumber(programEncounter)).equalsOneOf(7,13,19);
        // 7,13,19 every six months
    }

     @WithStatusBuilder
     nextMonthlyVisitDate([], statusBuilder) {
         statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
      }

    @WithStatusBuilder
    ifaIronAndFolicAcid([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception Hb").is.lessThan(12);
    }

    @WithStatusBuilder
    fa([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception Hb").is.greaterThan(12);
    }
    
    @WithStatusBuilder
    askHerToFollowDietAdvice([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("BMI").is.lessThan(18.5)
        .or.when.valueInEncounter("BMI").is.greaterThan(25.0);
    }

    @WithStatusBuilder
    counselHerForRtiTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Whether pregnancy continued").is.yes;
    } 

    @WithStatusBuilder
    counselForOtherIllnessTreatment([], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
      } 

    @WithStatusBuilder
    counsellingOfHighRiskFactors([], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.lessThan(20)
        .or.when.latestValueInEntireEnrolment("Age").is.greaterThan(35)
         .or.when.latestValueInEntireEnrolment("BMI").is.lessThan(18.5)
         .or.when.latestValueInEntireEnrolment("BMI").is.greaterThan(25.0)
         .or.when.latestValueInEntireEnrolment("Tobacco consumption").is.yes
         .or.when.latestValueInEntireEnrolment("Alcohol consumption").is.yes
         .or.when.latestValueInEntireEnrolment("Calorie % RDA").is.lessThan(70)
         .or.when.latestValueInEntireEnrolment("Protein % RDA").is.lessThan(70)
         .or.when.latestValueInEntireEnrolment("Preconception hypertension").is.yes
         .or.when.latestValueInEntireEnrolment("Preconception blood sugar ogt").containsAnyAnswerConceptName("Positive")
         .or.when.latestValueInEntireEnrolment("Sickle cell anaemia solubility test").containsAnyAnswerConceptName("Positive")
         .or.when.latestValueInEntireEnrolment("HIV").containsAnyAnswerConceptName("Positive")
         .or.when.latestValueInEntireEnrolment("VDRL test Result").containsAnyAnswerConceptName("Positive")
         .or.when.latestValueInEntireEnrolment("RTI Symptoms").is.yes
         .or.when.latestValueInEntireEnrolment("TSH").is.greaterThan(10)
         .or.when.latestValueInEntireEnrolment("Any other illness").is.yes ||
        statusBuilder.show().when.latestValueInEntireEnrolment("Blood group")
                    .containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
                    .and.when.latestValueInEntireEnrolment("Husband blood group")
                    .containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
    }

    @WithStatusBuilder
    adviceFollowed([], statusBuilder) {
       statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.lessThan(20)
           .or.when.latestValueInEntireEnrolment("Age").is.greaterThan(35)
            .or.when.latestValueInEntireEnrolment("BMI").is.lessThan(18.5)
            .or.when.latestValueInEntireEnrolment("BMI").is.greaterThan(25.0)
            .or.when.latestValueInEntireEnrolment("Tobacco consumption").is.yes
            .or.when.latestValueInEntireEnrolment("Alcohol consumption").is.yes
            .or.when.latestValueInEntireEnrolment("Calorie % RDA").is.lessThan(70)
            .or.when.latestValueInEntireEnrolment("Protein % RDA").is.lessThan(70);
    }

    @WithStatusBuilder
    treatmentOfHighRiskIllnesses([], statusBuilder) {     
        statusBuilder.show().when.latestValueInPreviousEncounters("Preconception Hb").is.lessThan(12)
            .or.when.latestValueInEntireEnrolment("Preconception hypertension").is.yes
            .or.when.latestValueInEntireEnrolment("Preconception blood sugar ogt").containsAnyAnswerConceptName("Positive")
            .or.when.latestValueInEntireEnrolment("Sickle cell anaemia solubility test").containsAnyAnswerConceptName("Positive")
            .or.when.latestValueInEntireEnrolment("HIV").containsAnyAnswerConceptName("Positive")
            .or.when.latestValueInEntireEnrolment("VDRL test Result").containsAnyAnswerConceptName("Positive")
            .or.when.latestValueInEntireEnrolment("RTI Symptoms").is.yes
            .or.when.latestValueInEntireEnrolment("TSH").is.greaterThan(10)
            .or.when.latestValueInEntireEnrolment("Any other illness").is.yes ||
        statusBuilder.show().when.latestValueInEntireEnrolment("Blood group").containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
             .and.when.latestValueInEntireEnrolment("Husband blood group")
             .containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
       
    }
}

module.exports =  {MonthlyMonitoringHandler};