const express = require("express");
const User = require('../models/user');
const app = express.Router();
const browserCounter = require('../algo/count-user-agent');

// browser stats from CMS
app.get("/browser", (req, res, next) => {
	res.status(200).json(
		browserCounter.getData()
	);
});

// logout
app.get("/logout", (req, res, next) => {
	req.session.userId = null;
	// typescript will redirect
	res.status(200).json({
		message: "logged out",
	});
});

// Create a new user
app.post("", (req, res, next) => {

    const user = new User(req.body);
    user.save()
    .then(newUser => {
        req.session.userId = newUser._id;
        res.status(201).json({
            userId: newUser._id, 
            message: "User created successfully",
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({
            message: "Could not create a user"
        });
    });
});

// User login
app.post("/login", (req, res, next) => {
<<<<<<< HEAD
=======
    console.log('login called /login');
>>>>>>> 975ffd00ff0bf11152a12056f084b28e5426b1d7
    User.findOne({
        username: req.body.username,
        password: req.body.password
    })
    .then(resultData => {
        if(resultData) {

            // create session
            req.session.userId = resultData._id;

            // notify browser counter
            browserCounter.onLogin(req.headers['user-agent']);

            res.status(200).json({
                userId: resultData._id, 
                message: "Loged in successfully",
            });

        } else {
            res.status(401).json({
                message:"Failed to log in"
            });
        }
    });
});

// get all artists ( role = "Artist" )
app.get("/artists", (req, res, next) => {
<<<<<<< HEAD
=======
    console.log('get all artists called /artists');
>>>>>>> 975ffd00ff0bf11152a12056f084b28e5426b1d7
    User.find({ 
        role: "ARTIST" 
    })
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

// get the current user (connected or not)
app.get("/currentUser", (req, res, next) => {
<<<<<<< HEAD
=======
    console.log('get current user /currentUser called');
>>>>>>> 975ffd00ff0bf11152a12056f084b28e5426b1d7
    if(!req.session.userId){
    	res.status(401).json({
		    message: 'not logged in'
        });
        return;
    }

    User.findById(req.session.userId)
    .then(user => {
        if(user){
            res.status(200).json({
                user: user
            });
        }
        else{
            res.status(200).json({
                user: null
            });
        }
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Coult not get the status of the user"
        });
    });
})

// get all users
app.get("", (req, res, next) => {
    User.find()
    .then(users => {
	    users.forEach(user => user.password="<censored>");
        res.status(200).json({
            message: "ok",
            users: userResult
        });
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Could not get all users"
        });
    });
});

// get certain user by id
app.get("/:id", (req, res, next) => {
    User.findById(req.params.id)
    .then(user => {
        if(user == null || user == undefined) {
            res.status(404).json({
                message: "not found",
            });
        } else {
            res.status(200).json({
                message: "ok",
            });
        }
    }).catch(error => {
        console.log(error);
        res.status(400).json({
            message: "Could not get user"
        });
    });;
});

module.exports = app;
