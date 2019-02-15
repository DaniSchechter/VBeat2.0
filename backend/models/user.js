const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: {type:String, require:true},
	password: {type:String, require:true},
	role: {type:Number,enum: ['User', 'Artist'] ,require:true},
	profile_pic: {type: String, require: false},
	display_name: {type:String, require: true},
	email: {type:String, require:true},
});


module.exports = mongoose.model('User', userSchema);
