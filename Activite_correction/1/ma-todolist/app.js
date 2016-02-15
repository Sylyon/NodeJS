var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    cookieParser = require('cookie-parser'),
    session = require('cookie-session'),
    bodyParser = require('body-parser'),
    todoliste = [],
    newtodo ='',
    ent = require('ent'),
    fs = require('fs');
 
app.use(cookieParser())
.use(session({secret: 'todolistepartage'}))
.use(bodyParser())

.use(function(req, res, next){
    if (todoliste.length != 0) {
        req.session.todolist = [];
        req.session.todolist = todoliste;
    }else{
        req.session.todolist = [];
    }
    next();
})
 
.get('/todo', function(req, res) {    
    res.render('todo.ejs', {todolist: todoliste,newtodo : newtodo});
})

.post('/todo/ajouter/', function(req, res) {
    if (req.body.newtodo != '') {
        newtodo = req.body.newtodo;
        todoliste.push(newtodo);   
    }
    res.redirect('/todo');
})

.get('/todo/supprimer/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
})

.use(function(req, res, next){
    res.redirect('/todo');
});

server.listen(8080);
 io.sockets.on('connection', function (socket) {
    console.log('client connecte');                     
    socket.broadcast.emit('newtodo',newtodo);
});