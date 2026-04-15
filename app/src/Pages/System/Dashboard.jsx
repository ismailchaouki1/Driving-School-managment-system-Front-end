// Pages/System/Dashboard.jsx
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
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import axios from '../../services/axios';
import '../../Styles/System/Dashboard.scss';
import { Link } from 'react-router-dom';

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
  isExpense = false,
}) => {
  const Icon = IconComponent;
  const displayValue = typeof value === 'number' ? value.toLocaleString() : value || 0;
  return (
    <div className={`kpi-card ${isExpense ? 'expense-kpi' : ''}`} style={{ background: bgColor }}>
      <div className="kpi-icon">{Icon && <Icon size={24} />}</div>
      <div className="kpi-info">
        <div className={`kpi-value ${isExpense ? 'expense-value' : ''}`}>
          {prefix}
          {displayValue}
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
  const statusClass = status?.toLowerCase().replace(' ', '-') || 'scheduled';
  return (
    <span className={`status-badge ${statusClass}`}>
      {status === 'Completed' && <CheckCircle size={10} />}
      {status === 'In Progress' && <Activity size={10} />}
      {status === 'Scheduled' && <Clock size={10} />}
      {status === 'Pending' && <AlertCircle size={10} />}
      {status === 'Paid' && <CheckCircle size={10} />}
      {status === 'Active' && <CheckCircle size={10} />}
      {status === 'Maintenance' && <Wrench size={10} />}
      {status === 'Inactive' && <AlertCircle size={10} />}
      {status}
    </span>
  );
};

// Mini Bar Chart Component
const MiniBarChart = ({ data, height = 40, color = '#8cff2e' }) => {
  if (!data || data.length === 0) return null;
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
        >
          <span className="mini-bar-value">{value}k MAD</span>
        </div>
      ))}
    </div>
  );
};

