var express = require("express");

var app = express();

var bodyParser = require("body-parser");

var mongoose = require("mongoose");

var Campground = require("./models/campground");

var seedDB = require("./seeds");

var Comment = require('./models/comment');

var passport = require("passport");

var LocalStrategy = require("passport-local");

var User = require("./models/user");

var methodOverride = require("method-override");

var flash = require("connect-flash");
//////////////////////////////////////////////////////////////////////

var commentRoutes = require("./routes/comments");

var campgroundRoutes = require("./routes/campgrounds");

var indexRoutes = require("./routes/index");

//////////////////////////////////////////////////////////////////////


//seed the database

//seedDB();

mongoose.set('useNewUrlParser', true);

mongoose.set('useUnifiedTopology', true);

mongoose.set('useFindAndModify', false);

mongoose.connect("mongodb://localhost/yelp_webdev");

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

app.use(flash());

//////////////////////////////////////////////////////////////////////

//passport configuration

app.use(require("express-session")({
	
    secret: "Rusty is the best and cutest dog in the world",
	
    resave: false,
	
    saveUninitialized: false  // usually the word saveUninitialized get typos a lot...
	
}));
 
app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); 

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());


//<%- include("partials/header") %>
//<%- include("partials/footer") %>

//schema set up
 ///////////////////////////////////////////////////////////////////
app.use(function(req, res, next){
	
	res.locals.currentUser = req.user;
	
	res.locals.error = req.flash("error");
	
	res.locals.success = req.flash("success");
	
	next();
	
});


app.use("/", indexRoutes);

app.use("/campgrounds", campgroundRoutes);

app.use("/campgrounds/:id/comments", commentRoutes);



///////////////////////////////////////////////////////////////////

app.listen(6000, function(){
	
	
	console.log("Yelp Camp start!")
	
	
}); 