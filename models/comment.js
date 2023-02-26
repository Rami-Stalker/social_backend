const mongoose = require("mongoose");
const {userSchema} = require("./user");

const commentSchema = mongoose.Schema({
    userId: {
        required: true,
        type: String,
    },
    comment: {
        required: true,
        type: String,
    },
    likes: [
        {
            type: String,
            default: "",
        },
    ],
    time: {
        required: true,
        type: Number,
    },
});

module.exports = commentSchema;
