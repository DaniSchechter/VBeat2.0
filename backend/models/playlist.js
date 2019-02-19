const mongoose = require('mongoose');

const playlistSchema = mongoose.Schema({
    name: {type: String, require:true},
    user_id: {type: String, require:true},
    song_list: String
});

module.exports = mongoose.model('Playlist', playlistSchema);