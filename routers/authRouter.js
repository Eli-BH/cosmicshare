const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Connected through the auth Router");
});

// register a user : GET
router.post("/register", async (req, res) => {
  try {
    //hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //check if the user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(409).send("User already exists");

    //Continue if no existing user
    const newUser = await new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //save new user and respond
    await newUser.save();
    res.status(201).send("new user created");
  } catch (error) {
    res.status(500).json(error);
  }
});

//login a user : Post
router.post("/login", async (req, res) => {
  try {
    //look for the user in the database
    const user = await User.findOne({ email: req.body.email });

    //return not found if user not found in the db
    if (!user) return res.status(404).send("User not found");

    const validPass = await bcrypt.compare(req.body.password, user.password);

    //compare the password to the hashed password
    if (validPass) {
      res.status(200).json(user);
    } else {
      res.status(500).send("Incorrect Credentials");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
