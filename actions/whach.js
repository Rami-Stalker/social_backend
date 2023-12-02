const { User } = require('../models/user');
const sendNotification = require('../controller/push_notification');

module.exports = {
    POST_CHANGE: async change => {
        const updatedPost = change.fullDocument;
        const postId = updatedPost._id;
        console.log("Updated post:", updatedPost);

        const user = await User.findById(userIdToTrack);
        const fcmToken = user.fcmToken;

        if (change.updateDescription.updatedFields && ("comments" in change.updateDescription.updatedFields)) {
            console.log("New comment added to post:", updatedPost.comments);
            sendNotification(userIdToTrack, updatedPost.comments.last.userId, postId, fcmToken, "", "post");
        }

        if (change.updateDescription.updatedFields && ("likes" in change.updateDescription.updatedFields)) {
            console.log("New like added to post:", updatedPost.likes);
            sendNotification(userIdToTrack, updatedPost.likes.last, postId, fcmToken, "", "post");
        }
    },

    STORY_CHANGE: async change => {
        const updatedStory = change.fullDocument;
        const storyId = updatedStory._id;
        console.log("Updated story:", updatedStory);

        const user = await User.findById(userIdToTrack);
        const fcmToken = user.fcmToken;

        if (change.updateDescription.updatedFields.comments) {
            console.log("New comment added to story:", updatedStory.comments);
            sendNotification(userIdToTrack, storyId, fcmToken, "", "story");
        }

        if (change.updateDescription.updatedFields.likes) {
            console.log("New like added to story:", updatedStory.likes);
            sendNotification(userIdToTrack, storyId, fcmToken, "", "story");
        }
    },
};