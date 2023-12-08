const fs = require('fs');

const HIGH_CARD = 0;
const ONE_PAIR = 1;
const TWO_PAIR = 2;
const THREE_OF_A_KIND = 3;
const FULL_HOUSE = 4;
const FOUR_OF_A_KIND = 5;
const FIVE_OF_A_KIND = 6;

const HAND_LENGTH = 5;

async function main() {
    const rawData = await fs.promises.readFile('../input.dat', 'utf8');
    const data = parse(rawData);
    const sorted = sortHands(data);
    let winnings = 0;
    for (let rank = 1; rank <= sorted.length; rank++) {
        winnings += sorted[rank - 1].bidAmount * rank;
    }
    console.log('Second solution: ' + winnings);
}

function parse(rawData) {
    const data = []
    const dataLines = rawData.split('\r\n');
    for (const line of dataLines) {
        const lineInfo = parseLine(line);
        data.push(lineInfo);
    }
    return data;
}

function parseLine(line) {
    const lineInfo = line.split(' ');
    let hand = lineInfo[0];
    let handType = getHandType(hand);

    return {
        hand: hand,
        handType: handType,
        bidAmount: Number(lineInfo[1])
    }
}

function getHandType(hand) {
    let cards = [];
    let numberOfJokers = 0;
    for (const card of hand) {
        if (card === 'J') {
            numberOfJokers++;
            continue;
        }

        let index = cards.findIndex(e => e.value === card);
        if (index !== -1) {
            cards[index].count++;
        } else {
            cards.push({ count: 1, value: card });
        }
    }

    if (numberOfJokers > 0 && numberOfJokers < HAND_LENGTH) {
        let sortedCards = cards.sort((a, b) => b.count - a.count);
        sortedCards[0].count += numberOfJokers;
    }

    if (numberOfJokers === HAND_LENGTH) {
        return FIVE_OF_A_KIND;
    }

    if (cards.length === HAND_LENGTH) {
        return HIGH_CARD;
    }

    if (cards.length === HAND_LENGTH - 1) {
        return ONE_PAIR;
    }

    if (cards.length === 1) {
        return FIVE_OF_A_KIND;
    }

    if (cards.length === 2) {
        if (cards.find(e => e.count === 4)) return FOUR_OF_A_KIND;
        else return FULL_HOUSE;
    }

    if (cards.length === 3) {
        if (cards.find(e => e.count === 3)) return THREE_OF_A_KIND;
        else return TWO_PAIR;
    }
}

function sortHands(hands) {
    const sorted = hands.sort((a, b) => a.handType - b.handType || compareHands(a.hand, b.hand));
    return sorted;
}

function getCardValue(card) {
    switch (card) {
        case 'A': return 14;
        case 'K': return 13;
        case 'Q': return 12;
        case 'J': return 1;
        case 'T': return 10;
        default: return Number(card);
    }
}

function compareHands(a, b) {
    let index = 0;
    let cardSort = compareCards(a[index], b[index]);
    while (cardSort === 0 && index < HAND_LENGTH) {
        index++;
        cardSort = compareCards(a[index], b[index]);
    }
    return cardSort;
}

function compareCards(a, b) {
    return getCardValue(a) - getCardValue(b);
}

main();