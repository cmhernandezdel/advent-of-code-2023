const fs = require('fs');

async function main() {
    const rawData = await fs.promises.readFile('input.dat', 'utf8');
    let [steps, directions] = parseData(rawData);
    let firstNodes = findFirstNodes(directions);
    let pathLengths = [];

    for (let node of firstNodes) {
        let pathLength = getPathLength(node, steps, directions);
        pathLengths.push(pathLength);
    }

    console.log('Second solution: ' +  pathLengths.reduce(lcm));
}

var gcd = function (a, b) {
    return a ? gcd(b % a, a) : b;
}

var lcm = function (a, b) {
    return a * b / gcd(a, b);
}

function findFirstNodes(directions) {
    return Object.keys(directions).filter(k => k.endsWith('A'));
}

function getPathLength(node, steps, directions) {
    let numberOfSteps = 0;
    let currentNode = node;
    let nextStep = steps[0];

    while (!currentNode.endsWith('Z')) {
        currentNode = directions[currentNode][nextStep];
        numberOfSteps++;
        nextStep = steps[numberOfSteps % (steps.length)];
    }

    return numberOfSteps;
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