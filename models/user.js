var bcrypt = require('bcrypt');
var _ = require('underscore');

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
    salt: {
      type: DataTypes.STRING
    },
    password_hash: {
      type: DataTypes.STRING
    },
    password: {
      //VIRTUAL types are not stored on the database but its still accessible
      type: DataTypes.VIRTUAL,
      allowNULL: false,
      validate:{
        // [min,max] len
        len: [7,100]
      },
      set: function(value){
        //set length of salt
        var salt = bcrypt.genSaltSync(10);
        var hashedPassword = bcrypt.hashSync(value, salt);

        this.setDataValue('password', value);
        this.setDataValue('salt', salt);
        this.setDataValue('password_hash', hashedPassword);

      }
    }
  }, { //begin param after 'user'
      hooks: {
        beforeValidate: function(user, options){
          if(typeof user.email === 'string'){
            user.email = user.email.toLowerCase();
          }
        }
      },
      instanceMethods: {
        toPublicJSON: function() {
          var json = this.toJSON();
          return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
        }
      }
  });
};
