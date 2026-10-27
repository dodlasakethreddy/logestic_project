import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import FilterPanel from '../components/FilterPanel';
import EmployeeTable from '../components/EmployeeTable';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getEmployees } from '../services/api';

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const [attrition, setAttrition] = useState('All Attrition Status');
  const [overtime, setOvertime] = useState('All OverTime Status');

  // Active applied query state
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    department: 'All Departments',
    attrition: 'All Attrition Status',
    overtime: 'All OverTime Status'
  });

  // Sorting and pagination state
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchEmployeesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const offset = (currentPage - 1) * pageSize;
      const params = {
        limit: pageSize,
        offset,
        search: appliedFilters.search,
        department: appliedFilters.department,
        attrition: appliedFilters.attrition,
        overtime: appliedFilters.overtime,
        sortBy,
        sortOrder
      };

      const res = await getEmployees(params);
      setEmployees(res.employees || []);
      setTotalEmployees(res.filteredTotal !== undefined ? res.filteredTotal : (res.total || 0));
    } catch (err) {
      console.error('Failed to load employees:', err);
      setError(err.message || 'Error fetching employee list');
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, appliedFilters, sortBy, sortOrder]);

  useEffect(() => {
    fetchEmployeesData();
  }, [fetchEmployeesData]);

  const handleApplySearch = () => {
    setCurrentPage(1);
    setAppliedFilters({
      search: searchTerm,
      department,
      attrition,
      overtime
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setDepartment('All Departments');
    setAttrition('All Attrition Status');
    setOvertime('All OverTime Status');
    setCurrentPage(1);
    setAppliedFilters({
      search: '',
      department: 'All Departments',
      attrition: 'All Attrition Status',
      overtime: 'All OverTime Status'
    });
  };

  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  const totalPages = Math.ceil(totalEmployees / pageSize) || 1;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Employees</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View, search, and filter workforce records from the dataset
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/prediction')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Add Employee / Predict</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <FilterPanel
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        department={department}
        onDepartmentChange={setDepartment}
        attrition={attrition}
        onAttritionChange={setAttrition}
        overtime={overtime}
        onOvertimeChange={setOvertime}
        onApplySearch={handleApplySearch}
        onReset={handleReset}
      />

      {/* Main Table / Loading / Error states */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-12">
          <LoadingSpinner message="Fetching employee records..." />
        </div>
      ) : error ? (
        <ErrorMessage
          title="Failed to Load Employees"
          message={error}
          onRetry={fetchEmployeesData}
        />
      ) : (
        <div className="space-y-4">
          <EmployeeTable
            employees={employees}
            offset={(currentPage - 1) * pageSize}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalEmployees}
            pageSize={pageSize}
            onPageChange={(p) => setCurrentPage(p)}
            onPageSizeChange={(s) => {
              setPageSize(s);
              setCurrentPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}
