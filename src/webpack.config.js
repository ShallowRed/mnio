const { resolve } = require('path');

const getWebpackConfig = require('./bundler-config/webpack.commons.js');

const PAGES_CONFIG = [
	{
		ENTRY: "/scripts/lobby.js",
		OUTPUT_FILENAME: "lobby",
	},
	{
		ENTRY: "/scripts/palette.js",
		OUTPUT_FILENAME: "palette",
	},
	{
		ENTRY: "/scripts/index.js",
		OUTPUT_FILENAME: "game",
	}
];

const COMMONS_CONFIG = {

	PUBLIC_FOLDER: resolve(__dirname, '../dist'),

	ALIASES: {
		'shared': resolve(__dirname, '../srv/shared'),
		'styles': resolve(__dirname, 'styles'),
		'game': resolve(__dirname, 'game'),
		'resources': resolve(__dirname, 'resources'),
	},

	IGNORE_WATCH: /srv\/(?!shared)/,

	NODE_MODULES_PATH: resolve(__dirname, 'node_modules'),
};


module.exports = PAGES_CONFIG.map(pageConfig => {

	return getWebpackConfig({
		...COMMONS_CONFIG,
		...{ PAGE: pageConfig }
	})
});