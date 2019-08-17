import {complicationsBuilder as ComplicationsBuilder, ProgramRule} from 'rules-config/rules';
import moment from 'moment';
import _ from "lodash";

const has = 'containsAnyAnswerConceptName',
    inEnrolment = 'valueInEnrolment',
    latest = 'latestValueInAllEncounters',
    inEntireEnrolment = 'valueInEntireEnrolment';

@ProgramRule({
    name: 'Preconception program summary',
    uuid: '0da2e63b-7be8-44bb-a26a-3f6e7e3d8525',
    programUUID: 'aedaf231-a9cb-4116-a356-eac4e862480c',
    executionOrder: 100.0,
    metadata: {}
})
class ProgramSummary {
    static getHighRisks(programEnrolment) {
        const builder = new ComplicationsBuilder({
            programEnrolment: programEnrolment,
            individual: programEnrolment.individual,
            complicationsConcept: 'High Risk Conditions'
        });

        const add = builder.addComplication.bind(builder);

        add("Age < 20").when.ageInYears.is.lessThan(20);

        add("Parity is 0 & age> 35").when[inEnrolment]("Parity").lessThan(1).and.when.ageInMonths.greaterThan(35);

        add("Low BMI").when[latest]("BMI").lessThan(18.5);

        add("High BMI").when[latest]("BMI").greaterThan(25);

        add('Tobacco consumption').when[inEnrolment]('Whether consumes tobacco')[has]("Yes");

        add('Alcohol consumption').when[inEnrolment]('Whether consumes alcohol')[has]("Yes");

        add('Low Calorie intake').when[inEnrolment]('Calorie % RDA').lessThan(70);

        add('Low Protein intake').when[inEnrolment]('Protein % RDA').lessThan(70);

        add("Haemoglobin < 12").when[latest]("Preconception Hb").lessThan(12);

        add("Woman is Rh negative and husband is Rh positive").when[inEntireEnrolment]("Blood group")[has]("AB-", "O-", "A-", "B-")
            .and.when[inEntireEnrolment]("Husband blood group")[has]("AB+", "O+", "A+", "B+");

        add("Suffering from hypertension").when[inEntireEnrolment]("Preconception hypertension").is.yes;

        add("Diabetes").when[inEntireEnrolment]("Preconception blood sugar ogt")[has]("Positive");

        add('Sickle cell anaemia positive').when[inEntireEnrolment]('Sickle cell anaemia solubility test')[has]("Positive");

        add('Sickle cell anaemia electrophoresis positive').when[inEntireEnrolment]('Sickle cell anaemia electrophoresis')[has]("Positive");

        add('HIV positive').when[inEntireEnrolment]('HIV')[has]("Positive");

        add('VDRL test Result positive').when[inEntireEnrolment]('VDRL test Result')[has]("Positive");

        add('RTI Symptoms positive').when[latest]('RTI Symptoms').is.yes;

        add("TSH > 12").when[inEntireEnrolment]("TSH").greaterThan(12);

        add('Other illness').when[latest]('Any other illness')[has]("Yes");

        const complications = builder.getComplications();
        complications.abnormal = true;
        return complications;
    }

    static exec(programEnrolment, summaries, context, today) {
        const highRisks = ProgramSummary.getHighRisks(programEnrolment, today);
        const conceptService = context.get('conceptService');
        highRisks.value = highRisks.value.map((name) => conceptService.conceptFor(name).uuid);
        if (highRisks.value.length) {
            summaries.push(highRisks);
        }
        const lmp = programEnrolment.findLatestObservationInEntireEnrolment("Last menstrual period");
        if (!_.isNil(lmp)) {
            summaries.push({name: 'Last menstrual period', value: lmp.getValue()});
        }
        const edd = programEnrolment.findLatestObservationInEntireEnrolment("Estimated Date of Delivery");
        if (!_.isNil(edd)) {
            summaries.push({name: 'Estimated Date of Delivery', value: edd.getValue()});
        }

        let bmiTrend = [];

        if(programEnrolment.hasObservation("BMI"))
        bmiTrend.push({BMI:programEnrolment.getObservationReadableValue("BMI")});

        _.chain(programEnrolment.getEncounters(true))
            .sortBy("earliestVisitDateTime")
            .map((encounter) => {
                if(!_.isNil(encounter.encounterDateTime)){
                    bmiTrend.push({BMI: encounter.getObservationReadableValue("BMI")})
            }
        }).value();
    
        if (!_.isNil(bmiTrend) && !_.isEmpty(bmiTrend)) {      
        summaries.push({name: 'BMI trend', value:  _.join((_.map(bmiTrend,"BMI")),'|')});
        }  
        
        let hbTrend = [];
        _.chain(programEnrolment.getEncounters(true))
            .sortBy("earliestVisitDateTime")
            .map((encounter) => {
                if(!_.isNil(encounter.encounterDateTime) &&  !_.isNil(encounter.getObservationReadableValue("Preconception Hb"))){
                hbTrend.push({HB: encounter.getObservationReadableValue("Preconception Hb")});
          }       
        })
        .value();
        
        if (!_.isNil(hbTrend) && !_.isEmpty(hbTrend)) {      
        summaries.push({name: 'Hb trend', value:  _.join((_.map(hbTrend,"HB")),'|')});
        }

        return summaries;
    }
}

export {
    ProgramSummary
}
