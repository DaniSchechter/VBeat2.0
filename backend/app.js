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

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE");
    next();
});

app.post("/api/createSong", (req, res, next) => {
    const song = new Song({
        name: req.body.name,
        genre: req.body.genres,
        song_path: req.body.song_path,
        image_path: req.body.image_path,
        release_date: req.body.release_date,
        artists:  req.body.artists, // TODO: change to artist array
        num_of_times_liked: req.body.num_of_time_liked
    });
    song.save().then(newSong => {
        res.status(201).json({
            message: "Post addes successfully",
            songId: newSong._id
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

module.exports = app;