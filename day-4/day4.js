const fs = require('fs');
const readline = require('readline');

async function main() {
    const filestream = fs.createReadStream('input.dat');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    let points = 0;
    for await (const line of rl) {
        let result = parseLine(line);
        let myWinningNumbers = result.myNumbers.filter(r => result.winningNumbers.includes(r));
        if (myWinningNumbers.length > 0) {
            points += Math.pow(2, myWinningNumbers.length - 1);
        }
    }
    console.log(points);
}

async function main2() {
    const filestream = fs.createReadStream('input.dat');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    let totalCopies = 0;
    let data = [];
    for await (const line of rl) {
        let result = parseLine(line);
        data.push(result);
    }

    for (let i = 0; i < data.length; ++i) {
        for (let c = 0; c < data[i].copies; ++c) {
            if (data[i].winningMatches > 0) {
                for (let j = 1; j <= data[i].winningMatches; ++j) {
                    data[i + j].copies += 1;
                }
            }
        }
        totalCopies += data[i].copies;
    }
    console.log(totalCopies);
}

function parseLine(line) {
    const result = {};
    const id = line.split(':')[0].match(/\d+/g)[0];
    result.id = id;
    const numbers = line.split(':')[1];
    const winningNumbers = numbers.split('|')[0]
        .trim()
        .replace(/ +(?= )/g, '')
        .split(' ');
    result.winningNumbers = winningNumbers;
    const myNumbers = numbers.split('|')[1]
        .trim()
        .replace(/ +(?= )/g, '')
        .split(' ');
    result.myNumbers = myNumbers;
    let myWinningNumbers = result.myNumbers.filter(r => result.winningNumbers.includes(r));
    result.winningMatches = myWinningNumbers.length;
    result.copies = 1;
    return result;
}

main();
main2();