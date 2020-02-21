var express = require("express");

var router = express.Router({mergeParams:true});

var Campground = require("../models/campground");

var Comment = require('../models/comment');

var middleware = require("../middleware/index.js");



//comments new

router.get("/new", middleware.isLoggedIn, function(req, res){
	
	
	Campground.findById(req.params.id, function(err, campground){
		
		if(err){
			
			console.log(err);
			
		}else{
			
			res.render("comments/new", {campground:campground})
			
		}

	});

});


//comment create
router.post("/", middleware.isLoggedIn,function(req, res){
	
	
	Campground.findById(req.params.id, function(err, campground){
		
		if(err){
			
			console.log(err);
			
			res.redirect("/campgrounds");
			
		}else{
			
			Comment.create(req.body.comment, function(err, comment){
				
				
				if(err){
					
					req.flash("error", "Something went wrong");
					
					console.log(err);
					
				}else{
					//add username and id to comment
					comment.author.id = req.user._id;
					
					comment.author.username = req.user.username;
					
					comment.save();
					
					//save comment
					
					campground.comments.push(comment);
					
					campground.save();
					
					req.flash("success", "Successfully added new comment");
					
					res.redirect('/campgrounds/' + campground._id);
					
					
				}
			
			})

		}

	});

});


router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req,res){
	
	Campground.findById(req.params.id, function(err, foundCampground){
		
		    if(err || !foundCampground){
			
			     req.flash("error", "No campground found");
			
			     return res.redirect("back");
		     }
		
		
		Comment.findById(req.params.comment_id, function(err, foundComment){
		
		    if(err){
			
			    res.redirect("back");
			
		     } else{
		
			    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			
		     }
		
		
	    });

		
		
		
	});
	

	
});


//update comment

router.put("/:comment_id", middleware.checkCommentOwner, function(req,res){
	
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		
		if(err){
			
			res.redirect("back");
			
		}else{
			
			res.redirect("/campgrounds/" + req.params.id);
			
		}
		
		
	});
	

	
});


//comment destroy route

router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
	
	
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		
		if(err){
			
			res.redirect("back");
			
		}else{
			
			req.flash("success", "Comment deleted");
			
			res.redirect("/campgrounds/" + req.params.id);
			
		}
		
		
	});
	
	
	
});

// //middleware
// function isLoggedIn(req, res, next){
	
// 	if(req.isAuthenticated()){
		
// 		return next();
		
// 	}
	
// 	res.redirect("/login");
	
// }




module.exports = router;
