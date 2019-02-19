const express = require("express");

const User = require('../models/user');
const app = express.Router();

// create user
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
        res.status(201).json({
            message: "user created",
            userId: newUser._id
        });
    }).catch(error => {
        res.status(500).json({
            message: error.message
        });
    });
});

// user login
app.post("/login", (req, res, next) => {
    // console.log(req.body.username);
    User.find({username: req.body.username, password: req.body.password})
    .then(resultData => {
        // console.log(resultData)
        if(resultData != undefined && resultData.length == 1) {
            req.session.userId = resultData[0]._id;
            // create session
            res.status(200).json({
                message: "ok",
            });

        } else {
            res.status(401).json({
                message:"failed"
            });
        }
    });
});

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
                code: 404
            });
        } else {
            res.status(200).json({
                message: "ok",
                users: userResult
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

