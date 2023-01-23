const mongoose = require("mongoose");
const msgSchema = require("./message");

const contentSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    messages: [msgSchema],
});

module.exports =  contentSchema;
