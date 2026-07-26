import jwt from "jsonwebtoken";
import User from "../models/User.js";

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req, res) {
  try {
    const { name, email, password, headline = "" } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, headline });
    res.status(201).json({ token: signToken(user._id), user: user.toSafeJSON() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: signToken(user._id), user: user.toSafeJSON() });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
