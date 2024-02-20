const mongoose = require("mongoose");
const commentSchema = require("./comment");

const storySchema = mongoose.Schema({
    storyId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userAvatarUrl: {
        type: String,
        required: true,
    },
    imageUrls: [
        {
            type: String,
            default: "",
        },
    ],
    videoUrls: [
        {
            type: String,
            default: "",
        },
    ],
    timestamp: {
        type: Date,
        default: Date.now,
        expires: 86400,
    },
    comments: [commentSchema],
    views: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },
});

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
