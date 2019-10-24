var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
  Campground.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: data });
    }
  });
});

router.post("/", isAuth, function(req, res) {
  const { name, image, description } = req.body;
  const author = { id: req.user._id, username: req.user.username };
  Campground.create({ name, image, description, author }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  res.redirect("/campgrounds");
});

router.get("/add", isAuth, function(req, res) {
  res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, campground) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground });
      }
    });
});

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

module.exports = router;
