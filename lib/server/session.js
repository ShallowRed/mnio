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
  resave: false, // Do not save back the session to the session store if it was never modified during the request
  saveUninitialized: false, // Do not save a session that is "uninitialized" to the store
  secret: cookieSecret,
  name: EXPRESS_SID_KEY
});

module.exports = (app, io) => {

  app.use(cookieParser);
  app.use(session);

  app.get('/', function(req, resn, next) {
    req.session.isLogged = true;
    // req.session.username = 'Hello.World';
    next();
  });

  app.get('/palette', function(req, resn, next) {
    req.session.isLogged = true;
    next();
  });

  app.get('/game', function(req, resn, next) {
    req.session.isLogged = true;
    next();
  });

  io.use(function(socket, next) {
    if (!socket.request.headers.cookie)
      return next(new Error('No cookie transmitted.'));

    cookieParser(socket.request, {}, parseErr => {

      if (parseErr)
        return next(new Error('Error parsing cookies.'));

      const sidCookie = getSessionId(socket.request);

      sessionStore.load(sidCookie, (err, session) => {
        if (err) console.log("error");
          // return next(err);
        else if (!session) // Session is empty
          return next(new Error('Session load failed'));

        // else if (session.isLogged !== true) { // Check for auth here
        //   console.log("not logged");
        //   return next(new Error('User not logged in'));
        // }
        // Everything is fine, attach session to handshake data to use it later
        socket.request.session = session;
        socket.request.sessionId = sidCookie;
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
