const express = require("express");
const session = require("express-session")
const bodyParser = require("body-parser");
const mongoose = require('mongoose');


const Song = require('./models/song');

const app = express();

mongoose.connect("mongodb+srv://alex:nE7fHawuXIMUmwlX@cluster0-k5m05.mongodb.net/first-node?retryWrites=true")
.then(()=>{
    console.log("connected to db!");
}).catch(()=>{
    console.log("connection failed!");
});

//Boby parameter parsing
app.use(bodyParser.json());
app.use(session({secret: 'donttellthistonobodyitssupposedtobeasecret'}));

//Setting Headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    next();
});

app.post("/api/songs", (req, res, next) => {
    const song = new Song({
        name: req.body.name,
        genre: req.body.genre,
        song_path: req.body.song_path,
        image_path: req.body.image_path,
        release_date: req.body.release_date,
        artists:  req.body.artists, // TODO: change to artist array
        num_of_times_liked: req.body.num_of_times_liked
    });
    song.save().then(newSong => {
        res.status(201).json({
            message: "Song added successfully",
            songId: newSong._id
        });
    });
});

app.get("/api/songs", (req, res, next) => {
    Song.find().then(songsResult => {
        res.status(200).json({
            message: "Songs fetched successfully",
            songs: songsResult
        });
    });
});

app.get("/api/song/:id", (req, res, next) => {
    Song.find({ _id: req.params.id}).then((songResult) => {
        console.log("result from backend: " + songResult);
        console.log("------------------------")
        res.status(200).json({
            song: songResult
        });
    });
});

app.delete("/api/songs/:id", (req, res, next) => {
    Song.deleteOne({_id: req.params.id}).then((result) => {
        res.status(200).json({message : "post deleted"});
    });
});

app.put("/api/songs/:id", (req, res, next) => {
    
    const song = new Song({
        _id: req.body.id,
        name: req.body.name,
        genre: req.body.genre,
        song_path: req.body.song_path,
        image_path: req.body.image_path,
        release_date: req.body.release_date,
        artists:  req.body.artists, // TODO: change to artist array
        num_of_times_liked: req.body.num_of_times_liked
    });
    Song.updateOne({_id: req.params.id}, song).then(result => {
        res.status(200).json({
            message: "song updated"
        });
    })
});

const User = require('./models/user');

/* USER HANDLERS */

// create user
app.post("/api/user", (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password, 
        role: req.body.role,
        profile_pic: req.body.profile_pic,
        display_name: req.body.display_name, 
        email: req.body.email
    });

    user.save(
            // handle errors
            function(err) {
                res.status(500).json({
                    message: "unable to save user model",
                    reason: err
                });
            }
        ).then(newUser => {
        res.status(201).json({
            message: "user created",
            userId: newUser._id
        });
    });
});

// user login
app.post("/api/user/login", (req, res, next) => {
    // console.log(req.body.username);
    User.find({username: req.body.username, password: req.body.password})
    .then(resultData => {
        // console.log(resultData)
        if(resultData != undefined && resultData.length == 1) {
            req.session.userId = resultData[0]._id;
            // create session
            res.status(200).json({
                message: "ok",
            });

        } else {
            res.status(401).json({
                message:"failed"
            });
        }
    });
});

// get users
app.get("/api/user", (req, res, next) => {
    User.find(
        ).then(userResult => {
        res.status(200).json({
            message: "ok",
            users: userResult
        });
    });
});

// get certain user by id
app.get("/api/user/:id", (req, res, next) => {
    User.find(
        ).then(userResult => {
        if(userResult == null || userResult == undefined) {
            res.status(404).json({
                message: "not found",
                code: 404
            });
        } else {
            res.status(200).json({
                message: "ok",
                users: userResult
            });
        }
    });
});

// delete certain user
app.delete("api/user/:id", (req, res, next) => {
    User.deleteOne({_id: req.params.id});
    res.status(200);
});

/* END OF USER HANDLERS */

module.exports = app;