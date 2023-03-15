const path = require('path');

const PATHS =  {
  APP: './lib/app.js',
  STATIC: './dist',
  VIEWS: './views'
};

import(path.resolve(__dirname, PATHS.APP))
	.then(({ app }) => {

		app({
			STATIC: path.resolve(__dirname, PATHS.STATIC),
			VIEWS: path.resolve(__dirname, PATHS.VIEWS)
		});
	});