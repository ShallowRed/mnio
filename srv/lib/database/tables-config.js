export default {

	"grids": {
		name: "grids",
		columns: {
			"gridId": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"gridRows": "SMALLINT NOT NULL",
			"gridCols": "SMALLINT NOT NULL",
			"lastMod": "INT NOT NULL",
			"palettesId": "INT NOT NULL",
			"isOver": "BOOLEAN NOT NULL"
		}
	},

	"gridUsers": {
		name: "grid_?__users",
		columns: {
			"userId": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"username": "VARCHAR(255) NOT NULL",
			"password": "VARCHAR(255) DEFAULT NULL",
			"salt": "VARCHAR(255) DEFAULT NULL",
			"paletteId": "SMALLINT DEFAULT NULL"
		}
	},

	"gridEvents": {
		name: "grid_?__events",
		columns: {
			"eventId": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"cellid": "MEDIUMINT NOT NULL",
			"userId": "SMALLINT NOT NULL",
			"color": "VARCHAR(6) NOT NULL"
		}
	},

	"gridPalettes": {
		name: "grid_?__palettes",
		columns: {
			"userId": "SMALLINT PRIMARY KEY NOT NULL",
			"paletteId": "SMALLINT NOT NULL"
		}
	},

	"palettes": {
		name: "palettes_?",
		columns: {
			"paletteId": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"color1": "VARCHAR(6) NOT NULL",
			"color2": "VARCHAR(6) NOT NULL",
			"color3": "VARCHAR(6) NOT NULL",
			"color4": "VARCHAR(6) NOT NULL",
			"color5": "VARCHAR(6) NOT NULL"
		}
	}
};