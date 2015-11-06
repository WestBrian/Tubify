var mongoose = require('mongoose');
//sample connect string
mongoose.connect('mongodb://admin1:password1@ds062335.mongolab.com:26584/tubify');
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
	console.log('Database connected.');
});