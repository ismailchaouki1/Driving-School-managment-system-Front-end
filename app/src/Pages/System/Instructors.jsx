// Pages/System/Instructors.jsx
import { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  FileText,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Car,
  Star,
  ThumbsUp,
  ThumbsDown,
  Users,
  DollarSign,
  Grid,
  List,
  Award,
  Target,
  Activity,
  UserCheck,
  UserX,
  Percent,
  Wallet,
  Receipt,
  Calendar as CalendarIcon,
  Filter,
  RefreshCw,
  Loader,
  Wrench,
  BarChart2,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  IdCard,
  Briefcase,
  GraduationCap,
  CreditCard,
  Upload,
  Camera,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../Styles/System/Instructors.scss';

/* ─────────────── Mock Data ─────────────── */
const INSTRUCTOR_TYPES = ['Code', 'Driving', 'Both', 'Simulator', 'Evaluation'];
const INSTRUCTOR_STATUSES = ['Active', 'On Leave', 'Inactive', 'Training'];
const EXPERIENCE_LEVELS = ['Junior', 'Intermediate', 'Senior', 'Master'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MOCK_INSTRUCTORS = [
  {
    id: 1,
    first_name: 'Mohammed',
    last_name: 'Benali',
    email: 'mohammed.benali@clario.com',
    phone: '0612345678',
    address: '45 Rue Mohammed V, Casablanca',
    cin: 'AB123456',
    type: 'Both',
    status: 'Active',
    experience_level: 'Senior',
    years_experience: 8,
    hire_date: '2017-03-15',
    specialization: 'Category B, C',
    license_number: 'IN-2024-001',
    avatar: null,
    students_count: 28,
    sessions_count: 156,
    completion_rate: 94,
    rating: 4.8,
    revenue: 31200,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    available_hours: { start: '08:00', end: '18:00' },
    vehicles_assigned: [1, 2],
    notes: 'Senior instructor with excellent track record',
    documents: [],
    certifications: [
      {
        id: 1,
        name: 'Driving Instructor License',
        issue_date: '2017-03-15',
        expiry_date: '2027-03-15',
      },
      {
        id: 2,
        name: 'First Aid Certification',
        issue_date: '2023-01-10',
        expiry_date: '2026-01-10',
      },
    ],
    schedule: [
      { day: 'Monday', sessions: ['09:00-10:30', '11:00-12:30', '14:00-15:30'] },
      { day: 'Tuesday', sessions: ['09:00-10:30', '11:00-12:30', '14:00-15:30'] },
      { day: 'Wednesday', sessions: ['09:00-10:30', '11:00-12:30'] },
      { day: 'Thursday', sessions: ['09:00-10:30', '11:00-12:30', '14:00-15:30'] },
      { day: 'Friday', sessions: ['09:00-10:30', '11:00-12:30'] },
    ],
  },
  {
    id: 2,
    first_name: 'Fatima',
    last_name: 'Zahra',
    email: 'fatima.zahra@clario.com',
    phone: '0698765432',
    address: '12 Avenue Hassan II, Rabat',
    cin: 'CD789012',
    type: 'Driving',
    status: 'Active',
    experience_level: 'Senior',
    years_experience: 7,
    hire_date: '2018-06-20',
    specialization: 'Category B, BE',
    license_number: 'IN-2024-002',
    avatar: null,
    students_count: 25,
    sessions_count: 142,
    completion_rate: 92,
    rating: 4.7,
    revenue: 28400,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
    available_hours: { start: '09:00', end: '19:00' },
    vehicles_assigned: [2, 4],
    notes: 'Specializes in heavy vehicle training',
    documents: [],
    certifications: [
      {
        id: 1,
        name: 'Driving Instructor License',
        issue_date: '2018-06-20',
        expiry_date: '2028-06-20',
      },
      {
        id: 2,
        name: 'Heavy Vehicle Certification',
        issue_date: '2019-08-15',
        expiry_date: '2029-08-15',
      },
    ],
    schedule: [
      { day: 'Monday', sessions: ['10:00-11:30', '13:00-14:30', '15:00-16:30'] },
      { day: 'Tuesday', sessions: ['10:00-11:30', '13:00-14:30', '15:00-16:30'] },
      { day: 'Wednesday', sessions: ['10:00-11:30', '13:00-14:30'] },
      { day: 'Thursday', sessions: ['10:00-11:30', '13:00-14:30', '15:00-16:30'] },
      { day: 'Saturday', sessions: ['09:00-10:30', '11:00-12:30'] },
    ],
  },
  {
    id: 3,
    first_name: 'Karim',
    last_name: 'Tazi',
    email: 'karim.tazi@clario.com',
    phone: '0655443322',
    address: '8 Rue de la Liberté, Marrakech',
    cin: 'EF345678',
    type: 'Code',
    status: 'Active',
    experience_level: 'Intermediate',
    years_experience: 4,
    hire_date: '2020-01-10',
    specialization: 'Category B - Code',
    license_number: 'IN-2024-003',
    avatar: null,
    students_count: 22,
    sessions_count: 128,
    completion_rate: 89,
    rating: 4.6,
    revenue: 25600,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    available_hours: { start: '08:30', end: '17:30' },
    vehicles_assigned: [],
    notes: 'Code specialist, excellent theory teaching',
    documents: [],
    certifications: [
      {
        id: 1,
        name: 'Code Instructor Certification',
        issue_date: '2020-01-10',
        expiry_date: '2030-01-10',
      },
    ],
    schedule: [
      { day: 'Monday', sessions: ['09:00-11:00', '14:00-16:00'] },
      { day: 'Tuesday', sessions: ['09:00-11:00', '14:00-16:00'] },
      { day: 'Wednesday', sessions: ['09:00-11:00'] },
      { day: 'Thursday', sessions: ['09:00-11:00', '14:00-16:00'] },
      { day: 'Friday', sessions: ['09:00-11:00'] },
    ],
  },
  {
    id: 4,
    first_name: 'Nadia',
    last_name: 'Ouazzani',
    email: 'nadia.ouazzani@clario.com',
    phone: '0611223344',
    address: '23 Rue Oukaimeden, Casablanca',
    cin: 'GH901234',
    type: 'Driving',
    status: 'On Leave',
    experience_level: 'Senior',
    years_experience: 9,
    hire_date: '2015-09-01',
    specialization: 'Category A, B',
    license_number: 'IN-2024-004',
    avatar: null,
    students_count: 20,
    sessions_count: 118,
    completion_rate: 91,
    rating: 4.8,
    revenue: 23600,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
    available_hours: { start: '09:00', end: '17:00' },
    vehicles_assigned: [3],
    notes: 'Motorcycle specialist, currently on maternity leave',
    documents: [],
    certifications: [
      {
        id: 1,
        name: 'Driving Instructor License',
        issue_date: '2015-09-01',
        expiry_date: '2025-09-01',
      },
      {
        id: 2,
        name: 'Motorcycle Instructor Certification',
        issue_date: '2016-05-20',
        expiry_date: '2026-05-20',
      },
    ],
    schedule: [],
  },
  {
    id: 5,
    first_name: 'Hassan',
    last_name: 'El Fassi',
    email: 'hassan.elfassi@clario.com',
    phone: '0677889900',
    address: '15 Rue de la Gare, Fez',
    cin: 'IJ567890',
    type: 'Simulator',
    status: 'Active',
    experience_level: 'Intermediate',
    years_experience: 3,
    hire_date: '2022-02-14',
    specialization: 'Simulator Training',
    license_number: 'IN-2024-005',
    avatar: null,
    students_count: 18,
    sessions_count: 98,
    completion_rate: 87,
    rating: 4.5,
    revenue: 19600,
    available_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    available_hours: { start: '10:00', end: '20:00' },
    vehicles_assigned: [],
    notes: 'Simulator expert, evening availability',
    documents: [],
    certifications: [
      {
        id: 1,
        name: 'Simulator Instructor Certification',
        issue_date: '2022-02-14',
        expiry_date: '2032-02-14',
      },
    ],
    schedule: [
      { day: 'Monday', sessions: ['14:00-15:30', '16:00-17:30', '18:00-19:30'] },
      { day: 'Tuesday', sessions: ['14:00-15:30', '16:00-17:30', '18:00-19:30'] },
      { day: 'Wednesday', sessions: ['14:00-15:30', '16:00-17:30'] },
      { day: 'Thursday', sessions: ['14:00-15:30', '16:00-17:30', '18:00-19:30'] },
      { day: 'Friday', sessions: ['14:00-15:30', '16:00-17:30'] },
      { day: 'Saturday', sessions: ['10:00-11:30', '13:00-14:30'] },
    ],
  },
];

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  address: '',
  cin: '',
  type: 'Both',
  status: 'Active',
  experience_level: 'Intermediate',
  years_experience: '',
  hire_date: new Date().toISOString().split('T')[0],
  specialization: '',
  license_number: '',
  available_days: [],
  available_hours: { start: '09:00', end: '18:00' },
  notes: '',
};

/* ─────────────── Helper Functions ─────────────── */
const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const getRandomGradient = (id) => {
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
  ];
  return gradients[id % gradients.length];
};

