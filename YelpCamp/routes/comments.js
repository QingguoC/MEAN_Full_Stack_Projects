var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    midwareObj = require("../middleware");

router.get("/campgrounds/:id/comments/new",midwareObj.isLoggedIn,function (req,res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else{
            res.render("comments/new",{campground:foundCamp});
        }
    })
});
router.get("/campgrounds/:id/comments/:comment_id/edit",function (req,res) {
    Campground.findById(req.params.id,function (err,foundCamp) {
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }else {
            Comment.findById(req.params.comment_id,function (err,foundComment) {
                if(err) {
                    console.log(err);
                    req.redirect("back");
                }else {
                    res.render("comments/edit",{campground:foundCamp,comment:foundComment});
                }
            })
        }
    })

});
router.put("/campgrounds/:id/comments/:comment_id",midwareObj.isOwnerOfComment,function (req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,{new: true},function (err,updatedComment) {
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }else{
            req.flash("success","The last comment was just updated.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

router.delete("/campgrounds/:id/comments/:comment_id",midwareObj.isOwnerOfComment,function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id,function (err) {
        if(err){
            req.flash("error",err.message);
            res.redirect("back");
        }else{
            req.flash("success","The last comment was just deleted.");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})
router.post("/campgrounds/:id/comments",midwareObj.isLoggedIn,function (req,res) {

    Campground.findById(req.params.id,function (err, foundCamp) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else{
            var newComment = req.body.comment;
            Comment.create(newComment, function (err, createdComment) {
                if(err){
                    req.flash("error",err.message);
                    res.redirect("/campgrounds");
                }else{
                    createdComment.author.username = req.user.username;
                    createdComment.author.id = req.user._id;
                    createdComment.save();
                    foundCamp.comments.push(createdComment._id);
                    foundCamp.save();
                    req.flash("success","A new comment was just posted.");
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            })

        }
    })

});



module.exports = router;