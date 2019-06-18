import {
    complicationsBuilder as ComplicationsBuilder,
    RuleFactory,
} from 'rules-config/rules';

const decisions = RuleFactory('3462178e-94e5-43d9-bc17-6cddad05c265', 'Decision');

@decisions("e16ece91-dc48-4e6a-81d1-bc4111b0a3ae", "MonthlyMonitoringDecisions", 100.0, {})
class MonthlyMonitoringDecisions {
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

        complicationsBuilder.addComplication('Other illness')
            .when.valueInEncounter('Any other illness').is.yes;

        complicationsBuilder.addComplication('RTI Symptoms positive')
            .when.valueInEncounter('RTI Symptoms').is.yes;

        return complicationsBuilder.getComplications();
    }

    static exec(programEncounter, decisions, context, today) {
        decisions.encounterDecisions.push(MonthlyMonitoringDecisions.highRisks(programEncounter));
        return decisions;
    }
}

export {
    MonthlyMonitoringDecisions
}