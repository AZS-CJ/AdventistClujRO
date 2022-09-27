const express = require('express');
const path = require('path');
const app = express();
const passport = require('passport');
const proxy = require('express-http-proxy');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
require('dotenv').config()

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/auth/facebook/callback`,
    profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
    passReqToCallback: true,
    proxy: true
  },
    function (req, accessToken, refreshToken, profile, cb) {
      return cb(null, profile, accessToken);
    }
  ));
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.HOST}/auth/google/callback`,
    passReqToCallback: true,
    proxy: true
  },
    function (request, accessToken, refreshToken, profile, done) {
      //TODO - save token to BE?
      return done(null, profile, accessToken);
    }
  ));
}

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use((req, res, nxt) => {
  nxt();
});
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: `/?loginFailed=true` }), (req, res) => {
  if (res.req.user) res.cookie('displayName', res.req.user.displayName)
  if (res.req.authInfo) res.cookie('token', res.req.authInfo)
  res.redirect('/')
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }))
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `/?loginFailed=true` }), (req, res) => {
  if (res.req.user) res.cookie('displayName', res.req.user.displayName)
  if (res.req.authInfo) res.cookie('token', res.req.authInfo)
  res.redirect('/')
});

app.get('/auth/logout', function (req, res) {
  req.logout();
  res.clearCookie("displayName");
  res.clearCookie("token");
  res.redirect('/');
});

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

app.use(express.static(path.join(__dirname, 'build')));

const cmsDbHost = 'adventistclujro-strapi-test.azurewebsites.net/';
app.use('/api', proxy(cmsDbHost, {
  proxyReqPathResolver: function (req) {
    return `/api${req.url}`;
  }
}));
app.use('/uploads', proxy(cmsDbHost, {
  proxyReqPathResolver: function (req) {
    return `/uploads${req.url}`;
  }
}));

app.use('/uploads', proxy(cmsDbHost, {
    proxyReqPathResolver: function (req) {
        return `/uploads${req.url}`;
    }
}));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(normalizePort(process.env.PORT || '3001'));

console.log(`Server started on port ${process.env.PORT || '3001'}`);
