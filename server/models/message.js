'use strict';

var mongoose = require('mongoose');

var messagesSchema = mongoose.Schema({
	name: String,
	message: String,
	playlist: String,
	dateAdded: { type: Date, default: Date.now }
});

var messages = mongoose.model('messages', messagesSchema);

module.exports = messages;