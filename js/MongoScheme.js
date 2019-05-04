const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postScheme = new Schema({
    pids: [String],
  });

  postScheme.set('toJSON',{
      virtuals:true
  });

const userScheme = new Schema({uid: [{ uid: String, name: String, balls: Number}]});

  userScheme.set('toJSON',{
    virtuals:true
});

module.exports.ptid = mongoose.model("posts", postScheme);
module.exports.users =  mongoose.model("users", userScheme);