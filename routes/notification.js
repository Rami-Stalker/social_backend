const pushNotificationController = require("../middlewares/push_notifications.controller");
const express = require("express");
const notificationRouter = express.Router();

notificationRouter.post("/send-notification", pushNotificationController.sendPushNotification);

module.exports = notificationRouter;
