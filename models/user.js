const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
        trim: true,
    },
    email: {
        required: true,
        type: String,
        trim: true,
        validate: {
            // validator
            validator: (value) => {
                const re =
                    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                return value.match(re);
            },
            message: "Please enter a valid email address",
        },
    },
    password: {
        required: true,
        type: String,
        max: 50,
    },
    bio: {
        type: String,
        default: "",
        max: 100,
    },
    friendRequests: [
        {
            type: String,
            default: "",
        },
    ],
    friends: [
        {
            type: String,
            default: "",
        },
    ],
    photo: {
        type: String,
        default: "",
    },
    backgroundImage: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    type: {
        type: String,
        default: "user",
    },
    private: {
        type: Boolean,
        default: false,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    lastActive: {
        type: Date,
        default: Date.now,
    },
    fcmToken: {
        type: String,
        default: "",
    },
});

const User = mongoose.model("User", userSchema);
module.exports = { User, userSchema };
