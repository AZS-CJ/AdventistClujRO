const express = require('express');
const path = require('path');
const app = express();
const passport = require('passport');
const Strategy = require('passport-facebook').Strategy;
const config = require('./config');

passport.use(new Strategy({
        clientID: config.FACEBOOK_CLIENT_ID,
        clientSecret: config.FACEBOOK_CLIENT_SECRET,
        callbackURL: '/facebook/callback',
        profileFields: ['id', 'displayName', 'email', 'name', 'photos'],
        passReqToCallback: true,
    },
    function(req, accessToken, refreshToken, profile, cb) {
        // save the profile on the Database
        // Save the accessToken and refreshToken if you need to call facebook apis later on
        return cb(null, profile);
    }));
passport.serializeUser(function(user, cb) {
    cb(null, user);
});

console.log('passport-----------------------------------------')

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

function logiiin(re) {
    console.log('logggiiiiiiin ');
    passport.authenticate('facebook');
}

function logiiinCAL(re) {
    console.log('login CALLLL ');
    passport.authenticate('facebook', { failureRedirect: `${config.FRONTEND_HOST}/error`})
}

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/facebook', logiiin);
app.get('/facebook/callback', logiiinCAL, (req, res) => {
    console.log('here')
    res.send(`${config.FRONTEND_HOST}/success`);
}) ;





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

app.listen(normalizePort(process.env.PORT || '3000'));

console.log(`Server started on port ${process.env.PORT}`);
