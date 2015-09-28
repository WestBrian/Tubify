'use strict';

// Dependencies
var express = require('express');
var app = express();
var cred = require('./server/config.js');
var mongoose = require('mongoose');

// Routes
var indexRoute = require('./server/routes/index_route');

// Database
mongoose.connect('mongodb://'+ cred.user +':'+ cred.password +'@ds051833.mongolab.com:51833/tubify');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
	console.log('Database connected.');
});

// Middleware
app.set('view engine', 'jade');
app.set('views', __dirname + '/public');
app.use(express.static('public'));
app.use(indexRoute);

// Starting server
var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Server listening at port: %s.', port);
});