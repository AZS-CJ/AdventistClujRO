const express = require('express');
const request = require('request');
const path = require('path');
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const bodyParser = require('body-parser')
const pino = require('pino-http');
const { sendEmail } = require('./email')
require('dotenv').config()

// because url-join knows only ESM (or only import statements) we 
// need to dynamically import it
let urlJoin ;
import('url-join').then((uj) => urlJoin = uj.default);

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

app.use(pino);

app.use(require('cookie-parser')());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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

const cmsDbHost = process.env.CMS_DB_HOST || 'https://cms-test.adventistcluj.ro';

app.use('/api', function(req, res) {
  var url = urlJoin(cmsDbHost, 'api', req.url);
  req.pipe(request({ qs:req.query, uri: url })).pipe(res);
});

app.use('/uploads', function(req, res) {
  var url = urlJoin(cmsDbHost, 'uploads', req.url);
  req.pipe(request({ qs:req.query, uri: url })).pipe(res);
});

app.post('/email', async(req, res) => {
    sendEmail(req.body, (error) => {
        if (error) {
            res.status(500)
            res.send(error)
        } else res.sendStatus(200)
    })
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(normalizePort(process.env.PORT || '3001'));

console.log(`Server started on port ${process.env.PORT || '3001'}`);
