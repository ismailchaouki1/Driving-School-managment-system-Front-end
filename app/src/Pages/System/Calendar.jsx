// Calendar.jsx - Updated with working week and day views
import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Car,
  MapPin,
  Plus,
  X,
  Eye,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  Printer,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
} from 'lucide-react';
import '../../Styles/System/Calendar.scss';

/* ─────────────── Mock Data (Same as Sessions) ─────────────── */
const SESSION_TYPES = ['Code', 'Driving'];
const SESSION_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'];
const INSTRUCTORS = [
  { id: 1, name: 'Mohammed Benali', avatar: null, type: 'Code & Driving' },
  { id: 2, name: 'Fatima Zahra', avatar: null, type: 'Driving' },
  { id: 3, name: 'Karim Tazi', avatar: null, type: 'Code' },
  { id: 4, name: 'Nadia Ouazzani', avatar: null, type: 'Driving' },
  { id: 5, name: 'Hassan El Fassi', avatar: null, type: 'Simulator' },
];
const VEHICLES = [
  { id: 1, plate: 'ABC-123', model: 'Peugeot 208', category: 'B', available: true },
  { id: 2, plate: 'DEF-456', model: 'Renault Clio', category: 'B', available: true },
  { id: 3, plate: 'GHI-789', model: 'Volkswagen Golf', category: 'B', available: false },
  { id: 4, plate: 'JKL-012', model: 'Ford Focus', category: 'B', available: true },
  { id: 5, plate: 'MNO-345', model: 'Dacia Logan', category: 'B', available: true },
];

const STUDENTS = [
  { id: 1, name: 'Youssef Alami', category: 'B', phone: '0612345678' },
  { id: 2, name: 'Fatima Benali', category: 'B', phone: '0698765432' },
  { id: 3, name: 'Karim Cherkaoui', category: 'C', phone: '0655443322' },
  { id: 4, name: 'Nadia Tazi', category: 'A', phone: '0611223344' },
  { id: 5, name: 'Hassan Ouazzani', category: 'BE', phone: '0677889900' },
];

const MOCK_SESSIONS = [
  {
    id: 1,
    student_id: 1,
    student_name: 'Youssef Alami',
    student_category: 'B',
    instructor_id: 1,
    instructor_name: 'Mohammed Benali',
    type: 'Driving',
    status: 'Scheduled',
    date: '2025-01-20',
    start_time: '09:00',
    end_time: '10:30',
    duration: 90,
    vehicle_id: 1,
    vehicle_plate: 'ABC-123',
    location: 'Driving Range A',
    notes: 'Focus on parallel parking',
    created_at: '2025-01-15T10:00:00',
  },
  {
    id: 2,
    student_id: 2,
    student_name: 'Fatima Benali',
    student_category: 'B',
    instructor_id: 2,
    instructor_name: 'Fatima Zahra',
    type: 'Code',
    status: 'Completed',
    date: '2025-01-18',
    start_time: '14:00',
    end_time: '16:00',
    duration: 120,
    vehicle_id: null,
    vehicle_plate: null,
    location: 'Classroom 1',
    notes: 'Code review - passed with 85%',
    created_at: '2025-01-10T09:00:00',
  },
  {
    id: 3,
    student_id: 3,
    student_name: 'Karim Cherkaoui',
    student_category: 'C',
    instructor_id: 1,
    instructor_name: 'Mohammed Benali',
    type: 'Driving',
    status: 'In Progress',
    date: '2025-01-19',
    start_time: '11:00',
    end_time: '12:30',
    duration: 90,
    vehicle_id: 2,
    vehicle_plate: 'DEF-456',
    location: 'Highway Practice',
    notes: 'Highway driving practice',
    created_at: '2025-01-12T14:30:00',
  },
  {
    id: 4,
    student_id: 4,
    student_name: 'Nadia Tazi',
    student_category: 'A',
    instructor_id: 4,
    instructor_name: 'Nadia Ouazzani',
    type: 'Simulator',
    status: 'Scheduled',
    date: '2025-01-21',
    start_time: '15:00',
    end_time: '16:30',
    duration: 90,
    vehicle_id: null,
    vehicle_plate: null,
    location: 'Simulator Room',
    notes: 'Motorcycle simulator practice',
    created_at: '2025-01-14T11:00:00',
  },
  {
    id: 5,
    student_id: 5,
    student_name: 'Hassan Ouazzani',
    student_category: 'BE',
    instructor_id: 2,
    instructor_name: 'Fatima Zahra',
    type: 'Evaluation',
    status: 'Scheduled',
    date: '2025-01-22',
    start_time: '10:00',
    end_time: '11:30',
    duration: 90,
    vehicle_id: 4,
    vehicle_plate: 'JKL-012',
    location: 'Test Track',
    notes: 'Final evaluation before exam',
    created_at: '2025-01-16T08:00:00',
  },
];

