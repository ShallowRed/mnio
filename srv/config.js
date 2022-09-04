module.exports = {
	cookieSecret: 'terceseikook',
	port: 3000,
	rows: 20,
	cols: 20,
	db: process.env.NODE_ENV === 'production' ? {
		host: 'mariadb',
		user: 'root',
		password: process.env.DEPLOY_PASSWORD,
		database: 'mnio_rooniax',
	} : {
		host: 'localhost',
		user: 'root',
		password: '',
		database: 'mnio_rooniax9',
	}
}