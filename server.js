'use strict';

// Dependencies
var express = require('express');
var app = express();

// Routes
var indexRoute = require('./server/routes/index_route');

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