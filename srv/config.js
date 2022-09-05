import path from 'path';

export const cookieSecret = 'terceseikook';

export const port = 3000;

export const rows = 20;
export const cols = 20;

export const db = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DEPLOY_PASSWORD,
	database: 'mnio_rooniax10',
};