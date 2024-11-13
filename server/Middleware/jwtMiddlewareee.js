const jwt = require('jsonwebtoken');
const createToken= (userData) =>{
    return jwt.sign(userData,process.env);
    JWT_SECRET}