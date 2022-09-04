module.exports = {
  apps: {
    script: './app.js',
    watch: ["lib", 'app.js'],
    watch_options: {
      followSymlinks: false
    },
	env: {
		"DEBUG": "app:*",
		"DEBUG_HIDE_DATE": "true",
		"DB_HOST": "localhost",
		"DB_USER": "root",
		"DEPLOY_PASSWORD": "",
	  }
  }
};
