import { CardIsOneOfType, cards as allCards, CardTypes } from "./cards";

//Hand size not including initial defuse
const handSize = 7;
const nonDupPlayableCardTypes = [CardTypes.Cats, CardTypes.Defuse, CardTypes.Explode];
//generates the deck
export const generateDeck = (cards) => {
    const nonDupedPlayableCards = cards.filter(card => !CardIsOneOfType(card, nonDupPlayableCardTypes))
    let baseDeck = cards.filter(card => CardIsOneOfType(card, CardTypes.Cats));

    let defuseCards = cards.filter(card => CardIsOneOfType(card, CardTypes.Defuse));
    baseDeck = baseDeck.concat(nonDupedPlayableCards);


    return { baseDeck, defuseCards };
};

export const generateDeckAndHands = (playerCount, shuffleFunc) => {
    // Copy cards to create a new deck for this game
    let cardsForGame = [...allCards];
    cardsForGame = duplicateCards(cardsForGame);
    cardsForGame = cardsForGame.map((c, idx) => ({ ...c, id: idx }));
    const { baseDeck, defuseCards } = generateDeck(cardsForGame);

    const playerHands = Array(playerCount);
    const dealingDeck = shuffleFunc(baseDeck);

    // Divvy'ing one card per player at a time emulates life to help with randomness, but is unnecessary
    // and memory inefficient for a computer; so we'll pop out a hand at a time
    for (let i = 0; i < playerCount; i++) {
        const hand = [...Array(handSize)].map(() => dealingDeck.pop())
        playerHands[i] = [defuseCards.pop(), ...hand];
    }

    // Insert remaining defuses and add exploding cards into deck
    let gameDeck = insertDefuseAndExplodingCards(cardsForGame, playerCount, dealingDeck, defuseCards);
    gameDeck = shuffleFunc(gameDeck);

    return {
        playerHands,
        deck: gameDeck,
    };
};

//inserts exploding cards into deck randomly
export const insertDefuseAndExplodingCards = (cards, playerCount, deck, defuses) => {
    let explodingCards = cards.filter(card => CardIsOneOfType(card, CardTypes.Explode));
    // Trim the exploding cards list to the number of players - 1
    explodingCards = explodingCards.slice(0, playerCount - 1);

    let remainingDefuses = defuses;
    if (playerCount < 4) {
        // if 2 or 3 players, we only put in 2 defuse cards into the deck, otherwise put them all in
        remainingDefuses = remainingDefuses.slice(0, 2);
    }
    return deck.concat(explodingCards).concat(remainingDefuses);
};

export function duplicateCards(cards) {
    return cards.reduce((res, current) => {
        return res.concat(Array(current.count).fill(current));
    }, []);
}
