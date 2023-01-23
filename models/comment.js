const mongoose = require("mongoose");
const {userSchema} = require("./user");

const commentSchema = mongoose.Schema({
    userData: userSchema,
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
