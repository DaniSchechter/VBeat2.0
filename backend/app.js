const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const songsRoutes = require("./routes/songs");
const usersRoutes = require("./routes/users");
const playlistRoutes = require("./routes/playlists");

const app = express();

mongoose.connect("mongodb+srv://alex:nE7fHawuXIMUmwlX@cluster0-k5m05.mongodb.net/first-node?retryWrites=true")
.then(()=>{
    console.log("connected to db!");
}).catch(()=>{
    console.log("connection failed!");
});

//Boby parameter parsing
var secretCookie = 'donttellthistonobodyitssupposedtobeasecret'

app.use(bodyParser.json());

app.use(session({secret: secretCookie}));
app.use(cookieParser(secretCookie));


//Setting Headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    next();
});

app.use("/api/songs", songsRoutes);
app.use("/api/user", usersRoutes);
app.use("/api/playlist", playlistRoutes);


module.exports = app;
