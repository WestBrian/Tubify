'use strict';

var mongoose = require('mongoose');

var playlistsSchema = mongoose.Schema({
	title: String,
	videos: Array,
	order: Array,
	playCount: { type: Number, default: 0 },
	playCountWeekly: { type: Number, default: 0 },
	dateAdded: { type: Date, default: Date.now }

});

var playlists = mongoose.model('playlists', playlistsSchema);

module.exports = playlists;