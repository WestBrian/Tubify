'use strict';

var express = require('express');
var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/public/*');

var indexRoute = require('./server/routes/index_route');

app.use(indexRoute); //app.use('/', indexRoute);

var server = app.listen(3000, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log('Server listening at port: %s.', port);
});