import Player from './player.js';

export default class EnemyPlayer extends Player {

	constructor(game, { id, position }) {

		const sprite = document.createElement('div');

		sprite.classList.add('player');

		document.querySelector("#view").appendChild(sprite);

		super(game, position, sprite);

		this.id = id;
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

		this.transitionDuration = this.game.durations.translation;

		super.render();
	}
}
