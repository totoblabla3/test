var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const easyvk = require('easyvk');
const bd = require("./js/bd.js");
const vk = require("./js/vk.js"); 
const pl = require("./js/test.js"); 
const sleep = require('util').promisify(setTimeout);
var oldbody;
pl.start();

var urlencodedParser = bodyParser.urlencoded({
  extended: false
});

app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.post('/', function (req, res) {
  
  const {body} = req;
  switch (body.type) {
    case 'confirmation':
    res.end('8d9c8073');
    //res.end('ba2d09a1');
    break;
    
    case 'message_reply':  
    res.end('ok');
    if ((body.object.text.indexOf('{"ballEdd":"1.0.0","uid":') !== -1) && 
        (body.object.text.indexOf('","balls":"') == -1)// && 
       ) //(body.object.body !== oldbody))
    {
      oldbody = body.object.body;
      ballEdd(body.object.text);
    }else   
    if ((body.object.text.indexOf("Купить за ЕБаллы:") !== -1) && 
        (body.object.text.indexOf("Новый заказ") == -1) && 
        (body.object.text !== oldbody))
    {
      oldbody = body.object.text;
      by(body);
    }   
    
    break;

    case 'group_join':
        vk.UserAdd(body.object.user_id);
        res.end('ok');
    break;
    
    case 'group_leave':
        bd.UserRemove(body.object.user_id);
        res.end('ok');
    break;
  
    default:
    res.end('ok');
     vk.PostsGet();
      break;
  }
  
});

app.get('/', function (req, res) {
  res.render('start',{users:bd.topuser()});
});

app.get('/rules', function (req, res) {
  res.render('rules');
});

app.get('/pr70312345', function (req, res) {
  vk.PostsGet();
  res.render('start');
});
app.get('/ur70312345', function (req, res) {
  vk.UsersGet();
  res.render('start');
});

app.listen(process.env.PORT || 3000);
//http://localhost:3000/

 async function ballEdd(body){ 
    var b = JSON.parse(body);
    console.log(b.uid);
    var shopballs = await bd.SBallsGet(b.uid);
    shopballs.balls = shopballs.balls - b.balls;
    await bd.SBallsRewrite(b.uid,shopballs.balls);
    console.log(shopballs.balls);
 }
  
 async function by(body){ 
  
   
   // var ustat = await pl.Ustat(); 

    
   var ustat = await bd.UsersGet();


     if (ustat.length == 0){
      let resp = await vk.senditem(body.object.peer_id,"","","start_server");
      console.log("Попытка покупки. Сервер не запущен");
     }else{    

     try{

     var shopballs = await bd.SBallsGet(body.object.peer_id);   
     let idx = await ustat.findIndex(e => e.uid == body.object.peer_id);

     var line = body.object.text.indexOf('ЕБаллы: Купить за')+18;
     var cost = body.object.text.slice(line);
     line = cost.indexOf('ЕБ')-1;
     cost = cost.slice(0,line);

     if (ustat[idx].balls - shopballs.balls >= cost){

       var line2 = body.object.text.indexOf('Корзина:')+9;
       var item = body.object.text.slice(line2);
       line2 = item.indexOf('[За Ебаллы]')-1;
       item = item.slice(0,line2);
       console.log(item);

       var resp = await vk.senditem(body.object.peer_id,cost,ustat[idx].balls - Number(cost) -  shopballs.balls ,item);
       if (resp == "ok"){
         shopballs.balls = shopballs.balls + Number(cost); 
         await bd.SBallsRewrite(body.object.peer_id,shopballs.balls);
         console.log("Новая продажа");
       }else{
         console.log(resp);
       }
       
     }else{
       let resp = await vk.senditem(body.object.peer_id,cost,ustat[idx].balls - shopballs.balls,"non_money123");
       console.log("Недостаточно баллов для покупки ");//+ustat[idx].balls+" "+cost); 
     }

    }catch(err){
      if (err.message == "Cannot read property 'uid' of undefined"){
        try{
         let resp = await vk.senditem(body.object.peer_id,"","","non_sub123");
         console.log("Не подписан");
        }catch(err){
         console.log(err);
        }
       
        }else{console.log(err.message); }
    }
  }
 
 

}