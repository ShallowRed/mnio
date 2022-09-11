export default (game) => {

	const { flags, map: { view } } = game;

	view.addEventListener('touchstart', event =>
		touchStart(event, flags),
		false
	);

	view.addEventListener('touchmove', event =>
		touchMove(event, flags, game),
		false
	);

	view.addEventListener('touchend', event =>
		touchEnd(event, flags),
		false
	);
};

const Touch = {

	start: [null, null],

	delta: [null, null],

	direction: null,

	lastDirection: null,

	limit: 80,

	setOrigin(evt) {

		this.start[0] = evt.touches[0].clientX;

		this.start[1] = evt.touches[0].clientY
	},

	setLimit(amount = 50) {

		this.limit = amount;
	},

	getDelta(evt) {

		this.delta[0] = this.start[0] - evt.touches[0].clientX;

		this.delta[1] = this.start[1] - evt.touches[0].clientY;
	},

	getDirection() {

		const [deltaX, deltaY] = this.delta;

		if (Math.abs(deltaX) > Math.abs(deltaY)) {

			this.direction = deltaX > 0 ? "left" : "right"
		} else {

			this.direction = deltaY > 0 ? "up" : "down";
		}
	},

	saveDirection() {

		this.lastDirection = this.direction;
	},

	useLastDir() {

		this.direction = this.lastDirection;
	},

	isSameDirection() {

		return this.lastDirection === this.direction;
	},

	isTooSmall() {

		return Math.abs(Touch.delta[0]) < Touch.limit &&
			Math.abs(Touch.delta[1]) < Touch.limit;
	}
};

const touchStart = (evt, flags) => {

	flags.isTouching = true;

	Touch.setOrigin(evt);
}

const touchEnd = (evt, flags) => {

	flags.isTouching = false;

	Touch.setLimit();

	Touch.start = [null, null];

	Touch.direction = null;

	Touch.lastDirection = null;
}

const touchMove = (evt, flags, game) => {

	let { start, lastDirection, } = Touch;

	if (!start[0] || !start[1]) return;

	Touch.getDelta(evt);

	Touch.getDirection();

	if (!lastDirection) Touch.saveDirection();

	if (
		flags.waitingServerConfirmMove || flags.isTranslating ||
		Touch.isTooSmall()
	) return;

	game.moveAttempt(Touch.direction);

	Touch.setOrigin(evt);

	Touch.setLimit(120);

	Touch.saveDirection();

	const keepMoving = setInterval(() => {
		
		if (
			!flags.waitingServerConfirmMove &&
			!flags.isTranslating &&
			flags.isTouching && Touch.direction
		) {

			game.moveAttempt(Touch.direction);
		}

		if (!flags.isTouching) {

			clearInterval(keepMoving);
		}

	}, 20);
}
