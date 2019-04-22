var express = require('express');
var app = express();

app.use('/public', express.static('public'));

app.get('/', function(req, res){
    res.sendFile (__dirname + "/index.html");
});

app.get('/:id', function(req, res){
    res.send ('ID is -' + req.params.id);
});

//app.listen(process.env.PORT); 
app.listen(3000);
//http://localhost:3000/


