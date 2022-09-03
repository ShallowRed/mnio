const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const babelLoader = {
	exclude: /node_modules/,
	use: "babel-loader"
};

// const imageLoader = path => ({
// 	type: 'asset/resource',
// 	generator: {
// 		filename: `${path}/[name][ext]`,
// 	}
// });

const ejsLoader = {
	test: /\.ejs$/,
	use: [{
	  loader: 'ejs-loader',
	  options: {
		esModule: false
	  }
	}]
  };

// const fontLoader = path => ({
// 	type: 'asset/inline',
// 	// type: 'asset/resource',
// 	// generator: {
// 	//   filename: `${path}/[name][ext]`,
// 	// }
// });

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

// const resolveUrlLoader = {
// 	loader: 'resolve-url-loader',
// };

// const sassLoader = {
// 	loader: 'sass-loader',
// 	options: {
// 		sourceMap: true,
// 		webpackImporter: false,
// 	}
// };

module.exports = (isDevMode) => ({

	rules: [

		!isDevMode && {
			test: /\.js$/,
			...babelLoader,
		},
		// {
		// 	test: new RegExp(extensions.images),
		// 	...imageLoader(paths.images),
		// },
		{
			test: /\.ejs$/,
			...ejsLoader,
		},
		// {
		// 	test: new RegExp(extensions.fonts),
		// 	...fontLoader(paths.fonts)
		// },
		{
			test: /\.(sa|sc|c)ss$/,
			use: [
				MiniCssExtractPlugin.loader,
				cssLoader,
				postCssLoader,
				// resolveUrlLoader,
				// sassLoader
			]
		}
	].filter(Boolean)
});