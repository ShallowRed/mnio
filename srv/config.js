module.exports = {
	cookieSecret: 'terceseikook',
	port: 3000,
	rows: 20,
	cols: 20,
	db: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DEPLOY_PASSWORD,
		database: 'mnio_rooniax9',
	}
}