const isDevMode = process.env.NODE_ENV !== "production";

const watch = isDevMode && {

	watch: ['lib', 'shared'],

	watch_options: {
		followSymlinks: false
	},
};
console.log(watch);


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
