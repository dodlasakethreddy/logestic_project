const express = require("express");

const router = express.Router();

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:8000";

// POST /api/predict
router.post("/", async (req, res) => {
  const {
    Age,
    Department,
    MonthlyIncome,
    JobLevel,
    JobSatisfaction,
    OverTime,
    YearsAtCompany,
    WorkLifeBalance,
    DistanceFromHome
  } = req.body;

  // Validate required fields
  const missing = [];
  if (Age === undefined || Age === null || Age === "") missing.push("Age");
  if (!Department) missing.push("Department");
  if (MonthlyIncome === undefined || MonthlyIncome === null || MonthlyIncome === "") missing.push("MonthlyIncome");
  if (JobLevel === undefined || JobLevel === null || JobLevel === "") missing.push("JobLevel");
  if (JobSatisfaction === undefined || JobSatisfaction === null || JobSatisfaction === "") missing.push("JobSatisfaction");
  if (!OverTime) missing.push("OverTime");
  if (YearsAtCompany === undefined || YearsAtCompany === null || YearsAtCompany === "") missing.push("YearsAtCompany");
  if (WorkLifeBalance === undefined || WorkLifeBalance === null || WorkLifeBalance === "") missing.push("WorkLifeBalance");
  if (DistanceFromHome === undefined || DistanceFromHome === null || DistanceFromHome === "") missing.push("DistanceFromHome");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required prediction fields",
      missingFields: missing
    });
  }

  // Value sanity validation
  const ageNum = Number(Age);
  const incomeNum = Number(MonthlyIncome);
  const jobLevelNum = Number(JobLevel);
  const jobSatNum = Number(JobSatisfaction);
  const yearsNum = Number(YearsAtCompany);
  const balanceNum = Number(WorkLifeBalance);
  const distanceNum = Number(DistanceFromHome);

  if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
    return res.status(400).json({ error: "Age must be a valid number between 18 and 100" });
  }
  if (isNaN(incomeNum) || incomeNum <= 0) {
    return res.status(400).json({ error: "MonthlyIncome must be a positive number" });
  }
  if (isNaN(jobLevelNum) || jobLevelNum < 1 || jobLevelNum > 5) {
    return res.status(400).json({ error: "JobLevel must be an integer between 1 and 5" });
  }
  if (isNaN(jobSatNum) || jobSatNum < 1 || jobSatNum > 4) {
    return res.status(400).json({ error: "JobSatisfaction must be an integer between 1 and 4" });
  }
  if (isNaN(yearsNum) || yearsNum < 0 || yearsNum > 60) {
    return res.status(400).json({ error: "YearsAtCompany must be a valid number between 0 and 60" });
  }
  if (isNaN(balanceNum) || balanceNum < 1 || balanceNum > 4) {
    return res.status(400).json({ error: "WorkLifeBalance must be an integer between 1 and 4" });
  }
  if (isNaN(distanceNum) || distanceNum < 0 || distanceNum > 200) {
    return res.status(400).json({ error: "DistanceFromHome must be a valid number between 0 and 200" });
  }

  const payload = {
    Age: ageNum,
    Department: String(Department).trim(),
    MonthlyIncome: incomeNum,
    JobLevel: jobLevelNum,
    JobSatisfaction: jobSatNum,
    OverTime: String(OverTime).trim(),
    YearsAtCompany: yearsNum,
    WorkLifeBalance: balanceNum,
    DistanceFromHome: distanceNum
  };

  try {
    const mlResponse = await fetch(`${ML_API_URL}/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!mlResponse.ok) {
      const errorData = await mlResponse.json().catch(() => ({}));
      return res.status(mlResponse.status).json({
        error: errorData.detail || "Error from machine learning prediction service",
        status: mlResponse.status
      });
    }

    const predictionData = await mlResponse.json();
    return res.json(predictionData);
  } catch (error) {
    console.error("Failed to connect to ML prediction service:", error.message);
    return res.status(503).json({
      error: "Machine learning prediction service is currently unavailable. Please ensure the Python ML service is running on port 8000.",
      details: error.message
    });
  }
});

module.exports = router;
