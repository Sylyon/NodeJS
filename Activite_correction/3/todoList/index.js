var ent = require('ent');
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var users = [];
var tasks = [];

io.sockets.on('connection', function(socket, username) {
  console.log('connection');
  socket.emit('tasks', tasks);
  socket.on('new_client', function(username) {
    console.log(username);
    username = ent.encode(username);
    users.push(username);
    socket.username = username;
    socket.broadcast.emit('new_client', username);
  });

  socket.on('add_task', function(task) {
    task = ent.encode(task);
    tasks.push(task);
    console.log(tasks);
    socket.broadcast.emit('add_task', task);
  });

  socket.on('delete_task', function(index) {
    tasks.splice(index, 1);
    socket.broadcast.emit('delete_task', index);
  });
});


/* On affiche la todolist et le formulaire */
app.get('/todo', function(req, res) {
    res.render('todo.ejs');
})

/* On redirige vers la todolist si la page demandée n'est pas trouvée */
.use(function(req, res, next){
    res.redirect('/todo');
})

server.listen(8080);
