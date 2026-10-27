import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function AttritionChart({ data = [], attritionRate = 0 }) {
  const COLORS = ['#3b82f6', '#f43f5e'];

  const formattedData = data.length > 0 ? data : [
    { name: 'Stayed (No)', value: 1610, color: '#3b82f6' },
    { name: 'Left (Yes)', value: 390, color: '#f43f5e' }
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          <p className="font-semibold">{item.name}</p>
          <p className="text-slate-300">
            Count: <span className="font-bold text-white">{item.value?.toLocaleString()}</span>
          </p>
          {item.payload.percentage !== undefined && (
            <p className="text-slate-300">
              Share: <span className="font-bold text-white">{item.payload.percentage}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="48%"
            innerRadius={65}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            formatter={(value) => <span className="text-xs text-slate-600">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center percentage badge */}
      <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="text-xl font-bold text-slate-800">{attritionRate}%</span>
        <span className="block text-[11px] font-medium text-rose-500 uppercase tracking-tight">Left</span>
      </div>
    </div>
  );
}
