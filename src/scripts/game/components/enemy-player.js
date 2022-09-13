import Player from './class-player.js';

export default class EnemyPlayer extends Player {

	constructor(game, { id, position }) {

		const sprite = document.createElement('div');

		sprite.classList.add('player');

		document.querySelector("#view").appendChild(sprite);

		super(game, position, sprite);

		this.id = id;
	}

	render(duration) {

		this.transitionDuration = duration ?? this.translationDuration;

		super.render();
	}

	updateCoordsInView() {

		let [x, y] = this.game.map.indexToCoords(this.position);

		const [x0, y0] = this.game.player.coords;
		const [vX0, vY0] = this.game.player.coordsInView;

		this.coordsInView = [
			vX0 + (x - x0),
			vY0 + (y - y0)
		];
	}
}
