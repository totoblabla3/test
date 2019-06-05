const bd = require("./bd.js"); //UsersRewrite  PostsRewrite  PostsGet  UsersGet
const vk = require("./vk.js"); //Auch  PostsGet  UsersGet  LikesGet(itemid)  CommentsGet(itemid,commentid)
var _ = require('lodash');
const sleep = require('util').promisify(setTimeout);
var stateloop = 1;
var TopUsers = [];
var Top3old = [];
var Usersstat = [];

var parsloopstate = function(state){stateloop = state;};


var parsloop = async function(){
    while (stateloop == 0){
        await sleep(100);
    }

    var startdate = new Date();
    var posts = await bd.PostsGet();
    var Users = await bd.UsersGet();  
    var shopballs = await bd.SBallsGet("All");
    var {good, clike} = await vk.CommentsGet(posts);
    var liker = await vk.PostLikesGet(posts,"post");
    liker = liker.concat(await vk.PostLikesGet(clike,"comment"));  
    

    var comments = good.reduce((acc, el) => {
        acc[el] = (acc[el] || 0) + 1;
        return acc;
      }, {});

    var likes = liker.reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
    }, {});

    while (stateloop == 0){
        await sleep(100);
    }

    var Usersstat = [];

    for (let i = 0; i < Users.length; i++) {
        if ((Users[i].uid != "230224838") && (Users[i].uid != "233008659")){
            await sleep(1);
            let idx = await shopballs.findIndex(e => e.uid == Users[i].uid);
            Usersstat.push({"uid":Users[i].uid, "name":Users[i].name, "balls":(likes[Users[i].uid] || 0)+((comments[Users[i].uid]*2) || 0)});
            Users[i].balls = (likes[Users[i].uid] || 0)+((comments[Users[i].uid]*2) || 0) - (shopballs[idx].balls || 0);
        }
    }
    
    
    var bdrespones = await bd.UsersRewrite(Usersstat);
    if (bdrespones !== "bd_UsersRewrite_ok"){console.log("ERROR7: bd.UsersRewrite");}

    Users.sort(function(a, b){return b.balls-a.balls;});
    var tu = [];
    for (let i = 0; i < (50 || Users.length); i++) {
        tu[i] = Users[i];  
    }
    bd.newtopuser(tu); 
    TopUsers = tu;      

    var date = new Date();
    console.log(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
    console.log("Итерация заняла: "+((date-startdate)/1000)+" сек");
    console.log("Комментарии: "+good.length);
    console.log("Лайки: "+liker.length+"\n");
    parsloop();
    return 0;
};

var WidgetUptateLoop = async function(){
    var Top3 = [];
    for (let i = 0; i < 3; i++) {
        Top3[i] = TopUsers[i];   
    }
    
    if (Top3.join(',') !== Top3old.join(',')){
        Top3old = Top3; 
        await vk.WidgetUpdate(Top3);
    }
    
    await sleep(10000);
   WidgetUptateLoop();
    return 0;
};

var start = async function (){

await vk.Auch(); 
await bd.Auch(); 
await vk.PostsGet();  
//bd.SBallsRewrite([{uid: "0000", balls: 0}]);             
await vk.UsersGet(); 
await parsloop();
WidgetUptateLoop();
};

module.exports.parsloop = parsloopstate;
module.exports.start = start;
