var express     = require("express");
var router      = express.Router({mergeParams: true});
var Connectblog = require("../models/connectblog");
var Comment     = require("../models/comment");
var middleware  = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    
    console.log(req.params.id);
    Connectblog.findById(req.params.id, function(err, connectblog){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {connectblog: connectblog});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
  
   Connectblog.findById(req.params.id, function(err, connectblog){
       if(err){
           console.log(err);
           res.redirect("/connectblog");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               connectblog.comments.push(comment);
               connectblog.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/connectblog/' + connectblog._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {connectblog_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
           res.render("edit");
       } else {
           res.redirect("/connectblog/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err){
        if(err){
            console.log("PROBLEM!");
        } else {
            res.redirect("/connectblog/" + req.params.id);
        }
    })
});

module.exports = router;