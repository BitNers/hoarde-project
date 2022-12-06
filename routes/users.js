var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(!req.isAuthenticated()) res.redirect("/")
  
  res.redirect("/user/dashboard");

});


router.get('/dashboard', function (req,res,next){
  if(!req.isAuthenticated()) res.redirect("/")

    res.render("dashboard/index");
}
);


router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect("/");
})

module.exports = router;
