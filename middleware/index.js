
var Campground = require("../models/campground");

var Comment = require('../models/comment');

var middlewareObj = {};



middlewareObj.checkCampgroundOwner = function(req, res, next){
	
	
		if(req.isAuthenticated()){
		
	     Campground.findById(req.params.id, function(err, foundCampground){
		
		     if(err || !foundCampground){
				 
				 req.flash("error", "Not found Campground");
			
			     res.redirect("back");
			
		       }else{
				   
				   //object
				   //console.log(foundCampground.author.id);
				   
				   //string
				   //console.log(req.user._id);
				   
				   if(foundCampground.author.id.equals(req.user._id)){
					   
					  next();
					   
				   }else{
					   
					 req.flash("error", "You don't have permission to do that.");
					   
					 res.redirect("back");

				   }
				   
		     }

		
	     });
		
		
	}else{

		     req.flash("error", "You need to be logged in to do that.");
		
             res.redirect("back");
		
	}
	
	
}
	



middlewareObj.checkCommentOwner = function(req, res, next){
	
		if(req.isAuthenticated()){
		
	      Comment.findById(req.params.comment_id, function(err, foundComment){
		
		     if(err || !foundComment){
				 
				 req.flash("error", "Comment not found");
			
			     res.redirect("back");
			
		       }else{
				   
				   //object
				   //console.log(foundCampground.author.id);
				   
				   //string
				   //console.log(req.user._id);
				   
				   if(foundComment.author.id.equals(req.user._id)){
					   
					  next();
					   
				   } else{
					   
					  req.flash("error", "You don't have permission to do that.");
					   
					  res.redirect("back");

				   }
				   
		     }

		
	     });
		
		
	}else{
		
		     req.flash("error", "You need to be logged in to do that.");
		
             res.redirect("back");
	}
	
	
}


middlewareObj.isLoggedIn = function(req, res, next){
	
	//middleware

	
	if(req.isAuthenticated()){
		
		return next();
		
	}
	
	req.flash("error", "You need to be logged in to do that");
	
	res.redirect("/login");

}



module.exports = middlewareObj;









