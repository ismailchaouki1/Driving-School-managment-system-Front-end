// Pages/System/Dashboard.jsx
import { useState, useMemo, useEffect } from 'react';
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
  Activity,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Loader,
  Eye,
  MoreHorizontal,
  ChevronRight,
  Zap,
  Shield,
  Truck,
  FileText,
  Printer,
  Phone,
  Mail,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Users as UsersIcon,
  BarChart2,
  PieChart,
  LineChart,
  Wrench, // ← ADD THIS LINE
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../Styles/System/Dashboard.scss';
import { Link } from 'react-router-dom';

/* ─────────────── Mock Data ─────────────── */
const CURRENT_DATE = new Date();
const CURRENT_MONTH = CURRENT_DATE.toLocaleString('default', { month: 'long' });
const CURRENT_YEAR = CURRENT_DATE.getFullYear();

// Recent sessions data
const RECENT_SESSIONS = [
  {
    id: 1,
    student: 'Youssef Alami',
    type: 'Driving',
    instructor: 'Mohammed Benali',
    time: '09:00 AM',
    date: 'Today',
    status: 'Scheduled',
    vehicle: 'ABC-123',
  },
  {
    id: 2,
    student: 'Fatima Benali',
    type: 'Code',
    instructor: 'Karim Tazi',
    time: '11:00 AM',
    date: 'Today',
    status: 'In Progress',
    vehicle: null,
  },
  {
    id: 3,
    student: 'Karim Cherkaoui',
    type: 'Driving',
    instructor: 'Fatima Zahra',
    time: '02:00 PM',
    date: 'Today',
    status: 'Scheduled',
    vehicle: 'DEF-456',
  },
  {
    id: 4,
    student: 'Nadia Tazi',
    type: 'Evaluation',
    instructor: 'Hassan El Fassi',
    time: '04:00 PM',
    date: 'Today',
    status: 'Scheduled',
    vehicle: 'GHI-789',
  },
  {
    id: 5,
    student: 'Hassan Ouazzani',
    type: 'Driving',
    instructor: 'Mohammed Benali',
    time: '10:00 AM',
    date: 'Tomorrow',
    status: 'Scheduled',
    vehicle: 'JKL-012',
  },
];

// Recent payments
const RECENT_PAYMENTS = [
  {
    id: 1,
    student: 'Youssef Alami',
    amount: 3000,
    type: 'Installment',
    date: '2025-04-07',
    status: 'Completed',
    method: 'Cash',
  },
  {
    id: 2,
    student: 'Fatima Benali',
    amount: 450,
    type: 'Exam Fee',
    date: '2025-04-07',
    status: 'Completed',
    method: 'Card',
  },
  {
    id: 3,
    student: 'Karim Cherkaoui',
    amount: 200,
    type: 'Session',
    date: '2025-04-06',
    status: 'Pending',
    method: 'Bank Transfer',
  },
  {
    id: 4,
    student: 'Nadia Tazi',
    amount: 6000,
    type: 'Registration',
    date: '2025-04-06',
    status: 'Completed',
    method: 'Cheque',
  },
  {
    id: 5,
    student: 'Hassan Ouazzani',
    amount: 200,
    type: 'Session',
    date: '2025-04-05',
    status: 'Completed',
    method: 'Cash',
  },
];

// Upcoming events
const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Code Exam - Session A',
    date: '2025-04-10',
    time: '09:00 AM',
    location: 'Room 101',
    participants: 12,
  },
  {
    id: 2,
    title: 'Driving Test - Category B',
    date: '2025-04-12',
    time: '10:00 AM',
    location: 'Test Track',
    participants: 8,
  },
  {
    id: 3,
    title: 'Instructor Meeting',
    date: '2025-04-15',
    time: '02:00 PM',
    location: 'Conference Room',
    participants: 5,
  },
  {
    id: 4,
    title: 'Vehicle Maintenance',
    date: '2025-04-18',
    time: '08:00 AM',
    location: 'Garage',
    participants: 3,
  },
];

