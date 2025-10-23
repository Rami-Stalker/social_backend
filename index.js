require('dotenv').config();
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");

const connection = require("./Utils/connection");
const socketIOEvents = require("./middlewares/socket");
const createCshangeStream = require('./middlewares/stream_change');
const authMiddleware = require("./middlewares/auth");
const { initMeetingServer } = require("./meeting-server");

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const storyRouter = require("./routes/story");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const notificationRouter = require("./routes/notification");
const meetingRouter = require("./routes/app.routes");

const app = express();
const port = process.env.PORT || 8000;
const server = http.createServer(app);
const io = new Server(server);

const initApp = async () => {
    try {
        await connection();
        createCshangeStream("652ac4045f43862232aa930b");
    } catch (error) {
        console.error("Error during initialization:", error);
        process.exit(1);
    }
};

const configureMiddleware = () => {
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json({ extended: false }));

    app.use("/api/authentication", authRouter);
    app.use("/api/chat", chatRouter);
    app.use("/api/notification", notificationRouter);
    app.use("/api/post", postRouter);
    app.use("/api/story", storyRouter);
    app.use("/api/user", userRouter);
    app.use("/api/meeting", meetingRouter);
};

const listenToPort = () => {
    server.listen(port, () => {
        console.log("Rest Api Port Connected " + port);
    });
};

// Connections
initApp()
    .then(() => {
        configureMiddleware();
        listenToPort();
        socketIOEvents(io);
    })
    .catch((error) => {
        console.error("Error during initialization:", error);
        process.exit(1);
    });

