// Assuming that ADD_PRODUCT is a function to add a new product
const { CHANGE_LIKE_STATUS , COUNT_LIKES_POST , ADD_COMMENT_POST , ADD_LIKE_COMMENT_POST } = require('../actions/socketio');

const socketIOEvents = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('change-like-status', async (data) => {
            try {
                const likeStatus = await CHANGE_LIKE_STATUS(data);
                socket.emit('changed-like-status', likeStatus);
            } catch (error) {
                console.error('Error adding product:', error.message);
                socket.emit('change-like-status-error', { error: error.message });
            }
        });

        socket.on('add-comment-post', async (data) => {
            try {
                const addCommentPost = await ADD_COMMENT_POST(data);
                socket.emit('added-comment-post', addCommentPost);
            } catch (error) {
                console.error('Error adding product:', error.message);
                socket.emit('add-comment-post-error', { error: error.message });
            }
        });

        socket.on('add-like-comment-post', async (data) => {
            try {
                const addLikeCommentPost = await ADD_LIKE_COMMENT_POST(data);
                socket.emit('added-like-comment-post', addLikeCommentPost);
            } catch (error) {
                console.error('Error adding product:', error.message);
                socket.emit('add-like-comment-post-error', { error: error.message });
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

module.exports = socketIOEvents;