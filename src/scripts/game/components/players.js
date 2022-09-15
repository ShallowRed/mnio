import SharedPlayers from 'shared/players';
import EnemyPlayer from "game/components/player-enemy";

export default class Players extends SharedPlayers {

	constructor(game, playersData) {

		super();

		this.game = game;

		this.playersData = playersData;
	}

	get length() {

		return this.collection.size;
	}

	init() {

		this.playersData?.forEach(({ userId, position }) => {

			this.create({ userId, position });
		});

		delete this.playersData;
	}

	create({ userId, position }) {

		if (!this.collection.has(userId)) {

			const player = new EnemyPlayer(this.game, { userId, position });

			this.set(player);

			player.update(0);
		}
	}

	update(duration) {

		if (this.init) {

			this.init();

			this.init = null;

		} else {

			this.collection.forEach(player => {

				player.updateCoordsInView();

				player.update(duration);
			});
		}
	}
}