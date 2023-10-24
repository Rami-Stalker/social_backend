// // IMPORTS FROM PACKAGES
// const express = require("express");
// const mongoose = require("mongoose");
// // IMPORTS FROM OTHER FILES
// const connection = require("./Utils/connection");

// const socketIOEvents = require("./middlewares/socket");

// const authRouter = require("./routes/auth");
// const userRouter = require("./routes/user");
// const postRouter = require("./routes/post");
// const storyRouter = require("./routes/story");
// const { chatRouter, newChat } = require("./routes/chat");
// const notificationRouter = require("./routes/notification");

// // const dotenv = require('dotenv');
// const http = require('http');
// const { Server } = require("socket.io");
// // app init
// // const port = process.env.PORT || 8000;
// // const DB =
// //     "mongodb+srv://mramydaly:m2ramy4daly2@cluster0.4ot98md.mongodb.net/?retryWrites=true&w=majority";

// // INIT
// // dotenv.config();
// let port = null;
// let app = null;
// let server = null;
// let io = null;

// const initVar = async () => {
//     port = process.env.PORT;
//     app = express();
//     server = http.createServer(app);
//     io = new Server(server);
//     socketIOEvents(io);
// }


// // middleware 
// const middleware = async () => {
//     app.use(express.urlencoded({ extended: false }));
//     app.use(express.json({ extended: false }));

//     app.use("/api/authentication", authRouter);
//     app.use("/api/user", userRouter);
//     app.use("/api/post", postRouter);
//     app.use("/api/story", storyRouter);
//     app.use("/api/chat", chatRouter);
//     app.use("/api/notification", notificationRouter);
// }

// // channel
// // const nameSpaceChat = io.of('/socket-chat-message');
// // nameSpaceChat.on("connection", async (socket) => {
// //     console.log('a user connected');
// //     socket.on("signin", (id) => {
// //         socket.join(id);
// //         console.log(id);
// //     });

// //     socket.on("message", async (msg) => {
// //         nameSpaceChat.to(msg.senderId).emit('message', msg);
// //         nameSpaceChat.to(msg.recieverId).emit('message', msg);
// //         //socket.emit('message', msg);

// //         await newChat(
// //             msg.senderId,
// //             msg.recieverId,
// //             msg.message,
// //             msg.type,
// //             msg.repliedMessage,
// //             msg.repliedType,
// //             msg.repliedTo,
// //             msg.repliedIsMe,
// //         );
// //     });
// // });

// //Connections
// const ListenToPort = async () => {
//     server.listen(port, async () => {
//         console.log("Rest Api Port Connected " + port);
//     });
// }

// // Connections
// initVar().then(() => {
//     ListenToPort().then(() => {
//         middleware().then(() => {
//             connection();
//         })
//     })
// });



// // async function connect() {
// //     try {
// //         await mongoose.connect(DB);
// //         console.log("connected to MongoDB");
// //     } catch (error) {
// //         console.error(error);
// //     }
// // }

// // connect();

// // server.listen(8000, () => {
// //     console.log('server started');
// // });

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
const socketIOEvents = require("./middlewares/socket");
var server = http.createServer(app);
var io = require("socket.io")(server);

// app init
const port = process.env.PORT || 8000;
const DB =
"mongodb+srv://mramydaly:m2ramy4daly2@cluster0.4ot98md.mongodb.net/";


// middleware
app.use(express.json());
app.use(cors());
app.use("/api/authentication", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/chat", chatRouter);
app.use("/api/notification", notificationRouter);

socketIOEvents(io);

// channel
// const nameSpaceChat = io.of('/socket-chat-message');
// nameSpaceChat.on("connection", async (socket) => {
//     console.log('a user connected');
//     socket.on("signin", (id) => {
//         socket.join(id);
//         console.log(id);
//     });
//     socket.on("message", async (msg) => {
//         nameSpaceChat.to(msg.senderId).emit('message', msg);
//         nameSpaceChat.to(msg.recieverId).emit('message', msg);
//         //socket.emit('message', msg);

//         await newChat(
//             msg.senderId,
//             msg.recieverId,
//             msg.message,
//             msg.type,
//             msg.repliedMessage,
//             msg.repliedType,
//             msg.repliedTo,
//             msg.repliedIsMe,
//         );
//     });
// });

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

// yAqyGYPxAEuugRGl