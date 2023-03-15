export default {

	"grids": {
		name: "grids",
		columns: {
			"gridId": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"gridRows": "SMALLINT NOT NULL",
			"gridCols": "SMALLINT NOT NULL",
			"lastMod": "INT NOT NULL",
			"palettesId": "INT NOT NULL",
			"palettesLengths": "TINYINT NOT NULL",
			"isOver": "BOOLEAN NOT NULL"
		}
	},

	"gridUsers": {
		name: "grid_?__users",
		columns: {
			"userId": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"username": "VARCHAR(255) NOT NULL",
			"password": "VARCHAR(128) DEFAULT NULL",
			"salt": "VARCHAR(32) DEFAULT NULL",
			"paletteId": "INT DEFAULT NULL"
		}
	},

	"gridEvents": {
		name: "grid_?__events",
		columns: {
			"eventId": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"cellid": "INT NOT NULL",
			"userId": "INT NOT NULL",
			"color": "VARCHAR(6) NOT NULL"
		}
	},

	"palettes": {
		name: "palettes_?",
		columns: {
			"paletteId": "INT NOT NULL",
			"colors": "VARCHAR(?) NOT NULL",
		}
	}
};