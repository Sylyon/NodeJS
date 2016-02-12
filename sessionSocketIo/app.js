var http = require('http')
	, path = require('path')
	, express = require('express')
	, expressSession = require('express-session')
	, cookieParser = require('cookie-parser')
	, sessionSockets = require('session.socket.io')
	, ent = require('ent'); // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)

var app = express()
	, myCookieParser = cookieParser('mon sell secret')
	, sessionStore = new expressSession.MemoryStore()
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);
	

app.use(myCookieParser);
app.use(expressSession({
	secret:'my secret sale', 
	store: sessionStore, 
	resave: true,
	saveUninitialized: true
}));

var mySessionSockets = new sessionSockets(io, sessionStore, myCookieParser);


mySessionSockets.on('connection',function(err,socket,session){
	socket.emit('session', session);
	session.foo='toto';
	/*
	socket.on('foo', function(value) {
		session.foo = value;
		session.save();
		socket.emit('session', session);
	});*/
	if (typeof(session.pseudo) == 'undefined') {
        session.pseudo = 'annonymus';
    }
    if (typeof(session.myMessages) == 'undefined') {
        session.myMessages = [];
    }
    /*
	console.log('Un client est connecté !');
	socket.on('newMessage',function(msg){
		msg = ent.encode(msg);
		session.myMessages.push(msg);
		socket.broadcast.emit('message',{pseudo: socket.pseudo, msg: msg});
	});
	socket.on('petit_nouveau', function(pseudo) {
		pseudo = ent.encode(pseudo);
		if(pseudo == '')
		{
			pseudo = 'annonymus2';
		}

		session.pseudo= pseudo;

		socket.pseudo = pseudo;
		socket.broadcast.emit('newUser',pseudo);
	});*/
});

//home page
app.get('/', function(req, res) {
	res.render(__dirname + '/index.ejs',{session: ''});
	//res.sendFile(__dirname + '/index.html');
})
//defauld
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

server.listen(8080);