import EnemyPlayer from "./player-enemy";

// fill stamp when other player fill
export default class Players {

	collection = new Map();

	constructor(game, playersData) {

		this.game = game;

		this.playersData = playersData;
	}

	get positions() {

		return Object.values(this.collection)
			.map((player) => player.position);
	}

	create({ id, position }) {

		const coordsInView = this.game.map.getRelativeCoords(position);

		if (this.game.map.areCoordsInView(coordsInView)) {

			const player = new EnemyPlayer(this.game, { id, position });

			this.collection.set(player.id, player);

			player.updatePosition(position);

			player.updateCoordsInView();

			player.render();

			return player;
		}
	}

	remove(id) {

		const player = this.get(id);

		player.sprite.remove();

		this.collection.delete(id);
	}

	get(id) {

		return this.collection.get(id);
	}

	init() {

		this?.playersData?.forEach((data) => {

			this.create(data);
		});

		delete this.playersData;

		this.init = null;
	}

	updatePositions() {

		this.collection.forEach((player) => {

			player.updatePosition(player.position);

		});
	}

	updateCoordsInView() {

		this.collection.forEach((player) => {

			player.updateCoordsInView();
		});
	}

	render() {

		if (this.init) {

			this.init();

		} else {

			this.collection.forEach((player) => {

				player.render();
			});
		}
	}
}