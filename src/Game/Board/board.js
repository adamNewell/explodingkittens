import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';
import ModalFactory from 'react-modal-promise';
import Button from "react-bootstrap/Button";
import {
    seeFutureModal,
    targetModal,
    viewPileModal,
    targetTypeModal,
    playNopedModal,
    explodeReinsertModal,
    DefuseModal,
    NopeModal,
    rulesModal
} from "./Modals/modals";
import { CardIsOneOfType, CardsOfTypes, CardTypesAsArray, CardTypes } from '../Deck/cards';
import { LobbyService } from "../../Lobby/LobbyService";
import Hand from "../components/Hand/Hand";
import { EXPLODED } from '../playerStatus';
import { utcUnixTimestamp, NOPE_TIMEOUT } from '../game';
import './board.scss';
import { Popup } from './Popup';
import Chat from '../components/Chat/Chat';

export class DBFBoard extends React.Component {

    static propTypes = {
        G: PropTypes.any.isRequired,
        ctx: PropTypes.any.isRequired,
        moves: PropTypes.any.isRequired,
        playerID: PropTypes.string,
        isActive: PropTypes.bool,
        isMultiplayer: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            players: [],
            showPopup: false,
            selectedCards: []
        };
    }

    componentDidMount() {
        const { gameID, playerID } = this.props;
        LobbyService.renameUser(gameID, playerID, LobbyService.getName());
    }

    componentDidUpdate() {
        const {
            ctx,
            G,
            playerID,
            moves,
        } = this.props;
        const isCurrentPlayer = ctx.currentPlayer == playerID;
        if (isCurrentPlayer && G.cardPlayed.cards) {
            const timeSincePlay = utcUnixTimestamp() - G.cardPlayed.utcUnixTimePlayed;
            if (timeSincePlay >= NOPE_TIMEOUT || Object.keys(G.cardPlayed.playersForgoNope).length >= ctx.numPlayers) {
                // Chain has been resolved either by timeout or by people no longer noping
                moves.chainResolved();
                if (G.cardPlayed.nopers.length % 2 === 1) {
                    playNopedModal();
                } else {
                    this.playCard(G.cardPlayed.cards);
                }
            }

        }
    }

    drawCard = () => {
        this.props.moves.drawCard();
        this.setState({
            selectedCards: []
        });
    }

    handleSelectedCardChanges(item) {
        let selected = this.state.selectedCards;
        if (selected.includes(item)) {
            selected.splice(selected.indexOf(item), 1);
        } else {
            selected.push(item);
        }

        this.setState({ selectedCards: selected });
    }

    giveCardToPlayer() {
        this.props.moves.giveCard(this.state.selectedCards[0])
        this.setState({
            selectedCards: []
        });
    }

    playCard = async (cards) => {
        const {
            gameMetadata,
            playerID,
            G,
            moves
        } = this.props;
        let selectedPlay = cards;
        if (selectedPlay.length === 1) {
            selectedPlay = selectedPlay[0]
            // ATTACK
            if (CardIsOneOfType(selectedPlay, CardTypes.Attack)) {
                moves.attack();
            }
            // FAVOR
            else if (CardIsOneOfType(selectedPlay, CardTypes.Favor)) {
                let tgtPlayer = await targetModal({
                    players: gameMetadata,
                    currentPlayerId: playerID,
                    G: G
                });
                if (typeof tgtPlayer === "number")
                    moves.favor(tgtPlayer)
            }
            // SEE THE FUTURE
            else if (CardIsOneOfType(selectedPlay, CardTypes.STF)) {
                await seeFutureModal({ deck: G.deck })
                moves.seeTheFuture()
            }
            // SHUFFLE
            else if (CardIsOneOfType(selectedPlay, CardTypes.Shuffle)) {
                moves.shuffle()
            }
            // SKIP
            else if (CardIsOneOfType(selectedPlay, CardTypes.Skip)) {
                moves.skip()
            }
        } else if (selectedPlay.length === 2) {
            if (CardsOfTypes(selectedPlay, 1)) {
                let tgtPlayer = await targetModal({
                    players: gameMetadata,
                    currentPlayerId: playerID,
                    G: G
                });
                if (typeof tgtPlayer === "number") {
                    this.props.moves.twoOfAKind(tgtPlayer);
                }
            }
        } else if (selectedPlay.length === 3) {
            if (CardsOfTypes(selectedPlay, 1)) {
                let tgtPlayer = await targetModal({
                    players: gameMetadata,
                    currentPlayerId: playerID,
                    G: G
                });
                if (typeof tgtPlayer === "number") {
                    let cardTypes = CardTypesAsArray()
                    cardTypes.pop()
                    let tgtType = await targetTypeModal({
                        types: cardTypes
                    });
                    this.props.moves.threeOfAKind(tgtPlayer, tgtType);
                }
            }

        } else if (selectedPlay.length === 5) {
            if (selectedPlay.map(c => c.name).length === 5) {
                if (CardsOfTypes(selectedPlay, 5)) {
                    let tgtCardIndex = await viewPileModal({ deck: this.props.G.discardPile, selectable: true, title: 'Discard Pile' });
                    if(typeof tgtCardIndex === "number") {
                        this.props.moves.fiveDifferent(tgtCardIndex)
                    } else {
                        moves.returnCards(selectedPlay);
                    }
                }
            }
        } else {
            console.log("Invalid Play!")
        }

        this.setState({
            selectedCards: []
        })
    }

    attemptPlayCard = () => {
        const cards = this.state.selectedCards;
        let validPlay = true;
        if (cards.length === 1) {
            const card = cards[0];
            if (!CardIsOneOfType(card, [CardTypes.Attack, CardTypes.Favor, CardTypes.STF, CardTypes.Shuffle, CardTypes.Skip])) {
                validPlay = false;
            }
        } else if (cards.length === 2) {
            if (!CardsOfTypes(cards, 1)) {
                validPlay = false;
            }
        } else if (cards.length === 3) {
            if (!CardsOfTypes(cards, 1)) {
                validPlay = false;
            }
        } else if (cards.length === 5) {
            if (!CardsOfTypes(cards, 5)) {
                validPlay = false;
            }
        } else {
            validPlay = false;
        }

        if (validPlay) {
            this.props.moves.playCards(cards);
            this.setState({
                selectedCards: []
            })
        } else {
            this.setState({ showInvalidPlay: true });
        }
    }

    useDefuse = async () => {
        const {
            G,
            playerID,
            moves,
        } = this.props;
        const thisPlayer = G.players[playerID]
        const defuse = thisPlayer.hand.find(c => CardIsOneOfType(c, CardTypes.Defuse));
        // Deck + 1 because the explode is currently in our hand and will go back in the deck
        const index = await explodeReinsertModal({ deckSize: G.deck.length + 1 });
        moves.defuse(defuse, index)
    }

    giveUp = () => {
        this.props.moves.explode()
    }

    viewDiscard = async () => {
        await viewPileModal({ deck: this.props.G.discardPile, selectable: false, title: 'Discard Pile' });
    }

    viewDeck = async () => {
        await viewPileModal({ deck: this.props.G.deck, selectable: false, title: 'Deck' });
    }

    useNope = () => {
        const {
            G: { players },
            playerID,
            moves,
        } = this.props;
        const thisPlayer = players[playerID]
        const nope = thisPlayer.hand.find(c => CardIsOneOfType(c, CardTypes.Nope));
        moves.nope(playerID, nope);
    }

    holdNope = () => {
        const {
            playerID,
            moves,
        } = this.props;
        moves.holdNope(playerID);
    }

    hidehowInvalidPlay = () => {
        this.setState({ showInvalidPlay: false })
    }

    showRules = async () => {
        await rulesModal();
    }

    onChatSubmitted = (msg) => {
        if (msg) {
            this.props.moves.chat(this.props.playerID, msg);
        }
    }

    render() {
        const {
            G,
            playerID,
            ctx,
            gameMetadata,
        } = this.props;
        const {
            active: favorActive,
            willReceive: favorWillRecieve,
            willGive: favorWillGive,
        } = G.favor;

        if (ctx.gameover) {
            const winner = G.players.find(p => p.status !== EXPLODED);
            const winnerName = gameMetadata[winner.id].name;
            return (
                <div id='board' className="board">
                    <div className="d-flex justify-content-center">
                        Congratulations to {winnerName} for winning the game!
                    </div>
                </div>
            );
        }

        const isSpectator = playerID === null;
        const lastDiscarded = G.discardPile[G.discardPile.length - 1];
        const isCurrentPlayer = ctx.currentPlayer == playerID; // double equals required

        const opts = {
            'disabled': this.state.selectedCards.length === 0 ? 'disabled' : ''
        };
        return (
            <div id='board' className="board">
                <ModalFactory />
                <DefuseModal
                    open={ctx.activePlayers[ctx.currentPlayer] === 'defuse' && isCurrentPlayer}
                    useDefuse={this.useDefuse}
                    giveUp={this.giveUp}
                />
                <Popup
                    show={this.state.showInvalidPlay}
                    onHide={this.hidehowInvalidPlay}
                    header="Attempted play is invalid"
                    cards={this.state.selectedCards}
                    body={<div>
                        Card combination does nothing:
                        <Hand cards={this.state.selectedCards} onSelect={() => { }} />
                    </div>}
                />
                {/* redundant, with the show prop, but stops index errors from gameMetadata usage */}
                {favorWillGive !== undefined && (
                    <Popup
                        show={favorActive && isCurrentPlayer}
                        onHide={undefined}
                        header="Favor card decision being made"
                        body={`${gameMetadata[favorWillGive].name} is deciding on a card to give you`}
                    />
                )}
                {playerID && (
                    <NopeModal
                        G={G}
                        ctx={ctx}
                        playerID={playerID}
                        players={gameMetadata}
                        handleNope={this.useNope}
                        handleNoNope={this.holdNope}
                    />
                )}
                <div id="players">
                    <Table striped bordered>
                        <thead>
                            <tr>
                                <th>Players</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {G.players.map(player => {
                                const playerExploded = player.status === EXPLODED;
                                let className = '';
                                if (playerExploded) className = 'exploded';
                                return (
                                    <tr key={player.id} className={className}>
                                        <td>{player.id}</td>
                                        <td>{playerExploded ? <span>&#128128;</span> : ''} {gameMetadata[player.id].name}</td>
                                        <td>{!playerExploded ? <span><img className='players-card' src='/cards/CardBack.png' /><span className='player-num-cards'>{player.hand.length}x</span></span> : ''}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </div>

                <div id='turn-indicator'>
                    <span>{isCurrentPlayer ? 'Your Turn' : gameMetadata[ctx.currentPlayer].name + '\'s Turn'}</span>
                    <div className="break" />
                    {isCurrentPlayer && G.turnCounter > 1 &&
                        <div className='attacked'>Attacked! {G.turnCounter}x turns remaining</div>
                    }
                </div>

                <div className="deck">
                    <Chat
                        log={G.chat}
                        players={gameMetadata}
                        onChatSubmitted={this.onChatSubmitted}
                        currentPlayerID={playerID}
                    />
                    <div className='card-deck'>
                        <div className="deck-section">
                            <span className={lastDiscarded !== undefined ? 'deck-card' : 'hidden'}>
                                <p className='centered btn btn-secondary' onClick={this.viewDiscard}>View</p>
                                <p className='count-indicator top-left'>{G.discardPile.length}</p>
                                <img className='card-img-top' src={lastDiscarded && lastDiscarded.imageURL}
                                    alt={lastDiscarded && lastDiscarded.name} />
                            </span>
                        </div>
                        <div className="deck-section">
                            {G.deck.length > 0 &&
                                <span className='deck-card'>
                                    {isCurrentPlayer &&
                                        <p className='centered btn btn-primary' onClick={this.drawCard}>Draw Card</p>
                                    }
                                    {isSpectator &&
                                        <p className='centered btn btn-primary' onClick={this.viewDeck}>View</p>
                                    }
                                    <p className='count-indicator top-right'>{G.deck.length}</p>
                                    <img className='card-img-top' src='cards/CardBack.png' alt='Card Back' />
                                </span>
                            }
                        </div>
                    </div>
                </div>

                <div className="clearfix" />

                <div id='action-buttons'>
                    {isCurrentPlayer &&
                        <Button className='btn btn-primary' {...opts} onClick={() => this.attemptPlayCard()}>
                            Play Card
                        </Button>
                    }
                    {(favorWillGive == playerID && favorActive) &&
                        <Button className='btn btn-danger' {...opts}
                            onClick={() => this.giveCardToPlayer()}>
                            Give Card to {gameMetadata[favorWillRecieve].name}
                        </Button>
                    }
                </div>

                {playerID && (
                    <div className='dplayer pt-5 pb-3'>
                        <Hand cards={G.players[playerID].hand}
                            onSelect={this.handleSelectedCardChanges.bind(this)}
                            selectedCards={this.state.selectedCards}
                        />
                    </div>
                )}
                {/* Cheaty spectator sees all hands and the logs... */}
                {isSpectator && (
                    <div>
                        {G.players.map(p => (
                            <div className='dplayer pt-5 pb-3'>
                                <h5>{gameMetadata[p.id.toString()].name}</h5>
                                <Hand cards={p.hand} onSelect={() => { }} />
                            </div>
                        ))}
                        <Table striped bordered size="sm">
                            <thead>
                                <tr>
                                    <th>Turn</th>
                                    <th>Payload</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.props.log.map(log => {
                                    return (
                                        <tr key={log._stateID}>
                                            <td>{log.turn}</td>
                                            <td>{JSON.stringify(log.action.payload)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </div>
                )}
                <Button className='btn btn-secondary rules-button' onClick={this.showRules}>
                    Show Rules
                </Button>
            </div>
        );
    }
}
