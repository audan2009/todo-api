//creates new SQLite database

var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/data/dev-todo-api.sqlite'
});

var db = {};

//follwing adds functions and modeuls to the db onject
//lets you load in sequelize models from seperate files,
//sequelize.import requires specific file format for todo.js
//the create() function is on db.todo.create()
//IMPORTING todo MODEL
db.todo = sequelize.import(__dirname + '/models/todo.js');
//notice the 2 sequelize calls above, one is lower and one is uppercase
db.sequelize = sequelize;
db.Sequelize = Sequelize;

//you can use objects to return a lot of things.
module.exports = db;
