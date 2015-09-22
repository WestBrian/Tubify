'use strict';

var express = require('express');
var router = express.Router();

// Home page
router.get('/', function(req, res, next){
	res.render('../../public/layout.jade');
});

module.exports = router;