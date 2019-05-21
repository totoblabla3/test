
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

var UserAdd = async function(id){
  await Scheme.sballs.update({_id : "5ce447011e80d80004e8cd03"}, {$push: {uid:{$each:id}}});
  return "bd_UserAdd_ok";
};

var PostsRewrite = async function(posts){
  await Scheme.ptid.remove({});
  await Scheme.ptid.create({pids: posts});
  return "bd_PostsRewrite_ok";
};

var UsersGet = async function(){
  try{
    let uid = await Scheme.users.find({});
    return uid[0].uid;

  }catch(err){
    console.log(err);
    var resp = await UsersGet();
    return resp;
  }

};

var PostsGet = async function(){
  var posts = await Scheme.ptid.find({});
  return posts[0].pids;
};

var ShopBallsRewrite = async function(ids,balls){
  await Scheme.sballs.updateOne({"uid.uid":ids}, {$set: {"uid.$.balls": balls}});
  return "bd_ShopBallsRewrite_ok";
};

var SBallsAdd = async function(ids){
  await Scheme.sballs.update({_id : "5ce4324b6371cf15a8fcc0d6"}, {$push: {uid:{$each:ids}}});
  return "bd_SBallsAdd_ok";
};

var ShopBallsGet = async function(ids){
  if (ids == "All"){
    let uid = await Scheme.sballs.find({});
    return uid[0].uid;
  }else{
  let uid = await Scheme.sballs.find({uid:{$elemMatch:{"uid":ids}}},{"uid.$": 1, _id: 0}); 
    return uid[0].uid[0];
  }
};

module.exports.Auch = Auch;
module.exports.PostsGet = PostsGet;
module.exports.UsersGet = UsersGet;
module.exports.UserAdd = UserAdd;
module.exports.UsersRewrite = UsersRewrite;
module.exports.PostsRewrite = PostsRewrite; 

module.exports.SBallsAdd = SBallsAdd;
module.exports.SBallsRewrite = ShopBallsRewrite;
module.exports.SBallsGet = ShopBallsGet; 

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