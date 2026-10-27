import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserMinus, 
  UserCheck, 
  AlertTriangle, 
  User, 
  DollarSign, 
  Briefcase, 
  Star 
} from 'lucide-react';
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

import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import AttritionChart from '../components/AttritionChart';
import DepartmentChart from '../components/DepartmentChart';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getDashboard } from '../services/api';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <LoadingSpinner message="Calculating dashboard statistics and distribution metrics..." size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center min-h-[500px]">
        <ErrorMessage
          title="Unable to Load Dashboard Data"
          message={`${error}\n\nPlease verify that the Node.js backend server is running on port 5000 and the dataset CSV exists.`}
          onRetry={fetchDashboardData}
        />
      </div>
    );
  }

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg">
          <p className="font-bold border-b border-slate-700 pb-1 mb-1">{label}</p>
          <p className="text-blue-400">
            Stays: <span className="font-semibold text-white">{payload.find(p => p.dataKey === 'stays')?.value ?? 0}</span>
          </p>
          <p className="text-rose-400">
            Left: <span className="font-semibold text-white">{payload.find(p => p.dataKey === 'leaves')?.value ?? 0}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Overview of employee attrition and key organizational insights
        </p>
      </div>

      {/* 8 Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Total Employees"
          value={data?.totalEmployees?.toLocaleString() || '0'}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Employees Left"
          value={data?.employeesLeft?.toLocaleString() || '0'}
          icon={UserMinus}
          color="rose"
        />
        <StatCard
          title="Employees Stayed"
          value={data?.employeesStayed?.toLocaleString() || '0'}
          icon={UserCheck}
          color="emerald"
        />
        <StatCard
          title="Attrition Rate"
          value={`${data?.attritionRate || 0}%`}
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Average Age"
          value={data?.averageAge ? `${data.averageAge} yrs` : '0'}
          icon={User}
          color="amber"
        />
        <StatCard
          title="Average Monthly Income"
          value={data?.averageMonthlyIncome ? `$${data.averageMonthlyIncome.toLocaleString()}` : '$0'}
          icon={DollarSign}
          color="orange"
        />
        <StatCard
          title="Avg Years at Company"
          value={data?.averageYearsAtCompany ? `${data.averageYearsAtCompany} yrs` : '0'}
          icon={Briefcase}
          color="indigo"
        />
        <StatCard
          title="Avg Job Satisfaction"
          value={data?.averageJobSatisfaction ? `${data.averageJobSatisfaction} / 4` : '0'}
          icon={Star}
          color="purple"
        />
      </div>

      {/* Charts Grid: 2 rows of 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* 1. Attrition Distribution */}
        <ChartCard
          title="Attrition Distribution"
          subtitle="Proportion of stayed vs departed workforce"
        >
          <AttritionChart
            data={data?.attritionDistribution}
            attritionRate={data?.attritionRate || 0}
          />
        </ChartCard>

        {/* 2. Attrition by Department */}
        <ChartCard
          title="Attrition by Department"
          subtitle="Breakdown by operational unit"
        >
          <DepartmentChart data={data?.attritionByDepartment || []} />
        </ChartCard>

        {/* 3. Attrition by OverTime */}
        <ChartCard
          title="Attrition by OverTime"
          subtitle="Comparison between overtime workers"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data?.attritionByOvertime || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="overtime" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend verticalAlign="top" align="right" height={30} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              <Bar dataKey="stays" name="Stays" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leaves" name="Left" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Attrition by Age Group */}
        <ChartCard
          title="Attrition by Age Group"
          subtitle="Distribution across employee generations"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data?.attritionByAgeGroup || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="group" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend verticalAlign="top" align="right" height={30} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              <Bar dataKey="stays" name="Stays" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leaves" name="Left" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Attrition by Years at Company */}
        <ChartCard
          title="Attrition by Years at Company"
          subtitle="Tenure-based attrition trends"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data?.attritionByYearsAtCompany || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend verticalAlign="top" align="right" height={30} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              <Bar dataKey="stays" name="Stays" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leaves" name="Left" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Attrition by Job Satisfaction */}
        <ChartCard
          title="Attrition by Job Satisfaction"
          subtitle="Retention rates by workplace satisfaction rating"
        >
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={data?.attritionByJobSatisfaction || []}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="rating" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend verticalAlign="top" align="right" height={30} formatter={(v) => <span className="text-xs text-slate-600">{v}</span>} />
              <Bar dataKey="stays" name="Stays" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="leaves" name="Left" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
