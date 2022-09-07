export const PORT = process.env?.PORT || 3000;

export const COOKIE_SECRET = process.env?.COOKIE_SECRET ?? 'my_secret';

export const DB = {
	host: process.env?.DB_HOST ?? 'localhost',
	user: process.env?.DB_USER ?? 'root',
	password: process.env?.DB_PASSWORD ?? '',
	database: process.env?.DB_NAME ?? 'mnio_rooniax__3',
};

// export const USE_MEMORY_STORE = true;
export const USE_MEMORY_STORE = (process.env.USE_MEMORY_STORE && process.env.USE_MEMORY_STORE === 'true') ?? true;

export const DEFAULT_ROWS = process.env?.DEFAULT_ROWS ?? 20;
export const DEFAULT_COLS = process.env?.DEFAULT_COLS ?? 20;