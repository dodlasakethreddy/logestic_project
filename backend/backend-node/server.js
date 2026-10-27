const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true
  })
);

app.use(express.json());

// Health check endpoint
app.get("/api/health", async (req, res) => {
  let mlServiceHealthy = false;
  const mlUrl = process.env.ML_API_URL || "http://127.0.0.1:8000";

  try {
    const mlRes = await fetch(`${mlUrl}/health`, { signal: AbortSignal.timeout(1500) });
    if (mlRes.ok) {
      mlServiceHealthy = true;
    }
  } catch (err) {
    mlServiceHealthy = false;
  }

  res.json({
    success: true,
    service: "Node.js Express API",
    status: "running",
    mlServiceUrl: mlUrl,
    mlServiceConnected: mlServiceHealthy,
    timestamp: new Date().toISOString()
  });
});

// Mount modular API routers
app.use("/api/employees", require("./routes/employees"));
app.use("/api/dashboard", require("./routes/dashboard"));
app.use("/api/predict", require("./routes/predict"));
app.use("/api/metrics", require("./routes/metrics"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "production" ? "An unexpected error occurred" : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Node.js Express Server running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`ML Service target: ${process.env.ML_API_URL || "http://127.0.0.1:8000"}`);
});
