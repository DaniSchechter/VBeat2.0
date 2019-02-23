const express = require("express");
const User = require('../models/user');
const app = express.Router();
const browserCounter = require('../algo/count-user-agent');

app.get("/browser", (req, res, next) => {
	res.status(200).json(
		browserCounter.getData()
	);
});


app.post("", (req, res, next) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password, 
        role: req.body.role,
        profile_pic: req.body.profile_pic,
        display_name: req.body.display_name, 
        email: req.body.email
    });
    user.save()
    .then(newUser => {
        req.session.userId = newUser._id;
        res.status(201).json({
            userId: newUser._id, 
            message: "User created successfully",
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
});

// user login
app.post("/login", (req, res, next) => {
    User.find({username: req.body.username, password: req.body.password})
    .then(resultData => {
        if(resultData != undefined && resultData.length == 1) {
            req.session.userId = resultData[0]._id;
	    // notify browser counter
	    browserCounter.onLogin(req.headers['user-agent']);

            // create session
            res.status(200).json({
                userId: resultData[0]._id, 
                message: "Loged in successfully",
            });

        } else {
            res.status(401).json({
                message:"Failed to log in"
            });
        }
    });
});

// get all artists ( roll = "Artist" )
app.get("/artists", (req, res, next) => {
    User.find({ role: "ARTIST" })
    .then(artists => {
        if(artists == null || artists == undefined) {
            res.status(404).json({
                message: "Not found",
                artists: [],
            });
        } else {
            res.status(200).json({
                message: "Fetched artists successfully",
                artists: artists
            });
        }
    });
});

// get the role of the current user (connected or not)
app.get("/userRole", (req, res, next) => {
    User.findOne({_id:req.session.userId})
        .then(userResult => {
            if(userResult){
                res.status(200).json({
                    userRole: userResult.role
                });
            }
            else{
                res.status(200).json({
                    userRole: null
                });
            }
        }
    );
})

// get users
app.get("", (req, res, next) => {
    User.find(
        ).then(userResult => {
        res.status(200).json({
            message: "ok",
            users: userResult
        });
    });
});

// get certain user by id
app.get("/:id", (req, res, next) => {
    User.find(
        ).then(userResult => {
        if(userResult == null || userResult == undefined) {
            res.status(404).json({
                message: "not found",
                users: []
            });
        } else {
            res.status(200).json({
                message: "ok",
            });
        }
    });
});



// delete certain user
app.delete("/:id", (req, res, next) => {
    User.deleteOne({_id: req.params.id})
    .then(result => {
        res.status(200).json({
            message : "User deleted"
        });
    }).catch(error => {
        console.log(error.message);
        res.status(400).json({
            message: error.message
        });
    });
});




module.exports = app;
