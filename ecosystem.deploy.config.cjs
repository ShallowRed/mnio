module.exports = {

	deploy: {

		production: {

			"host": "rooniax",

			"ref": "origin/deploy",
			"repo": "git@deployment:ShallowRed/mnio.git",
			"path": "/root/Source/mnio",

			'pre-setup': "rm -rf /root/Source/mnio",
			// "post-setup": "",
			
			"pre-deploy-local": "ls",
			// "pre-deploy": "pm2 startOrRestart ecosystem.json --env production",
			"post-deploy": "cd /root/Source/Deploy && docker-compose down --remove-orphans && docker-compose up --build -d",
		}
	}
};
