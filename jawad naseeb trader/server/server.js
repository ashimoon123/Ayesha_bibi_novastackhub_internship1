const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

// Connect to database (ensure MONGO_URI is set in .env)
if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.log("Warning: MONGO_URI not set. Please configure .env file.");
}

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/lessons", require("./routes/lessonRoutes"));
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/market", require("./routes/marketRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));
app.use("/api/newsletter", require("./routes/newsletterRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Jawad Naseeb API is running", status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Jawad Naseeb API running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});
