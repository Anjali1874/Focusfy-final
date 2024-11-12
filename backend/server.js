// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import authRouter from "./routes/authRoutes.js";
// import connectDB from "./config/db.js";
// import User from './models/User.js'; // Assuming this is for authentication
// import http from "http";
// import { Server as socketIo } from "socket.io";

// dotenv.config();
// const app = express();
// const PORT = process.env.PORT || 4135;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(cors({
//   origin: "http://localhost:5173",
//   methods: ["GET", "POST"],
//   credentials: true,
// }));
// app.use(express.json());

// // Create HTTP server for Socket.IO
// const server = http.createServer(app);

// // Initialize Socket.IO with CORS configuration
// const io = new socketIo(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//     withCredentials: true,
//   },
// });

// // Define the collection for "timing" data
// const timingCollection = mongoose.connection.collection("timing");

// // Function to fetch data from `timing` collection and emit it
// const emitFocusData = async () => {
//   try {
//     const data = await timingCollection.find().toArray();

//     // Format the data for the frontend
//     const formattedData = data.map(entry => ({
//       _id: entry._id,
//       startTime: entry.start_time,
//       blinkCount: entry.blink_count,
//       focusPercentage: entry.focus_percentage,
//       intervalData: entry.interval_data.map(interval => ({
//         timestamp: interval.timestamp,
//         blinkCount: interval.blink_count,
//         focusPercentage: interval.focus_percentage,
//         postureData: interval.posture_data.map(postureEntry => ({
//           time: postureEntry.time,
//           posture: postureEntry.posture
//         })),
//         elapsedTime: interval.elapsed_time
//       })),
//       endTime: entry.end_time
//     }));

//     // Emit the data to all connected clients
//     io.emit("focusData", formattedData);
//   } catch (error) {
//     console.error("Error fetching focus data:", error);
//   }
// };

// // Emit focus data every 60 seconds
// setInterval(emitFocusData, 60000);

// io.on("connection", async (socket) => {
//   console.log("A user connected:", socket.id);
//   try {
//     // Send initial data upon connection
//     const data = await timingCollection.find().toArray();
//     const formattedData = data.map(entry => ({
//       _id: entry._id,
//       startTime: entry.start_time,
//       blinkCount: entry.blink_count,
//       focusPercentage: entry.focus_percentage,
//       intervalData: entry.interval_data.map(interval => ({
//         timestamp: interval.timestamp,
//         blinkCount: interval.blink_count,
//         focusPercentage: interval.focus_percentage,
//         postureData: interval.posture_data.map(postureEntry => ({
//           time: postureEntry.time,
//           posture: postureEntry.posture
//         })),
//         elapsedTime: interval.elapsed_time
//       })),
//       endTime: entry.end_time
//     }));
//     socket.emit("focusData", formattedData);
//   } catch (error) {
//     console.error("Error on initial connection:", error);
//   }

//   socket.on("disconnect", () => {
//     console.log("A user disconnected:", socket.id);
//   });
// });

// // Routes
// app.use("/api/auth", authRouter);

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });


import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import http from "http";
import { Server as socketIo } from "socket.io";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4135;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    withCredentials: true,
  },
});

// Define the collection for "timing" data
const timingCollection = mongoose.connection.collection("timing");

// Function to fetch data from `timing` collection and emit it
const emitFocusData = async () => {
  try {
    const data = await timingCollection.find().toArray();

    // Format the data for the frontend
    const formattedData = data.map(entry => ({
      _id: entry._id,
      startTime: entry.start_time,
      blinkCount: entry.blink_count,
      focusPercentage: entry.focus_percentage,
      intervalData: entry.interval_data.map(interval => ({
        timestamp: interval.timestamp,
        blinkCount: interval.blink_count,
        focusPercentage: interval.focus_percentage,
        postureData: interval.posture_data.map(postureEntry => ({
          time: postureEntry.time,
          posture: postureEntry.posture
        })),
        elapsedTime: interval.elapsed_time
      })),
      endTime: entry.end_time
    }));

    // Emit the data to all connected clients
    io.emit("focusData", formattedData);
  } catch (error) {
    console.error("Error fetching focus data:", error);
  }
};

// Emit focus data every 60 seconds
setInterval(emitFocusData, 60000);

// Handle the "SIGINT" event (when the application is stopping) to save ongoing data
process.on("SIGINT", async () => {
  try {
    // Assuming you have some data in memory to store in the database
    const dataToSave = {
      start_time: new Date(),
      blink_count: 20,  // Example, replace with your actual data
      focus_percentage: 75,  // Example, replace with actual data
      interval_data: [
        {
          timestamp: new Date(),
          blink_count: 2,
          focus_percentage: 80,
          posture_data: [
            { time: new Date(), posture: "Good" },
            { time: new Date(), posture: "Poor" }
          ],
          elapsed_time: 10
        }
      ],
      end_time: new Date()
    };

    // Insert the data into the "timing" collection in the database
    await timingCollection.insertOne(dataToSave);
    console.log("Data saved successfully when the app stopped.");
  } catch (error) {
    console.error("Error saving data when the app stopped:", error);
  }

  process.exit(); // Gracefully shutdown
});

// Handle socket connection and emitting initial data on connect
io.on("connection", async (socket) => {
  console.log("A user connected:", socket.id);
  try {
    // Send initial data upon connection
    const data = await timingCollection.find().toArray();
    const formattedData = data.map(entry => ({
      _id: entry._id,
      startTime: entry.start_time,
      blinkCount: entry.blink_count,
      focusPercentage: entry.focus_percentage,
      intervalData: entry.interval_data.map(interval => ({
        timestamp: interval.timestamp,
        blinkCount: interval.blink_count,
        focusPercentage: interval.focus_percentage,
        postureData: interval.posture_data.map(postureEntry => ({
          time: postureEntry.time,
          posture: postureEntry.posture
        })),
        elapsedTime: interval.elapsed_time
      })),
      endTime: entry.end_time
    }));
    socket.emit("focusData", formattedData);
  } catch (error) {
    console.error("Error on initial connection:", error);
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", authRouter);

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

