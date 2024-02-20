const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({
    senderId: {
        default: "",
        type: String,
    },
    msg: {
        message: {
            default: "",
            type: String,
        },
        messageImage: {
            default: "",
            type: String,
        },
        type: {
            default: "",
            type: String,
        },
    },
    repliedMsg: {
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
            default: false,
            type: Boolean,
        },
    },
    like: {
        default: false,
        type: Boolean,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isSeen: {
        default: false,
        type: Boolean,
    },
});

module.exports = msgSchema;
