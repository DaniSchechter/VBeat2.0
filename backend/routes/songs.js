const express = require("express");
const app = express.Router();

const songController = require('../controllers/song');

// create a new song
app.post("", songController.newSong);

// get all the songs
app.get("", songController.getSongs);

// delete a song by his id
app.delete("/:id", songController.deleteSong);

// update song
app.put("/:id", songController.updateSong);

// search song
app.get("/search", songController.searchSong);

// quick search
app.post("/quick_search", songController.quickSearch);

// get genre with map reduce
app.get("/mapreduce", songController.mapReduce);

// get song by id
app.get("/:id", songController.getSongById);

module.exports = app;
