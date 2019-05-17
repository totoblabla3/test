const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postScheme = new Schema({pids: [String],});

const userScheme = new Schema({uid: [{ uid: String, name: String, balls: Number}]});
const ShopBallsScheme = new Schema({uid: [{ uid: String, balls: Number}]});

ShopBallsScheme.set('toJSON',{
  virtuals:true
});
userScheme.set('toJSON',{
  virtuals:true
});
postScheme.set('toJSON',{
  virtuals:true
});

module.exports.ptid = mongoose.model("posts", postScheme);
module.exports.users =  mongoose.model("users", userScheme);
module.exports.sballs = mongoose.model("shopballs", ShopBallsScheme);