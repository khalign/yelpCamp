var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleswares = require("../middlewares");

router.get("/new", middleswares.isAuth, function(req, res) {
  Campground.findById(req.params.id, function(err, data) {
    if (err) console.log(err);
    else {
      res.render("comments/new", { campground: data });
    }
  });
});

router.post("/", middleswares.isAuth, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) console.log(err);
    else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) console.log(err);
        else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

router.get("/:comment_id/edit", middleswares.commentAuth, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, found) {
    if (err) console.log(err);
    else
      res.render("./comments/edit", {
        campground_id: req.params.id,
        comment: found
      });
  });
});

router.put("/:comment_id", middleswares.commentAuth, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(
    err
  ) {
    if (err) console.log(err);
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

router.delete("/:comment_id", middleswares.commentAuth, function(req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function(err, data) {
    if (err) console.log(err);
    else res.redirect("/campgrounds/" + req.params.id);
  });
});

module.exports = router;
