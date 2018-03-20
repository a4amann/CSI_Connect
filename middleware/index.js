var Comment = require("../models/comment");
var Connectblog = require("../models/connectblog");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        res.redirect("/profile");
    },
    checkUserCampground: function(req, res, next){
        if(req.isAuthenticated()){
            Connectblog.findById(req.params.id, function(err, connectblog){
               if(connectblog.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   console.log("BADD!!!");
                   res.redirect("/connectblog/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/profile");
        }
    },
    checkUserComment: function(req, res, next){
        console.log("YOU MADE IT!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
               if(comment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that!");
                   res.redirect("/connectblog/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/profile");
        }
    }
}