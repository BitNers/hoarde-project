var express = require('express');
var router = express.Router();
require('dotenv');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: process.env.APP_NAME });
});

module.exports = router;