var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

//look at sequelize docs for more validation options
var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

console.log(Todo);

//define user model
var User = sequelize.define('user', {
	email: Sequelize.STRING
});

//sequelize with create foriegn keys to setup relationships

Todo.belongsTo(User);
User.hasMany(Todo);


//sync({force: true}) will dump and recreate the database. By default it is false
sequelize.sync({
  // force: true
}).then(function(){
  console.log('everything is synced');

 User.findById(1).then(function(user){
   //getTodos is sequelize and you put get'model'+'s' to use it
   //returns an array to todos
   user.getTodos({where:
     {completed: true}
   }).then(function(todos){
     todos.forEach(function(todo){
       console.log(todo.toJSON());
     });
   });
 });

  // User.create({
  //   email: 'audan2009@gmail.com'
  // }).then(function(){
  //   return Todo.create({
  //     description: 'fix wheel well'
  //   });
  // }).then(function(todo){
  //   User.findById(1).then(function(user){
  //     user.addTodo(todo);
  //   });
  // });
});
