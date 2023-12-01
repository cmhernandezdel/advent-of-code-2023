const fs = require('fs');
const readline = require('readline');

const strDigits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

async function main(includeSpelledOutDigits) {
    const filestream = fs.createReadStream('input.dat');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    let accumulated = 0;
    for await (const line of rl) {
        let { firstDigit, lastDigit } = includeSpelledOutDigits ?
            getFirstAndLastDigitsWithSpelledOutNumbers(line) : getFirstAndLastDigitsWithoutSpelledOutNumbers(line);
        accumulated = accumulated + parseInt(firstDigit.concat(lastDigit));
    }

    return accumulated;
}

function firstIndexOfInArray(str, arr) {
    let firstIndex = Number.MAX_SAFE_INTEGER;
    let firstOccurrence = '';
    for (let i = 0; i < arr.length; ++i) {
        let substr = arr[i];
        let index = str.indexOf(substr);
        if (index !== -1 && index < firstIndex) {
            firstIndex = index;
            firstOccurrence = substr;
        }
    }
    return { firstIndex, firstOccurrence };
}

function lastIndexOfInArray(str, arr) {
    let lastIndex = -1;
    let lastOccurrence = '';
    for (let i = 0; i < arr.length; ++i) {
        let substr = arr[i];
        let index = str.lastIndexOf(substr);
        if (index !== -1 && index > lastIndex) {
            lastIndex = index;
            lastOccurrence = substr;
        }
    }
    return { lastIndex, lastOccurrence };
}

function parseStrDigit(str) {
    switch (str) {
        case 'one':
            return '1';
        case 'two':
            return '2';
        case 'three':
            return '3';
        case 'four':
            return '4';
        case 'five':
            return '5';
        case 'six':
            return '6';
        case 'seven':
            return '7';
        case 'eight':
            return '8';
        case 'nine':
            return '9';
    }
}

function getFirstAndLastDigitsWithSpelledOutNumbers(line) {
    let strFirstDigitInfo = firstIndexOfInArray(line, strDigits);
    let numberFirstDigitInfo = firstIndexOfInArray(line, digits);
    let strLastDigitInfo = lastIndexOfInArray(line, strDigits);
    let numberLastDigitInfo = lastIndexOfInArray(line, digits);

    let firstDigit = strFirstDigitInfo.firstIndex < numberFirstDigitInfo.firstIndex ?
        parseStrDigit(strFirstDigitInfo.firstOccurrence) : numberFirstDigitInfo.firstOccurrence;

    let lastDigit = strLastDigitInfo.lastIndex > numberLastDigitInfo.lastIndex ?
        parseStrDigit(strLastDigitInfo.lastOccurrence) : numberLastDigitInfo.lastOccurrence;

    return { firstDigit, lastDigit }
}

function getFirstAndLastDigitsWithoutSpelledOutNumbers(line) {
    let firstDigit = firstIndexOfInArray(line, digits).firstOccurrence;
    let lastDigit = lastIndexOfInArray(line, digits).lastOccurrence;
    return { firstDigit, lastDigit };
}

main(false).then((res) => console.log('First part: ' + res));
main(true).then((res) => console.log('Second part: ' + res));