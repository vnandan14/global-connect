import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

router.put("/me", protect, async (req, res) => {
  const allowed = ["name", "bio", "headline", "location", "profilePic", "banner", "skills", "experience", "education"];
  const updates = {};

  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select("-password");
  res.json(user);
});

router.get("/search", protect, async (req, res) => {
  const q = req.query.q || "";
  const users = await User.find({
    _id: { $ne: req.user._id },
    $or: [
      { name: new RegExp(q, "i") },
      { headline: new RegExp(q, "i") },
      { skills: new RegExp(q, "i") }
    ]
  })
    .select("-password")
    .limit(20);

  res.json(users);
});

router.get("/:id", protect, async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;
