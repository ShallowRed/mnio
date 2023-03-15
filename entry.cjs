const path = require('path');

import('./lib/app.js')
	.then(({ app }) => {

		const PATHS =  {
			PUBLIC_ASSETS: path.resolve(__dirname, './dist'),
			VIEWS: path.resolve(__dirname, './views')
		};

		app(PATHS);
	});