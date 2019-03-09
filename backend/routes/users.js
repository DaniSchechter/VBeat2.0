const express = require("express");
const app = express.Router();
const userController = require('../controllers/user');

// browser stats from CMS
app.get("/browser", userController.browserStats);

// logout
app.get("/logout", userController.logout);

// Create a new user
app.post("", userController.newUser);

// User login
app.post("/login", userController.login);

// get all artists ( role = "Artist" )
app.get("/artists", userController.getAllArtists);

// get the current user (connected or not)
app.get("/currentUser", userController.getCurrentUser)

// get all users
app.get("", userController.getAllUsers);

// get certain user by id
app.get("/:id", userController.getUserById);

module.exports = app;
