var passport = require("passport");

module.exports=function(app){
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(require("./twitter"));

  passport.serializeUser(function(user, done) {
    done(null, {
      id: user.id,
      accesstoken: user.accesstoken,
      accesstokenSecret: user.accesstokenSecret,
      displayName: user.displayName,
      username: user.username
    });
  });
  passport.deserializeUser(function(data, done) {
    //console.log("deserialise");

    //console.log(data);

    done(null, data);
  });

}