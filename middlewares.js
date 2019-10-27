var Campground = require("./models/campground");
var Comment = require("./models/comment");

module.exports = {
  isAuth: function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
  },

  campgroundAuth: function(req, res, next) {
    if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function(err, campground) {
        if (err) res.send("something went wrong");
        else {
          if (campground.author.id.equals(req.user._id)) next();
          else res.send("you cannot edit other people's content");
        }
      });
    } else res.send("you must be logged in");
  },

  commentAuth: function(req, res, next) {
    if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) res.send("something went wrong");
        else {
          if (comment.author.id.equals(req.user._id)) next();
          else res.send("you cannot edit other people's content");
        }
      });
    } else res.send("you must be logged in");
  }
};
