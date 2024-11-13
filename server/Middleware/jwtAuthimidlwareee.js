// // first we are initializing json web token module to use functionalities of jwt ie. .sign and .verify
// const jwt = require('jsonwebtoken');

// // after successful registration of user and then calling the login endpoint with already registered user, 
// // it will create and return jwt token
// const generateJwtToken = (userData) => {
//     return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: 400000 });
// };

// // after login we are getting the token, and for validating the JWT token, that it is correct or not, 
// // we will proceed with secure routes, to GET/POST/UPDATE/DELETE.
// const validateJwtToken = (req, res, next) => {
//     // we are checking that token is available or not in request headers.
//     const tokenCheck = req.headers.authorization;
//     // OPTION 1: req header token, authorization, is not sent. (does not exist)
//     // 401 - Unauthorized: The request has not been applied because it lacks valid authentication credentials for the target resource.
//     // 403 - Forbidden: The server understood the request, but is refusing to authorize it.
//     if (!tokenCheck) {
//         return res.status(401).json({ err: 'TOKEN NOT AVAILABLE' });
//     }
//     // OPTION 2: req header getting token token: but not in a right format.
//     // Authorization: BASIC/BEARER
//     // BASIC - btoa(USERNAME:PASSWORD) -> BASIC wyvdhbwefejsfb (JWT TOKEN)   [BASE64]
//     // BEARER - vehfvweyfbwejfbejgfu (JWT TOKEN)
//     const token = req.headers.authorization.split(' ')[1];
//     if (!token) {
//         return res.status(401).json({err:'Invalid Token'});
//     }
//     try{
//         const validateToken= jwt.verify(token, process.env.JWT_SECRET);
//         req.user=validateToken;
//         next();
//     }
//     catch(err){
//         return res.status(401).json(err.message); 
//     }
// };

// module.exports



// Importing the JWT module
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateJwtToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '1h' }); // Setting a more reasonable expiration time
};

// Middleware to validate the JWT token
const validateJwtToken = (req, res, next) => {
    const tokenCheck = req.headers.authorization;
    
    if (!tokenCheck) {
        // Token not found in the Authorization header
        return res.status(401).json({ err: 'Token not available' });
    }

    // Extracting token from the Authorization header
    const token = tokenCheck.split(' ')[1]; // Assuming the format is 'Bearer <token>'

    if (!token) {
        return res.status(401).json({ err: 'Invalid token format' });
    }

    try {
        // Verifying the token
        const validateToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = validateToken; // Attaching the decoded token data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        // In case of any errors during token verification
        return res.status(401).json({ err: 'Token verification failed', message: err.message });
    }
};

// Exporting the functions for use in other files
module.exports = { generateJwtToken, validateJwtToken };
