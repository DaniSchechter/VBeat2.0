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
        artists:  req.body.artists,
        num_of_times_liked: req.body.num_of_times_liked
    });
    song.save()
    .then(newSong => {
        res.status(201).json({
            message: "Song added successfully",
            songId: newSong._id
        });
    }).catch(error => {
        res.status(500).json({
            message: "Could not create a new song"
        });
    });
});

app.get("", (req, res, next) => {
    console.log(`user seesion: ${req.session.userId}`);
    const pageSize = +req.query.pageSize;
    const currPage = +req.query.page;
    let fetchedSongs;
    const songQuery = Song.find();
    if (pageSize && currPage){
        songQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
    }
    songQuery
    .then(songsResult => {
        fetchedSongs = songsResult;
        return Song.countDocuments();
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
            message: "Could not get the songs"
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
            message: "Could not delete this song"
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
        artists:  req.body.artists,
        num_of_times_liked: req.body.num_of_times_liked
    });
    Song.updateOne({_id: req.params.id}, song)
    .then(result => {
        res.status(200).json({
            message: "song updated"
        });
    }).catch(error => {
        res.status(400).json({
            message: "Could not update this song"
        });
    });
});


app.put("/likes/:id", (req, res, next) => {
    const song = new Song({
        _id: req.body.id,
        name: req.body.name,
        genre: req.body.genre,
        song_path: req.body.song_path,
        image_path: req.body.image_path,
        release_date: req.body.release_date,
        artists:  req.body.artists,
        num_of_times_liked: req.body.num_of_times_liked
    });
    
    Song.updateOne({_id: req.params.id}, song)
    .then(
        result => {
        res.status(200).json({
            message: "likes updated"
        });
    }).catch(error => {
        res.status(400).json({
            message: "Could not update num of likes"
        });
    });
});

module.exports = app;
