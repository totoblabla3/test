var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({
    extended: false
});
app.set('view engine', 'ejs');

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
    res.render('start', {
        first: "0"
    });
});

app.post('/', urlencodedParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    if (req.body.status == 0){
        res.render('start', {first: "off"});
    } else {
        res.render('start', {first: "on"});
    }
    

});

//app.listen(process.env.PORT); 
app.listen(3000);
//http://localhost:3000/
//node index

// var iloop = 1;
//     setTimeout(startloop, 3000);

//     function startloop() {
//         console.log("yes: " + iloop);

//         iloop++;
//         if (iloop < 100) {
//             setTimeout(startloop, 3000);
//         }
//     }