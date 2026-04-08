// Pages/System/Statistics.jsx
import { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  CreditCard,
  Car,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Download,
  FileText,
  RefreshCw,
  Award,
  Target,
  UserCheck,
  UserX,
  Percent,
  Wallet,
  Receipt,
  Calendar as CalendarIcon,
  Star,
  Minus,
  Loader,
  Filter,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../Styles/System/Statistics.scss';
import { Link } from 'react-router-dom';

/* ─────────────── Mock Data ─────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Revenue data by month
const REVENUE_DATA = {
  labels: MONTHS,
  datasets: [
    {
      name: 'Registration Fees',
      data: [45000, 52000, 48000, 61000, 58000, 72000, 85000, 78000, 69000, 74000, 82000, 91000],
      color: '#8cff2e',
    },
    {
      name: 'Session Payments',
      data: [28000, 31000, 35000, 42000, 45000, 53000, 62000, 58000, 49000, 54000, 61000, 68000],
      color: '#3b82f6',
    },
    {
      name: 'Exam Fees',
      data: [8000, 7500, 8200, 7800, 8500, 9200, 9800, 8900, 7600, 8100, 8700, 9400],
      color: '#f59e0b',
    },
  ],
};

// Student registrations by month
const STUDENT_REGISTRATIONS = {
  labels: MONTHS,
  data: [12, 15, 14, 18, 20, 25, 30, 28, 22, 24, 27, 32],
};

// Session completion rate by month
const SESSION_COMPLETION = {
  labels: MONTHS,
  scheduled: [45, 52, 48, 58, 62, 75, 88, 82, 68, 72, 78, 85],
  completed: [38, 44, 41, 50, 54, 66, 78, 72, 60, 64, 69, 76],
  cancelled: [5, 6, 5, 6, 6, 7, 8, 8, 6, 6, 7, 7],
  noShow: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
};

// Payment method distribution
const PAYMENT_METHODS_DISTRIBUTION = [
  { name: 'Cash', value: 45, color: '#8cff2e' },
  { name: 'Bank Transfer', value: 25, color: '#3b82f6' },
  { name: 'Card', value: 18, color: '#10b981' },
  { name: 'Cheque', value: 7, color: '#f59e0b' },
  { name: 'Online', value: 5, color: '#8b5cf6' },
];

// Category distribution
const CATEGORY_DISTRIBUTION = [
  { name: 'Category B', value: 68, color: '#8cff2e' },
  { name: 'Category A', value: 12, color: '#3b82f6' },
  { name: 'Category C', value: 8, color: '#f59e0b' },
  { name: 'Category D', value: 5, color: '#ef4444' },
  { name: 'Category BE', value: 4, color: '#8b5cf6' },
  { name: 'Category A1', value: 3, color: '#06b6d4' },
];

// Top performing instructors
const TOP_INSTRUCTORS = [
  {
    id: 1,
    name: 'Mohammed Benali',
    sessions: 156,
    completion_rate: 94,
    revenue: 31200,
    rating: 4.8,
  },
  { id: 2, name: 'Fatima Zahra', sessions: 142, completion_rate: 92, revenue: 28400, rating: 4.7 },
  { id: 3, name: 'Karim Tazi', sessions: 128, completion_rate: 89, revenue: 25600, rating: 4.6 },
  {
    id: 4,
    name: 'Nadia Ouazzani',
    sessions: 118,
    completion_rate: 91,
    revenue: 23600,
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Hassan El Fassi',
    sessions: 98,
    completion_rate: 87,
    revenue: 19600,
    rating: 4.5,
  },
];

// Recent transactions
const RECENT_TRANSACTIONS = [
  {
    id: 1,
    date: '2025-04-07',
    student: 'Youssef Alami',
    amount: 3000,
    type: 'Registration',
    status: 'Paid',
  },
  {
    id: 2,
    date: '2025-04-07',
    student: 'Fatima Benali',
    amount: 450,
    type: 'Exam',
    status: 'Paid',
  },
  {
    id: 3,
    date: '2025-04-06',
    student: 'Karim Cherkaoui',
    amount: 200,
    type: 'Session',
    status: 'Pending',
  },
  {
    id: 4,
    date: '2025-04-06',
    student: 'Nadia Tazi',
    amount: 6000,
    type: 'Registration',
    status: 'Paid',
  },
  {
    id: 5,
    date: '2025-04-05',
    student: 'Hassan Ouazzani',
    amount: 200,
    type: 'Session',
    status: 'Paid',
  },
];

// Vehicle utilization
const VEHICLE_UTILIZATION = [
  { id: 1, name: 'Dacia Sandero', plate: '12345-A-1', utilization: 78, sessions: 142 },
  { id: 2, name: 'Renault Clio', plate: '67890-B-2', utilization: 85, sessions: 218 },
  { id: 3, name: 'Honda CB500', plate: '11223-C-3', utilization: 62, sessions: 67 },
  { id: 4, name: 'Mercedes Actros', plate: '44556-D-4', utilization: 45, sessions: 89 },
  { id: 5, name: 'Peugeot 208', plate: '99887-E-5', utilization: 58, sessions: 44 },
];

/* ─────────────── Helper Functions for Filtering ─────────────── */

// Filter data by date range - FIXED
const filterDataByDateRange = (data, dateRange, labels) => {
  // Return all data for year view or invalid dateRange
  if (dateRange === 'year' || !dateRange || dateRange === 'custom') {
    return { filteredData: data, filteredLabels: labels };
  }

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0-11
  let startIndex = 0;
  let endIndex = labels.length;

  switch (dateRange) {
    case 'month':
      startIndex = currentMonth;
      endIndex = currentMonth + 1;
      break;
    case 'quarter': {
      const quarterStart = Math.floor(currentMonth / 3) * 3;
      startIndex = quarterStart;
      endIndex = Math.min(quarterStart + 3, labels.length);
      break;
    }
    case 'week':
      // Show last 2 months for week view
      startIndex = Math.max(0, currentMonth - 1);
      endIndex = Math.min(currentMonth + 1, labels.length);
      break;
    default:
      return { filteredData: data, filteredLabels: labels };
  }

  // Ensure indices are within valid range
  startIndex = Math.max(0, Math.min(startIndex, labels.length - 1));
  endIndex = Math.max(startIndex + 1, Math.min(endIndex, labels.length));

  const filteredLabels = labels.slice(startIndex, endIndex);

  // Handle different data formats
  let filteredData;
  if (Array.isArray(data)) {
    // Simple array data
    filteredData = data.slice(startIndex, endIndex);
  } else if (data && Array.isArray(data.data)) {
    // Dataset format (like REVENUE_DATA.datasets)
    filteredData = data.map((dataset) => ({
      ...dataset,
      data: dataset.data.slice(startIndex, endIndex),
    }));
  } else if (data && typeof data === 'object' && !Array.isArray(data)) {
    // Object with multiple arrays (like SESSION_COMPLETION)
    filteredData = {};
    for (const key in data) {
      if (Array.isArray(data[key])) {
        filteredData[key] = data[key].slice(startIndex, endIndex);
      } else {
        filteredData[key] = data[key];
      }
    }
  } else {
    filteredData = data;
  }

  return { filteredData, filteredLabels };
};

/* ─────────────── Sub-components ─────────────── */

// Simple Bar Chart Component
const BarChart = ({ data, labels, title, color = '#8cff2e', height = 300 }) => {
  const maxValue = Math.max(...data, 1);

  return (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="bar-chart" style={{ height: `${height}px` }}>
        {data.map((value, index) => (
          <div key={index} className="bar-wrapper">
            <div
              className="bar"
              style={{
                height: `${(value / maxValue) * 100}%`,
                backgroundColor: color,
              }}
            >
              <span className="bar-value">{value.toLocaleString()}</span>
            </div>
            <span className="bar-label">{labels[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Line Chart Component
const LineChartComponent = ({ datasets, labels, title, height = 300 }) => {
  const maxValue = Math.max(...datasets.flatMap((d) => d.data), 1);
  const chartWidth = Math.max(labels.length * 60, 300);

  return (
    <div className="chart-container">
      <h4>{title}</h4>
      <div className="line-chart" style={{ height: `${height}px` }}>
        <svg className="line-chart-svg" viewBox={`0 0 ${chartWidth} ${height}`}>
          {datasets.map((dataset, datasetIndex) => {
            const points = dataset.data
              .map((value, index) => {
                const x = index * 60 + 30;
                const y = height - (value / maxValue) * (height - 40);
                return `${x},${y}`;
              })
              .join(' ');

            return (
              <polyline
                key={datasetIndex}
                points={points}
                fill="none"
                stroke={dataset.color}
                strokeWidth="2"
                className="chart-line"
              />
            );
          })}
        </svg>
        <div className="line-labels">
          {labels.map((label, index) => (
            <span key={index} className="line-label">
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="chart-legend">
        {datasets.map((dataset, index) => (
          <div key={index} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: dataset.color }}></span>
            <span>{dataset.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Pie Chart Component
const PieChartComponent = ({ data, title, size = 200 }) => {
  let cumulativeAngle = 0;

  return (
    <div className="chart-container pie-chart-container">
      <h4>{title}</h4>
      <div className="pie-chart-wrapper">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((item, index) => {
            const angle = (item.value / 100) * 360;
            const startAngle = cumulativeAngle;
            const endAngle = cumulativeAngle + angle;
            cumulativeAngle += angle;

            const startRad = ((startAngle - 90) * Math.PI) / 180;
            const endRad = ((endAngle - 90) * Math.PI) / 180;

            const x1 = size / 2 + (size / 2 - 10) * Math.cos(startRad);
            const y1 = size / 2 + (size / 2 - 10) * Math.sin(startRad);
            const x2 = size / 2 + (size / 2 - 10) * Math.cos(endRad);
            const y2 = size / 2 + (size / 2 - 10) * Math.sin(endRad);

            const largeArc = angle > 180 ? 1 : 0;

            const pathData = `M ${size / 2} ${size / 2} L ${x1} ${y1} A ${size / 2 - 10} ${size / 2 - 10} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <path key={index} d={pathData} fill={item.color} stroke="white" strokeWidth="2" />
            );
          })}
          <circle cx={size / 2} cy={size / 2} r={size / 4} fill="white" />
        </svg>
        <div className="pie-legend">
          {data.map((item, index) => (
            <div key={index} className="pie-legend-item">
              <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
              <span>{item.name}</span>
              <span className="legend-value">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// KPI Card Component
const KpiCard = ({
  icon: IconComponent,
  label,
  value,
  change,
  changeType,
  prefix = '',
  suffix = '',
}) => {
  const Icon = IconComponent;
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{Icon && <Icon size={24} />}</div>
      <div className="kpi-info">
        <div className="kpi-value">
          {prefix}
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix}
        </div>
        <div className="kpi-label">{label}</div>
        {change !== undefined && (
          <div
            className={`kpi-change ${changeType === 'up' ? 'positive' : changeType === 'down' ? 'negative' : 'neutral'}`}
          >
            {changeType === 'up' && <TrendingUp size={12} />}
            {changeType === 'down' && <TrendingDown size={12} />}
            {changeType === 'neutral' && <Minus size={12} />}
            <span>{Math.abs(change)}% vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon: IconComponent, label, value, color }) => {
  const Icon = IconComponent;
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        {Icon && <Icon size={20} />}
      </div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

// Toast Component
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div className={`toast-notification toast-${toast.type}`}>
      {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.msg}
    </div>
  );
};

/* ─────────────── Main Component ─────────────── */
const Statistics = () => {
  const [dateRange, setDateRange] = useState('year');
  const [filterType, setFilterType] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [toast, setToast] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter and sort data based on selected filters
  const filteredInstructors = useMemo(() => {
    let filtered = [...TOP_INSTRUCTORS];

    if (filterType !== 'All') {
      filtered = filtered.filter(
        (instructor) => instructor.sessions > (filterType === 'Driving' ? 120 : 100),
      );
    }

    return filtered;
  }, [filterType]);

  const filteredTransactions = useMemo(() => {
    let filtered = [...RECENT_TRANSACTIONS];

    if (filterCategory !== 'All') {
      filtered = filtered.filter((t) => t.type === filterCategory);
    }

    return filtered;
  }, [filterCategory]);

  // Filter revenue data by date range
  const filteredRevenueData = useMemo(() => {
    const { filteredData, filteredLabels } = filterDataByDateRange(
      REVENUE_DATA.datasets,
      dateRange,
      REVENUE_DATA.labels,
    );
    return { datasets: filteredData, labels: filteredLabels };
  }, [dateRange]);

  // Filter student registrations by date range
  const filteredStudentData = useMemo(() => {
    const { filteredData, filteredLabels } = filterDataByDateRange(
      STUDENT_REGISTRATIONS.data,
      dateRange,
      STUDENT_REGISTRATIONS.labels,
    );
    return { data: filteredData, labels: filteredLabels };
  }, [dateRange]);

  // Filter session data by date range
  const filteredSessionData = useMemo(() => {
    const { filteredLabels } = filterDataByDateRange(
      SESSION_COMPLETION.scheduled,
      dateRange,
      SESSION_COMPLETION.labels,
    );

    const filterArrayData = (dataArray) => {
      const { filteredData } = filterDataByDateRange(
        dataArray,
        dateRange,
        SESSION_COMPLETION.labels,
      );
      return filteredData;
    };

    return {
      labels: filteredLabels,
      scheduled: filterArrayData(SESSION_COMPLETION.scheduled),
      completed: filterArrayData(SESSION_COMPLETION.completed),
      cancelled: filterArrayData(SESSION_COMPLETION.cancelled),
      noShow: filterArrayData(SESSION_COMPLETION.noShow),
    };
  }, [dateRange]);

  // Calculate KPIs based on filtered data
  const kpis = useMemo(() => {
    const totalRevenue = filteredRevenueData.datasets.reduce(
      (sum, ds) => sum + ds.data.reduce((s, v) => s + v, 0),
      0,
    );
    const totalStudents = filteredStudentData.data.reduce((a, b) => a + b, 0);
    const totalSessions = filteredSessionData.scheduled.reduce((a, b) => a + b, 0);
    const completedSessions = filteredSessionData.completed.reduce((a, b) => a + b, 0);
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    const avgRevenuePerStudent = totalStudents > 0 ? totalRevenue / totalStudents : 0;
    const currentMonthRevenue = filteredRevenueData.datasets.reduce(
      (sum, ds) => sum + (ds.data[ds.data.length - 1] || 0),
      0,
    );
    const previousMonthRevenue = filteredRevenueData.datasets.reduce(
      (sum, ds) => sum + (ds.data[ds.data.length - 2] || 0),
      0,
    );
    const revenueChange =
      previousMonthRevenue > 0
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : 0;

    return {
      totalRevenue,
      totalStudents,
      totalSessions,
      completionRate,
      avgRevenuePerStudent,
      revenueChange,
      currentMonthRevenue,
    };
  }, [filteredRevenueData, filteredStudentData, filteredSessionData]);

  // Get current month data
  const currentMonth = MONTHS[new Date().getMonth()];

  const handleExport = (format) => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast(`Report exported as ${format.toUpperCase()}`);
      addNotification(
        'Report Exported',
        `Statistics report has been exported as ${format.toUpperCase()}`,
        'system',
      );
    }, 1500);
  };

  const handleRefresh = () => {
    showToast('Data refreshed successfully');
    addNotification('Data Refreshed', 'Statistics data has been updated', 'system');
  };

  const resetFilters = () => {
    setDateRange('year');
    setFilterType('All');
    setFilterCategory('All');
    showToast('Filters reset successfully');
  };

  return (
    <div className="statistics-page">
      <Toast toast={toast} />

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Analytics & Statistics</h1>
            <p>Comprehensive insights into your driving school performance</p>
          </div>
          <div className="header-actions">
            <button className="action-btn refresh" onClick={handleRefresh}>
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="action-btn export" onClick={() => handleExport('pdf')}>
              <FileText size={16} />
              Export PDF
            </button>
            <button className="action-btn export" onClick={() => handleExport('excel')}>
              <Download size={16} />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="date-range-selector">
        <button
          className={dateRange === 'week' ? 'active' : ''}
          onClick={() => setDateRange('week')}
        >
          This Week
        </button>
        <button
          className={dateRange === 'month' ? 'active' : ''}
          onClick={() => setDateRange('month')}
        >
          This Month
        </button>
        <button
          className={dateRange === 'quarter' ? 'active' : ''}
          onClick={() => setDateRange('quarter')}
        >
          This Quarter
        </button>
        <button
          className={dateRange === 'year' ? 'active' : ''}
          onClick={() => setDateRange('year')}
        >
          This Year
        </button>
        <button
          className={dateRange === 'custom' ? 'active' : ''}
          onClick={() => setDateRange('custom')}
        >
          Custom Range
        </button>
        <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
          <Filter size={16} />
          Filters
          {(filterType !== 'All' || filterCategory !== 'All') && <span className="filter-badge" />}
        </button>
        {(filterType !== 'All' || filterCategory !== 'All') && (
          <button className="reset-filters" onClick={resetFilters}>
            Reset
          </button>
        )}
      </div>

      {/* Additional Filters */}
      {showFilters && (
        <div className="additional-filters">
          <div className="filter-group">
            <label>Session Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Driving">Driving</option>
              <option value="Code">Code</option>
              <option value="Exam">Exam</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Payment Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              <option value="Registration">Registration</option>
              <option value="Session">Session</option>
              <option value="Exam">Exam</option>
            </select>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KpiCard
          icon={DollarSign}
          label="Total Revenue"
          value={kpis.totalRevenue}
          prefix="MAD "
          change={kpis.revenueChange}
          changeType={kpis.revenueChange >= 0 ? 'up' : 'down'}
        />
        <KpiCard
          icon={Users}
          label="Total Students"
          value={kpis.totalStudents}
          change={8.5}
          changeType="up"
        />
        <KpiCard
          icon={Car}
          label="Total Sessions"
          value={kpis.totalSessions}
          change={12.3}
          changeType="up"
        />
        <KpiCard
          icon={Target}
          label="Completion Rate"
          value={`${Math.round(kpis.completionRate)}`}
          suffix="%"
          change={3.2}
          changeType="up"
        />
        <KpiCard
          icon={Wallet}
          label="Avg Revenue/Student"
          value={Math.round(kpis.avgRevenuePerStudent)}
          prefix="MAD "
          change={-2.1}
          changeType="down"
        />
        <KpiCard
          icon={CalendarIcon}
          label={`Revenue (${currentMonth})`}
          value={kpis.currentMonthRevenue}
          prefix="MAD "
          change={5.4}
          changeType="up"
        />
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats">
        <StatCard icon={UserCheck} label="Active Students" value="156" color="#8cff2e" />
        <StatCard icon={UserX} label="Inactive Students" value="23" color="#ef4444" />
        <StatCard icon={Percent} label="Passing Rate" value="87%" color="#10b981" />
        <StatCard icon={Star} label="Avg Rating" value="4.8/5" color="#f59e0b" />
        <StatCard icon={Clock} label="Avg Session Duration" value="92 min" color="#3b82f6" />
        <StatCard icon={Award} label="Top Category" value="Category B" color="#8cff2e" />
      </div>

      {/* Main Charts Row */}
      <div className="charts-row">
        <div className="chart-card large">
          <LineChartComponent
            datasets={filteredRevenueData.datasets}
            labels={filteredRevenueData.labels}
            title="Revenue Trends"
            height={350}
          />
        </div>
        <div className="chart-card">
          <BarChart
            data={filteredStudentData.data}
            labels={filteredStudentData.labels}
            title="Student Registrations"
            color="#8cff2e"
            height={300}
          />
        </div>
      </div>

      {/* Second Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <LineChartComponent
            datasets={[
              { name: 'Scheduled', data: filteredSessionData.scheduled, color: '#3b82f6' },
              { name: 'Completed', data: filteredSessionData.completed, color: '#10b981' },
              { name: 'Cancelled', data: filteredSessionData.cancelled, color: '#ef4444' },
              { name: 'No Show', data: filteredSessionData.noShow, color: '#f59e0b' },
            ]}
            labels={filteredSessionData.labels}
            title="Session Analytics"
            height={300}
          />
        </div>
        <div className="chart-card">
          <PieChartComponent
            data={PAYMENT_METHODS_DISTRIBUTION}
            title="Payment Methods Distribution"
            size={200}
          />
        </div>
        <div className="chart-card">
          <PieChartComponent
            data={CATEGORY_DISTRIBUTION}
            title="Category Distribution"
            size={200}
          />
        </div>
      </div>

      {/* Third Row - Tables */}
      <div className="tables-row">
        {/* Top Instructors */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Award size={18} /> Top Performing Instructors
            </h3>
            <Link to={'/system/instructors'} className="view-all">
              View All →
            </Link>
          </div>
          <div className="instructors-table-wrapper">
            <table className="instructors-table">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Sessions</th>
                  <th>Completion Rate</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstructors.map((instructor) => (
                  <tr key={instructor.id}>
                    <td>
                      <div className="instructor-cell">
                        <div className="instructor-avatar">
                          {instructor.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span>{instructor.name}</span>
                      </div>
                    </td>
                    <td>{instructor.sessions}</td>
                    <td>
                      <div className="completion-cell">
                        <div className="completion-bar">
                          <div
                            className="completion-fill"
                            style={{ width: `${instructor.completion_rate}%` }}
                          />
                        </div>
                        <span>{instructor.completion_rate}%</span>
                      </div>
                    </td>
                    <td>{instructor.revenue.toLocaleString()} MAD</td>
                    <td>
                      <div className="rating">
                        <Star size={12} fill="#f59e0b" color="#f59e0b" />
                        <span>{instructor.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Receipt size={18} /> Recent Transactions
            </h3>
            <Link to={'/system/payments'} className="view-all">
              View All →
            </Link>
          </div>
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.date}</td>
                    <td>{transaction.student}</td>
                    <td className="amount">{transaction.amount.toLocaleString()} MAD</td>
                    <td>
                      <span className={`type-badge ${transaction.type.toLowerCase()}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Vehicle Utilization */}
      <div className="table-card full-width">
        <div className="table-header">
          <h3>
            <Car size={18} /> Vehicle Utilization
          </h3>
          <Link to={'/system/vehicles'} className="view-all">
            View Details →
          </Link>
        </div>
        <div className="vehicles-table-wrapper">
          <table className="vehicles-utilization-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Plate</th>
                <th>Sessions</th>
                <th>Utilization</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {VEHICLE_UTILIZATION.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>
                    <div className="vehicle-cell">
                      <Car size={16} />
                      <span>{vehicle.name}</span>
                    </div>
                  </td>
                  <td className="plate">{vehicle.plate}</td>
                  <td>{vehicle.sessions}</td>
                  <td>
                    <div className="utilization-cell">
                      <div className="utilization-bar">
                        <div
                          className="utilization-fill"
                          style={{ width: `${vehicle.utilization}%` }}
                        />
                      </div>
                      <span>{vehicle.utilization}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${vehicle.utilization > 70 ? 'active' : vehicle.utilization > 40 ? 'partial' : 'low'}`}
                    >
                      {vehicle.utilization > 70
                        ? 'High Usage'
                        : vehicle.utilization > 40
                          ? 'Medium Usage'
                          : 'Low Usage'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Loading Overlay */}
      {isExporting && (
        <div className="export-overlay">
          <div className="export-loading">
            <Loader size={32} className="spinner" />
            <p>Generating report...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
