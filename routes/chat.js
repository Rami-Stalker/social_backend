const express = require("express");
const auth = require("../middlewares/auth");
const chatRouter = express.Router();
const Chat = require("../models/chat");

// chatRouter.get("/api/chat/search-content/:name", async (req, res) => {
//     try {
//         const contents = await Chat.find({
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

chatRouter.get("/add-chat", auth, async (req, res) => {
    try {
        const user = new Chat({
            userId: req.user,
        });
    
        user = await user.save();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

chatRouter.post("/seen-message", auth, async (req, res) => {
    try {
        const {recieverId} = req.body;
        let recieverChat = await Chat.findOne({ userId: recieverId });
        
        const me = recieverChat.contents.find(o => o.recieverId === req.user);

        for (let i = 0; i < me.messages.length; i++) {
                if (me.messages[i].isSeen == false) {
                    me.messages[i].isSeen = true;
                }
        }

        recieverChat = await recieverChat.save();

        res.json(recieverChat);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


module.exports = chatRouter;

