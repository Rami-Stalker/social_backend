const mongoose = require("mongoose");
const commentSchema = require("./comment");

const postSchema = mongoose.Schema({
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
    postText: {
        type: String,
        default: "",
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
    },
    comments: [commentSchema],
    shares: {
        type: Number,
        default: 0,
    },
    saves: {
        type: Number,
        default: 0,
    },
    likes: {
        type: Number,
        default: 0,
    },  
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
