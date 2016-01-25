var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos =[{
  id: 1,
  description: 'Learn to code cool stuff',
  compelted: false
},{
  id: 2,
  description: 'go to market',
  compelted: false
},{
  id:3,
  description: 'go to shleep',
  compelted: true
}];

console.log(todos[0].id);

//https://suri-todo-api.herokuapp.com/

 app.get('/', function(req, res){
   res.send('Todo API Root')
 });

// GET /todos
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


app.listen(PORT, function(){
  console.log('Cap, Im listning on ' + PORT + '!');
});

