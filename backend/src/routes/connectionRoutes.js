import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/request/:id", protect, async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    return res.status(400).json({ message: "You cannot connect with yourself" });
  }

  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found" });

  if (!target.connectionRequests.some((id) => String(id) === String(req.user._id))) {
    target.connectionRequests.push(req.user._id);
    await target.save();
  }

  res.json({ message: "Connection request sent" });
});

router.post("/accept/:id", protect, async (req, res) => {
  const requester = await User.findById(req.params.id);
  const me = await User.findById(req.user._id);

  if (!requester || !me.connectionRequests.some((id) => String(id) === req.params.id)) {
    return res.status(404).json({ message: "Request not found" });
  }

  me.connectionRequests = me.connectionRequests.filter((id) => String(id) !== req.params.id);
  if (!me.connections.some((id) => String(id) === req.params.id)) me.connections.push(requester._id);
  if (!requester.connections.some((id) => String(id) === String(me._id))) requester.connections.push(me._id);

  await me.save();
  await requester.save();
  res.json({ message: "Connection accepted" });
});

router.get("/", protect, async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("connections", "name headline profilePic location skills")
    .populate("connectionRequests", "name headline profilePic location skills")
    .select("connections connectionRequests");

  res.json(user);
});

export default router;
