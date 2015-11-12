'use strict';

var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


router.get('/', function(req, res) {
	res.render('./core/index', { user: req.user });
});
router.get('/p/:playlist', function(req, res, next){
	console.log(req.params.playlist);
	
	res.render('layout', {pl:req.params.playlist});
	console.log();

});

router.get('/register', function(req, res) {
	res.render('./register/register', { });
});

router.post('/register', function(req, res) {
	console.log(req.body.username + ' ' + req.body.password);
	Account.register(new Account({username: req.body.username}), req.body.password, function(err, account) {
		if(err) {
			//return res.render('./register/register', { account: account });
			res.send(err);
		}

		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
});

router.get('/login', function(req, res) {
	res.render('./login/login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

module.exports = router;