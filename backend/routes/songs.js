const express = require("express");


const Song = require('../models/song');
const app = express.Router();

app.post("", (req, res, next) => {
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
    }).catch(error => {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    });
});

app.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currPage = +req.query.page;
    let fetchedSongs;
    const songQuery = Song.find();
    if (pageSize && currPage){
        songQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
    }
    songQuery.then(songsResult => {
        fetchedSongs = songsResult;
        return Song.count();
    })
    .then(count => {
        res.status(200).json({
                message: "Songs fetched successfully",
                songs: fetchedSongs,
                totalSongs: count
            });
    }).catch(error => {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    });
});

app.delete("/:id", (req, res, next) => {
    Song.deleteOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message : "Song deleted"
        });
    }).catch(error => {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    });
});

app.put("/:id", (req, res, next) => {
    
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
    }).catch(error => {
        res.status(400).json({
            message: error.message
        });
    });
});

module.exports = app;
