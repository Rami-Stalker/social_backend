
const Post = require('../models/post');
const Comment = require('../models/comment');
const lodash = require('lodash');

module.exports = {
    CHANGE_LIKE_STATUS: async data => {
        const postId = data['postId'];
        const userId = data['userId'];
        let post = await Post.findById(postId);
        const meLike = post.likes.find(o => o === userId);
        if (meLike) {
            post.likes = lodash.filter(post.likes, x => x !== userId);
        } else {
            post.likes.push(userId);
        }
        post = await post.save();
        return post;
    },

    ADD_COMMENT_POST: async data => {
        const postId = data['postId'];
        const userId = data['userId'];
        const comment = data['comment'];

        const newComment = ({
            userId: userId,
            comment: comment,
            time: new Date().getTime(),
        });

        let post = await Post.findById(postId);
        post.comments.push(
            newComment
        );
        post = await post.save();

        return post.comments;
    },

    ADD_LIKE_COMMENT_POST: async data => {
        const postId = data['postId'];
        const userId = data['userId'];
        const commentId = data['commentId'];

        let post = await Post.findById(postId);

        const comment = post.comments.find(o => o.id === commentId);

        const meLike = comment.likes.find(o => o === userId);

        if (meLike) {
            comment.likes = lodash.filter(comment.Likes, x => x !== userId);
        }else{
            comment.likes.push(userId);
        }

        post = await post.save();

        return post.comments.find(o => o.id === commentId);
    },
};