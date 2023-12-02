const mongoose = require("mongoose");
const { userSchema } = require("./user");
const commentSchema = require("./comment");

const postSchema = mongoose.Schema({
    userData: userSchema,
    userId: {
        required: true,
        type: String,
    },
    description: {
        default: "",
        type: String,
    },
    likes: [
        {
            type: String,
            default: "",
        },
    ],
    shares: [
        {
            type: String,
            default: "",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    posts: [
        {
            post: {
                default: "",
                type: String,
            },
            type:{
                default: "",
                type: String,
            },
        },
    ],
    comments: [commentSchema],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
