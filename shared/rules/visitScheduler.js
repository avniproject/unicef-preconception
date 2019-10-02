import _ from 'lodash';
import moment from 'moment';
import {RuleFactory} from 'rules-config/rules';
import RuleHelper from "./RuleHelper";

const visit1Date = ({programEnrolment}) => {
    return moment(programEnrolment.enrolmentDateTime).startOf('month').add(1, 'months').toDate();
};
const scheduleMonthlyMonitoring = (programEncounter, visitSchedule = [], scheduleConfig) => {
    let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
    let getObservationReadableValue = programEncounter.isCancelled() ? 'findCancelEncounterObservationReadableValue' : 'getObservationReadableValue';
    let followupDate = programEncounter[getObservationReadableValue]('Next monthly Visit Date');
    let visitNumber = Math.ceil(moment(followupDate).endOf('month').diff(visit1Date(programEncounter), 'months', true));
    if (!_.isNil(followupDate) && visitNumber < 24) {
        RuleHelper.addSchedule(scheduleBuilder, 'Visit ' + visitNumber, 'Monthly Monitoring', followupDate, 14);
    }
    return scheduleBuilder.getAllUnique("encounterType");
};

@RuleFactory("6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded", "VisitSchedule")
("9bb5915d-39c2-4869-9079-5b758497bff5", "Preconception Enrolment Visit schedules", 100.0)
class ScheduleVisitsDuringEnrolment {

    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createEnrolmentScheduleBuilder(programEnrolment, visitSchedule);
        RuleHelper.addSchedule(scheduleBuilder, 'Visit 1', 'Visit 1', visit1Date({programEnrolment}), 7);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

@RuleFactory("3462178e-94e5-43d9-bc17-6cddad05c265", "VisitSchedule")
("170329a6-80be-44d3-bfc8-eaff182752ef", "ScheduleVisitsDuringVisit2", 10.0)
class ScheduleVisitsDuringVisit2 {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        return scheduleMonthlyMonitoring(programEncounter, visitSchedule, scheduleConfig);
    }
}

@RuleFactory("744f0d21-267f-4705-a0a8-32a78e513c03", "VisitSchedule")
("57e4a49d-8ff3-4e72-8276-ca7d087a4c88", "ScheduleVisitsDuringVisit1", 10.0)
class ScheduleVisitsDuringVisit1 {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        return scheduleMonthlyMonitoring(programEncounter, visitSchedule, scheduleConfig);
    }
}

@RuleFactory("ceebf03d-5539-4f20-a49a-3ad12c4e98cc", "VisitSchedule")
("328be40c-5a48-4f5b-b2b2-14c8489d7244", "ScheduleVisitsDuringOutcomeVisit", 10.0)
class ScheduleVisitsDuringOutcomeVisit {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        return scheduleMonthlyMonitoring(programEncounter, visitSchedule, scheduleConfig);
    }
}

@RuleFactory("52fe4628-ac8a-4d9a-aa96-967b3964be1c", "VisitSchedule")
("eda5ebbf-bfae-4df8-9980-8b4ff4113e79", "ScheduleVisitsDuringVisitCancellation", 10.0)
class ScheduleVisitsDuringVisitCancellation {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        return scheduleMonthlyMonitoring(programEncounter, visitSchedule, scheduleConfig);
    }
}

export {
    ScheduleVisitsDuringEnrolment,
    ScheduleVisitsDuringVisit2,
    ScheduleVisitsDuringVisit1,
    ScheduleVisitsDuringOutcomeVisit,
    ScheduleVisitsDuringVisitCancellation,
}
