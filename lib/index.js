const initServer = require('./server/server');
const initDatabase = require('./database/init/initDatabase');
const initGame = require('./game/init');
 const a = 2;
const io = initServer();
initDatabase();
initGame(io);
