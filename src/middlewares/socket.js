// Assuming that ADD_PRODUCT is a function to add a new product
const { IS_USER_ONLINE, GET_ALL_NOTIFICATIONS, GET_ALL_POSTS, LIKE_POST, COMMENT_POST, COMMENT_LIKE_POST, SHARE_POST,  LIKE_STORY, COMMENT_STORY, COMMENT_LIKE_STORY, SHARE_STORY,  UPDATE_AVATAR, UPDATE_USER_INFO, FOLLOW_USER, UNFOLLOW_USER, REMOVE_USER, ADD_MESSAGE, IS_MESSAGE_SEEN } = require('../actions/socketio');

const socketIOEvents = (io) => {
    const userSocketMap = new Map();
    io.on('connection', (socket) => {
        console.log('A user connected');

        // // Device
        // socket.on('sned-fcm-token-css', async (data) => {
        //     try {
        //         console.log('dddddddddddddddddddddd');
        //     await DEVICE(data);
        //     } catch (error) {
        //         console.error('Error Get All Posts:', error.message);
        //         socket.emit('get-all-posts-error', { error: error.message });
        //     }
        // });

        socket.on('is-user-online', async (data) => {
            try {
                const isUserOnline = await IS_USER_ONLINE(data);
                socket.emit('ised-user-online', isUserOnline);
            } catch (error) {
                console.error('Error Is User Online:', error.message);
                socket.emit('is-user-online-error', { error: error.message });
            }
        });

        // Notification
        socket.on('get-all-notifications', async (data) => {
            try {
                const getAllNotifications = await GET_ALL_NOTIFICATIONS(data);
                console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeee');
                console.log(getAllNotifications);
                socket.emit('gone-all-notifications', getAllNotifications);
            } catch (error) {
                console.error('Error Get All notifications:', error.message);
                socket.emit('get-all-notifications-error', { error: error.message });
            }
        });


        // Post

        // Get All Posts
        socket.on('get-all-posts', async (data) => {
            try {
                const getAllPost = await GET_ALL_POSTS(data);
                socket.emit('gone-all-posts', getAllPost);
            } catch (error) {
                console.error('Error Get All Posts:', error.message);
                socket.emit('get-all-posts-error', { error: error.message });
            }
        });

        // Post Like
        socket.on('like-post', async (data) => {
            try {
                const likePost = await LIKE_POST(data);
                socket.emit('liked-post', likePost);
            } catch (error) {
                console.error('Error Like Post:', error.message);
                socket.emit('like-post-error', { error: error.message });
            }
        });

        // Post Comment
        socket.on('comment-post', async (data) => {
            try {
                const commentPost = await COMMENT_POST(data);
                socket.emit('commented-post', commentPost);
            } catch (error) {
                console.error('Error Comment Post:', error.message);
                socket.emit('comment-post-error', { error: error.message });
            }
        });

        // Post Comment Like
        socket.on('comment-like-post', async (data) => {
            try {
                const commentLikePost = await COMMENT_LIKE_POST(data);
                socket.emit('commented-like-post', commentLikePost);
            } catch (error) {
                console.error('Error Change Like Comment Post:', error.message);
                socket.emit('comment-like-post-error', { error: error.message });
            }
        });

        // Share Post
        socket.on('share-post', async (data) => {
            try {
                const sharePost = await SHARE_POST(data);
                socket.emit('shared-post', sharePost);
            } catch (error) {
                console.error('Error Add Share Post:', error.message);
                socket.emit('share-post-error', { error: error.message });
            }
        });

        
        // Story

        // Story Like
        socket.on('like-story', async (data) => {
            try {
                const likeStory = await LIKE_STORY(data);
                socket.emit('liked-story', likeStory);
            } catch (error) {
                console.error('Error Like Story:', error.message);
                socket.emit('like-story-error', { error: error.message });
            }
        });

        // Story Comment
        socket.on('comment-story', async (data) => {
            try {
                const commentStory = await COMMENT_STORY(data);
                socket.emit('commented-story', commentStory);
            } catch (error) {
                console.error('Error Comment Story:', error.message);
                socket.emit('comment-story-error', { error: error.message });
            }
        });

        // Story Comment Like
        socket.on('comment-like-story', async (data) => {
            try {
                const commentLikeStory = await COMMENT_LIKE_STORY(data);
                socket.emit('commented-like-story', commentLikeStory);
            } catch (error) {
                console.error('Comment Like Story Error:', error.message);
                socket.emit('comment-like-story-error', { error: error.message });
            }
        });

        // Story Share
        socket.on('share-story', async (data) => {
            try {
                const sharestory = await SHARE_STORY(data);
                socket.emit('shared-story', sharestory);
            } catch (error) {
                console.error('Share Story Error:', error.message);
                socket.emit('share-story-error', { error: error.message });
            }
        });


        // User

        // User Update Avatar
        socket.on('update-avatar', async (data) => {
            try {
                const updateUserInfo = await UPDATE_AVATAR(data);
                socket.emit('updated-avatar', updateUserInfo);
            } catch (error) {
                console.error('Esrror Udpate User Info:', error.message);
                socket.emit('update-avatar-error', { error: error.message });
            }
        });

        // User Update Info
        socket.on('update-user-info', async (data) => {
            try {
                const updateUserInfo = await UPDATE_USER_INFO(data);
                socket.emit('updated-user-info', updateUserInfo);
            } catch (error) {
                console.error('Error Udpate User Info:', error.message);
                socket.emit('update-user-info-error', { error: error.message });
            }
        });

        // Follow User
        socket.on('follow-user', async (data) => {
            try {
                const followUser = await FOLLOW_USER(data);
                socket.emit('followed-user', followUser);
            } catch (error) {
                console.error('Error Follow User:', error.message);
                socket.emit('follow-user-error', { error: error.message });
            }
        });

        // Unfollow User
        socket.on('unfollow-user', async (data) => {
            try {
                const unFollowUser = await UNFOLLOW_USER(data);
                socket.emit('unfollowed-user', unFollowUser);
            } catch (error) {
                console.error('Error unFollow User:', error.message);
                socket.emit('unfollow-user-error', { error: error.message });
            }
        });

        // Remove User
        socket.on('remove-user', async (data) => {
            try {
                const removeUser = await REMOVE_USER(data);
                socket.emit('removed-user', removeUser);
            } catch (error) {
                console.error('Error remove User:', error.message);
                socket.emit('remove-user-error', { error: error.message });
            }
        });


        // Chat

        // Chat Rooms
        socket.on('join-room-chat', (room) => {
            socket.join(room['idConversation']);
        });

        function findTargetSocketId(userId) {
            return userSocketMap.get(userId);
        }

        socket.on('signin', (userId) => {
            console.log(`User ${userId} signed in with socket ID ${socket.id}`);
            userSocketMap.set(userId, socket.id);
        });

        // Chat Add Message
        socket.on('add-message', async (data) => {
            try {
                // const room = data['idConversation'];
                const addMessage = await ADD_MESSAGE(data);
                console.log(addMessage);
                // const targetSenderSocketId = findTargetSocketId(data['message'].senderId);
                const targetRecieverSocketId = findTargetSocketId(data['message'].recieverId);
                // io.to(targetSenderSocketId).emit('added-message', addMessage['sender-contacts']);
                io.to(targetRecieverSocketId).emit('added-message', addMessage);
            } catch (error) {
                console.err('Error Add Message:', error.message);
                socket.emit('add-message-error', { error: error.message });
            }
        });

        // Chat Is Message Seen
        socket.on('is-message-seen', async (data) => {
            try {
                const messageSeen = await IS_MESSAGE_SEEN(data);
                const targetSenderSocketId = findTargetSocketId(data['sender-id']);
                io.to(targetSenderSocketId).emit('ised-message-seen', data['reciever-id']);
            } catch (error) {
                console.error('Error Is Message Seen:', error.message);
                socket.emit('is-message-seen-error', { error: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
            userSocketMap.forEach((value, key) => {
                if (value === socket.id) {
                    userSocketMap.delete(key);
                }
            });
        });
    });
};

module.exports = socketIOEvents;