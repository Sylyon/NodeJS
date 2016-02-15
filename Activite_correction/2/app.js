var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var todolistServer = ['Le serveur vient se lancer avec succès.']

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next) {
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
  console.log('Un utilisateur vient de se connecter.')

  socket.emit('todolist', todolistServer)

  socket.on('add', function(content){
    if (todolistServer.indexOf(content) == -1) {
      io.sockets.emit('add', content)
      todolistServer.push(content)
    }
  })
  socket.on('remove', function(content){
    io.sockets.emit('remove', content)
    todolistServer.splice(todolistServer.indexOf(content), 1)
  })
})

server.listen(8080);
