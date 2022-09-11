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

		].filter(Boolean)
	}
};