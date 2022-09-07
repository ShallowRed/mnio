import 'styles/commons/commons.scss';
import 'styles/palette/palette.scss'
import io from 'socket.io-client';

const socket = io('/palette');

window.addEventListener("load", () => {
	const container = document.querySelector('main');
	container.style.opacity = 1;
});

socket.once('chosePalette', palettesData => {

	const submitBtn = document.querySelector('button[name="paletteId"][type="submit"]');

	let paletteIndex = 0;

	const paletteDivs = document.querySelectorAll('.palette div');

	renderPalette(palettesData[paletteIndex]);

	document.querySelector('.tap-change')
		.addEventListener("click", () => {

			paletteIndex = (paletteIndex + 1) % palettesData.length;

			renderPalette(palettesData[paletteIndex]);
		});

	function renderPalette({ colors, id }) {

		submitBtn.value = id;

		paletteDivs.forEach((paletteDiv, i) => {

			paletteDiv.style.background = colors[i];
		});
	}
});