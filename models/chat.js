const mongoose = require("mongoose");
const contentSchema = require("./content");

const chatSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    contents: [contentSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
