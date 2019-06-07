const _ = require('lodash');
const csv = require('csvtojson');
const uuidv4 = require('uuid/v4');
const fs = require('fs');

main();

function convertAndWrite(jsonArray) {

    const loadOldAndAppendNew = (fileName, lineageCols, level, parents) => {
        let existingOnes = readFinalFile(fileName);
        let newOnes = buildLocation(jsonArray, lineageCols, level, parents);
        let oldAndNew = _.uniqBy(existingOnes.concat(newOnes), 'nameLineage');
        writeFinalFile(fileName, oldAndNew);
        return oldAndNew;
    };

    const blocks = loadOldAndAppendNew('blocks', ['BLOCK'], 3, []);
    const phcs = loadOldAndAppendNew('phcs', ['BLOCK', 'PHC'], 2.6, blocks);
    const subcenters = loadOldAndAppendNew('subcenters', ['BLOCK', 'PHC', 'SUBCENTER'], 2.3, phcs);
    const villages = loadOldAndAppendNew('villages', ['BLOCK', 'PHC', 'SUBCENTER', 'VILLAGE'], 1, subcenters);
    const wadis = loadOldAndAppendNew('wadis', ['BLOCK', 'PHC', 'SUBCENTER', 'VILLAGE', 'WADI'], 0.9, villages);

}

function buildLocation(sheet, colsForLineage, level, parents) {
    const currentCol = _.last(colsForLineage);
    const getLineage = (row) => buildLineage(row, colsForLineage);
    const getParentLineage = (row) => buildLineage(row, colsForLineage.slice(0, -1));

    return _.uniqBy(sheet, getLineage)
        .map(row => {
            const parent = _.find(parents, p => p.nameLineage === getParentLineage(row));
            const location = {
                uuid: uuidv4(),
                name: row[currentCol],
                type: _.camelCase(currentCol),
                level: level,
                nameLineage: getLineage(row),
                parent: parent && ({uuid: parent.uuid})
            };
            return location;
        });
}

function readFinalFile(fileName) {
    try {
        return require(`${__dirname}/../${fileName}.json`);
    } catch (e) {
        return [];
    }
}

function writeFinalFile(fileName, json) {
    fs.writeFileSync(`${__dirname}/../${fileName}.json`, JSON.stringify(json, null, 2));
}

function main() {
    csv().fromFile(`${__dirname}/../All.csv`).then(convertAndWrite);
}

function buildLineage(row, cols) {
    return cols.map(col => row[col]).join('.');
}
