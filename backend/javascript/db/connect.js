const mongoose = require("mongoose");

const connectToDb = async () => {
    try {
        console.log("Connecting to Database...");
        await mongoose.connect("mongodb://localhost:27017/luganodes", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to Database!");
    } catch (err) { console.log(`Could not connect to Databse. Error: ${err}`) }
}

module.exports = connectToDb;