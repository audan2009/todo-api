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
        // [min,max] len
        len: [7,100]
      }
    }
  }, { //begin param after 'user'
      hooks: {
        beforeValidate: function(user, options){
          if(typeof user.email === 'string'){
            user.email = user.email.toLowerCase();
          }
        }
      }
  });
};