/* ─────────────── Sub-components ─────────────── */

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusClass = status.toLowerCase().replace(' ', '-');
  const icons = {
    active: <CheckCircle size={10} />,
    'on-leave': <Clock size={10} />,
    inactive: <AlertCircle size={10} />,
    training: <Activity size={10} />,
  };
  return (
    <span className={`status-badge ${statusClass}`}>
      {icons[statusClass] || icons.active}
      {status}
    </span>
  );
};

// Type Badge Component
const TypeBadge = ({ type }) => {
  const typeClass = type.toLowerCase();
  return <span className={`type-badge ${typeClass}`}>{type}</span>;
};

// Rating Stars Component
const RatingStars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="rating-stars">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          fill={i < fullStars ? '#f59e0b' : i === fullStars && hasHalfStar ? '#f59e0b' : 'none'}
          color="#f59e0b"
          className={i < fullStars ? 'filled' : ''}
        />
      ))}
      <span>{rating.toFixed(1)}</span>
    </div>
  );
};

// Sort Icon Component
const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ChevronDown size={13} className="sort-icon-inactive" />;
  return sortDir === 'asc' ? (
    <ChevronUp size={13} className="sort-icon-active" />
  ) : (
    <ChevronDown size={13} className="sort-icon-active" />
  );
};

