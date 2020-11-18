const expressCookieParser = require('cookie-parser');
const expressSession = require('express-session');

// We define the key of the cookie containing the Express SID
const EXPRESS_SID_KEY = 'connect.sid';

// We define a secret string used to crypt the cookies sent by Express
const COOKIE_SECRET = 'secret';
const cookieParser = expressCookieParser(COOKIE_SECRET);

// Create a new store in memory for the Express sessions
const sessionStore = new expressSession.MemoryStore();

module.exports = (app, io) => {

  // Configure Express app with :
  // * Cookie Parser created above
  // * Configure session
  app.use(cookieParser);
  app.use(expressSession({
    store: sessionStore, // We use the session store created above
    resave: false, // Do not save back the session to the session store if it was never modified during the request
    saveUninitialized: false, // Do not save a session that is "uninitialized" to the store
    secret: COOKIE_SECRET, // Secret used to sign the session ID cookie. Must use the same as speficied to cookie parser
    name: EXPRESS_SID_KEY // Custom name for the SID cookie
  }));

  // Very basic routes
  app.get('/', function(req, resn, next) {
    req.session.isLogged = true;
    // req.session.username = 'Hello.World';
    next();
  });

  app.get('/login', function(req, resn, next) {
    req.session.isLogged = true;
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

  // Socket.IO 1 is now using middlewares
  // We can use this functionnality to implement authentification
  io.use(function(socket, next) {
    const request = socket.request;

    if (!request.headers.cookie) {
      // If we want to refuse authentification, we pass an error to the first callback
      return next(new Error('No cookie transmitted.'));
    }

    // We use the Express cookieParser created before to parse the cookie
    // Express cookieParser(req, res, next) is used initialy to parse data in "req.headers.cookie".
    // Here our cookies are stored in "request.headers.cookie", so we just pass "request" to the first argument of function
    cookieParser(request, {}, function(parseErr) {

      if (parseErr) {
        return next(new Error(
          'Error parsing cookies.'));
      }

      // Get the SID cookie
      const sidCookie = (
        request.secureCookies &&
        request.secureCookies[EXPRESS_SID_KEY]) ||
        (
          request.signedCookies &&
          request.signedCookies[EXPRESS_SID_KEY]) ||
        (
          request.cookies &&
          request.cookies[EXPRESS_SID_KEY]
        );

      // Then we just need to load the session from the Express Session Store
      sessionStore.load(sidCookie, function(err, session) {

        // And last, we check if the used has a valid session and if he is logged in
        if (err) {
          return next(err);

          // Session is empty
        } else if (!session) {
          return next(new Error(
            'Session cannot be found/loaded'));

        //   // Check for auth here, here is a basic example
        } else if (session.isLogged !== true) {
          console.log("not logged");
          return next(new Error('User not logged in'));

          // Everything is fine
        } else {
          // If you want, you can attach the session to the handshake data, so you can use it again later
          // You can access it later with "socket.request.session" and "socket.request.sessionId"
          request.session = session;
          request.sessionId = sidCookie;

          return next();
        }
      });
    });
  });

};

// io.on('connection', function(socket) {
//
//   // Just an exemple showing how to get data from the session
//   // It's in the auth middleware we assigned the session data to "socket.request", we can then easily use it here
//   console.log("socket.request.session.username :", socket.request.session.username);
//   console.log("socket.request.sessionId :", socket.request.sessionId);
// });
