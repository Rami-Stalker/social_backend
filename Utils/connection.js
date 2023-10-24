const mongoose = require("mongoose");
// const dotenv = require('dotenv');

// dotenv.config();

let MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            autoIndex: false,
        });
        console.log("MongoDB Have Been Connnected");
    } catch (error) {
        console.log("Error connecting MongoDB " + error);
    }
}

module.exports = connectDB