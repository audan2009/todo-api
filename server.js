var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
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


// GET  /todos/:id before underscore
//
//app.get('/todos/:id', function(req, res){
//  var todoId = parseInt(req.params.id, 10);
//  var matchedTodo;
//  
//  todos.forEach(function(todo){
//    if(todo.id === todoId){
//      matchedTodo = todo;
//    } 
//  });
//
//for loop instead of forEach
//for(i = 0; i < todos.length; i++){
//  if (todos[i].id === todoId){
//    matchedTodo = todos[i];
//  }   
//};
//  
//  if(matchedTodo){
//      res.json(matchedTodo);
//  } else {
//      res.status(404).send();
//    };
//});

app.get('todos/id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  //underscore findwhere takes array and returns 1 match
  var matchedTodo = _.findWhere(todos, todoId);
   if(matchedTodo){
      res.json(matchedTodo);
  } else {
      res.status(404).send();
    };
})


//POST /todos .. add a new todo
app.post('/todos', function (req, res){
  var body = _.pick(req.body, 'description','completed');
  
  // isBool checking true/false, isString checks if string was provided, trim removes spaces and makes sure no one types a bunch of spaces
  if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    //400 bad data being passed
    return res.status(400).send();
  } else {
    
    //set body.description to the trimmed value
    
  body.description = body.description.trim();
  body.id = todoNextId++;

  todos.push(body);

  res.json(body);
  }
});


app.listen(PORT, function(){
  console.log('Cap, Im listning on ' + PORT + '!');
});

