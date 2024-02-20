const { User } = require('../models/user');
const sendNotification = require('../controllers/push_notification');

module.exports = {
    POST_CHANGE: async change => {
        const updatedPost = change.fullDocument;
        const postId = updatedPost._id.toString();
        
        const user = await User.findById("652ac4045f43862232aa930b");
        const fcmToken = user.fcmToken;

        if (change.updateDescription.updatedFields && ("comments" in change.updateDescription.updatedFields)) {
            console.log("New comment added to post:", updatedPost.comments);
            const lastElement = updatedPost.comments[updatedPost.comments.length - 1];
            sendNotification("652ac4045f43862232aa930b", lastElement.userId, postId, fcmToken, "", "post");
        }

        if (change.updateDescription.updatedFields && ("likes" in change.updateDescription.updatedFields)) {
            console.log("New like added to post:", updatedPost.likes);
            const lastElement = updatedPost.likes[updatedPost.likes.length - 1];
            console.log('ooooooooooooooooo');
            console.log(lastElement);
            sendNotification("652ac4045f43862232aa930b", lastElement, postId, fcmToken, "", "post");
        }
    },

    STORY_CHANGE: async change => {
        const updatedStory = change.fullDocument;
        const storyId = updatedStory._id;
        console.log("Updated story:", updatedStory);

        const user = await User.findById("652ac4045f43862232aa930b");
        const fcmToken = user.fcmToken;

        if (change.updateDescription.updatedFields.comments) {
            console.log("New comment added to story:", updatedStory.comments);
            sendNotification("652ac4045f43862232aa930b", storyId, fcmToken, "", "story");
        }

        if (change.updateDescription.updatedFields.likes) {
            console.log("New like added to story:", updatedStory.likes);
            sendNotification("652ac4045f43862232aa930b", storyId, fcmToken, "", "story");
        }
    },
};