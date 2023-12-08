const fs = require('fs');

async function main() {
    const rawData = await fs.promises.readFile('input.dat', 'utf8');
    let [steps, directions] = parseData(rawData);
    let currentNode = 'AAA';
    let nextStep = steps[0];
    let numberOfSteps = 0;

    while (currentNode !== 'ZZZ') {
        currentNode = directions[currentNode][nextStep];
        numberOfSteps++;
        nextStep = steps[numberOfSteps % (steps.length)];
    }

    console.log('First solution: ' + numberOfSteps);
}

function parseData(data) {
    const splitData = data.split('\r\n');
    const steps = splitData[0];
    const dict = {};

    for (let i = 2; i < splitData.length; ++i) {
        let [key, value] = parseLine(splitData[i]);
        dict[key] = value;
    }

    return [steps, dict];
}

function parseLine(line) {
    let splitLine = line.split('=');
    let key = splitLine[0].trim();

    let splitValue = splitLine[1].trimStart().split(',');
    let left = splitValue[0].replace('(', '');
    let right = splitValue[1].replace(')', '').trimStart();

    return [key, { L: left, R: right }];
}

main();