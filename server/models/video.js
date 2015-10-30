'use strict';

var mongoose = require('mongoose');

var videosSchema = mongoose.Schema({
	title: String,
	urlId: String,
	thumb: { type: String, default: "" },
	searchString: { type: String, default: 'searchString' },
	playCount: { type: Number, default: 0 },
	dateAdded: { type: Date, default: Date.now }
});

var videos = mongoose.model('videos', videosSchema);

module.exports = videos;