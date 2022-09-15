import ViewObject from "game/components/view-object";

export default ViewObject(class Player {

	lastCoords = [null, null];

	coordsInView = [null, null];

	translateVector = [null, null];

	constructor(game, position) {

		this.game = game;

		this.position = position;
	}

	set position(position) {

		if (this.coords) {

			this.lastCoords = [...this.coords];
		}

		this.coords = this.game.map.indexToCoords(position);

		this.lastPosition = parseInt(`${this.position}`, 10);

		this._position = position;
	}

	get position() {

		return this._position;
	}

	setSize() {

		const size = this.game.map.cellSize - this.game.map.cellPadding * 2;

		this.sprite.style.width = this.sprite.style.height = `${size}px`;
	}

	translate(duration) {

		this.transitionDuration = duration;

		for (const i in [0, 1]) {

			const offset = this.game.map.canvasOffset[i] + this.game.map.cellPadding;

			this.translateVector[i] = offset + this.coordsInView[i] * this.game.map.cellSize;
		}

		this.transform = { translation: this.translateVector };
	}

	stampAnimation() {

		this.game.flags.isStamping = true;

		this.transitionDuration = this.game.durations.stampAnimation / 2;

		this.transform = { translation: this.translateVector, factor: 0.9 };

		this.sprite.classList.add("stamp");

		const onStampAnimationEnd = () => {

			this.sprite.classList.remove("stamp");

			this.transform = { translation: this.translateVector };

			this.game.flags.isStamping = false;
		}

		this.game.animationTimeout(onStampAnimationEnd, this.game.durations.stampAnimation / 2);
	}

	bumpAnimation(direction) {

		if (this.game.flags.isBumping) return;

		this.game.flags.isBumping = true;

		this.transitionDuration = this.game.durations.bumpAnimation;

		const coefs = {
			'up': [0, -1],
			'down': [0, 1],
			'left': [-1, 0],
			'right': [1, 0],
		}[direction];

		const bumpTranslation = coefs.map(coef => coef * this.game.map.cellPadding * 1.2);

		const bumpScale = coefs.map(coef => 1 - 0.1 * Math.abs(coef));

		this.transform = { translation: this.translateVector, translation2: bumpTranslation, factor: bumpScale };

		const onBumpAnimationEnd = () => {

			this.transform = { translation: this.translateVector };

			this.game.animationTimeout(() => {

				this.game.flags.isBumping = false;

			}, this.game.durations.delayBetweenBumps);
		};

		this.game.animationTimeout(onBumpAnimationEnd, this.game.durations.bumpAnimation);
	}
});