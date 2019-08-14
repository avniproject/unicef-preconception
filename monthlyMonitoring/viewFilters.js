import {
    FormElementStatusBuilder,
    FormElementsStatusHelper,
    RuleFactory,
    StatusBuilderAnnotationFactory,
    WithName
} from 'rules-config/rules';
import RuleHelper from "../shared/rules/RuleHelper";
import lib from '../lib'
import _ from 'lodash';

const filter = RuleFactory('3462178e-94e5-43d9-bc17-6cddad05c265', 'ViewFilter');
const WithStatusBuilder = StatusBuilderAnnotationFactory('programEncounter', 'formElement');

const getVisitNumber = (programEncounter) => {
    const visitNumber = (programEncounter.name || '').match(/\d+/g);
    return _.defaultTo(+visitNumber, 0);
};

@filter('5a5fcbfe-f3b3-4e69-8f5d-2855c373bb95', 'MonthlyMonitoringViewFilter', 100.0)
class MonthlyMonitoringViewFilter {
    static exec(programEncounter, formElementGroup, today) {
        return FormElementsStatusHelper
            .getFormElementsStatusesWithoutDefaults(new MonthlyMonitoringViewFilter(), programEncounter, formElementGroup, today);
    }

    getObservationValueFromEntireEnrolment(conceptName, programEncounter) {
        return programEncounter.programEnrolment.getObservationReadableValueInEntireEnrolment(conceptName, programEncounter);
    }

