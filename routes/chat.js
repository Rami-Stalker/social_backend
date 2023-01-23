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

chatRouter.post("/message/add-message", auth, async (req, res) => {
    try {
        const { recieverId, message, type, repliedMessage, repliedType, repliedTo, repliedIsMe,  isSeen } = req.body;

        let myChat = await Chat.findOne({userId : req.user});
        let recieverChat = await Chat.findOne({userId : recieverId});

        if (!myChat) {

            let contents = [];
            let messages = [];

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

            messages.push({
                senderId: req.user,
                recieverId,
                msg,
                repliedMsg,
                isSeen,
            });

            contents.push({ userId: recieverId, messages: messages });

            let user = new Chat({
                userId: req.user,
                contents,
            });
            
            user = await user.save();
        }

        const senderContent = myChat.contents.find(o => o.userId === recieverId);

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

        if (!senderContent) {
            let messages = [];

            messages.push({
                senderId: req.user,
                recieverId,
                msg,
                repliedMsg,
                isSeen,
            });

            myChat.contents.push({ userId: recieverId, messages });
        }

        senderContent.messages.push({
            senderId: req.user,
            recieverId,
            msg,
            repliedMsg,
            isSeen,
        });


        /////////////////////////////////////////////

        if (!recieverChat) {
            let contents = [];
            let messages = [];

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

            messages.push({
                senderId: req.user,
                recieverId,
                msg,
                repliedMsg,
                isSeen,
            });

            contents.push({ userId: req.user, messages });

            let reciever = new Chat({
                userId: recieverId,
                contents,
            });
            
            reciever = await reciever.save();
        }

        
        const recieverContent = recieverChat.contents.find(o => o.userId === req.user);

        if (!recieverContent) {
            let messages = [];

            messages.push({
                senderId: req.user,
                recieverId,
                msg,
                repliedMsg,
                isSeen,
            });

            recieverChat.contents.push({ userId: req.user, messages });
        }

        

        recieverContent.messages.push({
            senderId: req.user,
            recieverId,
            msg,
            repliedMsg,
            isSeen,
        });

        myChat = await myChat.save();
        recieverChat = await recieverChat.save();

        res.json(myChat);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});



module.exports = chatRouter;

