import Player from './class-player.js';

export default class selfPlayer extends Player {

	is = {};

	coordsInViewCoef = [null, null];

	constructor(game, { position, palette, ownCells, allowedCells }) {
		
		super(game, position, document.getElementById('player'));

		this.palette = palette;
		
		this.ownCells = ownCells;

		this.allowedCells = allowedCells;
	}

	setColor(i) {

		this.selectedColorIndex = i;

		this.selectedColor = this.palette[i];

		this.sprite.style.background = this.selectedColor;
	}

	render() {

		this.transitionDuration = (
			this.game.flags.isTranslating ||
			this.game.flags.isZooming
		) ? this.translationDuration : 0;

		super.render();
	}

	updateCoordsInView() {

		this.lastCoordsInView = [...this.coordsInView];

		for (let i = 0; i <= 1; i++) {

			const playerCoord = this.coords[i];

			const mapMaxCoord = [this.game.map.cols, this.game.map.rows][i];

			const maxCoordInView = this.game.map.maxCoordsInView[i];

			const viewCenterCoord = (maxCoordInView - 1) / 2;

			this.coordsInView[i] = this.getCoordsInView(mapMaxCoord, maxCoordInView, viewCenterCoord, playerCoord);

			this.coordsInViewCoef[i] = this.getCoordsInViewCoef(mapMaxCoord, viewCenterCoord, playerCoord);
		}
	}

	getCoordsInView(mapMaxCoord, maxCoordInView, viewCenterCoord, playerCoord) {

		if (playerCoord < Math.ceil(viewCenterCoord)) {

			return playerCoord;

		} else {

			if (playerCoord > mapMaxCoord - viewCenterCoord - 1) {

				return playerCoord + maxCoordInView - mapMaxCoord;

			} else {

				return viewCenterCoord;
			}
		}
	}

	getCoordsInViewCoef(mapMaxCoord, viewCenterCoord, playerCoord) {
		
		if (playerCoord <= viewCenterCoord) {

			return 0;

		} else {

			if (playerCoord >= mapMaxCoord - viewCenterCoord - 1) {

				return 1;

			} else {

				return 1 / 2;
			}
		}
	}
}