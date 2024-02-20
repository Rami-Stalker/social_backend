
const Post = require('../models/post');
const Story = require('../models/story');
const { User } = require('../models/user');
const Comment = require("../models/comment");
const Chat = require("../models/chat");
const sendNotification = require('../controllers/push_notification');
const lodash = require('lodash');

module.exports = {
    IS_USER_ONLINE: async data => {
        const userId = data['user-id'];
        const isUserOnline = data['is-user-online'];

        let user = await User.findById(userId);

        user.isOnline = isUserOnline;

        user = await user.save();

        return user.isOnline;
    },

    GET_ALL_NOTIFICATIONS: async data => {
        const userId = data['user-id'];

        const notificationChangeStream = Notification.watch(
            {
                $match: {
                    "fullDocument.userId": userId,
                },
            },
            { fullDocument: "updateLookup" }
        );

        let updatedPost = [];

        notificationChangeStream.on("change", async (change) => {
            updatedPost = change.fullDocument;
        });

        return updatedPost;
    },


    // Post

    GET_ALL_POSTS: async data => {
        const userId = data['user-id'];

        const user = await User.findById(userId);

        let allPostsList = [];

        const userPosts = await Post.find({ userId: userId });

        if (userPosts) {
            for (let i = 0; i < userPosts.length; i++) {
                allPostsList.push(userPosts[i]);
            }
        }

        for (let i = 0; i < user.following.length; i++) {
            let userPost = await Post.find({ userId: user.following[i] });
            for (let j = 0; j < userPost.length; j++) {
                allPostsList.push(userPost[j]);
            }
        }

        allPostsList.sort((a, b) => b.createdAt - a.createdAt).reverse();

        return allPostsList;
    },

    LIKE_POST: async data => {
        const postId = data['post-id'];
        const userId = data['user-id'];
        let post = await Post.findById(postId);
        const isLike = post.likes.find(o => o === userId);
        if (isLike) {
            post.likes = lodash.filter(post.likes, x => x !== userId);
        } else {
            post.likes.push(userId);
        }
        post = await post.save();
        return post.likes;
    },

    
    COMMENT_POST: async data => {
        const postId = data['post-id'];
        const userId = data['user-id'];
        const userName = data['user-name'];
        const userAvatarUrl = data['user-avatar-url'];
        const commentText = data['comment-text'];

        let comment = new Comment({
            userId,
            userName,
            userAvatarUrl,
            commentText,
        });
        comment = await comment.save();

        let post = await Post.findById(postId);
            post.comments.push(comment);
            post = await post.save();

        return comment;
    },

    COMMENT_LIKE_POST: async data => {
        const postId = data['post-id'];
        const userId = data['user-id'];
        const commentId = data['comment-id'];

        let post = await Post.findById(postId);
            const comment = post.comments.find(o => o.id === commentId);
            const isLike = comment.likes.find(o => o === userId);
            if (isLike) {
                comment.likes = lodash.filter(comment.Likes, x => x !== userId);
            } else {
                comment.likes.push(userId);
            }
            post = await post.save();

        return comment.likes;
    },

    SHARE_POST: async data => {
        const postId = data['post-id'];
        const userId = data['user-id'];

        let post = await Post.findById(postId);

        const isShare = post.shares.find(o => o === userId);

        if (!isShare) {
            post.shares.push(
                userId
            );
            post = await post.save();
        }

        return post.shares;
    },


    // Story

    LIKE_STORY: async data => {
        const storyId = data['story-id'];
        const userId = data['user-id'];
        let story = await Story.findById(storyId);
        const isLike = story.likes.find(o => o === userId);
        if (isLike) {
            story.likes = lodash.filter(story.likes, x => x !== userId);
        } else {
            story.likes.push(userId);
        }
        story = await story.save();
        return story.likes;
    },


    COMMENT_STORY: async data => {
        const storyId = data['story-id'];
        const userId = data['user-id'];
        const userName = data['user-name'];
        const userAvatarUrl = data['user-avatar-url'];
        const commentText = data['comment-text'];

        let comment = new Comment({
            userId,
            userName,
            userAvatarUrl,
            commentText,
        });
        comment = await comment.save();

        let story = await Story.findById(storyId);
            story.comments.push(comment);
            story = await story.save();

        return comment;
    },

    COMMENT_LIKE_STORY: async data => {
        const storyId = data['story-id'];
        const userId = data['user-id'];
        const commentId = data['comment-id'];

        let story = await Story.findById(storyId);
            const comment = story.comments.find(o => o.id === commentId);
            const isLike = comment.likes.find(o => o === userId);
            if (isLike) {
                comment.likes = lodash.filter(comment.Likes, x => x !== userId);
            } else {
                comment.likes.push(userId);
            }
            story = await story.save();

        return comment.likes;
    },

    SHARE_STORY: async data => {
        const storyId = data['story-id'];
        const userId = data['user-id'];

        let story = await Story.findById(storyId);

        const isShare = story.shares.find(o => o === userId);

        if (!isShare) {
            story.shares.push(
                userId
            );
            story = await story.save();
        }

        return story.shares;
    },


    // User

    UPDATE_AVATAR: async data => {
        const userId = data['user-id'];
        const photo = data['avatar'];
        const isPhoto = data['is-photo'];

        let user = await User.findById(userId);

        if (isPhoto) {
            user.photo = photo;
        } else {
            user.backgroundImage = photo;
        }

        user = await user.save();

        console.log(user.photo);

        return user;
    },

    UPDATE_USER_INFO: async data => {
        const userId = data['id'];
        const name = data['name'];
        const bio = data['bio'];
        const email = data['email'];
        const address = data['address'];
        const phone = data['phone'];
        const photo = data['photo'];
        const backgroundImage = data['backgroundImage'];

        let user = await User.findById(userId);

        user.name = name,
            user.bio = bio,
            user.email = email,
            user.address = address,
            user.phone = phone,
            user.photo = photo,
            user.backgroundImage = backgroundImage,

            user = await user.save();

        return user;
    },

    FOLLOW_USER: async data => {
        const myId = data['my-id'];
        const userId = data['user-id'];

        console.log('follow');
        console.log(myId);
        console.log(userId);

        let me = await User.findById(myId);
        let user = await User.findById(userId);

        me.following.push(userId);
        user.followers.push(myId);

        me = await me.save();
        user = await user.save();

        console.log('follow done');

        return me;
    },

    UNFOLLOW_USER: async data => {
        const myId = data['my-id'];
        const userId = data['user-id'];

        console.log('unfollow');
        console.log(myId);
        console.log(userId);

        let me = await User.findById(myId);
        let user = await User.findById(userId);

        me.following = lodash.filter(me.following, x => x !== userId);
        user.followers = lodash.filter(user.followers, x => x !== myId);

        me = await me.save();
        user = await user.save();

        console.log('unfollow done');

        return me;
    },

    REMOVE_USER: async data => {
        const myId = data['my-id'];
        const userId = data['user-id'];

        console.log('remove');
        console.log(myId);
        console.log(userId);

        let me = await User.findById(myId);
        let user = await User.findById(userId);

        me.followers = lodash.filter(me.followers, x => x !== userId);
        user.following = lodash.filter(user.following, x => x !== myId);

        me = await me.save();
        user = await user.save();

        console.log('remove done');

        return me;
    },


    // Chat

    ADD_MESSAGE: async data => {
        const messagee = data['message'];

        const senderId = messagee.senderId;
        const recieverId = messagee.recieverId;
        const msg = messagee.msg;
        const repliedMsg = messagee.repliedMsg;

        let senderChat = await Chat.findOne({ userId: senderId });
        let recieverChat = await Chat.findOne({ userId: recieverId });

        const senderData = await User.findById(senderId);
        const recieverData = await User.findById(recieverId);

        const message = {
            senderId,
            msg,
            repliedMsg,
        };

        function contact(userId, userData) {
            return {
                recieverId: userId,
                lastMessage: message,
                recieverData: userData,
                messages: [message],
            };
        }

        let senderContactt;

        if (!senderChat) {
            let userChat = new Chat({
                userId: senderId,
                contacts: [contact(recieverId, recieverData)],
            });
            userChat = await userChat.save();
        } else {
            const recieverContact = senderChat.contacts.find(o => o.recieverId === recieverId);
            if (!recieverContact) {
                senderChat.contacts.push(contact(recieverId, recieverData));
            } else {
                recieverContact.lastMessage = message;
                recieverContact.recieverData = recieverData;
                recieverContact.messages.push(message);
            }
            senderChat = await senderChat.save();
        }

        if (!recieverChat) {
            let userChat = new Chat({
                userId: recieverId,
                contacts: [contact(senderId, senderData)],
            });
            userChat = await userChat.save();
            senderContactt = userChat.contacts.find(o => o.recieverId === senderId);
        } else {
            const senderContact = recieverChat.contacts.find(o => o.recieverId === senderId);
            if (!senderContact) {
                recieverChat.contacts.push(contact(senderId, senderData));
            } else {
                senderContact.lastMessage = message;
                senderContact.recieverData = senderData;
                senderContact.messages.push(message);
            }
            recieverChat = await recieverChat.save();
            senderContactt = senderContact;
        }

        try {
            sendNotification(recieverId, recieverId, recieverData.fcmToken, senderData.name, "message");
        } catch (error) {
            console.log("Error In Push Notification" + error);
        }

        return senderContactt;
    },

    IS_MESSAGE_SEEN: async data => {

        const senderId = data['sender-id'];
        const recieverId = data['reciever-id'];

        let senderChat = await Chat.findOne({ userId: senderId });
        let recieverChat = await Chat.findOne({ userId: recieverId });

        const senderContact = senderChat.contacts.find(o => o.recieverId === recieverId);
        const recieverContact = recieverChat.contacts.find(o => o.recieverId === senderId);

        if (senderContact) {
            for (let i = 0; i < senderContact.messages.length; i++) {
                if (senderContact.messages[i].senderId == senderId && senderContact.messages[i].isSeen == false) {
                    senderContact.messages[i].isSeen = true;
                }
            }
        }

        if (recieverContact) {
            for (let i = 0; i < recieverContact.messages.length; i++) {
                if (recieverContact.messages[i].senderId == senderId && recieverContact.messages[i].isSeen == false) {
                    recieverContact.messages[i].isSeen = true;
                }
            }
        }

        senderChat = await senderChat.save();
        recieverChat = await recieverChat.save();
    },
};