const Post = require('../models/post');
const Story = require('../models/story');
const { User } = require('../models/user');
const sendNotification = require('../controller/push_notification');
const { POST_CHANGE , STORY_CHANGE } = require('../actions/whach');

const createChangeStream = (userIdToTrack) => {
    console.log('jjjjjjjjjjjjjjjjjjj');
    console.log(userIdToTrack);
    // Create a change stream for posts
    const postChangeStream = Post.watch(
        [
            {
                $match: {
                    "fullDocument.userId": userIdToTrack,
                    $or: [
                        { "updateDescription.updatedFields.comments": { $exists: true } },
                        { "updateDescription.updatedFields.likes": { $exists: true } },
                    ],
                },
            },
        ],
        { fullDocument: "updateLookup" }
    );

    postChangeStream.on("change", async (change) => {
        try {
            await POST_CHANGE(change);
        } catch (error) {
            console.error('Error Is User Online:', error.message);
        }
        // console.log('ddddddddddddddddddddddd');
        // const updatedPost = change.fullDocument;
        // const postId = updatedPost._id;
        // console.log("Updated post:", updatedPost);

        // const user = await User.findById(userIdToTrack);
        // const fcmToken = user.fcmToken;

        // if (change.updateDescription.updatedFields && ("comments" in change.updateDescription.updatedFields)) {
        //     // Handle comment-related changes for posts
        //     console.log("New comment added to post:", updatedPost.comments);
        //     sendNotification(userIdToTrack, updatedPost.comments.last.userId,postId, fcmToken, "", "post");
        // }

        // if (change.updateDescription.updatedFields && ("likes" in change.updateDescription.updatedFields)) {
        //     // Handle like-related changes for posts
        //     console.log("New like added to post:", updatedPost.likes);
        //     sendNotification(userIdToTrack, updatedPost.likes.last, postId, fcmToken, "", "post");
        // }
    });

    // Create a change stream for stories
    const storyChangeStream = Story.watch(
        [
            {
                $match: {
                    "fullDocument.userId": userIdToTrack,
                    $or: [
                        { "updateDescription.updatedFields.comments": { $exists: true } },
                        { "updateDescription.updatedFields.likes": { $exists: true } },
                    ],
                },
            },
        ],
        { fullDocument: "updateLookup" }
    );

    storyChangeStream.on("change", async (change) => {
        try {
            await STORY_CHANGE(change);
        } catch (error) {
            console.error('Error Is User Online:', error.message);
        }
        // const updatedStory = change.fullDocument;
        // const storyId = updatedStory._id;
        // console.log("Updated story:", updatedStory);

        // const user = await User.findById(userIdToTrack);
        // const fcmToken = user.fcmToken;

        // if (change.updateDescription.updatedFields.comments) {
        //     // Handle comment-related changes for stories
        //     console.log("New comment added to story:", updatedStory.comments);
        //     sendNotification(userIdToTrack, storyId, fcmToken, "", "story");
        // }

        // if (change.updateDescription.updatedFields.likes) {
        //     // Handle like-related changes for stories
        //     console.log("New like added to story:", updatedStory.likes);
        //     sendNotification(userIdToTrack, storyId, fcmToken, "", "story");
        // }
    });

    return { postChangeStream, storyChangeStream };
};

module.exports = createChangeStream;
