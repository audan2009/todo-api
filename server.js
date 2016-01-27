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

// GET all /todos
app.get('/todos', function(req, res){
  res.json(todos);
});

// GET  /todos/:id before underscore

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

//GET by ID
app.get('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  //underscore findwhere takes array and returns 1 match
  var matchedTodo = _.findWhere(todos, {id:todoId});

   if(matchedTodo){
      res.json(matchedTodo);
  } else {
      res.status(404).send();
    };
});

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

//DELETE /todos/:id

app.delete('/todos/:id', function(req, res){
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id:todoId});
  
  if(!matchedTodo){
    res.status(404).send({"error":"no todo found"});
  } else{  
    //without takes an array, then the full object to delete from matchedTodo
   todos = _.without(todos, matchedTodo);
    //closes request and sends 200 status
    res.json(matchedTodo);
  }
  
})

//PUT /todos/:id

app.put('/todos/:id', function(req, res){
  var body = _.pick(req.body, 'description','completed');
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id:todoId});
  var validAttributes = {};
  
  if(!matchedTodo){
    return res.status(404).send({"error":"no todo found"});
  } 
  
  if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
     validAttributes.completed = body.completed;
     } else if(body.hasOwnProperty('completed')){
        return res.status(400).send({"error":"issue with completed"});
      } 
  
   if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
     validAttributes.description = body.description;
     } else if(body.hasOwnProperty('description')){
        return res.status(400).send({"error":"issue with description"});
      } 
  
  //if all IF statements pass then there's something to update
  // you dont have to set matchedTodo = ._extend since objects are passed by reference
  
   _.extend(matchedTodo, validAttributes);
  res.send(matchedTodo);
  
});


app.listen(PORT, function(){
  console.log('Cap, Im listning on ' + PORT + '!');
});

