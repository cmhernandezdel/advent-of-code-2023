const fs = require('fs');
const readline = require('readline');

async function main() {
    const filestream = fs.createReadStream('input.dat');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    const redCubesConstraint = 12, greenCubesConstraint = 13, blueCubesConstraint = 14;
    let sum = 0;
    for await (const line of rl) {
        let game = parseLine(line);
        let redConstraint = game.red.filter(r => r > redCubesConstraint);
        if (redConstraint.length > 0) continue;
        let blueConstraint = game.blue.filter(r => r > blueCubesConstraint);
        if (blueConstraint.length > 0) continue;
        let greenConstraint = game.green.filter(r => r > greenCubesConstraint);
        if (greenConstraint.length > 0) continue;

        sum += game.id;
    }

    return sum;
}

async function main2() {
    const filestream = fs.createReadStream('input.dat');
    const rl = readline.createInterface({
        input: filestream,
        crlfDelay: Infinity
    });

    let power = 0;
    for await (const line of rl) {
        let game = parseLine(line);
        let redCubes = Math.max(...game.red);
        let greenCubes = Math.max(...game.green);
        let blueCubes = Math.max(...game.blue);
        power += (redCubes * greenCubes * blueCubes);
    }

    return power;
}

function parseLine(line) {
    const r = /\d+/;
    let separation = line.split(':');
    let gameId = separation[0].match(r);
    let x = {
        id: parseInt(gameId),
        red: [],
        green: [],
        blue: []
    }

    let plays = separation[1].split(';');
    plays.forEach((play) => {
        let cubes = play.split(',');
        cubes.forEach((color) => {
            if (color.indexOf('blue') !== -1) {
                x.blue.push(parseInt(color.match(r)));
            } 
            
            else if (color.indexOf('red') !== -1) {
                x.red.push(parseInt(color.match(r)));
            } 
            
            else if (color.indexOf('green') !== -1) {
                x.green.push(parseInt(color.match(r)));
            }
        });
    });

    return x;
}

main().then(first => console.log(first));
main2().then(second => console.log(second));