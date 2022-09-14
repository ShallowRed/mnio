export default ViewObject => class extends ViewObject {

	constructor(...args) {

		super(...args);
	}

	set transitionDuration(duration) {

		this.domElement.style.transitionDuration = `${duration / 1000}s`;
	}

	set transform({ translation, translation2, factor }) {

		let transform = "";

		if (translation) {

			const translate = translation.map(t => `${t}px`).join(', ');

			transform += `translate(${translate})`;
		}

		if (translation2) {

			const translate = translation2.map(t => `${t}px`).join(', ');

			transform += ` translate(${translate})`;
		}

		if (factor) {

			transform += ` scale(${factor})`;
		}

		this.domElement.style.transform = transform;
	}
}