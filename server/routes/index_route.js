'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next){
	res.render('layout');
});

// router.get('/login', function (req, res){
// 	res.render('login/login');
// });

module.exports = router;