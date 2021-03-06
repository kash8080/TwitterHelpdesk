"use strict";

const TwitterStrategy = require("passport-twitter").Strategy;

module.exports = new TwitterStrategy(
  {
    consumerKey: process.env.CONSUMER_KEY,
    consumerSecret: process.env.CONSUMER_KEY_SECRET,
    callbackURL: "/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    /*
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });*/
    profile.accesstoken = token;
    profile.accesstokenSecret = tokenSecret;

    done(null, profile);
  }
);
