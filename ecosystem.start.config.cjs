const isDevMode = process.env.NODE_ENV !== "production";

const watch = isDevMode && {

	watch: ['./lib'],

	watch_options: {
		followSymlinks: false
	},
};

module.exports = {

	apps: {

		cwd: `${__dirname}/srv`,

		script: './entry.cjs',

		...watch,

		env: {
			"DEBUG": "app:*",
			"DEBUG_HIDE_DATE": "true",
		},
	}
};
