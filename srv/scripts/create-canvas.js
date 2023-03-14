import fs from 'fs';

import { createCanvas } from 'canvas';

import GIFEncoder from 'gif-encoder-2';

import SharedGameMap from '#shared/map';

export default class GridCanvas extends SharedGameMap {

	constructor({ events, gridState, cols, rows }, { cellSize = 1 } = {}) {

		super({ gridState, cols, rows });

		this.cellSize = cellSize;

		this.events = events;

		this.canvas = createCanvas(cols * cellSize, rows * cellSize);

		this.ctx = this.canvas.getContext('2d');
	}

	drawSquare(x, y, color) {

		this.ctx.fillStyle = color;

		this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
	}

	saveFile(outputPath) {

		return new Promise(resolve => {

			const out = fs.createWriteStream(outputPath);

			const stream = this.canvas.createPNGStream();

			stream.pipe(out);

			out.on('finish', () => {

				console.log(`File saved to ${outputPath}`);

				resolve();
			});

		});
	}

	renderResult(outputPath) {

		for (let i = 0, l = this.gridState.length; i < l; i++) {

			const [x, y] = this.indexToCoords(i);

			this.drawSquare(x, y, this.gridState[i]);
		}

		this.saveFile(outputPath);
	}

	async renderTimelapse(outputPath, {
		fps = 30,
		duration = 10,
	} = {}) {

		// if (!fs.existsSync(outputPath)) {
		// 	fs.mkdirSync(outputPath);
		// }

		const cellsPerFrame = Math.floor(this.gridState.length / (fps * duration));

		let count = 0;

		const encoder = new GIFEncoder(this.cols * this.cellSize, this.rows * this.cellSize);

		encoder.setDelay(1);

		encoder.start();

		this.ctx.fillStyle = '#fff';

		this.ctx.fillRect(0, 0, this.cols * this.cellSize, this.rows * this.cellSize);

		for (const { cellid, color } of this.events) {

			const [x, y] = this.indexToCoords(cellid);

			this.drawSquare(x, y, `#${color}`);

			count++;

			if (
				count % cellsPerFrame === 0 ||
				count === this.gridState.length
			) {

				encoder.addFrame(this.ctx);
			}
		}

		encoder.finish();

		const buffer = encoder.out.getData();

		fs.writeFile(outputPath, buffer, error => {

			if (error) {
				console.error(error);
				return;
			}

			console.log('File saved to', outputPath);
		})
	}
}