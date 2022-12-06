var express = require('express');
var router = express.Router();
const UAC_Controller = require('../controllers/UAC_UserController');
const passport = require("passport");
require('dotenv');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: process.env.APP_NAME, loggedIn: req.isAuthenticated()} );
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: process.env.APP_NAME });
});


router.get('/register', function(req, res, next) {
  res.render('register', { title: process.env.APP_NAME });
});


router.post("/register", function(req,res,next){
  UAC_Controller.register_new_user(req,res);
});


router.post("/login", passport.authenticate("local-login", 
  { 
    failureRedirect:"/login", 
    successRedirect: "/user"
  })
);


module.exports = router;