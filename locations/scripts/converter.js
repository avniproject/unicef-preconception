const uuidv4 = require('uuid/v4');
const fs = require('fs');

if ('not required any more') {
    console.log('This file is checked-in into git only for reference.');
    console.log('There is no need to run this script unless new locations are provided.');
    console.log('In that case comment out or remove the existing `writeFile() function calls`');
    console.log('And process only the new files');
    process.exit(1);
}

const newLocation = (details, level, parents) => {
    const location = {
        uuid: uuidv4(),
        name: details.LocationName,
        type: details.LocationType,
        level: level,
    };

    let parent;
    if ((parents && parents.length && details.ParentLocation && details.ParentLocation !== 'NA')) {
        parent = parents.find(it => it.name === details.ParentLocation);
        if (!parent) {
            console.warn('parent not found' + details.ParentLocation);
        } else {
            location.parent = {uuid: parent.uuid};
        }
    }
    return location;
};

const newLocations = (fileName, level, parents) => {
    return require(`../fromXLfile/${fileName}`).map(it => newLocation(it, level, parents));
};

const writeFile = (fileName, json) => {
    fs.writeFileSync(`${__dirname}/../${fileName}.json`, JSON.stringify(json, null, 2));
};

const blocks = newLocations('Block', 3, []);
const phcs = newLocations('PHC', 2.6, blocks);
const subcenters = newLocations('Subcenter', 2.3, phcs);
const villages = newLocations('Village', 1, subcenters);
const wadis = newLocations('Wadi', 0.9, villages);

writeFile('blocks', blocks);
writeFile('phcs', phcs);
writeFile('subcenters', subcenters);
writeFile('villages', villages);
writeFile('wadis', wadis);
