var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-database.sqlite'
});

//look at sequelize docs for more validation options
var Todo = sequelize.define('todo',{
  description:{
    type: Sequelize.STRING,
    allowNULL: false,
    validate:{
      len:[1,250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNULL: false,
    defaultValue: false
  }
});

//sync({force: true}) will dump and recreate the database. By default it is false
sequelize.sync().then(function(){
  console.log('everything is synced');

  Todo.findById(1).then(function(todo){
    if(todo){
      console.log(todo.toJSON());
    } else {
      console.log("no todo with that id found");
    }
  }).catch(function(e){
    console.log(e);
  });

  // Todo.create({
  //   description: "Walking my dog",
  //   completed: false
  // }).then(function(todo){
  //   return Todo.create({
  //     description:'clean office'
  //   });
  // }).then(function(){
    // return Todo.findById(1);
    // return Todo.findAll({
  //     where: {
  //       description: {
  //         //% is like *
  //         $like: '%office%'
  //       }
  //     }
  //   });
  // }).then(function(todos){
  //   if(todos){
  //     todos.forEach(function(todo){
  //       console.log(todo.toJSON());
  //     });
  //   } else {
  //     console.log('no todo found');
  //   }
  // }).catch(function(e){
  //   console.log(e);
  // });
});
