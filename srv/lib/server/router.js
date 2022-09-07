import express from 'express';
import serveStatic from 'serve-static';
import flash from 'connect-flash';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { resolve } from 'path';

import * as strategies from '#server/verify-strategies';

import { STRINGS, FIELDS } from '#config/strings';

const PUBLIC_FOLDER_PATH = resolve('../dist');
const staticPublicFolder = serveStatic(PUBLIC_FOLDER_PATH, { index: false });

export default async (tables, sessionStore, USERS_GRID_ID) => {

	const table = await tables.create("gridUsers", USERS_GRID_ID);

	const Router = express.Router();

	Router.use('/assets', staticPublicFolder);

	Router.use(express.json())
		.use(express.urlencoded({ extended: true }))
		.use(sessionStore)
		.use(passport.initialize())
		.use(passport.session())
		.use(flash());

	passport.serializeUser(strategies.serializeUser);

	passport.deserializeUser(strategies.deserializeUser);

	Router.get('/',
		redirectLoggedUsers,
		render('index', {
			stylesheets: ['lobby'],
			text: STRINGS['SITE_TEXT'],
		})
	);

	passport.use('local-username', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'username',
		passReqToCallback: true
	}, strategies.verifyUsername(table)));

	Router.route('/username')
		.get(
			redirectLoggedUsers,
			render('login', {
				action: 'username',
				title: STRINGS['USERNAME_PAGE_TITLE'],
				info: STRINGS['ENTER_USERNAME'],
				submitMessage: STRINGS['USERNAME_SUBMIT_LABEL'],
				fields: [FIELDS.USERNAME],
				stylesheets: ['lobby']
			})
		)
		.post(
			passport.authenticate('local-username', {
				failureRedirect: '/',
			}),
			(req, res) => {
				res.redirect(req.user.exists ? '/login' : '/signup');
			}
		);

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'password',
		passwordField: 'password2',
		passReqToCallback: true
	}, strategies.verifySignup(table)));

	Router.route('/signup')
		.get(
			redirectUnSerializedUsers,
			redirectLoggedUsers,
			render('login', {
				action: 'signup',
				title: STRINGS['SIGNUP_PAGE_TITLE'],
				info: STRINGS['USERNAME_NEW'],
				submitMessage: STRINGS['SIGNUP_SUBMIT_LABEL'],
				fields: [FIELDS.PASSWORD, FIELDS.PASSWORD2],
				stylesheets: ['lobby']
			})
		)
		.post(
			passport.authenticate('local-signup', {
				successRedirect: '/palette',
				failureRedirect: '/signup',
				failureFlash: true
			})
		);

	passport.use('local-login', new LocalStrategy({
		usernameField: 'password',
		passwordField: 'password',
		passReqToCallback: true
	}, strategies.verifyLogin(table)));

	Router.route('/login')
		.get(
			redirectUnSerializedUsers,
			redirectLoggedUsers,
			render('login', {
				action: 'login',
				title: STRINGS['LOGIN_PAGE_TITLE'],
				info: STRINGS['USERNAME_EXISTS'],
				submitMessage: STRINGS['LOGIN_SUBMIT_LABEL'],
				fields: [FIELDS.PASSWORD],
				stylesheets: ['lobby']
			})
		)
		.post(
			passport.authenticate('local-login', {
				successRedirect: '/game',
				failureRedirect: '/login',
				failureFlash: true
			})
		);

	passport.use('local-palette', new LocalStrategy({
		usernameField: 'paletteId',
		passwordField: 'paletteId',
		passReqToCallback: true
	}, strategies.verifyPalette(table)));

	Router.route('/palette')
		.get(
			redirectUnSerializedUsers,
			redirectLoggedUsers,
			render('palette', {
				title: STRINGS['PALETTE_PAGE_TITLE'],
				stylesheets: ['palette'],
				scripts: ['palette']
			})
		)
		.post(
			passport.authenticate('local-palette', {
				successRedirect: '/game',
			})
		);

	Router.get('/game',
		redirectUnLoggedUsers,
		render('game', {
			title: STRINGS['GAME_PAGE_TITLE'],
			stylesheets: ['game'],
			scripts: ['game']
		})
	);

	Router.post('/logout', function (req, res, next) {
		req.logout(function (err) {
			if (err) { return next(err); }
			res.redirect('/');
		});
	});

	Router.use((req, res) => {
		res.redirect('/');
	});

	return Router;
}

function render(path, data) {
	return (req, res) => {

		const errors = req.flash('error');

		data.siteName = STRINGS['SITE_NAME'];

		if (data && errors) {
			data.error = STRINGS[errors[0]];
		}

		res.render(`pages/${path}`, data)
	}
}

function redirectUnSerializedUsers(req, res, next) {
	if (!req.user) {
		return res.redirect('/');
	} else {
		next();
	}
}

function redirectLoggedUsers(req, res, next) {
	if (req.user?.isLoggedIn) {
		res.redirect('/game');
	} else {
		next();
	}
}

function redirectUnLoggedUsers(req, res, next) {
	if (!req.user?.isLoggedIn) {
		return res.redirect('/');
	} else {
		next();
	}
}