// Vehicle status
const VEHICLE_STATUS = [
  {
    id: 1,
    name: 'Dacia Sandero',
    plate: '12345-A-1',
    status: 'Active',
    nextMaintenance: '2025-07-15',
    utilization: 78,
  },
  {
    id: 2,
    name: 'Renault Clio',
    plate: '67890-B-2',
    status: 'Active',
    nextMaintenance: '2025-08-20',
    utilization: 85,
  },
  {
    id: 3,
    name: 'Honda CB500',
    plate: '11223-C-3',
    status: 'Active',
    nextMaintenance: '2025-09-01',
    utilization: 62,
  },
  {
    id: 4,
    name: 'Mercedes Actros',
    plate: '44556-D-4',
    status: 'Maintenance',
    nextMaintenance: '2025-04-30',
    utilization: 45,
  },
  {
    id: 5,
    name: 'Peugeot 208',
    plate: '99887-E-5',
    status: 'Active',
    nextMaintenance: '2025-09-20',
    utilization: 58,
  },
];

// Instructor performance
const INSTRUCTOR_PERFORMANCE = [
  { id: 1, name: 'Mohammed Benali', sessions: 156, rating: 4.8, completionRate: 94, students: 28 },
  { id: 2, name: 'Fatima Zahra', sessions: 142, rating: 4.7, completionRate: 92, students: 25 },
  { id: 3, name: 'Karim Tazi', sessions: 128, rating: 4.6, completionRate: 89, students: 22 },
  { id: 4, name: 'Nadia Ouazzani', sessions: 118, rating: 4.8, completionRate: 91, students: 20 },
];

// Weekly activity data
const WEEKLY_ACTIVITY = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sessions: [12, 15, 18, 14, 20, 8, 5],
  revenue: [2400, 3000, 3600, 2800, 4000, 1600, 1000],
};

// Category distribution
const CATEGORY_DISTRIBUTION = [
  { name: 'Category B', value: 68, color: '#8cff2e', count: 68 },
  { name: 'Category A', value: 12, color: '#3b82f6', count: 12 },
  { name: 'Category C', value: 8, color: '#f59e0b', count: 8 },
  { name: 'Category D', value: 5, color: '#ef4444', count: 5 },
  { name: 'Category BE', value: 4, color: '#8b5cf6', count: 4 },
  { name: 'Category A1', value: 3, color: '#06b6d4', count: 3 },
];

// Monthly revenue data for mini chart
const MONTHLY_REVENUE = [42, 48, 45, 58, 62, 75, 88, 82, 68, 72, 78, 85];

/* ─────────────── Sub-components ─────────────── */

