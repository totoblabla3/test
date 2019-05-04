var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const easyvk = require('easyvk');
const bd = require("./js/bd.js");
const vk = require("./js/vk.js"); 
const pl = require("./js/test.js"); 
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
      break;
  
    default:
    console.log(body);
   // vk.PostsGet();
    //vk.UsersGet();
    res.end('ok');
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




