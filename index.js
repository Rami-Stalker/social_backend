// IMPORTS FROM PACKAGES
const express = require("express");
const mongoose = require("mongoose");
// IMPORTS FROM OTHER FILES
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const storyRouter = require("./routes/story");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");



// app init
const PORT = process.env.PORT || 3000;
const app = express();
const DB =
    "mongodb+srv://mramydaly:m2ramy4daly2@cluster0.4ot98md.mongodb.net/?retryWrites=true&w=majority";

// middleware 
app.use(express.json());
app.use(authRouter);
app.use(userRouter);
app.use(postRouter);
app.use(storyRouter);
app.use(chatRouter);


// Connections
async function connect(){
    try {
        await mongoose.connect(DB);
        console.log("connected to MongoDB");
    } catch (error) {
        console.error(error);
    }
}

connect();

app.listen(8000, () => {
    console.log(`connected at port ${PORT}`);
});