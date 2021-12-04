const express = require('express');
const path = require('path');
const app = express();
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const config = require('./config');

passport.use(new FacebookStrategy({
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        callbackURL: `https://localhost:3000/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
        passReqToCallback: true,
        proxy: true
    },
    function(req, accessToken, refreshToken, profile, cb) {
        // save the profile on the Database
        // Save the accessToken and refreshToken if you need to call facebook apis later on
        return cb(null, profile, accessToken);
    }
));

passport.use(new GoogleStrategy({
        clientID:     config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:3000/auth/google/callback`,
        passReqToCallback   : true,
        proxy: true
    },
    function(request, accessToken, refreshToken, profile, done) {
        //TODO - save token to BE?
        return done(null, profile, accessToken);
    }
));


passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
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
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: `${config.FRONTEND_HOST}/?loginFailed=true`}), (req, res) => {
    if (res.req.user) res.cookie('displayName', res.req.user.displayName)
    if (res.req.authInfo) res.cookie('token', res.req.authInfo)
    res.redirect(config.FRONTEND_HOST)
}) ;

app.get('/auth/google', passport.authenticate('google', { scope: [ 'email', 'profile' ] }))
app.get('/auth/google/callback', passport.authenticate( 'google', { failureRedirect: `${config.FRONTEND_HOST}/?loginFailed=true` }), (req, res) => {
    if (res.req.user) res.cookie('displayName', res.req.user.displayName)
    if (res.req.authInfo) res.cookie('token', res.req.authInfo)
    res.redirect(config.FRONTEND_HOST)
}) ;

app.get('/auth/logout', function(req, res){
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

app.get('/api', function(req, res) { 
  res.send('{"api": "works"}');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(normalizePort(process.env.PORT || '3001'));

console.log(`Server started on port ${process.env.PORT}`);
