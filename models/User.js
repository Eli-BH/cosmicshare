const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      minLength: 4,
      max: 20,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      maxLength: 50,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "https://i.imgur.com/Lw0r7g0.jpg",
    },
    coverPicture: {
      type: String,
      default: "https://i.imgur.com/E5Lzros.png",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      maxLength: 240,
    },
    city: {
      type: String,
      maxLength: 50,
    },
    from: {
      type: String,
      maxLength: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
