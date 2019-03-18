var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res)
{
    // Get All campgrounds from DB
    Campground.find({}, function(error, allCampgrounds)
    {
        if(error)
        {
            console.log(error);
        }   else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
    
});

// CREATE - add new campground to DB 
router.post("/", middleware.isLoggedIn, function(req, res)
{
    //get the data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author: author}
    //Create a new campground and save to DB
    Campground.create(newCampground, function(error, newlyCreated)
    {
       if(error)
       {
           console.log("OH NO!!!");
           console.log(error);
       }   else {
           //redirect back to campgrounds page
           console.log(newlyCreated);
           res.redirect("/campgrounds");
       }
    });
});

//NEW- show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res)
{
    res.render("campgrounds/new");
});

// SHOW - show more info about one campground
router.get("/:id", function(req, res)
{
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground)
    {
        if(error)
        {
            console.log(error);
        }   else {
            console.log(foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res)
{
    //is user loged in
    Campground.findById(req.params.id, function(error, foundCampground)
    {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
   //find and update the correct campground
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground)
   {
      if(error){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      } 
   });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res)
{
    Campground.findByIdAndRemove(req.params.id, function(error)
    {
        if(error)
        {
            res.redirect("/campgrounds");
        }   else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;