export default {

	colorBtns: document.querySelectorAll('.color'),

	zoomBtns: {
		in: document.getElementById('zoomin'),
		out: document.getElementById('zoomout')
	},

	focusColorBtn({ index }) {

		this.colorBtns.forEach((btn, i) => {

			if (i === index) {

				btn.className = "color pressed";

			} else {

				btn.className = 'color';
			}
		});
	}
}
