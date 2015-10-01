'use strict';

// Dependencies
var express = require('express');
var app = express();
var cred = require('./server/config.js');
var mongoose = require('mongoose');

// Routes
var indexRoute = require('./server/routes/index_route');

// Database
//mongoose.connect('mongodb://'+ cred.user +':'+ cred.password +'@ds051833.mongolab.com:51833/tubify');
mongoose.connect('mongodb://admin1:serverpass314@candidate.52.mongolayer.com:10606,candidate.53.mongolayer.com:10195/tubifydb?replicaSet=set-560d8cc12a0bd7185f001142');
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
	console.log('Database connected.');
});

/*
var video = require('./server/models/video.js');


var a = new video({
	title:'sup',
	urlId:'123456'
});

a.save(function(err){
	if(err){
		console.log(':(');
	}else{
		console.log(':)');
	}
});
*/
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