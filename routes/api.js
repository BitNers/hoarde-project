const express = require('express');
const router = express.Router();

const UAC_Controller = require('../controllers/UAC_UserController');


router.post("/registeruser", function(req,res,next){
    UAC_Controller.register_new_user(req,res);
});


router.post("/loginuser", function(req,res,next){
    UAC_Controller.validate_login_user(req,res);
});




module.exports = router;