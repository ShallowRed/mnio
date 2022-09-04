const Debug = require('debug');

module.exports = function(key) {

	debug = Debug(`app:${key}`);

	debug.log = console.info.bind(console);

	return debug
}