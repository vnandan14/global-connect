import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: String,
    role: String,
    from: String,
    to: String
  },
  { _id: false }
);

const educationSchema = new mongoose.Schema(
  {
    school: String,
    degree: String,
    from: String,
    to: String
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    bio: { type: String, default: "" },
    headline: { type: String, default: "" },
    location: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    banner: { type: String, default: "" },
    skills: [{ type: String }],
    experience: [experienceSchema],
    education: [educationSchema],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    connectionRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Job" }],
    role: { type: String, enum: ["user", "admin"], default: "user" }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  const user = this.toObject();
  delete user.password;
  return user;
};

export default mongoose.model("User", userSchema);
