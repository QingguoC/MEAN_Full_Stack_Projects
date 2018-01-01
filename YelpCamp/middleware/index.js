
var midwareObj = {},
    Campground = require("../models/campground"),
    Comment = require("../models/comment");

midwareObj.isLoggedIn = function(req,res,next) {

    if(req.isAuthenticated()){
        return next();
    }
    req.session.returnTo = req.path;
    req.flash("error","Please login first");
    res.redirect("/login");
};

midwareObj.isOwnerOfCampground = function (req,res,next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id,function (err,foudnCamp) {
            if(err){
                res.redirect("back");
            }else {
                if(foudnCamp.author.id.equals(req.user._id)){
                    next();
                }else {
                    req.flash("error","You do not have permission to do this.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        })
    }else{
        req.session.returnTo = req.path;
        req.flash("error","Please login first");
        res.redirect("/login");
    }
}

midwareObj.isOwnerOfComment = function (req,res,next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function (err,foudnComment) {
            if(err){
                res.redirect("back");
            }else {
                if(foudnComment.author.id.equals(req.user._id)){
                    next();
                }else {
                    req.flash("error","You do not have permission to do this.");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        })
    }else{
        req.session.returnTo = req.path;
        req.flash("error","Please login first");
        res.redirect("/login");
    }
}

module.exports = midwareObj;