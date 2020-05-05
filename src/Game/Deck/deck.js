import {CardIsOneOfType, cards, CardTypes} from "./cards";

const nonDupPlayableCardTypes = [CardTypes.Cats, CardTypes.Defuse, CardTypes.Explode];
//generates the deck
export const generateDeck = () => {
    const cardsToDup = cards.filter(card => card.count && card.count > 1)
    let baseDeck = duplicateCards(cardsToDup);

    const nonDupedPlayableCards = cards.filter(card => !CardIsOneOfType(card, nonDupPlayableCardTypes))
    baseDeck = baseDeck.concat(nonDupedPlayableCards);

    let defuseCards = cards.filter(card => CardIsOneOfType(card, CardTypes.Defuse));

    return { baseDeck, defuseCards };
};

//inserts exploding cards into deck randomly
export const insertExplodingCards = (ctx, deck) => {
    let explodingCards = cards.filter(card => CardIsOneOfType(card, CardTypes.Explode));
    //Trim the exploding cards list to the number of players - 1
    explodingCards = explodingCards.slice(0, ctx.numPlayers - 1);

    const newDeck = deck.concat(explodingCards);
    return shuffleDeck(ctx, newDeck, 3);
};

//Inserts remaining defuse cards into the deck
export const insertDefuseCards = (ctx, deck, defuses) => {
    let remainingDefuses = defuses;
    //if 2 or 3 players, we only put in 2 defuse cards into the deck, otherwise put them all in
    if (ctx.numPlayers < 4) {
        remainingDefuses = remainingDefuses.slice(0, 2);
    }

    const newDeck = deck.concat(remainingDefuses);
    return shuffleDeck(ctx, newDeck, 3);
};

export function duplicateCards(cards) {
    return cards.reduce((res, current) => {
        return res.concat(Array(current.count).fill(current));
    }, []);
}

function shuffleDeck(ctx, deck, times) {
    return [...Array(times)].reduce((r) => r = ctx.random.Shuffle(r), deck);
}