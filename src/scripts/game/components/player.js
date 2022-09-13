export default class Player {

	translationDuration = 200;

	bumpDuration = 70;

	stampDuration = 100;

	sprite = document.getElementById('player');

	is = {};
	coordsInView = [null, null];
	coordsInViewCoef = [null, null];
	lastCoords = [null, null];

	constructor(game, { position, palette, ownCells, allowedCells }) {
		
		this.game = game;

		this.position = position;

		this.palette = palette;

		this.ownCells = ownCells;

		this.allowedCells = allowedCells;
	}

	////////////////////////////////////////////////////

	setColor(i) {

		this.selectedColorIndex = i;

		this.selectedColor = this.palette[i];

		this.sprite.style.background = this.selectedColor;
	}

	updatePosition(position, direction) {

		if (this.coords) {

			this.lastCoords = [...this.coords];
		}

		if (position) {

			this.position = position;
		}

		if (direction) {

			this.lastDirection = direction;
		}

		this.coords = this.game.map.indexToCoords(this.position);
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

	////////////////////////////////////////////////////

	set transitionDuration(value) {

		this.sprite.style.transitionDuration = `${value / 1000}s`;
	}

	set transform(value) {

		this.sprite.style.transform = value;
	}

	render() {

		this.transitionDuration = (
			this.game.flags.isTranslating ||
			this.game.flags.isZooming
		) ? this.translationDuration : 0;

		this.setSpritePosition();

		if (!this.game.flags.isTranslating) {

			this.setSpriteSize();
		}
	}

	setSpritePosition() {

		this.updateTranslateVector();

		this.transform = `translate(${this.translateVector})`;
	}

	updateTranslateVector() {

		this.shift = Math.round(this.game.map.cellSize / 8);

		this.translateVector = this.coordsInView.map((coordsInView, i) => {

			const offset = this.game.map.canvasOrigin[i] + this.shift;

			return `${coordsInView * this.game.map.cellSize + offset}px`;
		})
			.join(', ');
	}

	setSpriteSize() {

		this.shift = Math.round(this.game.map.cellSize / 8);

		const size = this.game.map.cellSize - this.shift * 2;

		this.sprite.style.width = this.sprite.style.height = `${size}px`;
	}

	stampAnimation() {

		this.transitionDuration = this.stampDuration;

		this.transform = `translate(${this.translateVector}) scale(0.9)`;
		
		this.sprite.classList.toggle("stamp");

		setTimeout(() => {

			this.sprite.classList.toggle("stamp");

			this.transform = `translate(${this.translateVector}) scale(1)`;

			this.transitionDuration = this.translationDuration;

		}, this.stampDuration)
	}

	bumpAnimation(direction) {

		if (this.game.flags.isBumping) return;

		this.game.flags.isBumping = true;

		const coefs = {
			'up': [0, -1],
			'down': [0, 1],
			'left': [-1, 0],
			'right': [1, 0],
		}[direction];

		const bumpTranslation = coefs.map(coef => `${coef * this.shift * 1.5}px`)
			.join(", ");

		const bumpScale = coefs.map(coef => `${1 - 0.1 * Math.abs(coef)}`)
			.join(", ");

		this.transitionDuration = this.bumpDuration;

		this.transform = `translate(${this.translateVector}) translate(${bumpTranslation}) scale(${bumpScale})`;

		setTimeout(() => {

			this.transform = `translate(${this.translateVector})`;

			this.transitionDuration = this.translationDuration;

			setTimeout(() => {

				this.game.flags.isBumping = false;

			}, this.translationDuration);

		}, this.bumpDuration)
	}
}
