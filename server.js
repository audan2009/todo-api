var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 3000;
//https://suri-todo-api.herokuapp.com/

var todos =[];
//not secure until we start using a database
var todoNextId = 1;

app.use(bodyParser.json());

 app.get('/', function(req, res){
   res.send('Todo API Root')
 });

// GET /todos    ... returns all todos
app.get('/todos', function(req, res){
  res.json(todos);
});


// GET  /todos/:id

app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo;
  
  todos.forEach(function(todo){
    if(todo.id === todoId){
      matchedTodo = todo;
    } 
  });

//for loop instead of forEach
//for(i = 0; i < todos.length; i++){
//  if (todos[i].id === todoId){
//    matchedTodo = todos[i];
//  }   
//};
  
  if(matchedTodo){
      res.json(matchedTodo);
  } else {
      res.status(404).send();
    };
});

//POST /todos .. add a new todo
app.post('/todos', function (req, res){
  var body = req.body;

  body.id = todoNextId++;
  bodyParser(body);
  todos.push(body);
  
  console.log('description ' + body.description);
  console.log(todos);
  
  res.json(body);
});


app.listen(PORT, function(){
  console.log('Cap, Im listning on ' + PORT + '!');
});

