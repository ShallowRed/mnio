const { resolve } = require('path');

const getPlugins = require('./webpack.plugins.js');
const getRules = require('./webpack.rules.js');

const PUBLIC_FOLDER = '../dist';

const pages = [
	{
		entry: "/lobby/login.js",
		name: "lobby",
	},
	{
		entry: "/lobby/palette.js",
		name: "palette",
	},
	{
		entry: "/game/index.js",
		name: "game",
	}
];

const webpackConfig = (isDevMode, { entry, name }) => ({

	entry,

	output: {
		path: resolve(__dirname, PUBLIC_FOLDER),
		filename: `scripts/${name}.js`,
	},

	resolve: {
		modules: [resolve(__dirname, 'node_modules'), 'node_modules'],
		alias: {
			'styles': resolve(__dirname, 'styles'),
			'shared': resolve(__dirname, '../srv/shared'),
			'game': resolve(__dirname, 'game'),
			'img': resolve(__dirname, 'assets/img'),
		},
	},

	target: "web",

	watch: isDevMode,

	watchOptions: {
		ignored: /srv/,
	},

	devtool: isDevMode && "inline-source-map",

	stats: {
		all: false,
		timings: true,
		version: true,
		outputPath: true,
		depth: false,
		modules: true,
		modulesSpace: 8,
		groupModulesByPath: true,
		children: false,
		assets: true,
		assetsSpace: 10,
		groupAssetsByPath: true,
		logging: "warn",
		errors: true,
		errorsCount: true,
		errorStack: false,
		warnings: true,
		warningsCount: true,
		// children: true,
		excludeModules: m => m.match('data:text') || m.match('css-loader'),
	}
});

module.exports = (env, argv) => {

	isDevMode = argv.mode === 'development';

	return pages.map(page => Object.assign(

		webpackConfig(isDevMode, page),

		getPlugins(isDevMode, page),

		{
			module: getRules(isDevMode)
		}
	));
};