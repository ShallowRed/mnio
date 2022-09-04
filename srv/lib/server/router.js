const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');

const Debug = require('@debug');
const debug = Debug('app:router');

const isPassenger = typeof (PhusionPassenger) !== 'undefined';

const options = isPassenger ? {} : {
	setHeaders: function (res, path, stat) {
		res.set('Service-Worker-Allowed', '/');
	}
};

const PUBLIC_FOLDER = path.resolve('../dist');

const router = express.Router();

router.use(express.json());

router.use(express.urlencoded({
	extended: true
}));

router.use(serveStatic(PUBLIC_FOLDER, { extensions: ['html'] }));

debug('Serving static files from', PUBLIC_FOLDER);

router.route('/')
	.get((req, res, next) => {
		res.redirect('/login/');
		next();
	});

router.route('/palette')
	.get((req, res, next) => {
		res.redirect('/palette/');
		next();
	});

router.route('/game')
	.get((req, res, next) => {
		res.redirect('/game/');
		next();
	});

module.exports = router;
