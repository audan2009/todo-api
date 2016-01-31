module.exports = function(sequelize, DataTypes){
  //these 2 arguements work behind the scenes from sequelize.import in db.js file
  return sequelize.define('todo',{
      description:{
        type: DataTypes.STRING,
        allowNULL: false,
        validate:{
          len:[1,250]
        }
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNULL: false,
        defaultValue: false
      }
    });
}

//this is the layout required for sequalize.import
//this defines our model
