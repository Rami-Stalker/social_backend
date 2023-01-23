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
    },
    bio: {
        type: String,
        default: "",
    },
    followers: [
        {
            type: String,
            default: "",
        },
    ],
    following: [
        {
            type: String,
            default: "",
        },
    ],
    photo: {
        required: true,
        type: String,
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
});

const User = mongoose.model("User", userSchema);
module.exports = { User, userSchema };
