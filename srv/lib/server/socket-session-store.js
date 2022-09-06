import Debug from '#debug';
const debug = Debug('server   |');

export default {

	save(socket, sessionData) {

		debug(`Saving session data for socketId '${socket.id}'`);

		Object.assign(socket.request.session, sessionData);

		socket.request.session.save();
	},

	get(socket, key) {

		debug(`Getting session value with key '${key}' for socketId '${socket.id}'`);

		if (!socket.request?.session) {

			debug(`No session data found for socketId '${socket.id}'`);

			return;

		} else if (!socket.request.session?.[key]) {

			debug(`No session data found for key '${key}' for socketId '${socket.id}'`);

			return;
		}

		return socket.request.session[key];
	},

	remove(socket) {

		if (!socket.request.session) {

			debug(`No session data to destroy found for socketId '${socket.id}'`);

		} else {

			debug(`Destroying session data for socketId '${socket.id}'`);

			for (const key in socket.request.session) {

				if (key !== 'cookie') {

					delete socket.request.session[key];
				}
			}

			socket.request.session.save();
		}
	}
};