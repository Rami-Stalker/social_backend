var admin = require("firebase-admin");
var fcm = require("fcm-notification");

var serviceAcount = require("../config/push_notification_key.json");
const certPath = admin.credential.cert(serviceAcount);
var FCM = new fcm(certPath);

exports.sendPushNotification = (req, res, next) => {
    try {
        let message = {
            notification: {
                title: "Test Notification",
                body: "Notification Message"
            },
            data: {
                orderId: "123456",
                orderDate: "2022-10-28"
            }, 
            token: req.body.fcm_token,
        };

        FCM.send(message, function(err, resp){
        if (err) {
            return res.status(500).json({ message: err });
        }else{
            return res.status(200).json({
                message: "Notification Sent"
            });
        }
        });
    } catch (err) {
        throw err;
    }
}
