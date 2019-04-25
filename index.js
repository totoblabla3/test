var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const easyvk = require('easyvk');


var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.get('/', function (req, res) {
    res.render('start');
});
//app.listen(process.env.PORT); 
app.listen(process.env.PORT || 3000);
//http://localhost:3000/
//node index




easyvk({
    access_token: '7bdfcd69418e3190f90ecacc59f0c84b6b97de8814a14c411b1ceadb9b9d1f893d5beff8ff9bb217fd735', //'d4526fbdd4526fbdd4526fbda7d43877b4dd452d4526fbd8892599a407521fd05d99a7a',
  }).then(vk => {
  
   // console.log(vk.session.app_id);

  //  vk.call('execute', {
  //   code: 'API.'
  // }); 
   // startloop();

    function startloop() { 
      var date = new Date();
      vk.call('appWidgets.update', {
        type: 'text',
        code: 'return { "title": "Hey", "text": "' +date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+'"};'
      });
      setTimeout(startloop, 11000);
    }
    
  
  });

