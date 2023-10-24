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
        const myChat = await Chat.findOne({ userId: req.user });
        res.json(myChat);
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

const newChat = ( async (senderId, recieverId, message, type, repliedMessage, repliedType, repliedTo, repliedIsMe) => {
    try {
        let myChat = await Chat.findOne({ userId: senderId });
        let recieverChat = await Chat.findOne({ userId: recieverId });

        const msg = {
            message,
            type,
        };

        const repliedMsg = {
            repliedMessage,
            type: repliedType,
            repliedTo,
            isMe: repliedIsMe,
        };

        let messages = [];

            messages.push({
                senderId: senderId,
                recieverId,
                msg,
                repliedMsg,
            });

        if (!myChat) {
            let contents = [];

            contents.push({ recieverId, messages });

            let user = new Chat({
                userId: senderId,
                contents,
            });

            user = await user.save();
        } else {
            const senderContent = myChat.contents.find(o => o.recieverId === recieverId);

            if (!senderContent) {
                myChat.contents.push({ recieverId, messages });
                myChat = await myChat.save();
            }

            senderContent.messages.push({
                senderId: senderId,
                recieverId,
                msg,
                repliedMsg,
            });
            myChat = await myChat.save();
        }

        /////////////////////////////////////////////

        if (!recieverChat) {
            let contents = [];

            contents.push({ recieverId: senderId, messages });

            let user = new Chat({
                userId: recieverId,
                contents,
            });

            user = await user.save();
        } else {
            const recieverCont = recieverChat.contents.find(o => o.recieverId === senderId);

            if (!recieverCont) {
                recieverChat.contents.push({ recieverId: senderId, messages });
                recieverChat = await recieverChat.save();
            }
            recieverCont.messages.push({
                senderId: senderId,
                recieverId,
                msg,
                repliedMsg,
            });
            recieverChat = await recieverChat.save();
        }
    } catch (e) {
        console.log(e.message);
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


module.exports = {chatRouter, newChat};

