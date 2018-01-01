var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    password:String,
    profileCreatedDate: {type:Date, default: Date.now}
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",userSchema);