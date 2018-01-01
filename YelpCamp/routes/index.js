var express = require("express"),
    router = express.Router(),
    User = require("../models/user"),
    passport = require("passport");

router.get("/",function (req,res) {
    res.render("index/index");
});
router.get("/register",function (req,res) {
    res.render("index/register");
});
router.post("/register",function (req,res) {
    var newUser = new User({
        username:req.body.username,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    });
    User.register(newUser,req.body.password,function (err, user) {
        if(err){
            req.flash("error",err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function () {
            req.flash("success","Welcome to YelpCamp!!!");
            res.redirect("/campgrounds");
        })


    })
});

router.get("/login",function (req,res) {
    res.render("index/login");
});
router.post("/login",passport.authenticate("local",{
    //successReturnToOrRedirect:"/campgrounds",
    failureRedirect:"/login",
    failureFlash : true
}),function (req,res) {
    req.flash("success","Login is successful!");
    if(req.session.returnTo){
        var url = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(url);

    } else {

        res.redirect("/campgrounds");
    }

});

router.get("/logout",function (req,res) {
    req.logout();
    req.flash("success","Logout is successful!");
    res.redirect("/");
})

module.exports = router;