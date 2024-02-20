const express = require("express");
const lodash = require("lodash");
const auth = require("../middlewares/auth");

const Post = require("../models/post");
const { User } = require("../models/user");
const postRouter = express.Router();

// get all posts
postRouter.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user);

        let allPosts = [];

        const userPosts = await Post.find({ userId: req.user });

        if (userPosts) {
            for (let i = 0; i < userPosts.length; i++) {
                allPosts.push(userPosts[i]);
            }
        }

        for (let i = 0; i < user.following.length; i++) {
            let followingPosts = await Post.find({userId: user.following[i]});
            for (let j = 0; j < followingPosts.length; j++) {
                allPosts.push(followingPosts[j]);
            }
        }

        allPosts.sort((a, b) => b.createdAt - a.createdAt).reverse();
        
        res.json(allPosts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// add post
postRouter.post("/add-post", auth, async (req, res) => {
    try {
    const { imageUrls, videoUrls, postText } = req.body;

    const user = await User.findById(req.user);

    let post = new Post({
        userId: req.user,
        userName: user.name,
        userAvatarUrl: user.userAvatarUrl,
        postText,
        imageUrls,
        videoUrls,
    });
    post = await post.save();

    res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get post comments
postRouter.get("/get-post-comments", async (req, res) => {
    try {
        const post = await Post.findById(req.query.postId);
        res.json(post.comments);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// like comment
postRouter.post("/like-comment", auth, async (req, res) => {
    try {
        const { postId, commentId } = req.body;
        
        let post = await Post.findById(postId);

        const comment = post.comments.find(o => o.id === commentId);

        const meLike = comment.likes.find(o => o === req.user);

        if (meLike) {
            comment.likes = lodash.filter(comment.Likes, x => x !== req.user);
        }else{
            comment.likes.push(req.user);
        }

        post = await post.save();
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// update post
postRouter.post("/update-post", async (req, res) => {
    try {
        const { postId, desc } = req.body;
        let post = await Post.findById(postId);
            post.description = desc,
            post = await post.save();
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// delete post
postRouter.post("/delete-post", async (req, res) => {
    try {
        const { postId } = req.body;
        let post = await Post.findByIdAndDelete(postId);
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = postRouter;