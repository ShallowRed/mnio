import Player from 'game/components/player';

export default class EnemyPlayer extends Player {

	constructor(game, { userId, position }) {

		const sprite = document.createElement('div');

		sprite.classList.add('player');

		document.querySelector("#view").appendChild(sprite);

		super(game, position, sprite);

		this.userId = userId;
	}

	setColor(color) {

		this.sprite.style.background = `#${color}`;
	}

	updatePosition(position) {

		this.position = position;

		this.coords = this.game.map.indexToCoords(this.position);
	}

	updateCoordsInView() {

		for (const i in [0, 1]) {

			this.coordsInView[i] = this.coords[i] + this.game.player.coordsInView[i] - this.game.player.coords[i];
		}
	}

	render() {

		this.transitionDuration =
			this.game.flags.isZooming ?
				this.game.durations.zoom :
				!this.game.flags.isFullRendering ?
					this.game.durations.translation : 0

		super.render();
	}
}
