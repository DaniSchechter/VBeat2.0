const express = require("express");
const User  = require('../models/user');
const Song = require('../models/song');
const Playlist = require('../models/playlist');
const app = express.Router();


// denies entry for when user id is needed
function denyEntry(req,res){
    if(req.session.userId) {
		return false;
	}
	res.status(401).json({
		message: 'You need to login before you can access playlists'
	});

	return true;
}


//create a new playlist
exports.newPlaylist = async function(req,res){
    if(denyEntry(req,res))  {
    	return;
    }
    try {
        if (req.body.songList){
            songList = req.body.songList.map(song => song.id);
        }
        else{
            songList = [];
        }
        // Find the user to add the playlist to
        const user = await User.findById(req.session.userId);
        // Create the new playlist
        const playlist = new Playlist({
            name: req.body.name,
            user: user,
            songList: songList
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
}


// search for playlist/s
exports.searchPlaylist = async function(req,res){
    const pageSize = +req.query.pageSize;
  const currPage = +req.query.page;
  let minSongs = +req.query.minSongs;
  if(req.query.minSongs==='') minSongs = null //if empty num is passed in request, make it null
  const playlistName = req.query.playlistName;
  let songName = req.query.songName;

  let fetchedPlaylists;
  let query = {};
  let songId;

  if(songName!=='') {
    const song = await Song.findOne({name:songName});
    if(song!==null) songId = song._id;
  }

  if(songName!=='') query["songList"] = songId;
  if(playlistName!=='') query["name"] = playlistName;
  if(!isNaN(minSongs)){ // if it is not a number, considered like empty string, not filtering with that parameter
    if(minSongs!==null && minSongs > 0) {
      query["songList." + (minSongs - 1).toString()] = { "$exists": true };
    }
  }

  //query["UserId"] = req.session.userId; // IF YOU SEE IT DONT MERGE, THIS LINE NEEDS TO BE IN THE CODE
  const playlistQuery = Playlist.find(query);
  if (pageSize && currPage){
      playlistQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
  }
  playlistQuery
  .then(playlistsResult => {
      fetchedPlaylists = playlistsResult;
      return Playlist.find(query).countDocuments();
  })
  .then(count => {
      res.status(200).json({
              message: "Playlists fetched successfully",
              playlists: fetchedPlaylists,
              totalPlaylists: count
          });
  }).catch(error => {
      res.status(500).json({
          message: "Could not get the playlists"
      });
  });
}

// get all playlists
exports.getAllPlaylists = async function(req,res){
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
}


// get playlist by id
exports.getPlaylistById = async function(req,res){
    try {
        const playlist = await Playlist.findById(req.params.id).populate({ path:'songList', populate: {path: 'artists'}});

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
}

// Get playlist by name
exports.getPlaylistByName = async function(req,res){
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
}


// get all playlists for the connected user
exports.getAllPlaylistsForConnectedUser = function(req,res){
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
}

// delete playlist
exports.deletePlaylist = async function(req,res){
    try{
        let playlist = await Playlist.findById(req.params.id);
        // Remove playlist from all songs
        playlist.songList.forEach( async songId => {
            const song = await Song.findById(songId);
            song.playlists = song.playlists.filter( playlistId => playlistId != req.params.id);
            await song.save();
        });
         // Remove playlist from all users
            const user = await User.findById(playlist.user);
            user.playlists = user.playlists.filter( playlistId => playlistId != req.params.id);
            await user.save();
        await Playlist.remove(playlist);
        res.status(200).json({
            message : "Playlist deleted"
        });
    }
    catch(error){
        res.status(400).json({
            message: "Error on deleting playlist"
        });
    }
}


// Add song to all selected playlists
exports.updateAllSelectedPlaylists = function(req,res){
    if(denyEntry(req,res)) {
    	return;
    }
    try {
        req.body.playlists.forEach(playlist => {
            addSongToPlaylist(playlist.id, req.body.song.id);
        });
        res.status(200).json({
            message: "playlist updated"
        });
    }
    catch(err) {
        console.log(err);
        res.status(400).json({
            message: "Could not update playlist"
        });
    }
}

// update playlist
exports.updatePlaylist = async function(req,res){
    if(denyEntry(req,res)) {
    	return;
    }
    try {
        let songList = req.body.songList.map( song => song.id );

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

            /* If song alreay in playlist - remove it
               In likes it like and unlike
               in regular playlists, remove from playlists also calls this route
            */
            // If already exists, remove using filter
            newPlaylistList = song.playlists.filter( playlistId => playlistId != req.body.id)
            if( song.playlists.length == newPlaylistList.length ) // wasnt in the list
                newPlaylistList.push(playlist._id);

            song.playlists = newPlaylistList

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
}

// add song to playlist
async function addSongToPlaylist(){
    const playlist = await Playlist.findById(playlistId);

    let songList = playlist.songList;
    songList.push(songId);
    playlist.songList = songList;
    await Playlist.findByIdAndUpdate(playlistId, playlist);

    // Add the playlist to the song, added to this playlist
    const song = await Song.findById(songId);

    /* If song alreay in playlist - remove it
        In likes it like and unlike
        in regular playlists, remove from playlists also calls this route
    */
    // If already exists, remove using filter
    newPlaylistList = song.playlists.filter( playlistId => playlistId != playlist.id)
    if( song.playlists.length == newPlaylistList.length ) // wasnt in the list
        newPlaylistList.push(playlist._id);

    song.playlists = newPlaylistList

    await Song.findByIdAndUpdate(songId, song);
    while(true){
        let savedSong = await Song.findById(songId);
        if(!savedSong.playlists.some(playlist_Id => playlist_Id == playlistId)){
            savedSong.playlists.push(playlistId);
            await Song.findByIdAndUpdate(songId, savedSong);
        }
        else{
            break;
        }
    }
}