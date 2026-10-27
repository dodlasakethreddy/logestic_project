import React, { useState } from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ onMenuClick, title, subtitle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState('Last 30 Days');

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 shadow-xs">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Page header (or global search) */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick search */}
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right actions: Date filter, notifications, user avatar */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Date range filter dropdown */}
          <div className="relative">
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
            >
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Quarter to Date">Quarter to Date</option>
              <option value="Year to Date">Year to Date</option>
              <option value="All Time">All Time Records</option>
            </select>
          </div>

          {/* Notification bell */}
          <button 
            type="button" 
            aria-label="Notifications"
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User profile */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-xs">
              S
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">Saketh Reddy</p>
              <p className="text-[10px] text-slate-500">HR Analytics Lead</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
