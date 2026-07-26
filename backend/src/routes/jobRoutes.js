import express from "express";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const q = req.query.q || "";
  const jobs = await Job.find({
    $or: [
      { title: new RegExp(q, "i") },
      { company: new RegExp(q, "i") },
      { skills: new RegExp(q, "i") },
      { location: new RegExp(q, "i") }
    ]
  })
    .populate("postedBy", "name headline")
    .sort({ createdAt: -1 });

  res.json(jobs);
});

router.post("/", protect, async (req, res) => {
  const job = await Job.create({
    postedBy: req.user._id,
    title: req.body.title,
    company: req.body.company,
    description: req.body.description,
    skills: req.body.skills || [],
    location: req.body.location || "Remote"
  });

  res.status(201).json(job);
});

router.post("/:id/apply", protect, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({ message: "Job not found" });

  if (!job.applicants.some((id) => String(id) === String(req.user._id))) {
    job.applicants.push(req.user._id);
    await job.save();
  }

  await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedJobs: job._id } });
  res.json({ message: "Application submitted", job });
});

export default router;
