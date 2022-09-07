const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (isDevMode, { name }) => {

	return {

		optimization: {
			minimize: !isDevMode,
			minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
		},

		plugins: [

			isDevMode && new ESLintPlugin({
				emitWarning: true,
			}),

			new MiniCssExtractPlugin({
				filename: `styles/${name}.css`,
			}),

			// new FaviconsWebpackPlugin({
			// 		logo: resolve(projectRoot, source.favicon),
			// 		mode: 'light',
			// 		cache: false,
			// 		inject: true,
			// 		favicons: {
			// 			appName: 'vraimentvraiment.com',
			// 			appDescription: 'Vraiment Vraiment\'s 2022 website',
			// 			developerName: 'Lucas Poulain',
			// 			background: '#fff',
			// 			theme_color: '#000',
			// 			icons: {
			// 				coast: false,
			// 				yandex: false
			// 			}
			// 		},
			// 		outputPath: public.paths.images,
			// 	}),

			new class { apply = logLine; }

		].filter(Boolean)
	}
};


function logLine(compiler) {
	compiler.hooks.done.tap("customLogger", (stats) => {
		console.log("\r\n------");
	});
}