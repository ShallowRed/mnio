const expressCookieParser = require('cookie-parser');
const expressSession = require('express-session');

const EXPRESS_SID_KEY = 'connect.sid';
const COOKIE_SECRET = 'secret';
const cookieParser = expressCookieParser(COOKIE_SECRET);
const sessionStore = new expressSession.MemoryStore();

module.exports = (app, io) => {

  app.use(cookieParser);
  app.use(expressSession({
    store: sessionStore,
    resave: false, // Do not save back the session to the session store if it was never modified during the request
    saveUninitialized: false, // Do not save a session that is "uninitialized" to the store
    secret: COOKIE_SECRET,
    name: EXPRESS_SID_KEY
  }));

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
    const request = socket.request;

    if (!request.headers.cookie) {
      return next(new Error('No cookie transmitted.'));
    }

    cookieParser(request, {}, function(parseErr) {

      if (parseErr) {
        return next(new Error(
          'Error parsing cookies.'));
      }

      const sidCookie = getSessionId(request);

      sessionStore.load(sidCookie, function(err, session) {
        if (err) {
          return next(err);
        } else if (!session) { // Session is empty
          return next(new Error(
          'Session cannot be found/loaded'));
        } else if (session.isLogged !==
          true) { // Check for auth here
          console.log("not logged");
          return next(new Error('User not logged in'));
        } else { // Everything is fine
          // If you want, you can attach the session to the
          // handshake data, so you can use it again later
          request.session = session;
          request.sessionId = sidCookie;
          return next();
        }
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
