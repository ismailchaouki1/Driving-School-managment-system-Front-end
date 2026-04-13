import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  Download,
  Printer,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  User,
  Car,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
  Grid,
  List,
  RefreshCw,
  DollarSign,
  UserPlus,
  UserCheck,
  CreditCard,
  Loader,
  Play,
  CheckCircle as ConfirmIcon,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import axios from '../../services/axios';
import '../../Styles/System/Sessions.scss';

/* ─────────────── Constants ─────────────── */
const SESSION_TYPES = ['Code', 'Driving'];
const SESSION_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'];

/* ─────────────── Helper Functions ─────────────── */
const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
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
  return gradients[(id || 0) % gradients.length];
};

/* ─────────────── Sub-components ─────────────── */

const StatusBadge = ({ status }) => {
  const statusLower = status?.toLowerCase().replace(' ', '-') || 'scheduled';
  const getIcon = () => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={12} />;
      case 'In Progress':
        return <RefreshCw size={12} />;
      case 'Scheduled':
        return <Clock size={12} />;
      case 'Cancelled':
      case 'No Show':
        return <AlertCircle size={12} />;
      default:
        return <Clock size={12} />;
    }
  };

  return (
    <span className={`session-status-badge status-${statusLower}`}>
      {getIcon()} {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const statusLower = status?.toLowerCase() || 'pending';
  return (
    <span className={`payment-status-badge payment-${statusLower}`}>
      {status === 'Paid' ? <CheckCircle size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
};

const TypeBadge = ({ type }) => {
  const getTypeClass = () => {
    switch (type) {
      case 'Driving':
        return 'type-driving';
      case 'Code':
        return 'type-code';
      default:
        return '';
    }
  };

  return <span className={`session-type-badge ${getTypeClass()}`}>{type}</span>;
};

const StudentTypeBadge = ({ type }) => {
  return (
    <span className={`student-type-badge ${type === 'registered' ? 'registered' : 'walkin'}`}>
      {type === 'registered' ? <UserCheck size={10} /> : <UserPlus size={10} />}
      {type === 'registered' ? 'Registered' : 'Walk-in'}
    </span>
  );
};

// Card Component - Updated with status control buttons
const SessionCard = ({
  session,
  onEdit,
  onDelete,
  onView,
  onPrint,
  onStartSession,
  onCompleteSession,
}) => {
  const [expanded, setExpanded] = useState(false);

  // Get time-based status for visual indication
  const getTimeStatus = () => {
    const now = new Date();
    const sessionDate = new Date(session.date);
    const [startHour, startMinute] = session.start_time.split(':');
    const [endHour, endMinute] = session.end_time.split(':');

    const sessionStart = new Date(sessionDate);
    sessionStart.setHours(parseInt(startHour), parseInt(startMinute), 0);

    const sessionEnd = new Date(sessionDate);
    sessionEnd.setHours(parseInt(endHour), parseInt(endMinute), 0);

    if (now > sessionEnd) return 'past';
    if (now >= sessionStart && now <= sessionEnd) return 'current';
    return 'upcoming';
  };

  const timeStatus = getTimeStatus();
  const canStart = session.status === 'Scheduled';
  const canComplete = session.status === 'Scheduled' || session.status === 'In Progress';
  const isCompleted = session.status === 'Completed';

  return (
    <div
      className={`session-card ${expanded ? 'expanded' : ''} ${timeStatus === 'current' ? 'current-session' : ''} ${timeStatus === 'past' ? 'past-session' : ''}`}
    >
      <div className="card-header-gradient" style={{ background: getRandomGradient(session.id) }}>
        <div className="session-time-large">
          <Clock size={20} />
          <span>{session.start_time}</span>
        </div>
        <div className="session-status-badge-top">
          <StatusBadge status={session.status} />
        </div>
        {timeStatus === 'current' && session.status === 'Scheduled' && (
          <div className="live-badge">LIVE</div>
        )}
        <button className="card-menu-btn" onClick={() => setExpanded(!expanded)}>
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="card-content">
        <div className="session-header">
          <div className="session-student">
            <div className="student-avatar-mini">{getInitials(session.student_name)}</div>
            <div>
              <h3 className="student-name">
                {session.student_name}
                <StudentTypeBadge type={session.student_type} />
              </h3>
              <p className="student-category">Cat. {session.student_category}</p>
            </div>
          </div>
          <TypeBadge type={session.type} />
        </div>

        <div className="session-info">
          <div className="info-item">
            <Calendar size={14} />
            <span>{session.date}</span>
          </div>
          <div className="info-item">
            <Clock size={14} />
            <span>
              {session.start_time} - {session.end_time}
            </span>
          </div>
          <div className="info-item">
            <User size={14} />
            <span>{session.instructor_name}</span>
          </div>
          {session.vehicle_plate && (
            <div className="info-item">
              <Car size={14} />
              <span>{session.vehicle_plate}</span>
            </div>
          )}
        </div>

        <div className="payment-info-row">
          <span className="price">Price: {session.price} MAD</span>
          <PaymentStatusBadge status={session.payment_status} />
        </div>

        {session.location && (
          <div className="session-location">
            <MapPin size={12} />
            <span>{session.location}</span>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button className="action-btn view" onClick={() => onView(session)}>
          <Eye size={14} />
          <span>View</span>
        </button>
        <button className="action-btn print" onClick={() => onPrint(session)}>
          <Printer size={14} />
          <span>Receipt</span>
        </button>
        <button className="action-btn edit" onClick={() => onEdit(session)}>
          <Pencil size={14} />
          <span>Edit</span>
        </button>
        <button className="action-btn delete" onClick={() => onDelete(session)}>
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>

      {/* Status Control Buttons */}
      {(canStart || canComplete) && !isCompleted && (
        <div className="status-controls">
          {canStart && (
            <button
              className="status-btn start-btn"
              onClick={(e) => {
                e.stopPropagation();
                onStartSession(session);
              }}
            >
              <Play size={14} />
              Start Session
            </button>
          )}
          {canComplete && (
            <button
              className="status-btn complete-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCompleteSession(session);
              }}
            >
              <ConfirmIcon size={14} />
              Mark as Completed
            </button>
          )}
        </div>
      )}

      {expanded && (
        <div className="expanded-details">
          <div className="details-grid">
            <div className="detail-item">
              <label>Duration</label>
              <p>{session.duration} minutes</p>
            </div>
            <div className="detail-item">
              <label>Student Phone</label>
              <p>{session.student_phone || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Payment Status</label>
              <p>{session.payment_status}</p>
            </div>
            <div className="detail-item full-width">
              <label>Notes</label>
              <p>{session.notes || 'No notes'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
      date: new Date().toISOString().split('T')[0],
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
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <div className="modal-title">
            <div className="title-icon">
              <Calendar size={18} color="#8cff2e" />
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

        <div className="modal-body">
          {!isEdit && (
            <div className="form-section">
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

          <div className="form-section">
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

          <div className="form-section">
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

          <div className="form-section">
            <div className="section-header">
              <Calendar size={14} />
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

          <div className="form-section">
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

          <div className="form-section">
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

          <div className="form-section">
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

        <div className="modal-footer">
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

/* ─────────────── Session Detail Drawer ─────────────── */
const SessionDetail = ({ session, onClose, onEdit, onDelete, onPrint }) => {
  if (!session) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 520 }}>
        <div className="modal-header" style={{ background: '#8cff2e', color: '#0d0d0d' }}>
          <div className="modal-title">
            <div className="title-icon" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <Calendar size={18} color="#0d0d0d" />
            </div>
            <div>
              <h2 style={{ color: '#0d0d0d' }}>{session.type} Session</h2>
              <p style={{ color: 'rgba(0,0,0,0.7)' }}>
                {session.date} at {session.start_time}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn" style={{ color: '#0d0d0d' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-section">
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

          <div className="form-section">
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
                <span className="info-value">{session.instructor_type || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
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
                  {session.start_time} - {session.end_time}
                </span>
              </div>
            </div>
          </div>

          {session.vehicle_plate && (
            <div className="form-section">
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
                  <span className="info-value">{session.vehicle_model || 'N/A'}</span>
                </div>
              </div>
            </div>
          )}

          {session.location && (
            <div className="form-section">
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
            <div className="form-section">
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

        <div className="modal-footer">
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

/* ─────────────── Delete Confirm ─────────────── */
const DeleteConfirm = ({ session, onConfirm, onCancel, isDeleting }) => (
  <div className="modal-overlay">
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
          Delete Session
        </button>
      </div>
    </div>
  </div>
);

/* ─────────────── KPI Card Component ─────────────── */
const KpiCard = ({ icon, label, value, trend, trendValue }) => (
  <div className="kpi-card">
    <div className="kpi-icon">{icon}</div>
    <div className="kpi-info">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {trend && (
        <div className={`kpi-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}%
        </div>
      )}
    </div>
  </div>
);

/* ─────────────── Main Component ─────────────── */
const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterInstructor, setFilterInstructor] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('asc');
  const [modal, setModal] = useState(null);
  const [editSession, setEditSession] = useState(null);
  const [detailSession, setDetailSession] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [sessionsRes, studentsRes, instructorsRes, vehiclesRes] = await Promise.all([
        axios.get('/sessions'),
        axios.get('/students'),
        axios.get('/instructors'),
        axios.get('/vehicles'),
      ]);

      if (sessionsRes.data.success) setSessions(sessionsRes.data.data || []);
      if (studentsRes.data.success) setStudents(studentsRes.data.data || []);
      if (instructorsRes.data.success) setInstructors(instructorsRes.data.data || []);
      if (vehiclesRes.data.success) setVehicles(vehiclesRes.data.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      showToast('Failed to load sessions', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh every minute
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Manual refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    setLastUpdated(new Date());
    showToast('Sessions refreshed successfully');
  };

  // Start session handler
  const handleStartSession = async (session) => {
    if (
      !window.confirm(`Are you sure you want to start the session for ${session.student_name}?`)
    ) {
      return;
    }

    try {
      const response = await axios.post(`/sessions/${session.id}/start`);
      if (response.data.success) {
        await fetchData();
        addNotification(
          'Session Started',
          `${session.student_name}'s ${session.type} session has started`,
          'session',
        );
        showToast('Session started successfully');
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      showToast(error.response?.data?.message || 'Failed to start session', 'error');
    }
  };

  // Complete session handler with confirmation
  const handleCompleteSession = async (session) => {
    if (
      !window.confirm(
        `Are you sure you want to mark this session as COMPLETED for ${session.student_name}?`,
      )
    ) {
      return;
    }

    try {
      const response = await axios.post(`/sessions/${session.id}/complete`);
      if (response.data.success) {
        await fetchData();
        addNotification(
          'Session Completed',
          `${session.student_name}'s ${session.type} session has been completed`,
          'session',
        );
        showToast('Session marked as completed');
      }
    } catch (error) {
      console.error('Failed to complete session:', error);
      showToast(error.response?.data?.message || 'Failed to complete session', 'error');
    }
  };

  // Filter and sort sessions
  const filtered = useMemo(() => {
    let s = [...sessions];

    if (search) {
      const q = search.toLowerCase();
      s = s.filter((x) =>
        `${x.student_name} ${x.instructor_name} ${x.location}`.toLowerCase().includes(q),
      );
    }

    if (filterType !== 'All') s = s.filter((x) => x.type === filterType);
    if (filterStatus !== 'All') s = s.filter((x) => x.status === filterStatus);
    if (filterInstructor !== 'All')
      s = s.filter((x) => x.instructor_id === parseInt(filterInstructor));

    if (dateRange.start) s = s.filter((x) => x.date >= dateRange.start);
    if (dateRange.end) s = s.filter((x) => x.date <= dateRange.end);

    s.sort((a, b) => {
      let va = a[sortField];
      let vb = b[sortField];

      if (sortField === 'date' || sortField === 'start_time') {
        const compareA = sortField === 'date' ? a.date : `${a.date} ${a.start_time}`;
        const compareB = sortField === 'date' ? b.date : `${b.date} ${b.start_time}`;
        return sortDir === 'asc' ? (compareA > compareB ? 1 : -1) : compareA < compareB ? 1 : -1;
      }

      if (typeof va === 'string') {
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });

    return s;
  }, [sessions, search, filterType, filterStatus, filterInstructor, sortField, sortDir, dateRange]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown size={13} className="sort-icon-inactive" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={13} className="sort-icon-active" />
    ) : (
      <ChevronDown size={13} className="sort-icon-active" />
    );
  };

  // Create or update session
  const handleSave = async (data) => {
    setIsSaving(true);
    const isNew = !data.id;
    console.log('Saving session data:', data);
    try {
      let response;
      if (isNew) {
        response = await axios.post('/sessions', data);
      } else {
        response = await axios.put(`/sessions/${data.id}`, data);
      }
      console.log('Server response:', response.data);
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
      console.error('Error response:', error.response?.data);
    } finally {
      setIsSaving(false);
      setModal(null);
      setEditSession(null);
    }
  };

  // Delete session
  const handleDelete = async (id) => {
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
      setDetailSession(null);
    }
  };

  // Export handlers
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'All') params.append('type', filterType);
      if (filterStatus !== 'All') params.append('status', filterStatus);
      if (filterInstructor !== 'All') params.append('instructor_id', filterInstructor);
      if (dateRange.start) params.append('start_date', dateRange.start);
      if (dateRange.end) params.append('end_date', dateRange.end);
      if (search) params.append('search', search);

      const response = await axios.get(`/sessions/export/excel?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sessions_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('Excel export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to export Excel file', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'All') params.append('type', filterType);
      if (filterStatus !== 'All') params.append('status', filterStatus);
      if (filterInstructor !== 'All') params.append('instructor_id', filterInstructor);
      if (dateRange.start) params.append('start_date', dateRange.start);
      if (dateRange.end) params.append('end_date', dateRange.end);
      if (search) params.append('search', search);

      const response = await axios.get(`/sessions/export/pdf?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sessions_${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('PDF export completed successfully');
    } catch (error) {
      console.error('Export failed:', error);
      showToast('Failed to export PDF file', 'error');
    } finally {
      setIsExporting(false);
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

  // Calculate KPIs
  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === 'Completed').length;
  const scheduled = sessions.filter((s) => s.status === 'Scheduled').length;
  const upcoming = sessions.filter(
    (s) => s.status === 'Scheduled' && s.date >= new Date().toISOString().split('T')[0],
  ).length;
  const totalRevenue = sessions.reduce(
    (acc, s) => acc + (s.payment_status === 'Paid' ? Number(s.price) : 0),
    0,
  );
  const walkinSessions = sessions.filter((s) => s.student_type === 'walkin').length;

  // Loading state
  if (loading) {
    return (
      <div className="sessions-loading">
        <div className="loading-spinner">
          <Loader size={48} className="spinner" />
          <p>Loading sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sessions-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard
          icon={<Calendar size={28} />}
          label="Total Sessions"
          value={total}
          trend="up"
          trendValue="15"
        />
        <KpiCard
          icon={<CheckCircle size={28} />}
          label="Completed"
          value={completed}
          trend="up"
          trendValue="8"
        />
        <KpiCard
          icon={<Clock size={28} />}
          label="Scheduled"
          value={scheduled}
          trend="down"
          trendValue="3"
        />
        <KpiCard icon={<Calendar size={28} />} label="Upcoming" value={upcoming} />
        <KpiCard
          icon={<DollarSign size={28} />}
          label="Total Revenue"
          value={`${totalRevenue.toLocaleString()} MAD`}
          trend="up"
          trendValue="12"
        />
        <KpiCard icon={<UserPlus size={28} />} label="Walk-in Sessions" value={walkinSessions} />
      </div>

      {/* View Toggle */}
      <div className="view-toggle">
        <button
          className={viewMode === 'cards' ? 'active' : ''}
          onClick={() => setViewMode('cards')}
        >
          <Grid size={16} /> Card View
        </button>
        <button
          className={viewMode === 'table' ? 'active' : ''}
          onClick={() => setViewMode('table')}
        >
          <List size={16} /> Table View
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student, instructor, location..."
          />
        </div>

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
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {SESSION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
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

        <input
          type="date"
          className="filter-select"
          value={dateRange.start}
          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          placeholder="Start Date"
        />
        <input
          type="date"
          className="filter-select"
          value={dateRange.end}
          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          placeholder="End Date"
        />

        <button className="refresh-btn" onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw size={16} className={isRefreshing ? 'spinning' : ''} />
          Refresh
        </button>

        <button className="btn-export" onClick={handleExportExcel} disabled={isExporting}>
          {isExporting ? <Loader size={15} className="spinner" /> : <Download size={15} />}
          Excel
        </button>

        <button className="btn-export" onClick={handleExportPdf} disabled={isExporting}>
          {isExporting ? <Loader size={15} className="spinner" /> : <FileText size={15} />}
          PDF
        </button>

        <button
          className="btn-add"
          onClick={() => {
            setEditSession(null);
            setModal('add');
          }}
        >
          <Plus size={16} /> Schedule Session
        </button>
      </div>

      {/* Last updated indicator */}
      {lastUpdated && (
        <div className="last-updated">
          <Clock size={12} />
          <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        </div>
      )}

      {/* Content - Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="sessions-cards-grid">
          {filtered.length === 0 ? (
            <div
              className="empty-state"
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}
            >
              <Calendar size={48} />
              <div>No sessions found</div>
              <p>Try adjusting your filters or schedule a new session</p>
            </div>
          ) : (
            filtered.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={(s) => {
                  setEditSession(s);
                  setModal('edit');
                }}
                onDelete={(s) => setDeleteTarget(s)}
                onPrint={handlePrintReceipt}
                onView={(s) => setDetailSession(s)}
                onStartSession={handleStartSession}
                onCompleteSession={handleCompleteSession}
              />
            ))
          )}
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h3>
              Sessions{' '}
              <span>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </h3>
          </div>

          <div className="sessions-table-wrapper">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('date')}>
                    Date/Time <SortIcon field="date" />
                  </th>
                  <th onClick={() => toggleSort('student_name')}>
                    Student <SortIcon field="student_name" />
                  </th>
                  <th onClick={() => toggleSort('type')}>
                    Type <SortIcon field="type" />
                  </th>
                  <th onClick={() => toggleSort('instructor_name')}>
                    Instructor <SortIcon field="instructor_name" />
                  </th>
                  <th onClick={() => toggleSort('status')}>
                    Status <SortIcon field="status" />
                  </th>
                  <th>Vehicle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty-state">
                      <Calendar size={32} />
                      <div>No sessions found</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((session) => {
                    const canStart = session.status === 'Scheduled';
                    const canComplete =
                      session.status === 'Scheduled' || session.status === 'In Progress';
                    const isCompleted = session.status === 'Completed';

                    return (
                      <tr key={session.id} onClick={() => setDetailSession(session)}>
                        <td className="datetime-cell">
                          <div className="date-info">{session.date}</div>
                          <div className="time-info">
                            {session.start_time} - {session.end_time}
                          </div>
                        </td>
                        <td>
                          <div className="student-info">
                            <div className="student-avatar-mini">
                              {getInitials(session.student_name)}
                            </div>
                            <div className="student-details">
                              <div className="student-name">
                                {session.student_name}
                                <StudentTypeBadge type={session.student_type} />
                              </div>
                              <div className="student-category">
                                Cat. {session.student_category}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <TypeBadge type={session.type} />
                        </td>
                        <td>{session.instructor_name}</td>
                        <td>
                          <StatusBadge status={session.status} />
                        </td>
                        <td className="vehicle-cell">{session.vehicle_plate || '-'}</td>
                        <td>
                          <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                            <button
                              className="action-btn"
                              onClick={() => setDetailSession(session)}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="action-btn"
                              onClick={() => {
                                setEditSession(session);
                                setModal('edit');
                              }}
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="action-btn"
                              onClick={() => handlePrintReceipt(session)}
                              title="Print Receipt"
                            >
                              <Printer size={14} />
                            </button>
                            <button
                              className="action-btn"
                              onClick={() => setDeleteTarget(session)}
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Status Control Buttons for Table View */}
                          {(canStart || canComplete) && !isCompleted && (
                            <div
                              className="table-status-buttons"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {canStart && (
                                <button
                                  className="table-status-btn start-btn"
                                  onClick={() => handleStartSession(session)}
                                  title="Start Session"
                                >
                                  <Play size={12} />
                                  Start
                                </button>
                              )}
                              {canComplete && (
                                <button
                                  className="table-status-btn complete-btn"
                                  onClick={() => handleCompleteSession(session)}
                                  title="Complete Session"
                                >
                                  <ConfirmIcon size={12} />
                                  Complete
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="table-footer">
            <div className="pagination-info">
              Showing {filtered.length} out of {total} sessions
            </div>
            <div className="pagination-controls">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <SessionModal
          session={modal === 'edit' ? editSession : null}
          onClose={() => {
            setModal(null);
            setEditSession(null);
          }}
          onSave={handleSave}
          isSaving={isSaving}
          students={students}
          instructors={instructors}
          vehicles={vehicles}
        />
      )}

      {detailSession && (
        <SessionDetail
          session={detailSession}
          onClose={() => setDetailSession(null)}
          onEdit={(s) => {
            setDetailSession(null);
            setEditSession(s);
            setModal('edit');
          }}
          onDelete={(s) => setDeleteTarget(s)}
          onPrint={handlePrintReceipt}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          session={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Sessions;