/* ─────────────── Helper Functions ─────────────── */
const getStudentById = (id) => STUDENTS.find((s) => s.id === id);
const getInstructorById = (id) => INSTRUCTORS.find((i) => i.id === id);
const getVehicleById = (id) => VEHICLES.find((v) => v.id === id);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (timeString) => {
  return timeString.slice(0, 5);
};

const getTypeColor = (type) => {
  switch (type) {
    case 'Driving':
      return '#8cff2e';
    case 'Code':
      return '#f59e0b';
    case 'Simulator':
      return '#4f46e5';
    case 'Evaluation':
      return '#db2777';
    default:
      return '#64748b';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle size={12} />;
    case 'In Progress':
      return <RefreshCw size={12} />;
    case 'Scheduled':
      return <Clock size={12} />;
    default:
      return <AlertCircle size={12} />;
  }
};

/* ─────────────── Status Badge Component ─────────────── */
const StatusBadge = ({ status }) => {
  const statusLower = status.toLowerCase().replace(' ', '-');
  return (
    <span className={`calendar-status-badge status-${statusLower}`}>
      {getStatusIcon(status)} {status}
    </span>
  );
};

/* ─────────────── Type Badge Component ─────────────── */
const TypeBadge = ({ type }) => {
  const getTypeClass = () => {
    switch (type) {
      case 'Driving':
        return 'type-driving';
      case 'Code':
        return 'type-code';
      case 'Simulator':
        return 'type-simulator';
      case 'Evaluation':
        return 'type-evaluation';
      default:
        return '';
    }
  };
  return <span className={`calendar-type-badge ${getTypeClass()}`}>{type}</span>;
};

