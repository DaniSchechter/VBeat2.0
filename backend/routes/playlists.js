const express = require("express");

const Playlist = require('../models/playlist');
const app = express.Router();


//create a new playlist
app.post("", (req, res, next) => {
    const playlist = new Playlist({
        name: req.body.name,
        UserId: req.session.userId,
        songList: req.body.songList,
    });
    playlist.save()
    .then(newPlaylist => {
        res.status(201).json({
            message: "Playlist added successfully",
            playlistId: newPlaylist._id
        });
    }).catch(error => {
        console.log("error playlist");
        res.status(500).json({
            message: error.message
        });
    });
});

// Get playlist by name
app.get("/:name", (req, res, next) => {
    console.log(req.session.userId);
    Playlist.findOne({UserId:req.session.userId,  name: req.params.name})
    .then(result => {
        console.log(result);
        res.status(200).json({
                message: "favorite songs playlist fetchet successfully",
                playlist: result,
            });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
});

// get all playlists
app.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currPage = +req.query.page;
    let fetchedPlaylists;
    const playlistQuery = Playlist.find({UserId: req.session.userId });
    if (pageSize && currPage){
        playlistQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
    }
    playlistQuery
    .then(playlistsResult => {
        fetchedPlaylists = playlistsResult;
        return Playlist.count();
    })
    .then(count => {
        res.status(200).json({
                message: "Playlists fetched successfully",
                playlists: fetchedPlaylists,
                totalPlaylists: count
            });
    }).catch(error => {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        });
    });
});

// delete playlist
app.delete("/:id", (req, res, next) => {
    Playlist.deleteOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message : "Playlist deleted"
        });
    }).catch(error => {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    });
});

// update playlist
app.put("/:id", (req, res, next) => {
    let songList = req.body.songList.map( song => {
        return newSong = {
            _id: song.id,
            name: song.name,
            genre: song.genre,
            song_path: song.song_path,
            image_path: song.image_path,
            release_date: song.release_date,
            artists: song.artists,
            num_of_times_liked: song.num_of_times_liked
        };
    });
    const playlist = new Playlist({
        _id: req.body.id,
        name: req.body.name,
        UserId: req.session.userId,
        songList:  songList
    });

    Playlist.updateOne({_id: req.params.id}, playlist)
    .then(result => {
        res.status(200).json({
            message: "playlist updated"
        });
    }).catch(error => {
        res.status(400).json({
            message: error.message
        });
    });
});

module.exports = app;