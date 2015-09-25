'use strict';

var express = require('express');
var router = express.Router();
var path = require('path');
router.get('/', function(req, res, next){


res.render('layout');

});

router.get('/search.js', function(req, res, next){
//res.sendFile(__dirname + '/../../public/core/search.js')   //this doesnt work because ../../ could be malicious (security flaw)
res.sendFile(path.join(__dirname, '/../../public/core', 'search.js'));
});
module.exports = router;