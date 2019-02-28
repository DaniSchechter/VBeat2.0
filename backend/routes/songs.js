const express = require("express");

const Song = require('../models/song');
const Playlist = require('../models/playlist');
const User = require('../models/user');


const app = express.Router();

app.post("", async (req, res, next) => {
    try{

        artistIds = req.body.artists.map( artist => artist.id );

        // Create the new song
        const song = new Song({
            name: req.body.name,
            genre: req.body.genre,
            song_path: req.body.song_path,
            image_path: req.body.image_path,
            release_date: req.body.release_date,
            artists: artistIds,
            num_of_times_liked: req.body.num_of_times_liked,
            playlists: []
        });
        // Save new song
        const savedSong = await song.save();
        // for each artist update the song list
        artistIds.forEach(async artistId => {

            const artist = await User.findById(artistId);
            if(artist == null) {
                return;
            }
            artist.songs.push(savedSong._id);
            // Save user's changes
            await artist.save();
        });
        res.status(201).json({
            message: "Song added successfully",
            songId: savedSong._id
        });
    }
    catch (err){
            console.error(err);
            res.status(500).json({
                message: "Could not create a new song"
            });
    }
});

app.get("", (req, res, next) => {
    console.log(`user seesion: ${req.session.userId}`);
    const pageSize = +req.query.pageSize;
    const currPage = +req.query.page;
    let fetchedSongs;
    const songQuery = Song.find().populate('artists');
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

app.delete("/:id", async (req, res, next) => {
    try{
        const savedSong = await Song.findById(req.params.id);
        // Remove the song from all playlists
        savedSong.playlists.forEach( async playlistId => {
            const playlist = await Playlist.findById(playlistId);
            playlist.songList = playlist.songList.filter( songId => songId != req.params.id);
            await playlist.save();
        });

        // Remove the song from all users
        savedSong.artists.forEach( async artistId => {
            const artist = await User.findById(artistId);
            artist.songs = artist.songs.filter( songId => songId != req.params.id);
            await artist.save();
        });
        await Song.remove(savedSong)
        res.status(200).json({
            message : "Song deleted"
        });
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            message: "Could not delete this song"
        });
    }
});

app.put("/:id", async (req, res, next) => {
    try {
        // Get the song from DB so we can fetch the playlist from it
        const savedSong = await Song.findById(req.body.id);
        const song = new Song({
            _id: req.body.id,
            name: req.body.name,
            genre: req.body.genre,
            song_path: req.body.song_path,
            image_path: req.body.image_path,
            release_date: req.body.release_date,
            artists:  req.body.artists,
            num_of_times_liked: req.body.num_of_times_liked,
            playlists: savedSong.playlists
        });
        await Song.findByIdAndUpdate(req.params.id, song);
        res.status(200).json({
            message: "song updated"
        });
    }
    catch(error) {
        res.status(400).json({
            message: "Could not update this song"
        });
    }
});

app.get("/search",async (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currPage = +req.query.page;
    const songName = req.query.songName;
    let artistName = req.query.artistName;
    const genreName = req.query.genreName;

    let fetchedSongs;
    let query = {};
    let artistId;

    if (artistName !== ''){
        const user = await User.findOne({display_name:artistName});
        if(user!==null) artistId = user._id;
    }



    if(songName!=='') query["name"] = songName;
    if(artistName!=='') query["artists"] = artistId;
    if(genreName!=='') query["genre"] = genreName;


    const songQuery = Song.find(query).populate('artists');


    if (pageSize && currPage){
        songQuery.skip(pageSize * (currPage - 1)).limit(pageSize);
    }
    songQuery
    .then(songsResult => {
        fetchedSongs = songsResult;
        return Song.find(query).countDocuments();
    })
    .then(count => {
        res.status(200).json({
                message: "Songs fetched successfully",
                songs: fetchedSongs,
                totalSongs: count
            });
    }).catch(error => {
        res.status(500).json({
            message: "error on search songs"
        });
    });
});





app.get("/mapreduce", (req, res, next) => {
	const o = {};

	o.map = function(){
		emit(this.genre, this.num_of_times_liked)
	};

	o.reduce = function(id, num_of_times_liked){
		return Array.sum(num_of_times_liked);
	};

	Song.mapReduce(o, function(err, results, stats){
		if(err != undefined || err != null){
			res.status(500).json({
				message: err
			});
			return;
		}

		res.status(200).json(results);
	});
});

module.exports = app;
