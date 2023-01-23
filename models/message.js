const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({
    senderId: {
        required: true,
        type: String,
    },
    recieverId: {
        required: true,
        type: String,
    },
    msg:
    {
        message: {
            default: "",
            type: String,
        },
        type: {
            default: "",
            type: String,
        },
    },
    repliedMsg:
    {
        repliedMessage: {
            default: "",
            type: String,
        },
        type: {
            default: "",
            type: String,
        },
        repliedTo: {
            default: "",
            type: String,
        },
        isMe: {
            default: "",
            type: String,
        },
    },
    like: {
        required: false,
        type: Boolean,
    },
    createdAt: {
        default: Date.now,
        type: Date,
    },
    isSeen: {
        required: false,
        type: Boolean,
    },
});

module.exports = msgSchema;
