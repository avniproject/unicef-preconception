import {RuleFactory} from 'rules-config/rules';
import RuleHelper from "../general/RuleHelper";
import moment from 'moment';

const enrolmentVisits = RuleFactory("6d83cdef-02dc-4f9f-bc8a-9e3375fb2ded", "VisitSchedule");

@enrolmentVisits("9bb5915d-39c2-4869-9079-5b758497bff5", "Preconception Enrolment Visit schedules", 100.0)
class EnrolmentVisits {

    static exec(programEnrolment, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createEnrolmentScheduleBuilder(programEnrolment, visitSchedule);
        let date = moment(programEnrolment.enrolmentDateTime).add(2, 'months').startOf('month').toDate();
        RuleHelper.addSchedule(scheduleBuilder, 'Monthly Visit ' + 1, 'Monthly Monitoring', date, 7);
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

const monthlyMonitoringVisits = RuleFactory("3462178e-94e5-43d9-bc17-6cddad05c265", "VisitSchedule");

@monthlyMonitoringVisits("170329a6-80be-44d3-bfc8-eaff182752ef", "NextMonthlyFollowupVisits", 10.0)
class NextMonthlyFollowupVisits {
    static exec(programEncounter, visitSchedule = [], scheduleConfig) {
        let scheduleBuilder = RuleHelper.createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedule);
        let followupDate = programEncounter.getObservationReadableValue('Next monthly Visit Date');
        let visitNumber = Math.ceil(moment(followupDate).endOf('month').diff(moment(programEncounter.programEnrolment.enrolmentDateTime).startOf('month'), 'months', true) - 2);
        if (!_.isNil(followupDate) && visitNumber < 24) {
            RuleHelper.addSchedule(scheduleBuilder, 'Monthly Visit ' + visitNumber, 'Monthly Monitoring', followupDate, 7);
        }
        return scheduleBuilder.getAllUnique("encounterType");
    }
}

export {
    EnrolmentVisits, NextMonthlyFollowupVisits
}
