const mongoose = require("mongoose");
const msgSchema = require("./message");

const chatSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    contents: [
        {
            recieverId: {
                type: String,
                default: "",
            },
            messages: [msgSchema],
        }
    ],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
