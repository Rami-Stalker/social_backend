const express = require("express");
const auth = require("../middlewares/auth");
const { User } = require("../models/user");
const Post = require("../models/post");
const userRouter = express.Router();

userRouter.get("/api/users/search/:name", async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.params.name, $options: "i" },
        });

        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.post("/api/user/follow", auth, async (req, res) => {
    try {
        const { userId } = req.body;

        let user = await User.findById(userId);
        let my = await User.findById(req.user);

        user.followers.push(req.user);
        my.following.push(userId);
        
        user = await user.save();
        my = await my.save();
        res.json(my);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.get("/api/user/get-mypost", async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.query.userId });
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.post("/api/user/modify-bgimage", auth, async (req, res) => {
    try {
        const { image } = req.body;

        let user = await User.findById(req.user);

        user.backgroundImage = image;
        
        user = await user.save();
        
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.post("/api/user/modify-image", auth, async (req, res) => {
    try {
        const { image } = req.body;

        let user = await User.findById(req.user);

        user.photo = image;
        
        user = await user.save();
        
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = userRouter;

