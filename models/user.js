module.exports = function(sequelize, DataTypes){
  return sequelize.define('user', {
    email:{
      type: DataTypes.STRING,
      allowNULL: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNULL: false,
      validate:{
        // [min,max] length
        len: [7,100]
      }
    }

  });
};