require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS setup
app.use(cors({
  origin: ["https://hubly-frontend.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Cookie parser
app.use(cookieParser());

// Routes
try {
  const authRoutes = require("./routes/authRoutes");
  app.use("/api/auth", authRoutes);
  console.log("✅ Auth routes loaded successfully");
} catch (error) {
  console.error("❌ Failed to load routes:", error.stack);
}

app.get("/test", (req, res) => res.send("Test OK"));

// Error handler middleware (placed after routes)
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.stack || err.message);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 50000,
    connectTimeoutMS: 50000,
    socketTimeoutMS: 50000,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Log all registered routes for debugging
const listEndpoints = require('express-list-endpoints');
console.log('Registered Routes:');
listEndpoints(app).forEach((route) => {
  console.log(`- ${route.path} (${route.methods.join(", ")})`);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Made with ❤️ by
// Aditya Mohite
// adityamohite4973@gmail.com