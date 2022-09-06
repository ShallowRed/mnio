export default {

	"games": {
		key: "games",
		columns: {
			"gameid": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"gridrows": "SMALLINT NOT NULL",
			"gridcols": "SMALLINT NOT NULL",
			"gridid": "INT NOT NULL",
			"pokedexid": "INT NOT NULL",
			"flag": "BOOLEAN NOT NULL"
		},
		methods: {
			getLastGame: "SELECT * FROM games ORDER BY gameid DESC LIMIT 1",
			updateGridId: "UPDATE games SET gridid = ? WHERE gameid = ?",
		}
	},

	"game_?__creds": {
		key: "creds",
		columns: {
			"playerid": "MEDIUMINT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"username": "VARCHAR(15) NOT NULL",
			"password": "VARCHAR(20) NOT NULL"
		}
	},

	"game_?__grid": {
		key: "grid",
		columns: {
			"orderid": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"cellid": "MEDIUMINT NOT NULL",
			"playerid": "SMALLINT NOT NULL",
			"color": "VARCHAR(6) NOT NULL"
		}
	},

	"game_?__palettes": {
		key: "palettes",
		columns: {
			"playerid": "SMALLINT PRIMARY KEY NOT NULL",
			"paletteid": "SMALLINT NOT NULL"
		}
	},

	"pokedex_?": {
		key: "pokedex",
		columns: {
			"paletteid": "INT PRIMARY KEY NOT NULL AUTO_INCREMENT",
			"color1": "VARCHAR(6) NOT NULL",
			"color2": "VARCHAR(6) NOT NULL",
			"color3": "VARCHAR(6) NOT NULL",
			"color4": "VARCHAR(6) NOT NULL",
			"color5": "VARCHAR(6) NOT NULL"
		}
	}
};