import React from "react";
import { DetonatingBabyFelines } from "../Game/game";
import { DBFBoard } from "../Game/Board/board";
import { Lobby } from 'boardgame.io/react';
import './lobby.scss';

export default class LobbyView extends React.Component {

    gameToServe = [{
        game: DetonatingBabyFelines, board: DBFBoard
    }];

    render() {
        const envConfig = require('../config')

        return (
            <div>
                <h1 id="title">
                    <span>EXPLODING</span>
                    <span>KITTENS</span>
                </h1>
                <Lobby
                    gameServer={envConfig['server']}
                    lobbyServer={envConfig['server']}
                    gameComponents={this.gameToServe}
                />

            </div>
        )
    }
}
