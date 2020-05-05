const { Server, FlatFile } = require("boardgame.io/server");
const BabyFelines = require("./Game/game").DetonatingBabyFelines;

const server = Server({
    games: [BabyFelines],
    db: new FlatFile({
        dir: './db',
        logging: true,
    }),
});

server.run(8000);


