import Player from 'game/components/player';

export default class EnemyPlayer extends Player {

	constructor(game, { userId, position }) {

		super(game, position);

		this.userId = userId;
	}

	update(duration) {

		if (this.game.map.areCoordsInView(this.coordsInView)) {

			if (!this.sprite) {

				this.sprite = this.domElement = document.createElement('div');

				this.sprite.classList.add('player');

				document.querySelector("#view").appendChild(this.sprite);
			}

			this.translate(duration);

			this.setSize();

		} else {

			if (this.sprite) {

				this.sprite.remove();

				delete this.sprite;
			}
		}
	}

	set position(position) {

		super.position = position;

		this.updateCoordsInView();
	}

	setColor(color) {

		this.sprite.style.background = `#${color}`;
	}

	updateCoordsInView() {

		for (const i in [0, 1]) {

			this.coordsInView[i] = this.coords[i] + this.game.player.coordsInView[i] - this.game.player.coords[i];
		}
	}
}
