import Debug from 'debug';

export default function debug(key) {

	const debug = Debug(`app:${key}`);

	debug.log = console.info.bind(console);

	debug.error = console.error.bind(console);

	return debug;
}