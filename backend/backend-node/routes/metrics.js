const express = require("express");

const router = express.Router();

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

// GET /api/metrics
router.get("/", async (req, res) => {
  try {
    const mlResponse = await fetch(`${ML_API_URL}/metrics`);
    if (!mlResponse.ok) {
      const err = await mlResponse.json().catch(() => ({}));
      return res.status(mlResponse.status).json({
        error: err.detail || "Unable to retrieve model evaluation metrics",
        status: mlResponse.status
      });
    }

    const metricsData = await mlResponse.json();
    return res.json(metricsData);
  } catch (error) {
    console.error("Failed to connect to ML metrics service:", error.message);
    return res.status(503).json({
      error: "Machine learning metrics service is currently unavailable. Please ensure the Python ML service is running.",
      details: error.message
    });
  }
});

module.exports = router;
