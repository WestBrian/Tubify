'use strict';

// Dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cred = require('./server/config.js');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./server/routes/index_route');

// Database
//mongoose.connect('mongodb://'+ cred.user +':'+ cred.password +'@ds051833.mongolab.com:51833/tubify');
mongoose.connect('mongodb://admin1:serverpass314@candidate.52.mongolayer.com:10606,candidate.53.mongolayer.com:10195/tubifydb?replicaSet=set-560d8cc12a0bd7185f001142');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
	console.log('Database connected.');
});

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
    	socket.broadcast.to(msg.room).emit('addVid',msg.msg);
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