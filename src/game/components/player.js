export default class Player {

	sprite = [
		document.getElementById('player'),
		document.getElementById('shadow')
	];

	is = {};

	posInView = [0, 0];

	posInViewCoef = [0, 0];

	lastCoords = [0, 0];

	constructor({ position, palette }, game) {

		this.game = game;

		this.position = position;

		this.palette = palette;

		this.selectedColor = palette[0];

		this.ownCells = this.game.ownCells;

		this.allowedCells = this.game.allowedCells;
	}

	////////////////////////////////////////////////////

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

	updatePosInView() {

		this.lastPosInView = [...this.posInView];

		for (let i = 0; i <= 1; i++) {

			const pX = this.coords[i];

			const gX = [this.game.cols, this.game.rows][i];

			const mX = this.game.map.numCellsInView[i];

			const hX = (mX - 1) / 2;

			this.posInView[i] = this.getPosInView(gX, mX, hX, pX);

			this.posInViewCoef[i] = this.getPosInViewCoef(gX, hX, pX);
		}
	}

	getPosInView(gX, mX, hX, pX) {

		return pX < Math.ceil(hX) ?
			pX :
			pX > gX - hX - 1 ?
				pX + mX - gX :
				hX;
	}

	getPosInViewCoef(gX, hX, pX) {

		return pX <= hX ?
			0 :
			pX >= gX - hX - 1 ?
				1 :
				1 / 2;
	}

	////////////////////////////////////////////////////

	render() {

		const { isZooming, isTranslating } = this.game.flags;

		const duration = (isTranslating || isZooming) ? this.game.duration : 0;

		this.setSpritePosition({ duration });

		!isTranslating && this.setSpriteSize();
	}

	setSpritePosition({ duration }) {

		this.updateTranslateVector();

		this.sprite.forEach((sprite, i) => {

			sprite.style.transitionDuration = `${duration}s`;

			sprite.style.transform =
				`translate(${this.translateVector}) translate(-${i}px, -${i}px)`;
		});
	}

	updateTranslateVector() {

		this.shift = Math.round(this.game.map.cellSize / 8);

		this.translateVector = this.posInView.map((posInView, i) => {
			return `${posInView * this.game.map.cellSize + this.game.map.canvasOrigin[i] + this.shift}px`;
		})
			.join(', ');
	}

	setSpriteSize() {

		const { sprite } = this;

		const { cellSize } = this.game.map

		this.shift = Math.round(cellSize / 8);

		sprite[0].style.width =
			sprite[0].style.height =
			`${cellSize - this.shift * 2}px`;

		sprite[1].style.width =
			sprite[1].style.height =
			`${cellSize - this.shift * 2 + 2}px`;

		sprite.forEach(c =>
			c.style.borderRadius = `${this.shift}px`
		);

		sprite[0].style.borderWidth = `${this.shift}px`;

		sprite[1].style.borderWidth = `min(3px,${this.shift / 4}px)`;
	}

	setColor(i) {

		const { palette, sprite: [sprite] } = this;

		this.selectedColor = palette[i];

		sprite.style.background = this.selectedColor;
	}

	stamp() {
		
		const { sprite: [player, shadow] } = this;

		player.style.transitionDuration =
			shadow.style.transitionDuration = "0.1s";

		player.style.transform =
			shadow.style.transform =
			`translate(${this.translateVector}) scale(0.9)`;

		shadow.style.boxShadow = "0 0 0 #555";

		setTimeout(() => {

			player.style.transform =
				`translate(${this.translateVector}) scale(1)`;

			shadow.style.transform =
				`translate(${this.translateVector}) translate(-1px, -1px) scale(1)`;

			shadow.style.boxShadow = "3px 3px 5px #777";

			player.style.transitionDuration =
				shadow.style.transitionDuration =
				"0.2s";

		}, 100)
	}

	bump(direction) {

		if (this.game.flags.isBumping) return;

		this.game.flags.isBumping = true;

		const { sprite: [player, shadow] } = this;

		const coef = direction == "up" ? [0, -1] :
			direction == "down" ? [0, 1] :
				direction == "left" ? [-1, 0] : [1, 0];

		const bumpTranslation = coef.map(e => `${e * this.shift * 1.5}px`)
			.join(", ");

		const bumpScale = coef.map(e => `${1 - 0.1 * Math.abs(e)}`)
			.join(", ");

		player.style.transitionDuration =
			shadow.style.transitionDuration =
			"0.07s";

		player.style.transform =
			`translate(${this.translateVector}) translate(${bumpTranslation}) scale(${bumpScale})`;

		shadow.style.transform =
			`translate(${this.translateVector}) translate(${bumpTranslation}) translate(-1px, -1px) scale(${bumpScale})`;

		setTimeout(() => {

			player.style.transform =
				`translate(${this.translateVector})`;

			shadow.style.transform =
				`translate(${this.translateVector}) translate(-1px, -1px)`;

			player.style.transitionDuration =
				shadow.style.transitionDuration =
				"0.2s";

			setTimeout(() => {
				this.game.flags.isBumping = false;
			}, 250);

		}, 70)
	}
}
