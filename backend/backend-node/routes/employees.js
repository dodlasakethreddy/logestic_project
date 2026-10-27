const express = require("express");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const router = express.Router();

const csvPath = path.join(
  __dirname,
  "../../data/employee_attrition_2000_10_columns (1).csv"
);

// Cache parsed data in memory for optimal response times
let cachedEmployees = null;
let lastModifiedTime = 0;

function loadDataset() {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(csvPath)) {
      return reject(new Error("Employee CSV file not found"));
    }

    const stats = fs.statSync(csvPath);
    if (cachedEmployees && stats.mtimeMs === lastModifiedTime) {
      return resolve(cachedEmployees);
    }

    const records = [];
    let rowIndex = 0;

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (row) => {
        rowIndex++;
        // Normalize fields
        records.push({
          id: rowIndex,
          displayId: `EMP-${String(rowIndex).padStart(4, "0")}`,
          Age: Number(row.Age) || 0,
          Department: row.Department ? row.Department.trim() : "Unknown",
          MonthlyIncome: Number(row.MonthlyIncome) || 0,
          JobLevel: Number(row.JobLevel) || 1,
          JobSatisfaction: Number(row.JobSatisfaction) || 1,
          OverTime: row.OverTime ? row.OverTime.trim() : "No",
          YearsAtCompany: Number(row.YearsAtCompany) || 0,
          WorkLifeBalance: Number(row.WorkLifeBalance) || 1,
          DistanceFromHome: Number(row.DistanceFromHome) || 0,
          Attrition: row.Attrition ? row.Attrition.trim() : "No"
        });
      })
      .on("end", () => {
        cachedEmployees = records;
        lastModifiedTime = stats.mtimeMs;
        resolve(records);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// GET /api/employees
router.get("/", async (req, res) => {
  try {
    const allEmployees = await loadDataset();
    let filtered = [...allEmployees];

    // Filter by department
    if (req.query.department && req.query.department !== "All Departments" && req.query.department !== "all") {
      const dept = req.query.department.trim().toLowerCase();
      filtered = filtered.filter((e) => e.Department.toLowerCase() === dept);
    }

    // Filter by attrition status
    if (req.query.attrition && req.query.attrition !== "All Attrition Status" && req.query.attrition !== "all") {
      const att = req.query.attrition.trim().toLowerCase();
      if (att === "yes" || att === "left" || att === "leaves") {
        filtered = filtered.filter((e) => e.Attrition.toLowerCase() === "yes");
      } else if (att === "no" || att === "stayed" || att === "stays") {
        filtered = filtered.filter((e) => e.Attrition.toLowerCase() === "no");
      }
    }

    // Filter by overtime status
    if (req.query.overtime && req.query.overtime !== "All OverTime Status" && req.query.overtime !== "all") {
      const ot = req.query.overtime.trim().toLowerCase();
      if (ot === "yes") {
        filtered = filtered.filter((e) => e.OverTime.toLowerCase() === "yes");
      } else if (ot === "no") {
        filtered = filtered.filter((e) => e.OverTime.toLowerCase() === "no");
      }
    }

    // Search query
    if (req.query.search) {
      const q = req.query.search.trim().toLowerCase();
      filtered = filtered.filter((e) => {
        return (
          e.displayId.toLowerCase().includes(q) ||
          e.Department.toLowerCase().includes(q) ||
          String(e.Age).includes(q) ||
          String(e.MonthlyIncome).includes(q) ||
          e.OverTime.toLowerCase().includes(q) ||
          e.Attrition.toLowerCase().includes(q)
        );
      });
    }

    // Sorting
    const sortBy = req.query.sortBy;
    const sortOrder = (req.query.sortOrder || "asc").toLowerCase() === "desc" ? -1 : 1;

    if (sortBy && filtered.length > 0 && sortBy in filtered[0]) {
      filtered.sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];

        if (typeof valA === "string") {
          return valA.localeCompare(valB) * sortOrder;
        }
        return (valA - valB) * sortOrder;
      });
    }

    // Pagination
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const paginatedEmployees = filtered.slice(offset, offset + limit);

    res.json({
      total: allEmployees.length,
      filteredTotal: filtered.length,
      limit,
      offset,
      employees: paginatedEmployees
    });
  } catch (error) {
    console.error("Error retrieving employee records:", error);
    res.status(500).json({
      error: "Unable to retrieve employee records",
      details: error.message
    });
  }
});

module.exports = router;
module.exports.loadDataset = loadDataset;
