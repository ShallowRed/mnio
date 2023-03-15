import DEFAULT from '#config/app.default';

export const PORT = process.env?.PORT ?? DEFAULT.PORT;

export const COOKIE_SECRET = process.env?.COOKIE_SECRET ?? DEFAULT.COOKIE_SECRET;

export const DB = {
	host: process.env?.DB_HOST ?? DEFAULT.DB.host,
	user: process.env?.DB_USER ?? DEFAULT.DB.user,
	password: process.env?.DB_PASSWORD ?? DEFAULT.DB.password,
	database: process.env?.DB_NAME ?? DEFAULT.DB.database,
};

export const USE_MEMORY_STORE = DEFAULT.USE_MEMORY_STORE;

export const DEFAULT_ROWS = process.env?.DEFAULT_ROWS ?? DEFAULT.DEFAULT_ROWS;
export const DEFAULT_COLS = process.env?.DEFAULT_COLS ?? DEFAULT.DEFAULT_COLS;