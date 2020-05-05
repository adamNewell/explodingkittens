import { generateDeckAndHands } from "./Deck/deck";
import { CardIsOneOfType, CardTypes } from './Deck/cards';
import { ALIVE, EXPLODED } from "./playerStatus";

//Hand size not including initial defuse
const handSize = 7;
//export const NOPE_TIMEOUT = 2500;
export const NOPE_TIMEOUT = 250000;
// https://stackoverflow.com/questions/9756120/how-do-i-get-a-utc-timestamp-in-javascript
export const utcUnixTimestamp = () => {
    var d1 = new Date();
    return Math.floor(d1.getTime());
}

function shuffleDeck(shuffleFunc, deck, times) {
    //Shuffle the deck, do it three times as is tradition
    return [...Array(times)].reduce((r) => r = shuffleFunc(r), deck);
}

export function defaultFavor() {
    return {
        active: false,
        willReceive: undefined,
        willGive: undefined,
    }
}

function defaultCardPlayed() {
    return {
        cards: undefined,
        utcUnixTimePlayed: undefined,
        playersForgoNope: [],
        nopers: [],
    }
}

export const DetonatingBabyFelines = {
    name: "DetonatingBabyFelines",
    minPlayers: 2,
    maxPlayers: 5,
    setup: getInitialState,
    turn: {
        order: {
            // Get the initial value of playOrderPos.
            // This is called at the beginning of the phase.
            first: (G, ctx) => 0,
            // This is called at the end of each turn.
            // The phase ends if this returns undefined.
            next: (G, ctx) => {
                // find the next player who is not exploded
                for (let i = 1; i <= ctx.playOrder.length; i++) {
                    let nextId = (ctx.playOrderPos + i) % ctx.playOrder.length;
                    if (G.players[nextId].status != EXPLODED) {
                        return nextId;
                    }
                }
            },
        },
        activePlayers: {
            currentPlayer: { stage: 'play' },
            others: { stage: 'block' }
        },
        stages: {
            play: {
                moves: { nope, holdNope, chainResolved, drawCard, playCards, returnCards, attack, shuffle, skip, seeTheFuture, favor, giveCard, twoOfAKind, threeOfAKind, fiveDifferent, chat }
            },
            defuse: {
                moves: { defuse, explode, chat }
            },
            give: {
                moves: { giveCard, chat }
            },
            block: {
                moves: { nope, holdNope, chat }
            }
        }
    },
    endIf: (G, ctx) => {
        return G.players.filter(p => p.status == EXPLODED).length === ctx.numPlayers - 1;
    }
};

export function getInitialState(ctx) {
    const G = {
        players: [],
        deck: [],
        discardPile: [],
        chat: [],
        cardPlayed: defaultCardPlayed(),
        turnCounter: 1,
        favor: defaultFavor()
    };

    //Initialize players
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.players[i] = {
            hand: [],
            status: ALIVE,
            id: i,
            name: 'Player ' + i,
        }
    }

    // Reduce code copy by making an easy access to the shuffle in here
    const shuffleFunc = (deck) => shuffleDeck(ctx.random.Shuffle, deck, 3);
    const { playerHands, deck } = generateDeckAndHands(ctx.numPlayers, shuffleFunc);
    G.deck = deck;

    //Assign dealt hands and deck to the game object
    for (let j = 0; j < ctx.numPlayers; j++) {
        G.players[j].hand = playerHands[j];
    }

    return G;
}

function discardCards(G, playerIndex, cards) {
    let hand = G.players[playerIndex].hand;

    for (let card of cards) {
        let index = hand.findIndex(e => e.id === card.id);

        hand.splice(index, 1);
        G.discardPile.push(card)
    }
}

function giveCard(G, ctx, card) {
    const {
        willReceive,
        willGive,
    } = G.favor;

    let playerHand = G.players[willGive].hand;
    let opponentHand = G.players[willReceive].hand;
    let cardToGive = null;
    let index = playerHand.findIndex(e => e.id === card.id);
    playerHand.splice(index, 1);
    cardToGive = card;
    opponentHand.push(cardToGive);
    G.favor = defaultFavor();
    ctx.events.setStage('block');
}

function stealCard(G, ctx, targetPlayer, stealType = null, stealIndex = null) {
    let playerHand = G.players[ctx.currentPlayer].hand;
    let opponentHand = G.players[targetPlayer].hand;
    const cardsOfType = (card) => card.type === stealType;

    if (stealType !== null) {
        stealIndex = opponentHand.findIndex(cardsOfType);
    }

    if (stealIndex === null) {
        stealIndex = Math.floor(Math.random() * opponentHand.length);
    }

    if (stealIndex > -1) {
        let stolenCard = opponentHand[stealIndex];

        opponentHand.splice(stealIndex, 1);
        playerHand.push(stolenCard);
    }
}

