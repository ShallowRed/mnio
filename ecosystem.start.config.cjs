const isDevMode = process.env.NODE_ENV !== "production";

const watchOptions = isDevMode && {

	watch: ['lib', 'shared'],

	watch_options: {
		followSymlinks: false
	},
};

module.exports = {

	apps: {

		cwd: `${__dirname}/srv`,

		script: './entry.cjs',

		...watchOptions,

		env: {
			"DEBUG": "*",
			// "DEBUG": "app:*",
			"DEBUG_HIDE_DATE": "true",
			"DEFAULT_ROWS": 150,
			"DEFAULT_COLS": 150,
		},
	}
};
