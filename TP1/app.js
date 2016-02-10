var express = require('express');
var cookieSession = require('cookie-session'); //Gestion de cookie de session
var bodyParser = require('body-parser')

var app = express();

// create application/x-www-form-urlencoded parser 
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//Use session
app.use(cookieSession({
  name: 'cannard',
  keys: ['todolist'],
  secret:'secretcookiesession'
}))
//Un midelware qui crée lavariable de session todolist si elle n'existe pas
.use(function(req, res, next){
    if (typeof(req.session.todolist) == 'undefined') {
        req.session.todolist = [];
    }
    next();// on appel la prochaine fonction ( obligatoire dans le cas d'un midelware)
})

//home page
.get('/todolist', function(req, res) {
    res.render('todolist.ejs', {lists: req.session.todolist});
})
//add
.post('/todolist/add',urlencodedParser, function(req, res) {
    if (req.body.newtodo != '') {
        req.session.todolist.push(req.body.newtodo);
    }
    res.redirect('/todolist');
})
//remove
.get('/todolist/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.todolist.splice(req.params.id, 1);
    }
    res.redirect('/todolist');
})
//defauld
.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
})

.listen(8080);