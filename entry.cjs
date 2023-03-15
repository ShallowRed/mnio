const path = require('path');

const PATHS =  {
  APP: './lib/app.js',
  PUBLIC_ASSETS: './dist',
  VIEWS: './views'
};

import(path.resolve(__dirname, PATHS.APP))
	.then(({ app }) => {

		app({
			PUBLIC_ASSETS: path.resolve(__dirname, PATHS.PUBLIC_ASSETS),
			VIEWS: path.resolve(__dirname, PATHS.VIEWS)
		});
	});