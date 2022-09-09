import { STRINGS } from '#config/strings';

export function render(path, data) {

	return (req, res) => {

		const errors = req.flash('error');

		data.siteName = STRINGS['SITE_NAME'];

		if (data && errors) {

			data.error = STRINGS[errors[0]];
		}

		res.render(path, data)
	}
}

export function logout(req, res, next) {

	req.logout(function (err) {

		if (err) {

			return next(err);
		}

		res.redirect('/');
	});
}

export const redirect = {

	at(route) {

		return (_, res) => {

			res.redirect(route);
		};
	},

	get unSerializedUsers() {

		return this.atCondition(req => !req?.user);
	},

	get loggedUsers() {

		return this.atCondition(req => req.user?.isLoggedIn);
	},

	get unLoggedUsers() {

		return this.atCondition(req => !req.user?.isLoggedIn);
	},

	atCondition(condition) {

		return {

			at(route) {

				return (req, res, next) => {

					if (condition(req)) {

						res.redirect(route);

					} else {

						next();
					}
				};
			}
		}
	},
}