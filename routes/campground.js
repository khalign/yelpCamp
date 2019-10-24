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

router.post("/", function(req, res) {
  const { name, image, description } = req.body;
  Campground.create({ name, image, description }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  res.redirect("/campgrounds");
});

router.get("/add", function(req, res) {
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

module.exports = router;
