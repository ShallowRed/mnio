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

const resolveUrlLoader = {
	loader: 'resolve-url-loader',
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

module.exports = (isDevMode) => ({

	rules: [

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
				resolveUrlLoader,
				sassLoader
			]
		}
	].filter(Boolean)
});