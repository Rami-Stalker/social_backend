const express = require("express");
const auth = require("../middlewares/auth");
const { User } = require("../models/user");
const Post = require("../models/post");
const userRouter = express.Router();
const bcryptjs = require("bcryptjs");
const lodash = require("lodash");

userRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({ ...user._doc, token: req.token });
});

userRouter.get("/user-by-id", auth, async (req, res) => {
    const user = await User.findById(req.query.userId);
    res.json(user);
});

userRouter.get("/search/:name", async (req, res) => {
    try {
        const users = await User.find({
            name: { $regex: req.params.name, $options: "i" },
        });

        res.json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.post("/follow-user", auth, async (req, res) => {
    try {
        const { userId } = req.body;

        let my = await User.findById(req.user);
        let user = await User.findById(userId);

        const friend = my.following.find(o => o === userId);

        if (friend) {
            my.following = lodash.filter(my.following, x => x !== user.id);
            user.followers = lodash.filter(user.followers, x => x !== req.user);
        } else {
            my.following.push(userId);
            user.followers.push(req.user);
        }

        user = await user.save();
        my = await my.save();
        res.json(my);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.get("/get-user-posts", auth, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user });
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.get("/get-user-posts-by-id", auth, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.query.userId });
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.post("/update-user-info", auth, async (req, res) => {
    try {
        const { name, bio, email, address, phone, photo, backgroundImage } = req.body;

        let user = await User.findById(req.user);

        user.name = name,
            user.bio = bio,
            user.email = email,
            user.address = address,
            user.phone = phone,
            user.photo = photo,
            user.backgroundImage = backgroundImage,

            user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

userRouter.put("/private", auth, async (req, res) => {

    let user = await User.findById(req.user);
    if (user.private == false) {
        user.private = true;
    } else {
        user.private = false;
    }

    user = await user.save();
    res.json(user);
});

userRouter.post("/change-password", auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        let user = await User.findById(req.user);

        const isMatch = await bcryptjs.compare(currentPassword, user.password);
        const hashedPassword = await bcryptjs.hash(newPassword, 8);

        if (isMatch) {
            user.password = hashedPassword;
        } else {
            return res.status(400).json({ msg: "The current password is not correct" });
        }

        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = userRouter;

