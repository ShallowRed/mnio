import EnemyPlayer from "./enemy-player";

// todo:
// remove out bound players
// remove disconnected player
// fill stamp when other player fill
export default class Players {

	collection = new Map();

	constructor(game, playersData) {

		this.game = game;

		if (playersData?.length) {

			playersData.forEach((data) => {

				this.add(data);
			});
		}
	}

	add({ id, position }) {

		const player = new EnemyPlayer(this.game, { id, position });

		this.collection.set(player.id, player);
	}

	remove(id) {

		this.collection.delete(id);
	}

	get(id) {

		return this.collection.get(id);
	}

	forEvery(callback) {

		this.collection.forEach(callback);
	}
}