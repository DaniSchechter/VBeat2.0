const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const songsRoutes = require("./routes/songs");
const usersRoutes = require("./routes/users");
const playlistRoutes = require("./routes/playlists");
const app = express();

mongoose.connect("mongodb://alex:nE7fHawuXIMUmwlX@198.46.188.120/first-node?retryWrites=true")
.then(()=>{
    console.log("connected to db!");
}).catch(()=>{
    console.log("connection failed!");
});

//Boby parameter parsing
var secretCookie = 'donttellthistonobodyitssupposedtobeasecret'

app.use(bodyParser.json());

app.use(session(
	{
		secret: secretCookie,
		resave:true
	}
));


//Setting Headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

app.use("/api/song", songsRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/playlist", playlistRoutes);

module.exports = app;
