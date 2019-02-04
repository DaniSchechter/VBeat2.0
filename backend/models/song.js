const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    song_id: {type: Number, require:true},
    name: {type: String, require:true},
    genre: {type:Number, enum: ['Blues', 'Country', 'Pop', 'Classic', 'Electronic'], require:true},
    song_path: {type: String, require:true},
    image_path: {type: String, require:true},
    release_date: {type: Date, require:true},
    artists: [String], //TODO: change to artist array
    num_of_times_liked: {type: Number}
});

module.exports = mongoose.model('Song', songSchema);