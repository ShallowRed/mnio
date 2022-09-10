module.exports = {

	deploy: {

		production: {

			"host": "mnio-deploy",
			"path": "/root/Source/mnio",

			"repo": "git@github:ShallowRed/mnio.git",
			"ref": "origin/deploy",

			'pre-setup': "rm -rf /root/Source/mnio",
			// "post-setup": "",
			
			"pre-deploy-local": "npm run bundle && npm run pre-deploy",
			// "pre-deploy": "pm2 startOrRestart ecosystem.json --env production",
			"post-deploy": "cd /root/Source/Deploy && docker-compose down --remove-orphans && docker-compose up --build -d",
		}
	}
};
