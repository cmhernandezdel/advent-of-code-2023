const fs = require('fs');

async function main() {
    fs.readFile('input.dat', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        let parsedData = parse(data, false);
        let locations = parsedData.seeds
            .map(s => getLocationFromSeed(s, parsedData.maps));
        console.log('First solution: ' + Math.min(...locations));
    });
}

async function main2() {
    fs.readFile('input.dat', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        let parsedData = parse(data, true);
        let locations = parsedData.seeds
            .map(s => getMinLocationFromSeedRange(s, parsedData.maps));
        console.log('Second solution: ' + Math.min(...locations));
    });
}

function parseSeedsAsIndividualValues(seedsLine) {
    let seedsStr = seedsLine.split(':')[1];
    let seeds = extractNumbers(seedsStr);
    return seeds
}

function parseSeedsAsRanges(seedsLine) {
    let result = [];
    let seedsStr = seedsLine.split(':')[1];
    let seeds = extractNumbers(seedsStr);
    for (let i = 0; i < seeds.length; i += 2) {
        result.push({ start: seeds[i], rangeLength: seeds[i + 1] });
    }
    return result;
}

function parse(data, parseSeedsAsRange = false) {
    let parsed = {
        seeds: [],
        maps: []
    };
    const lines = data.split('\r\n');
    const seeds = parseSeedsAsRange ? parseSeedsAsRanges(lines[0]) : parseSeedsAsIndividualValues(lines[0]);

    parsed.seeds = seeds;

    let step = 0;
    for (let i = 1; i < lines.length; ++i) {
        const line = lines[i];
        if (line.includes('map:')) {
            parsed.maps.push([]);
            step += 1;
        }

        else if (hasNumbers(line)) {
            let mapping = extractNumbers(line);
            parsed.maps[step - 1].push(
                {
                    dstRangeStart: mapping[0],
                    srcRangeStart: mapping[1],
                    rangeLength: mapping[2]
                }
            );
        }
    }

    return parsed;
}

function getLocationFromSeed(seed, maps) {
    let current = seed;

    for (const map of maps) {
        for (const v of map) {
            if (current >= v.srcRangeStart && current <= v.srcRangeStart + v.rangeLength - 1) {
                let position = current - v.srcRangeStart;
                current = v.dstRangeStart + position;
                break;
            }
        }
    }

    return current;
}

function getMinLocationFromSeedRange(seedRange, maps) {
    let minLocation = undefined;

    for (let i = seedRange.start; i < seedRange.start + seedRange.rangeLength; ++i) {
        let location = getLocationFromSeed(i, maps);
        if (!minLocation || location < minLocation) {
            minLocation = location;
        }
    }

    return minLocation;
}

function hasNumbers(str) {
    return /\d/.test(str);
}

function extractNumbers(str) {
    return str
        .trim()
        .split(' ')
        .map(s => Number(s));
}

main();
main2();