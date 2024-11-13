// mongoose : used to connect the database to the server 
const mongoose = require("mongoose");

const connectDb = async () => { // async : it is used to return a promise
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });
        // Log successful connection
        console.log(
            "Database Connected: ",
            connect.connection.host,
            connect.connection.name
        );
    } catch (err) {
        console.error("Database connection error: ", err);
        process.exit(1); // Exit with failure (1) on error
    }
};

module.exports = connectDb;
