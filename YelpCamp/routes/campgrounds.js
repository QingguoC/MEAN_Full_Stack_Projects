var express = require("express"),
    router = express.Router(),
    Campground = require("../models/campground"),
    midwareObj = require("../middleware");

// Campground.create({
//     name: "coldspring",
//     image:"http://www.photosforclass.com/download/6090714876",
//     description:"blalifie-d g "
// },function (err,newcreated) {
//     if(err){console.log(err)}
//     else{
//         console.log(newcreated);
//     }
// })
router.get("/campgrounds",function (req,res) {
    Campground.find({},function (err,allCampgrounds) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/");
        } else{
            res.render("campgrounds/campgrounds",{campgrounds:allCampgrounds});

        }

    })

});
router.post("/campgrounds",midwareObj.isLoggedIn,function (req,res) {
    var user = {
        id:req.user._id,
        username:req.user.username
    }
    var newCamp = new Campground({
        name:req.body.name,
        image:req.body.image,
        price:req.body.price,
        description:req.body.description,
        author:user
    });
    Campground.create(newCamp,function (err,newcreated) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else{
            req.flash("success","A new campground was just posted.");
            res.redirect("/campgrounds");
        }
    })
})
router.get("/campgrounds/new",midwareObj.isLoggedIn,function (req,res) {
    res.render("campgrounds/new");
});
router.get("/campgrounds/:id/edit",midwareObj.isOwnerOfCampground,function (req,res) {
    Campground.findById(req.params.id,function (err,foundCamp) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else {
            res.render("campgrounds/edit",{campground:foundCamp});
        }
    })
})
router.get("/campgrounds/:id",function (req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else{

            res.render("campgrounds/show",{campground:foundCamp});
        }
    })

});
router.put("/campgrounds/:id",midwareObj.isOwnerOfCampground,function (req,res) {
    var updated = req.body.camp;
    Campground.findByIdAndUpdate(req.params.id, updated,function(err,foundCamp) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else{
            req.flash("success","The campground was just updated.");
            res.redirect("/campgrounds/" + req.params.id );
        }
    })

});
router.delete("/campgrounds/:id",midwareObj.isOwnerOfCampground,function (req,res) {
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            req.flash("error",err.message);
            res.redirect("/campgrounds");
        }else{
            req.flash("success","The last campground was deleted.");
            res.redirect("/campgrounds");
        }
    })
})

module.exports = router;