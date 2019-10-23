var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
seedDB();

app.use(
  require("express-session")({
    secret: "this is key for encryption",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

app.get("/", function(req, res) {
  res.render("landing");
});

app.get("/campgrounds", function(req, res) {
  Campground.find({}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: data });
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
  res.redirect("/campgrounds");
});

app.get("/campgrounds/add", function(req, res) {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res) {
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

app.get("/campgrounds/:id/comments/new", isAuth, function(req, res) {
  Campground.findById(req.params.id, function(err, data) {
    if (err) console.log(err);
    else {
      res.render("comments/new", { campground: data });
    }
  });
});

app.post("/campgrounds/:id/comments", isAuth, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) console.log(err);
    else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) console.log(err);
        else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

app.get("/register", function(req, res) {
  res.render("auth/register");
});

app.post("/register", function(req, res) {
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

app.get("/login", function(req, res) {
  res.render("auth/login");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

app.get("/logout", function(req, res) {
  req.logOut();
  res.redirect("/");
});

function isAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}

app.listen(3000, function(error) {
  if (error) throw error;
  console.log("Server is running on port 3000");
});
