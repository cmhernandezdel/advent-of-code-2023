const fs = require('fs');

async function main1() {
    const rawData = await fs.promises.readFile('input.dat', 'utf8');
    let parsedData = parse(rawData);
    let time = parsedData[0];
    let space = parsedData[1];

    let totalWinningOptions = 0;
    for (let i = 0; i < time.length; ++i) {
        if (totalWinningOptions === 0) {
            totalWinningOptions += getWinningOptions(time[i], space[i]);
        } else {
            totalWinningOptions *= getWinningOptions(time[i], space[i]);
        }

    }
    console.log('Solution 1: ' + totalWinningOptions);
}

async function main2() {
    const rawData = await fs.promises.readFile('input.dat', 'utf8');
    let parsedData = parse(rawData);
    let time = Number(parsedData[0].reduce((acc, current) => acc += current.toString()));
    let space = Number(parsedData[1].reduce((acc, current) => acc += current.toString()));

    let totalWinningOptions = getWinningOptions(time, space);
    console.log('Solution 2: ' + totalWinningOptions);
}

function getWinningOptions(time, record) {
    let wins = 0;
    let currentTime = Math.floor(time / 2);

    while (currentTime > 0) {
        let distance = getDistanceFromHoldTime(currentTime, time);
        if (distance > record) {
            wins += 2;
            if (isFirstCalculationOfEvenTime(currentTime, time)) wins--;
            currentTime--;
        }
        else {
            return wins;
        }
    }

    return wins;
}

function getDistanceFromHoldTime(holdTime, totalTime) {
    return holdTime * (totalTime - holdTime);
}

function isFirstCalculationOfEvenTime(currentTime, totalTime) {
    let maxDistanceHoldTime = Math.floor(totalTime / 2);
    return (currentTime === maxDistanceHoldTime) && (totalTime % 2 === 0);
}

function parse(rawData) {
    return rawData
        .split('\r\n')
        .map(l => getNumericDataFromLine(l));
}

function getNumericDataFromLine(line) {
    return line
        .split(':')[1]
        .trim()
        .split(' ')
        .filter(e => e !== '')
        .map(l => Number(l));
}

main1();
main2();