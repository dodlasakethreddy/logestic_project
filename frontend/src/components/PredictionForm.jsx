import React, { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';

export default function PredictionForm({ onSubmit, loading, departments = [] }) {
  const defaultValues = {
    Age: 35,
    Department: 'Sales',
    MonthlyIncome: 5000,
    JobLevel: 2,
    JobSatisfaction: 3,
    OverTime: 'Yes',
    YearsAtCompany: 5,
    WorkLifeBalance: 3,
    DistanceFromHome: 10
  };

  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});

  const deptOptions = departments.length > 0 ? departments : [
    'Finance',
    'Human Resources',
    'IT',
    'Research & Development',
    'Sales'
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
    // Clear validation error when modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.Age === '' || formData.Age < 18 || formData.Age > 100) {
      newErrors.Age = 'Age must be between 18 and 100';
    }
    if (!formData.Department) {
      newErrors.Department = 'Department is required';
    }
    if (formData.MonthlyIncome === '' || formData.MonthlyIncome <= 0) {
      newErrors.MonthlyIncome = 'Monthly income must be greater than 0';
    }
    if (formData.JobLevel < 1 || formData.JobLevel > 5) {
      newErrors.JobLevel = 'Job level must be between 1 and 5';
    }
    if (formData.JobSatisfaction < 1 || formData.JobSatisfaction > 4) {
      newErrors.JobSatisfaction = 'Satisfaction rating must be between 1 and 4';
    }
    if (!formData.OverTime) {
      newErrors.OverTime = 'Overtime selection is required';
    }
    if (formData.YearsAtCompany === '' || formData.YearsAtCompany < 0 || formData.YearsAtCompany > 60) {
      newErrors.YearsAtCompany = 'Years at company must be between 0 and 60';
    }
    if (formData.WorkLifeBalance < 1 || formData.WorkLifeBalance > 4) {
      newErrors.WorkLifeBalance = 'Work-life balance must be between 1 and 4';
    }
    if (formData.DistanceFromHome === '' || formData.DistanceFromHome < 0 || formData.DistanceFromHome > 200) {
      newErrors.DistanceFromHome = 'Distance must be between 0 and 200 km';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData(defaultValues);
    setErrors({});
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
      <h2 className="text-base font-bold text-slate-900 mb-1">Employee Details</h2>
      <p className="text-xs text-slate-500 mb-5">
        Provide exact employee metrics to run inference with the trained Logistic Regression model.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Age & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Age <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="Age"
              min="18"
              max="100"
              value={formData.Age}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.Age ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
              placeholder="e.g. 35"
              required
            />
            {errors.Age && <p className="text-[11px] text-rose-500 mt-1">{errors.Age}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              name="Department"
              value={formData.Department}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer ${
                errors.Department ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            >
              {deptOptions.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.Department && <p className="text-[11px] text-rose-500 mt-1">{errors.Department}</p>}
          </div>
        </div>

        {/* Row 2: Monthly Income & Job Level */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Monthly Income ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="MonthlyIncome"
              min="500"
              step="50"
              value={formData.MonthlyIncome}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.MonthlyIncome ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
              placeholder="e.g. 5000"
              required
            />
            {errors.MonthlyIncome && <p className="text-[11px] text-rose-500 mt-1">{errors.MonthlyIncome}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Job Level (1 - 5) <span className="text-rose-500">*</span>
            </label>
            <select
              name="JobLevel"
              value={formData.JobLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value={1}>1 - Entry Level</option>
              <option value={2}>2 - Junior / Associate</option>
              <option value={3}>3 - Mid-Level Specialist</option>
              <option value={4}>4 - Senior / Lead</option>
              <option value={5}>5 - Executive / Director</option>
            </select>
          </div>
        </div>

        {/* Row 3: Job Satisfaction & OverTime */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Job Satisfaction <span className="text-rose-500">*</span>
            </label>
            <select
              name="JobSatisfaction"
              value={formData.JobSatisfaction}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value={1}>1 - Low Satisfaction</option>
              <option value={2}>2 - Medium Satisfaction</option>
              <option value={3}>3 - High Satisfaction</option>
              <option value={4}>4 - Very High Satisfaction</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              OverTime <span className="text-rose-500">*</span>
            </label>
            <select
              name="OverTime"
              value={formData.OverTime}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="Yes">Yes (Regular OverTime)</option>
              <option value="No">No (Standard Hours)</option>
            </select>
          </div>
        </div>

        {/* Row 4: Years at Company & Work Life Balance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Years At Company <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="YearsAtCompany"
              min="0"
              max="60"
              value={formData.YearsAtCompany}
              onChange={handleChange}
              className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
                errors.YearsAtCompany ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
              placeholder="e.g. 5"
              required
            />
            {errors.YearsAtCompany && <p className="text-[11px] text-rose-500 mt-1">{errors.YearsAtCompany}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Work Life Balance <span className="text-rose-500">*</span>
            </label>
            <select
              name="WorkLifeBalance"
              value={formData.WorkLifeBalance}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value={1}>1 - Poor / Bad</option>
              <option value={2}>2 - Good</option>
              <option value={3}>3 - Better</option>
              <option value={4}>4 - Best</option>
            </select>
          </div>
        </div>

        {/* Row 5: Distance From Home */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Distance From Home (km) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            name="DistanceFromHome"
            min="0"
            max="200"
            value={formData.DistanceFromHome}
            onChange={handleChange}
            className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              errors.DistanceFromHome ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
            }`}
            placeholder="e.g. 10"
            required
          />
          {errors.DistanceFromHome && <p className="text-[11px] text-rose-500 mt-1">{errors.DistanceFromHome}</p>}
        </div>

        {/* Button row */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm shadow-blue-500/30 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{loading ? 'Evaluating...' : 'Predict Attrition'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
