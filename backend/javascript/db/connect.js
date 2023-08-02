const mongoose = require("mongoose");
require("dotenv").config("../.env");

const connectToDb = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect(process.env.DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to Database!");
    } catch (err) { console.log(`Could not connect to Databse. Error: ${err}`) }
}

module.exports = connectToDb;