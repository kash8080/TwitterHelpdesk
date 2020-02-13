var router = require("express").Router();
var passport = require("passport");

router.get("/login", function(req, res, next) {
  //res.render("login", { title: "Login" });
  res.redirect("/auth/twitter/callback");
});

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
router.get("/twitter", passport.authenticate("twitter"));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get(
  "/twitter/callback",
  passport.authenticate("twitter", {
    successRedirect: "/",
    failureRedirect: "/auth/login"
  })
);

module.exports = router;
