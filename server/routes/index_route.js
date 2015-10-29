'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next){
	res.render('layout', {page: 'index'});
});

router.get('/login', function (req, res){
	res.render('layout', {page: 'login'});
});

router.get('/register', function(req, res) {
	res.render('layout', {page: 'register'});
});

module.exports = router;