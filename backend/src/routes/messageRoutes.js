import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", protect, async (req, res) => {
  const otherUserId = req.params.userId;
  const messages = await Message.find({
    $or: [
      { senderId: req.user._id, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: req.user._id }
    ]
  }).sort({ createdAt: 1 });

  res.json(messages);
});

router.post("/", protect, async (req, res) => {
  const message = await Message.create({
    senderId: req.user._id,
    receiverId: req.body.receiverId,
    content: req.body.content
  });

  req.app.get("io").to(String(req.body.receiverId)).emit("message:new", message);
  res.status(201).json(message);
});

export default router;
