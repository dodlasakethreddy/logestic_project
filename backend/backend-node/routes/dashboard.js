const express = require("express");
const { loadDataset } = require("./employees");

const router = express.Router();

// GET /api/dashboard
router.get("/", async (req, res) => {
  try {
    const employees = await loadDataset();
    const total = employees.length;

    if (total === 0) {
      return res.json({
        totalEmployees: 0,
        employeesLeft: 0,
        employeesStayed: 0,
        attritionRate: 0,
        averageAge: 0,
        averageMonthlyIncome: 0,
        averageYearsAtCompany: 0,
        averageJobSatisfaction: 0,
        attritionDistribution: [],
        attritionByDepartment: [],
        attritionByOvertime: [],
        attritionByAgeGroup: [],
        attritionByYearsAtCompany: [],
        attritionByJobSatisfaction: [],
        departmentsList: []
      });
    }

    let leftCount = 0;
    let stayedCount = 0;
    let sumAge = 0;
    let sumIncome = 0;
    let sumYears = 0;
    let sumSatisfaction = 0;

    // Aggregators
    const deptMap = {};
    const otMap = {
      Yes: { overtime: "Yes", stays: 0, leaves: 0, total: 0 },
      No: { overtime: "No", stays: 0, leaves: 0, total: 0 }
    };

    const ageGroupMap = {
      "<25": { group: "<25", stays: 0, leaves: 0, total: 0 },
      "25-35": { group: "25-35", stays: 0, leaves: 0, total: 0 },
      "35-45": { group: "35-45", stays: 0, leaves: 0, total: 0 },
      "45-55": { group: "45-55", stays: 0, leaves: 0, total: 0 },
      ">55": { group: ">55", stays: 0, leaves: 0, total: 0 }
    };

    const yearsMap = {
      "<2": { range: "<2", stays: 0, leaves: 0, total: 0 },
      "2-5": { range: "2-5", stays: 0, leaves: 0, total: 0 },
      "5-10": { range: "5-10", stays: 0, leaves: 0, total: 0 },
      ">10": { range: ">10", stays: 0, leaves: 0, total: 0 }
    };

    const satisfactionMap = {
      "1": { level: "1 - Low", rating: 1, stays: 0, leaves: 0, total: 0 },
      "2": { level: "2 - Medium", rating: 2, stays: 0, leaves: 0, total: 0 },
      "3": { level: "3 - High", rating: 3, stays: 0, leaves: 0, total: 0 },
      "4": { level: "4 - Very High", rating: 4, stays: 0, leaves: 0, total: 0 }
    };

    employees.forEach((emp) => {
      const isLeft = emp.Attrition.toLowerCase() === "yes";
      if (isLeft) {
        leftCount++;
      } else {
        stayedCount++;
      }

      sumAge += emp.Age;
      sumIncome += emp.MonthlyIncome;
      sumYears += emp.YearsAtCompany;
      sumSatisfaction += emp.JobSatisfaction;

      // Department aggregation
      const dept = emp.Department || "Unknown";
      if (!deptMap[dept]) {
        deptMap[dept] = { department: dept, stays: 0, leaves: 0, total: 0 };
      }
      deptMap[dept].total++;
      if (isLeft) {
        deptMap[dept].leaves++;
      } else {
        deptMap[dept].stays++;
      }

      // Overtime aggregation
      const ot = emp.OverTime.toLowerCase() === "yes" ? "Yes" : "No";
      otMap[ot].total++;
      if (isLeft) {
        otMap[ot].leaves++;
      } else {
        otMap[ot].stays++;
      }

      // Age group aggregation
      let ageKey = "<25";
      if (emp.Age > 55) ageKey = ">55";
      else if (emp.Age >= 45) ageKey = "45-55";
      else if (emp.Age >= 35) ageKey = "35-45";
      else if (emp.Age >= 25) ageKey = "25-35";

      ageGroupMap[ageKey].total++;
      if (isLeft) {
        ageGroupMap[ageKey].leaves++;
      } else {
        ageGroupMap[ageKey].stays++;
      }

      // Years at company aggregation
      let yrKey = "<2";
      if (emp.YearsAtCompany > 10) yrKey = ">10";
      else if (emp.YearsAtCompany >= 5) yrKey = "5-10";
      else if (emp.YearsAtCompany >= 2) yrKey = "2-5";

      yearsMap[yrKey].total++;
      if (isLeft) {
        yearsMap[yrKey].leaves++;
      } else {
        yearsMap[yrKey].stays++;
      }

      // Job satisfaction aggregation
      const satKey = String(Math.min(Math.max(Math.round(emp.JobSatisfaction), 1), 4));
      if (satisfactionMap[satKey]) {
        satisfactionMap[satKey].total++;
        if (isLeft) {
          satisfactionMap[satKey].leaves++;
        } else {
          satisfactionMap[satKey].stays++;
        }
      }
    });

    const attritionRate = Number(((leftCount / total) * 100).toFixed(2));
    const averageAge = Number((sumAge / total).toFixed(1));
    const averageMonthlyIncome = Math.round(sumIncome / total);
    const averageYearsAtCompany = Number((sumYears / total).toFixed(1));
    const averageJobSatisfaction = Number((sumSatisfaction / total).toFixed(1));

    // Calculate rates for departments
    const attritionByDepartment = Object.values(deptMap).map((d) => ({
      ...d,
      attritionRate: d.total ? Number(((d.leaves / d.total) * 100).toFixed(2)) : 0
    }));

    const attritionByOvertime = Object.values(otMap).map((o) => ({
      ...o,
      attritionRate: o.total ? Number(((o.leaves / o.total) * 100).toFixed(2)) : 0
    }));

    const attritionByAgeGroup = Object.values(ageGroupMap);
    const attritionByYearsAtCompany = Object.values(yearsMap);
    const attritionByJobSatisfaction = Object.values(satisfactionMap);

    const attritionDistribution = [
      {
        name: "Stayed (No)",
        value: stayedCount,
        count: stayedCount,
        percentage: Number(((stayedCount / total) * 100).toFixed(1)),
        color: "#3b82f6"
      },
      {
        name: "Left (Yes)",
        value: leftCount,
        count: leftCount,
        percentage: Number(((leftCount / total) * 100).toFixed(1)),
        color: "#f43f5e"
      }
    ];

    const departmentsList = Object.keys(deptMap).sort();

    res.json({
      totalEmployees: total,
      employeesLeft: leftCount,
      employeesStayed: stayedCount,
      attritionRate,
      averageAge,
      averageMonthlyIncome,
      averageYearsAtCompany,
      averageJobSatisfaction,
      attritionDistribution,
      attritionByDepartment,
      attritionByOvertime,
      attritionByAgeGroup,
      attritionByYearsAtCompany,
      attritionByJobSatisfaction,
      departmentsList
    });
  } catch (error) {
    console.error("Error calculating dashboard metrics:", error);
    res.status(500).json({
      error: "Unable to calculate dashboard metrics",
      details: error.message
    });
  }
});

module.exports = router;
