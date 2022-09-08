import { STRINGS, FIELDS } from '#config/strings';

export default function(router, passport) {

	router.get('/',
		redirectLoggedUsers,
		render('index', {
			stylesheets: ['lobby'],
			text: STRINGS['SITE_TEXT'],
		})
	);

	router.route('/username')
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

	router.route('/signup')
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

	router.route('/login')
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

	router.route('/palette')
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

	router.get('/game',
		redirectUnLoggedUsers,
		render('game', {
			title: STRINGS['GAME_PAGE_TITLE'],
			stylesheets: ['game'],
			scripts: ['game']
		})
	);

	router.post('/logout', function (req, res, next) {
		req.logout(function (err) {
			if (err) { return next(err); }
			res.redirect('/');
		});
	});

	router.use((req, res) => {
		res.redirect('/');
	});
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