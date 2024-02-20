const mongoose = require("mongoose");
const contactSchema = require("./contact");

const chatSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    contacts: [contactSchema],
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
