export const cookieSecret = 'terceseikook';

export const port = 3000;

export const rows = 20;
export const cols = 20;

export const db = {
	host: process.env?.DB_HOST ?? 'localhost',
	user: process.env?.DB_USER ?? 'root',
	password: process.env?.DB_PASSWORD ?? '',
	database: 'mnio_rooniax__18',
};