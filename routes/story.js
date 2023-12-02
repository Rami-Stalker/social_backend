const express = require("express");
const lodash = require("lodash");
const storyRouter = express.Router();
const auth = require("../middlewares/auth");
const Story = require("../models/story");

const { User } = require("../models/user");

// get all stories
storyRouter.get("/", async (req, res) => {
    try {
        const stories = await Story.find({});
        res.json(stories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// add story
storyRouter.post("/add-story", auth, async (req, res) => {
    try {
        const { storiesUrl, storiesType } = req.body;

        const user = await User.findById(req.user);

        let stories = [];

        for (let i = 0; i < storiesUrl.length; i++) {
            stories.push({ story: storiesUrl[i], type: storiesType[i] });
        }

        let story = new Story({
            userData: user,
            stories,
        });
        story = await story.save();

        res.json(story);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// like story
storyRouter.post("/add-like", auth, async (req, res) => {
    try {
        const { storyId } = req.body;

        let story = await Story.findById(storyId);

        const meLike = story.likes.find(o => o === req.user);

        if (meLike) {
            story.likes = lodash.filter(story.likes, x => x !== req.user);
        } else {
            story.likes.push(req.user);
        }

        story = await story.save();
        res.json(story);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// comment story
storyRouter.post("/add-comment", auth, async (req, res) => {
    try {
        const { storyId, comment } = req.body;

        let story = await Story.findById(storyId);

        story.comments.push({
            userId: req.user,
            comment,
        });
        story = await story.save();

        res.json(story);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get comment 
storyRouter.get("/get-comment", async (req, res) => {
    try {
        const story = await Story.findById(req.query.storyId);
        res.json(story.comments);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// like comment
storyRouter.post("/like-comment", auth, async (req, res) => {
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