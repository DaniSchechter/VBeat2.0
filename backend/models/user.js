const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	username: {type:String, require:true},
	password: {type:String, require:true},
	role: {type:Number,enum: ['User', 'Artist'] ,require:true},
	profile_pic: {type: String, require: false},
	display_name: {type:String, require: true},
	email: {type:String, require:true},
});



const app = require('../app');
const User = null; // figure out how to initialize that


app.put("/api/user", (req, res, next) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password, 
		role: req.body.role,
		profile_pic: req.body.profile_pic,
		display_name: req.body.display_name, 
		email: req.body.email
	});

	user.save().then(newUser => {
		res.status(201).json({
			message: "user created",
			userId: newUser._id
		});
	});
});

app.get("/api/getSongs", (req, res, next) => {
    Song.find().then(songsResult => {
        res.status(200).json({
            message: "songs fetched successfully",
            songs: songsResult
        });
    });
});
app.delete("api/songs/:id", (req, res, next) => {
    Song.deleteOne({_id: req.params.id});
    res.status(200);
});

module.exports = mongoose.model('User', userSchema);