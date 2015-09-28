'use strict';

var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
	title: String,
	urlId: String
});

var Video = mongoose.model('Video', videoSchema);

module.exports = Video;