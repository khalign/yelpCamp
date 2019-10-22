var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

var Campground = require("./models/campground");
var seedDB = require("./seeds");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true
});
seedDB();

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds", { campgrounds: data });
    }
  });
});

app.post("/campgrounds", function(req, res) {
  const { name, image, description } = req.body;
  Campground.create({ name, image, description }, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
  res.redirect("campgrounds");
});

app.get("/campgrounds/add", function(req, res) {
  res.render("new");
});

app.get("/campgrounds/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, campground) {
      if (err) {
        console.log(err);
      } else {
        res.render("show", { campground });
      }
    });
});

app.listen(3000, function(error) {
  if (error) throw error;
  console.log("Server is running on port 3000");
});
