import React from 'react';

export default function ChartCard({ title, subtitle, action, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="w-full flex-1 min-h-[220px]">
        {children}
      </div>
    </div>
  );
}
