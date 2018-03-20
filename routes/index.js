var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");




//-------------------------------------
//-------------------------------------
//-------------------------------------



router.get("/", function(req, res){
    res.render("home");

});
router.get("/home", function(req, res){
    res.render("home");

});

router.get("/logfac", function(req, res){
    res.render("logfac");

});
router.get("/logstud", function(req, res){
    res.render("logstud");

});
router.get("/regstud", function(req, res){
    res.render("regstud");

});
router.get("/regfac", function(req, res){
    res.render("regfac");

});

router.get("/connect", function(req, res){
    res.render("connect");

});
router.get("/profile", function(req, res){
    res.render("profile");

});



//-------------------------------------
//-------------------------------------
//-------------------------------------


router.post("/regfac", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            
            return res.render("regfac");
        }
        passport.authenticate("local")(req, res, function(){
           
           res.redirect("/logfac"); 
        });
    });
});

router.post("/regstud", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            
            return res.render("regstud");
        }
        passport.authenticate("local")(req, res, function(){
           
           res.redirect("/logstud"); 
        });
    });
});



router.post("/logstud", passport.authenticate("local", {
    successRedirect: "/connectblog",
    failureRedirect: "/logstud"
}) ,function(req, res){
    
});



router.post("/logfac", passport.authenticate("local", {
    successRedirect: "/connectblog",
    failureRedirect: "/logfac"
}) ,function(req, res){
    
});



router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	
    res.redirect("/profile");
};

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
})

module.exports = router;