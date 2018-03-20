var express = require("express");
var router  = express.Router();
var Connectblog = require("../models/connectblog");
var middleware = require("../middleware");
var request = require("request");

router.get("/", function(req, res){
    
    Connectblog.find({}, function(err, allConnectblog){
       if(err){
           console.log(err);
       } else {
          
                res.render("connectblog/index",{connectblog:allConnectblog});
            }
            

       
    });
});

//CREATE 
router.post("/", middleware.isLoggedIn, function(req, res){
  
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newConnectblog = {name: name, image: image, description: desc, author:author}

    Connectblog.create(newConnectblog, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            
            console.log(newlyCreated);
            res.redirect("/connectblog");
        }
    });
});

//NEW 
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("connectblog/new"); 
});

// SHOW 
router.get("/:id", function(req, res){
    
    Connectblog.findById(req.params.id).populate("comments").exec(function(err, foundConnectblog){
        if(err){
            console.log(err);
        } else {
            console.log(foundConnectblog)
           
            res.render("connectblog/show", {connectblog: foundConnectblog});
        }
    });
});

router.get("/:id/edit", middleware.checkUserCampground, function(req, res){
    console.log("IN EDIT!");
    
    Connectblog.findById(req.params.id, function(err, foundConnectblog){
        if(err){
            console.log(err);
        } else {
            
            res.render("connectblog/edit", {connectblog: foundConnectblog});
        }
    });
});




router.put("/:id", function(req, res){
    var newData = {name: req.body.name, image: req.body.image, description: req.body.description};
    Connectblog.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, connectblog){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/connectblog/" + connectblog._id);
        }
    });
});



module.exports = router;

