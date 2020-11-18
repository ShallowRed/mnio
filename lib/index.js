const initServer = require('./server/server');
const initDatabase = require('./database/init/initDatabase');
const initGame = require('./game/initGame');

const io = initServer();
initDatabase();
initGame(io);
