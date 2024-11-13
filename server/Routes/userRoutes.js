const express = require('express');
const router = express.Router();
const jwtAuthimidlwareee= require("../Middleware/jwtAuthimidlwareee");

// Importing functions from the usercontroller and jwtAuthimidlwareee
const { registerUser, loginUser } = require('../Controller/usercontroller');
const { validateJwtToken } = require("../Middleware/jwtAuthimidlwareee"); // Import validateJwtToken

// Route for user registration
router.post('/register', registerUser);

// Route for user login with JWT middleware
router.post('/login', loginUser);

// Secure route that requires JWT authentication
router.get('/secure-data', validateJwtToken, (req, res) => {
    res.json({ message: 'This is a secure data route' });
});


router.post("/myaccount",jwtAuthimidlwareee,getUserProfile);
router.patch("/myaccount",jwtAuthimidlwareee,updateUserProfile);


module.exports = router;
