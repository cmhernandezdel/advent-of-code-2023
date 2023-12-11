const fs = require('fs');

async function main() {
    const rawData = await fs.promises.readFile('input.dat', 'utf8');
    const data = parse(rawData);
    let maxDistance = calculatePathLength(data.startingX, data.startingY, data.matrix)
    console.log(maxDistance / 2);
}

function parse(rawData) {
    let i = 0;
    const parsedData = { matrix: [], startingX: 0, startingY: 0 };
    const rows = rawData.split('\r\n');
    for (const row of rows) {
        let r = [];
        let j = 0;
        for (const c of row) {
            if (c === '.') {
                r.push({
                    neighbors: [],
                    value: '.'
                });
            }
            else {
                if (c === 'S') {
                    parsedData.startingX = i;
                    parsedData.startingY = j;

                    r.push({
                        neighbors: ['n', 's', 'w', 'e'],
                        value: 'S'
                    });
                }

                else {
                    r.push({
                        neighbors: getNeighboringDirections(c),
                        value: 'P'
                    });
                }
            }
            j++;
        }
        parsedData.matrix.push(r);
        i++;
    }

    parsedData.matrix[parsedData.startingX][parsedData.startingY].neighbors = getNeighborsOfStart(parsedData.startingX, parsedData.startingY, parsedData.matrix);
    return parsedData;
}

function calculatePathLength(startX, startY, matrix) {
    let pathLength = 0;
    let current = { x: startX, y: startY };
    let step = 'n';

    do {
        let element = matrix[current.x][current.y];
        step = getStep(element, step);
        current = getNext(current, step);
        pathLength++;
    } while (current.x !== startX || current.y !== startY);

    return pathLength;
}

function getNext(current, step) {
    switch (step) {
        case 'n':
            return { x: current.x - 1, y: current.y };
        case 's':
            return { x: current.x + 1, y: current.y };
        case 'e':
            return { x: current.x, y: current.y + 1 };
        case 'w':
            return { x: current.x, y: current.y - 1 };
    }
}

function getStep(currentElement, lastStep) {
    return currentElement.neighbors.find(n => n !== getOpposite(lastStep));
}

function getOpposite(direction) {
    switch (direction) {
        case 'n': return 's';
        case 's': return 'n';
        case 'e': return 'w';
        case 'w': return 'e';
    }
}

function getNeighboringDirections(element) {
    const neighboringDirections = [];
    if (element === '|' || element === 'L' || element === 'J') neighboringDirections.push('n');
    if (element === '|' || element === '7' || element === 'F') neighboringDirections.push('s');
    if (element === '-' || element === 'J' || element === '7') neighboringDirections.push('w');
    if (element === '-' || element === 'L' || element === 'F') neighboringDirections.push('e');
    return neighboringDirections;
}

function getNeighborsOfStart(startX, startY, matrix) {
    const neighbors = [];
    const westNeighbor = startY > 0 ? matrix[startX][startY - 1] : null;
    const eastNeighbor = startY < matrix[startX].length - 1 ? matrix[startX][startY + 1] : null;
    const northNeighbor = startX > 0 ? matrix[startX - 1][startY] : null;
    const southNeighbor = startX < matrix.length - 1 ? matrix[startX + 1][startY] : null;

    if (westNeighbor !== null && westNeighbor.neighbors.includes('e')) {
        neighbors.push('w');
    }

    if (eastNeighbor !== null && eastNeighbor.neighbors.includes('w')) {
        neighbors.push('e');
    }

    if (northNeighbor !== null && northNeighbor.neighbors.includes('s')) {
        neighbors.push('n');
    }

    if (southNeighbor !== null && southNeighbor.neighbors.includes('n')) {
        neighbors.push('s');
    }

    return neighbors;
}

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

main();