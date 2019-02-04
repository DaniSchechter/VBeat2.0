const mongoose = require('mongoose');

const songSchema = mongoose.Schema({
    song_id: {type: Number, require:true},
    name: {type: String, require:true},
    genres: {type:Number, enum: ['Blues', 'Country', 'Pop', 'Classic', 'Electronic'], require:true},
    song_path: {type: String, require:true},
    image_path: {type: String, require:true},
    release_data: {type: Date, require:true},
    artists: [String], //TODO: change to artist array
    num_of_time_liked: {type: Number}
    // TODO: add all the other fields that Dani didnt add yet !!!!!!

});

module.exports = mongoose.model('Song', songSchema);