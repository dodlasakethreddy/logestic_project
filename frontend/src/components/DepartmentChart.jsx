import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function DepartmentChart({ data = [] }) {
  // Format department labels for readability
  const formattedData = data.map((d) => ({
    ...d,
    shortName: d.department === 'Research & Development' ? 'R&D' : 
               d.department === 'Human Resources' ? 'HR' : d.department
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          <p className="font-bold border-b border-slate-700 pb-1 mb-1">{item.department}</p>
          <p className="text-blue-400">
            Stays: <span className="font-semibold text-white">{item.stays}</span>
          </p>
          <p className="text-rose-400">
            Left: <span className="font-semibold text-white">{item.leaves}</span>
          </p>
          <p className="text-amber-400">
            Rate: <span className="font-semibold text-white">{item.attritionRate}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={formattedData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="shortName" 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            axisLine={{ stroke: '#e2e8f0' }} 
            tickLine={false} 
          />
          <YAxis 
            tick={{ fontSize: 11, fill: '#64748b' }} 
            axisLine={false} 
            tickLine={false} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            height={30} 
            formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
          />
          <Bar dataKey="stays" name="Stays" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="leaves" name="Left" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
