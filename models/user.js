var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

module.exports = function(sequelize, DataTypes){
  //before lecture 77, this was returning the user first with "return sequelize.define('user', {"
  //after lecture 77, we created the user varialbe and set it to sequalize.define, then returned user at the end
  var user = sequelize.define('user', {
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
      classMethods: {
        authenticate: function(body) {
          return new Promise(function(resolve, reject){
             //refactor code lecture 77
             if(typeof body.email !== 'string' || typeof body.password !== 'string'){
               return reject();
             }

             user.findOne({
               where: {
                   email: body.email.toLowerCase()
                 }
               }).then(function(user){
                 if(!user || !bcrypt.compareSync(body.password, user.get('password_hash'))){
                   return reject();
                 }
                resolve(user);

               }).catch(function(e){
                 reject();
               });
          });
        },
        findByToken: function(token){
          return new Promise(function(resolve, reject){
            try{
              var decodedJWT = jwt.verify(token, 'qwerty098');
              var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!$!');
              var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

              user.findById(tokenData.id).then(function(user){
                if(user){
                  resolve(user);
                } else{
                  //user id wasn't found
                  reject();
                }
              }, function(e){
                //if findbyid fails bc db wasnt connected
                reject();
              });

            } catch(e){
              //try catch failes bc token isnt valid format
              reject();
            }
          });
        }
      },
      //adds instance methods that you access on the user model.
      instanceMethods: {
        toPublicJSON: function() {
          var json = this.toJSON();
          //ignores password field so we don't expose it in the API
          return _.pick(json, 'id', 'email', 'updatedAt', 'createdAt');
        },
        //lesson 78
        generateToken: function(type) {
          if(!_.isString(type)){
            return undefined;
          } //end if, start try

          try{

            //this refers to accesses the current instance that we are refering to inside the instance method
            var stringData = JSON.stringify({id: this.get('id'), type: type});
            console.log(this);
            console.log(stringData);
            //takes (string to encrypt, secret password).returns encrypted string
            var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!$!').toString();
            var token = jwt.sign({
              //this is so we can pull out token property to decrypt to find user by id
              token: encryptedData
              //jwt password
            }, 'qwerty098');

            return token;

          } catch(e){
          console.error(e);
            return undefined;
          }
          //end try
        } //end generateToken
      }
  });
  //return user varialbe so that it can be used in server.js (lecture 77)
  return user;
};
