const AhoCorasick = require('node-aho-corasick')
const User = require('../models/user')
const Song = require9'../models/song')


function getAllSongs(callback){
	console.log('ahocorasick.js getting all songs');
	Song.find().then(songData => {
		if(songData == undefined) {
			callback(undefined, "song data was undefined");
		}
		callback(songData);
	})
	.catch(error => {
		callback(null, error);
	});
}

// callback = function(results, err){}
// searches for songs in an efficient way
module.exports.searchSongs = function(displayName, callback){
	
};
