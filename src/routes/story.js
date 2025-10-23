const express = require("express");
const lodash = require("lodash");
const storyRouter = express.Router();
const auth = require("../middlewares/auth");
const Story = require("../models/story");

const { User } = require("../models/user");

// get all stories
storyRouter.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);

        let allStories = [];

        const userStories = await Story.find({ userId: req.user });
        
        if (userStories) {
            for (let i = 0; i < userStories.length; i++) {
                allStories.push(userStories[i]);
            }
        }

        for (let i = 0; i < user.following.length; i++) {
            let followingStories = await Story.find({userId: user.following[i]});
            for (let j = 0; j < followingStories.length; j++) {
                allStories.push(followingStories[j]);
            }
        }

        allStories.sort((a, b) => b.createdAt - a.createdAt).reverse();
        
        res.json(allStories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// add story
storyRouter.post("/add-story", auth, async (req, res) => {
    try {
    const { imageUrls, videoUrls } = req.body;

    const user = await User.findById(req.user);

    let story = new Story({
        userId: req.user,
        userName: user.name,
        userAvatarUrl: user.userAvatarUrl,
        imageUrls,
        videoUrls,
    });
    story = await story.save();

    res.json(story);
    } catch (e) {
    res.status(500).json({ error: e.message });
    }
});

// get story comments
storyRouter.get("/get-story-comments", async (req, res) => {
    try {
        const story = await Story.findById(req.query.storyId);
        res.json(story.comments);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// like comment story
storyRouter.post("/like-comment-story", auth, async (req, res) => {
    try {
        const { storyId, commentId } = req.body;

        let story = await Story.findById(storyId);

        const comment = story.comments.find(o => o.id === commentId);

        const meLike = comment.likes.find(o => o === req.user);

        if (meLike) {
            comment.likes = lodash.filter(comment.Likes, x => x !== req.user);
        } else {
            comment.likes.push(req.user);
        }

        story = await story.save();
        res.json(story);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = storyRouter;