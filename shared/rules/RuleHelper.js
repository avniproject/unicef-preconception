import {FormElementStatusBuilder, FormElementStatus, VisitScheduleBuilder} from 'rules-config/rules';
import moment from 'moment';
import lib from './lib';

const addSchedule = (builder, visitSchedule) => {
    if (moment().isSameOrBefore(visitSchedule.maxDate, 'day')) {
        builder.add(visitSchedule);
    }
};

const addSchedules = (builder, visitSchedules) => visitSchedules.forEach((vs) => addSchedule(builder, vs));

class RuleHelper {
    static getAgeOfYoungestChildInMonths(individual, referenceDate) {
        const youngestChild = lib.C.getYoungestChild(individual);
        return youngestChild && youngestChild.getAgeInMonths(referenceDate);
    };

    static dateWithoutTime(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    static dateAIsAfterB(a, b) {
        if (_.isNil(a) || _.isNil(b)) return false;
        let valueA = a && a.getValue();
        return moment(RuleHelper.dateWithoutTime(valueA)).isAfter(RuleHelper.dateWithoutTime(b));
    }

    static encounterCodedObsHas(programEncounter, formElement, conceptName, ...answerConceptNames) {
        let statusBuilder = new FormElementStatusBuilder({programEncounter, formElement});
        statusBuilder.show().when.valueInEncounter(conceptName).containsAnyAnswerConceptName(...answerConceptNames);
        return statusBuilder.build();
    }

    static encounterCodedObsNotHave(programEncounter, formElement, conceptName, answerConceptName) {
        let statusBuilder = new FormElementStatusBuilder({programEncounter, formElement});
        statusBuilder.show().when.valueInEncounter(conceptName).not.containsAnswerConceptName(answerConceptName);
        return statusBuilder.build();
    }


    static generalObservationMatcher(context, scope, conceptName, matchingFn, [...answers] /*always array*/) {
        let statusBuilder = new FormElementStatusBuilder(context);
        statusBuilder.show().when['valueIn' + scope](conceptName)[matchingFn](...answers);
        return statusBuilder.build();
    }

    static Scope = {
        Enrolment: 'Enrolment',
        Encounter: 'Encounter',
        EntireEnrolment: 'EntireEnrolment'
    };

    static _calculateBMI = (weight, height) => {
        return Math.ceil((weight / Math.pow(height, 2)) * 10000, 1);
    };

    static createBMIFormElementStatusEnrolment(height, weight, formElement) {
        let value;
        // height = height && height.getValue();
        weight = weight && weight.getValue();
        if (Number.isFinite(weight) && Number.isFinite(height)) {
            value = lib.C.calculateBMI(weight, height);
        }
        return new FormElementStatus(formElement.uuid, true, value);
    }


    static createBMIFormElementStatus(height, weight, formElement) {
        let value;
        height = height && height.getValue();
        weight = weight && weight.getValue();
        if (Number.isFinite(weight) && Number.isFinite(height)) {
            value = lib.C.calculateBMI(weight, height);
        }
        return new FormElementStatus(formElement.uuid, true, value);
    }

    static createProtienRDAFormElementStatus(protienIntake, formElement) {
        let value;
        protienIntake = protienIntake && protienIntake.getValue();
          if (Number.isFinite(protienIntake)) 
             value = Math.ceil((protienIntake * 100) / 55, 1);
        return new FormElementStatus(formElement.uuid, true, value);
    }

    static createCalorieRDAFormElementStatus(calorieIntake, formElement) {
        let value;
        calorieIntake = calorieIntake && calorieIntake.getValue();
          if (Number.isFinite(calorieIntake)) 
             value = Math.ceil((calorieIntake * 100) / 2230, 1);
        return new FormElementStatus(formElement.uuid, true, value);
    }


    static removeRecommendation(decisions, groupName, recommendationName, reason) {
        const defaultVal = {name: recommendationName, value: []};
        const group = decisions[groupName] = decisions[groupName] || [];
        const recommendation = group.find((d) => d.name === recommendationName) || (group.push(defaultVal), defaultVal);
        recommendation.value = recommendation.value || [];
        const withRemoved = recommendation.value.filter((r) => r.toUpperCase() !== reason.toUpperCase());
        const removedOrNot = (withRemoved.length !== recommendation.value.length);
        recommendation.value = withRemoved;
        return removedOrNot;
    }

    static addRecommendation(decisions, groupName, recommendationName, reason) {
        const defaultVal = {name: recommendationName, value: []};
        const group = decisions[groupName] = decisions[groupName] || [];
        const recommendation = group.find((d) => d.name === recommendationName) || (group.push(defaultVal), defaultVal);
        recommendation.value = recommendation.value || [];
        recommendation.value.push(reason);
        return decisions;
    }

    static createProgramEncounterVisitScheduleBuilder(programEncounter, visitSchedules) {
        const scheduleBuilder = new VisitScheduleBuilder({
            programEncounter,
            programEnrolment: programEncounter.programEnrolment
        });
        addSchedules(scheduleBuilder, visitSchedules);
        return scheduleBuilder;
    }

    static createEnrolmentScheduleBuilder(programEnrolment, visitSchedules) {
        const scheduleBuilder = new VisitScheduleBuilder({
            programEnrolment,
        });
        addSchedules(scheduleBuilder, visitSchedules);
        return scheduleBuilder;
    }

    static addSchedule(scheduleBuilder, name, encounterType, earliestDate, numberOfDaysForMaxOffset) {
        const maxDate = moment(earliestDate).add(numberOfDaysForMaxOffset, 'days').toDate();
        addSchedule(scheduleBuilder, {name, encounterType, earliestDate, maxDate});
    }

    static hideFormElementGroup(formElementGroup) {
        return formElementGroup.getFormElements().map(fe => new FormElementStatus(fe.uuid, false));
    }

    static scheduleOneVisit(scheduleBuilder, visitName, encounterTypeName, earliestDate, numberOfDaysForMaxOffset) {
        this.addSchedule(scheduleBuilder, visitName, encounterTypeName, earliestDate, numberOfDaysForMaxOffset);
        return scheduleBuilder.getAllUnique("encounterType");
    }

    static firstOfNextMonth(realEventDate) {
        const currentDate = moment(realEventDate).date();
        const month = moment(realEventDate).month() + 1;
        return moment(realEventDate).month(month).date(1).toDate();
    };

    static firstOfCurrentMonth(realEventDate) {
        const currentDate = moment(realEventDate).date();
        const month = moment(realEventDate).month();
        return moment(realEventDate).month(month).date(1).toDate();
    };
}

module.exports = RuleHelper;