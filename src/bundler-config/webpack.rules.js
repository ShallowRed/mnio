const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const babelLoader = {
	exclude: /node_modules/,
	use: "babel-loader"
};

const cssLoader = {
	loader: "css-loader",
	options: {
		importLoaders: 1,
	}
};

const postCssLoader = {
	loader: "postcss-loader",
	options: {
		postcssOptions: {
			ident: "postcss",
			plugins: [
				"postcss-css-variables",
				"postcss-combine-media-query",
				"postcss-combine-duplicated-selectors",
				"postcss-normalize",
				["postcss-preset-env", {
					stage: 3,
					features: {
						"nesting-rules": true
					}
				}]
			]
		}
	}
};

const sassLoader = {
	loader: 'sass-loader',
	options: {
		sourceMap: true,
		webpackImporter: false,
	}
};

const imageLoader = {
	type: 'asset/resource',
	generator: {
		filename: `img/[name][ext]`,
	}
};

module.exports = function getWebpackRules(isDevMode) {

	return [

		!isDevMode && {
			test: /\.js$/,
			...babelLoader,
		},

		{
			test: /\.(png|jpe?g|gif|svg)$/,
			...imageLoader,
		},

		{
			test: /\.(sa|sc|c)ss$/,
			use: [
				MiniCssExtractPlugin.loader,
				cssLoader,
				postCssLoader,
				sassLoader
			]
		}

	].filter(Boolean);
}