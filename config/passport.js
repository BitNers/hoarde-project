const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const {UACModel}  = require('../config/database');
const {Op} = require("sequelize");

passport.serializeUser(function(user, done) {
    delete user.Password;
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    delete user.Password;
    done(null, user);
  });


passport.use('local-login', new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password'
},function verify(Username, Password, cb){
    
    UACModel.findOne({
        where: {
            [Op.or]:[
                {Username: Username},
                {Email: Username}
            ]
        },
        attributes: ['UserID', 'Username', 'Email', 'Password', 'PasswordSalt']
    }).then(user => {

        if(!user) return cb(null, false, {"message": "Incorrect Password or Username."});
            
        bcrypt.compare(Password + user["PasswordSalt"], user["Password"])

            .then(validateLogin =>{

                if(!validateLogin) return cb(null, false, {"message": "Wrong credentials."});

                return cb(null, user);

        }).catch(err =>{
            console.error(`[X] Error while reading data from SQL.\t ${err.message}`);
            return cb(null, false, {"message": "User not found."});
        });

        

    });

}))


module.exports = passport;