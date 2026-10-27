import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function EmployeeTable({ 
  employees = [], 
  offset = 0, 
  sortBy, 
  sortOrder, 
  onSort 
}) {
  const columns = [
    { key: 'index', label: '#', sortable: false },
    { key: 'Age', label: 'Age', sortable: true },
    { key: 'Department', label: 'Department', sortable: true },
    { key: 'MonthlyIncome', label: 'Monthly Income', sortable: true },
    { key: 'JobLevel', label: 'Job Level', sortable: true },
    { key: 'JobSatisfaction', label: 'Job Satisfaction', sortable: true },
    { key: 'OverTime', label: 'OverTime', sortable: true },
    { key: 'YearsAtCompany', label: 'Years at Company', sortable: true },
    { key: 'WorkLifeBalance', label: 'Work Life Balance', sortable: true },
    { key: 'DistanceFromHome', label: 'Distance From Home', sortable: true },
    { key: 'Attrition', label: 'Attrition', sortable: true },
  ];

  const handleSortClick = (key) => {
    if (!onSort) return;
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  if (!employees || employees.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 text-center text-slate-500">
        <p className="text-base font-semibold text-slate-700 mb-1">No employee records found</p>
        <p className="text-xs text-slate-400">Try adjusting your search keywords or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-700">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200 font-semibold">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 ${
                    col.sortable ? 'cursor-pointer hover:bg-slate-100/80 transition-colors select-none' : ''
                  }`}
                  onClick={() => col.sortable && handleSortClick(col.key)}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <span className="text-slate-400">
                        {sortBy === col.key ? (
                          sortOrder === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((emp, idx) => {
              const isAttritionYes = String(emp.Attrition).toLowerCase() === 'yes';
              const isOvertimeYes = String(emp.OverTime).toLowerCase() === 'yes';

              return (
                <tr 
                  key={emp.id || idx} 
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-slate-500">
                    {offset + idx + 1}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {emp.Age}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-700">{emp.Department}</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-800">
                    ${Number(emp.MonthlyIncome).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center sm:text-left">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs">
                      {emp.JobLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{emp.JobSatisfaction}</span>
                      <span className="text-[10px] text-slate-400">/4</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {isOvertimeYes ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {emp.YearsAtCompany} yrs
                  </td>
                  <td className="py-3 px-4">
                    {emp.WorkLifeBalance}/4
                  </td>
                  <td className="py-3 px-4">
                    {emp.DistanceFromHome} km
                  </td>
                  <td className="py-3 px-4">
                    {isAttritionYes ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        No
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
