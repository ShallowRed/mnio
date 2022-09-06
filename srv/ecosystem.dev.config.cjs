module.exports = {
	apps: {
		script: './entry.cjs',
		watch: ['lib', 'app.js', 'entry.cjs', 'debug.js', 'config.js'],
		watch_options: {
			followSymlinks: false
		},
		env: {
			"DEBUG": "app:*",
			"DEBUG_HIDE_DATE": "true",
			"USE_MEMORY_STORE": "false",
		}
	}
};
