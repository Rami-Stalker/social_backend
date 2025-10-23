const mongoose = require("mongoose");
const { userSchema } = require("./user");
const msgSchema = require("./message");

const contactSchema = mongoose.Schema({
    recieverId: {
        type: String,
        default: "",
    },

    lastMessage: msgSchema,

    createdAt: {
        type: Date,
        default: Date.now,
    },

    recieverData: userSchema,

    messages: [msgSchema],
});

module.exports = contactSchema;

