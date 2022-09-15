export default class SharedPlayers {

	collection = new Map();

	constructor() {}

	get(userId) {

		return this.collection.get(userId);
	}

	set(player) {

		this.collection.set(player.userId, player);
	}

	delete(userId) {

		this.collection.delete(userId);
	}

	get values() {

		return [...this.collection.values()];
	}

	get positions() {		

		return this.values.map(player => player.position);
	}
}