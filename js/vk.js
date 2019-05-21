'use strict';

  const easyvk = require('easyvk');
  const bd = require("./bd.js");
  const pl = require("./test.js"); 
  const c = require("./comparison"); 

  const sleep = require('util').promisify(setTimeout);

  var vkuser,vkgroup,ownerid,vkseq;

//========================================
  const {
    Debugger
  } = easyvk;
  let myDebugger = new Debugger();
  
  myDebugger.on('request', (event) => {
    console.log(event);
  });
  
  myDebugger.on('response', (event) => {
    console.log(event);
  });
//========================================

  var sauch = {
    access_token: 'd4526fbdd4526fbdd4526fbda7d43877b4dd452d4526fbd8892599a407521fd05d99a7a',
    api_v: '5.95',
    lang: ["ru"][0],
   // debug: myDebugger
  };
  var gauch = {    
    access_token: '4be27b07815a32a956019bdd24d24b6ddc83ba2cf67848a645d394569a4ec4e1100c13f91fbeb79b58f34', //'ce04b5a697bd87efbcc7ce44fe3624afbd9a95d490eb2dc5246f9e34cd5a63f172bd7fbbd406bde104fe4', //
    api_v: '5.95',
    lang: ["ru"][0],
    //debug: myDebugger
  };

  var Auch = async function () {
  
    vkgroup = await easyvk(gauch);
    if (!vkgroup.session.hasOwnProperty("group_id")){
      console.log('Vk_gauch, ошибка! '+vkgroup.error);
      await sleep(20000);
      return await Auch();
    }

    vkseq = await easyvk(sauch);
    if (!vkgroup.session.hasOwnProperty("group_id")){ 
      console.log('Vk_gauch, ошибка! '+vkgroup.error);
      await sleep(20000);
      return await Auch();
    }

    ownerid = vkgroup.session.group_id;//"65723219";
    return "VkAuch_ok"; 
  };
  var PostsGet = async function(){
     var start = new Date(); 
    var vkr1;
    var vkr2;
    var mainloop;
    var postsids = [];
    try{
    var {vkr} = await vkseq.call("wall.get", {owner_id:"-"+ownerid, count:100, filter:"all"});   
    vkr1 = vkr;      
    }catch (err) {console.log("ERROR1: "+err); await sleep(2000); UsersGet(); return 0;};

    if (vkr1.count > 100){

      for (let i = 0; i < vkr1.items.length; i++) {
        postsids.push(vkr1.items[i].id);  
      }
      
      mainloop = Math.ceil(vkr1.count / 100);
      for (let maini = 1; maini != mainloop; maini++){ 

          try{
          var {vkr} = await vkseq.call("wall.get", {owner_id:"-"+ownerid, offset:maini*100, count:100, filter:"all"});   
          vkr2 = vkr;      
          }catch (err) {console.log("ERROR2: "+err); await sleep(2000); UsersGet(); return 0;};

          for (let i = 0; i < vkr2.items.length; i++) {
            postsids.push(vkr2.items[i].id); 
          }
       }
     }else{
      for (let i = 0; i < vkr1.items.length; i++) {
        postsids.push(vkr1.items[i].id); 
      }
     }
     
    await pl.parsloop(0);
    var bdrespones = await bd.PostsRewrite(postsids);
    if (bdrespones !== "bd_PostsRewrite_ok"){console.log("ERROR3: bd.PostsRewrite");}
    await pl.parsloop(1);
    var end = new Date();
    console.log("Обновление базы постов. Время записи: "+((end-start)/1000)+" сек");
    return 0;
  };

  var UsersGet = async function(){
    var start = new Date(); 
    var vkr1;
    var vkr2;
    var mainloop;
    var users = [];
    try{
    var {vkr} = await vkseq.call("groups.getMembers", {group_id:ownerid, offset:0, count:1000,fields:"first_name"});   
    vkr1 = vkr;      
    }catch (err) {console.log("ERROR4: "+err); await sleep(2000); UsersGet(); return 0;};

    if (vkr1.count > 1000){

      for (let i = 0; i < vkr1.items.length; i++) {
        users.push({uid:vkr1.items[i].id, name:vkr1.items[i].first_name+" "+vkr1.items[i].last_name, balls: 0}); 
      }
      
      mainloop = Math.ceil(vkr1.count / 1000);
      for (let maini = 1; maini != mainloop; maini++){ 

          try{
          var {vkr} = await vkseq.call("groups.getMembers", {group_id:ownerid, offset:maini*1000, count:1000,fields:"first_name"});   
          vkr2 = vkr;      
          }catch (err) {console.log("ERROR5: "+err); await sleep(2000); UsersGet(); return 0;};

          for (let i = 0; i < vkr2.items.length; i++) {
            users.push({uid:vkr2.items[i].id, name:vkr2.items[i].first_name+" "+vkr2.items[i].last_name, balls: 0}); 
          }
       }
     }else{
      for (let i = 0; i < vkr1.items.length; i++) {
        users.push({uid:vkr1.items[i].id, name:vkr1.items[i].first_name+" "+vkr1.items[i].last_name, balls: 0}); 
      }
     }
     
    var shopballs = await bd.SBallsGet("All");

    var shopballsAdd = await c.comparison(users,shopballs);

    await pl.parsloop(0);

    if(shopballsAdd.length !== 0){
      var bdrespones = await bd.SBallsAdd(shopballsAdd);
      if (bdrespones !== "bd_ShopBallsAdd_ok"){console.log("ERROR6: bd.ShopBallsAdd");}
    }
   
    var bdrespones = await bd.UsersRewrite(users);
    if (bdrespones !== "bd_UsersRewrite_ok"){console.log("ERROR7: bd.UsersRewrite");}
    await pl.parsloop(1);
    var end = new Date();
    console.log("Обновление базы подписчиков и SBU. Время записи: "+((end-start)/1000)+" сек");
    return 0;
  };
 
  var LikeThread;
  var likegood = [];

  var PostLikesGetThread = async function(itemid,type){
    var likegoodThread = [];
    var vkr1;
    var vkr2;
    var mainloop;
   try{    
      var {vkr} = await vkseq.call("likes.getList" , {item_id: itemid , owner_id:"-"+ownerid, filter: "likes", count:1000, type:type});
      vkr1 = vkr; 
    } catch (err) { console.log("ERROR8: "+err); await sleep(2000); LikeThread = LikeThread-1; return 0;} ////////////////////!!!!!!!!!!!!!!!!!!!!!!! comments   
       
    //console.log(vkr1);
    if (vkr1.count == 0){LikeThread = LikeThread-1;return 0;}

    if (vkr1.count > 1000){

      for (let i = 0; i < vkr1.items.length; i++) {
       
        await likegoodThread.push(vkr1.items[i]);
      }
      
      mainloop = Math.ceil(vkr1.count / 1000);
      for (let maini = 1; maini != mainloop; maini++){  

        try{
          var {vkr} = await vkseq.call("likes.getList" , {item_id: itemid , owner_id:"-"+ownerid, filter: "likes", offset:maini*1000, count:1000, type:type});
          vkr2 = vkr;
        } catch(err){ 
          console.log("ERROR9: "+err); await sleep(2000); LikeThread = LikeThread-1; return 0;}   
        

        for (let i2 = 0; i2 < vkr2.items.length; i2++) {
          await likegoodThread.push(vkr2.items[i2]);
        }

      }
      likegood = await likegood.concat(clikeThread);
      LikeThread = LikeThread-1;
      return 0;
    }else{

      for (let i3 = 0; i3 < vkr1.items.length; i3++) {
      
        await likegood.push(vkr1.items[i3]);
      }
      LikeThread = LikeThread-1;
      return 0;
    } 
  };

  var Thread;
  var good = []; 
  var clike = []; 

  var CommentsGetThread = async function (itemid) {
    var goodThread = []; 
    var clikeThread = []; 
    var mainloop, commentloop;
    var vkr1;
    var vkr2;
    var cpresp;

    try{
    var {vkr} = await vkseq.call("wall.getComments", {post_id:itemid, owner_id:"-" + ownerid ,count:100, need_likes: 1, thread_items_count:10});
    vkr1 = vkr;  
  }catch (err) {console.log("ERROR10: "+err); await sleep(2000); Thread = Thread-1;return 0;} ////////////////////!!!!!!!!!!!!!!!!!!!!!!!
     

    if (vkr1.current_level_count == 0){Thread = Thread-1;return 0;}

    if (vkr1.current_level_count > 100){
      commentloop = 100;

      cpresp = await Commentspars();
      if (cpresp == "err"){Thread = Thread-1;return 0;}

      mainloop = Math.ceil(vkr1.current_level_count / 100);

      for (let maini = 1; maini < mainloop; maini++){  

        try{
        var {vkr} = await vkseq.call("wall.getComments", {post_id:itemid,owner_id:"-" + ownerid ,count:100,offset: maini*100, need_likes: 1, thread_items_count:10});
        }catch(err){console.log("ERROR11: "+err); await sleep(2000); Thread = Thread-1;return 0;}

        vkr1 = vkr;
        if (vkr1.items.length > 100){commentloop = 100;}else{commentloop =vkr1.items.length;};

        cpresp = await Commentspars();
        if (cpresp == "err"){Thread = Thread-1;return 0;}
      }

      clike = await clike.concat(clikeThread);
      good = await good.concat(goodThread);

      Thread = Thread-1;
      return 0;
    }else{
      commentloop =vkr1.current_level_count;

      cpresp = await Commentspars();
      if (cpresp == "err"){Thread = Thread-1;return 0;}

      clike = await clike.concat(clikeThread);
      good = await good.concat(goodThread);

      Thread = Thread-1;
      return 0;
    };

    async function Commentspars(){
      for (let i = 0; i < commentloop; i++){
        if (!vkr1.items[i].deleted){goodThread.push(vkr1.items[i].from_id)};
         
         if (!vkr1.items[i].deleted && vkr1.items[i].likes.count > 0){
          await clikeThread.push(vkr1.items[i].id);
         // console.log("ok")
         }
      
        if (vkr1.items[i].thread.count > 10){

          var thloop = Math.ceil(vkr1.items[i].thread.count / 100);
          for (let i2 = 0; i2 < thloop; i2++){

            try{
            var {vkr} = await vkseq.call("wall.getComments", {post_id:itemid, owner_id:"-" + ownerid, count:100, offset: i2*100,need_likes: 1, comment_id: vkr1.items[i].id });
            vkr2 = vkr;  
          }catch(err){console.log("ERROR12: "+err); await sleep(2000); return "err";}

            for (let i3 = 0; i3 < vkr2.items.length; i3++){
              if (!vkr2.items[i3].deleted){goodThread.push(vkr2.items[i3].from_id)};

               if (!vkr2.items[i3].deleted && vkr2.items[i3].likes.count > 0){
               
                await clikeThread.push(vkr2.items[i3].id);
               }
            };
          };
        }else{
          for (let i4 = 0; i4 < vkr1.items[i].thread.count ; i4++){
            
            if (!vkr1.items[i].thread.items[i4].deleted){goodThread.push(vkr1.items[i].thread.items[i4].from_id);};

             if (!vkr1.items[i].thread.items[i4].deleted && vkr1.items[i].thread.items[i4].likes.count > 0){
              await clikeThread.push(vkr1.items[i].thread.items[i4].id);
             }
          }
        };
      };
    };
  };

  var UserAdd = async function (id){
    var start = new Date(); 
  var vkr1;
  try{
    var {vkr} = await vkseq.call("users.get", {user_ids:id});
    vkr1 = vkr;  
  }catch(err){console.log("ERROR13: "+err); await sleep(2000); return "err";}

  var users = [{uid:Number(id), name:vkr1[0].first_name+" "+vkr1[0].last_name, balls: 0}]; 
  var shopballs = await bd.SBallsGet("All");
  var shopballsAdd = await c.comparison(users,shopballs);

  await pl.parsloop(0);

  if(shopballsAdd.length !== 0){
    var bdrespones = await bd.SBallsAdd(shopballsAdd);
    if (bdrespones !== "bd_SBallsAdd_ok"){console.log("ERROR14: bd.ShopBallsAdd");}
  }

  var bdrespones = await bd.UserAdd(users);
  if (bdrespones !== "bd_UserAdd_ok"){console.log("ERROR15: bd.UserAdd");}
  await pl.parsloop(1);

  var end = new Date();
  console.log("Новый подписчик => Обновление базы подписчиков и SBU. Время записи: "+((end-start)/1000)+" сек");
  return 0;

  }

  var CommentsGet = async function (posts){
    good = [];
    clike = [];
  Thread = posts.length;

    for (let i = 0; i < posts.length; i++) {
      await sleep(2);
      CommentsGetThread(posts[i]);
    }
    while (Thread !== 0){
      await sleep(50);
    }
    good.length
    return {good,clike}
  }

  var PostLikesGet = async function (posts,type){
    likegood = [];
    LikeThread = posts.length;
    for (let i = 0; i < posts.length; i++) {
      await sleep(2);
      PostLikesGetThread(posts[i],type);
    }
    while (LikeThread !== 0){
      await sleep(50);
    }
    likegood.length
   return likegood;
  }
  
  var WidgetUpdate = async function (uids){

    try{
      var {vkr} = await vkgroup.call("appWidgets.update", {type:"tiles", code:'return{\
        title:"Рейтинг: Самые крутые ебаллы у них",\
        title_url:"https://vk.com/app6952969",\
        tiles:[{title:"'+uids[0].name+'", link:"'+uids[0].balls+' ЕБаллов", link_url:"https://vk.com/tolchokgrigoreva?w=wall-65723219_13568", icon_id:"id'+uids[0].uid+'", url:"https://vk.com/id'+uids[0].uid+'"},\
               {title:"'+uids[1].name+'", link:"'+uids[1].balls+' ЕБаллов", link_url:"https://vk.com/tolchokgrigoreva?w=wall-65723219_13568", icon_id:"id'+uids[1].uid+'", url:"https://vk.com/id'+uids[1].uid+'"},\
               {title:"'+uids[2].name+'", link:"'+uids[2].balls+' ЕБаллов", link_url:"https://vk.com/tolchokgrigoreva?w=wall-65723219_13568", icon_id:"id'+uids[2].uid+'", url:"https://vk.com/id'+uids[2].uid+'"}],\
      };'});
      }catch(err){console.log("ERROR13 WidgetUpdate: "+err); await sleep(10000); WidgetUpdate(uids);return 0;}
      console.log("Виджет обновлен <======================\n") 
 
   }

   var senditem = async function(id,cost,ostatok,item){
     var mess;
     var shapka = "Оплата прошла успешно \n Списано ЕБаллов: "+cost+"\n Остаток ЕБаллов: "+ostatok+"\n\n";
     
     if (item =="non_money123"){
      mess ="Недостаточно ЕБаллов для покупки \n Ваш баланс: "+ostatok;
     }else
     if (item =="non_sub123"){
      mess ="Ошибка, Вы не подписаны на сообщество";
     }else
     if (item =="start_server"){
      mess ="Повторите попытку через несколько минут";
     }else

     if (item =="У пушистых не только лапки"){
         mess = shapka+"http://vk.com/@tolchokgrigoreva-na-skolko-tebe-interesno";
     }else
     if(item =="Собутыльник на час"){
          mess = shapka+"С вами свяжется администратор";
     }else
     if (item =="Ни одним репостом едины"){
      mess = shapka+"С вами свяжется администратор";
     }else
     if (item =="Я тебя люблю"){
      mess = shapka+"С вами свяжется администратор";
     }else{
      mess ="Ошибка, операция остановлена"
     }
     var random = getRandomInt(0, 1000000);
     try{
     var {vkr} = await vkgroup.call('messages.send', {peer_id: id,message: mess,random_id: random});
     return "ok";
     }catch(err){
       console.log(err);
       return "err"
     }
  
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  

  module.exports.Auch = Auch;
  module.exports.PostLikesGet = PostLikesGet;
  module.exports.UsersGet = UsersGet;
  module.exports.PostsGet = PostsGet; 
  module.exports.CommentsGet = CommentsGet; 
  module.exports.WidgetUpdate = WidgetUpdate;
  module.exports.senditem = senditem;
  module.exports.UserAdd = UserAdd;