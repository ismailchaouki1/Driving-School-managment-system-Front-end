import { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../Styles/System/Sessions.scss';

/* ─────────────── Mock Data ─────────────── */
const SESSION_TYPES = ['Code', 'Driving'];
const SESSION_STATUSES = ['Scheduled', 'In Progress', 'Completed', 'Cancelled', 'No Show'];
const SESSION_PRICES = {
  Code: 150,
  Driving: 200,
};

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

// Registered students
const REGISTERED_STUDENTS = [
  {
    id: 1,
    name: 'Youssef Alami',
    category: 'B',
    phone: '0612345678',
    email: 'youssef.alami@gmail.com',
    isRegistered: true,
  },
  {
    id: 2,
    name: 'Fatima Benali',
    category: 'B',
    phone: '0698765432',
    email: 'fatima.benali@gmail.com',
    isRegistered: true,
  },
  {
    id: 3,
    name: 'Karim Cherkaoui',
    category: 'C',
    phone: '0655443322',
    email: 'karim.ch@outlook.com',
    isRegistered: true,
  },
  {
    id: 4,
    name: 'Nadia Tazi',
    category: 'A',
    phone: '0611223344',
    email: 'nadia.tazi@gmail.com',
    isRegistered: true,
  },
  {
    id: 5,
    name: 'Hassan Ouazzani',
    category: 'BE',
    phone: '0677889900',
    email: 'hassan.o@gmail.com',
    isRegistered: true,
  },
];

// Walk-in students (temporary)
const WALKIN_STUDENTS = [
  {
    id: 101,
    name: 'Ahmed Mansouri',
    category: 'B',
    phone: '0612345699',
    email: '',
    isRegistered: false,
    temporaryId: 'WALK-001',
  },
  {
    id: 102,
    name: 'Sofia Benjelloun',
    category: 'B',
    phone: '0698765444',
    email: '',
    isRegistered: false,
    temporaryId: 'WALK-002',
  },
];

const ALL_STUDENTS = [...REGISTERED_STUDENTS, ...WALKIN_STUDENTS];

const MOCK_SESSIONS = [
  {
    id: 1,
    student_id: 1,
    student_name: 'Youssef Alami',
    student_category: 'B',
    student_type: 'registered',
    instructor_id: 1,
    instructor_name: 'Mohammed Benali',
    type: 'Driving',
    status: 'Scheduled',
    date: '2025-01-20',
    start_time: '09:00',
    end_time: '10:30',
    duration: 90,
    price: 200,
    payment_status: 'Paid',
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
    student_type: 'registered',
    instructor_id: 2,
    instructor_name: 'Fatima Zahra',
    type: 'Code',
    status: 'Completed',
    date: '2025-01-18',
    start_time: '14:00',
    end_time: '16:00',
    duration: 120,
    price: 150,
    payment_status: 'Paid',
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
    student_type: 'registered',
    instructor_id: 1,
    instructor_name: 'Mohammed Benali',
    type: 'Driving',
    status: 'In Progress',
    date: '2025-01-19',
    start_time: '11:00',
    end_time: '12:30',
    duration: 90,
    price: 200,
    payment_status: 'Pending',
    vehicle_id: 2,
    vehicle_plate: 'DEF-456',
    location: 'Highway Practice',
    notes: 'Highway driving practice',
    created_at: '2025-01-12T14:30:00',
  },
  {
    id: 4,
    student_id: 101,
    student_name: 'Ahmed Mansouri',
    student_category: 'B',
    student_type: 'walkin',
    instructor_id: 4,
    instructor_name: 'Nadia Ouazzani',
    type: 'Driving',
    status: 'Scheduled',
    date: '2025-01-21',
    start_time: '15:00',
    end_time: '16:30',
    duration: 90,
    price: 200,
    payment_status: 'Paid',
    vehicle_id: 4,
    vehicle_plate: 'JKL-012',
    location: 'Driving Range B',
    notes: 'First session - walk-in student',
    created_at: '2025-01-14T11:00:00',
  },
  {
    id: 5,
    student_id: 102,
    student_name: 'Sofia Benjelloun',
    student_category: 'B',
    student_type: 'walkin',
    instructor_id: 2,
    instructor_name: 'Fatima Zahra',
    type: 'Driving',
    status: 'Scheduled',
    date: '2025-01-22',
    start_time: '10:00',
    end_time: '11:30',
    duration: 90,
    price: 200,
    payment_status: 'Pending',
    vehicle_id: 1,
    vehicle_plate: 'ABC-123',
    location: 'Driving Range A',
    notes: 'Walk-in student - pay on arrival',
    created_at: '2025-01-16T08:00:00',
  },
];

const EMPTY_FORM = {
  student_id: '',
  student_name: '',
  student_category: 'B',
  student_type: 'registered',
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

// Walk-in form
const EMPTY_WALKIN_FORM = {
  student_name: '',
  student_category: 'B',
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

/* ─────────────── Helper Functions ─────────────── */
const getStudentById = (id) => ALL_STUDENTS.find((s) => s.id === id);
const getInstructorById = (id) => INSTRUCTORS.find((i) => i.id === id);
const getVehicleById = (id) => VEHICLES.find((v) => v.id === id);

const calculateEndTime = (startTime, duration) => {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;
  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;
  return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

const getPriceForSessionType = (type) => SESSION_PRICES[type] || 150;

/* ─────────────── Sub-components ─────────────── */

const StatusBadge = ({ status }) => {
  const statusLower = status.toLowerCase().replace(' ', '-');
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
        return null;
    }
  };

  return (
    <span className={`session-status-badge status-${statusLower}`}>
      {getIcon()} {status}
    </span>
  );
};

const PaymentStatusBadge = ({ status }) => {
  const statusLower = status.toLowerCase();
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
  return gradients[id % gradients.length];
};

// Card Component
const SessionCard = ({ session, onEdit, onDelete, onView, onPrint }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`session-card ${expanded ? 'expanded' : ''}`}>
      <div className="card-header-gradient" style={{ background: getRandomGradient(session.id) }}>
        <div className="session-time-large">
          <Clock size={20} />
          <span>{session.start_time}</span>
        </div>
        <div className="session-status-badge-top">
          <StatusBadge status={session.status} />
        </div>
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

      {expanded && (
        <div className="expanded-details">
          <div className="details-grid">
            <div className="detail-item">
              <label>Duration</label>
              <p>{session.duration} minutes</p>
            </div>
            <div className="detail-item">
              <label>Student Phone</label>
              <p>{getStudentById(session.student_id)?.phone || session.student_phone || 'N/A'}</p>
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

/* ─────────────── Session Modal with Walk-in Support ─────────────── */
const SessionModal = ({ session, onClose, onSave }) => {
  const isEdit = !!session?.id;
  const [studentType, setStudentType] = useState(session?.student_type || 'registered');
  const [form, setForm] = useState(isEdit ? { ...session } : { ...EMPTY_FORM });
  const [walkinForm, setWalkinForm] = useState(EMPTY_WALKIN_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleStudentTypeChange = (type) => {
    setStudentType(type);
    if (type === 'walkin') {
      set('student_id', '');
      set('student_name', walkinForm.student_name);
      set('student_category', walkinForm.student_category);
    } else {
      set('student_name', '');
      set('student_category', 'B');
    }
  };

  const handleWalkinChange = (field, value) => {
    const newWalkin = { ...walkinForm, [field]: value };
    setWalkinForm(newWalkin);
    set('student_name', newWalkin.student_name);
    set('student_category', newWalkin.student_category);
  };

  const handleRegisteredStudentSelect = (studentId) => {
    const student = REGISTERED_STUDENTS.find((s) => s.id === parseInt(studentId));
    if (student) {
      set('student_id', student.id);
      set('student_name', student.name);
      set('student_category', student.category);
    }
  };

  const handleInstructorSelect = (instructorId) => {
    const instructor = INSTRUCTORS.find((i) => i.id === parseInt(instructorId));
    if (instructor) {
      set('instructor_id', instructor.id);
      set('instructor_name', instructor.name);
    }
  };

  const handleVehicleSelect = (vehicleId) => {
    const vehicle = VEHICLES.find((v) => v.id === parseInt(vehicleId));
    if (vehicle) {
      set('vehicle_id', vehicle.id);
      set('vehicle_plate', vehicle.plate);
    }
  };

  const handleTypeChange = (type) => {
    set('type', type);
    set('price', getPriceForSessionType(type));
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
      if (!walkinForm.student_name.trim()) e.student_name = 'Student name is required';
      if (!walkinForm.student_phone.trim()) e.student_phone = 'Phone number is required';
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

    const sessionData = { ...form };

    if (studentType === 'walkin') {
      // Generate a temporary ID for walk-in student
      const tempId = Date.now();
      sessionData.student_id = tempId;
      sessionData.student_type = 'walkin';
      sessionData.student_phone = walkinForm.student_phone;
      sessionData.student_email = walkinForm.student_email;
    } else {
      sessionData.student_type = 'registered';
    }

    sessionData.price = getPriceForSessionType(sessionData.type);

    onSave({ ...sessionData, id: sessionData.id || Date.now() });
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
          {/* Student Type Selection */}
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

          {/* Student Information */}
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
                    value={form.student_id}
                    onChange={(e) => handleRegisteredStudentSelect(e.target.value)}
                    className={errors.student_id ? 'error' : ''}
                  >
                    <option value="">Select Student</option>
                    {REGISTERED_STUDENTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (Cat. {s.category}) - {s.phone}
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
                    value={walkinForm.student_name}
                    onChange={(e) => handleWalkinChange('student_name', e.target.value)}
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
                    value={walkinForm.student_phone}
                    onChange={(e) => handleWalkinChange('student_phone', e.target.value)}
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
                    value={walkinForm.student_category}
                    onChange={(e) => handleWalkinChange('student_category', e.target.value)}
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
                    value={walkinForm.student_email}
                    onChange={(e) => handleWalkinChange('student_email', e.target.value)}
                    placeholder="Email address"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Instructor & Session */}
          <div className="form-section">
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
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className={errors.type ? 'error' : ''}
                >
                  {SESSION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t} - {getPriceForSessionType(t)} MAD
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
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

          {/* Vehicle & Location */}
          <div className="form-section">
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

          {/* Payment */}
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
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
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

        <div className="modal-footer">
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

/* ─────────────── Session Detail Drawer ─────────────── */
const SessionDetail = ({ session, onClose, onEdit, onDelete, onPrint }) => {
  if (!session) return null;

  const student = getStudentById(session.student_id);
  const instructor = getInstructorById(session.instructor_id);
  const vehicle = getVehicleById(session.vehicle_id);

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
                <span className="info-value">{student?.phone || 'N/A'}</span>
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
                <span className="info-value">{instructor?.type || 'N/A'}</span>
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
                  <span className="info-value">{vehicle?.model || 'N/A'}</span>
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
const DeleteConfirm = ({ session, onConfirm, onCancel }) => (
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
        <button onClick={onConfirm} className="btn-delete">
          Delete
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
  const [sessions, setSessions] = useState(MOCK_SESSIONS);
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
      const va = a[sortField],
        vb = b[sortField];
      if (sortField === 'date' || sortField === 'start_time') {
        const compareA = sortField === 'date' ? a.date : `${a.date} ${a.start_time}`;
        const compareB = sortField === 'date' ? b.date : `${b.date} ${b.start_time}`;
        return sortDir === 'asc' ? (compareA > compareB ? 1 : -1) : compareA < compareB ? 1 : -1;
      }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return s;
  }, [sessions, search, filterType, filterStatus, filterInstructor, sortField, sortDir, dateRange]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
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

  const handleSave = (data) => {
    const isNew = !data.id || !sessions.find((s) => s.id === data.id);

    if (isNew) {
      const newSession = { ...data, id: Date.now(), created_at: new Date().toISOString() };
      setSessions((s) => [...s, newSession]);

      // Add notification for new session
      const studentName = data.student_name;
      const sessionType = data.type;
      const sessionDate = data.date;
      const sessionTime = data.start_time;

      addNotification(
        'New Session Scheduled',
        `${studentName} has scheduled a ${sessionType} session on ${sessionDate} at ${sessionTime}`,
        'session',
      );

      showToast('Session scheduled successfully');
    } else {
      setSessions((s) => s.map((x) => (x.id === data.id ? data : x)));
      showToast('Session updated successfully');
    }

    setModal(null);
    setEditSession(null);
  };

  const handleDelete = (id) => {
    const deletedSession = sessions.find((s) => s.id === id);
    setSessions((s) => s.filter((x) => x.id !== id));
    setDeleteTarget(null);
    setDetailSession(null);

    // Add notification for deleted session
    if (deletedSession) {
      addNotification(
        'Session Cancelled',
        `${deletedSession.student_name}'s ${deletedSession.type} session on ${deletedSession.date} has been cancelled`,
        'system',
      );
    }

    showToast('Session deleted', 'error');
  };

  const handlePrintReceipt = (session) => {
    showToast(`Printing receipt for ${session.student_name} - ${session.type} session`, 'success');
  };

  const total = sessions.length;
  const completed = sessions.filter((s) => s.status === 'Completed').length;
  const scheduled = sessions.filter((s) => s.status === 'Scheduled').length;
  const upcoming = sessions.filter(
    (s) => s.status === 'Scheduled' && s.date >= new Date().toISOString().split('T')[0],
  ).length;
  const totalRevenue = sessions.reduce(
    (acc, s) => acc + (s.payment_status === 'Paid' ? s.price : 0),
    0,
  );
  const walkinSessions = sessions.filter((s) => s.student_type === 'walkin').length;

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
          {INSTRUCTORS.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
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

        <button className="btn-export" onClick={() => showToast('Excel export coming soon')}>
          <Download size={15} /> Excel
        </button>

        <button className="btn-export" onClick={() => showToast('PDF export coming soon')}>
          <FileText size={15} /> PDF
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
              />
            ))
          )}
        </div>
      ) : (
        /* Table View */
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
                    Date/Time{' '}
                    <span className="sort-icon">
                      <SortIcon field="date" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('student_name')}>
                    Student{' '}
                    <span className="sort-icon">
                      <SortIcon field="student_name" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('type')}>
                    Type{' '}
                    <span className="sort-icon">
                      <SortIcon field="type" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('instructor_name')}>
                    Instructor{' '}
                    <span className="sort-icon">
                      <SortIcon field="instructor_name" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('status')}>
                    Status{' '}
                    <span className="sort-icon">
                      <SortIcon field="status" />
                    </span>
                  </th>
                  <th>Vehicle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <Calendar size={32} />
                      <div>No sessions found</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((session) => (
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
                            <div className="student-category">Cat. {session.student_category}</div>
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
                      </td>
                    </tr>
                  ))
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
        />
      )}
    </div>
  );
};

export default Sessions;
