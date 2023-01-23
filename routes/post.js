const express = require("express");
const lodash = require("lodash");
const auth = require("../middlewares/auth");

const Post = require("../models/post");
const { User } = require("../models/user");
const postRouter = express.Router();

// get all posts
postRouter.get("/post/", async (req, res) => {
    try {
        const posts = await Post.find({});
        res.json(posts);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// add post
postRouter.post("/post/add-post", auth, async (req, res) => {
    try {
        const { postsUrl, postsType, description } = req.body;

        const user = await User.findById(req.user);

        let posts = [];

        for (let i = 0; i < postsUrl.length; i++) {
            posts.push({ post: postsUrl[i], type: postsType[i] });
        }


        let post = new Post({
            userData: user,
            description,
            time: new Date().getTime(),
            posts,
        });
        post = await post.save();

        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// update post
postRouter.post("/post/update-post", async (req, res) => {
    try {
        const { id, description, postUrl } = req.body;
        let post = await Post.findById(id);
        post.description = description,
            post.postUrl = postUrl,
            post = await post.save();
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// delete post
postRouter.post("/post/delete-post", async (req, res) => {
    try {
        const { id } = req.body;
        let post = await Post.findByIdAndDelete(id);
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// like post
postRouter.post("/post/add-like", auth, async (req, res) => {
    try {
        const { postId, isAdd } = req.body;
        
        const user = await User.findById(req.user);
        let post = await Post.findById(postId);

        if (isAdd == 1) {
            post.likes.push(user);
        }else{
            post.likes = lodash.filter(post.likes, x => x.email !== user.email);
        }

        post = await post.save();
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// post comment
postRouter.post("/post/add-comment", auth, async (req, res) => {
    try {
        const { postId, comment, } = req.body;

        let post = await Post.findById(postId);
        const user = await User.findById(req.user);
        
        post.comments.push({
            userData: user,
            comment,
            time: new Date().getTime(),
        });

        post = await post.save();

        res.json(post);

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// get comment
postRouter.get("/post/get-comment", async (req, res) => {
    try {
        const post = await Post.findById(req.query.postId);
        res.json(post.comments);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// like comment
postRouter.post("/post/like-comment", auth, async (req, res) => {
    try {
        const { postId, commentId, isAdd } = req.body;
        
        const user = await User.findById(req.user);
        let post = await Post.findById(postId);

        const comment = post.comments.find(o => o.id === commentId);

        if (isAdd == 1) {
            comment.likes.push(user);
        }else{
            comment.likes = lodash.filter(comment.Likes, x => x.id !== user.id);
        }

        post = await post.save();
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = postRouter;