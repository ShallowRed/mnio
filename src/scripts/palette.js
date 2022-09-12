import 'styles/commons/commons.scss';
import 'styles/palette/palette.scss';

import io from 'socket.io-client';

const socket = io('/palette');

socket.once('CHOSE_PALETTE', ({
	palettesLengths,
	palettes
}) => {

	let paletteIndex = 0;

	const prevButton = document.querySelector('button[name="prevPalette"]');
	const nextButton = document.querySelector('button[name="nextPalette"]');
	const submitButton = document.querySelector('button[name="paletteId"][type="submit"]');
	const container = document.querySelector('.palette-container');

	const paletteElements = new Array(palettesLengths)
		.fill(null)
		.map(createPaletteElement);

	renderPalette(paletteIndex);

	prevButton.addEventListener("click", () => {

		renderPalette(++paletteIndex);
	});

	nextButton.addEventListener("click", () => {

		renderPalette(--paletteIndex);
	});

	function createPaletteElement() {

		const div = document.createElement('div');

		div.classList.add('palette-element');

		container.appendChild(div);

		return div;
	}

	function renderPalette(index) {

		index = (palettes.length + index) % palettes.length;

		const { id, colors } = palettes[index];

		submitButton.value = id;

		paletteElements.forEach((element, i) => {
			element.style.background = colors[i];
		});
	}
});