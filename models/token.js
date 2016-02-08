var cryptojs = require('crypto-js');

//logout lecture 84

module.exports = function(sequelize, DataTypes) {

  return sequelize.define('token', {

    token: {
      type: DataTypes.VIRTUAL,
      allowNULL: false,
      validate: {
        len:[1]
      },
      set: function(value){
        var hash = cryptojs.MD5(value).toString();
        this.setDataValue('token', value);
        this.setDataValue('tokenHash', hash);
      }
    },
    tokenHash: DataTypes.STRING
  });

};
