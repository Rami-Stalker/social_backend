// IMPORTS FROM PACKAGES
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require('http');
const cors = require('cors');
// IMPORTS FROM OTHER FILES
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const storyRouter = require("./routes/story");
const userRouter = require("./routes/user");
const { chatRouter, newChat } = require("./routes/chat");
const notificationRouter = require("./routes/notification");
const auth = require("./middlewares/auth");
var server = http.createServer(app);
var io = require("socket.io")(server);

// app init
const port = process.env.PORT || 8000;
const DB =
    "mongodb+srv://mramydaly:m2ramy4daly2@cluster0.4ot98md.mongodb.net/?retryWrites=true&w=majority";


// middleware 
app.use(express.json());
app.use(cors());
app.use(authRouter);
app.use(userRouter);
app.use(postRouter);
app.use(storyRouter);
app.use(chatRouter);
app.use(notificationRouter);

// channel
const nameSpaceChat = io.of('/socket-chat-message');
nameSpaceChat.on("connection", async (socket) => {
    console.log('a user connected');
    socket.on("signin", (id) => {
        socket.join(id);
        console.log(id);
    });
    socket.on("message", async (msg) => {
        nameSpaceChat.to(msg.senderId).emit('message', msg);
        nameSpaceChat.to(msg.recieverId).emit('message', msg);
        //socket.emit('message', msg);
        await newChat(
            msg.senderId,
            msg.recieverId,
            msg.message,
            msg.type,
            msg.repliedMessage,
            msg.repliedType,
            msg.repliedTo,
            msg.repliedIsMe,
        );
    });
});

//Connections
async function connect() {
    try {
        await mongoose.connect(DB);
        console.log("connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

server.listen(8000, () => {
    console.log('server started');
});