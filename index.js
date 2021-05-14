const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//routers
const authRoutes = require("./routers/authRouter");
const postRoutes = require("./routers/postRouter");
const userRoutes = require("./routers/userRouter");
const messageRoutes = require("./routers/messageRouter");
const conversationRoutes = require("./routers/conversationRouter");

//use dot env to use .env files
dotenv.config();
const port = process.env.PORT || 3001;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//app routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);

//connect to the mongodb
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => console.log(error));

//start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
