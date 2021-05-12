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

//Delete user: DELETE
router.delete("/:id", async (req, res) => {
  try {
    if (req.body.userId === req.params.id) {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted" });
    } else {
      return res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId === req.params.id)
    return res.status(403).json({ message: "User cannot follow self" });

  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (!user.followers.includes(req.body.userId)) {
      await user.updateOne({ $push: { followers: req.body.userId } });
      await currentUserUser.updateOne({ $push: { following: req.params.id } });
      res.status(200).json({ message: "User Followed" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//unfollow
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId === req.params.id)
    return res.status(403).json({ message: "User cannot follow self" });

  try {
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (user.followers.includes(req.body.userId)) {
      await user.updateOne({ $pull: { followers: req.body.userId } });
      await currentUser.updateOne({ $pull: { following: req.params.id } });
      res.status(200).send("No longer following this user");
    } else {
      return res.status(401).json({ message: "Not following this usr" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get Followings
router.get("/:userId/friends", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );

    let friendsList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendsList.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendsList);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
