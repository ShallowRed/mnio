const initServer = require('./server');
const initDatabase = require('./database/init/initDatabase');
const initGame = require('./service/');

const io = initServer();
initDatabase();
initGame(io);
