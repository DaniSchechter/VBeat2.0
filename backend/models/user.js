const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
	username: {type:String, require:true, unique: true},
	password: {type:String, require:true},
	role: {type:String ,require:true},
	profile_pic: {type: String, require: false},
	display_name: {type:String, require: true},
	email: {type:String, require:true},
	country: {type:String, require:false},
	city: {type:String, require:false},
	street: {type:String, require:false},

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
