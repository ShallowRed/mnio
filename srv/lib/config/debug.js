import Debug from 'debug';

export default function(key) {

	const debug = Debug(`app:${key}`);

	debug.log = console.info.bind(console);

	return debug;
}