const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {UACModel}  = require('../config/database');

passport.serializeUser(function(user, done) {
    delete user.password;
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    delete user.password;
    done(null, user);
  });


passport.use('local-login', new LocalStrategy({
    usernameField: 'user_name',
    passwordField: 'password'
},function verify(user_name, password, cb){

    UACModel.findOne(
            {attributes:['user_name', 'password', 'document_number'], 
            where: {user_name: user_name}})
    .then(user=>{

        if(!user){return cb(null, false, {message: "Incorrect password or username."})}
    
        if(bcrypt.compareSync((process.env.PRESALT_FOR_PASSWORD + password + process.env.POSSALT_FOR_PASSWORD ), user.password)){
            return cb(null, user);
        }else{
            return cb(null, false, {message: "Incorrect password or username."})
        }
    
    })
    .catch(err=>{
        console.error(`[X] Error while reading data from SQL.\t ${err.message}`);
        return cb(null, false, {message: "Error while logging"});
    })
    ;
}))


module.exports = passport;