const express = require("express");
const User  = require('../models/user');
const Song = require('../models/song');
const Playlist = require('../models/playlist');
const app = express.Router();

// denies entry for when user id is needed 
function denyEntry(req, res){
	if(req.session.userId) {
		return false;
	}
	res.status(401).json({
		message: 'You need to login before you can access playlists'
	});

	return true;
}

//create a new playlist
app.post("", async (req, res, next) => {
    if(denyEntry(req,res))  {
    	return;
    }
    try {
        // Find the user to add the playlist to
        const user = await User.findById(req.session.userId);
        // Create the new playlist
        const playlist = new Playlist({
            name: req.body.name,
            user: user,
            songList: []
        });
        // Save new playlist
        const savedPlaylist = await playlist.save();
        // Add the new playlist to the user
        user.playlists.push(savedPlaylist._id);
        // Save user's changes
        await user.save()
        res.status(201).json({
            message: "Playlist added successfully",
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Could not add a new playlist"
        });
    }
});

// get all playlists
app.get("/all", async (req, res, next) => {
    if(denyEntry(req,res)) {
    	return;
    }
    try {
        const playlists = await Playlist.find({
            user: req.session.userId 
        }).populate('songList');
        
        res.status(200).json({
            playlists: playlists,
        });
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Couldn't fetch all playlists"
        });
    }
});

// get playlist by id
app.get("/getById/:id", async (req, res, next) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('songList');
        res.status(200).json({
            message: "Playlist fetched successfully",
            playlist: playlist,
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Couldn't get playlist by id"
        });
    }
});

// Get playlist by name
app.get("/:name", async (req, res, next) => {
    if(denyEntry(req,res)) {
    	return;
    }

    try {
        const playlist = await Playlist.findOne({
            user:req.session.userId,  name: req.params.name
        }).populate('songList');
        res.status(200).json({
            message: "favorite songs playlist fetched successfully",
            playlist: playlist,
        });
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Could not get the playlist with name" + req.params.name
        });
    }
});

// get all playlists for the connected user
app.get("", (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currPage = +req.query.page;
    let fetchedPlaylists;

    if(denyEntry(req,res)) {
    	return;
    }

    const playlistQuery = Playlist.find({
        user: req.session.userId 
    }).populate('songList');
    
    if (pageSize && currPage){
        playlistQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
    }

    playlistQuery
    .then(playlistsResult => {
        fetchedPlaylists = playlistsResult;
        return playlistsResult.length;
    })
    .then(count => {
        res.status(200).json({
                message: "Playlists fetched successfully",
                playlists: fetchedPlaylists,
                totalPlaylists: count
            });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Could not get the playlists"
        });
    });
});

// delete playlist
app.delete("/:id", (req, res, next) => {
    Playlist.deleteOne({
        _id: req.params.id
    })
    .then(result => {
        res.status(200).json({
            message : "Playlist deleted"
        });
    }).catch(error => {
        res.status(400).json({
            message: "Error on deleting playlist"
        });
    });
});

// update playlist
app.put("/:id", async (req, res, next) => {
    if(denyEntry(req,res)) {
    	return;
    }
    try {
        let songList = req.body.songList.map( song => song.id );
        console.log('list', songList);

        const playlist = new Playlist({
            _id: req.body.id,
            name: req.body.name,
            user: req.session.userId,
            songList:  songList
        });
    
        await Playlist.findByIdAndUpdate(req.params.id, playlist);

        // Add the playlist to each song, added to this playlist
        songList.forEach( async songId => {
            const song = await Song.findById(songId);
            console.log('song', song);
            song.playlists.push(playlist._id);
            await song.save();
        });
        
        res.status(200).json({
            message: "playlist updated"
        });
    }
    catch(err) {
        res.status(400).json({
            message: "Could not update playlist"
        });
    }
});

module.exports = app;
