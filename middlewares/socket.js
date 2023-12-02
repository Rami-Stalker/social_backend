// Assuming that ADD_PRODUCT is a function to add a new product
const { IS_USER_ONLINE, GET_ALL_NOTIFICATIONS, GET_ALL_POSTS, CHANGE_LIKE_POST, ADD_COMMENT_POST, CHANGE_LIKE_COMMENT_POST, ADD_SHARE_POST, CHANGE_FRIEND_CASE_USER, ADD_MESSAGE, IS_MESSAGE_SEEN } = require('../actions/socketio');

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
        socket.on('get-all-posts', async (data) => {
            try {
                const getAllPost = await GET_ALL_POSTS(data);
                socket.emit('gone-all-posts', getAllPost);
            } catch (error) {
                console.error('Error Get All Posts:', error.message);
                socket.emit('get-all-posts-error', { error: error.message });
            }
        });

        socket.on('change-like-post', async (data) => {
            try {
                const likePost = await CHANGE_LIKE_POST(data);
                socket.emit('changed-like-post', likePost);
            } catch (error) {
                console.error('Error Change Like Post:', error.message);
                socket.emit('change-like-post-error', { error: error.message });
            }
        });

        socket.on('add-comment-post', async (data) => {
            try {
                const addCommentPost = await ADD_COMMENT_POST(data);
                socket.emit('added-comment-post', addCommentPost);
            } catch (error) {
                console.error('Error Add Comment Post:', error.message);
                socket.emit('add-comment-post-error', { error: error.message });
            }
        });


        socket.on('change-like-comment-post', async (data) => {
            try {
                const changeLikeCommentPost = await CHANGE_LIKE_COMMENT_POST(data);
                socket.emit('changed-like-comment-post', changeLikeCommentPost);
            } catch (error) {
                console.error('Error Change Like Comment Post:', error.message);
                socket.emit('change-like-comment-post-error', { error: error.message });
            }
        });

        socket.on('add-share-post', async (data) => {
            try {
                const sharePost = await ADD_SHARE_POST(data);
                socket.emit('added-share-post', sharePost);
            } catch (error) {
                console.error('Error Add Share Post:', error.message);
                socket.emit('add-share-post-error', { error: error.message });
            }
        });

        // User
        socket.on('change-friend-case-user', async (data) => {
            try {
                const changeFriendCaseUser = await CHANGE_FRIEND_CASE_USER(data);
                socket.emit('changed-friend-case-user', changeFriendCaseUser);
            } catch (error) {
                console.error('Error Change Friend Case User:', error.message);
                socket.emit('change-friend-case-user-error', { error: error.message });
            }
        });

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

        // Chat
        socket.on('add-message', async (data) => {
            try {
                // const room = data['idConversation'];
                const addMessage = await ADD_MESSAGE(data);
                const targetSenderSocketId = findTargetSocketId(data['message'].senderId);
                const targetRecieverSocketId = findTargetSocketId(data['message'].recieverId);
                io.to(targetSenderSocketId).emit('added-message', addMessage['sender-content']);
                io.to(targetRecieverSocketId).emit('added-message', addMessage['reciever-content']);
            } catch (error) {
                console.error('Error Add Message:', error.message);
                socket.emit('add-message-error', { error: error.message });
            }
        });

        // Is Message Seen
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