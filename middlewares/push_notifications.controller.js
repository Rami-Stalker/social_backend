var admin = require("firebase-admin");
var fcm = require("fcm-notification");
const { User } = require("../models/user");

var serviceAcount = require("../config/push_notification_key.json");
const certPath = admin.credential.cert(serviceAcount);
var FCM = new fcm(certPath);

exports.sendPushNotification = (req, res, next) => {
    try {
        const user =  User.findById(req.body.userId);
        let message = {
            notification: {
                title: user.name,
                body: req.body.message,
            },
            data: {
                userId: req.body.userId,
                name: user.name,
                photo: user.photo,
                usertoken: user.fcmtoken,
            },
            token: user.fcmtoken,
        };

        FCM.send(message, function (err, resp) {
            if (err) {
                return res.status(500).json({ message: err });
            } else {
                return res.status(200).json({
                    message: "Notification Sent"
                });
            }
        });
    } catch (err) {
        throw err;
    }
}
