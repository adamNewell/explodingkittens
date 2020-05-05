import request from 'superagent';

const envConfig = require('../config')

export class LobbyService {


    public static async renameUser(gameCode: string,  playerID: string, newName: string): Promise<void> {
        const playerCredential = this.getCredential();
        if (playerCredential) {
            console.log(`${envConfig['server']}/games/DetonatingBabyFelines/${gameCode}/rename`);
            await request.post(`${envConfig['server']}/games/DetonatingBabyFelines/${gameCode}/rename`).send({
                playerID: playerID,
                credentials: playerCredential,
                newName
            });
        }
    }

    public static getName(): string {
        if (typeof window !== "undefined") {
            let re = new RegExp("lobbyState=([^;]+)");
            let value = re.exec(document.cookie);
            return (value != null) ? JSON.parse(unescape(value[1])).playerName : null;
        }

        return "";
    }


    public static getCredential() {
        let re = new RegExp("lobbyState=([^;]+)");
        let value = re.exec(document.cookie);
        let cookie = (value != null) ? JSON.parse(unescape(value[1])) : "";
        let user = cookie.playerName;

        return cookie.credentialStore[user];
    }
}
