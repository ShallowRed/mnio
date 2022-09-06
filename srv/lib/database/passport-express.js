const session = require('express-session');
const app = express();
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const { userResponse, validateUser, secret } = require('./config/config');

const passport = require('passport');
const passportConfig = require('./congif/passportCongig');

app.use(BodyParser.json());
app.use(CookieParser());
app.use(BodyParser.urlencoded({ extended: true }));

passportConfig(passport);

app.use(session({
	secret,
	name: 'cookie',
	resave: false,
	saveUninitialized: false,
	cookie: {
		httponly, //put here some values
		maxAge,
		secure
	}
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/signup', passport.authenticate('local-signup'), userResponse);

app.post('/login', passport.authenticate('local-login'), userResponse);

app.get('/logout', (req, res) => {
	req.logout();
	return res.json({ status: 'success' });
});