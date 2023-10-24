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

        let allPostList = [];

        const myPost = await Post.find({ userId: req.user });
        
        if (myPost) {
            for (let i = 0; i < myPost.length; i++) {
                allPostList.push(myPost[i]);
            }
        }

        for (let i = 0; i < user.following.length; i++) {
            let userPost = await Post.find({userId: user.following[i]});
            for (let j = 0; j < userPost.length; j++) {
                allPostList.push(userPost[j]);
            }
        }

        allPostList.sort((a, b) => b.time - a.time).reverse();
        

        res.json(allPostList);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// add post
postRouter.post("/add-post", auth, async (req, res) => {
    try {
        const { postsUrl, postsType, description } = req.body;
        const user = await User.findById(req.user);

        let posts = [];

        for (let i = 0; i < postsUrl.length; i++) {
            posts.push({ post: postsUrl[i], type: postsType[i] });
        }

        let post = new Post({
            userData: user,
            userId: req.user,
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

// like post
postRouter.post("/add-like", auth, async (req, res) => {
    try {
        const { postId } = req.body;
        
        let post = await Post.findById(postId);

        const meLike = post.likes.find(o => o === req.user);

        if (meLike) {
            post.likes = lodash.filter(post.likes, x => x !== req.user);
        }else{
            post.likes.push(req.user);
        }

        post = await post.save();
        res.json(post);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// post comment
postRouter.post("/add-comment", auth, async (req, res) => {
    try {
        const { postId, comment } = req.body;

        let post = await Post.findById(postId);
        
        post.comments.push({
            userId: req.user,
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
postRouter.get("/get-comment", async (req, res) => {
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

module.exports = postRouter;