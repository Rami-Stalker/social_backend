// const pushNotificationController = require("../middlewares/push_notifications.controller");
// const express = require("express");
// const notificationRouter = express.Router();

// notificationRouter.post("/send-notification", pushNotificationController.sendPushNotification);

// module.exports = notificationRouter;

const express = require("express");
const notificationRouter = express.Router();
const sendNotification = require('../controllers/push_notification');
const { User } = require('../models/user');
const Notification = require("../models/notification");
const createChangeStream = require('../middlewares/stream_change');
const auth = require("../middlewares/auth");

// get notification
notificationRouter.get("/:userId", async (req, res) => {
    try {
        createChangeStream(req.params.userId);
        const notifications = await Notification.find({ userId: req.params.userId });
        res.status(200).json(notifications);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// send notification
notificationRouter.post("/send-notification", auth, async (req, res) => {
    const { userId, typeId, title, body, notificationType } = req.body;
    try {
        const user = await User.findById(req.user);
        const fcmToken = user.fcmToken;
        if (user) {
            sendNotification(userId, typeId, fcmToken, "", notificationType);
        }
        res.status(200).send('Notification sent');
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

notificationRouter.post("/seen-notification", auth, async (req, res) => {
    try {
        const { notificationId } = req.body;
        let notification = await Notification.findById(notificationId);
        
        if (notification.isSeen === false) {
            notification.isSeen = true;
            await notification.save();
        }

        res.status(200).json(notification);
} catch (e) {
    res.status(500).json({ error: e.message });
}
});

module.exports = notificationRouter;
