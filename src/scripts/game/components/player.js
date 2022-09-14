export default class Player {

	translationDuration = 200;

	bumpDuration = 70;

	stampDuration = 100;

	lastCoords = [null, null];
	coordsInView = [null, null];

	constructor(game, position, sprite) {

		this.game = game;

		this.position = position;

		this.sprite = sprite;
	}

	////////////////////////////////////////////////////

	set transitionDuration(duration) {

		this.sprite.style.transitionDuration = `${duration / 1000}s`;
	}

	set transform(value) {

		this.sprite.style.transform = value;
	}

	render() {

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