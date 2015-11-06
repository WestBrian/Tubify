var mongoose = require('mongoose');
//sample connect string
mongoose.connect('mongodb://admin1:serverpass314@ds051883.mongolab.com:51883/tubify');

var db = mongoose.connection;


db.on('error', console.error.bind(console, 'Error: '));
db.once('open', function(){
	console.log('Database connected.');
});