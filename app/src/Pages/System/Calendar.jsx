// Calendar.jsx - Fixed version with proper API integration
import { useState, useEffect, useCallback } from 'react';
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
  Loader,
  UserCheck,
  UserPlus,
  CreditCard,
  EyeOff,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import axios from '../../services/axios';
import '../../Styles/System/Calendar.scss';

/* ─────────────── Constants ─────────────── */
const SESSION_TYPES = ['Code', 'Driving'];
const SESSION_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

/* ─────────────── Helper Functions ─────────────── */
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (timeString) => {
  if (!timeString) return '';
  // Handle both HH:MM:SS and HH:MM formats
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

const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

// Function to get local date string without timezone offset
const getLocalDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/* ─────────────── Status Badge Component ─────────────── */
const StatusBadge = ({ status }) => {
  const statusLower = status?.toLowerCase().replace(' ', '-') || 'scheduled';
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
const SessionModal = ({ session, onClose, onSave, isSaving, students, instructors, vehicles }) => {
  const isEdit = !!session?.id;
  const [studentType, setStudentType] = useState(session?.student_type || 'registered');
  const [form, setForm] = useState(() => {
    if (isEdit) {
      return { ...session };
    }
    return {
      student_id: '',
      student_name: '',
      student_category: 'B',
      student_type: 'registered',
      student_phone: '',
      student_email: '',
      instructor_id: '',
      instructor_name: '',
      type: 'Driving',
      status: 'Scheduled',
      date: getLocalDateString(new Date()),
      start_time: '09:00',
      end_time: '10:30',
      duration: 90,
      price: 200,
      payment_status: 'Pending',
      vehicle_id: '',
      vehicle_plate: '',
      location: '',
      notes: '',
    };
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleStudentTypeChange = (type) => {
    setStudentType(type);
    if (type === 'walkin') {
      set('student_id', null);
      set('student_name', '');
      set('student_category', 'B');
      set('student_phone', '');
      set('student_email', '');
      set('payment_status', 'Paid');
    } else {
      set('student_id', '');
      set('student_name', '');
      set('student_category', 'B');
      set('student_phone', '');
      set('student_email', '');
      set('payment_status', 'Pending');
    }
  };

  const handleRegisteredStudentSelect = (studentId) => {
    const student = students?.find((s) => s.id === parseInt(studentId));
    if (student) {
      set('student_id', student.id);
      set('student_name', `${student.first_name} ${student.last_name}`);
      set('student_category', student.type);
      set('student_phone', student.phone);
      set('student_email', student.email);
    }
  };

  const handleInstructorSelect = (instructorId) => {
    const instructor = instructors?.find((i) => i.id === parseInt(instructorId));
    if (instructor) {
      set('instructor_id', instructor.id);
      set('instructor_name', `${instructor.first_name} ${instructor.last_name}`);
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    const vehicle = vehicles?.find((v) => v.id === parseInt(vehicleId));
    if (vehicle) {
      set('vehicle_id', vehicle.id);
      set('vehicle_plate', vehicle.plate);
    } else {
      set('vehicle_id', null);
      set('vehicle_plate', null);
    }
  };

  const handleTypeChange = (type) => {
    set('type', type);
    const price = type === 'Driving' ? 200 : 150;
    set('price', price);
    if (type !== 'Driving') {
      set('vehicle_id', null);
      set('vehicle_plate', null);
    }
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

    if (studentType === 'registered') {
      if (!form.student_id) e.student_id = 'Student is required';
    } else {
      if (!form.student_name?.trim()) e.student_name = 'Student name is required';
      if (!form.student_phone?.trim()) e.student_phone = 'Phone number is required';
    }

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

    const sessionData = {
      student_id: studentType === 'registered' ? form.student_id : null,
      student_name: form.student_name,
      student_category: form.student_category,
      student_type: studentType,
      student_phone: studentType === 'walkin' ? form.student_phone : form.student_phone || null,
      student_email: studentType === 'walkin' ? form.student_email : form.student_email || null,
      instructor_id: form.instructor_id,
      instructor_name: form.instructor_name,
      type: form.type,
      status: form.status,
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time,
      duration: form.duration,
      price: form.type === 'Driving' ? 200 : 150,
      payment_status: form.payment_status,
      vehicle_id: form.type === 'Driving' ? form.vehicle_id || null : null,
      vehicle_plate: form.type === 'Driving' ? form.vehicle_plate || null : null,
      location: form.location || null,
      notes: form.notes || null,
    };

    if (isEdit) {
      sessionData.id = form.id;
    }

    onSave(sessionData);
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
          {!isEdit && (
            <div className="calendar-form-section">
              <div className="section-header">
                <User size={14} />
                <h4>Student Type</h4>
              </div>
              <div className="student-type-selector">
                <button
                  type="button"
                  className={`type-btn ${studentType === 'registered' ? 'active' : ''}`}
                  onClick={() => handleStudentTypeChange('registered')}
                >
                  <UserCheck size={16} />
                  Registered Student
                </button>
                <button
                  type="button"
                  className={`type-btn ${studentType === 'walkin' ? 'active' : ''}`}
                  onClick={() => handleStudentTypeChange('walkin')}
                >
                  <UserPlus size={16} />
                  Walk-in Student
                </button>
              </div>
            </div>
          )}

          <div className="calendar-form-section">
            <div className="section-header">
              <User size={14} />
              <h4>
                {studentType === 'registered' ? 'Student Information' : 'Walk-in Student Details'}
              </h4>
            </div>

            {studentType === 'registered' ? (
              <div className="form-row">
                <div className="form-field">
                  <label>Select Student *</label>
                  <select
                    value={form.student_id || ''}
                    onChange={(e) => handleRegisteredStudentSelect(e.target.value)}
                    className={errors.student_id ? 'error' : ''}
                  >
                    <option value="">Select Student</option>
                    {students?.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.first_name} {s.last_name} (Cat. {s.type}) - {s.phone}
                      </option>
                    ))}
                  </select>
                  {errors.student_id && <span className="error-message">{errors.student_id}</span>}
                </div>
              </div>
            ) : (
              <div className="form-row">
                <div className="form-field">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={form.student_name || ''}
                    onChange={(e) => set('student_name', e.target.value)}
                    placeholder="Enter student's full name"
                    className={errors.student_name ? 'error' : ''}
                  />
                  {errors.student_name && (
                    <span className="error-message">{errors.student_name}</span>
                  )}
                </div>
                <div className="form-field">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    value={form.student_phone || ''}
                    onChange={(e) => set('student_phone', e.target.value)}
                    placeholder="Phone number"
                    className={errors.student_phone ? 'error' : ''}
                  />
                  {errors.student_phone && (
                    <span className="error-message">{errors.student_phone}</span>
                  )}
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <select
                    value={form.student_category || 'B'}
                    onChange={(e) => set('student_category', e.target.value)}
                  >
                    <option value="B">B</option>
                    <option value="A">A</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Email (Optional)</label>
                  <input
                    type="email"
                    value={form.student_email || ''}
                    onChange={(e) => set('student_email', e.target.value)}
                    placeholder="Email address"
                  />
                </div>
              </div>
            )}
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
                  value={form.instructor_id || ''}
                  onChange={(e) => handleInstructorSelect(e.target.value)}
                  className={errors.instructor_id ? 'error' : ''}
                >
                  <option value="">Select Instructor</option>
                  {instructors?.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.first_name} {i.last_name} ({i.type})
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
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className={errors.type ? 'error' : ''}
                >
                  <option value="Driving">Driving - 200 MAD</option>
                  <option value="Code">Code - 150 MAD</option>
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
                  value={form.vehicle_id || ''}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  disabled={form.type !== 'Driving'}
                  className={errors.vehicle_id ? 'error' : ''}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles
                    ?.filter((v) => v.status === 'Active' || v.id === form.vehicle_id)
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.plate} - {v.brand} {v.model} (Cat. {v.category})
                      </option>
                    ))}
                </select>
                {errors.vehicle_id && <span className="error-message">{errors.vehicle_id}</span>}
              </div>
              <div className="form-field">
                <label>Location</label>
                <input
                  type="text"
                  value={form.location || ''}
                  onChange={(e) => set('location', e.target.value)}
                  placeholder="e.g., Driving Range A, Classroom 1"
                />
              </div>
            </div>
          </div>

          <div className="calendar-form-section">
            <div className="section-header">
              <CreditCard size={14} />
              <h4>Payment</h4>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Price (MAD)</label>
                <input type="number" value={form.price} disabled readOnly />
              </div>
              <div className="form-field">
                <label>Payment Status</label>
                <select
                  value={form.payment_status}
                  onChange={(e) => set('payment_status', e.target.value)}
                >
                  <option value="Paid">Paid (Creates payment record)</option>
                  <option value="Pending">Pending (No payment record)</option>
                </select>
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
                value={form.notes || ''}
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
          <button onClick={handleSave} className="btn-save" disabled={isSaving}>
            {isSaving ? <Loader size={16} className="spinner" /> : null}
            {isEdit ? 'Save Changes' : 'Schedule Session'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Delete Confirm Modal ─────────────── */
const DeleteConfirm = ({ session, onConfirm, onCancel, isDeleting }) => (
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
        <button onClick={onConfirm} className="btn-delete" disabled={isDeleting}>
          {isDeleting ? <Loader size={16} className="spinner" /> : null}
          Delete
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────── Session Detail Modal ─────────────── */
const SessionDetail = ({ session, onClose, onEdit, onDelete, onPrint }) => {
  if (!session) return null;

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
                <span className="info-value">{session.student_phone || 'N/A'}</span>
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
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState('month');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [filterInstructor, setFilterInstructor] = useState('All');
  const [showCompleted, setShowCompleted] = useState(false);
  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // FIXED: Fetch data with proper session formatting
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [sessionsRes, studentsRes, instructorsRes, vehiclesRes] = await Promise.all([
        axios.get('/sessions'),
        axios.get('/students'),
        axios.get('/instructors'),
        axios.get('/vehicles'),
      ]);

      console.log('Raw sessions response:', sessionsRes.data);

      // Process sessions to ensure consistent format
      let sessionsData = [];
      if (sessionsRes.data.success && Array.isArray(sessionsRes.data.data)) {
        sessionsData = sessionsRes.data.data.map((session) => ({
          ...session,
          // Ensure dates are in YYYY-MM-DD format
          date: session.date ? new Date(session.date).toISOString().split('T')[0] : null,
          // Ensure times are in HH:MM format
          start_time: session.start_time ? formatTime(session.start_time) : '09:00',
          end_time: session.end_time ? formatTime(session.end_time) : '10:30',
          // Convert numeric fields
          duration: Number(session.duration) || 90,
          price: Number(session.price) || 200,
          // Ensure IDs are numbers
          instructor_id: session.instructor_id ? Number(session.instructor_id) : null,
          student_id: session.student_id ? Number(session.student_id) : null,
          vehicle_id: session.vehicle_id ? Number(session.vehicle_id) : null,
        }));
      }

      console.log('Processed sessions:', sessionsData);

      if (sessionsRes.data.success) {
        setSessions(sessionsData);
      } else {
        setSessions([]);
      }

      if (studentsRes.data.success) {
        setStudents(studentsRes.data.data || []);
      }

      if (instructorsRes.data.success) {
        setInstructors(instructorsRes.data.data || []);
      }

      if (vehiclesRes.data.success) {
        setVehicles(vehiclesRes.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast('Failed to load calendar data', 'error');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }
    return days;
  };

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

  const getHoursForDay = () => {
    const hours = [];
    for (let i = 7; i <= 20; i++) {
      hours.push(`${String(i).padStart(2, '0')}:00`);
    }
    return hours;
  };

  const getSessionsForDate = (date) => {
    const dateStr = getLocalDateString(date);
    let filtered = sessions.filter((s) => s.date === dateStr);

    if (filterType !== 'All') {
      filtered = filtered.filter((s) => s.type === filterType);
    }
    if (filterInstructor !== 'All') {
      filtered = filtered.filter((s) => s.instructor_id === parseInt(filterInstructor));
    }
    if (!showCompleted) {
      filtered = filtered.filter((s) => s.status !== 'Completed');
    }

    return filtered.sort((a, b) => a.start_time.localeCompare(b.start_time));
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    showToast('Calendar refreshed successfully');
  };

  const handleSaveSession = async (data) => {
    setIsSaving(true);
    const isNew = !data.id;

    try {
      let response;
      if (isNew) {
        response = await axios.post('/sessions', data);
      } else {
        response = await axios.put(`/sessions/${data.id}`, data);
      }

      if (response.data.success) {
        await fetchData();

        if (isNew) {
          addNotification(
            'New Session Scheduled',
            `${data.student_name} has scheduled a ${data.type} session on ${data.date} at ${data.start_time}`,
            'session',
          );
          showToast('Session scheduled successfully');
        } else {
          showToast('Session updated successfully');
        }
      }
    } catch (error) {
      console.error('Failed to save session:', error);
      showToast(error.response?.data?.message || 'Failed to save session', 'error');
    } finally {
      setIsSaving(false);
      setShowModal(false);
      setEditSession(null);
      setSelectedDate(null);
    }
  };

  const handleDeleteSession = async (id) => {
    setIsDeleting(true);

    try {
      const response = await axios.delete(`/sessions/${id}`);

      if (response.data.success) {
        const deletedSession = sessions.find((s) => s.id === id);
        await fetchData();

        if (deletedSession) {
          addNotification(
            'Session Cancelled',
            `${deletedSession.student_name}'s ${deletedSession.type} session on ${deletedSession.date} has been cancelled`,
            'system',
          );
        }

        showToast('Session deleted successfully', 'error');
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      showToast(error.response?.data?.message || 'Failed to delete session', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      setSelectedSession(null);
    }
  };

  const handlePrintReceipt = async (session) => {
    try {
      const response = await axios.get(`/sessions/${session.id}/receipt`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);

      showToast(`Receipt for ${session.student_name} - ${session.type} session is ready`);
    } catch (error) {
      console.error('Print failed:', error);
      showToast('Failed to generate receipt', 'error');
    }
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
            const isSelectedDate =
              selectedDate && day.date.toDateString() === selectedDate.toDateString();

            return (
              <div
                key={index}
                className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.date) ? 'today' : ''} ${isSelectedDate ? 'selected' : ''}`}
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
          {days.map((day, index) => {
            const isSelectedDate =
              selectedDate && day.date.toDateString() === selectedDate.toDateString();
            return (
              <div
                key={index}
                className={`week-day-header ${isToday(day.date) ? 'today' : ''} ${isSelectedDate ? 'selected' : ''}`}
                onClick={() => handleDateClick(day.date)}
              >
                <div className="week-day-name">{weekDays[day.date.getDay()]}</div>
                <div className="week-day-number">{day.date.getDate()}</div>
                <div className="week-day-month">{monthNames[day.date.getMonth()].slice(0, 3)}</div>
              </div>
            );
          })}
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
    const isSelectedDate =
      selectedDate && currentDate.toDateString() === selectedDate.toDateString();

    return (
      <div className="day-view">
        <div className="day-header">
          <div className={`day-header-content ${isSelectedDate ? 'selected' : ''}`}>
            <div className="day-date">{weekDays[currentDate.getDay()]}</div>
            <div className="day-number">{currentDate.getDate()}</div>
            <div className="day-month">{monthNames[currentDate.getMonth()]}</div>
            <div className="day-year">{currentDate.getFullYear()}</div>
          </div>
        </div>
        <div className="day-timeline">
          {hours.map((hour) => {
            const sessionsAtHour = getSessionsForDate(currentDate).filter((s) =>
              s.start_time.startsWith(hour),
            );
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

  // Loading state
  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="loading-spinner">
          <Loader size={48} className="spinner" />
          <p>Loading calendar...</p>
        </div>
      </div>
    );
  }

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
          <button className="refresh-btn" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw size={18} className={isRefreshing ? 'spinning' : ''} />
            Refresh
          </button>

          <button
            className={`show-completed-btn ${showCompleted ? 'active' : ''}`}
            onClick={() => setShowCompleted(!showCompleted)}
            title={showCompleted ? 'Hide completed sessions' : 'Show completed sessions'}
          >
            {showCompleted ? (
              <>
                <EyeOff size={16} />
                Hide Completed
              </>
            ) : (
              <>
                <Eye size={16} />
                Show Completed
              </>
            )}
          </button>

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
              {instructors.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.first_name} {i.last_name}
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

      {/* Modals */}
      {showModal && (
        <SessionModal
          session={editSession}
          onClose={() => {
            setShowModal(false);
            setEditSession(null);
            setSelectedDate(null);
          }}
          onSave={handleSaveSession}
          isSaving={isSaving}
          students={students}
          instructors={instructors}
          vehicles={vehicles}
        />
      )}

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

      {deleteTarget && (
        <DeleteConfirm
          session={deleteTarget}
          onConfirm={() => handleDeleteSession(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Calendar;
