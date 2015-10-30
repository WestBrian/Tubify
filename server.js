'use strict';

// Dependencies
var express = require('express');
var app = express();
var cred = require('./server/config.js');
var mongoose = require('mongoose');
/* //uncomment for https
var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('./server/keys/tubify.key', 'utf8');
var certificate = fs.readFileSync('./server/keys/tubify.cert', 'utf8');
var credentials = {key: privateKey, cert: certificate};
*/
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
/*  //https
var server = https.createServer(credentials, app);
server.listen(3000, function(){
*/ //https
var server = app.listen(3000, function(){
var host = server.address().address;
var port = server.address().port;

//console.log('Server listening at port: %s.', port);


//socket.io
var io = require('socket.io')(server);
io.on('connection', function(socket){
 	console.log('a user connected');
 
 	


 	socket.on('addedVid', function(msg) {
 		var videoToSave = new video({
			title: msg.title,
			urlId: msg.urlId,
			thumb: msg.thumb,
			searchString:  msg.searchString,

		});

		videoToSave.save(function(err){
			if(err){
				console.log('video not saved');
			}else{
				console.log('video saved');

				playlist.findOne({ title:msg.room },function (err, doc){
				if(err){
					console.log('error');
				}
				if(doc != null){
					console.log('playlist updated');
					doc.videos.push(videoToSave._id);
					doc.save(function (err2){
						if (err2){
							console.log('error');
						}
						else{
							console.log('emitting addedVid');
							io.to(msg.room).emit('addVid', msg);		
						}
					});	
					
				}
				else{
					console.log('creating new playlsit');
					var playlistToSave = new playlist({
						title: msg.room,
						videos: [videoToSave._id]
					});
					playlistToSave.save(function (err){
						if (err){
							console.log('error');
						}
						else{
							console.log('emitting addedVid');
							io.to(msg.room).emit('addVid', msg);		
						}
					});		
				}
			});


			}
		});

		
 		
    }); 
	socket.on('join', function(msg) {
		for (var key in socket.rooms){//io.sockets.manager.roomClients[socket.id]){
			socket.leave(key);
		}
		console.log('joined '+msg);
		socket.join(msg);

		playlist.findOne({ title:msg },function (err, doc){
			if(err){
				console.log('error');
			}
			else{
				if(doc!=null){
					video.find({'_id':{$in:doc.videos}},function (err, doc2){
						if (doc2!=null){
							var playlistToSend=[];
							for (var i=0; i<doc2.length; i++){
								playlistToSend.push(doc2[i])
							}
							socket.emit('playlist', playlistToSend);
						}
					});
				}
				else{
					socket.emit('playlist', []);
				}
				
			}
		});
		
		
	});




});


});
