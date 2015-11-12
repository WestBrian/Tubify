'use strict';

var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

/* - Main routes - */

router.get('/', function(req, res) {
	res.render('./core/index', { user: req.user });
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

/* - Playlist routes - */

router.get('/p/:playlist', function(req, res){
	// var playlist = encodeURIComponent(req.params.playlist);
	// res.redirect('/?playlist=' + playlist);
	res.render('./core/index', { user: req.user, pl: req.params.playlist });
});

module.exports = router;