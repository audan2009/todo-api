var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var PORT = process.env.PORT || 3000;
//https://suri-todo-api.herokuapp.com/

var todos =[];
//not secure until we start using a database
var todoNextId = 1;

app.use(bodyParser.json());

 app.get('/', function(req, res){
   res.send('Todo API Root')
 });

// app.get('/todos',function(req,res){
//   res.json(todos);
// })

// GET /todos?c=true&q=work
app.get('/todos', function(req, res){
  //queryParams returns {completed: 'true'}
  var query = _.pick(req.query, 'c','q');
  var where = {};

  console.log(where);

  if(query.hasOwnProperty('c') && query.c === 'true' ) {
    where.completed = true;
  } else if (query.hasOwnProperty('c') && query.c === 'false') {
    where.completed = false;
  }

  if(query.hasOwnProperty('q') && query.q.length > 0){
    where.description = {
      $like: '%'+ query.q +'%'
    };
  }

  // if(_.size(where)  === 0 ){
  //      return res.status(404).send({"error":"cant find what you're looking for"});
  //   } else{
    db.todo.findAll({where: where}).then(function(todos){
      res.json(todos);
    }).catch(function(e){
      res.status(500).send(e);
    });
  //}
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

  db.todo.findById(todoId).then(function(todo){
    console.log(todo + 'this is the to do');
    //!! coerces the object to boolean
    // http://stackoverflow.com/questions/784929/what-is-the-not-not-operator-in-javascript
    if(!!todo){
      res.json(todo);
    } else {
      return res.status(404).send({"error": "cant find what you're looking for"});
    }
  }).catch(function(e){
    //500 something went wrong on server side
    return res.status(500).json(e);
  })

  // //underscore findwhere takes array and returns 1 match
  // var matchedTodo = _.findWhere(todos, {id:todoId});
  //
  //  if(matchedTodo){
  //     res.json(matchedTodo);
  // } else {
  //     res.status(404).send();
  //   };
});

//POST /todos .. add a new todo
app.post('/todos', function (req, res){
  var body = _.pick(req.body, 'description','completed');

    db.todo.create(body).then(function(todo){
      //todo object in sequelize isn't just an object, so have to use toJSON
      return res.json(todo.toJSON());
    }).catch(function(e){
      return res.status(400).json(e);
    });
      //BEFORE DB
          // isBool checking true/false, isString checks if string was provided, trim removes spaces and makes sure no one types a bunch of spaces
        //   if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
        //     //400 bad data being passed
        //     return res.status(400).send();
        //   } else {
        //     //set body.description to the trimmed value
        //   body.description = body.description.trim();
        //   body.id = todoNextId++;
        //
        //   todos.push(body);
        //   res.json(body);
        //   }
});

//DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(rowsDeleted){
      if(rowsDeleted === 0){
        res.status(404).json({
          error: 'No todo with id'
        });
      } else {
        //204 everyting went well and nothing to send back
        res.status(204).send();
      }
    }, function(){
      res.status(500).send();
    });

  // if(!matchedTodo){
  //   res.status(404).send({"error":"no todo found"});
  // } else {
  //   //without takes an array, then the full object to delete from matchedTodo
  //  todos = _.without(todos, matchedTodo);
  //   //closes request and sends 200 status
  //   res.json(matchedTodo);
  // }
});

//PUT /todos/:id ...update
app.put('/todos/:id', function(req, res){
  //this is the body sent in the request, we only want to "pick" these 2 keys
  var body = _.pick(req.body, 'description','completed');
  var todoId = parseInt(req.params.id, 10);
  var attributes = {};

  if(body.hasOwnProperty('completed')){
     attributes.completed = body.completed;
     }

   if(body.hasOwnProperty('description')){
     attributes.description = body.description;
     }

    db.todo.findById(todoId).then(function(todo){
      if(todo){
         todo.update(attributes).then(function(todo) {
             res.json(todo.toJSON());
         }, function(e){
           res.status(400).JSON(e);
         });
      } else {
        res.status(404).send();
      }  //up to here, everything by findById went well, next is id was not found
    }, function(){
        res.status(500).send();
        //end follow up code to findById, the use todo.update
    })

});

//coming from imports object, this is the lowercase version
db.sequelize.sync(/*{force: true}*/).then(function(){
  app.listen(PORT, function(){
    console.log('Cap, Im listning on ' + PORT + '!');
  });
});
