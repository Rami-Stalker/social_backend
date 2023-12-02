const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    appVersion: {
        required: true,
        type: String,
    },
    deviceModel: {
        required: true,
        type: String,
    },
    deviceUUid: {
        required: true,
        type: String,
    },
    fcmToken: {
        required: true,
        type: String,
    },
});

const Device = mongoose.model("Device", deviceSchema);
module.exports = Device;
