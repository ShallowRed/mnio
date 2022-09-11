const getPlugins = require('./webpack.plugins.js');
const getRules = require('./webpack.rules.js');

function getWebpackConfig(isDevMode, CONFIG) {

	return {

		entry: CONFIG.PAGE.ENTRY,

		output: {
			path: CONFIG.PUBLIC_FOLDER,
			filename: `scripts/${CONFIG.PAGE.OUTPUT_FILENAME}.js`,
		},

		resolve: {
			modules: [CONFIG.NODE_MODULES_PATH, 'node_modules'],
			alias: CONFIG.ALIASES
		},

		target: "web",

		watch: isDevMode,

		watchOptions: {
			ignored: CONFIG.IGNORE_WATCH
		},

		devtool: isDevMode && "inline-source-map",

		stats
	}
};

module.exports = (CONFIG) => {

	return (_, argv) => {

		const isDevMode = argv.mode === 'development';

		return {

			...getWebpackConfig(isDevMode, CONFIG),

			...getPlugins(isDevMode, CONFIG),

			module: {

				rules: getRules(isDevMode)
			}
		}
	}
};

const stats = {
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