var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

router.get("/", function(req, res) {
  Campground.find({}, function(err, data) {
    if (err) console.log(err);
    else res.render("campgrounds/index", { campgrounds: data });
  });
});

router.post("/", authenticated, function(req, res) {
  const { name, image, description } = req.body;
  const author = { id: req.user._id, username: req.user.username };
  Campground.create({ name, image, description, author }, function(err, data) {
    if (err) console.log(err);
    //  else console.log(data);
  });
  res.redirect("/campgrounds");
});

router.get("/add", authenticated, function(req, res) {
  res.render("campgrounds/new");
});

router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, campground) {
      if (err) console.log(err);
      else res.render("campgrounds/show", { campground });
    });
});

router.get("/:id/edit", authorized, function(req, res) {
  Campground.findById(req.params.id, function(err, found) {
    if (err) console.log(err);
    else res.render("./campgrounds/edit", { campground: found });
  });
});

router.put("/:id", authorized, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err
  ) {
    if (err) console.log(err);
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

router.delete("/:id", authorized, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, data) {
    if (err) console.log(err);
    else res.redirect("/campgrounds");
  });
});

function authenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

function authorized(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, campground) {
      if (err) res.send("something went wrong");
      else {
        if (campground.author.id.equals(req.user._id)) next();
        else res.send("you cannot edit other people's content");
      }
    });
  } else res.send("you must be logged in");
}

module.exports = router;
