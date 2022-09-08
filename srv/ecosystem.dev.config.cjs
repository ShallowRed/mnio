module.exports = {
	apps: {
		script: './entry.cjs',
		watch: ['lib'],
		watch_options: {
			followSymlinks: false
		},
		env: {
			"DEBUG": "app:*",
			"DEBUG_HIDE_DATE": "true",
		}
	}
};
