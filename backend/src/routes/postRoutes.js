import express from "express";
import Post from "../models/Post.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/feed", protect, async (req, res) => {
  const visibleUsers = [req.user._id, ...req.user.connections];
  const posts = await Post.find({ userId: { $in: visibleUsers } })
    .populate("userId", "name headline profilePic")
    .populate("comments.userId", "name profilePic")
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(posts);
});

router.post("/", protect, async (req, res) => {
  const post = await Post.create({
    userId: req.user._id,
    content: req.body.content,
    image: req.body.image || ""
  });

  const populated = await post.populate("userId", "name headline profilePic");
  res.status(201).json(populated);
});

router.post("/:id/like", protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const liked = post.likes.some((id) => String(id) === String(req.user._id));
  post.likes = liked
    ? post.likes.filter((id) => String(id) !== String(req.user._id))
    : [...post.likes, req.user._id];

  await post.save();
  res.json(post);
});

router.post("/:id/comment", protect, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  post.comments.push({ userId: req.user._id, text: req.body.text });
  await post.save();
  const populated = await post.populate("comments.userId", "name profilePic");
  res.status(201).json(populated);
});

export default router;
