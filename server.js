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
mongoose.connect('mongodb://admin1:serverpass314@ds051883.mongolab.com:51883/tubify');
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
	console.log('Database connected.');
});
var video = require('./server/models/video.js');
var playlist = require('./server/models/playlist.js');
/*

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


//socket.io
var io = require('socket.io')(server);
io.on('connection', function(socket){
 	console.log('a user connected');
 	


 	socket.on('addedVid', function(msg) {
 		console.log('addedvid message to '+msg.room);
 		
 		
 		io.to(msg.room).emit('addedVid', msg);
    }); 
	socket.on('join', function(msg) {
		for (var key in socket.rooms){//io.sockets.manager.roomClients[socket.id]){
			socket.leave(key);
			console.log(socket.rooms[key]);
		}
		console.log('joined'+msg);
    	socket.join(msg);
	});


});




});