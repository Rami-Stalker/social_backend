const express = require("express");
const lodash = require("lodash");
const storyRouter = express.Router();
const auth = require("../middlewares/auth");
const Story = require("../models/story");

const { User } = require("../models/user");

// get all stories
storyRouter.get("/story/", async (req, res) => {
    try {
        const stories = await Story.find({});
        res.json(stories);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// add story
storyRouter.post("/story/add-story", auth, async (req, res) => {
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
storyRouter.post("/story/add-like", auth, async (req, res) => {
    try {
        const { storyId, isAdd } = req.body;
        
        const user = await User.findById(req.user);
        let story = await Story.findById(storyId);

        if (isAdd == 1) {
            story.likes.push(user);
        }else{
            story.likes = lodash.filter(story.likes, x => x.email !== user.email);
        }

        story = await story.save();
        res.json(story);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// comment story
storyRouter.post("/story/add-comment", auth, async (req, res) => {
    try {
        const { storyId, comment } = req.body;

        let story = await Story.findById(storyId);
        const user = await User.findById(req.user);
        
        story.comments.push({
            userData: user,
            comment,
            time: new Date().getTime(),
        });

        story = await story.save();

        res.json(story);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get comment 
storyRouter.get("/story/get-comment", async (req, res) => {
    try {
        const story = await Story.findById(req.query.storyId);
        res.json(story.comments);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// like comment
storyRouter.post("/story/like-comment", auth, async (req, res) => {
    try {
        const { storyId, commentId, isAdd } = req.body;
        
        const user = await User.findById(req.user);
        let story = await Story.findById(storyId);

        const comment = story.comments.find(o => o.id === commentId);

        if (isAdd == 1) {
            comment.likes.push(user);
        }else{
            comment.likes = lodash.filter(comment.Likes, x => x.id !== user.id);
        }

        story = await story.save();
        res.json(story);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



module.exports = storyRouter;