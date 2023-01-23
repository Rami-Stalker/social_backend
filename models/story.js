const mongoose = require("mongoose");
const { userSchema } = require("./user");
const commentSchema = require("./comment");

const storySchema = mongoose.Schema({
    userData: userSchema,
    likes: [
        {
            type: String,
            default: "",
        },
    ],
    createdAt: {
        default: Date.now,
        type: Date,
        expires: 86400,
    },
    stories: [
        {
            story: {
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

const Story = mongoose.model("Story", storySchema);
module.exports = Story;
