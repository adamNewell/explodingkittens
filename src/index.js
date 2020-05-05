import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { DetonatingBabyFelines} from "./Game/game";
import { DBFBoard } from "./Game/Board/board";
import 'bootstrap/dist/css/bootstrap.min.css';
import LobbyView from './Lobby/lobby';

const envConfig = require('./config');


const DBFClient = Client({
    game: DetonatingBabyFelines,
    board: DBFBoard,
    debug: false,
    numPlayers: 4,
    multiplayer: SocketIO({ server: envConfig['server']  })
});

class App extends React.Component {
    state = { playerID: null };

    render() {
        if (this.state.playerID === null) {
            return (
                <div>
                    <LobbyView />
                </div>
            );
        }
        return (
            <div>
                <DBFClient playerID={this.state.playerID} />
            </div>
        );
    }
}

render(<App />, document.getElementById("root"));

