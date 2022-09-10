import Debug from '#config/debug';
const debug = Debug('game     |');

export class Players {

	collection = {};

	constructor(game) {

		this.game = game;
	}

	get(userId) {

		return this.collection[userId];
	}

	set(userId, player) {

		this.collection[userId] = player;
	}


	async create({ userId, paletteId }) {

		const palette = this.game.getPalette(paletteId);

		const ownCells = await this.game.fetchPlayerOwnCells(userId);

		const position = ownCells?.[0] ?? this.game.map.getRandomPosition();

		if (position === false) {

			return false;
		}

		const player = new Player({ userId, position, palette, ownCells });

		this.set(userId, player);

		return player;
	}
}

export class Player {

	constructor({ userId, position, palette, ownCells }) {

		this.userId = userId;

		this.palette = palette;

		this.ownCells = ownCells;

		this.position = position;
	}

	updateAllowedCells(map) {

		this.allowedCells = this.ownCells.reduce((cells, position) => {

			const newNeighbours = map.getNeighbours(position)
				.filter(position => !this.ownCells.includes(position))

			cells.push(...newNeighbours);

			return cells;

		}, []);
	}
}
