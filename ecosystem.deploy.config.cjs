module.exports = {

	deploy: {

		production: {

			"host": "mnio-deploy",
			"path": "/root/Source/Deploy/mnio",

			"repo": "git@github:ShallowRed/mnio.git",
			"ref": "origin/deploy",

			'pre-setup': "rm -rf /root/Source/Deploy/mnio",
			// "post-setup": "",
			
			"pre-deploy-local": "npm run bundle && npm run pre-deploy",

			"pre-deploy": "cd /root/Source/Deploy && docker-compose down --remove-orphans",
			"post-deploy": "cd /root/Source/Deploy && docker-compose up --build -d",
		}
	}
};
