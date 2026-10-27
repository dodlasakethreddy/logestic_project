import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import SearchBar from './SearchBar';

export default function FilterPanel({
  searchTerm,
  onSearchChange,
  department,
  onDepartmentChange,
  attrition,
  onAttritionChange,
  overtime,
  onOvertimeChange,
  onApplySearch,
  onReset,
  departments = []
}) {
  const deptList = departments.length > 0 ? departments : [
    'Finance',
    'Human Resources',
    'IT',
    'Research & Development',
    'Sales'
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs mb-5">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
        {/* Search input */}
        <SearchBar
          value={searchTerm}
          onChange={onSearchChange}
          onClear={() => onSearchChange('')}
          placeholder="Search employees by ID, dept, age..."
        />

        {/* Filter controls row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          {/* Department dropdown */}
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs cursor-pointer flex-1 sm:flex-none"
          >
            <option value="All Departments">All Departments</option>
            {deptList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Attrition status dropdown */}
          <select
            value={attrition}
            onChange={(e) => onAttritionChange(e.target.value)}
            className="text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs cursor-pointer flex-1 sm:flex-none"
          >
            <option value="All Attrition Status">All Attrition Status</option>
            <option value="No">Stayed</option>
            <option value="Yes">Left</option>
          </select>

          {/* Overtime dropdown */}
          <select
            value={overtime}
            onChange={(e) => onOvertimeChange(e.target.value)}
            className="text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs cursor-pointer flex-1 sm:flex-none"
          >
            <option value="All OverTime Status">All OverTime Status</option>
            <option value="Yes">OverTime: Yes</option>
            <option value="No">OverTime: No</option>
          </select>

          {/* Action buttons */}
          <button
            type="button"
            onClick={onApplySearch}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium rounded-lg shadow-xs transition-colors shrink-0"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-medium rounded-lg transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
