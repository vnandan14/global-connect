import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import morgan from "morgan";
import { Server } from "socket.io";
import { connectDB } from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { attachSocketHandlers } from "./socket/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.set("io", io);
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ message: "Global Connect API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/messages", messageRoutes);

attachSocketHandlers(io);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(path.join(frontendPath, "index.html"));
    }
  });
}

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });
