const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//get user
router.get("/", async (req, res) => {
  try {
    const userId = req.query.userId;
    const username = req.query.username;

    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });

    if (!user) return res.status(404).json("User not found");

    const { password, updatedAt, ...info } = user._doc;

    res.status(200).json(info);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update user: PUT
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      await User.findByIdAndUpdate(req.params.id, { $set: req.body });
      res.status(200).json({ message: "Updated" });
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("Unauthorized");
  }
});

module.exports = router;
