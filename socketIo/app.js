var http = require('http');
var fs = require('fs');

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
    fs.readFile('./index.html', 'utf-8', function(error, content) {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.end(content);
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    console.log('Un client est connecté !');
    socket.emit('message', {content:'Coucou c\'est moi',importance:'1'});
    socket.broadcast.emit('message', {content:'Un nouvel utilisateur c\'est connecter',importance:'2'});
   	socket.on('message',function(msg){
   		console.log(socket.pseudo+' crois que :'+msg);
   	});
   	socket.on('petit_nouveau', function(pseudo) {
   		socket.pseudo = pseudo;
	});
});


server.listen(8080);