// Mini Pie Chart Component
const MiniPieChart = ({ data, size = 60 }) => {
  if (!data || data.length === 0) return null;
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [currentTime, setCurrentTime] = useState(new Date());

  // State for real data
  const [dashboardData, setDashboardData] = useState({
    students: [],
    instructors: [],
    vehicles: [],
    sessions: [],
    payments: [],
    stats: {
      totalStudents: 0,
      activeStudents: 0,
      newStudentsThisMonth: 0,
      totalRevenue: 0,
      totalExpenses: 0,
      netRevenue: 0,
      monthlyRevenue: 0,
      monthlyExpenses: 0,
      revenueGrowth: 0,
      totalSessions: 0,
      completedSessions: 0,
      completionRate: 0,
      totalVehicles: 0,
      availableVehicles: 0,
      vehiclesInMaintenance: 0,
      vehiclesInactive: 0,
      pendingPayments: 0,
      collectionRate: 0,
    },
    todaySessions: [],
    recentPayments: [],
    topInstructors: [],
    categoryDistribution: [],
    vehicleUtilization: [],
    weeklyActivity: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sessions: [0, 0, 0, 0, 0, 0, 0],
      revenue: [0, 0, 0, 0, 0, 0, 0],
      expenses: [0, 0, 0, 0, 0, 0, 0],
    },
    monthlyRevenue: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    monthlyExpenses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  });

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

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsRefreshing(true);

      // Fetch all necessary data in parallel
      const [studentsRes, instructorsRes, vehiclesRes, sessionsRes, paymentsRes] =
        await Promise.all([
          axios.get('/students'),
          axios.get('/instructors'),
          axios.get('/vehicles'),
          axios.get('/sessions'),
          axios.get('/payments'),
        ]);

      // Process students
      const students = studentsRes.data.success ? studentsRes.data.data : [];
      const activeStudents = students.filter(
        (s) => s.payment_status !== 'Pending' || s.initial_payment > 0,
      ).length;

      // Calculate new students this month
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const newStudentsThisMonth = students.filter((s) => {
        const regDate = new Date(s.registration_date);
        return regDate.getMonth() === currentMonth && regDate.getFullYear() === currentYear;
      }).length;

      // Process sessions
      const sessions = sessionsRes.data.success ? sessionsRes.data.data : [];
      const totalSessions = sessions.length;
      const completedSessions = sessions.filter((s) => s.status === 'Completed').length;
      const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      // Today's sessions
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = sessions
        .filter((s) => s.date === today)
        .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''))
        .slice(0, 5);

      // Process payments - Separate revenue and expenses
      const payments = paymentsRes.data.success ? paymentsRes.data.data : [];

      // Revenue from Registration, Session, Exam
      const totalRevenue = payments
        .filter((p) => ['Registration', 'Session', 'Exam'].includes(p.type))
        .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

      // Expenses from Maintenance and Incident
      const totalExpenses = payments
        .filter((p) => ['Maintenance', 'Incident'].includes(p.type))
        .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

      const netRevenue = totalRevenue - totalExpenses;

      // Monthly revenue and expenses
      const monthlyRevenue = payments
        .filter((p) => {
          const paymentDate = new Date(p.date);
          return (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear &&
            ['Registration', 'Session', 'Exam'].includes(p.type)
          );
        })
        .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

      const monthlyExpenses = payments
        .filter((p) => {
          const paymentDate = new Date(p.date);
          return (
            paymentDate.getMonth() === currentMonth &&
            paymentDate.getFullYear() === currentYear &&
            ['Maintenance', 'Incident'].includes(p.type)
          );
        })
        .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

      // Previous month revenue for growth calculation
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const previousMonthlyRevenue = payments
        .filter((p) => {
          const paymentDate = new Date(p.date);
          return (
            paymentDate.getMonth() === prevMonth &&
            paymentDate.getFullYear() === prevYear &&
            ['Registration', 'Session', 'Exam'].includes(p.type)
          );
        })
        .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

      const revenueGrowth =
        previousMonthlyRevenue > 0
          ? ((monthlyRevenue - previousMonthlyRevenue) / previousMonthlyRevenue) * 100
          : 0;

      // Pending payments (overdue or pending)
      const pendingPayments = payments
        .filter((p) => p.status === 'Pending' || p.status === 'Overdue')
        .reduce((sum, p) => sum + (Number(p.amount_remaining) || 0), 0);

      // Collection rate
      const totalBilled = payments.reduce((sum, p) => sum + (Number(p.amount_total) || 0), 0);
      const collectionRate = totalBilled > 0 ? (totalRevenue / totalBilled) * 100 : 0;

      // Recent payments
      const recentPayments = payments
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Process vehicles
      const vehicles = vehiclesRes.data.success ? vehiclesRes.data.data : [];
      const totalVehicles = vehicles.length;
      const availableVehicles = vehicles.filter((v) => v.status === 'Active').length;
      const vehiclesInMaintenance = vehicles.filter((v) => v.status === 'Maintenance').length;
      const vehiclesInactive = vehicles.filter(
        (v) => v.status === 'Inactive' || v.status === 'Out of Service',
      ).length;

      // Vehicle utilization (top 4)
      const vehicleUtilization = vehicles
        .sort((a, b) => (b.sessions_count || 0) - (a.sessions_count || 0))
        .slice(0, 4)
        .map((v) => ({
          id: v.id,
          name: `${v.brand} ${v.model}`,
          plate: v.plate,
          status: v.status,
          utilization: Math.min(100, Math.round(((v.sessions_count || 0) / 300) * 100)),
          nextMaintenance: v.next_maintenance,
        }));

      // Process instructors for top performers
      const instructors = instructorsRes.data.success ? instructorsRes.data.data : [];
      const topInstructors = instructors
        .sort((a, b) => (b.sessions_count || 0) - (a.sessions_count || 0))
        .slice(0, 4)
        .map((i) => ({
          id: i.id,
          name: `${i.first_name} ${i.last_name}`,
          sessions: i.sessions_count || 0,
          rating: i.rating || 0,
          completionRate: i.completion_rate || 0,
          students: i.students_count || 0,
        }));

      // Calculate category distribution from students
      const categoryMap = {};
      students.forEach((s) => {
        const cat = s.type || 'B';
        categoryMap[cat] = (categoryMap[cat] || 0) + 1;
      });

      const categoryColors = {
        B: '#8cff2e',
        A: '#3b82f6',
        A1: '#06b6d4',
        C: '#f59e0b',
        D: '#ef4444',
        BE: '#8b5cf6',
      };

      const totalStudentsCount = students.length;
      const categoryDistribution = Object.entries(categoryMap)
        .map(([name, count]) => ({
          name: `Category ${name}`,
          value: totalStudentsCount > 0 ? Math.round((count / totalStudentsCount) * 100) : 0,
          color: categoryColors[name] || '#64748b',
          count: count,
        }))
        .sort((a, b) => b.value - a.value);

      // Calculate weekly activity from sessions
      const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weeklySessions = [0, 0, 0, 0, 0, 0, 0];
      const weeklyRevenue = [0, 0, 0, 0, 0, 0, 0];
      const weeklyExpenses = [0, 0, 0, 0, 0, 0, 0];

      const today_date = new Date();
      const startOfWeek = new Date(today_date);
      startOfWeek.setDate(today_date.getDate() - today_date.getDay() + 1); // Monday

      sessions.forEach((session) => {
        const sessionDate = new Date(session.date);
        if (sessionDate >= startOfWeek && sessionDate <= today_date) {
          const dayIndex = sessionDate.getDay();
          const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
          if (adjustedIndex >= 0 && adjustedIndex < 7) {
            weeklySessions[adjustedIndex]++;
            if (session.payment_status === 'Paid') {
              weeklyRevenue[adjustedIndex] += Number(session.price) || 0;
            }
          }
        }
      });

      // Calculate weekly expenses from payments
      payments.forEach((payment) => {
        if (['Maintenance', 'Incident'].includes(payment.type)) {
          const paymentDate = new Date(payment.date);
          if (paymentDate >= startOfWeek && paymentDate <= today_date) {
            const dayIndex = paymentDate.getDay();
            const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            if (adjustedIndex >= 0 && adjustedIndex < 7) {
              weeklyExpenses[adjustedIndex] += Number(payment.amount_paid) || 0;
            }
          }
        }
      });

      // Calculate monthly revenue and expense trends
      const monthlyRevenueTrend = Array(12).fill(0);
      const monthlyExpensesTrend = Array(12).fill(0);

      payments.forEach((payment) => {
        const paymentDate = new Date(payment.date);
        const month = paymentDate.getMonth();
        if (paymentDate.getFullYear() === currentYear) {
          if (['Registration', 'Session', 'Exam'].includes(payment.type)) {
            monthlyRevenueTrend[month] += Number(payment.amount_paid) || 0;
          } else if (['Maintenance', 'Incident'].includes(payment.type)) {
            monthlyExpensesTrend[month] += Number(payment.amount_paid) || 0;
          }
        }
      });

      const monthlyRevenueK = monthlyRevenueTrend.map((amount) => Math.round(amount / 1000));
      const monthlyExpensesK = monthlyExpensesTrend.map((amount) => Math.round(amount / 1000));

      setDashboardData({
        students,
        instructors,
        vehicles,
        sessions,
        payments,
        stats: {
          totalStudents: students.length,
          activeStudents,
          newStudentsThisMonth,
          totalRevenue,
          totalExpenses,
          netRevenue,
          monthlyRevenue,
          monthlyExpenses,
          revenueGrowth,
          totalSessions,
          completedSessions,
          completionRate,
          totalVehicles,
          availableVehicles,
          vehiclesInMaintenance,
          vehiclesInactive,
          pendingPayments,
          collectionRate,
        },
        todaySessions,
        recentPayments,
        topInstructors,
        categoryDistribution,
        vehicleUtilization,
        weeklyActivity: {
          labels: weekDays,
          sessions: weeklySessions,
          revenue: weeklyRevenue,
          expenses: weeklyExpenses,
        },
        monthlyRevenue: monthlyRevenueK,
        monthlyExpenses: monthlyExpensesK,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

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

  const handleRefresh = async () => {
    await fetchDashboardData();
    showToast('Dashboard data refreshed successfully');
    addNotification('Dashboard Refreshed', 'All dashboard data has been updated', 'system');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Get user name from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';

  // Safely get values with fallbacks
  const stats = dashboardData.stats || {};
  const weeklyActivity = dashboardData.weeklyActivity || {
    labels: [],
    sessions: [],
    revenue: [],
    expenses: [],
  };
  const monthlyRevenue = dashboardData.monthlyRevenue || Array(12).fill(0);
  // const monthlyExpenses = dashboardData.monthlyExpenses || Array(12).fill(0);
  const categoryDistribution = dashboardData.categoryDistribution || [];
  const vehicleUtilization = dashboardData.vehicleUtilization || [];
  const todaySessions = dashboardData.todaySessions || [];
  const recentPayments = dashboardData.recentPayments || [];
  const topInstructors = dashboardData.topInstructors || [];
  const instructors = dashboardData.instructors || [];

  return (
    <div className="dashboard-page">
      <Toast toast={toast} />

      {/* Loading Overlay */}
      {isRefreshing && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <Loader size={40} className="spinner" />
            <p>Loading dashboard data...</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="greeting-section">
            <h1>
              {getGreeting()}, {userName}! 👋
            </h1>
            <p>
              {formatDate()} • {formatTime()}
            </p>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw size={16} className={isRefreshing ? 'spinning' : ''} />
              Refresh
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
            <div className="stat-value">{stats.activeStudents || 0}</div>
            <div className="stat-label">Active Students</div>
            <div className="stat-trend positive">
              <TrendingUp size={10} /> +{stats.newStudentsThisMonth || 0} this month
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f615', color: '#3b82f6' }}>
            <CalendarIcon size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.totalSessions || 0}</div>
            <div className="stat-label">Total Sessions</div>
            <div className="stat-trend positive">
              <TrendingUp size={10} /> {Math.round(stats.completionRate || 0)}% completed
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b98115', color: '#10b981' }}>
            <DollarSign size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{(stats.monthlyRevenue || 0).toLocaleString()} MAD</div>
            <div className="stat-label">Monthly Revenue</div>
            <div className="stat-trend positive">
              <TrendingUp size={10} /> +{Math.abs(stats.revenueGrowth || 0).toFixed(1)}%
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b15', color: '#f59e0b' }}>
            <Target size={20} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{Math.round(stats.completionRate || 0)}%</div>
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
          value={stats.totalRevenue || 0}
          prefix="MAD "
          change={stats.revenueGrowth || 0}
          changeType={stats.revenueGrowth >= 0 ? 'up' : 'down'}
        />
        <KpiCard
          icon={Wrench}
          label="Total Expenses"
          value={stats.totalExpenses || 0}
          prefix="MAD "
          change={12.5}
          changeType="up"
          isExpense={true}
        />
        <KpiCard
          icon={DollarSign}
          label="Net Revenue"
          value={stats.netRevenue || 0}
          prefix="MAD "
          change={stats.netRevenue >= 0 ? 8.2 : -5.3}
          changeType={stats.netRevenue >= 0 ? 'up' : 'down'}
        />
        <KpiCard
          icon={Users}
          label="Total Students"
          value={stats.totalStudents || 0}
          change={8.5}
          changeType="up"
        />
        <KpiCard
          icon={Car}
          label="Available Vehicles"
          value={`${stats.availableVehicles || 0}/${stats.totalVehicles || 0}`}
          change={-2}
          changeType="down"
        />
        <KpiCard
          icon={CreditCard}
          label="Collection Rate"
          value={Math.round(stats.collectionRate || 0)}
          suffix="%"
          change={3.2}
          changeType="up"
        />
        <KpiCard
          icon={Clock}
          label="Pending Payments"
          value={stats.pendingPayments || 0}
          prefix="MAD "
          change={-5.1}
          changeType="down"
        />
        <KpiCard
          icon={Award}
          label="Completion Rate"
          value={Math.round(stats.completionRate || 0)}
          suffix="%"
          change={2.5}
          changeType="up"
        />
      </div>

      {/* Vehicle Status Summary */}
      <div className="vehicle-status-summary">
        <div className="status-card active">
          <CheckCircle size={20} />
          <div>
            <span className="status-value">{stats.availableVehicles || 0}</span>
            <span className="status-label">Active Vehicles</span>
          </div>
        </div>
        <div className="status-card maintenance">
          <Wrench size={20} />
          <div>
            <span className="status-value">{stats.vehiclesInMaintenance || 0}</span>
            <span className="status-label">In Maintenance</span>
          </div>
        </div>
        <div className="status-card inactive">
          <AlertCircle size={20} />
          <div>
            <span className="status-value">{stats.vehiclesInactive || 0}</span>
            <span className="status-label">Inactive/Out of Service</span>
          </div>
        </div>
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
              {(weeklyActivity.sessions || []).map((value, index) => {
                const maxRevenue = Math.max(...(weeklyActivity.revenue || [0]), 1);
                const maxSessions = Math.max(...(weeklyActivity.sessions || [0]), 1);
                return (
                  <div key={index} className="bar-container">
                    <div className="bar-wrapper">
                      <div
                        className="bar revenue-bar"
                        style={{
                          height: `${((weeklyActivity.revenue || [0])[index] / maxRevenue) * 100}%`,
                        }}
                      />
                      <div
                        className="bar sessions-bar"
                        style={{ height: `${(value / maxSessions) * 100}%` }}
                      />
                    </div>
                    <span className="bar-label">{(weeklyActivity.labels || [])[index]}</span>
                  </div>
                );
              })}
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
              <MiniPieChart data={categoryDistribution} size={140} />
            </div>
            <div className="category-list">
              {categoryDistribution.slice(0, 5).map((cat, index) => (
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
            {vehicleUtilization.map((vehicle) => (
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

      {/* Recent Sessions & Payments Row */}
      <div className="tables-row">
        {/* Today's Sessions */}
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
            {todaySessions.length === 0 ? (
              <div className="empty-state">No sessions scheduled for today</div>
            ) : (
              todaySessions.map((session) => (
                <div key={session.id} className="session-item">
                  <div className="session-time">
                    <Clock size={14} />
                    <span>{session.start_time}</span>
                  </div>
                  <div className="session-info">
                    <div className="session-student">{session.student_name}</div>
                    <div className="session-details">
                      <span className={`session-type ${session.type?.toLowerCase()}`}>
                        {session.type}
                      </span>
                      <span className="session-instructor">{session.instructor_name}</span>
                    </div>
                  </div>
                  <StatusBadge status={session.status} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Payments & Expenses */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Receipt size={18} />
              Recent Transactions
            </h3>
            <Link className="view-link" to={'/system/payments'}>
              View All <ChevronRight size={14} />
            </Link>
          </div>
          <div className="payments-list">
            {recentPayments.length === 0 ? (
              <div className="empty-state">No recent transactions</div>
            ) : (
              recentPayments.map((payment) => {
                const isExpense = payment.type === 'Maintenance' || payment.type === 'Incident';
                return (
                  <div
                    key={payment.id}
                    className={`payment-item ${isExpense ? 'expense-item' : ''}`}
                  >
                    <div className="payment-info">
                      <div className="payment-student">
                        {isExpense ? payment.type : payment.student_name}
                      </div>
                      <div className="payment-details">
                        <span className={`payment-type ${isExpense ? 'expense' : 'revenue'}`}>
                          {payment.type}
                        </span>
                        <span className="payment-date">{payment.date}</span>
                      </div>
                    </div>
                    <div className="payment-amount">
                      <span
                        className={`amount ${isExpense ? 'expense-amount' : payment.status === 'Paid' ? 'positive' : 'pending'}`}
                      >
                        {isExpense ? '-' : ''}
                        {(Number(payment.amount_paid) || 0).toLocaleString()} MAD
                      </span>
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="table-card">
          <div className="table-header">
            <h3>
              <Bell size={18} />
              Quick Stats
            </h3>
          </div>
          <div className="quick-stats-list">
            <div className="stat-row">
              <span className="stat-label">Total Instructors</span>
              <span className="stat-value">{instructors.length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Active Vehicles</span>
              <span className="stat-value">{stats.availableVehicles || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Vehicles in Maintenance</span>
              <span className="stat-value">{stats.vehiclesInMaintenance || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Completed Sessions</span>
              <span className="stat-value">{stats.completedSessions || 0}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Collection Rate</span>
              <span className="stat-value">{Math.round(stats.collectionRate || 0)}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Monthly Expenses</span>
              <span className="stat-value expense-value">
                {(stats.monthlyExpenses || 0).toLocaleString()} MAD
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Performance & Monthly Trend Row */}
      <div className="tables-row">
        {/* Top Instructors */}
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
            {topInstructors.length === 0 ? (
              <div className="empty-state">No instructor data available</div>
            ) : (
              topInstructors.map((instructor) => (
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
              ))
            )}
          </div>
        </div>

        {/* Monthly Revenue Trend */}
        <div className="table-card revenue-trend-card">
          <div className="chart-header">
            <h3>
              <LineChart size={18} />
              Revenue Trend
            </h3>
            <span className={`trend-value ${stats.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
              {stats.revenueGrowth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {stats.revenueGrowth >= 0 ? '+' : ''}
              {stats.revenueGrowth.toFixed(1)}% vs last month
            </span>
          </div>
          <div className="revenue-trend">
            <MiniBarChart
              data={monthlyRevenue.length > 0 ? monthlyRevenue : Array(12).fill(0)}
              height={120}
              color="#8cff2e"
            />
            <div className="trend-labels">
              {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          </div>
          <div className="revenue-summary">
            <div className="summary-item">
              <span>Average Monthly Revenue</span>
              <strong>
                {monthlyRevenue.length > 0 && monthlyRevenue.some((v) => v > 0)
                  ? Math.round(monthlyRevenue.reduce((a, b) => a + b, 0) / 12)
                  : 0}
                k MAD
              </strong>
            </div>
            <div className="summary-item">
              <span>Peak Month</span>
              <strong>
                {monthlyRevenue.length > 0 && monthlyRevenue.some((v) => v > 0)
                  ? Math.max(...monthlyRevenue)
                  : 0}
                k MAD
              </strong>
            </div>
            <div className="summary-item">
              <span>Growth Rate</span>
              <strong className={stats.revenueGrowth >= 0 ? 'positive' : 'negative'}>
                {stats.revenueGrowth >= 0 ? '+' : ''}
                {stats.revenueGrowth.toFixed(1)}%
              </strong>
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
            <Link to="/system/sessions" className="action-button">
              <Calendar size={20} />
              <span>Schedule Session</span>
            </Link>
            <Link to="/system/students" className="action-button">
              <Users size={20} />
              <span>Add Student</span>
            </Link>
            <Link to="/system/payments" className="action-button">
              <CreditCard size={20} />
              <span>Record Payment</span>
            </Link>
            <Link to="/system/vehicles" className="action-button">
              <Wrench size={20} />
              <span>Schedule Maintenance</span>
            </Link>
            <Link to="/system/vehicles" className="action-button">
              <AlertTriangle size={20} />
              <span>Report Incident</span>
            </Link>
            <Link to="/system/statistics" className="action-button">
              <FileText size={20} />
              <span>Generate Report</span>
            </Link>
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
