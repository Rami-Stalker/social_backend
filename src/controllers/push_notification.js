const admin = require('firebase-admin');
const serviceAccount = require('../config/push_notification_key.json');
const Notification = require('../models/notification');
const { User } = require('../models/user');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

async function sendNotification(userId, anterActiveId, typeId, fcmToken, recieverName, notificationType) {

    const title = "Notificaiton";
    let body = "";

    let notification = await Notification.findOne({ typeId: typeId });
    const lastUser = await User.findById(anterActiveId);

    if (anterActiveId && typeId) {
        console.log('xxxxxxxxxxxxxxxxxxxxx');
        if (notification) {
            console.log('dddddddddddddddddddddddddd');

            if (notificationType == 'post') {
                const isItemInList = notification.interactive.includes(anterActiveId);
                if (!isItemInList) {
                    notification.interactive.push(anterActiveId);
                }
                notification.notification.body = `Your post was interacted by ${lastUser.name} and ${notification.interactive.length} else`;
                body = `Your post was interacted by ${lastUser.name} and ${notification.interactive.length} else`;
            } else if (notificationType == 'message') {
                body = `You received message from ${recieverName}`;
            }
            notification.createdAt = Date.now(),
                notification = await notification.save();
        } else {
            console.log('new------------');
            if (notificationType == 'post') {
                let newNotification = new Notification({
                    userId,
                    typeId,
                    notification: {
                        title,
                        body: `Your post was interacted by ${lastUser.name}`,
                    },
                    interactive: [anterActiveId],
                    notificationType,
                });
                newNotification = await newNotification.save();
            } else if (notificationType == 'message') {
                let newNotification = new Notification({
                    userId,
                    typeId,
                    notification: {
                        title,
                        body,
                    },
                    notificationType,
                });
                newNotification = await newNotification.save();
            }
        }

        const message = {
            notification: {
                title: title,
                body: body,
            },
            token: fcmToken,
        };

        admin.messaging().send(message)
            .then((response) => {
                console.log('Successfully sent notification:', response);
            })
            .catch((error) => {
                console.log('Error sending notification:', error);
            });
    }



    // const notificationToDelete = await Notification.findOne({ typeId: typeId });

    // if (notificationToDelete) {
    //     await Notification.deleteOne({ typeId: typeId });
    // }

    // let notification = new Notification({
    //     userId,
    //     typeId,
    //     notification: {
    //         title,
    //         body,
    //     },
    //     notificationType,
    // });
    // notification = await notification.save();
}

module.exports = sendNotification;