function playCards(G, ctx, cards) {
    discardCards(G, ctx.currentPlayer, cards);

    G.cardPlayed = {
        cards,
        utcUnixTimePlayed: utcUnixTimestamp(),
        playersForgoNope: [ctx.currentPlayer],
        nopers: [],
    };
}

function returnCards(G, ctx, cards) {
    let hand = G.players[ctx.currentPlayer].hand;

    for (let card of cards) {
        let index = G.discardPile.findIndex(e => e.id === card.id);

        G.discardPile.splice(index, 1);
        hand.push(card);
    }
}

function drawCard(G, ctx) {
    let drawnCard = G.deck.pop()
    const currentPlayer = G.players[ctx.currentPlayer]
    currentPlayer.hand.push(drawnCard)
    const defuse = currentPlayer.hand.find(c => CardIsOneOfType(c, CardTypes.Defuse))

    // If the user drew an explode and has a defuse, give them a choice. Otherwise they lose the game
    if (CardIsOneOfType(drawnCard, CardTypes.Explode)) {
        if (defuse) {
            ctx.events.setStage('defuse');
        } else {
            explode(G, ctx);
        }
    } else {
        endTurn(G, ctx);
    }
}

function endTurn(G, ctx) {
    if (G.turnCounter > 1) {
        G.turnCounter--;
        ctx.events.endTurn({ next: ctx.currentPlayer });
    } else {
        ctx.events.endTurn()
    }
}

// Card Actions

function attack(G, ctx) {
    // playing an attack while the counter is greater than 1 adds to the counter and forces the next player to take the extra turns
    if (G.turnCounter === 1) {
        G.turnCounter += 1;
    } else {
        G.turnCounter += 2;
    }
    ctx.events.endTurn();
}

function explode(G, ctx) {
    let player = G.players[ctx.currentPlayer]

    //Change status to exploded
    player.status = EXPLODED
    // Discard entire hand
    G.discardPile = G.discardPile.concat(player.hand)
    player.hand = []

    G.players[ctx.currentPlayer] = player
    G.turnCounter = 1;
    //end turn
    endTurn(G, ctx);
}

function favor(G, ctx, targetPlayer) {
    G.favor = {
        active: true,
        willReceive: ctx.currentPlayer,
        willGive: targetPlayer,
    };
    ctx.events.setActivePlayers({
        revert: true,
        value: {
            [targetPlayer.toString()]: { stage: 'give' },
        },
    });
}

function nope(G, ctx, playerID, card) {
    discardCards(G, playerID, [card]);
    G.cardPlayed = {
        ...G.cardPlayed,
        utcUnixTimePlayed: utcUnixTimestamp(),
        playersForgoNope: [playerID],
        nopers: [...G.cardPlayed.nopers, playerID],
    };
}

function chainResolved(G, ctx) {
    G.cardPlayed = defaultCardPlayed();
}

function holdNope(G, ctx, playerID) {
    const distinct = new Set([...G.cardPlayed.playersForgoNope, playerID]);
    G.cardPlayed.playersForgoNope = [...distinct];
}

function seeTheFuture(G) {
}

function shuffle(G, ctx) {
    G.deck = shuffleDeck(ctx.random.Shuffle, G.deck, 3);
}

function skip(G, ctx) {
    endTurn(G, ctx);
}

function defuse(G, ctx, discard, index) {
    //Exploding card was the last drawn card
    let explode = G.players[ctx.currentPlayer].hand.pop()

    //Change player status back to alive
    G.players[ctx.currentPlayer].status = ALIVE

    //Insert explode card back in at the users selected index
    G.deck.splice(index, 0, explode)

    //Discard the defuse card
    discardCards(G, ctx.currentPlayer, [discard])
    endTurn(G, ctx)
}

function chat(G, ctx, playerID, msg) {
    G.chat = [...G.chat, { time: new Date(), playerID: playerID, msg }];
}

// Combos

function twoOfAKind(G, ctx, targetPlayer) {
    stealCard(G, ctx, targetPlayer)
}

function threeOfAKind(G, ctx, targetPlayer, stealType) {
    stealCard(G, ctx, targetPlayer, stealType)
}

function fiveDifferent(G, ctx, discardIndex) {
    let card = G.discardPile[discardIndex];
    G.players[ctx.currentPlayer].hand.push(card);
    G.discardPile.splice(discardIndex, 1);
}