// KPI Card Component
const KpiCard = ({
  icon: IconComponent,
  label,
  value,
  change,
  changeType,
  prefix = '',
  suffix = '',
  bgColor = '#f8fafc',
}) => {
  const Icon = IconComponent;
  return (
    <div className="kpi-card" style={{ background: bgColor }}>
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
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusClass = status.toLowerCase().replace(' ', '-');
  return (
    <span className={`status-badge ${statusClass}`}>
      {status === 'Completed' && <CheckCircle size={10} />}
      {status === 'In Progress' && <Activity size={10} />}
      {status === 'Scheduled' && <Clock size={10} />}
      {status === 'Pending' && <AlertCircle size={10} />}
      {status === 'Active' && <CheckCircle size={10} />}
      {status === 'Maintenance' && <AlertCircle size={10} />}
      {status}
    </span>
  );
};

// Mini Bar Chart Component
const MiniBarChart = ({ data, height = 40, color = '#8cff2e' }) => {
  const maxValue = Math.max(...data, 1);
  return (
    <div className="mini-bar-chart" style={{ height: `${height}px` }}>
      {data.map((value, index) => (
        <div
          key={index}
          className="mini-bar"
          style={{
            height: `${(value / maxValue) * 100}%`,
            backgroundColor: color,
          }}
        />
      ))}
    </div>
  );
};

// Mini Pie Chart Component
const MiniPieChart = ({ data, size = 60 }) => {
  let cumulativeAngle = 0;
  const center = size / 2;
  const radius = size / 2 - 4;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((item, index) => {
        const angle = (item.value / 100) * 360;
        const startAngle = cumulativeAngle;
        const endAngle = cumulativeAngle + angle;
        cumulativeAngle += angle;

        const startRad = ((startAngle - 90) * Math.PI) / 180;
        const endRad = ((endAngle - 90) * Math.PI) / 180;

        const x1 = center + radius * Math.cos(startRad);
        const y1 = center + radius * Math.sin(startRad);
        const x2 = center + radius * Math.cos(endRad);
        const y2 = center + radius * Math.sin(endRad);

        const largeArc = angle > 180 ? 1 : 0;
        const pathData = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

        return <path key={index} d={pathData} fill={item.color} stroke="white" strokeWidth="1.5" />;
      })}
      <circle cx={center} cy={center} r={radius / 2} fill="white" />
    </svg>
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
const Dashboard = () => {
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentTime, setCurrentTime] = useState(new Date());

  const { addNotification, unreadCount } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalStudents = 156;
    const activeStudents = 142;
    const newStudents = 12;
    const totalRevenue = 845000;
    const monthlyRevenue = 158000;
    const revenueGrowth = 12.4;
    const totalSessions = 284;
    const completedSessions = 248;
    const completionRate = (completedSessions / totalSessions) * 100;
    const totalVehicles = 8;
    const availableVehicles = 6;
    const pendingPayments = 125000;
    const collectionRate = 87;

    return {
      totalStudents,
      activeStudents,
      newStudents,
      totalRevenue,
      monthlyRevenue,
      revenueGrowth,
      totalSessions,
      completedSessions,
      completionRate,
      totalVehicles,
      availableVehicles,
      pendingPayments,
      collectionRate,
    };
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('Dashboard data refreshed successfully');
      addNotification('Dashboard Refreshed', 'All dashboard data has been updated', 'system');
    }, 1000);
  };

  const handleExport = () => {
    showToast('Report export started');
    addNotification('Export Started', 'Dashboard report is being generated', 'system');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-page">
      <Toast toast={toast} />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <Loader size={40} className="spinner" />
            <p>Refreshing dashboard...</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="greeting-section">
            <h1>{getGreeting()}, Alex! 👋</h1>
            <p>
              {formatDate()} • {formatTime()}
            </p>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={handleRefresh}>
              <RefreshCw size={16} />
              Refresh
            </button>
            <button className="action-btn export" onClick={handleExport}>
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="quick-stats">
        <div className="stat-card welcome-card">
          <div className="welcome-content">
            <div>
              <h3>Welcome Back!</h3>
              <p>Here's what's happening with your driving school today.</p>
            </div>
            <div className="welcome-icon">
              <Zap size={32} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8cff2e15', color: '#8cff2e' }}>
            <UsersIcon size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{kpis.activeStudents}</div>
            <div className="stat-label">Active Students</div>
            <div className="stat-trend positive">
              <TrendingUp size={10} /> +{kpis.newStudents} this month
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <CalendarIcon size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{kpis.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
            <div className="stat-trend positive">
              <TrendingUp size={10} /> +8% vs last month
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{kpis.monthlyRevenue.toLocaleString()} MAD</div>
            <div className="stat-label">Monthly Revenue</div>
            <div className="stat-trend positive">
              <TrendingUp size={10} /> +{kpis.revenueGrowth}%
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <Target size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{Math.round(kpis.completionRate)}%</div>
            <div className="stat-label">Completion Rate</div>
            <div className="stat-trend positive">
              <TrendingUp size={10} /> +5%
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KpiCard
          icon={Wallet}
          label="Total Revenue"
          value={kpis.totalRevenue}
          prefix="MAD "
          change={12.4}
          changeType="up"
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
          label="Available Vehicles"
          value={`${kpis.availableVehicles}/${kpis.totalVehicles}`}
          change={-2}
          changeType="down"
        />
        <KpiCard
          icon={CreditCard}
          label="Collection Rate"
          value={kpis.collectionRate}
          suffix="%"
          change={3.2}
          changeType="up"
        />
        <KpiCard
          icon={Clock}
          label="Pending Payments"
          value={kpis.pendingPayments}
          prefix="MAD "
          change={-5.1}
          changeType="down"
        />
        <KpiCard
          icon={Award}
          label="Completion Rate"
          value={Math.round(kpis.completionRate)}
          suffix="%"
          change={2.5}
          changeType="up"
        />
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <Activity size={18} />
              Weekly Activity
            </h3>
            <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <div className="weekly-chart">
            <div className="chart-bars">
              {WEEKLY_ACTIVITY.sessions.map((value, index) => (
                <div key={index} className="bar-container">
                  <div className="bar-wrapper">
                    <div
                      className="bar revenue-bar"
                      style={{ height: `${(WEEKLY_ACTIVITY.revenue[index] / 4000) * 100}%` }}
                    />
                    <div
                      className="bar sessions-bar"
                      style={{ height: `${(value / 20) * 100}%` }}
                    />
                  </div>
                  <span className="bar-label">{WEEKLY_ACTIVITY.labels[index]}</span>
                </div>
              ))}
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color revenue"></span>
                <span>Revenue (MAD)</span>
              </div>
              <div className="legend-item">
                <span className="legend-color sessions"></span>
                <span>Sessions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <PieChart size={18} />
              Category Distribution
            </h3>
          </div>
          <div className="category-distribution">
            <div className="pie-container">
              <MiniPieChart data={CATEGORY_DISTRIBUTION} size={140} />
            </div>
            <div className="category-list">
              {CATEGORY_DISTRIBUTION.slice(0, 5).map((cat, index) => (
                <div key={index} className="category-item">
                  <span className="category-dot" style={{ background: cat.color }}></span>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count} students</span>
                  <span className="category-percent">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>
              <Car size={18} />
              Vehicle Utilization
            </h3>
            <Link className="view-link" to="/system/vehicles">
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="vehicle-list">
            {VEHICLE_STATUS.slice(0, 4).map((vehicle) => (
              <div key={vehicle.id} className="vehicle-item">
                <div className="vehicle-info">
                  <div className="vehicle-name">
                    <Truck size={14} />
                    <span>{vehicle.name}</span>
                  </div>
                  <div className="vehicle-plate">{vehicle.plate}</div>
                </div>
                <div className="vehicle-status">
                  <StatusBadge status={vehicle.status} />
                  <div className="utilization">
                    <div className="utilization-bar">
                      <div
                        className="utilization-fill"
                        style={{ width: `${vehicle.utilization}%` }}
                      />
                    </div>
                    <span>{vehicle.utilization}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Sessions & Upcoming Events Row */}
      <div className="tables-row">
        {/* Recent Sessions */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <CalendarIcon size={18} />
              Today's Sessions
            </h3>
            <Link className="view-link" to={'/system/sessions'}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="sessions-list">
            {RECENT_SESSIONS.filter((s) => s.date === 'Today').map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-time">
                  <Clock size={14} />
                  <span>{session.time}</span>
                </div>
                <div className="session-info">
                  <div className="session-student">{session.student}</div>
                  <div className="session-details">
                    <span className={`session-type ${session.type.toLowerCase()}`}>
                      {session.type}
                    </span>
                    <span className="session-instructor">{session.instructor}</span>
                  </div>
                </div>
                <StatusBadge status={session.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Receipt size={18} />
              Recent Payments
            </h3>
            <Link className="view-link" to={'/system/payments'}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="payments-list">
            {RECENT_PAYMENTS.slice(0, 4).map((payment) => (
              <div key={payment.id} className="payment-item">
                <div className="payment-info">
                  <div className="payment-student">{payment.student}</div>
                  <div className="payment-details">
                    <span className="payment-type">{payment.type}</span>
                    <span className="payment-date">{payment.date}</span>
                  </div>
                </div>
                <div className="payment-amount">
                  <span
                    className={`amount ${payment.status === 'Completed' ? 'positive' : 'pending'}`}
                  >
                    {payment.amount.toLocaleString()} MAD
                  </span>
                  <StatusBadge status={payment.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Bell size={18} />
              Upcoming Events
            </h3>
            <Link className="view-link" to={'/system/calendar'}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="events-list">
            {UPCOMING_EVENTS.map((event) => (
              <div key={event.id} className="event-item">
                <div className="event-date">
                  <div className="event-day">{new Date(event.date).getDate()}</div>
                  <div className="event-month">
                    {new Date(event.date).toLocaleString('default', { month: 'short' })}
                  </div>
                </div>
                <div className="event-info">
                  <div className="event-title">{event.title}</div>
                  <div className="event-details">
                    <span>
                      <Clock size={10} /> {event.time}
                    </span>
                    <span>
                      <MapPin size={10} /> {event.location}
                    </span>
                  </div>
                </div>
                <div className="event-participants">
                  <Users size={12} />
                  <span>{event.participants}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructor Performance & Monthly Trend Row */}
      <div className="tables-row">
        {/* Instructor Performance */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Star size={18} />
              Top Instructors
            </h3>
            <Link className="view-link" to={'/system/instructors'}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="instructors-list">
            {INSTRUCTOR_PERFORMANCE.map((instructor) => (
              <div key={instructor.id} className="instructor-item">
                <div className="instructor-avatar">
                  {instructor.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="instructor-info">
                  <div className="instructor-name">{instructor.name}</div>
                  <div className="instructor-stats">
                    <span>
                      <Users size={10} /> {instructor.students} students
                    </span>
                    <span>
                      <Activity size={10} /> {instructor.sessions} sessions
                    </span>
                  </div>
                </div>
                <div className="instructor-rating">
                  <div className="rating-stars">
                    <Star size={12} fill="#f59e0b" color="#f59e0b" />
                    <span>{instructor.rating}</span>
                  </div>
                  <div className="completion-rate">{instructor.completionRate}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div className="table-card">
          <div className="chart-header">
            <h3>
              <LineChart size={18} />
              Revenue Trend
            </h3>
            <span className="trend-value positive">
              <TrendingUp size={12} /> +15.2% vs last year
            </span>
          </div>
          <div className="revenue-trend">
            <MiniBarChart data={MONTHLY_REVENUE} height={120} color="#8cff2e" />
            <div className="trend-labels">
              {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          </div>
          <div className="revenue-summary">
            <div className="summary-item">
              <span>Average Monthly</span>
              <strong>{(MONTHLY_REVENUE.reduce((a, b) => a + b, 0) / 12).toFixed(0)}k MAD</strong>
            </div>
            <div className="summary-item">
              <span>Peak Month</span>
              <strong>{Math.max(...MONTHLY_REVENUE)}k MAD</strong>
            </div>
            <div className="summary-item">
              <span>Growth Rate</span>
              <strong className="positive">+12.4%</strong>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Zap size={18} />
              Quick Actions
            </h3>
          </div>
          <div className="quick-actions">
            <button className="action-button" onClick={() => showToast('New session scheduled')}>
              <Calendar size={20} />
              <span>Schedule Session</span>
            </button>
            <button className="action-button" onClick={() => showToast('New student registered')}>
              <Users size={20} />
              <span>Add Student</span>
            </button>
            <button className="action-button" onClick={() => showToast('Payment recorded')}>
              <CreditCard size={20} />
              <span>Record Payment</span>
            </button>
            <button className="action-button" onClick={() => showToast('Maintenance scheduled')}>
              <Wrench size={20} />
              <span>Schedule Maintenance</span>
            </button>
            <button className="action-button" onClick={() => showToast('Report generated')}>
              <FileText size={20} />
              <span>Generate Report</span>
            </button>
            <button className="action-button" onClick={() => showToast('Message sent')}>
              <Mail size={20} />
              <span>Send Reminder</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="dashboard-footer">
        <p>
          Last updated: {formatDate()} at {formatTime()}
        </p>
        <div className="footer-stats">
          <span>
            <CheckCircle size={12} /> System Operational
          </span>
          <span>
            <Shield size={12} /> All Systems Go
          </span>
          <span>
            <Bell size={12} /> {unreadCount} Unread Notifications
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
