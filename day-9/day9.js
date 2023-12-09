const fs = require('fs');

async function main() {
    const rawData = await fs.promises.readFile('input.dat', 'utf8');
    const histories = parse(rawData);
    let sum = 0;
    for (const history of histories) {
        sum += calculateRootHistoryNextValue(history);
    }

    console.log('First part solution: ' + sum);
}

async function main2() {
    const rawData = await fs.promises.readFile('input.dat', 'utf8');
    const histories = parse(rawData);
    let sum = 0;
    for (const history of histories) {
        sum += calculateRootHistoryPreviousValue(history);
    }

    console.log('Second part solution: ' + sum);
}

function parse(rawData) {
    const parsedData = [];
    const lines = rawData.split('\r\n');
    for (const line of lines) {
        let values = line.split(' ').map(e => Number(e.trim()));
        parsedData.push(values);
    }
    return parsedData;
}

function findStepsBetweenNumbers(history) {
    const steps = [];
    for (let i = 0; i < history.length - 1; ++i) {
        steps.push(history[i + 1] - history[i]);
    }
    return steps;
}

function areAllValuesEqual(history) {
    return !history.some(function (value, index, array) {
        return value !== array[0];
    });
}

function calculateRootHistoryNextValue(rootHistory) {
    const intermediateHistories = [];
    let history = rootHistory;

    while (!areAllValuesEqual(history)) {
        intermediateHistories.push(history);
        history = findStepsBetweenNumbers(history);
    }

    let numberToAdd = history[history.length - 1];
    let step = intermediateHistories.length - 1;

    while (step >= 0) {
        numberToAdd = intermediateHistories[step][intermediateHistories[step].length - 1] + numberToAdd;
        step--;
    }

    return numberToAdd;
}

function calculateRootHistoryPreviousValue(rootHistory) {
    const intermediateHistories = [];
    let history = rootHistory;

    while (!areAllValuesEqual(history)) {
        intermediateHistories.push(history);
        history = findStepsBetweenNumbers(history);
    }

    let numberToAdd = history[0];
    let step = intermediateHistories.length - 1;

    while (step >= 0) {
        numberToAdd = intermediateHistories[step][0] - numberToAdd;
        step--;
    }

    return numberToAdd;
}

main();
main2();