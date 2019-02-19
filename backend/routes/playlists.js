const express = require("express");


const Playlist = require('../models/playlist');
const app = express.Router();

app.post("", (req, res, next) => {
    const playlist = new Playlist({
        name: req.body.name,
        user_id: req.session.userId,
        song_list: req.body.song_list,
    });
    playlist.save()
    .then(newPlaylist => {
        res.status(201).json({
            message: "Playlist added successfully",
            playlistId: newPlaylist._id
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
});

app.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currPage = +req.query.page;
    let fetchedPlaylists;
    console.log("playlist session.userId: " + req.session.userId);
    const playlistQuery = Playlist.find({user_id: req.session.userId });
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

app.put("/:id", (req, res, next) => {
    const playlist = new Playlist({
        _id: req.body.id,
        name: req.body.name,
        user_id: req.session.userId,
        song_list:  req.body.song_list
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