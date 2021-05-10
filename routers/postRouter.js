const router = require("express").Router();
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const Post = require("../models/Post");
const User = require("../models/User");

const upload = require("../services/ImageUpload");
const singleUpload = upload.single("image");

//create a Post: POST
router.post("/", async (req, res) => {
  try {
    const newPost = await Post(req.body);
    const savedPost = await newPost.save();
    res.status(200).json({ message: "Post Created", post: savedPost });
  } catch (error) {
    res.status(500).json(error);
  }
});

//update a post using the id

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ message: "Update successful" });
    } else {
      res.status(403).json("Unauthorized update");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post by id
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json({ message: "post deleted" });
    } else {
      res.status(403).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get a post by id
router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json({ message: "Retrieved post", post });
  } catch (error) {
    res.status(500).json(error);
  }
});

//make a post with an image
router.post("/picture", async (req, res) => {
  try {
    singleUpload(req, res, async (err) => {
      if (err) {
        return res.json({
          success: false,
          errors: {
            title: "Image Upload Error",
            detail: err.message,
            error: err,
          },
        });
      }

      const newPost = await new Post({
        userId: req.body.userId,
        img: req.file.location,
      });

      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all of a single users posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    if (!posts) return res.status(404).json({ message: "User has no posts" });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all of all users posts
//this can be used for the explore page
router.get("/explore", async (req, res) => {
  try {
    const posts = await Post.find({});

    if (!posts) return res.status(404).json({ message: "No Posts found" });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json(error);
  }
});

//like and dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ message: "Post liked" });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ message: "Post Disliked" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//get all liked posts
router.get("/liked", async (req, res) => {
  try {
    const posts = await Post.find({});
    if (!posts) return res.status(404).json({ message: "Post not found" });

    const likedPosts = posts.filter((post) =>
      post.likes.includes(req.body.userId)
    );

    if (!likedPosts)
      return res.status(404).json({ message: "Liked Posts not found" });

    res.status(200).json(likedPosts);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
