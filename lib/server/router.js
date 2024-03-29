import express from 'express';
import flash from 'connect-flash';
import passport from 'passport';

import useragent from 'express-useragent';

import createStrategies from '#server/auth-strategies';
import createRoutes from '#server/routes';

export default async function createRouter (tables, sessionMiddleware) {

	createStrategies(passport, tables.get('gridUsers'));

	const router = express.Router()
		.use(useragent.express())
		.use(express.json())
		.use(express.urlencoded({ extended: true }))
		.use(sessionMiddleware)
		.use(passport.initialize())
		.use(passport.session())
		.use(flash());

	createRoutes(router, passport);

	return router;
}