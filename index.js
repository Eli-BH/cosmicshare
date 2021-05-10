const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//routers
const authRoutes = require("./routers/authRouter");
const postRoutes = require("./routers/postRouter");
const userRoutes = require("./routers/userRouter");

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

//connect to the mongodb
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => console.log(error));

//start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
