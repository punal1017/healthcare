// FRAMEWORKS
const express = require("express");
const connectDb = require("./config/dbConnection");
const ErrorHandler = require("./middleware/errorhand");
const cors = require("cors"); // CORS: Cross-Origin Resource Sharing allows requests from different domains 
const connectDB = require('./db');

//env config : env is locally installed 
const dotenv = require("dotenv");
dotenv.config();

connectDb(); // Connect to the database

const app = express();
const port = process.env.PORT || 5000; // Use environment port or fallback to 5000

app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS
app.use(ErrorHandler); // Custom error handler middleware

// Routes
app.get('/', (req, res) => {
    res.send("Working");
});

// Start the server
app.listen(port, () => {
    console.log('Server running on https://localhost:${port}');
});