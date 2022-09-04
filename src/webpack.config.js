const { resolve } = require('path');

const getPlugins = require('./webpack.plugins.js');
const getRules = require('./webpack.rules.js');

const pages = [
	{
		'entry': "/game/index.js",
		'template': "/game/game.ejs",
		'name': "game",
	},
	// {
	// 	'entry': "/gallery/index.js",
	// 	'template': "/gallery/gallery.ejs",
	// },
	{
		'entry': "/login/index.js",
		'template': "/login/index.ejs",
		'name': "login",
	},
	{
		'entry': "/paletteSelection/paletteSelection.js",
		'template': "paletteSelection/paletteSelection.ejs",
		'name': "palette",
	}
];

const webpackConfig = (isDevMode, page, outputPath) => ({

	entry: page.entry,

	output: {
		path: resolve(__dirname, '../dist') +  `/${page.name}`,
		filename: `${page.name}.js`,
		// publicPath: `/dist/` +  `${page.name}`,
	},

	resolve: {
		modules: [resolve(__dirname, 'node_modules'), 'node_modules']
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