
const mongoose = require("mongoose");
const Scheme = require("./MongoScheme.js");
var TopUsers = [];

var Auch = async function(){
  await mongoose.connect("mongodb+srv://totoblabla:703123456789@topuser-llqlx.gcp.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });
}

var UsersRewrite = async function(ids){
  await Scheme.users.remove({});
  await Scheme.users.create({uid: ids});
  return "bd_UsersRewrite_ok";
};

var PostsRewrite = async function(posts){
  await Scheme.ptid.remove({});
  await Scheme.ptid.create({pids: posts});
  return "bd_PostsRewrite_ok";
};

var UsersGet = async function(){
var uid = await Scheme.users.find({});
  return uid[0].uid;
};

var PostsGet = async function(){
  var posts = await Scheme.ptid.find({});
  return posts[0].pids;
};

module.exports.Auch = Auch;
module.exports.PostsGet = PostsGet;
module.exports.UsersGet = UsersGet;
module.exports.UsersRewrite = UsersRewrite;
module.exports.PostsRewrite = PostsRewrite;
module.exports.newtopuser = function(newtop){TopUsers = newtop;};
module.exports.topuser = function(){return TopUsers;};




















// var bdclient,collection;
// function bdconnect(){
// mongoClient.connect(function(err, client){
//   if(err){return console.log(err);}
//   bdclient = client;
//    collection = client.db("test").collection("users");
// });}


//  let users = [{uid: "32"} , {uid: "41"}];
//   async function main() {
//     try {
        
//         await bdconnect();
//         const text = await bdadd(users);
//         const text2 = await bdtake();
//         console.log(text2);
//     }
//     catch (err) {
//         console.log('ERROR:', err);
//     }
// }
// main();




// async function bdtake(){
//     collection.find().toArray(function(err, results){
//       if(err){return console.log(err);}    
//       return results;
//   });
  
// }


// async function bdadd(user){

//     collection.insertMany(user, function(err, result){
//         if(err){return console.log(err);}
//         return result.ops;
   
// });
// }

// process.on("SIGINT", () => {
//   bdclient.close();
//   process.exit();
// });

// https://cloud.mongodb.com/v2/5cc0bea5014b76af27f03b71#metrics/replicaSet/5cc0bfd1fd4cba8a9b070c6c/explorer/test/users/find