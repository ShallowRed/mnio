module.exports = {

	deploy: {

		production: {

			"host": "rooniax",

			"ref": "origin/deploy",
			"repo": "git@github.com:ShallowRed/mnio.git",
			"path": "/root/Source/mnio",

			"pre-deploy-local": "ls",
			'pre-setup': "rm -rf /root/Source/mnio",
			// "post-setup": "",

			// "pre-deploy": "pm2 startOrRestart ecosystem.json --env production",
			"post-deploy": "cd /root/Source/Deploy && docker-compose down --remove-orphans && docker-compose up --build -d",
		}
	}
};
