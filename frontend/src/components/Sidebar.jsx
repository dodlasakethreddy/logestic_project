import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  BarChart3, 
  Settings, 
  BriefcaseBusiness,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employees', label: 'Employees', icon: Users },
    { to: '/prediction', label: 'Prediction', icon: Sparkles },
    { to: '/performance', label: 'Model Performance', icon: BarChart3 },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0a1024] text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-slate-800 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
                <BriefcaseBusiness className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight leading-tight">Employee</h1>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Attrition</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer / Settings */}
        <div className="p-4 border-t border-slate-800/80">
          <button 
            type="button" 
            onClick={() => alert("System Settings: Model v1.0.0, Logistic Regression with 80.50% test accuracy.")}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
}
