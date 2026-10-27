import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'blue', 
  trend 
}) {
  const colorStyles = {
    blue: {
      bg: 'bg-blue-50 text-blue-600',
      badge: 'text-blue-700 bg-blue-100',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      badge: 'text-emerald-700 bg-emerald-100',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      badge: 'text-rose-700 bg-rose-100',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      badge: 'text-amber-700 bg-amber-100',
    },
    purple: {
      bg: 'bg-purple-50 text-purple-600',
      badge: 'text-purple-700 bg-purple-100',
    },
    indigo: {
      bg: 'bg-indigo-50 text-indigo-600',
      badge: 'text-indigo-700 bg-indigo-100',
    },
    orange: {
      bg: 'bg-orange-50 text-orange-600',
      badge: 'text-orange-700 bg-orange-100',
    }
  };

  const currentTheme = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h2>
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentTheme.bg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center text-xs">
          <span className={`font-semibold mr-1.5 ${trend.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend.value}
          </span>
          <span className="text-slate-400">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
