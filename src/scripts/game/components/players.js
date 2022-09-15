import SharedPlayers from 'shared/players';
import EnemyPlayer from "game/components/player-enemy";

export default class Players extends SharedPlayers {

	constructor(game, playersData) {

		super();
		
		this.game = game;

		this.playersData = playersData;
	}

	remove(userId) {

		const player = this.get(userId);

		player.sprite.remove();

		this.delete(userId);
	}

	create({ userId, position }) {

		const coordsInView = this.game.map.getRelativeCoords(position);

		if (this.game.map.areCoordsInView(coordsInView)) {

			const player = new EnemyPlayer(this.game, { userId, position });

			this.set(player);

			player.updatePosition(position);

			player.updateCoordsInView();

			player.render();

			return player;
		}
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