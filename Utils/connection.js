const mongoose = require("mongoose");

let MONGO_URL = process.env.MONGO_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            autoIndex: false,
        });
        console.log("MongoDB has been connected");
    } catch (error) {
        console.error("Error connecting to MongoDB: " + error);
    }
};

module.exports = connectDB;