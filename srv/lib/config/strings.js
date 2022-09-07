export const STRINGS = {

	SITE_NAME: 'Rooniax 2k22',

	SITE_TEXT: 'Participez au dessin collaboratif pour l\'anniv du Rooniax',

	ENTER_USERNAME: 'Saisissez un nom d\'utilisateur',
	USERNAME_NEW: 'Ce nom d\'utilisateur n\'existe pas, s\'inscrire',
	USERNAME_EXISTS: 'Ce nom d\'utilisateur est déjà pris',

	ERR_NO_PASS_MATCH: 'Les mots de passe ne correspondent pas',
	ERR_INCORRECT_PASSWORD: 'Mot de passe incorrect',

	USERNAME_PAGE_TITLE: 'Se connecter',
	LOGIN_PAGE_TITLE: 'S\'identifier',
	SIGNUP_PAGE_TITLE: 'S\'inscrire',
	PALETTE_PAGE_TITLE: 'Choisir une palette',
	GAME_PAGE_TITLE: 'Dessiner',
	
	USERNAME_FIELD_LABEL: 'Nom d\'utilisateur',
	PASSWORD_FIELD_LABEL: 'Mot de passe',
	PASSWORD2_FIELD_LABEL: 'Confirmer le mot de passe',
	USERNAME_FIELD_PLACEHOLDER: '4 à 20 caractères',
	PASSWORD_FIELD_PLACEHOLDER: '4 à 32 caractères',
	
	USERNAME_SUBMIT_LABEL: 'Suivant',
	LOGIN_SUBMIT_LABEL:  'S\'identifier',	
	SIGNUP_SUBMIT_LABEL: 'S\'inscrire',
};

export const FIELDS = {
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