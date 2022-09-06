module.exports = {
	apps: {
		script: './entry.cjs',
		env: {
			"DEBUG": "app:*",
			"DEBUG_HIDE_DATE": "true",
		}
	}
};
