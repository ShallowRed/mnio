const isDevMode = process.env.NODE_ENV !== "production";

const watch = isDevMode && {

	watch: ['./srv/lib'],
	
	watch_options: {
		followSymlinks: false
	},
};

module.exports = {
	apps: {

		script: './srv/entry.cjs',
		
		...watch,
		
		env: {
			"DEBUG": "app:*",
			"DEBUG_HIDE_DATE": "true",
		},
	}
};
