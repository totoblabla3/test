const bd = require("./bd.js"); //UsersRewrite  PostsRewrite  PostsGet  UsersGet
const vk = require("./vk.js"); //Auch  PostsGet  UsersGet  LikesGet(itemid)  CommentsGet(itemid,commentid)
const sleep = require('util').promisify(setTimeout);
var stateloop = 1;
var TopUsers = [];
var Top3 = [];
var Top3old = [];

var parsloopstate = function(state){stateloop = state;};

var parsloop = async function(){
    while (stateloop == 0){
        await sleep(100);
    }

    var startdate = new Date();
    var posts = await bd.PostsGet();
    var Users = await bd.UsersGet();  
    var {good, clike} = await vk.CommentsGet(posts);
    var liker = await vk.PostLikesGet(posts,"post");
    liker = liker.concat(await vk.PostLikesGet(clike,"comment"));  
    var date = new Date();

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
     
    for (let i = 0; i < Users.length; i++) {
        if ((Users[i].uid != "230224838") && (Users[i].uid != "233008659")){
            Users[i].balls = (likes[Users[i].uid] + (comments[Users[i].uid]*2)); 
        }     
    }
    Users.sort(function(a, b){return b.balls-a.balls;});

    var tu = [];
    for (let i = 0; i < (50 || Users.length); i++) {
        tu[i] = Users[i];  
    }
    bd.newtopuser(tu);
    TopUsers = tu;
    console.log(date.getHours()+":"+date.getMinutes()+":"+date.getSeconds());
    console.log("Итерация заняла: "+((date-startdate)/1000)+" сек");
    console.log("Комментарии: "+good.length);
    console.log("Лайки: "+liker.length+"\n");
    parsloop();
    return 0;
};

var WidgetUptateLoop = async function(){
    
    for (let i = 0; i < 3; i++) {
        Top3[i] = TopUsers[i];   
    }
    
    if (Top3old !== Top3){
        Top3old = Top3; await vk.WidgetUpdate(Top3);
    }
    
    await sleep(10000);
    WidgetUptateLoop();
    return 0;
};

var start = async function (){

await vk.Auch(); 
await bd.Auch(); 
await vk.PostsGet();               
await vk.UsersGet(); 
await parsloop();
WidgetUptateLoop();
};



module.exports.parsloop = parsloopstate;
module.exports.start = start;
