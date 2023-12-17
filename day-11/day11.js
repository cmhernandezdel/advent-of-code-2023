const fs = require('fs');

const distances = {};

async function main() {
    const rawData = await fs.promises.readFile(process.argv[2], 'utf8');
    const parsedData = parse(rawData);

    console.log(parsedData.map(s => s.join("")).join('\r\n'));
    calculateDistances(parsedData, 1000000);

    const sum = calculateSum();
    console.log("🚀 ~ file: day11.js:10 ~ main ~ sum:", sum)
}

function parse(rawData) {
    const parsedData = [];
    const lines = rawData.split('\r\n');
    const columnsWithoutGalaxies = Array.from({ length: lines[0].length }, (value, index) => index);
    let parsedDataIndex = 0;
    let galaxyIndex = 0;

    for (let i = 0; i < lines.length; ++i) {
        const lineLength = lines[i].length;
        if (!lines[i].includes('#')) {
            parsedData.push(Array.from('X'.repeat(lineLength)));
            parsedDataIndex++;
            continue;
        }

        parsedData.push([]);

        for (let j = 0; j < lineLength; ++j) {
            if (lines[i][j] === '#') {
                distances[galaxyIndex.toString()] = {};
                parsedData[parsedDataIndex].push(galaxyIndex++);
            }
            else {
                parsedData[parsedDataIndex].push(lines[i][j]);
            }
            if (lines[i][j] === '#' && columnsWithoutGalaxies.includes(j)) {
                columnsWithoutGalaxies.splice(columnsWithoutGalaxies.indexOf(j), 1);
            }
        }

        parsedDataIndex++;
    }

    for (const colIndex of columnsWithoutGalaxies) {
        for (let i = 0; i < parsedData.length; ++i) {
            const row = parsedData[i];
            const newRow = [
                ...row.slice(0, colIndex),
                'X',
                ...row.slice(colIndex + 1)
            ];

            parsedData[i] = newRow;
        }
    }
    return parsedData;
}

function calculateDistances(data, xValue) {
    const galaxies = [];
    const x = [];
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < data[i].length; ++j) {
            if (data[i][j] !== '.' && data[i][j] !== 'X') {
                galaxies.push({ key: data[i][j], row: i, col: j });
            }
            if (data[i][j] === 'X') {
                x.push({ row: i, col: j });
            }
        }
    }

    let c1 = 0;
    while (c1 !== galaxies.length) {
        let g1 = galaxies.find(g => g.key === c1);
        let c2 = c1 + 1;
        while (c2 !== galaxies.length) {
            let g2 = galaxies.find(g => g.key === c2);
            let xDistance = Math.abs(g1.col - g2.col);
            let yDistance = Math.abs(g1.row - g2.row);

            let xBetweenGalaxiesHorizontal = 0, xBetweenGalaxiesVertical = 0;
            if (g1.col < g2.col) {
                xBetweenGalaxiesHorizontal = x.filter(e => e.row === g1.row && e.col > g1.col && e.col < g2.col).length;
            }
            else {
                xBetweenGalaxiesHorizontal = x.filter(e => e.row === g1.row && e.col > g2.col && e.col < g1.col).length;
            }

            xBetweenGalaxiesVertical = x.filter(e => e.col === g1.col && e.row > g1.row && e.row < g2.row).length;
            let totalX = xBetweenGalaxiesHorizontal + xBetweenGalaxiesVertical;

            if (!distances[c1.toString()][c2.toString()]) {
                distances[c1.toString()][c2.toString()] = xDistance + yDistance + totalX * (xValue - 1);
            }
            if (!distances[c2.toString()][c1.toString()]) {
                distances[c2.toString()][c1.toString()] = xDistance + yDistance + totalX * (xValue - 1);
            }
            c2++;
        }
        c1++;
    }
}

function calculateSum() {
    let computedKeys = [];
    let i = 0;
    let sum = 0;

    while (i < Object.keys(distances).length) {
        let computingKey = i.toString();
        let keys = Object.keys(distances[computingKey]);
        for (const k of keys) {
            if (computedKeys.includes(k)) continue;
            sum += distances[computingKey][k];
        }
        computedKeys.push(computingKey);
        i++;
    }

    return sum;
}

main();