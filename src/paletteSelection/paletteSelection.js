import './paletteSelection.css'
import '../global.css';

import io from 'socket.io-client';

const socket = io('/palette');

window.addEventListener("load", () => {
	const container = document.querySelector('main');
	container.style.opacity = 1;
});

socket.once('chosePalette', palettesData => {

	console.log(palettesData);

	let paletteIndex = 0;

	let currentPalette = null;

	const paletteDivs = document.querySelectorAll('.palette div');

	renderPalette(palettesData, paletteIndex);

	document.querySelector('.tap-change')
		.addEventListener("click", getNextPalette);

	document.querySelector('.tap-select')
		.addEventListener("click", chosePalette);

	function renderPalette(palettesData, paletteIndex) {

		currentPalette = palettesData[paletteIndex];

		paletteDivs.forEach((paletteDiv, i) => {

			paletteDiv.style.background = currentPalette.colors[i];
		});
	}

	function getNextPalette() {

		paletteIndex = (paletteIndex + 1) % palettesData.length;

		renderPalette(palettesData, paletteIndex);
	}

	function chosePalette() {

		socket.emit("paletteSelected", currentPalette.id);
	}
});

socket.once('redirect', path => {

	window.location = path;
});