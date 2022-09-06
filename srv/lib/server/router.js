import express from 'express';
import { resolve } from 'path';
import serveStatic from 'serve-static';

import Debug from '#debug';
const debug = Debug('game     |');

const PUBLIC_FOLDER_PATH = resolve('../dist');

debug('Serving static files from', PUBLIC_FOLDER_PATH);

const staticPublicFolder = serveStatic(PUBLIC_FOLDER_PATH, { extensions: ['html'] });

export default express
	.Router()
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(staticPublicFolder);