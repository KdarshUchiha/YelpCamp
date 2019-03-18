var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//root route
router.get("/", function(req, res)
{
    res.render("landing");
});

//Show Sign up Form
router.get("/register", function(req, res)
{
   res.render("register"); 
});

//Handling User Sign up
router.post("/register", function(req, res)
{
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(error, user)
    {
        if(error)
        {
             return res.render("register", {"error": error.message});
        }
        passport.authenticate("local")(req, res, function()
        {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//Render Login Form
router.get("/login", function(req, res)
{
   res.render("login"); 
});

//Login Logic
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res)
{
    
});

// LOGOUT ROUTE
router.get("/logout", function(req, res)
{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

//MIDDLEWARE
function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;