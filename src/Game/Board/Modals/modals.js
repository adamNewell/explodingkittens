import React, { Component, Fragment } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Table, Dropdown, Button, Input } from 'reactstrap';
import { createModal } from "react-modal-promise";
import { Card, CardDeck, CardColumns, Image } from "react-bootstrap";
import { EXPLODED } from "../../playerStatus";
import { utcUnixTimestamp, NOPE_TIMEOUT } from '../../game';
import { CardIsOneOfType, CardTypes } from '../../Deck/cards';
import './modals.scss';

const ModalCard = (selectable, close, props, index) => {
    if (selectable) {
        return (<Card tag="div" key={index} onClick={() => close(index)} style={{ cursor: "pointer" }} >
            <Card.Img variant="top" src={props.imageURL} />
        </Card>)
    } else {
        return (<Card key={index} >
            <Card.Img variant="top" src={props.imageURL} />
        </Card>)
    }
};



const viewPileStructure = ({ open, close, deck, title, selectable }) => {
    return (
        <Modal isOpen={open} toggle={close}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered scrollable
        >
            <ModalHeader toggle={close}>
                {title}
            </ModalHeader>
            <ModalBody>
                <div className="discardPile">
                    <CardColumns>
                        {
                            deck.map(ModalCard.bind(null, selectable, close))
                        }
                    </CardColumns>
                </div>
            </ModalBody>
        </Modal>
    )
};

const seeFutureModalStructure = ({ open, close, deck }) => {
    return (
        <Modal isOpen={open} toggle={close}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalHeader toggle={close}>
                Next three cards from deck
            </ModalHeader>
            <ModalBody>
                <div className="futureCards">
                    <CardDeck>
                        {deck.slice(-3).reverse().map(ModalCard.bind(null, false, close))}
                    </CardDeck>
                </div>
            </ModalBody>
        </Modal>
    )
};