    @WithName('Counsel her to delay pregnancy by using contraceptives')
    @WithStatusBuilder
    _1([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.lessThan(20);
    }

    @WithName('Cousel her to visit PHC/RH/CH for further investigations and treatment')
    @WithStatusBuilder
    _2([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.greaterThan(35)
            .and.when.latestValueInEntireEnrolment('Gravida').is.lessThan(1);
    }

    @WithName('Diet advice to increase or increase weight respectively as per diet chart')
    @WithStatusBuilder
    _3([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("BMI").is.lessThan(18.5)
            .or.when.latestValueInEntireEnrolment("BMI").is.greaterThan(25.0);
    }

    @WithName('Counsel her to quit tobacco consumption')
    @WithStatusBuilder
    _4([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Whether consumes tobacco").is.yes;
    }

    @WithName('Counsel her to quit alcohol consumption')
    @WithStatusBuilder
    _5([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Whether consumes alcohol").is.yes;
    }

    @WithName('Counsel her to increase whole cereals in diet')
    @WithStatusBuilder
    _6([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Calorie % RDA").is.lessThan(70);
    }

    @WithName('Counsel her to increase proteins in diet')
    @WithStatusBuilder
    _7([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Protein % RDA").is.lessThan(70);
    }

    @WithName('Counsel her for anaemia treatment')
    @WithStatusBuilder
    _8([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("Preconception Hb").is.lessThan(12)
            .or.when.latestValueInPreviousEncounters("Sickle cell anaemia solubility test").containsAnyAnswerConceptName("Positive");
    }

    @WithName('Counsel woman to take Anti D injection')
    @WithStatusBuilder
    _9([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Blood group").containsAnyAnswerConceptName("AB-", "O-", "A-", "B-")
            .and.when.latestValueInEntireEnrolment("Husband blood group").containsAnyAnswerConceptName("AB+", "O+", "A+", "B+");
    }

    @WithName('Counsel her for hypertension treatment')
    @WithStatusBuilder
    _10([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('Preconception hypertension').is.yes;
    }

    @WithName('Counsel her for diabetes treatment')
    @WithStatusBuilder
    _11([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters('Preconception blood sugar ogt').containsAnyAnswerConceptName("Positive");
    }

    @WithName('Counsel her for sickle cell anaemia treatment')
    @WithStatusBuilder
    _12([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("Sickle cell anaemia solubility test").containsAnyAnswerConceptName("Positive");
    }

    @WithName('Counsel her for HIV treatment')
    @WithStatusBuilder
    _13([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("HIV").containsAnyAnswerConceptName("Positive");
    }

    @WithName('Counsel her for VDRL infection treatment')
    @WithStatusBuilder
    _14([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("VDRL test Result").containsAnyAnswerConceptName("Positive");
    }

    @WithName('Counsel her for RTI STI treatment')
    @WithStatusBuilder
    _15([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("RTI Symptoms").containsAnyAnswerConceptName("Yes");
    }

    @WithName('Counsel her for TSH treatment')
    @WithStatusBuilder
    _16([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("TSH").is.greaterThan(10);
    }

    @WithName('Counsel her for other illness treatment')
    @WithStatusBuilder
    _17([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInPreviousEncounters("Any other illness").containsAnyAnswerConceptName("Yes");
    }

    @WithName('Counselling of high risk factors')
    @WithStatusBuilder
    _18([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.lessThan(20)
            .or.when.latestValueInEntireEnrolment("Age").is.greaterThan(35)
            .or.when.latestValueInEntireEnrolment("BMI").is.lessThan(18.5)
            .or.when.latestValueInEntireEnrolment("BMI").is.greaterThan(25.0)
            .or.when.latestValueInEntireEnrolment("Whether consumes tobacco").is.yes
            .or.when.latestValueInEntireEnrolment("Whether consumes alcohol").is.yes
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

    @WithName('Advice followed')
    @WithStatusBuilder
    _19([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.latestValueInEntireEnrolment("Age").is.lessThan(20)
            .or.when.latestValueInEntireEnrolment("Age").is.greaterThan(35)
            .or.when.latestValueInEntireEnrolment("BMI").is.lessThan(18.5)
            .or.when.latestValueInEntireEnrolment("BMI").is.greaterThan(25.0)
            .or.when.latestValueInEntireEnrolment("Whether consumes tobacco").is.yes
            .or.when.latestValueInEntireEnrolment("Whether consumes alcohol").is.yes
            .or.when.latestValueInEntireEnrolment("Calorie % RDA").is.lessThan(70)
            .or.when.latestValueInEntireEnrolment("Protein % RDA").is.lessThan(70);
    }

    @WithName('Treatment of high risk illnesses')
    @WithStatusBuilder
    _20([programEncounter, formElement], statusBuilder) {
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

    @WithName('Missed period')
    @WithStatusBuilder
    _21([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().whenItem(true).is.truthy;
    }

    @WithName('UPT done if period missed')
    @WithStatusBuilder
    _22([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Missed period").is.yes;
    }

    @WithName('Last menstrual period')
    @WithStatusBuilder
    _221([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
    }

    @WithName('Estimated date of delivery')
    @WithStatusBuilder
    _222([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").containsAnyAnswerConceptName("Positive");
        const builder = statusBuilder.build();
        let lmp = programEncounter.getObservationValue('Last menstrual period');
        if (!_.isNil(lmp)) {
            builder.value = lib.calculations.estimatedDateOfDelivery(programEncounter);
        }
        return builder;
    }

    @WithName('Haemoglobin')
    @WithStatusBuilder
    _23([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
        const status = statusBuilder.build();
        status.visibility = status.visibility && [4, 7, 10, 13, 16, 19, 22].includes(getVisitNumber(programEncounter));
        return status;
    }

    @WithName('Weight')
    @WithStatusBuilder
    _24([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
    }

    @WithName('BMI')
    @WithStatusBuilder
    _25([programEncounter, formElement], statusBuilder) {
        let height = this.getObservationValueFromEntireEnrolment("Preconception Height", programEncounter);
        let weight = programEncounter.findObservation("Preconception Weight");
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
        statusBuilder.value(RuleHelper.calculateBMIStatusBuiler(height, weight));
        return statusBuilder.build();
    }

    @WithName('Any RTI Symptoms')
    @WithStatusBuilder
    _26([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
    }

    @WithName('Whether RTI Treatment taken')
    @WithStatusBuilder
    _27([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("RTI Symptoms").containsAnyAnswerConceptName("Yes");
    }

    @WithName('Any other illness')
    @WithStatusBuilder
    _28([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
    }

    @WithName('If any other illness, specify')
    @WithStatusBuilder
    _29([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }

    @WithName('Any other illness treatment')
    @WithStatusBuilder
    _30([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }

    @WithName('Deworming tablet received- Albendazole')
    @WithStatusBuilder
    _31([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
        const status = statusBuilder.build();
        status.visibility = status.visibility && [7, 13, 19].includes(getVisitNumber(programEncounter));
        return status;
    }

    @WithName('IFA - Iron and Folic Acid')
    @WithStatusBuilder
    _32([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception Hb").is.lessThan(12);
    }

    @WithName('FA')
    @WithStatusBuilder
    _33([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception Hb").is.greaterThanOrEqualTo(12);
    }

    @WithName('Next monthly Visit Date')
    @WithStatusBuilder
    _34([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("UPT done if period missed").not.containsAnyAnswerConceptName("Positive");
    }

    @WithName("BCC-2- Documentary film")
    @WithStatusBuilder
    _341([programEncounter, formElement], statusBuilder) {
        const status = statusBuilder.build();
        status.visibility = [3].includes(getVisitNumber(programEncounter));
        // programEncounter.programEnrolment.numberOfEncountersOfType(programEncounter.encounterType.name) === 3;
        return status;
    }

    @WithName("BCC-3- Voice and text messages")
    @WithStatusBuilder
    _342([programEncounter, formElement], statusBuilder) {
        const status = statusBuilder.build();
        status.visibility = [5].includes(getVisitNumber(programEncounter));
        //  programEncounter.programEnrolment.numberOfEncountersOfType(programEncounter.encounterType.name) === 5;
        return status;
    }

    @WithName('Counsel her for anaemia treatment')
    @WithStatusBuilder
    _35([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Preconception Hb").is.lessThan(12);
    }

    @WithName('Ask her to follow diet advice')
    @WithStatusBuilder
    _36([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("BMI").is.lessThan(18.5)
            .or.when.valueInEncounter("BMI").is.greaterThan(25.0);
    }

    @WithName('Counsel her for RTI treatment')
    @WithStatusBuilder
    _37([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("RTI Symptoms").is.yes;
    }

    @WithName('Counsel for other illness treatment')
    @WithStatusBuilder
    _38([programEncounter, formElement], statusBuilder) {
        statusBuilder.show().when.valueInEncounter("Any other illness").is.yes;
    }
}

export {
    MonthlyMonitoringViewFilter
}
