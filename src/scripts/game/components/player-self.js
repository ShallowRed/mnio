import Player from 'game/components/player';

export default class selfPlayer extends Player {

	sprite = document.getElementById('player');

	coordsInViewCoef = [null, null];

	constructor(game, { position, palette, ownCells, allowedCells }) {

		super(game, position);

		this.domElement = this.sprite;

		this.palette = palette;

		this.ownCells = ownCells;

		this.allowedCells = allowedCells;
	}

	setColor(i) {

		this.selectedColorIndex = i;

		this.selectedColor = this.palette[i];

		this.sprite.style.background = this.selectedColor;
	}

	updateCoordsInView() {

		this.lastCoordsInView = [...this.coordsInView];

		for (const i in [0, 1]) {

			const playerCoord = this.coords[i];

			const mapMaxCoord = [this.game.map.cols, this.game.map.rows][i];

			const maxCoordInView = this.game.map.maxCoordsInView[i];

			const viewCenterCoord = (maxCoordInView - 1) / 2;

			this.coordsInView[i] = this.getCoordInView(mapMaxCoord, maxCoordInView, viewCenterCoord, playerCoord);

			this.coordsInViewCoef[i] = this.getCoordInViewCoef(mapMaxCoord, viewCenterCoord, playerCoord);
		}

		this.game.map.updateCanvasOffset();
	}

	getCoordInView(mapMaxCoord, maxCoordInView, viewCenterCoord, playerCoord) {

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

	getCoordInViewCoef(mapMaxCoord, viewCenterCoord, playerCoord) {

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