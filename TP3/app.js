var http = require('http')
  , express = require('express')
  , bodyParser = require('body-parser')
  , app = express()
  , urlencodedParser = bodyParser.urlencoded({ extended: false })
  , ent = require('ent');

var server = http.createServer(app)
  , io = require('socket.io').listen(server);


io.sockets.on('connection', function (socket) {
  console.log('Un client est connecté !');
});

//home page
app.get('/', function(req, res) {
  res.render('index.ejs');
})
//defauld
.use(function(req, res, next){
  res.setHeader('Content-Type', 'text/plain');
  res.status(404).send('Page introuvable !');
})

server.listen(8080);