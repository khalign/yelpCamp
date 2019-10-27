var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleswares = require("../middlewares");

router.get("/", function(req, res) {
  Campground.find({}, function(err, data) {
    if (err) console.log(err);
    else res.render("campgrounds/index", { campgrounds: data });
  });
});

router.post("/", middleswares.isAuth, function(req, res) {
  const { name, image, description } = req.body;
  const author = { id: req.user._id, username: req.user.username };
  Campground.create({ name, image, description, author }, function(err, data) {
    if (err) console.log(err);
    //  else console.log(data);
  });
  res.redirect("/campgrounds");
});

router.get("/add", middleswares.isAuth, function(req, res) {
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

router.get("/:id/edit", middleswares.campgroundAuth, function(req, res) {
  Campground.findById(req.params.id, function(err, found) {
    if (err) console.log(err);
    else res.render("./campgrounds/edit", { campground: found });
  });
});

router.put("/:id", middleswares.campgroundAuth, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err
  ) {
    if (err) console.log(err);
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

router.delete("/:id", middleswares.campgroundAuth, function(req, res) {
  Campground.findByIdAndRemove(req.params.id, function(err, data) {
    if (err) console.log(err);
    else res.redirect("/campgrounds");
  });
});

module.exports = router;
