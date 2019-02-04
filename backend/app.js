const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const Song = require('./models/song');

const app = express();

mongoose.connect("")
.then(()=>{
    console.log("connected to db!");
}).catch(()=>{
    console.log("connection failed!");
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Controll-Allow-Origin", "*");
    res.setHeader("Access-Controll-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Controll-Allow-Methods", "GET, POST, DELETE");
    next();
});

app.post("/api/createSong", (req, res, next) => {
    const song = new Song({
        name: req.body.name,
        genres: req.body.genres,
        song_path: req.body.song_path,
        image_path: req.body.image_path,
        release_data: req.body.release_data,
        artists:  req.body.artists, // TODO: change to artist array
        num_of_time_liked: req.body.num_of_time_liked
        // TODO: add all the other fields that Dani didnt add yet !!!!!!
    });
    song.save();
    res.status(201).json({
        message: "Post addes successfully"
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

module.exports = app;