/* ─────────────── Session Modal ─────────────── */
const SessionModal = ({ session, onClose, onSave }) => {
  const isEdit = !!session?.id;
  const [form, setForm] = useState(
    isEdit
      ? { ...session }
      : {
          student_id: '',
          student_name: '',
          student_category: '',
          instructor_id: '',
          instructor_name: '',
          type: 'Driving',
          status: 'Scheduled',
          date: new Date().toISOString().split('T')[0],
          start_time: '09:00',
          end_time: '10:30',
          duration: 90,
          vehicle_id: '',
          vehicle_plate: '',
          location: '',
          notes: '',
        },
  );
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleStudentSelect = (studentId) => {
    const student = STUDENTS.find((s) => s.id === parseInt(studentId));
    if (student) {
      set('student_id', student.id);
      set('student_name', student.name);
      set('student_category', student.category);
    } else {
      set('student_id', '');
      set('student_name', '');
      set('student_category', '');
    }
  };

  const handleInstructorSelect = (instructorId) => {
    const instructor = INSTRUCTORS.find((i) => i.id === parseInt(instructorId));
    if (instructor) {
      set('instructor_id', instructor.id);
      set('instructor_name', instructor.name);
    } else {
      set('instructor_id', '');
      set('instructor_name', '');
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    const vehicle = VEHICLES.find((v) => v.id === parseInt(vehicleId));
    if (vehicle) {
      set('vehicle_id', vehicle.id);
      set('vehicle_plate', vehicle.plate);
    } else {
      set('vehicle_id', '');
      set('vehicle_plate', '');
    }
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
  };

  const handleDurationChange = (duration) => {
    const newDuration = parseInt(duration) || 0;
    set('duration', newDuration);
    if (form.start_time && newDuration > 0) {
      set('end_time', calculateEndTime(form.start_time, newDuration));
    }
  };

  const handleStartTimeChange = (startTime) => {
    set('start_time', startTime);
    if (form.duration && startTime) {
      set('end_time', calculateEndTime(startTime, form.duration));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.student_id) e.student_id = 'Student is required';
    if (!form.instructor_id) e.instructor_id = 'Instructor is required';
    if (!form.type) e.type = 'Session type is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.start_time) e.start_time = 'Start time is required';
    if (!form.duration || form.duration < 30) e.duration = 'Duration must be at least 30 minutes';
    if (form.type === 'Driving' && !form.vehicle_id)
      e.vehicle_id = 'Vehicle is required for driving sessions';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, id: form.id || Date.now() });
  };

  return (
    <div
      className="calendar-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="calendar-modal-container">
        <div className="calendar-modal-header">
          <div className="calendar-modal-title">
            <div className="title-icon">
              <CalendarIcon size={18} color="#8cff2e" />
            </div>
            <div>
              <h2>{isEdit ? 'Edit Session' : 'New Session'}</h2>
              <p>{isEdit ? `ID: ${form.id}` : 'Schedule a new driving session'}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="calendar-modal-body">
          <div className="calendar-form-section">
            <div className="section-header">
              <User size={14} />
              <h4>Student Information</h4>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Student *</label>
                <select
                  value={form.student_id}
                  onChange={(e) => handleStudentSelect(e.target.value)}
                  className={errors.student_id ? 'error' : ''}
                >
                  <option value="">Select Student</option>
                  {STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Cat. {s.category})
                    </option>
                  ))}
                </select>
                {errors.student_id && <span className="error-message">{errors.student_id}</span>}
              </div>
            </div>
          </div>

          <div className="calendar-form-section">
            <div className="section-header">
              <User size={14} />
              <h4>Instructor & Session</h4>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Instructor *</label>
                <select
                  value={form.instructor_id}
                  onChange={(e) => handleInstructorSelect(e.target.value)}
                  className={errors.instructor_id ? 'error' : ''}
                >
                  <option value="">Select Instructor</option>
                  {INSTRUCTORS.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} ({i.type})
                    </option>
                  ))}
                </select>
                {errors.instructor_id && (
                  <span className="error-message">{errors.instructor_id}</span>
                )}
              </div>
              <div className="form-field">
                <label>Session Type *</label>
                <select
                  value={form.type}
                  onChange={(e) => set('type', e.target.value)}
                  className={errors.type ? 'error' : ''}
                >
                  {SESSION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="calendar-form-section">
            <div className="section-header">
              <CalendarIcon size={14} />
              <h4>Schedule</h4>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>
              <div className="form-field">
                <label>Start Time *</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className={errors.start_time ? 'error' : ''}
                />
                {errors.start_time && <span className="error-message">{errors.start_time}</span>}
              </div>
              <div className="form-field">
                <label>Duration (minutes) *</label>
                <input
                  type="number"
                  value={form.duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                  step="15"
                  min="30"
                  className={errors.duration ? 'error' : ''}
                />
                {errors.duration && <span className="error-message">{errors.duration}</span>}
              </div>
              <div className="form-field">
                <label>End Time</label>
                <input type="time" value={form.end_time} disabled readOnly />
              </div>
            </div>
          </div>

          <div className="calendar-form-section">
            <div className="section-header">
              <Car size={14} />
              <h4>Vehicle & Location</h4>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Vehicle</label>
                <select
                  value={form.vehicle_id}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  disabled={form.type !== 'Driving'}
                  className={errors.vehicle_id ? 'error' : ''}
                >
                  <option value="">Select Vehicle</option>
                  {VEHICLES.filter((v) => v.available || v.id === form.vehicle_id).map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate} - {v.model} (Cat. {v.category})
                    </option>
                  ))}
                </select>
                {errors.vehicle_id && <span className="error-message">{errors.vehicle_id}</span>}
              </div>
              <div className="form-field">
                <label>Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g., Driving Range A, Classroom 1"
                />
              </div>
            </div>
          </div>

          <div className="calendar-form-section">
            <div className="section-header">
              <FileText size={14} />
              <h4>Notes</h4>
            </div>
            <div className="form-field">
              <textarea
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                rows="3"
                placeholder="Additional notes about the session..."
              />
            </div>
          </div>
        </div>

        <div className="calendar-modal-footer">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-save">
            {isEdit ? 'Save Changes' : 'Schedule Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Delete Confirm Modal ─────────────── */
const DeleteConfirm = ({ session, onConfirm, onCancel }) => (
  <div className="calendar-modal-overlay">
    <div className="delete-confirm-modal">
      <div className="delete-icon">
        <Trash2 size={28} color="#ef4444" />
      </div>
      <h3>Delete Session</h3>
      <p>
        Are you sure you want to delete the session for <strong>{session?.student_name}</strong> on{' '}
        <strong>{session?.date}</strong>? This action cannot be undone.
      </p>
      <div className="delete-actions">
        <button onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
        <button onClick={onConfirm} className="btn-delete">
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────── Session Detail Modal ─────────────── */
const SessionDetail = ({ session, onClose, onEdit, onDelete, onPrint }) => {
  if (!session) return null;

  const student = getStudentById(session.student_id);
  const instructor = getInstructorById(session.instructor_id);
  const vehicle = getVehicleById(session.vehicle_id);

  return (
    <div
      className="calendar-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="calendar-modal-container" style={{ maxWidth: 520 }}>
        <div className="calendar-modal-header" style={{ background: '#8cff2e', color: '#0d0d0d' }}>
          <div className="calendar-modal-title">
            <div className="title-icon" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <CalendarIcon size={18} color="#0d0d0d" />
            </div>
            <div>
              <h2 style={{ color: '#0d0d0d' }}>{session.type} Session</h2>
              <p style={{ color: 'rgba(0,0,0,0.7)' }}>
                {formatDate(session.date)} at {formatTime(session.start_time)}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn" style={{ color: '#0d0d0d' }}>
            <X size={20} />
          </button>
        </div>

        <div className="calendar-modal-body">
          <div className="calendar-form-section">
            <div className="section-header">
              <User size={14} />
              <h4>Student Details</h4>
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{session.student_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Category</span>
                <span className="info-value">
                  <span className="category-badge">{session.student_category}</span>
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone</span>
                <span className="info-value">{student?.phone || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="calendar-form-section">
            <div className="section-header">
              <User size={14} />
              <h4>Instructor Details</h4>
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Name</span>
                <span className="info-value">{session.instructor_name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Specialization</span>
                <span className="info-value">{instructor?.type || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="calendar-form-section">
            <div className="section-header">
              <Clock size={14} />
              <h4>Session Details</h4>
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Type</span>
                <span className="info-value">
                  <TypeBadge type={session.type} />
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className="info-value">
                  <StatusBadge status={session.status} />
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Duration</span>
                <span className="info-value">{session.duration} minutes</span>
              </div>
              <div className="info-row">
                <span className="info-label">Time</span>
                <span className="info-value">
                  {formatTime(session.start_time)} - {formatTime(session.end_time)}
                </span>
              </div>
            </div>
          </div>

          {session.vehicle_plate && (
            <div className="calendar-form-section">
              <div className="section-header">
                <Car size={14} />
                <h4>Vehicle Details</h4>
              </div>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-label">Plate</span>
                  <span className="info-value">{session.vehicle_plate}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Model</span>
                  <span className="info-value">{vehicle?.model || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {session.location && (
            <div className="calendar-form-section">
              <div className="section-header">
                <MapPin size={14} />
                <h4>Location</h4>
              </div>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-value">{session.location}</span>
                </div>
              </div>
            </div>
          )}

          {session.notes && (
            <div className="calendar-form-section">
              <div className="section-header">
                <FileText size={14} />
                <h4>Notes</h4>
              </div>
              <div className="info-grid">
                <div className="info-row">
                  <span className="info-value">{session.notes}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="calendar-modal-footer">
          <button onClick={() => onPrint(session)} className="btn-save">
            <Printer size={14} /> Receipt
          </button>
          <button onClick={() => onEdit(session)} className="btn-save">
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete(session)}
            className="btn-cancel"
            style={{ color: '#ef4444', borderColor: '#ef4444' }}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Main Calendar Component ─────────────── */
const Calendar = () => {
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [filterInstructor, setFilterInstructor] = useState('All');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    // Add next month days to complete grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  };

  // Get days in week
  const getDaysInWeek = (date) => {
    const startOfWeek = new Date(date);
    const dayOfWeek = date.getDay();
    startOfWeek.setDate(date.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      days.push({ date: currentDay, isCurrentWeek: true });
    }
    return days;
  };

  // Get hours for day view (7 AM to 8 PM)
  const getHoursForDay = () => {
    const hours = [];
    for (let i = 7; i <= 20; i++) {
      hours.push(`${String(i).padStart(2, '0')}:00`);
    }
    return hours;
  };

  // Get sessions for a specific date
  const getSessionsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    let filtered = sessions.filter((s) => s.date === dateStr);

    if (filterType !== 'All') {
      filtered = filtered.filter((s) => s.type === filterType);
    }
    if (filterInstructor !== 'All') {
      filtered = filtered.filter((s) => s.instructor_id === parseInt(filterInstructor));
    }

    return filtered.sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  // Get sessions for a specific hour in day view
  const getSessionsForHour = (date, hour) => {
    const sessions = getSessionsForDate(date);
    return sessions.filter((s) => s.start_time.startsWith(hour));
  };

  const handlePrev = () => {
    if (viewType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (viewType === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(newDate);
    }
  };

  const handleNext = () => {
    if (viewType === 'month') {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (viewType === 'week') {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 7);
      setCurrentDate(newDate);
    } else {
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(newDate);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleSaveSession = (data) => {
    if (data.id && sessions.find((s) => s.id === data.id)) {
      setSessions((s) => s.map((x) => (x.id === data.id ? data : x)));
      showToast('Session updated successfully');
    } else {
      setSessions((s) => [...s, { ...data, id: Date.now(), created_at: new Date().toISOString() }]);
      showToast('Session scheduled successfully');
    }
    setShowModal(false);
    setEditSession(null);
  };

  const handleDeleteSession = (id) => {
    setSessions((s) => s.filter((x) => x.id !== id));
    setDeleteTarget(null);
    setSelectedSession(null);
    showToast('Session deleted', 'error');
  };

  const handlePrintReceipt = (session) => {
    showToast(`Printing receipt for ${session.student_name} - ${session.type} session`, 'success');
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  const isToday = (date) => {
    return date.toDateString() === today.toDateString();
  };

  const getHeaderTitle = () => {
    if (viewType === 'month') {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else if (viewType === 'week') {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return `${monthNames[startOfWeek.getMonth()]} ${startOfWeek.getDate()} - ${monthNames[endOfWeek.getMonth()]} ${endOfWeek.getDate()}, ${currentDate.getFullYear()}`;
    } else {
      return `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    }
  };

  // Render Month View
  const renderMonthView = () => {
    const days = getDaysInMonth(currentDate);
    return (
      <>
        <div className="calendar-weekdays">
          {weekDays.map((day) => (
            <div key={day} className="weekday-cell">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days.map((day, index) => {
            const daySessions = getSessionsForDate(day.date);
            const isSelected =
              selectedDate && day.date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.date) ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="day-number">{day.date.getDate()}</div>
                <div className="day-sessions">
                  {daySessions.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      className="session-preview"
                      style={{ borderLeftColor: getTypeColor(session.type) }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSession(session);
                      }}
                    >
                      <span className="session-time">{formatTime(session.start_time)}</span>
                      <span className="session-student">{session.student_name}</span>
                    </div>
                  ))}
                  {daySessions.length > 3 && (
                    <div className="more-sessions">+{daySessions.length - 3} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  };

  // Render Week View
  const renderWeekView = () => {
    const days = getDaysInWeek(currentDate);
    return (
      <div className="week-view">
        <div className="week-header">
          {days.map((day, index) => (
            <div
              key={index}
              className={`week-day-header ${isToday(day.date) ? 'today' : ''}`}
              onClick={() => handleDateClick(day.date)}
            >
              <div className="week-day-name">{weekDays[day.date.getDay()]}</div>
              <div className="week-day-number">{day.date.getDate()}</div>
              <div className="week-day-month">{monthNames[day.date.getMonth()].slice(0, 3)}</div>
            </div>
          ))}
        </div>
        <div className="week-grid">
          {days.map((day, dayIndex) => {
            const daySessions = getSessionsForDate(day.date);
            return (
              <div key={dayIndex} className="week-day-column">
                {daySessions.map((session) => (
                  <div
                    key={session.id}
                    className="week-session-card"
                    style={{
                      backgroundColor: `${getTypeColor(session.type)}15`,
                      borderLeftColor: getTypeColor(session.type),
                    }}
                    onClick={() => setSelectedSession(session)}
                  >
                    <div className="session-time">
                      {formatTime(session.start_time)} - {formatTime(session.end_time)}
                    </div>
                    <div className="session-student">{session.student_name}</div>
                    <div className="session-instructor">{session.instructor_name}</div>
                  </div>
                ))}
                {daySessions.length === 0 && (
                  <div className="week-empty-slot" onClick={() => handleDateClick(day.date)}>
                    No sessions
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render Day View
  const renderDayView = () => {
    const hours = getHoursForDay();

    return (
      <div className="day-view">
        <div className="day-header">
          <div className="day-header-content">
            <div className="day-date">{weekDays[currentDate.getDay()]}</div>
            <div className="day-number">{currentDate.getDate()}</div>
            <div className="day-month">{monthNames[currentDate.getMonth()]}</div>
            <div className="day-year">{currentDate.getFullYear()}</div>
          </div>
        </div>
        <div className="day-timeline">
          {hours.map((hour) => {
            const sessionsAtHour = getSessionsForHour(currentDate, hour);
            return (
              <div key={hour} className="timeline-hour">
                <div className="hour-label">{hour}</div>
                <div className="hour-sessions">
                  {sessionsAtHour.map((session) => (
                    <div
                      key={session.id}
                      className="day-session-card"
                      style={{
                        backgroundColor: `${getTypeColor(session.type)}15`,
                        borderLeftColor: getTypeColor(session.type),
                      }}
                      onClick={() => setSelectedSession(session)}
                    >
                      <div className="session-time">
                        {formatTime(session.start_time)} - {formatTime(session.end_time)}
                      </div>
                      <div className="session-student">{session.student_name}</div>
                      <div className="session-type">{session.type}</div>
                      <div className="session-instructor">{session.instructor_name}</div>
                    </div>
                  ))}
                  {sessionsAtHour.length === 0 && (
                    <div className="empty-hour-slot" onClick={() => handleDateClick(currentDate)}>
                      <Plus size={14} /> Schedule session
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`calendar-toast-notification toast-${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-title-section">
          <h1>Session Calendar</h1>
          <p>Manage and track all driving sessions</p>
        </div>
        <div className="calendar-actions">
          <div className="filter-group">
            <select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <select
              className="filter-select"
              value={filterInstructor}
              onChange={(e) => setFilterInstructor(e.target.value)}
            >
              <option value="All">All Instructors</option>
              {INSTRUCTORS.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="add-session-btn"
            onClick={() => {
              setEditSession(null);
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            New Session
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="calendar-navigation">
        <div className="nav-buttons">
          <button onClick={handlePrev} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <h2>{getHeaderTitle()}</h2>
          <button onClick={handleNext} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="view-buttons">
          <button
            className={`view-btn ${viewType === 'month' ? 'active' : ''}`}
            onClick={() => setViewType('month')}
          >
            Month
          </button>
          <button
            className={`view-btn ${viewType === 'week' ? 'active' : ''}`}
            onClick={() => setViewType('week')}
          >
            Week
          </button>
          <button
            className={`view-btn ${viewType === 'day' ? 'active' : ''}`}
            onClick={() => setViewType('day')}
          >
            Day
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      {viewType === 'month' && renderMonthView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'day' && renderDayView()}

      {/* New Session Modal */}
      {showModal && (
        <SessionModal
          session={editSession}
          onClose={() => {
            setShowModal(false);
            setEditSession(null);
            setSelectedDate(null);
          }}
          onSave={handleSaveSession}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetail
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onEdit={(s) => {
            setSelectedSession(null);
            setEditSession(s);
            setShowModal(true);
          }}
          onDelete={(s) => setDeleteTarget(s)}
          onPrint={handlePrintReceipt}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <DeleteConfirm
          session={deleteTarget}
          onConfirm={() => handleDeleteSession(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Calendar;
