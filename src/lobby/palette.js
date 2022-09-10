import 'styles/commons/commons.scss';
import 'styles/palette/palette.scss'
import io from 'socket.io-client';

const socket = io('/palette');

socket.once('CHOSE_PALETTE', ({
	palettesLengths,
	palettes
}) => {

	let paletteIndex = 0;

	const changeButton = document.querySelector('button[name="changePalette"]');
	const submitButton = document.querySelector('button[name="paletteId"][type="submit"]');
	const container = document.querySelector('.palette-container');

	const paletteElements = new Array(palettesLengths)
		.fill(null)
		.map(createPaletteElement);

	renderPalette(paletteIndex);

	changeButton.addEventListener("click", () => {

		renderPalette(++paletteIndex);
	});

	function createPaletteElement() {

		const div = document.createElement('div');

		div.classList.add('palette-element');

		container.appendChild(div);

		return div;
	}

	function renderPalette(index) {

		const { id, colors } = palettes[index % palettes.length];

		submitButton.value = id;

		paletteElements.forEach((element, i) => {
			element.style.background = colors[i];
		});
	}
});