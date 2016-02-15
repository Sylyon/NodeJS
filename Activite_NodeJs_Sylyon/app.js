var http = require('http')
  , express = require('express')
  , app = express()
  , ent = require('ent');

var server = http.createServer(app)
  , io = require('socket.io').listen(server);

/* On prend ici une liste car une des contrainte de l'exercice est de renvoyer 
le dernière todo enregistré et NON SUPPRIMER (ce qui n'est pas possible avec une simple variable) */
var todoList = []; // La liste des todo enregistré


io.sockets.on('connection', function (socket) {
  console.log('Un client est connecté !');

  socket.emit('connected', {socketId:socket.id, lastTodo:todoList[todoList.length-1]}); // On envois le socket id au client, ce qui servira de client id et le dernier todo enregistré 

  socket.on('newTodo', function(todo) {  // Lorsque l'on crée un nouveau todo
  	var message = ent.encode(todo.message);
  	todoList.push({id:todo.id, message:message});
  	socket.broadcast.emit('addTodo', {id:todo.id, message:message});
  });

  socket.on('deleteTodo', function(id) {  // Lorsque l'on suprime un todo
  	deleteById(id);
    socket.broadcast.emit('todoDelete', id);
  });
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

/**
* Supprimer un element de la todoList en fonction de sont id
*
* @param   myId      L'id de l'élément a supprimer
* @return  
* @author  Sylyon
**/
function deleteById(myId) {
	for(var i=0; i<todoList.length; i++){
		if (todoList[i].id==myId) {
			todoList.splice(i,1)
			break; // Une fois l'élément supprimé on sort de la boucle for.
		}
	}
}

server.listen(8080);