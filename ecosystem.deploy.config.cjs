const REMOTE_PATH = "/root/Source/Deploy";

module.exports = {

	deploy: {

		production: {

			"host": "mnio-deploy",
			"path": `${REMOTE_PATH}/mnio`,

			"repo": "git@github.com:ShallowRed/mnio.git",
			"ref": "origin/deploy",

			"pre-setup": `rm -rf ${REMOTE_PATH}/mnio`,

			"pre-deploy-local": "npm run bundle && mv dist public && npm run push-deploy && mv public dist && npm run push-master",

			"pre-deploy": `rm -rf ${REMOTE_PATH}/mnio/source/dist ; cd ${REMOTE_PATH} && docker-compose down --remove-orphans`,

			"post-deploy": `mv ${REMOTE_PATH}/mnio/source/public ${REMOTE_PATH}/mnio/source/dist ; cd ${REMOTE_PATH} && docker-compose up --build -d`,
		}
	}
};
