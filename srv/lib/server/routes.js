import { redirect, render, logOut } from '#server/middlewares';

import { TEMPLATES_DATA } from '#config/strings';

export default function createRoutes (router, passport) {

	router.route('/')
		.get(
			redirect.loggedUsers.at('/game'),
			render('pages/index', TEMPLATES_DATA['page-index'])
		);

	router
		.route('/username')
		.get(
			redirect.loggedUsers.at('/game'),
			render('pages/lobby', TEMPLATES_DATA['page-username'])
		)
		.post(
			passport.authenticate('local-username', {
				failureRedirect: '/',
			}),
			(req, res) => {
				res.redirect(req.user.exists ? '/login' : '/signup');
			}
		);

	router.route('/signup')
		.get(
			redirect.unSerializedUsers.at('/'),
			redirect.loggedUsers.at('/game'),
			render('pages/lobby', TEMPLATES_DATA['page-signup'])
		)
		.post(
			passport.authenticate('local-signup', {
				successRedirect: '/palette',
				failureRedirect: '/signup',
				failureFlash: true
			})
		);

	router.route('/login')
		.get(
			redirect.unSerializedUsers.at('/'),
			redirect.loggedUsers.at('/game'),
			render('pages/lobby', TEMPLATES_DATA['page-login'])
		)
		.post(
			passport.authenticate('local-login', {
				successRedirect: '/game',
				failureRedirect: '/login',
				failureFlash: true
			})
		);

	router.route('/palette')
		.get(
			redirect.unSerializedUsers.at('/'),
			redirect.loggedUsers.at('/game'),
			render('pages/palette', TEMPLATES_DATA['page-palette'])
		)
		.post(
			passport.authenticate('local-palette', {
				successRedirect: '/game',
				failureRedirect: '/palette',
			})
		);

	router.route('/game')
		.get(
			redirect.unLoggedUsers.at('/'),
			render('pages/game', TEMPLATES_DATA['page-game'])
		);

	router.post('/logout', logOut);

	router.use(redirect.at('/'));
}