import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import User from './models/User.js';
import http from "http";
import { Server as socketIo } from "socket.io";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4135;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Update to your frontend's origin
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow the frontend origin
    methods: ["GET", "POST"],
    withCredentials: true,
  },
});

// Emit focus data every 60 seconds
const updateFocusLevels = async () => {
  try {
    const users = await User.find();
    users.forEach(async user => {
      user.focusLevel = Math.floor(Math.random() * 100);
      user.timeInterval = Date.now();
      await user.save();
    });
    io.emit("focusData", users);
  } catch (error) {
    console.error("Error updating focus levels:", error);
  }
};

setInterval(updateFocusLevels, 60000);

io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);
  try {
    const users = await User.find();
    socket.emit("focusData", users);
  } catch (error) {
    console.error("Error on initial connection:", error);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", authRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