const targetPlayerModalStructure = ({ open, close, players, currentPlayerId, G }) => {
    let playersExceptCurrentOrDead = players.filter(p => p.id !== parseInt(currentPlayerId) && G.players[p.id].status !== EXPLODED)
    return (
        <Modal isOpen={open} toggle={close}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalHeader>
                Target Player
            </ModalHeader>
            <ModalBody>
                <div className="players">
                    <Table striped bordered hover>
                        <tbody>
                            {playersExceptCurrentOrDead.map(player => (
                                <tr key={player.id} onClick={() => close(player.id)}>
                                    <td>{player.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </ModalBody>
        </Modal>
    );
};

const targetCardTypeModalStructure = ({ open, close, types }) => {
    return (
        <Modal isOpen={open} toggle={close}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalHeader>
                Target Card Type
            </ModalHeader>
            <ModalBody>
                <div className="types">
                    <Table striped bordered hover>
                        <tbody>
                            {types.map(type => (
                                <tr onClick={() => close(type)}>
                                    <td>{type}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </ModalBody>
        </Modal>
    );
};

class explodeReinsertModalStructure extends Component {
    state = { index: 0 }
    componentDidMount() {
        // Assume the user is going to want to mess with the next person in line
        this.setState({ index: this.props.deckSize - 1 });
    }
    render() {
        const { deckSize, open, close } = this.props;
        const { index } = this.state;
        return (
            <Modal isOpen={open} toggle={close}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <ModalHeader>
                    Re-insert the Exploding Kitten anywhere in the deck
                </ModalHeader>
                <ModalBody>
                    <p>
                        Insert the index of where the exploding kitten should go.
                        <br />
                        {deckSize - 1} = top of deck
                        <br />
                        0 = bottom of deck
                    </p>
                    <Input
                        type="number"
                        value={index}
                        onChange={e => this.setState({ index: e.target.value })}
                        min={0}
                        max={deckSize - 1}
                    />
                    <br />
                    <Button className='btn btn-success' onClick={() => { if (index >= 0 && index <= deckSize - 1) close(index); }}>
                        Re-insert exploding kitten at {index} position
                    </Button>
                </ModalBody>
            </Modal>
        );
    }
}

const playWasNopedStructure = ({ open, close }) => {
    return (
        <Modal isOpen={open} toggle={close}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalHeader toggle={close}>
                You've been NOPE'D!
            </ModalHeader>
            <ModalBody>
                Your play was noped and your card has fizzled.
            </ModalBody>
        </Modal>
    );
}

const rulesModalStructure = ({ open, close }) => {
    return (
        <Modal isOpen={open} toggle={close}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalHeader toggle={close}>
                Rules MF'ER. DO YOU READ THEM?
            </ModalHeader>
            <ModalBody>
                Buy this game. It's awesome. Now read the rules, you pirate you.
                <iframe className="rules-iframe" src="https://explodingkittens.com/how-to-play/exploding-kittens" />
            </ModalBody>
        </Modal>
    )
}

export const DefuseModal = ({ open, useDefuse, giveUp }) => (
    <Modal isOpen={open}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <ModalHeader>
            You've drawn an exploding kitten!
        </ModalHeader>
        <ModalFooter>
            <Button className='btn btn-success' onClick={useDefuse}>
                Use Defuse
            </Button>
            <Button className='btn btn-danger' onClick={giveUp}>
                Give up
            </Button>
        </ModalFooter>
    </Modal>
)

export const NopeModal = ({ G, ctx, players, playerID, handleNope, handleNoNope }) => {
    const remainingTime = NOPE_TIMEOUT - (utcUnixTimestamp() - G.cardPlayed.utcUnixTimePlayed);
    const hasNope = G.players[playerID].hand.some(c => CardIsOneOfType(c, CardTypes.Nope))
    const cardInfo = G.cardPlayed;
    const playerHasForgone = cardInfo.playersForgoNope.some(p => p == playerID);
    const playerHasExploded = G.players[playerID].status === EXPLODED;
    const currentPlayerName = players[ctx.currentPlayer].name;
    const wasNoped = cardInfo.nopers.length % 2 === 1;
    let playType = 'UNKOWN';
    if (cardInfo.cards) {
        if (cardInfo.cards.length === 1) {
            playType = cardInfo.cards[0].type;
        } else if (cardInfo.cards.length === 2) {
            playType = 'Two of a Kind';
        } else if (cardInfo.cards.length === 3) {
            playType = 'Three of a Kind';
        } else if (cardInfo.cards.length === 5) {
            playType = 'All uniques';
        }
    }
    return (
        <Modal isOpen={cardInfo.cards !== undefined}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalHeader>
                {currentPlayerName} is attempting to play {playType}!
            </ModalHeader>
            <ModalBody>
                {cardInfo.nopers.length > 0 && (
                    <Table striped bordered size="sm">
                        <tbody>
                            {cardInfo.nopers.map((pid, idx) => (
                                <tr key={idx}>
                                    <td>{players[pid].name} has {idx % 2 === 0 ? "nope'd" : "yup'ed"} the play</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
                <CardDeck>
                    {cardInfo.cards && cardInfo.cards.map(ModalCard.bind(null, false, null))}
                </CardDeck>
                {wasNoped && (
                    <div>
                        The play is currently being Noped!
                    </div>
                )}
                {playerHasForgone && (
                    <div>
                        {!playerHasExploded && 'Waiting for other players responses...'}
                        {playerHasExploded && "You've already exploded. Enjoy the mayham."}
                    </div>
                )}
                {!playerHasForgone && (
                    <div>
                        {hasNope && wasNoped && 'Do you want to yup that nope?'}
                        {hasNope && !wasNoped && 'Do you want to nope that play?'}
                        {!hasNope && (
                            <div>
                                No nope to use.
                                <br />
                                Wait for timer or click Nope
                            </div>
                        )}
                    </div>
                )}
                <br />
                <div>
                    {remainingTime < 0 ? 0 : remainingTime} milliseconds left
                </div>
            </ModalBody>
            <ModalFooter>
                {!playerHasForgone && (
                    <Fragment>
                        <Button className='btn btn-secondary' onClick={handleNoNope}>
                            Nope &#128078;
                        </Button>
                        {hasNope && (
                            <Button className='btn btn-danger' onClick={handleNope}>
                                Nope &#128077;
                            </Button>
                        )}
                    </Fragment>
                )}
            </ModalFooter>
        </Modal>
    );
}

const cardDetailModalStructure = ({ open, close, card }) => {

    return (
        <Modal
            size="sm" isOpen={open} toggle={close}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <ModalBody>
                <Image className='card-detail' src={card.imageURL} />
            </ModalBody>
        </Modal>
    );
}

export const targetModal = createModal(targetPlayerModalStructure);
export const seeFutureModal = createModal(seeFutureModalStructure);
export const viewPileModal = createModal(viewPileStructure);
export const targetTypeModal = createModal(targetCardTypeModalStructure);
export const playNopedModal = createModal(playWasNopedStructure);
export const cardDetailModal = createModal(cardDetailModalStructure);
export const rulesModal = createModal(rulesModalStructure);
export const explodeReinsertModal = createModal(explodeReinsertModalStructure);