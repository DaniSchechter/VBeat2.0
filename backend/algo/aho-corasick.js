const AhoCorasick = require('node-aho-corasick')
const User = require('../models/user')
const Song = require9'../models/song')


// get all songs helper function
function getAllSongs(callback){
	console.log('ahocorasick.js getting all songs');
	Song.find().then(songData => {
		if(!songData) {
			callback(undefined, "song data was undefined");
			return;
		}
		callback(songData);
	})
	.catch(error => {
		// error handling
		callback(null, error);
	});
}

// callback = function(results, err){}
// searches for songs in an efficient way
module.exports.searchSongs = function(displayNames, callback){
	if(!displayNames || displayNames.length < 1) {
		callback(null, "display names were empty");
		return;
	}

	// search using the algorithm
	var searchEngine = new AhoCorasick();

	// add each one of the keywords to the algorithm
	displayNames.forEach(name => {
		searchEngine.add(name);	
	});
	// build the search engine, prepare to search
	searchEngine.build();

	getAllSongs((results, err) => {
		// no use continuing if we have an error
		if(err)	{
			callback(null, err);
			return;
		}
		// song object hit array
		hitArray = []

		// iterate each song
		results.forEeach(result => {
			// search the name of the song for one of the keywords
			hits = searchEngine.search(result.name);
			// do we have at least one hit?
			if(hits.length != 0) {
				// add song to our hit array
				hitArray.push(result);
			}
		});

		callback(hitArray, null);
	});
	
};
