module.exports = {

	deploy: {

		production: {

			"key": "~/.ssh/id_ed25519",
			"user": "root",
			"host": [{
				"host": "roonie.duque.bzh",
				"port": "4242",
			}],
			"ref": "origin/deploy",
			"repo": "git@github.com:ShallowRed/mnio.git",
			"path": "/root/Source/mnio",

			"pre-deploy-local": "ls",
			'pre-setup': "rm -rf /root/Source/mnio",
			// "post-setup": "cd /root/Source/Deploy && docker-compose down --remove-orphans && docker-compose up --build -d",
			
			// "pre-deploy": "pm2 startOrRestart ecosystem.json --env production",
			// "post-deploy": "pm2 startOrRestart ecosystem.json --env production",
		}
	}
};
