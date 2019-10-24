var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/register", function(req, res) {
  res.render("auth/register");
});

router.post("/register", function(req, res) {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    function(err, user) {
      if (err) {
        console.log(err);
        res.render("auth/register");
      } else {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/campgrounds");
        });
      }
    }
  );
});

router.get("/login", function(req, res) {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

router.get("/logout", function(req, res) {
  req.logOut();
  res.redirect("/");
});

module.exports = router;
