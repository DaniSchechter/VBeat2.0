const mongoose = require('mongoose');
const Song = require('./song');

const playlistSchema = mongoose.Schema({
    name: {type: String, require:true},
    UserId: {type: String, require:true},
    songList: [Song.schema]
});

module.exports = mongoose.model('Playlist', playlistSchema);