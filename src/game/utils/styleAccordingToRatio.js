export default {

	update() {

		this.widthIsLarger = window.innerWidth >= window.innerHeight;
	},

	applyStyles(...args) {

		[...args].forEach(({ domEl, styles }) => {

			for (const [key, value] of Object.entries(styles)) {

				domEl.style[key] = value[this.widthIsLarger ? 0 : 1];
			}
		});
	},

	mapStyles(list, styles) {

		return [...list].map(item => ({
			domEl: item,
			styles
		}))
	}
};