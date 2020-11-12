const initServer = require('./server');
const initDatabase = require('./database/init/initDatabase');
const initGame = require('./service/initGame');

const io = initServer();
initDatabase();
initGame(io);
