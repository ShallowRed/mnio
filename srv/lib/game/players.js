import SharedPlayers from '#shared/players';

export default class Players extends SharedPlayers {

	constructor(game) {

		super();

		this.game = game;
	}

	getConnectedEnnemies(clientPlayer) {

		return this.values
			.filter(player => {

				return (
					player.connected &&
					player.position !== clientPlayer.position
				);
			})
			.map(player => {

				return {
					userId: player.userId,
					position: player.position
				}
			});
	};

	async create({ userId, paletteId }) {

		const palette = this.game.getPalette(paletteId);

		const ownCells = await this.game.fetchPlayerOwnCells(userId);

		const position = ownCells?.[0] ?? this.game.map.getRandomPosition();

		if (position === false) {

			return false;
		}

		const player = new Player({ userId, position, palette, ownCells });

		this.set(player);

		return player;
	}
}

class Player {

	constructor({ userId, position, palette, ownCells }) {

		this.userId = userId;

		this.palette = palette;

		this.ownCells = ownCells;

		this.position = position;
	}

	updateAllowedCells(map) {

		this.allowedCells = this.ownCells.reduce((cells, position) => {

			const newNeighbours = map.getNeighbours(position)
				.filter(position => {

					return (
						!this.ownCells.includes(position) &&
						map.gridState[position] === null
					)
				});

			cells.push(...newNeighbours);

			return cells;

		}, []);
	}
}
