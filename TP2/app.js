var http = require('http');
var fs = require('fs');
var express = require('express');
var cookieSession = require('cookie-session'); //Gestion de cookie de session
var ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

var app = express();
var server = http.createServer(app);
// Chargement de socket.io
var io = require('socket.io').listen(server);


//Use session
app.use(cookieSession({
  name: 'SuperChat',
  keys: ['SuperChat'],
  secret:'secretcookiesession'
}))

//Un midelware qui crée les variables de session pseudo et myMessages si elles n'existent pas
.use(function(req, res, next){
    if (typeof(req.session.pseudo) == 'undefined') {
        req.session.pseudo = 'annonymus1';
    }
    if (typeof(req.session.myMessages) == 'undefined') {
        req.session.myMessages = [];
    }
    next();// on appel la prochaine fonction ( obligatoire dans le cas d'un midelware)
})


// Quand un client se connecte, on le note dans la console
	io.sockets.on('connection', function (socket) {
	    console.log('Un client est connecté !');
	   	socket.on('newMessage',function(msg){
	   		msg = ent.encode(msg);
	   		app.use(function(req, res, next){
	   			req.session.myMessages.push(msg);
	   			next();
	   		})
	   		socket.broadcast.emit('message',{pseudo: socket.pseudo, msg: msg});
	   	});
	   	socket.on('petit_nouveau', function(pseudo) {
	   		pseudo = ent.encode(pseudo);
	   		if(pseudo == '')
	   		{
	   			pseudo = 'annonymus2';
	   		}
	   		app.use(function(req, res, next){
	   			req.session.pseudo= pseudo;
	   			next();
	   		})
	   		socket.pseudo = pseudo;
	   		socket.broadcast.emit('newUser',pseudo);
		});
	});

//home page
app.get('/', function(req, res) {
	res.render(__dirname + '/index.ejs',{session: req.session});
	//res.sendFile(__dirname + '/index.html');
})
//defauld
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
})

server.listen(8080);