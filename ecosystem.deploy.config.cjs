module.exports = {

	deploy: {

		production: {

			"host": "mnio-deploy",
			"path": `/root/Source/Deploy/mnio`,

			"repo": "git@github.com:ShallowRed/mnio.git",
			"ref": "origin/deploy",

			'pre-setup': `rm -rf /root/Source/Deploy/mnio`,

			"pre-deploy-local": "npm run bundle && mv dist public && npm run push-deploy && mv public dist && npm run push-master",

			"pre-deploy": `rm -rf /root/Source/Deploy/mnio/source/dist ; cd /root/Source/Deploy && docker-compose down --remove-orphans`,

			"post-deploy": `mv /root/Source/Deploy/mnio/source/public /root/Source/Deploy/mnio/source/dist ; cd /root/Source/Deploy && docker-compose up --build -d`,
		}
	}
};
