const express = require("express");
const auth = require("../middlewares/auth");
const chatRouter = express.Router();
const Chat = require("../models/chat");

// chatRouter.get("/api/chat/search-contact/:name", async (req, res) => {
//     try {
//         const contacts = await Chat.find({
//             name: { $regex: req.params.name, $options: "i" },
//         });

//         res.json(users);
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

chatRouter.get("/", auth, async (req, res) => {
        const userChat = await Chat.findOne({ userId: req.user });
        res.json(userChat);
});

module.exports = chatRouter;

