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
			
			// "pre-deploy-local": "git commit -a -m deploy_src ; git checkout deploy && git merge master ; npm run bundle ; mv dist public && git add . && git commit -m deploy_bundle ; git push origin ; git checkout master && rm -rf public",
			// "pre-deploy": "rm -rf /root/Source/Deploy/mnio/source/dist ; cd /root/Source/Deploy && docker-compose down --remove-orphans",
			// "post-deploy": "mv /root/Source/Deploy/mnio/source/public /root/Source/Deploy/mnio/source/dist ; cd /root/Source/Deploy && docker-compose up --build -d",
		}
	}
};
