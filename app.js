var express           = require("express"),
    app               = express(),
    bodyParser 		  = require("body-parser"),
    mongoose   		  = require("mongoose"),
    passport   		  = require("passport"),
    cookieParser 	  = require("cookie-parser"),
    LocalStrategy	  = require("passport-local"),
    flash        	  = require("connect-flash"),
    Connectblog 	  = require("./models/connectblog"),
    Comment    		  = require("./models/comment"),
    User       		  = require("./models/user"),
    session 		  = require("express-session"),
    moment            = require("moment")
    methodOverride 	  = require("method-override");




mongoose.connect("mongodb://csi:csiconnect@ds119489.mlab.com:19489/csi_connect");



mongoose.Promise = global.Promise

//REQUIRING ROUTES 

var commentRoutes     = require("./routes/comments"),
    connectblogRoutes = require("./routes/connectblog"),
    indexRoutes       = require("./routes/index")


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));


var shortDateFormat = "MM-DD-YYYY"; 
app.locals.moment = moment; 
app.locals.shortDateFormat = shortDateFormat;

app.use(require("express-session")({
    secret: "my project",
    resave: false,
    saveUninitialized: false
}));


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   
   next();
});



//------------------------------------------------------
//------------------------------------------------------
//------------------------------------------------------

app.use("/", indexRoutes);
app.use("/connectblog", connectblogRoutes);
app.use("/connectblog/:id/comments", commentRoutes);

app.listen(3001,function(){
console.log("server is connected now ");
});
