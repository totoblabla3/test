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

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

app.get('/', function (req, res) {

  res.render('start',{users:pl.topuser()});
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




