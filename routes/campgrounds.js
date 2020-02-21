var express = require("express");

var router = express.Router();

var Campground = require("../models/campground");

var middleware = require("../middleware/index.js");



router.get("/", function(req,res){
	
	//get all from database
	
	Campground.find({}, function(err, allCampgrounds){
		
		if(err){
			
			console.log(err);
			
		}else{
			
			res.render("campgrounds/index", 
					   
					   {campgrounds: allCampgrounds,currentUser: req.user});
			
		}

	});

});


//create a new campground

router.post("/", middleware.isLoggedIn, function(req, res){
	
	
	//get data from form and add to array
	
	var name = req.body.name;
	
	var image = req.body.image;
	
	var desc = req.body.description;
	
	var author = {
		
		id: req.user._id,
		
		username: req.user.username
		
	}
	
	var newCampground = {name: name, image: image, description:desc, author: author};
	
	//create a new and save to database
	
	Campground.create(newCampground, function(err,newlyCreated){
		
		if(err){
			
			console.log(err);
			
		}else{
			
				//redirect to camgrounds page
	
	            res.redirect("/campgrounds");
			
		}

		
	});
	
});


router.get("/new", middleware.isLoggedIn, function(req,res){
	
	
	res.render("campgrounds/new");
	
	
});



router.get("/:id", function(req,res){
	
	//find exact ID
	
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		
		if(err || !foundCampground){
			
		         req.flash("error", "Not found Campground");
			
			     return res.redirect("back");
			
		}else{
			
			console.log(foundCampground);
			
			//render show 
			
			res.render("campgrounds/show", {campground:foundCampground});
			
		}
		
		
	});

	
});

//edit
router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){

	   Campground.findById(req.params.id, function(err, foundCampground){
				   //object
				   //console.log(foundCampground.author.id);
				   
				   //string
				   //console.log(req.user._id);
		
			res.render("campgrounds/edit", {campground: foundCampground});
		
	     });

});


router.put("/:id", function(req, res){
	
	//find and update the correct campground
	
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		
		if(err){
			
			res.redirect("/campgrounds");
			
		}else{
			
			res.redirect("/campgrounds/" + req.params.id);
			
		}
		
		
	});
	
	//redirect somewhere
	
});

//destroy campground

router.delete("/:id", middleware.checkCampgroundOwner, function(req,res){
	
		Campground.findByIdAndRemove(req.params.id, function(err){
		
		if(err){
			
			res.redirect("/campgrounds");
			
		} else{
			
			res.redirect("/campgrounds");
			
		}
		
		
	});
	
	
});



module.exports = router;