// Instructor Card Component
const InstructorCard = ({ instructor, onView, onEdit, onDelete, onSchedule }) => {
  const [expanded, setExpanded] = useState(false);
  const revenuePerSession = instructor.revenue / instructor.sessions_count;

  return (
    <div className={`instructor-card ${expanded ? 'expanded' : ''}`}>
      <div
        className="card-header-gradient"
        style={{ background: getRandomGradient(instructor.id) }}
      >
        <div className="instructor-avatar-large">
          {instructor.avatar ? (
            <img src={instructor.avatar} alt={instructor.first_name} />
          ) : (
            <span>{getInitials(instructor.first_name, instructor.last_name)}</span>
          )}
        </div>
        <div className="instructor-status-badge">
          <StatusBadge status={instructor.status} />
        </div>
        <button className="card-menu-btn" onClick={() => setExpanded(!expanded)}>
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="card-content">
        <h3 className="instructor-name">
          {instructor.first_name} {instructor.last_name}
        </h3>
        <div className="instructor-type">
          <TypeBadge type={instructor.type} />
          <span className="experience-badge">{instructor.experience_level}</span>
        </div>

        <div className="contact-info">
          <div className="info-item">
            <Mail size={14} />
            <span>{instructor.email}</span>
          </div>
          <div className="info-item">
            <Phone size={14} />
            <span>{instructor.phone}</span>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <Users size={14} />
            <div>
              <span className="stat-value">{instructor.students_count}</span>
              <span className="stat-label">Students</span>
            </div>
          </div>
          <div className="stat-item">
            <Car size={14} />
            <div>
              <span className="stat-value">{instructor.sessions_count}</span>
              <span className="stat-label">Sessions</span>
            </div>
          </div>
          <div className="stat-item">
            <Target size={14} />
            <div>
              <span className="stat-value">{instructor.completion_rate}%</span>
              <span className="stat-label">Completion</span>
            </div>
          </div>
          <div className="stat-item">
            <Star size={14} />
            <div>
              <RatingStars rating={instructor.rating} />
            </div>
          </div>
        </div>

        <div className="performance-bar">
          <div className="performance-header">
            <span>Performance</span>
            <span className="performance-percent">{instructor.completion_rate}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${instructor.completion_rate}%` }} />
          </div>
        </div>

        <div className="revenue-info">
          <DollarSign size={14} />
          <span>Revenue: {instructor.revenue.toLocaleString()} MAD</span>
          <span className="revenue-per-session">({revenuePerSession.toFixed(0)} MAD/session)</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="action-btn view" onClick={() => onView(instructor)}>
          <Eye size={14} />
          <span>View</span>
        </button>
        <button className="action-btn schedule" onClick={() => onSchedule(instructor)}>
          <CalendarIcon size={14} />
          <span>Schedule</span>
        </button>
        <button className="action-btn edit" onClick={() => onEdit(instructor)}>
          <Pencil size={14} />
          <span>Edit</span>
        </button>
        <button className="action-btn delete" onClick={() => onDelete(instructor)}>
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>

      {expanded && (
        <div className="expanded-details">
          <div className="details-section">
            <h4>
              <Briefcase size={14} />
              Professional Information
            </h4>
            <div className="details-grid">
              <div className="detail-item">
                <label>License Number</label>
                <p>{instructor.license_number}</p>
              </div>
              <div className="detail-item">
                <label>Years Experience</label>
                <p>{instructor.years_experience} years</p>
              </div>
              <div className="detail-item">
                <label>Hire Date</label>
                <p>{instructor.hire_date}</p>
              </div>
              <div className="detail-item">
                <label>Specialization</label>
                <p>{instructor.specialization}</p>
              </div>
            </div>
          </div>
          <div className="details-section">
            <h4>
              <Calendar size={14} />
              Available Days
            </h4>
            <div className="available-days">
              {DAYS_OF_WEEK.map((day) => (
                <span
                  key={day}
                  className={`day-badge ${instructor.available_days.includes(day) ? 'active' : 'inactive'}`}
                >
                  {day.slice(0, 3)}
                </span>
              ))}
            </div>
            <div className="available-hours">
              <Clock size={12} />
              <span>
                {instructor.available_hours.start} - {instructor.available_hours.end}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Instructor Modal (Add/Edit)
const InstructorModal = ({ instructor, onClose, onSave }) => {
  const isEdit = !!instructor?.id;
  const [form, setForm] = useState(isEdit ? { ...instructor } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleDay = (day) => {
    const currentDays = [...form.available_days];
    if (currentDays.includes(day)) {
      set(
        'available_days',
        currentDays.filter((d) => d !== day),
      );
    } else {
      set('available_days', [...currentDays, day]);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'First name is required';
    if (!form.last_name.trim()) e.last_name = 'Last name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.cin.trim()) e.cin = 'CIN is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({ ...form, id: form.id || Date.now() });
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="instructor-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <User size={22} color="#8cff2e" />
            </div>
            <div>
              <h2>{isEdit ? 'Edit Instructor' : 'Add New Instructor'}</h2>
              <p>{isEdit ? `ID: ${form.id}` : 'Fill in the instructor information'}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <User size={14} /> Basic Info
          </button>
          <button
            className={`tab-btn ${activeTab === 'professional' ? 'active' : ''}`}
            onClick={() => setActiveTab('professional')}
          >
            <Briefcase size={14} /> Professional
          </button>
          <button
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={14} /> Schedule
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'basic' && (
            <>
              <div className="form-section">
                <h4 className="section-title">
                  <User size={14} /> Personal Information
                </h4>
                <div className="form-row">
                  <div className="form-field">
                    <label>First Name *</label>
                    <input
                      type="text"
                      value={form.first_name}
                      onChange={(e) => set('first_name', e.target.value)}
                      className={errors.first_name ? 'error' : ''}
                    />
                    {errors.first_name && <span className="error-msg">{errors.first_name}</span>}
                  </div>
                  <div className="form-field">
                    <label>Last Name *</label>
                    <input
                      type="text"
                      value={form.last_name}
                      onChange={(e) => set('last_name', e.target.value)}
                      className={errors.last_name ? 'error' : ''}
                    />
                    {errors.last_name && <span className="error-msg">{errors.last_name}</span>}
                  </div>
                  <div className="form-field">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-msg">{errors.email}</span>}
                  </div>
                  <div className="form-field">
                    <label>Phone *</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-msg">{errors.phone}</span>}
                  </div>
                  <div className="form-field">
                    <label>CIN *</label>
                    <input
                      type="text"
                      value={form.cin}
                      onChange={(e) => set('cin', e.target.value)}
                      className={errors.cin ? 'error' : ''}
                    />
                    {errors.cin && <span className="error-msg">{errors.cin}</span>}
                  </div>
                  <div className="form-field full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => set('address', e.target.value)}
                      placeholder="Full address"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'professional' && (
            <>
              <div className="form-section">
                <h4 className="section-title">
                  <Briefcase size={14} /> Professional Details
                </h4>
                <div className="form-row">
                  <div className="form-field">
                    <label>Instructor Type</label>
                    <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                      {INSTRUCTOR_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Status</label>
                    <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                      {INSTRUCTOR_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Experience Level</label>
                    <select
                      value={form.experience_level}
                      onChange={(e) => set('experience_level', e.target.value)}
                    >
                      {EXPERIENCE_LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Years of Experience</label>
                    <input
                      type="number"
                      value={form.years_experience}
                      onChange={(e) => set('years_experience', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div className="form-field">
                    <label>Hire Date</label>
                    <input
                      type="date"
                      value={form.hire_date}
                      onChange={(e) => set('hire_date', e.target.value)}
                    />
                  </div>
                  <div className="form-field">
                    <label>License Number</label>
                    <input
                      type="text"
                      value={form.license_number}
                      onChange={(e) => set('license_number', e.target.value)}
                      placeholder="e.g., IN-2024-001"
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Specialization</label>
                    <input
                      type="text"
                      value={form.specialization}
                      onChange={(e) => set('specialization', e.target.value)}
                      placeholder="e.g., Category B, C, Heavy Vehicles"
                    />
                  </div>
                  <div className="form-field full-width">
                    <label>Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => set('notes', e.target.value)}
                      rows={3}
                      placeholder="Additional notes about the instructor..."
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'schedule' && (
            <>
              <div className="form-section">
                <h4 className="section-title">
                  <Calendar size={14} /> Availability Schedule
                </h4>
                <div className="form-row">
                  <div className="form-field">
                    <label>Available Days</label>
                    <div className="days-selector">
                      {DAYS_OF_WEEK.map((day) => (
                        <button
                          key={day}
                          type="button"
                          className={`day-btn ${form.available_days.includes(day) ? 'active' : ''}`}
                          onClick={() => toggleDay(day)}
                        >
                          {day.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-field">
                    <label>Available Hours</label>
                    <div className="hours-selector">
                      <input
                        type="time"
                        value={form.available_hours?.start || '09:00'}
                        onChange={(e) =>
                          set('available_hours', { ...form.available_hours, start: e.target.value })
                        }
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={form.available_hours?.end || '18:00'}
                        onChange={(e) =>
                          set('available_hours', { ...form.available_hours, end: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            <CheckCircle size={15} />
            {isEdit ? 'Save Changes' : 'Add Instructor'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Instructor Detail Modal
const InstructorDetail = ({ instructor, onClose, onEdit, onDelete, onSchedule }) => {
  if (!instructor) return null;

  const revenuePerSession = instructor.revenue / instructor.sessions_count;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="instructor-detail-modal">
        <div className="detail-header" style={{ background: getRandomGradient(instructor.id) }}>
          <div className="detail-avatar">
            <div className="instructor-avatar-large">
              {instructor.avatar ? (
                <img src={instructor.avatar} alt={instructor.first_name} />
              ) : (
                <span>{getInitials(instructor.first_name, instructor.last_name)}</span>
              )}
            </div>
          </div>
          <div className="detail-info">
            <h2>
              {instructor.first_name} {instructor.last_name}
            </h2>
            <div className="detail-badges">
              <TypeBadge type={instructor.type} />
              <StatusBadge status={instructor.status} />
              <span className="experience-badge">{instructor.experience_level}</span>
            </div>
            <div className="detail-contact">
              <span>
                <Mail size={12} /> {instructor.email}
              </span>
              <span>
                <Phone size={12} /> {instructor.phone}
              </span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-body">
          <div className="detail-stats-grid">
            <div className="stat-card">
              <Users size={20} />
              <div>
                <div className="stat-value">{instructor.students_count}</div>
                <div className="stat-label">Students</div>
              </div>
            </div>
            <div className="stat-card">
              <Car size={20} />
              <div>
                <div className="stat-value">{instructor.sessions_count}</div>
                <div className="stat-label">Sessions</div>
              </div>
            </div>
            <div className="stat-card">
              <Target size={20} />
              <div>
                <div className="stat-value">{instructor.completion_rate}%</div>
                <div className="stat-label">Completion</div>
              </div>
            </div>
            <div className="stat-card">
              <Star size={20} />
              <div>
                <RatingStars rating={instructor.rating} />
              </div>
            </div>
          </div>

          <div className="detail-sections">
            <div className="detail-section">
              <h4>
                <Briefcase size={14} /> Professional Information
              </h4>
              <div className="info-grid">
                <div className="info-row">
                  <span>License Number</span>
                  <strong>{instructor.license_number}</strong>
                </div>
                <div className="info-row">
                  <span>Years Experience</span>
                  <strong>{instructor.years_experience} years</strong>
                </div>
                <div className="info-row">
                  <span>Hire Date</span>
                  <strong>{instructor.hire_date}</strong>
                </div>
                <div className="info-row">
                  <span>Specialization</span>
                  <strong>{instructor.specialization}</strong>
                </div>
                <div className="info-row">
                  <span>Revenue Generated</span>
                  <strong>{instructor.revenue.toLocaleString()} MAD</strong>
                </div>
                <div className="info-row">
                  <span>Avg per Session</span>
                  <strong>{revenuePerSession.toFixed(0)} MAD</strong>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>
                <Calendar size={14} /> Availability
              </h4>
              <div className="available-days">
                {DAYS_OF_WEEK.map((day) => (
                  <span
                    key={day}
                    className={`day-badge ${instructor.available_days?.includes(day) ? 'active' : 'inactive'}`}
                  >
                    {day.slice(0, 3)}
                  </span>
                ))}
              </div>
              <div className="available-hours">
                <Clock size={14} />
                <span>
                  {instructor.available_hours?.start || '09:00'} -{' '}
                  {instructor.available_hours?.end || '18:00'}
                </span>
              </div>
            </div>

            {instructor.certifications?.length > 0 && (
              <div className="detail-section">
                <h4>
                  <GraduationCap size={14} /> Certifications
                </h4>
                <div className="certifications-list">
                  {instructor.certifications.map((cert) => (
                    <div key={cert.id} className="cert-item">
                      <div>
                        <div className="cert-name">{cert.name}</div>
                        <div className="cert-dates">
                          Issued: {cert.issue_date} | Expires: {cert.expiry_date}
                        </div>
                      </div>
                      <Shield size={16} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {instructor.notes && (
              <div className="detail-section">
                <h4>
                  <FileText size={14} /> Notes
                </h4>
                <p>{instructor.notes}</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-schedule" onClick={() => onSchedule(instructor)}>
            <CalendarIcon size={14} /> View Schedule
          </button>
          <button className="btn-edit" onClick={() => onEdit(instructor)}>
            <Pencil size={14} /> Edit
          </button>
          <button className="btn-delete" onClick={() => onDelete(instructor)}>
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Schedule Modal
const ScheduleModal = ({ instructor, onClose }) => {
  if (!instructor) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="schedule-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <CalendarIcon size={22} color="#8cff2e" />
            </div>
            <div>
              <h2>Weekly Schedule</h2>
              <p>
                {instructor.first_name} {instructor.last_name}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="schedule-grid">
            {DAYS_OF_WEEK.map((day) => {
              const daySchedule = instructor.schedule?.find((s) => s.day === day);
              const isAvailable = instructor.available_days?.includes(day);

              return (
                <div key={day} className={`schedule-day ${!isAvailable ? 'unavailable' : ''}`}>
                  <div className="day-header">
                    <span className="day-name">{day}</span>
                    {isAvailable ? (
                      <CheckCircle size={12} color="#22c55e" />
                    ) : (
                      <X size={12} color="#ef4444" />
                    )}
                  </div>
                  <div className="day-sessions">
                    {daySchedule?.sessions?.length > 0 ? (
                      daySchedule.sessions.map((session, idx) => (
                        <div key={idx} className="session-slot">
                          <Clock size={10} />
                          <span>{session}</span>
                        </div>
                      ))
                    ) : (
                      <span className="no-sessions">No sessions scheduled</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Delete Confirm Modal
const DeleteConfirm = ({ instructor, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="delete-confirm-modal">
      <div className="delete-icon">
        <Trash2 size={26} />
      </div>
      <h3>Delete Instructor?</h3>
      <p>
        Are you sure you want to delete{' '}
        <strong>
          {instructor?.first_name} {instructor?.last_name}
        </strong>
        ? This action cannot be undone and will affect all associated sessions.
      </p>
      <div className="delete-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-delete" onClick={onConfirm}>
          Delete Instructor
        </button>
      </div>
    </div>
  </div>
);

// Toast Component
const Toast = ({ toast }) =>
  toast ? (
    <div className={`toast-notification toast-${toast.type}`}>
      {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.msg}
    </div>
  ) : null;

// KPI Card Component - FIXED
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
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─────────────── Main Component ─────────────── */
const Instructors = () => {
  const [instructors, setInstructors] = useState(MOCK_INSTRUCTORS);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('first_name');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode, setViewMode] = useState('cards');
  const [modal, setModal] = useState(null);
  const [editInstructor, setEditInstructor] = useState(null);
  const [detailInstructor, setDetailInstructor] = useState(null);
  const [scheduleInstructor, setScheduleInstructor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // KPIs
  const kpis = useMemo(() => {
    const total = instructors.length;
    const active = instructors.filter((i) => i.status === 'Active').length;
    const totalSessions = instructors.reduce((sum, i) => sum + i.sessions_count, 0);
    const totalRevenue = instructors.reduce((sum, i) => sum + i.revenue, 0);
    const avgRating = instructors.reduce((sum, i) => sum + i.rating, 0) / total;
    const avgCompletion = instructors.reduce((sum, i) => sum + i.completion_rate, 0) / total;
    return { total, active, totalSessions, totalRevenue, avgRating, avgCompletion };
  }, [instructors]);

  // Filter + Sort
  const filtered = useMemo(() => {
    let list = [...instructors];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) =>
          `${i.first_name} ${i.last_name}`.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.phone.includes(q),
      );
    }
    if (filterType !== 'All') list = list.filter((i) => i.type === filterType);
    if (filterStatus !== 'All') list = list.filter((i) => i.status === filterStatus);
    list.sort((a, b) => {
      const va = a[sortField] ?? '';
      const vb = b[sortField] ?? '';
      return sortDir === 'asc' ? (va < vb ? -1 : 1) : va > vb ? -1 : 1;
    });
    return list;
  }, [instructors, search, filterType, filterStatus, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const handleSave = (data) => {
    const isNew = !data.id || !instructors.find((i) => i.id === data.id);
    if (isNew) {
      const newInstructor = {
        ...data,
        id: Date.now(),
        students_count: 0,
        sessions_count: 0,
        completion_rate: 0,
        rating: 0,
        revenue: 0,
        certifications: [],
        schedule: [],
      };
      setInstructors((prev) => [newInstructor, ...prev]);
      addNotification(
        'New Instructor Added',
        `${data.first_name} ${data.last_name} has been added`,
        'system',
      );
      showToast('Instructor added successfully');
    } else {
      setInstructors((prev) => prev.map((i) => (i.id === data.id ? { ...i, ...data } : i)));
      showToast('Instructor updated successfully');
    }
    setModal(null);
    setEditInstructor(null);
  };

  const handleDelete = (id) => {
    const deleted = instructors.find((i) => i.id === id);
    setInstructors((prev) => prev.filter((i) => i.id !== id));
    setDeleteTarget(null);
    setDetailInstructor(null);
    if (deleted) {
      addNotification(
        'Instructor Deleted',
        `${deleted.first_name} ${deleted.last_name} has been removed`,
        'system',
      );
    }
    showToast('Instructor deleted', 'error');
  };

  return (
    <div className="instructors-page">
      <Toast toast={toast} />

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Instructor Management</h1>
            <p>Manage your driving school instructors, schedules, and performance</p>
          </div>
          <div className="stats-badge">
            <div className="stat">
              <span className="stat-value">{kpis.active}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="divider" />
            <div className="stat">
              <span className="stat-value">{kpis.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        <KpiCard
          icon={Users}
          label="Total Instructors"
          value={kpis.total}
          change={2}
          changeType="up"
        />
        <KpiCard
          icon={UserCheck}
          label="Active Instructors"
          value={kpis.active}
          change={5}
          changeType="up"
        />
        <KpiCard
          icon={Car}
          label="Total Sessions"
          value={kpis.totalSessions}
          change={8}
          changeType="up"
        />
        <KpiCard
          icon={DollarSign}
          label="Total Revenue"
          value={kpis.totalRevenue}
          prefix="MAD "
          change={12}
          changeType="up"
        />
        <KpiCard
          icon={Star}
          label="Avg Rating"
          value={kpis.avgRating.toFixed(1)}
          suffix="/5"
          change={0.2}
          changeType="up"
        />
        <KpiCard
          icon={Target}
          label="Avg Completion"
          value={Math.round(kpis.avgCompletion)}
          suffix="%"
          change={3}
          changeType="up"
        />
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={viewMode === 'cards' ? 'active' : ''}
          onClick={() => setViewMode('cards')}
        >
          <Grid size={15} /> Card View
        </button>
        <button
          className={viewMode === 'table' ? 'active' : ''}
          onClick={() => setViewMode('table')}
        >
          <List size={15} /> Table View
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
          />
        </div>
        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          {INSTRUCTOR_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {INSTRUCTOR_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button className="btn-export" onClick={() => showToast('Excel export coming soon')}>
          <Download size={15} /> Excel
        </button>
        <button className="btn-export" onClick={() => showToast('PDF export coming soon')}>
          <FileText size={15} /> PDF
        </button>
        <button
          className="btn-add"
          onClick={() => {
            setEditInstructor(null);
            setModal('add');
          }}
        >
          <Plus size={16} /> Add Instructor
        </button>
      </div>

      {/* Content */}
      {viewMode === 'cards' ? (
        <div className="instructors-cards-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>No instructors found</p>
            </div>
          ) : (
            filtered.map((instructor) => (
              <InstructorCard
                key={instructor.id}
                instructor={instructor}
                onView={setDetailInstructor}
                onEdit={(i) => {
                  setEditInstructor(i);
                  setModal('edit');
                }}
                onDelete={setDeleteTarget}
                onSchedule={setScheduleInstructor}
              />
            ))
          )}
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h3>
              Instructors <span>{filtered.length} results</span>
            </h3>
          </div>
          <div className="instructors-table-wrapper">
            <table className="instructors-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('first_name')}>
                    Instructor{' '}
                    <SortIcon field="first_name" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('type')}>
                    Type <SortIcon field="type" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('status')}>
                    Status <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('students_count')}>
                    Students{' '}
                    <SortIcon field="students_count" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('sessions_count')}>
                    Sessions{' '}
                    <SortIcon field="sessions_count" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('completion_rate')}>
                    Completion{' '}
                    <SortIcon field="completion_rate" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('rating')}>
                    Rating <SortIcon field="rating" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('revenue')}>
                    Revenue <SortIcon field="revenue" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((instructor) => (
                  <tr key={instructor.id} onClick={() => setDetailInstructor(instructor)}>
                    <td>
                      <div className="instructor-cell">
                        <div className="instructor-avatar-sm">
                          {getInitials(instructor.first_name, instructor.last_name)}
                        </div>
                        <div>
                          <div className="instructor-name">
                            {instructor.first_name} {instructor.last_name}
                          </div>
                          <div className="instructor-email">{instructor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <TypeBadge type={instructor.type} />
                    </td>
                    <td>
                      <StatusBadge status={instructor.status} />
                    </td>
                    <td>{instructor.students_count}</td>
                    <td>{instructor.sessions_count}</td>
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
                    <td>
                      <RatingStars rating={instructor.rating} />
                    </td>
                    <td>{instructor.revenue.toLocaleString()} MAD</td>
                    <td>
                      <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="action-btn"
                          onClick={() => setDetailInstructor(instructor)}
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => {
                            setEditInstructor(instructor);
                            setModal('edit');
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => setScheduleInstructor(instructor)}
                        >
                          <CalendarIcon size={14} />
                        </button>
                        <button className="action-btn" onClick={() => setDeleteTarget(instructor)}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <div className="pagination-info">
              Showing {filtered.length} out of {instructors.length} instructors
            </div>
            <div className="pagination-controls">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <InstructorModal
          instructor={modal === 'edit' ? editInstructor : null}
          onClose={() => {
            setModal(null);
            setEditInstructor(null);
          }}
          onSave={handleSave}
        />
      )}
      {detailInstructor && (
        <InstructorDetail
          instructor={detailInstructor}
          onClose={() => setDetailInstructor(null)}
          onEdit={(i) => {
            setDetailInstructor(null);
            setEditInstructor(i);
            setModal('edit');
          }}
          onDelete={setDeleteTarget}
          onSchedule={setScheduleInstructor}
        />
      )}
      {scheduleInstructor && (
        <ScheduleModal
          instructor={scheduleInstructor}
          onClose={() => setScheduleInstructor(null)}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          instructor={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Instructors;
