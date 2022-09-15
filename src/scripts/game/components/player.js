import ViewObject from "game/components/view-object";

export default ViewObject(class Player {

	bumpDuration = 60;

	stampDuration = 200;

	pauseBetweenBumpsDuration = 200;

	lastCoords = [null, null];

	coordsInView = [null, null];

	translateVector = [null, null];

	constructor(game, position, sprite) {

		this.game = game;

		this.position = position;

		this.domElement = sprite;

		this.sprite = sprite;
	}

	render() {

		for (const i in [0, 1]) {

			const offset = this.game.map.canvasOrigin[i] + this.game.map.cellPadding;

			this.translateVector[i] = offset + this.coordsInView[i] * this.game.map.cellSize;
		}

		this.transform = { translation: this.translateVector };

		if (!this.game.flags.isTranslating) {

			const size = this.game.map.cellSize - this.game.map.cellPadding * 2;

			this.sprite.style.width = this.sprite.style.height = `${size}px`;
		}
	}

	stampAnimation() {

		this.game.flags.isStamping = true;

		this.transitionDuration = this.stampDuration / 2;

		this.transform = { translation: this.translateVector, factor: 0.9 };

		this.sprite.classList.add("stamp");

		// this.game.animationTimeout(() => {

		// }, this.stampDuration / 4);

		this.game.animationTimeout(() => {

			this.sprite.classList.remove("stamp");

			this.transform = { translation: this.translateVector };
			this.game.flags.isStamping = false;


		}, this.stampDuration / 2);
	}

	bumpAnimation(direction) {

		if (this.game.flags.isBumping) return;

		this.game.flags.isBumping = true;

		this.transitionDuration = this.bumpDuration;

		const coefs = {
			'up': [0, -1],
			'down': [0, 1],
			'left': [-1, 0],
			'right': [1, 0],
		}[direction];

		const bumpTranslation = coefs.map(coef => coef * this.game.map.cellPadding * 1.2);

		const bumpScale = coefs.map(coef => 1 - 0.1 * Math.abs(coef));

		this.transform = { translation: this.translateVector, translation2: bumpTranslation, factor: bumpScale };

		this.game.animationTimeout(() => {

			this.transitionDuration = this.game.durations.translation;

			this.transform = { translation: this.translateVector };

			this.game.animationTimeout(() => {

				this.game.flags.isBumping = false;

			}, this.pauseBetweenBumpsDuration);

		}, this.bumpDuration)
	}
});