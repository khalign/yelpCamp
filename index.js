var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");

var User = require("./models/user");
var seedDB = require("./seeds");
var authR = require("./routes/auth");
var campgroundR = require("./routes/campground");
var commentR = require("./routes/comment");

var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/yelp_camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
// seedDB();

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

app.use("/", authR);
app.use("/campgrounds", campgroundR);
app.use("/campgrounds/:id/comments", commentR);

app.listen(3000, function(error) {
  if (error) throw error;
  console.log("Server is running on port 3000");
});
