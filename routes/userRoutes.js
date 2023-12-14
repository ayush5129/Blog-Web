const express = require('express');
const { getAllUser, registerController, loginController } = require('../controller/userController');

// router object
const router = express.Router();

// Get all user || Get
router.get('/all-users',getAllUser)

// Create User || Post 
router.post("/register",registerController);

// Login || post
router.post("/login",loginController);

module.exports = router;
