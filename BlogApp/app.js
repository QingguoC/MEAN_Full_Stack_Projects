var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost/blog_app");

var schema = mongoose.Schema({
    title: String,
    image:String,
    body:String,
    created: {type:Date, default: Date.now}
});
var Blog =  mongoose.model("Blog",schema);

app.get("/",function (req,res) {
    res.redirect("/blogs");
});
app.get("/blogs",function (req,res) {
    Blog.find({},function (err,allBlogs) {
        if(err){
            res.send("Access failed!!")
        }else {
            res.render("index",{blogs:allBlogs});
        }
    })

});
app.get("/blogs/new",function (req,res) {
    res.render("new")
});
app.get("/blogs/:id",function (req,res) {
    Blog.findById(req.params.id,function (err,foundBlog) {
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("show",{blog:foundBlog});
        }
    })
});
app.get("/blogs/:id/edit",function (req,res) {
    Blog.findById(req.params.id,function (err,foundBlog) {
        if(err){
            res.redirect("/blogs");
        }else {
            res.render("edit",{blog:foundBlog});
        }
    })
});
app.put("/blogs/:id",function (req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function (err,updated) {
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})
app.delete("/blogs/:id",function (req,res) {
    Blog.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    })
})
app.post("/blogs",function (req,res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    var newBlog = req.body.blog;
    Blog.create(newBlog,function (err,newCreated) {
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs")
        }
    })
})
app.listen("3000","localhost",function () {
    console.log("Blog App started!")
});
