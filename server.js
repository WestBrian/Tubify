'use strict';

// Dependencies
var express = require('express');
var app = express();

// Deployment
app.set('port', process.env.PORT || 3000);

var bodyParser = require('body-parser');
//var cred = require('./server/config.js');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./server/routes/routes');


//var mongoose = require('mongoose');
//var mongo=require('./server/models/dbConnect');
 //uncomment for https
// var fs = require('fs');
// var https = require('https');
// var privateKey  = fs.readFileSync('./server/keys/tubify.key', 'utf8');
// var certificate = fs.readFileSync('./server/keys/tubify.cert', 'utf8');
// var credentials = {key: privateKey, cert: certificate};


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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Passport
app.use(require('express-session')({
	secret: 'tubify',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport config
var Account = require('./server/models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Routes
app.use(routes);

// Starting server
  //https
//var server = https.createServer(credentials, app);
//server.listen(3000, function(){
 //https
var server = app.listen(app.get('port'), function(){
var host = server.address().address;
var port = server.address().port;

//console.log('Server listening at port: %s.', port);


//socket.io
var io = require('socket.io')(server);
io.on('connection', function(socket){
 	console.log('a user connected');
 
 	socket.on('sync play video', function(data){
 		io.in(data.playlist+'#sync').emit('sync play video', data);
 	});
 	socket.on('sync', function(data) {
 		if(data.syncing){
 			socket.join(data.playlist+'#sync');	
 		}
 		else{
 			socket.leave(data.playlist+'#sync')
 		}
 		//io.in(data.playlist).emit('receiveSync', data.username);
 	});

 	socket.on('delete video', function(msg){
 		playlist.findOne({ title:msg.playlist },function (err, doc){
        	if(err){
				console.log('error');
			}
			else{
				if(doc!=null){
					console.log(doc.order);
					doc.videos.splice(doc.order[msg.index], 1);
					doc.order.splice(doc.order.indexOf(msg.index),1);
					for (var i=0; i<doc.order.length; i++){
						if (doc.order[i]>msg.index){
							doc.order[i]=doc.order[i]-1;
						}
					}
					console.log(doc.order);
					doc.markModified('order');
					doc.save(function (err2){
						if (err2){
							console.log('error');
						}
						else{
							console.log('delete successful');
							video.find({'_id':{$in:doc.videos}},function (err, doc2){
								if (doc2!=null){
									var playlistToSend=[];
									for (var i=0; i<doc2.length; i++){
										playlistToSend.push(doc2[i])
									}
									var data={
										list:playlistToSend,
										order:doc.order,
										indexList:msg.list,
										index:msg.index
									};
									console.log('emittign playlist');
									io.to(msg.playlist).emit('playlist', data);
								}
							});
							//io.to(msg.playlist).emit('delete successful', msg);
						}
					});

				}
				else{
					console.log('error');
				}
				
			}

			
		});

 	});
 	socket.on('changeOrder', function(msg){
 		var rooms2 = io.sockets.adapter.sids[socket.id];
        console.log('rooms change order:');
        console.log(rooms2);
        playlist.findOne({ title:msg.playlist },function (err, doc){
        	if(err){
				console.log('error');
			}
			else{
				if(doc!=null){
					var a=[];
					console.log(doc.order);
					for (var i=0; i<doc.videos.length; i++){
						a.push(doc.order[msg.indexList[i]]);
//						console.log('doc.videos['+i+'] : '+doc.videos[i]);
					}
					doc.order=a;
					doc.markModified('order');
					console.log(doc.order);
					console.log('hey');
					//for (var i=0; i<doc.videos.length; i++){
					//	console.log('doc.videos['+i+'] : '+doc.videos[i]);
					//}	
					doc.save(function (err2){
						if (err2){
							console.log('error');
						}
						else{
							console.log('saveOrder successful');
							var data={
								list:doc.videos,
								order:doc.order
							};

							video.find({'_id':{$in:doc.videos}},function (err, doc2){
								if (doc2!=null){
									var playlistToSend=[];
									for (var i=0; i<doc2.length; i++){
										playlistToSend.push(doc2[i])
									}
									var data={
										list:playlistToSend,
										order:doc.order,
										indexList:msg.indexList
									};
									console.log('emittign playlist');
									io.to(msg.playlist).emit('playlist', data);
								}
							});


							//io.to(msg.playlist).emit('playlist', data);
							//io.to(msg.playlist).emit('change order successful', msg);
							//socket.broadcast.to(msg.playlist).emit('change order successful', msg);
							console.log('emitted change order successful');
						}
					});

				}
				else{
					console.log('error');
				}
				
			}
        });
 	});

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
					doc.order.push(doc.order.length);
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
					var a=[];
					a.push(0);
					console.log('creating new playlsit');
					var playlistToSave = new playlist({
						title: msg.room,
						videos: [videoToSave._id],
						order: a
						

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

		var rooms = io.sockets.adapter.sids[socket.id];
       	for(var room in rooms) {
          	socket.leave(room);	
            console.log('left '+room);
        }
		playlist.findOne({ title:msg },function (err, doc){
			if(err){
				console.log('error');
			}
			else{
				if(doc!=null){
					doc.playCount+=1;
					doc.save(function (err){
						if (err){
							console.log('error updating playcount');
						}
						else{
							console.log('updated playcount successfully');
						}
					});
					video.find({'_id':{$in:doc.videos}},function (err, doc2){
						if (doc2!=null){
							var playlistToSend=[];
							for (var i=0; i<doc2.length; i++){
								playlistToSend.push(doc2[i])
							}
							var data={
								list:playlistToSend,
								order:doc.order
							};
							socket.join(msg);
							console.log('emitting pl to single user');
							socket.emit('playlist', data);
						}
					});
				}
				else{
					var data={
						list:[],
						order:[]
					};
					socket.join(msg);
					socket.emit('playlist', data);
				}
				
			}
		});
		
		
	});
	socket.on('join first', function(msg) {   //identical to join but for when client first opens page, to prevent default video from playing
		var rooms = io.sockets.adapter.sids[socket.id];
       for(var room in rooms) {
           socket.leave(room);	
           console.log('left '+room);
       }

		console.log('joined '+msg);
		socket.join(msg);

		playlist.findOne({ title:msg },function (err, doc){
			if(err){
				console.log('error');
			}
			else{
				if(doc!=null){
					doc.playCount+=1;
					doc.save(function (err){
						if (err){
							console.log('error updating playcount');
						}
						else{
							console.log('updated playcount successfully');
						}
					});
					video.find({'_id':{$in:doc.videos}},function (err, doc2){
						if (doc2!=null){
							var playlistToSend=[];
							for (var i=0; i<doc2.length; i++){
								playlistToSend.push(doc2[i])
							}
							var data={
								list:playlistToSend,
								order:doc.order
							};

							socket.emit('playlist first', data);
						}
					});
				}
				else{
					var data={
						list:[],
						order:[]
					};
					socket.emit('playlist first', data);
				}
				
			}
		});
		
		
	});




});


});



/*
// sending to sender-client only
 socket.emit('message', "this is a test");

 // sending to all clients, include sender
 io.emit('message', "this is a test");

 // sending to all clients except sender
 socket.broadcast.emit('message', "this is a test");

 // sending to all clients in 'game' room(channel) except sender
 socket.broadcast.to('game').emit('message', 'nice game');

 // sending to all clients in 'game' room(channel), include sender
 io.in('game').emit('message', 'cool game');

 // sending to sender client, only if they are in 'game' room(channel)
 socket.to('game').emit('message', 'enjoy the game');

 // sending to all clients in namespace 'myNamespace', include sender
 io.of('myNamespace').emit('message', 'gg');

 // sending to individual socketid
 socket.broadcast.to(socketid).emit('message', 'for your eyes only');
*/