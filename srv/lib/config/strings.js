export const STRINGS = {

	SITE_NAME: 'Rooniax 2k22',

	SITE_TEXT: `Participez au dessin collaboratif pour l\'anniv d\'Antoine 
	(aussi connu sous le nom de Roonie, Rooniax, Niax, Trounex, et plus récément Toutoune).
	On veut voir des dessins, des messages, pas trop de sguegs mais un peu quand même !`,

	ENTER_USERNAME: 'Saisissez un nom d\'utilisateur',
	USERNAME_NEW: 'Ce nom d\'utilisateur n\'existe pas, voulez-vous le créer ?',
	USERNAME_EXISTS: 'Ce nom d\'utilisateur est déjà pris, saisissez le mot de passe ou choisisez en un autre.',

	ERR_NO_PASS_MATCH: 'Les mots de passe ne correspondent pas',
	ERR_INCORRECT_PASSWORD: 'Mot de passe incorrect pour ce nom d\'utilisateur',

	USERNAME_PAGE_TITLE: 'Se connecter',
	LOGIN_PAGE_TITLE: 'S\'identifier',
	SIGNUP_PAGE_TITLE: 'S\'inscrire',
	PALETTE_PAGE_TITLE: 'Choisir une palette',
	GAME_PAGE_TITLE: 'Dessiner',
	
	USERNAME_FIELD_LABEL: 'Nom d\'utilisateur',
	PASSWORD_FIELD_LABEL: 'Mot de passe pour : ',
	PASSWORD2_FIELD_LABEL: 'Confirmer le mot de passe pour : ',
	USERNAME_FIELD_PLACEHOLDER: '4 à 20 caractères',
	PASSWORD_FIELD_PLACEHOLDER: '4 à 32 caractères',
	RETURN_USERNAME_LABEL: '← Choisir un autre nom',

	PALETTE_PREV_LABEL: '← Précédente',
	PALETTE_NEXT_LABEL: 'Suivante →',
	PALETTE_SUBMIT_LABEL: 'Choisir cette palette',
	PALETTE_INSTRUCTIONS: 'Choisissez une palette de couleurs',
	
	USERNAME_SUBMIT_LABEL: 'Suivant',
	LOGIN_SUBMIT_LABEL:  'S\'identifier',	
	SIGNUP_SUBMIT_LABEL: 'S\'inscrire',
};

const FIELDS = {
	USERNAME: {
		name: 'username',
		type: 'text',
		minLength: 1,
		maxLength: 20,
		label: STRINGS['USERNAME_FIELD_LABEL'],
		placeholder: STRINGS['USERNAME_FIELD_PLACEHOLDER'],
	},
	PASSWORD: {
		name: 'password',
		type: 'password',
		minLength: 1,
		maxLength: 32,
		label: STRINGS['PASSWORD_FIELD_LABEL'],
		placeholder: STRINGS['PASSWORD_FIELD_PLACEHOLDER'],
	},
	PASSWORD2: {
		name: 'password2',
		type: 'password',
		minLength: 1,
		maxLength: 32,
		label: STRINGS['PASSWORD2_FIELD_LABEL'],
		placeholder: STRINGS['PASSWORD_FIELD_PLACEHOLDER'],
	},
};

export const TEMPLATES_DATA = {

	'page-index': {
		stylesheets: ['lobby'],
		prevButton: false,
		text: STRINGS['SITE_TEXT'],
	},

	'page-username': {
		action: 'username',
		title: STRINGS['USERNAME_PAGE_TITLE'],
		info: STRINGS['ENTER_USERNAME'],
		prevButton: false,
		submitMessage: STRINGS['USERNAME_SUBMIT_LABEL'],
		fields: [FIELDS.USERNAME],
		stylesheets: ['lobby']
	},

	'page-signup': {
		action: 'signup',
		title: STRINGS['SIGNUP_PAGE_TITLE'],
		info: STRINGS['USERNAME_NEW'],
		submitMessage: STRINGS['SIGNUP_SUBMIT_LABEL'],
		prevButton: STRINGS['RETURN_USERNAME_LABEL'],
		fields: [FIELDS.PASSWORD, FIELDS.PASSWORD2],
		showUsername: true,
		stylesheets: ['lobby']
	}
	,
	'page-login': {
		action: 'login',
		title: STRINGS['LOGIN_PAGE_TITLE'],
		info: STRINGS['USERNAME_EXISTS'],
		prevButton: STRINGS['RETURN_USERNAME_LABEL'],
		submitMessage: STRINGS['LOGIN_SUBMIT_LABEL'],
		fields: [FIELDS.PASSWORD],
		showUsername: true,
		stylesheets: ['lobby']
	},

	'page-palette': {
		title: STRINGS['PALETTE_PAGE_TITLE'],
		instructions: STRINGS['PALETTE_INSTRUCTIONS'],
		stylesheets: ['palette'],
		scripts: ['palette'],
		prevButton: false,
		prevMessage: STRINGS['PALETTE_PREV_LABEL'],
		nextMessage: STRINGS['PALETTE_NEXT_LABEL'],
		submitMessage: STRINGS['PALETTE_SUBMIT_LABEL'],
	},

	'page-game': {
		title: STRINGS['GAME_PAGE_TITLE'],
		prevButton: false,
		stylesheets: ['game'],
		scripts: ['game']
	}
}