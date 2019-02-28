const mongoose = require('mongoose');
const User = require('./user')

const songSchema = mongoose.Schema({
    name: {type: String, require:true},
    genre: {type:String, require:true},
    song_path: {type: String, require:true},
    image_path: {type: String, require:true},
    release_date: {type: Date, require:true},
    artists: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }],
    num_of_times_liked: {type: Number, require:true},
    playlists: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Playlist"
    }]
});

module.exports = mongoose.model('Song', songSchema);