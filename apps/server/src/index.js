const express = require("express");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

// LiveKit imports
const { AccessToken, VideoGrant } = require("livekit-server-sdk");

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Logging
app.use(morgan("combined"));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// ✅ LiveKit Token Generation Route
app.get("/api/livekit/token", (req, res) => {
  const { identity, room } = req.query;

  console.log("🔑 Token request:", { identity, room });

  if (!identity || !room) {
    return res.status(400).json({ 
      error: "Missing identity or room parameters" 
    });
  }

  // Validate environment variables
  if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
    console.error("❌ Missing LiveKit credentials in environment");
    return res.status(500).json({ 
      error: "Server configuration error" 
    });
  }

  try {
    // Create access token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      { 
        identity: identity,
        // Token expires in 6 hours
        ttl: "6h"
      }
    );

    // Add video grant with room permissions
    const grant = new VideoGrant({
      room: room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
      canUpdateOwnMetadata: true,
    });

    at.addGrant(grant);

    const token = at.toJwt();
    const serverUrl = process.env.LIVEKIT_URL || "ws://localhost:7880";

    console.log("✅ Token generated successfully");
    
    res.json({
      token: token,
      url: serverUrl,
      identity: identity,
      room: room
    });

  } catch (error) {
    console.error("❌ Error generating token:", error);
    res.status(500).json({ 
      error: "Failed to generate access token" 
    });
  }
});

// ✅ Room management endpoints
app.post("/api/livekit/rooms", (req, res) => {
  const { roomName } = req.body;
  
  if (!roomName) {
    return res.status(400).json({ error: "Room name is required" });
  }

  // In a real app, you'd create the room via LiveKit API
  // For now, just return success
  res.json({ 
    room: roomName, 
    status: "created",
    participants: 0 
  });
});

// Your existing routes would go here
// app.use("/api/auth", authRoutes);
// app.use("/api/health-records", healthRecordsRoutes);
// etc.

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start HTTP server
const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🎥 LiveKit URL: ${process.env.LIVEKIT_URL || 'ws://localhost:7880'}`);
});

// Socket.IO setup (optional - you might not need this with LiveKit)
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Change to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

module.exports = app;