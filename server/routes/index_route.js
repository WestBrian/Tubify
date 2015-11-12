'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next){
	res.render('layout', {pl: null});
	console.log('default');
});
router.get('/p/:playlist', function(req, res, next){
	console.log(req.params.playlist);
	
	res.render('layout', {pl:req.params.playlist});
	console.log();
});

// router.get('/login', function (req, res){
// 	res.render('login/login');
// });

module.exports = router;