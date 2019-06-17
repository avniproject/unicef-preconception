import {ProgramRule} from 'rules-config/rules';
import _ from 'lodash';

const LOW_BMI = '1faa1253-e4dd-48f1-aea2-c231390f9530';
const HIGH_BMI = 'f58ed8eb-1873-4cea-aab2-09cb8b48ada2';
const isBMI = uuid => [LOW_BMI, HIGH_BMI].includes(uuid);

@ProgramRule({
    name: 'Preconception program summary',
    uuid: '0da2e63b-7be8-44bb-a26a-3f6e7e3d8525',
    programUUID: 'aedaf231-a9cb-4116-a356-eac4e862480c',
    executionOrder: 100.0,
    metadata: {}
})
class ProgramSummary {
    static ifBMIKeepLatest(risk, index, allRisks) {
        return !isBMI(risk) || index === _.findLastIndex(allRisks, isBMI);
    }

    static getHighRisks(programEnrolment, today) {
        let vals = _([programEnrolment])
            .concat(_.sortBy(programEnrolment.nonVoidedEncounters(), 'encounterDateTime'))
            .map(it =>
                _.concat([],
                    it.getObservationValue("High Risk Mother"),
                    it.getObservationValue("High Risk Woman"),
                    it.getObservationValue("High Risk Conditions")))
            .flatten()
            .reject(_.isNil)
            .filter(ProgramSummary.ifBMIKeepLatest)
            .value();
        return {};//name: 'High Risk Conditions', value: vals
    }

    static exec(programEnrolment, summaries, context, today) {
        summaries.push();//ProgramSummary.getHighRisks(programEnrolment, today)
        return summaries;
    }
}

export {
    ProgramSummary
}
