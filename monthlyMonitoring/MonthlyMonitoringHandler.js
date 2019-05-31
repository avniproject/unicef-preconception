import {
    StatusBuilderAnnotationFactory, 
    RuleFactory,  
    FormElementsStatusHelper,
    complicationsBuilder as ComplicationsBuilder
} from 'rules-config/rules';

const RuleHelper = require('../general/RuleHelper');

const filter = RuleFactory('3462178e-94e5-43d9-bc17-6cddad05c265', 'ViewFilter');
const monthlyMonitoringDecision = RuleFactory("3462178e-94e5-43d9-bc17-6cddad05c265", "Decision");
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

@filter('5a5fcbfe-f3b3-4e69-8f5d-2855c373bb95', 'Monthly Moitoring View Handler', 100.0)
class MonthlyMonitoringHandler {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new MonthlyMonitoringHandler(), programEncounter, formElementGroup, today);
    }

    @WithStatusBuilder
    counselHerToDelayPregnancyByUsingContraceptives([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    couselHerToVisitPhcRhChForFurtherInvestigationsAndTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    dietAdviceToIncreaseOrIncreaseWeightRespectivelyAsPerDietChart([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerToQuitTobaccoConsumption([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerToQuitAlcoholConsumption([], statusBuilder) {
        // statusBuilder.show().when.
    }
    
    @WithStatusBuilder
    counselHerToIncreaseWholeCerealsInDiet([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerToIncreaseProteinsInDiet([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerForAnaemiaTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }
    @WithStatusBuilder
    counselWomanToTakeAntiDInjection([], statusBuilder) {
        // statusBuilder.show().when.
    }
    @WithStatusBuilder
    counselHerForHypertensionTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }
    @WithStatusBuilder
    counselHerForDiabetesTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }
    @WithStatusBuilder
    counselHerForSickleCellAnaemiaTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }
    @WithStatusBuilder
    counselHerForHivTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerForVdrlInfectionTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerForRtiStiTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerForTshTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }

    @WithStatusBuilder
    counselHerForOtherIllnessTreatment([], statusBuilder) {
        // statusBuilder.show().when.
    }
}

@monthlyMonitoringDecision("bfdf84a9-4f7f-4cf0-9c5e-ac0b1aa91eaf", "Monthly Monitoring Form decisions", 100.0, {})
class MonthlyMonitoringDecision {
    static highRisks(programEncounter) {
        const complicationsBuilder = new ComplicationsBuilder({
            programEncounter: programEncounter,
            complicationsConcept: 'High Risk Woman'
        });

       
  
        return complicationsBuilder.getComplications();
    }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(MonthlyMonitoringDecision.highRisks(programEncounter));
        return decisions;
    }
}



module.exports = {MonthlyMonitoringHandler,MonthlyMonitoringDecision};