// Pages/System/Statistics.jsx
import { useState, useEffect, useCallback } from 'react';
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
  BarChart3,
  LineChart,
  PieChart,
  AreaChart,
  X,
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import axios from '../../services/axios';
import '../../Styles/System/Statistics.scss';
import { Link } from 'react-router-dom';

/* ─────────────── Constants ─────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATE_RANGES = [
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'This Quarter' },
  { value: 'year', label: 'This Year' },
];

const SESSION_TYPES = ['Driving', 'Code', 'Both'];
const PAYMENT_CATEGORIES = ['Registration', 'Session', 'Exam', 'Maintenance', 'Incident'];

/* ─────────────── Helper Functions ─────────────── */
const formatCurrency = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toString();
};

/* ─────────────── Chart Components ─────────────── */

// Revenue Trends Chart (Updated for expenses)
const RevenueTrendsChart = ({
  datasets = [],
  expensesDatasets = [],
  labels = MONTHS,
  height = 350,
}) => {
  const allData = [
    ...datasets.flatMap((d) => d.data || []),
    ...(expensesDatasets?.flatMap((d) => d.data || []) || []),
  ];
  const maxValue = Math.max(...allData, 1);
  const chartWidth = Math.max(labels.length * 80, 500);
  const padding = { top: 30, right: 30, bottom: 30, left: 50 };
  const chartHeight = height - padding.top - padding.bottom;
  const stepX =
    chartHeight > 0 ? (chartWidth - padding.left - padding.right) / (labels.length - 1) : 0;

  const getX = (index) => padding.left + index * stepX;
  const getY = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  const hasData = datasets.length && labels.length;

  if (!hasData) {
    return (
      <div className="chart-card revenue-chart">
        <div className="chart-header">
          <h3>
            <AreaChart size={18} /> Financial Trends
          </h3>
        </div>
        <div className="empty-state">No financial data available for selected filters</div>
      </div>
    );
  }

  return (
    <div className="chart-card revenue-chart">
      <div className="chart-header">
        <h3>
          <AreaChart size={18} /> Financial Trends
        </h3>
        <div className="chart-stats">
          <div className="stat-badge revenue">
            <TrendingUp size={14} />
            <span>
              Revenue:{' '}
              {formatCurrency(
                datasets.reduce((sum, d) => sum + (d.data?.reduce((a, b) => a + b, 0) || 0), 0),
              )}{' '}
              MAD
            </span>
          </div>
          {expensesDatasets && expensesDatasets.length > 0 && (
            <div className="stat-badge expense">
              <TrendingDown size={14} />
              <span>
                Expenses:{' '}
                {formatCurrency(
                  expensesDatasets.reduce(
                    (sum, d) => sum + (d.data?.reduce((a, b) => a + b, 0) || 0),
                    0,
                  ),
                )}{' '}
                MAD
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="revenue-chart-container" style={{ height: `${height}px` }}>
        <svg
          className="revenue-chart-svg"
          viewBox={`0 0 ${chartWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {datasets.map((dataset, idx) => (
              <linearGradient
                key={`revenue-grad-${idx}`}
                id={`gradient-revenue-${idx}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={dataset.color} stopOpacity="0.4" />
                <stop offset="100%" stopColor={dataset.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
            {expensesDatasets &&
              expensesDatasets.map((dataset, idx) => (
                <linearGradient
                  key={`expense-grad-${idx}`}
                  id={`gradient-expense-${idx}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={dataset.color} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={dataset.color} stopOpacity="0.02" />
                </linearGradient>
              ))}
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartHeight * (1 - ratio);
            const value = maxValue * ratio;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e9edf2"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text x={padding.left - 8} y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end">
                  {formatCurrency(Math.round(value))}
                </text>
              </g>
            );
          })}

          {/* Revenue Datasets */}
          {datasets.map((dataset, idx) => {
            const points = (dataset.data || [])
              .map((value, i) => `${getX(i)},${getY(value)}`)
              .join(' ');
            const areaPoints = `${points} ${getX(labels.length - 1)},${padding.top + chartHeight} ${getX(0)},${padding.top + chartHeight}`;

            return (
              <g key={`revenue-${idx}`}>
                <polygon
                  points={areaPoints}
                  fill={`url(#gradient-revenue-${idx})`}
                  className="chart-area"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke={dataset.color}
                  strokeWidth="2.5"
                  className="chart-line"
                />
                {(dataset.data || []).map((value, i) => (
                  <g
                    key={i}
                    className="chart-dot"
                    transform={`translate(${getX(i)}, ${getY(value)})`}
                  >
                    <circle r="4" fill={dataset.color} stroke="#fff" strokeWidth="2" />
                    <rect
                      x="-24"
                      y="-32"
                      width="48"
                      height="22"
                      rx="6"
                      fill="#1a1a2e"
                      className="dot-tooltip"
                    />
                    <text
                      x="0"
                      y="-18"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="10"
                      className="dot-tooltip"
                    >
                      {formatCurrency(value)} MAD
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {/* Expenses Datasets */}
          {expensesDatasets &&
            expensesDatasets.map((dataset, idx) => {
              const points = (dataset.data || [])
                .map((value, i) => `${getX(i)},${getY(value)}`)
                .join(' ');
              const areaPoints = `${points} ${getX(labels.length - 1)},${padding.top + chartHeight} ${getX(0)},${padding.top + chartHeight}`;

              return (
                <g key={`expense-${idx}`}>
                  <polygon
                    points={areaPoints}
                    fill={`url(#gradient-expense-${idx})`}
                    className="chart-area expense-area"
                  />
                  <polyline
                    points={points}
                    fill="none"
                    stroke={dataset.color}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="chart-line expense-line"
                  />
                  {(dataset.data || []).map((value, i) => (
                    <g
                      key={i}
                      className="chart-dot expense-dot"
                      transform={`translate(${getX(i)}, ${getY(value)})`}
                    >
                      <circle r="3" fill={dataset.color} stroke="#fff" strokeWidth="2" />
                    </g>
                  ))}
                </g>
              );
            })}

          {labels.map((label, i) => (
            <text
              key={i}
              x={getX(i)}
              y={padding.top + chartHeight + 20}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
              fontWeight="500"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
      <div className="chart-legend">
        {datasets.map((dataset, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: dataset.color }}></span>
            <span>{dataset.name}</span>
            <span className="legend-value">
              {formatCurrency((dataset.data || []).reduce((a, b) => a + b, 0))} MAD
            </span>
          </div>
        ))}
        {expensesDatasets &&
          expensesDatasets.map((dataset, idx) => (
            <div key={`expense-${idx}`} className="legend-item expense-legend">
              <span className="legend-color" style={{ backgroundColor: dataset.color }}></span>
              <span>{dataset.name}</span>
              <span className="legend-value">
                {formatCurrency((dataset.data || []).reduce((a, b) => a + b, 0))} MAD
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

// Student Registrations Chart
const StudentRegistrationsChart = ({ data = [], labels = MONTHS, height = 300 }) => {
  const maxValue = Math.max(...data, 1);
  const chartWidth = Math.max(labels.length * 70, 400);
  const barWidth = Math.min(50, ((chartWidth - 80) / labels.length) * 0.6);

  const getX = (index) =>
    40 +
    (index * (chartWidth - 80)) / labels.length +
    ((chartWidth - 80) / labels.length - barWidth) / 2;
  const getY = (value) => 30 + 250 - (value / maxValue) * 250;

  if (!data.length || data.every((v) => v === 0)) {
    return (
      <div className="chart-card registrations-chart">
        <div className="chart-header">
          <h3>
            <BarChart3 size={18} /> Student Registrations
          </h3>
        </div>
        <div className="empty-state">No registration data available for selected filters</div>
      </div>
    );
  }

  return (
    <div className="chart-card registrations-chart">
      <div className="chart-header">
        <h3>
          <BarChart3 size={18} /> Student Registrations
        </h3>
        <div className="chart-stats">
          <div className="stat-badge total">
            <Users size={14} />
            <span>Total: {data.reduce((a, b) => a + b, 0)} students</span>
          </div>
        </div>
      </div>
      <div className="registrations-chart-container" style={{ height: `${height}px` }}>
        <svg
          className="registrations-chart-svg"
          viewBox={`0 0 ${chartWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8cff2e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6ecc24" stopOpacity="0.7" />
            </linearGradient>
            <filter id="barShadow">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#8cff2e"
                floodOpacity="0.3"
              />
            </filter>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = 30 + 250 * (1 - ratio);
            const value = maxValue * ratio;
            return (
              <g key={i}>
                <line
                  x1="30"
                  y1={y}
                  x2={chartWidth - 30}
                  y2={y}
                  stroke="#e9edf2"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text x="25" y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end">
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {data.map((value, i) => (
            <g key={i}>
              <rect
                x={getX(i)}
                y={getY(value)}
                width={barWidth}
                height={280 - getY(value) + 30}
                rx="8"
                fill="url(#barGradient)"
                filter="url(#barShadow)"
                className="chart-bar"
              />
              <text
                x={getX(i) + barWidth / 2}
                y={getY(value) - 8}
                fill="#1a1a2e"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
              >
                {value}
              </text>
            </g>
          ))}

          {labels.map((label, i) => (
            <text
              key={i}
              x={getX(i) + barWidth / 2}
              y={315}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
              fontWeight="500"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

// Session Analytics Chart
const SessionAnalyticsChart = ({ datasets = [], labels = MONTHS, height = 300 }) => {
  const maxValue = Math.max(...datasets.flatMap((d) => d.data || []), 1);
  const chartWidth = Math.max(labels.length * 80, 500);
  const padding = { top: 30, right: 30, bottom: 30, left: 50 };
  const chartHeight = height - padding.top - padding.bottom;
  const stepX =
    chartHeight > 0 ? (chartWidth - padding.left - padding.right) / (labels.length - 1) : 0;

  const getX = (index) => padding.left + index * stepX;
  const getY = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;

  const getSmoothPath = (points) => {
    if (points.length < 2) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) * 0.5;
      const cp1y = p0.y;
      const cp2x = p1.x - (p1.x - p0.x) * 0.5;
      const cp2y = p1.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  if (
    !datasets.length ||
    !labels.length ||
    datasets.every((d) => (d.data || []).every((v) => v === 0))
  ) {
    return (
      <div className="chart-card session-chart">
        <div className="chart-header">
          <h3>
            <LineChart size={18} /> Session Analytics
          </h3>
        </div>
        <div className="empty-state">No session data available for selected filters</div>
      </div>
    );
  }

  const totalScheduled =
    datasets.find((d) => d.name === 'Scheduled')?.data?.reduce((a, b) => a + b, 0) || 0;
  const totalCompleted =
    datasets.find((d) => d.name === 'Completed')?.data?.reduce((a, b) => a + b, 0) || 0;
  const completionRate =
    totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  return (
    <div className="chart-card session-chart">
      <div className="chart-header">
        <h3>
          <LineChart size={18} /> Session Analytics
        </h3>
        <div className="chart-stats">
          <div className="stat-badge completion">
            <CheckCircle size={14} />
            <span>Completion Rate: {completionRate}%</span>
          </div>
        </div>
      </div>
      <div className="session-chart-container" style={{ height: `${height}px` }}>
        <svg
          className="session-chart-svg"
          viewBox={`0 0 ${chartWidth} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {datasets.map((dataset, idx) => (
              <linearGradient key={idx} id={`session-grad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={dataset.color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={dataset.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartHeight * (1 - ratio);
            const value = maxValue * ratio;
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#e9edf2"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text x={padding.left - 8} y={y + 4} fill="#94a3b8" fontSize="10" textAnchor="end">
                  {Math.round(value)}
                </text>
              </g>
            );
          })}

          {datasets.map((dataset, idx) => {
            const points = (dataset.data || []).map((value, i) => ({ x: getX(i), y: getY(value) }));
            const smoothPath = getSmoothPath(points);

            return (
              <g key={idx}>
                <path
                  d={smoothPath}
                  fill="none"
                  stroke={dataset.color}
                  strokeWidth="2.5"
                  className="chart-line"
                />
                {(dataset.data || []).map((value, i) => (
                  <g
                    key={i}
                    className="chart-dot"
                    transform={`translate(${getX(i)}, ${getY(value)})`}
                  >
                    <circle r="3.5" fill={dataset.color} stroke="#fff" strokeWidth="2" />
                    <rect
                      x="-24"
                      y="-32"
                      width="48"
                      height="22"
                      rx="6"
                      fill="#1a1a2e"
                      className="dot-tooltip"
                    />
                    <text
                      x="0"
                      y="-18"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="10"
                      className="dot-tooltip"
                    >
                      {value} sessions
                    </text>
                  </g>
                ))}
              </g>
            );
          })}

          {labels.map((label, i) => (
            <text
              key={i}
              x={getX(i)}
              y={padding.top + chartHeight + 20}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
              fontWeight="500"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>
      <div className="chart-legend">
        {datasets.map((dataset, idx) => (
          <div key={idx} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: dataset.color }}></span>
            <span>{dataset.name}</span>
            <span className="legend-value">
              {(dataset.data || []).reduce((a, b) => a + b, 0)} total
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Donut Chart Component
const DonutChartComponent = ({ data = [], title, size = 200 }) => {
  let cumulativeAngle = 0;
  const filteredData = data.filter((item) => item.value > 0);

  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-header">
          <h3>
            <PieChart size={18} /> {title}
          </h3>
        </div>
        <div className="empty-state">
          <CreditCard size={32} />
          <p>No data available for selected filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-card donut-chart-card">
      <div className="chart-header">
        <h3>
          <PieChart size={18} /> {title}
        </h3>
      </div>
      <div className="donut-chart-wrapper">
        <div className="donut-chart-container">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {filteredData.map((item, idx) => {
              const angle = (item.value / 100) * 360;
              const startAngle = cumulativeAngle;
              const endAngle = cumulativeAngle + angle;
              cumulativeAngle += angle;

              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;
              const x1 = size / 2 + (size / 2 - 25) * Math.cos(startRad);
              const y1 = size / 2 + (size / 2 - 25) * Math.sin(startRad);
              const x2 = size / 2 + (size / 2 - 25) * Math.cos(endRad);
              const y2 = size / 2 + (size / 2 - 25) * Math.sin(endRad);
              const largeArc = angle > 180 ? 1 : 0;
              const pathData = `M ${size / 2} ${size / 2} L ${x1} ${y1} A ${size / 2 - 25} ${size / 2 - 25} 0 ${largeArc} 1 ${x2} ${y2} Z`;

              return (
                <g key={idx} className="donut-segment">
                  <path d={pathData} fill={item.color} stroke="white" strokeWidth="3" />
                </g>
              );
            })}
            <circle cx={size / 2} cy={size / 2} r={size / 2 - 35} fill="white" />
            <text
              x={size / 2}
              y={size / 2 - 5}
              textAnchor="middle"
              fill="#1a1a2e"
              fontSize="14"
              fontWeight="800"
              fontFamily="Manrope-Bold"
            >
              {filteredData.length}
            </text>
            <text
              x={size / 2}
              y={size / 2 + 10}
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="10"
              fontWeight="500"
            >
              Categories
            </text>
          </svg>
        </div>
        <div className="donut-legend">
          {filteredData.map((item, idx) => (
            <div key={idx} className="donut-legend-item">
              <div className="legend-color-wrapper">
                <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
              </div>
              <div className="legend-info">
                <span className="legend-name">{item.name}</span>
                <span className="legend-percentage">{item.value}%</span>
              </div>
              {item.count !== undefined && <span className="legend-count">{item.count} items</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// KPI Card Component (Updated for expenses)
const KpiCard = ({
  icon: IconComponent,
  label,
  value,
  change,
  changeType,
  prefix = '',
  suffix = '',
  isExpense = false,
}) => {
  const Icon = IconComponent;
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value || 0;
  return (
    <div className={`kpi-card ${isExpense ? 'expense-kpi' : ''}`}>
      <div className="kpi-icon">{Icon && <Icon size={24} />}</div>
      <div className="kpi-info">
        <div className={`kpi-value ${isExpense ? 'expense-value' : ''}`}>
          {prefix}
          {displayValue}
          {suffix}
        </div>
        <div className="kpi-label">{label}</div>
        {change !== undefined && change !== null && (
          <div className={`kpi-change ${changeType}`}>
            {changeType === 'positive' && <TrendingUp size={12} />}
            {changeType === 'negative' && <TrendingDown size={12} />}
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
const Toast = ({ toast, onClose }) => {
  if (!toast) return null;
  setTimeout(() => onClose(), 3000);
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
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    kpis: {
      total_revenue: 0,
      total_expenses: 0,
      net_revenue: 0,
      total_students: 0,
      total_sessions: 0,
      completion_rate: 0,
      avg_revenue_per_student: 0,
      revenue_change: 0,
      current_month_revenue: 0,
    },
    quick_stats: {
      active_students: 0,
      inactive_students: 0,
      passing_rate: 0,
      avg_rating: 0,
      avg_session_duration: 0,
      top_category: 'B',
    },
    revenue_data: { labels: MONTHS, datasets: [] },
    expenses_data: { labels: MONTHS, datasets: [] },
    registrations_data: { labels: MONTHS, data: [] },
    session_data: { labels: MONTHS, scheduled: [], completed: [], cancelled: [], no_show: [] },
    payment_methods: [],
    category_distribution: [],
    top_instructors: [],
    recent_transactions: [],
    vehicle_utilization: [],
    applied_filters: {},
  });

  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => setToast({ msg, type });
  const hideToast = () => setToast(null);

  // Fetch statistics data with filters
  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/statistics/dashboard', {
        params: {
          date_range: dateRange,
          filter_type: filterType,
          filter_category: filterCategory,
        },
      });

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      showToast('Failed to load statistics data', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [dateRange, filterType, filterCategory]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Prepare filtered data for charts with safe defaults
  const revenueData = stats?.revenue_data || { labels: MONTHS, datasets: [] };
  const expensesData = stats?.expenses_data || { labels: MONTHS, datasets: [] };
  const registrationsData = stats?.registrations_data || { labels: MONTHS, data: [] };
  const sessionData = stats?.session_data || {
    labels: MONTHS,
    scheduled: [],
    completed: [],
    cancelled: [],
    no_show: [],
  };
  const paymentMethods = stats?.payment_methods || [];
  const categoryDistribution = stats?.category_distribution || [];
  const topInstructors = stats?.top_instructors || [];
  const recentTransactions = stats?.recent_transactions || [];
  const vehicleUtilization = stats?.vehicle_utilization || [];

  const handleRefresh = async () => {
    await fetchStatistics();
    showToast('Statistics refreshed successfully');
    addNotification('Data Refreshed', 'Statistics data has been updated', 'system');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get('/statistics/export-pdf', {
        params: {
          date_range: dateRange,
          filter_type: filterType,
          filter_category: filterCategory,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `statistics_report_${new Date().toISOString().split('T')[0]}.pdf`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('PDF report exported successfully');
      addNotification('Report Exported', 'Statistics PDF report has been downloaded', 'system');
    } catch (error) {
      console.error('PDF Export failed:', error);
      showToast('Failed to export PDF report', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get('/statistics/export-excel', {
        params: {
          date_range: dateRange,
          filter_type: filterType,
          filter_category: filterCategory,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `statistics_report_${new Date().toISOString().split('T')[0]}.xlsx`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Excel report exported successfully');
      addNotification('Report Exported', 'Statistics Excel report has been downloaded', 'system');
    } catch (error) {
      console.error('Excel Export failed:', error);
      showToast('Failed to export Excel report', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const resetFilters = () => {
    setDateRange('year');
    setFilterType('All');
    setFilterCategory('All');
    showToast('Filters reset successfully');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (dateRange !== 'year') count++;
    if (filterType !== 'All') count++;
    if (filterCategory !== 'All') count++;
    return count;
  };

  const currentMonthName = new Date().toLocaleString('default', { month: 'long' });

  if (isLoading) {
    return (
      <div className="statistics-loading">
        <div className="loading-spinner">
          <Loader size={48} className="spinner" />
          <p>Loading statistics...</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="statistics-page">
      <Toast toast={toast} onClose={hideToast} />

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Analytics & Statistics</h1>
            <p>Comprehensive insights into your driving school performance</p>
          </div>
          <div className="header-actions">
            <button className="action-btn refresh" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw size={16} className={isLoading ? 'spinning' : ''} /> Refresh
            </button>
            <button className="action-btn export" onClick={handleExportPDF}>
              <FileText size={16} /> Export PDF
            </button>
            <button className="action-btn export" onClick={handleExportExcel}>
              <Download size={16} /> Export Excel
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Bar */}
      {getActiveFiltersCount() > 0 && (
        <div className="active-filters-bar">
          <span className="active-filters-label">Active Filters:</span>
          {dateRange !== 'year' && (
            <span className="filter-tag">
              Period: {DATE_RANGES.find((r) => r.value === dateRange)?.label}
              <button onClick={() => setDateRange('year')}>
                <X size={12} />
              </button>
            </span>
          )}
          {filterType !== 'All' && (
            <span className="filter-tag">
              Session: {filterType}
              <button onClick={() => setFilterType('All')}>
                <X size={12} />
              </button>
            </span>
          )}
          {filterCategory !== 'All' && (
            <span className="filter-tag">
              Payment: {filterCategory}
              <button onClick={() => setFilterCategory('All')}>
                <X size={12} />
              </button>
            </span>
          )}
          <button className="clear-all-filters" onClick={resetFilters}>
            Clear All
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="filters-bar">
        <div className="date-range-selector">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              className={dateRange === range.value ? 'active' : ''}
              onClick={() => setDateRange(range.value)}
            >
              {range.label}
            </button>
          ))}
          <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} /> Filters
            {getActiveFiltersCount() > 0 && (
              <span className="filter-badge">{getActiveFiltersCount()}</span>
            )}
          </button>
          {getActiveFiltersCount() > 0 && (
            <button className="reset-filters" onClick={resetFilters}>
              Reset All
            </button>
          )}
        </div>

        {showFilters && (
          <div className="additional-filters">
            <div className="filter-group">
              <label>Session Type</label>
              <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="Driving">Driving</option>
                <option value="Code">Code</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Payment Category</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                <option value="All">All Categories</option>
                <option value="Registration">Registration</option>
                <option value="Session">Session</option>
                <option value="Exam">Exam</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Incident">Incident</option>
              </select>
            </div>
            <div className="filter-actions">
              <button className="apply-filters" onClick={() => setShowFilters(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* KPI Grid with Expenses */}
      <div className="kpi-grid">
        <KpiCard
          icon={DollarSign}
          label="Total Revenue"
          value={stats.kpis.total_revenue}
          prefix="MAD "
          change={stats.kpis.revenue_change}
          changeType={stats.kpis.revenue_change >= 0 ? 'positive' : 'negative'}
        />
        <KpiCard
          icon={Wrench}
          label="Total Expenses"
          value={stats.kpis.total_expenses || 0}
          prefix="MAD "
          change={12.5}
          changeType="positive"
          isExpense={true}
        />
        <KpiCard
          icon={TrendingUp}
          label="Net Revenue"
          value={stats.kpis.net_revenue || 0}
          prefix="MAD "
          change={stats.kpis.net_revenue >= 0 ? 8.2 : -5.3}
          changeType={stats.kpis.net_revenue >= 0 ? 'positive' : 'negative'}
        />
        <KpiCard
          icon={Users}
          label="Total Students"
          value={stats.kpis.total_students}
          change={8.5}
          changeType="positive"
        />
        <KpiCard
          icon={Car}
          label="Total Sessions"
          value={stats.kpis.total_sessions}
          change={12.3}
          changeType="positive"
        />
        <KpiCard
          icon={Target}
          label="Completion Rate"
          value={Math.round(stats.kpis.completion_rate)}
          suffix="%"
          change={3.2}
          changeType="positive"
        />
        <KpiCard
          icon={Wallet}
          label="Avg Revenue/Student"
          value={Math.round(stats.kpis.avg_revenue_per_student)}
          prefix="MAD "
          change={-2.1}
          changeType="negative"
        />
        <KpiCard
          icon={CalendarIcon}
          label={`Revenue (${currentMonthName})`}
          value={stats.kpis.current_month_revenue}
          prefix="MAD "
          change={5.4}
          changeType="positive"
        />
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <StatCard
          icon={UserCheck}
          label="Active Students"
          value={stats.quick_stats.active_students}
          color="#8cff2e"
        />
        <StatCard
          icon={UserX}
          label="Inactive Students"
          value={stats.quick_stats.inactive_students}
          color="#ef4444"
        />
        <StatCard
          icon={Percent}
          label="Passing Rate"
          value={`${stats.quick_stats.passing_rate}%`}
          color="#10b981"
        />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={`${stats.quick_stats.avg_rating}/5`}
          color="#f59e0b"
        />
        <StatCard
          icon={Clock}
          label="Avg Session Duration"
          value={`${stats.quick_stats.avg_session_duration} min`}
          color="#3b82f6"
        />
        <StatCard
          icon={Award}
          label="Top Category"
          value={stats.quick_stats.top_category}
          color="#8cff2e"
        />
      </div>

      {/* Main Charts Row */}
      <div className="charts-row">
        <RevenueTrendsChart
          datasets={revenueData.datasets || []}
          expensesDatasets={expensesData.datasets || []}
          labels={revenueData.labels || MONTHS}
          height={350}
        />
        <StudentRegistrationsChart
          data={registrationsData.data || []}
          labels={registrationsData.labels || MONTHS}
          height={300}
        />
      </div>

      {/* Secondary Charts Row */}
      <div className="charts-row">
        <SessionAnalyticsChart
          datasets={[
            { name: 'Scheduled', data: sessionData.scheduled || [], color: '#3b82f6' },
            { name: 'Completed', data: sessionData.completed || [], color: '#10b981' },
            { name: 'Cancelled', data: sessionData.cancelled || [], color: '#ef4444' },
            { name: 'No Show', data: sessionData.no_show || [], color: '#f59e0b' },
          ]}
          labels={sessionData.labels || MONTHS}
          height={300}
        />
        <DonutChartComponent
          data={paymentMethods}
          title="Payment Methods Distribution"
          size={200}
        />
        <DonutChartComponent data={categoryDistribution} title="Category Distribution" size={200} />
      </div>

      {/* Top Instructors & Recent Transactions */}
      <div className="tables-row">
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Award size={18} /> Top Performing Instructors
            </h3>
            <Link to="/system/instructors" className="view-all">
              View All →
            </Link>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Sessions</th>
                  <th>Completion</th>
                  <th>Revenue</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topInstructors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No instructor data available for selected filters
                    </td>
                  </tr>
                ) : (
                  topInstructors.map((instructor) => (
                    <tr key={instructor.id}>
                      <td>
                        <div className="instructor-cell">
                          <div className="instructor-avatar">
                            {instructor.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('') || '??'}
                          </div>
                          <span>{instructor.name}</span>
                        </div>
                      </td>
                      <td>{instructor.sessions || 0}</td>
                      <td>
                        <div className="completion-cell">
                          <div className="completion-bar">
                            <div
                              className="completion-fill"
                              style={{ width: `${instructor.completion_rate || 0}%` }}
                            />
                          </div>
                          <span>{instructor.completion_rate || 0}%</span>
                        </div>
                      </td>
                      <td>{(instructor.revenue || 0).toLocaleString()} MAD</td>
                      <td>
                        <div className="rating">
                          <Star size={12} fill="#f59e0b" color="#f59e0b" />
                          <span>{instructor.rating || 0}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="table-card">
          <div className="table-header">
            <h3>
              <Receipt size={18} /> Recent Transactions
            </h3>
            <Link to="/system/payments" className="view-all">
              View All →
            </Link>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student/Expense</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-state">
                      No transactions available for selected filters
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((transaction) => {
                    const isExpense =
                      transaction.type === 'Maintenance' || transaction.type === 'Incident';
                    return (
                      <tr key={transaction.id} className={isExpense ? 'expense-row' : ''}>
                        <td>{transaction.date}</td>
                        <td>{isExpense ? transaction.type : transaction.student}</td>
                        <td className={`amount ${isExpense ? 'expense-amount' : 'revenue-amount'}`}>
                          {isExpense ? '-' : ''}
                          {(transaction.amount || 0).toLocaleString()} MAD
                        </td>
                        <td>
                          <span className={`type-badge ${transaction.type?.toLowerCase()}`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td>
                          <span className={`status-badge ${transaction.status?.toLowerCase()}`}>
                            {transaction.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
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
          <Link to="/system/vehicles" className="view-all">
            View Details →
          </Link>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
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
              {vehicleUtilization.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No vehicle data available
                  </td>
                </tr>
              ) : (
                vehicleUtilization.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      <div className="vehicle-cell">
                        <Car size={16} />
                        <span>{vehicle.name}</span>
                      </div>
                    </td>
                    <td className="plate">{vehicle.plate}</td>
                    <td>{vehicle.sessions || 0}</td>
                    <td>
                      <div className="utilization-cell">
                        <div className="utilization-bar">
                          <div
                            className="utilization-fill"
                            style={{ width: `${vehicle.utilization || 0}%` }}
                          />
                        </div>
                        <span>{vehicle.utilization || 0}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${(vehicle.utilization || 0) > 70 ? 'active' : (vehicle.utilization || 0) > 40 ? 'partial' : 'low'}`}
                      >
                        {(vehicle.utilization || 0) > 70
                          ? 'High Usage'
                          : (vehicle.utilization || 0) > 40
                            ? 'Medium Usage'
                            : 'Low Usage'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
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
