const fs = require('node:fs');

let digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

fs.readFile('input.dat', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    //let firstResult = main1(data);
    let secondResult = main2(data);
    console.log(secondResult);
});

function main1(data) {
    let parsedData = [];
    let lines = data.split('\r\n');
    let sum = 0;

    for (let line of lines) {
        let lineData = parse(line);
        parsedData.push(lineData);
        sum += getAdjacentNumbers(lineData).reduce((partial, element) => partial + element, 0);
    }
    sum += getVerticalAndDiagonalNumbers(parsedData).reduce((partial, element) => partial + element, 0);
    return sum;
}

function main2(data) {
    let parsedData = [];
    let lines = data.split('\r\n');
    let sum = 0;

    for (let line of lines) {
        let lineData = parse(line);
        parsedData.push(lineData);
    }
    sum += getAdjacentGearsSum(parsedData);
    return sum;
}

function parse(line) {
    let data = {
        n: [],
        s: []
    }

    let isParsingNumber = false;
    let currentNumber = '';
    let currentStartIndex = -1;
    for (let i = 0; i < line.length; ++i) {
        if (digits.indexOf(line[i]) !== -1) {
            if (isParsingNumber) {
                currentNumber += line[i];
            } else {
                currentNumber = line[i];
                data.n.push({ startingIndex: i });
                currentStartIndex = i;
                isParsingNumber = true;
            }
        }

        else {
            if (isParsingNumber) {
                let objToModify = data.n.find(o => o.startingIndex === currentStartIndex);
                objToModify.endingIndex = i - 1;
                objToModify.value = parseInt(currentNumber);

                isParsingNumber = false;
                currentNumber = '';
                currentStartIndex = -1;
            }

            if (line[i] !== '.') {
                data.s.push({ index: i, value: line[i] });
            }
        }
    }

    if (isParsingNumber) {
        let objToModify = data.n.find(o => o.startingIndex === currentStartIndex);
        objToModify.endingIndex = line.length - 1;
        objToModify.value = parseInt(currentNumber);
    }

    return data;
}

function getAdjacentNumbers(lineData) {
    let values = [];
    for (let s of lineData.s) {
        let leftAdjacent = lineData.n.find(n => (n.startingIndex === s.index + 1));
        let rightAdjacent = lineData.n.find(n => (n.endingIndex === s.index - 1));
        if (leftAdjacent) values.push(leftAdjacent.value);
        if (rightAdjacent) values.push(rightAdjacent.value);
    }
    return values;
}

function getVerticalAndDiagonalNumbers(data) {
    let numbers = [];

    for (let i = 1; i < data.length; ++i) {
        if (hasSymbols(data[i - 1]) && hasNumbers(data[i])) {
            for (let s of data[i - 1].s) {
                for (let n of data[i].n) {
                    if (s.index >= n.startingIndex - 1 && s.index <= n.endingIndex + 1) {
                        numbers.push(n.value);
                    }
                }
            }
        }

        if (hasNumbers(data[i - 1]) && hasSymbols(data[i])) {
            for (let s of data[i].s) {
                for (let n of data[i - 1].n) {
                    if (s.index >= n.startingIndex - 1 && s.index <= n.endingIndex + 1) {
                        numbers.push(n.value);
                    }
                }
            }
        }
    }

    return numbers;
}

function getAdjacentGearsSum(data) {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
        if (hasGearSymbol(data[i])) {
            let gearPositions = data[i].s.filter(s => s.value === '*').map(s => s.index);
            for (let gearPos of gearPositions) {
                let adjacent = [];
                if (i > 0) adjacent = adjacent.concat(getAdjacentGearsVertical(data[i - 1], gearPos));
                if (i < data.length - 1) adjacent = adjacent.concat(getAdjacentGearsVertical(data[i + 1], gearPos));
                adjacent = adjacent.concat(getAdjacentGearsSides(data[i], gearPos));

                if (adjacent.length == 2) {
                    sum += (adjacent[0] * adjacent[1]);
                }
            }

        }
    }

    return sum;
}

function hasSymbols(line) {
    return line.s.length > 0;
}

function hasNumbers(line) {
    return line.n.length > 0;
}

function hasGearSymbol(line) {
    let filtered = line.s.filter(v => v.value === '*');
    return filtered.length > 0;
}

function getAdjacentGearsVertical(verticalLine, gearPosition) {
    return verticalLine.n.filter(n => gearPosition >= n.startingIndex - 1 && gearPosition <= n.endingIndex + 1).map(n => n.value);
}

function getAdjacentGearsSides(line, gearPosition) {
    let adjacent = [];
    let rightAdjacent = line.n.filter(n => (n.startingIndex === gearPosition + 1)).map(n => n.value);
    let leftAdjacent = line.n.filter(n => (n.endingIndex === gearPosition - 1)).map(n => n.value);

    if (rightAdjacent) adjacent = adjacent.concat(rightAdjacent);
    if (leftAdjacent) adjacent = adjacent.concat(leftAdjacent);
    return adjacent;
}