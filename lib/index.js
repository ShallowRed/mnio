const initServer = require('./server/server');
const initDatabase = require('./database/init/initDatabase');
const initGame = require('./game/events/init');

const io = initServer();
initDatabase();
initGame(io);
