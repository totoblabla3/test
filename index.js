const http =require('http')
const fs =require('fs')
const server = http.createServer();

server.on('request', (req, res) => {

	console.log(req.url);
	console.log(req.method);
	console.log(req.headers);
 if (req.url === '/index' || req.url === '/') {
 	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})	
 var readhtml =fs.createReadStream(__dirname + '/index.html', 'utf8')
 readhtml.pipe(res) 
} else {
	res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'})	
 var readhtml =fs.createReadStream(__dirname + '/404.html', 'utf8')
 readhtml.pipe(res) 
}
 

});

server.listen(25565, '5.19.190.70', function () {console.log("Сервер работает")});