const expressCookieParser = require('cookie-parser');
const { cookieSecret } = require('../config');
const cookieParser = expressCookieParser(cookieSecret);

const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
const { connection } = require('../database/mysql');
const sessionStore = new MySQLStore({}, connection);
// const sessionStore = new expressSession.MemoryStore();

const EXPRESS_SID_KEY = 'connect.sid';

const session = expressSession({
  store: sessionStore,
  resave: false,
  // saveUninitialized: false,
  saveUninitialized: true,
  secret: cookieSecret,
  name: EXPRESS_SID_KEY
});

module.exports = (app, io) => {

  app.use(cookieParser);
  app.use(session);

  io.use(function(socket, next) {
    const req = socket.request;

    if (!req.headers.cookie)
      return next(new Error('No cookie transmitted.'));

    cookieParser(req, {}, parseErr => {

      if (parseErr)
        return next(new Error('Error parsing cookies.'));

      const sidCookie = getSessionId(req);

      sessionStore.load(sidCookie, (err, session) => {
        if (err)
          return next(err);
        else if (!session)
          return next(new Error('Session load failed '));

        req.session = session;
        req.sessionId = sidCookie;
        return next();
      });
    });
  });
};

const getSessionId = req => (
    req.secureCookies &&
    req.secureCookies[EXPRESS_SID_KEY]) ||
  (
    req.signedCookies &&
    req.signedCookies[EXPRESS_SID_KEY]) ||
  (
    req.cookies &&
    req.cookies[EXPRESS_SID_KEY]
  );
