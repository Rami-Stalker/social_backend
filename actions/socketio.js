
const Post = require('../models/post');
const { User } = require('../models/user');
const lodash = require('lodash');
const Chat = require("../models/chat");
const sendNotification = require('../controller/push_notification');

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
            console.log('ddddddddddddddddddddddd');
            updatedPost = change.fullDocument;
            console.log("Updated notification:", updatedPost);
        });

        return updatedPost;
    },

    GET_ALL_POSTS: async data => {
        const userId = data['user-id'];

        const user = await User.findById(userId);

        let allPostsList = [];

        const userPost = await Post.find({ userId: userId });

        if (userPost) {
            for (let i = 0; i < userPost.length; i++) {
                allPostsList.push(userPost[i]);
            }
        }

        for (let i = 0; i < user.friends.length; i++) {
            let userPost = await Post.find({ userId: user.friends[i] });
            for (let j = 0; j < userPost.length; j++) {
                allPostsList.push(userPost[j]);
            }
        }

        allPostsList.sort((a, b) => b.time - a.time).reverse();


        return allPostsList;
    },

    CHANGE_LIKE_POST: async data => {
        const postId = data['post-id'];
        const userId = data['user-id'];
        let post = await Post.findById(postId);
        const meLike = post.likes.find(o => o === userId);
        if (meLike) {
            post.likes = lodash.filter(post.likes, x => x !== userId);
        } else {
            post.likes.push(userId);
        }
        post = await post.save();
        return post.likes;
    },

    ADD_COMMENT_POST: async data => {
        const postId = data['post-id'];
        const userId = data['user-id'];
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

    CHANGE_LIKE_COMMENT_POST: async data => {
        const postId = data['post-id'];
        const userId = data['user-id'];
        const commentId = data['comment-id'];

        let post = await Post.findById(postId);

        const comment = post.comments.find(o => o.id === commentId);

        const meLike = comment.likes.find(o => o === userId);

        if (meLike) {
            comment.likes = lodash.filter(comment.Likes, x => x !== userId);
        } else {
            comment.likes.push(userId);
        }

        post = await post.save();

        return post.comments.find(o => o.id === commentId);
    },

    ADD_SHARE_POST: async data => {
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

    // User
    CHANGE_FRIEND_CASE_USER: async data => {
        const myId = data['my-id'];
        const userId = data['user-id'];
        const isDelete = data['is-delete'];

        let my = await User.findById(myId);
        let user = await User.findById(userId);

        const myFriendRequests = my.friendRequests.find(o => o === userId);
        const userFriendRequests = user.friendRequests.find(o => o === myId);
        const friend = my.friends.find(o => o === userId);

        if (!isDelete) {
            if (!userFriendRequests && !myFriendRequests && !friend) {
                user.friendRequests.push(myId);
            } else if (myFriendRequests && !friend) {
                my.friendRequests = lodash.filter(my.friendRequests, x => x !== userId);
                my.friends.push(userId);
                user.friends.push(myId);
            }
            else if (userFriendRequests && !friend) {
                user.friendRequests = lodash.filter(user.friendRequests, x => x !== myId);
                // user.friends.push(myId);
                // my.friends.push(userId);
            } else if (friend) {
                my.friends = lodash.filter(my.friends, x => x !== userId);
                user.friends = lodash.filter(user.friends, x => x !== myId);
            }
        } else {
            my.friendRequests = lodash.filter(my.friendRequests, x => x !== userId);
        }

        my = await my.save();
        user = await user.save();

        return my;
    },

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

        function content(recieverId) {
            return {
                recieverId,
                lastMessage: message,
                recieverData,
                messages: [message],
            };
        }

        if (!senderChat) {
            let userChat = new Chat({
                userId: senderId,
                contents: [content(recieverId)],
            });
            userChat = await userChat.save();

        } else {
            const senderContent = senderChat.contents.find(o => o.recieverId === recieverId);
            if (!senderContent) {
                senderChat.contents.push(content(recieverId));
            } else {
                senderContent.lastMessage = message;
                senderContent.recieverData = recieverData;
                senderContent.messages.push(message);
            }
            senderChat = await senderChat.save();
        }

        if (!recieverChat) {
            let userChat = new Chat({
                userId: recieverId,
                contents: [content(senderId)],
            });
            userChat = await userChat.save();
        } else {
            const recieverContent = recieverChat.contents.find(o => o.recieverId === senderId);
            if (!recieverContent) {
                recieverChat.contents.push(content(senderId));
            } else {
                recieverContent.lastMessage = message;
                recieverContent.recieverData = senderData;
                recieverContent.messages.push(message);
                // for (let i = 0; i < recieverContent.messages.length; i++) {
                //     if (recieverContent.messages[i].senderId == senderId && recieverContent.messages[i].isSeen == false) {
                //         messageNotSeen += 1;
                //     }
                // }
            }
            recieverChat = await recieverChat.save();
        }
        const contents = {
            'sender-content': senderChat.contents,
            'reciever-content': recieverChat.contents,
        }

        try {
            sendNotification(recieverId, recieverId, recieverData.fcmToken, senderData.name, "message");
        } catch (error) {
            console.log("Error In Push Notification" + error);
        }

        return contents;
    },

    IS_MESSAGE_SEEN: async data => {

        const senderId = data['sender-id'];
        const recieverId = data['reciever-id'];

        let senderChat = await Chat.findOne({ userId: senderId });
        let recieverChat = await Chat.findOne({ userId: recieverId });

        const senderContent = senderChat.contents.find(o => o.recieverId === recieverId);
        const recieverContent = recieverChat.contents.find(o => o.recieverId === senderId);

        if (senderContent) {
            for (let i = 0; i < senderContent.messages.length; i++) {
                if (senderContent.messages[i].senderId == senderId && senderContent.messages[i].isSeen == false) {
                    senderContent.messages[i].isSeen = true;
                }
            }
        }

        if (recieverContent) {
            for (let i = 0; i < recieverContent.messages.length; i++) {
                if (recieverContent.messages[i].senderId == senderId && recieverContent.messages[i].isSeen == false) {
                    recieverContent.messages[i].isSeen = true;
                }
            }
        }

        senderChat = await senderChat.save();
        recieverChat = await recieverChat.save();
    },
};