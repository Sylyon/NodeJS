var http = require('http')
  , path = require('path')
  , express = require('express')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , methodOverride = require('method-override')
  , expressSession = require('express-session')
  , ent = require('ent')
  , app = express();

var myCookieParser = cookieParser('secret');
var sessionStore = new expressSession.MemoryStore();

app.set('views', path.resolve('views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(myCookieParser);
app.use(expressSession({ 
  secret: 'secret', 
  store: sessionStore, 
  resave: true,
  saveUninitialized: false 
}));

var server = http.Server(app)
  , io = require('socket.io')(server);

var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, myCookieParser);

//home page
app.get('/', function(req, res) {
  req.session.pseudo = req.session.pseudo || 'Annonymus';
  req.session.allMessages = req.session.allMessages || [];
  res.render(__dirname + '/index.ejs');
})
//defauld
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

sessionSockets.on('connection', function (err, socket, session) {
  socket.emit('session', session);
  console.log('Un client est connecté !');

  socket.on('newMessage',function(msg){
    msg = ent.encode(msg);
    session.allMessages.push({pseudo: session.pseudo, msg: msg});
    session.save();
    socket.broadcast.emit('message',{pseudo: session.pseudo, msg: msg});
  });

  socket.on('petit_nouveau', function(value) {
    pseudo = ent.encode(value);
    if (typeof(session.pseudo) == 'undefined') {
        session.pseudo = 'annonymus2';
    }
    if(pseudo == '')
    {
      pseudo = 'annonymus3';
    }
    session.pseudo= pseudo;
    session.save();
    socket.broadcast.emit('newUser',pseudo);
  });
});

server.listen(8080);
