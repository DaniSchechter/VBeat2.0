const express = require("express");
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

module.exports = app;