export default function listenTouchEvents() {

	this.map.view.addEventListener('touchstart', touchStart.bind(this), false);

	this.map.view.addEventListener('touchmove', touchMove.bind(this), false);

	this.map.view.addEventListener('touchend', touchEnd.bind(this), false);
}

function touchStart(evt) {

	this.flags.isTouching = true;

	Touch.setOrigin(evt);
}

function touchEnd() {

	this.flags.isTouching = false;

	Touch.setLimit();

	Touch.start = [null, null];

	Touch.direction = null;

	Touch.lastDirection = null;
}

function touchMove(evt) {

	if (!Touch.start[0] || !Touch.start[1]) return;

	Touch.getDelta(evt);

	Touch.getDirection();

	if (!Touch.lastDirection) {

		Touch.saveDirection();

	}

	if (
		this.flags.waitingServerConfirmMove || this.flags.isTranslating ||
		Touch.isTooSmall()
	) return;

	this.moveAttempt(Touch.direction);

	Touch.setOrigin(evt);

	Touch.setLimit(120);

	Touch.saveDirection();

	const keepMoving = setInterval(() => {

		if (
			!this.flags.waitingServerConfirmMove &&
			!this.flags.isTranslating &&
			this.flags.isTouching && Touch.direction
		) {

			this.moveAttempt(Touch.direction);
		}

		if (!this.flags.isTouching) {

			clearInterval(keepMoving);
		}

	}, 20);
}

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

			this.direction = deltaX > 0 ? "left" : "right";

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

		return (
			Math.abs(Touch.delta[0]) < Touch.limit &&
			Math.abs(Touch.delta[1]) < Touch.limit
		);
	}
};