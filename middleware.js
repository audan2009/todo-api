//we are setting up a function so that other files pass in configuration data...
//in this case we are going to expect the database to be passed in

module.exports = function(db){

  //check for token, decrypt token, get userid and type out of token
  return {
    requireAuthentication: function(req, res, next){
      var token = req.get('Auth');

      //custom function, find user by token value
      //going to run function, which will return the user
      db.user.findByToken(token).then(function(user){
          req.user = user;
          next();
      }, function(){
        res.status(401).send();
      });
    }
  };

}
