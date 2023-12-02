const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    typeId: {
        type: String,
        required: true,
    },
    notification: {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
    },
    interactive: [
        {
            type: String,
            default: "",
            unique: true,
        },
    ],
    createdAt: {
        default: Date.now,
        type: Date,
    },
    isSeen: {
        type: Boolean,
        default: false,
    },
    notificationType: {
        type: String,
        default: "message",
    },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
