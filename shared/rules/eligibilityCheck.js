import {EncounterEligibilityCheck} from 'rules-config/rules';

@EncounterEligibilityCheck({
    name: 'Visit1Eligibility',
    uuid: 'd326399f-d127-49bc-8c83-77f841fef47b',
    encounterTypeUUID: '4e14f25b-cfa5-4b66-8c68-f5e116f05f39',
    // abortion followup
    executionOrder: 100.0,
    metadata: {}
})
class Visit1Eligibility {
    static exec({individual}) {
        return false;
    }
}

@EncounterEligibilityCheck({
    name: 'MonthlyMonitoringEligibility',
    uuid: '8acbc6d6-7998-4f66-97cf-316b1d6bbfdf',
    encounterTypeUUID: 'c6342de2-7931-4f48-a25c-c40a94b4c5b4',
    // census
    executionOrder: 100.0,
    metadata: {}
})
class MonthlyMonitoringEligibility {
    static exec({individual}) {
        return false;
    }
}

@EncounterEligibilityCheck({
    name: 'OutcomeEligibility',
    uuid: '31138cf2-adf7-48ba-8582-0da64aa339de',
    encounterTypeUUID: 'bc03a02d-86c7-4d17-a0ee-44408fd1ed6d',
    executionOrder: 100.0,
    metadata: {}
})

class OutcomeEligibiliOutcomeEligibilityty {
    static exec({individual}) {
        const encounters = individual.enrolments[0].getEncountersOfType('Outcome');
        return encounters && encounters.length < 1;
    }
}


export {
    Visit1Eligibility,
    MonthlyMonitoringEligibility,
    OutcomeEligibiliOutcomeEligibilityty
};

