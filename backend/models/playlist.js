const mongoose = require('mongoose');
const Song = require('./song');

const playlistSchema = mongoose.Schema({
    name: {type: String, require:true},
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    },
    songs: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Song"
    }] 
});

module.exports = mongoose.model('Playlist', playlistSchema);