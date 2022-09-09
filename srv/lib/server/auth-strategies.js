import { Strategy as LocalStrategy } from 'passport-local';

import saltHash from '#database/salt-hash';

import Debug from '#config/debug';
const debug = Debug('passport |');

export default function createStrategies(passport, table) {

	passport.serializeUser(serializeUser);

	passport.deserializeUser(deserializeUser);

	passport.use('local-username', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'username',
		passReqToCallback: true
	}, verifyUsername(table)));

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'password',
		passwordField: 'password2',
		passReqToCallback: true
	}, verifySignup(table)));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'password',
		passwordField: 'password',
		passReqToCallback: true
	}, verifyLogin(table)));

	passport.use('local-palette', new LocalStrategy({
		usernameField: 'paletteId',
		passwordField: 'paletteId',
		passReqToCallback: true
	}, verifyPalette(table)));
}

function serializeUser(user, done) {

	// debug('- serializeUser:', user);
	
	done(null, {
		userId: user?.userId,
		username: user?.username,
		isLoggedIn: user?.isLoggedIn ?? false,
		paletteId: user?.paletteId ?? null
	});
}

async function deserializeUser(user, done) {

	// debug('- deserializeUser:', user);

	done(null, user);
}

function verifyUsername(table) {

	return async (req, username, _, done) => {

		debug('POST /username:', username);

		const userId = await table.select('userId', { where: { "username": username }, limit: 1 });

		if (userId) {

			debug(`'Username '${username}' already exists`);

			return done(
				null,
				{ username, userId, exists: true },
			);

		} else {

			debug(`'Username '${username}' does not exist`);

			const insertId = await table.insert({ "username": username });

			debug(`Stored username '${username}' with userId '${insertId}'`);

			return done(
				null,
				{ username, exists: false, userId: insertId },
			);
		}
	}
}

function verifySignup(table) {

	return async (req, password, password2, done) => {

		const username = req.user.username;
		const userId = req.user.userId;

		debug('POST /signup:', username);

		if (password !== password2) {

			debug(`Passwords from username '${username}' do not match`);

			return done(
				null,
				false,
				{ 'message': 'NO_PASS_MATCH' }
			);
		}

		debug(`Passwords sent from username '${username}' match`);

		const { hash, salt } = saltHash(password);

		await table.update({ "password": hash, "salt": salt }, { where: { "userId": userId } });

		debug(`Stored password for username '${username}' with userId '${userId}'`);

		return done(
			null,
			{ username, userId }
		);
	}
}

function verifyLogin(table) {

	return async (req, password, _, done) => {

		const username = req.user.username;
		const userId = req.user.userId;

		debug('POST /login:', username);

		const results = await table.select('*', { where: { "userId": userId }, limit: 1 });

		const { hash } = saltHash(password, results.salt);

		if (hash === results.password) {

			debug(`Password for username '${username}' with userId '${userId}' is correct`);

			return done(
				null,
				{ username, userId, isLoggedIn: true, paletteId: results.paletteId }
			);

		} else {

			debug(`Password for '${username}' with userId '${userId}' is not correct`);

			return done(
				null,
				false,
				{ 'message': 'INCORRECT_PASSWORD' }
			);
		}
	}
}

function verifyPalette(table) {

	return async (req, paletteId, _, done) => {

		const username = req.user.username;
		const userId = req.user.userId;

		debug('POST /palette:', username);

		await table.update({ "paletteId": paletteId }, { where: { "userId": userId } });

		return done(
			null,
			{ username, userId, isLoggedIn: true, paletteId: parseInt(paletteId, 10) }
		);
	}
}