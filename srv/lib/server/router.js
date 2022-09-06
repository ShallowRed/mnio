import { Router, json, urlencoded } from 'express';
import { resolve } from 'path';
import serveStatic from 'serve-static';

import Debug from '#debug';
const debug = Debug('app:router');

const isPassenger = typeof (PhusionPassenger) !== 'undefined';

const options = isPassenger ? {} : {
	setHeaders: function (res, path, stat) {
		res.set('Service-Worker-Allowed', '/');
	}
};

const PUBLIC_FOLDER = resolve('../dist');

const router = Router();

router.use(json());

router.use(urlencoded({
	extended: true
}));

router.use(serveStatic(PUBLIC_FOLDER, { extensions: ['html'] }));

debug('Serving static files from', PUBLIC_FOLDER);

export default router;
