const express = require("express");
const app = express.Router();

const playlistController = require('../controllers/playlist');

//create a new playlist
app.post("", playlistController.newPlaylist);

// search for playlist/s
app.get("/search", playlistController.searchPlaylist);

// get all playlists
app.get("/all", playlistController.getAllPlaylists);

// get playlist by id
app.get("/getById/:id", playlistController.getPlaylistById);

// Get playlist by name
app.get("/:name", playlistController.getPlaylistByName);

// get all playlists for the connected user
app.get("", playlistController.getAllPlaylistsForConnectedUser);

// delete playlist
app.delete("/:id", playlistController.deletePlaylist);

// Add song to all selected playlists
app.put("/updateAll/", playlistController.updateAllSelectedPlaylists);

// update playlist
app.put("/:id", playlistController.updatePlaylist);

module.exports = app;
