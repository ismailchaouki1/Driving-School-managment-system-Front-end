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
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Car,
  ThumbsUp,
  ThumbsDown,
  Users,
  DollarSign,
  Grid,
  List,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../Styles/System/Students.scss';

/* ─────────────── Mock Data ─────────────── */
const CATEGORIES = ['B', 'A', 'A1', 'C', 'D', 'BE'];
const PAYMENT_STATUSES = ['Complete', 'Partial', 'Pending'];

const MOCK_STUDENTS = [
  {
    id_client: 1,
    last_name: 'Alami',
    first_name: 'Youssef',
    cin: 'AB123456',
    age: 22,
    email: 'youssef.alami@gmail.com',
    phone: '0612345678',
    address: 'Ibn Battuta Street, Marrakech',
    type: 'B',
    initial_payment: 3000,
    total_price: 6000,
    payment_status: 'Partial',
    registration_date: '2024-11-10',
    photo: null,
    parent_name: 'Mohammed Alami',
    emergency_contact: '0612345679',
    enrollment_date: '2024-11-10',
  },
  {
    id_client: 2,
    last_name: 'Benali',
    first_name: 'Fatima',
    cin: 'CD789012',
    age: 19,
    email: 'fatima.benali@gmail.com',
    phone: '0698765432',
    address: 'Mohammed V Ave, Casablanca',
    type: 'B',
    initial_payment: 6000,
    total_price: 6000,
    payment_status: 'Complete',
    registration_date: '2024-10-05',
    photo: null,
    parent_name: 'Ahmed Benali',
    emergency_contact: '0698765433',
    enrollment_date: '2024-10-05',
  },
  {
    id_client: 3,
    last_name: 'Cherkaoui',
    first_name: 'Karim',
    cin: 'EF345678',
    age: 35,
    email: 'karim.ch@outlook.com',
    phone: '0655443322',
    address: 'Gueliz District, Marrakech',
    type: 'C',
    initial_payment: 0,
    total_price: 9000,
    payment_status: 'Pending',
    registration_date: '2025-01-18',
    photo: null,
    parent_name: 'N/A',
    emergency_contact: '0655443323',
    enrollment_date: '2025-01-18',
  },
  {
    id_client: 4,
    last_name: 'Tazi',
    first_name: 'Nadia',
    cin: 'GH901234',
    age: 27,
    email: 'nadia.tazi@gmail.com',
    phone: '0611223344',
    address: 'Medina, Fez',
    type: 'A',
    initial_payment: 4500,
    total_price: 4500,
    payment_status: 'Complete',
    registration_date: '2024-12-22',
    photo: null,
    parent_name: 'Omar Tazi',
    emergency_contact: '0611223345',
    enrollment_date: '2024-12-22',
  },
  {
    id_client: 5,
    last_name: 'Ouazzani',
    first_name: 'Hassan',
    cin: 'IJ567890',
    age: 31,
    email: 'hassan.o@gmail.com',
    phone: '0677889900',
    address: 'Hivernage, Marrakech',
    type: 'BE',
    initial_payment: 2000,
    total_price: 7500,
    payment_status: 'Partial',
    registration_date: '2025-02-03',
    photo: null,
    parent_name: 'Fatima Ouazzani',
    emergency_contact: '0677889901',
    enrollment_date: '2025-02-03',
  },
];

const EMPTY_FORM = {
  last_name: '',
  first_name: '',
  cin: '',
  age: '',
  email: '',
  phone: '',
  address: '',
  type: 'B',
  initial_payment: '',
  total_price: '',
  payment_status: 'Pending',
  registration_date: new Date().toISOString().split('T')[0],
  parent_name: '',
  emergency_contact: '',
};

/* ─────────────── Sub-components ─────────────── */

const StatusBadge = ({ status }) => {
  const statusLower = status.toLowerCase();
  const Icon = status === 'Complete' ? CheckCircle : status === 'Partial' ? Clock : AlertCircle;

  return (
    <span className={`status-badge status-${statusLower}`}>
      <Icon size={12} /> {status}
    </span>
  );
};

const Avatar = ({ last_name, first_name }) => {
  const initials = `${first_name?.[0] || ''}${last_name?.[0] || ''}`.toUpperCase();
  return <div className="student-avatar">{initials}</div>;
};

const getInitials = (name) => {
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
const StudentCard = ({ student, onEdit, onDelete, onPrint, onView }) => {
  const [expanded, setExpanded] = useState(false);
  const paid = Number(student.initial_payment);
  const total = Number(student.total_price) || 1;
  const pct = Math.min(100, Math.round((paid / total) * 100));

  return (
    <div className={`student-card ${expanded ? 'expanded' : ''}`}>
      <div
        className="card-header-gradient"
        style={{ background: getRandomGradient(student.id_client) }}
      >
        <div className="student-avatar-large">
          {student.photo ? (
            <img src={student.photo} alt={student.first_name} />
          ) : (
            <span>{getInitials(`${student.first_name} ${student.last_name}`)}</span>
          )}
        </div>
        <div className="student-status-badge">
          <span
            className={`status ${student.payment_status === 'Complete' ? 'active' : student.payment_status === 'Partial' ? 'pending' : 'inactive'}`}
          >
            {student.payment_status}
          </span>
        </div>
        <button className="card-menu-btn" onClick={() => setExpanded(!expanded)}>
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="card-content">
        <h3 className="student-name">
          {student.first_name} {student.last_name}
        </h3>
        <p className="student-class">
          <Car size={14} />
          Category {student.type}
        </p>

        <div className="contact-info">
          <div className="info-item">
            <Mail className="info-icon" size={14} />
            <span>{student.email}</span>
          </div>
          <div className="info-item">
            <Phone className="info-icon" size={14} />
            <span>{student.phone}</span>
          </div>
          <div className="info-item">
            <CreditCard className="info-icon" size={14} />
            <span>CIN: {student.cin}</span>
          </div>
        </div>

        <div className="payment-progress">
          <div className="progress-header">
            <span>Payment Progress</span>
            <span className="progress-percent">{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="payment-amounts">
            <span>Paid: {paid.toLocaleString()} MAD</span>
            <span>Total: {total.toLocaleString()} MAD</span>
          </div>
        </div>

        <div className="registration-date">
          <Calendar size={12} />
          <span>Registered: {student.registration_date}</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="action-btn edit" onClick={() => onView(student)}>
          <Eye size={14} />
          <span>View</span>
        </button>
        <button className="action-btn print" onClick={() => onPrint(student)}>
          <Printer size={14} />
          <span>Receipt</span>
        </button>
        <button className="action-btn edit" onClick={() => onEdit(student)}>
          <Pencil size={14} />
          <span>Edit</span>
        </button>
        <button className="action-btn delete" onClick={() => onDelete(student)}>
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>

      {expanded && (
        <div className="expanded-details">
          <div className="details-grid">
            <div className="detail-item">
              <label>Parent Name</label>
              <p>{student.parent_name || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Address</label>
              <p>{student.address || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Emergency Contact</label>
              <p>{student.emergency_contact || 'N/A'}</p>
            </div>
            <div className="detail-item">
              <label>Age</label>
              <p>{student.age} years</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────── Modal ─────────────── */
const StudentModal = ({ student, onClose, onSave }) => {
  const isEdit = !!student?.id_client;
  const [form, setForm] = useState(isEdit ? { ...student } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.last_name.trim()) e.last_name = 'Required';
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.cin.trim()) e.cin = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.age || form.age < 16) e.age = 'Age ≥ 16';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ ...form, id_client: form.id_client || Date.now() });
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <div className="title-icon">
              <User size={18} color="#8cff2e" />
            </div>
            <div>
              <h2>{isEdit ? 'Edit Student' : 'New Student'}</h2>
              <p>{isEdit ? `ID: ${form.id_client}` : 'Fill in the information'}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-section">
            <div className="section-header">
              <User size={14} />
              <h4>Personal Information</h4>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>First Name</label>
                <input
                  type="text"
                  value={form.first_name}
                  onChange={(e) => set('first_name', e.target.value)}
                  className={errors.first_name ? 'error' : ''}
                />
                {errors.first_name && <span className="error-message">{errors.first_name}</span>}
              </div>
              <div className="form-field">
                <label>Last Name</label>
                <input
                  type="text"
                  value={form.last_name}
                  onChange={(e) => set('last_name', e.target.value)}
                  className={errors.last_name ? 'error' : ''}
                />
                {errors.last_name && <span className="error-message">{errors.last_name}</span>}
              </div>
              <div className="form-field">
                <label>ID Number (CIN)</label>
                <input
                  type="text"
                  value={form.cin}
                  onChange={(e) => set('cin', e.target.value)}
                  className={errors.cin ? 'error' : ''}
                />
                {errors.cin && <span className="error-message">{errors.cin}</span>}
              </div>
              <div className="form-field">
                <label>Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                  className={errors.age ? 'error' : ''}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-field">
                <label>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
            <div className="form-field">
              <label>Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <Car size={14} />
              <h4>Training</h4>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Category</label>
                <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Registration Date</label>
                <input
                  type="date"
                  value={form.registration_date}
                  onChange={(e) => set('registration_date', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Parent Name</label>
                <input
                  type="text"
                  value={form.parent_name}
                  onChange={(e) => set('parent_name', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Emergency Contact</label>
                <input
                  type="text"
                  value={form.emergency_contact}
                  onChange={(e) => set('emergency_contact', e.target.value)}
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
                <label>Total Price (MAD)</label>
                <input
                  type="number"
                  value={form.total_price}
                  onChange={(e) => set('total_price', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Initial Payment (MAD)</label>
                <input
                  type="number"
                  value={form.initial_payment}
                  onChange={(e) => set('initial_payment', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Status</label>
                <select
                  value={form.payment_status}
                  onChange={(e) => set('payment_status', e.target.value)}
                >
                  {PAYMENT_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-save">
            {isEdit ? 'Save Changes' : 'Add Student'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─────────────── Detail Drawer ─────────────── */
const StudentDetail = ({ student, onClose, onEdit, onDelete, onPrint }) => {
  if (!student) return null;
  const paid = Number(student.initial_payment);
  const total = Number(student.total_price) || 1;
  const pct = Math.min(100, Math.round((paid / total) * 100));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-container" style={{ maxWidth: 460 }}>
        <div className="modal-header" style={{ background: '#8cff2e', color: '#0d0d0d' }}>
          <div className="modal-title">
            <div className="title-icon" style={{ background: 'rgba(0,0,0,0.1)' }}>
              <User size={18} color="#0d0d0d" />
            </div>
            <div>
              <h2 style={{ color: '#0d0d0d' }}>
                {student.first_name} {student.last_name}
              </h2>
              <p style={{ color: 'rgba(0,0,0,0.7)' }}>
                ID: {student.cin} · Age: {student.age} years
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
              <h4>Contact Information</h4>
            </div>
            <div className="info-grid">
              <div className="info-row">
                <Mail size={14} />
                <span className="info-label">Email</span>
                <span className="info-value">{student.email}</span>
              </div>
              <div className="info-row">
                <Phone size={14} />
                <span className="info-label">Phone</span>
                <span className="info-value">{student.phone}</span>
              </div>
              <div className="info-row">
                <MapPin size={14} />
                <span className="info-label">Address</span>
                <span className="info-value">{student.address}</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <Car size={14} />
              <h4>Training Information</h4>
            </div>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">Category</span>
                <span className="info-value">
                  <span className="category-badge">{student.type}</span>
                </span>
              </div>
              <div className="info-row">
                <Calendar size={14} />
                <span className="info-label">Registration Date</span>
                <span className="info-value">{student.registration_date}</span>
              </div>
              {student.parent_name && (
                <div className="info-row">
                  <User size={14} />
                  <span className="info-label">Parent Name</span>
                  <span className="info-value">{student.parent_name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <CreditCard size={14} />
              <h4>Payment Information</h4>
            </div>
            <div className="payment-progress">
              <div className="payment-info">
                <span>Progress</span>
                <span>
                  {paid.toLocaleString()} / {total.toLocaleString()} MAD
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%` }}></div>
              </div>
              <div className="payment-percent">{pct}% paid</div>
            </div>
            <div style={{ marginTop: 12 }}>
              <StatusBadge status={student.payment_status} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={() => onPrint(student)} className="btn-save">
            <Printer size={14} /> Receipt
          </button>
          <button onClick={() => onEdit(student)} className="btn-save">
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => onDelete(student)}
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
const DeleteConfirm = ({ student, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="delete-confirm-modal">
      <div className="delete-icon">
        <Trash2 size={28} color="#ef4444" />
      </div>
      <h3>Delete Student</h3>
      <p>
        Are you sure you want to delete{' '}
        <strong>
          {student?.first_name} {student?.last_name}
        </strong>
        ? This action cannot be undone.
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
          {trend === 'up' ? <ThumbsUp size={10} /> : <ThumbsDown size={10} />}
          {trendValue}%
        </div>
      )}
    </div>
  </div>
);

/* ─────────────── Main Component ─────────────── */
const Students = () => {
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('id_client');
  const [sortDir, setSortDir] = useState('asc');
  const [modal, setModal] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [detailStudent, setDetailStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    let s = [...students];
    if (search) {
      const q = search.toLowerCase();
      s = s.filter((x) =>
        `${x.first_name} ${x.last_name} ${x.cin} ${x.email} ${x.phone}`.toLowerCase().includes(q),
      );
    }
    if (filterCategory !== 'All') s = s.filter((x) => x.type === filterCategory);
    if (filterStatus !== 'All') s = s.filter((x) => x.payment_status === filterStatus);
    s.sort((a, b) => {
      const va = a[sortField],
        vb = b[sortField];
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : va < vb ? 1 : -1;
    });
    return s;
  }, [students, search, filterCategory, filterStatus, sortField, sortDir]);

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
    const isNew = !data.id_client || !students.find((s) => s.id_client === data.id_client);

    if (isNew) {
      const newStudent = { ...data, id_client: Date.now() };
      setStudents((s) => [...s, newStudent]);

      // Add notification for new student
      addNotification(
        'New Student Registered',
        `${data.first_name} ${data.last_name} has registered for Category ${data.type}`,
        'student',
      );

      showToast('Student added successfully');
    } else {
      setStudents((s) => s.map((x) => (x.id_client === data.id_client ? data : x)));
      showToast('Student updated successfully');
    }

    setModal(null);
    setEditStudent(null);
  };

  const handleDelete = (id) => {
    const deletedStudent = students.find((s) => s.id_client === id);
    setStudents((s) => s.filter((x) => x.id_client !== id));
    setDeleteTarget(null);
    setDetailStudent(null);

    // Add notification for deleted student
    if (deletedStudent) {
      addNotification(
        'Student Deleted',
        `${deletedStudent.first_name} ${deletedStudent.last_name} has been removed from the system`,
        'system',
      );
    }

    showToast('Student deleted', 'error');
  };

  const handlePrintReceipt = (student) => {
    showToast(`Printing receipt for ${student.first_name} ${student.last_name}`, 'success');
  };

  const total = students.length;
  const completed = students.filter((s) => s.payment_status === 'Complete').length;
  const revenue = students.reduce((acc, s) => acc + Number(s.initial_payment || 0), 0);

  const UsersIcon = () => (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );

  return (
    <div className="students-page">
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
          icon={<UsersIcon />}
          label="Total Students"
          value={total}
          trend="up"
          trendValue="12"
        />
        <KpiCard
          icon={<CheckCircle size={28} />}
          label="Complete Payments"
          value={completed}
          trend="up"
          trendValue="8"
        />
        <KpiCard
          icon={<DollarSign size={28} />}
          label="Collected Revenue"
          value={`${revenue.toLocaleString()} MAD`}
          trend="up"
          trendValue="15"
        />
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
            placeholder="Search by name, ID, email..."
          />
        </div>

        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              Category {c}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          {PAYMENT_STATUSES.map((s) => (
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
            setEditStudent(null);
            setModal('add');
          }}
        >
          <Plus size={16} /> New Student
        </button>
      </div>

      {/* Content - Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="students-cards-grid">
          {filtered.length === 0 ? (
            <div
              className="empty-state"
              style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px' }}
            >
              <Search size={48} />
              <div>No students found</div>
            </div>
          ) : (
            filtered.map((student) => (
              <StudentCard
                key={student.id_client}
                student={student}
                onEdit={(s) => {
                  setEditStudent(s);
                  setModal('edit');
                }}
                onDelete={(s) => setDeleteTarget(s)}
                onPrint={handlePrintReceipt}
                onView={(s) => setDetailStudent(s)}
              />
            ))
          )}
        </div>
      ) : (
        /* Table View */
        <div className="table-container">
          <div className="table-header">
            <h3>
              Students{' '}
              <span>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </h3>
          </div>

          <div className="students-table-wrapper">
            <table className="students-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('last_name')}>
                    Student{' '}
                    <span className="sort-icon">
                      <SortIcon field="last_name" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('cin')}>
                    ID Number{' '}
                    <span className="sort-icon">
                      <SortIcon field="cin" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('type')}>
                    Category{' '}
                    <span className="sort-icon">
                      <SortIcon field="type" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('phone')}>
                    Phone{' '}
                    <span className="sort-icon">
                      <SortIcon field="phone" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('payment_status')}>
                    Payment{' '}
                    <span className="sort-icon">
                      <SortIcon field="payment_status" />
                    </span>
                  </th>
                  <th onClick={() => toggleSort('registration_date')}>
                    Registration{' '}
                    <span className="sort-icon">
                      <SortIcon field="registration_date" />
                    </span>
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <Search size={32} />
                      <div>No students found</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((student) => (
                    <tr key={student.id_client} onClick={() => setDetailStudent(student)}>
                      <td>
                        <div className="student-info">
                          <Avatar last_name={student.last_name} first_name={student.first_name} />
                          <div className="student-details">
                            <div className="student-name">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="student-email">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="cin-text">{student.cin}</td>
                      <td>
                        <span className="category-badge">{student.type}</span>
                      </td>
                      <td className="phone-text">{student.phone}</td>
                      <td>
                        <StatusBadge status={student.payment_status} />
                      </td>
                      <td className="date-text">{student.registration_date}</td>
                      <td>
                        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="action-btn"
                            onClick={() => setDetailStudent(student)}
                            title="View Details"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => {
                              setEditStudent(student);
                              setModal('edit');
                            }}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => handlePrintReceipt(student)}
                            title="Print Receipt"
                          >
                            <Printer size={14} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => setDeleteTarget(student)}
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
              Showing {filtered.length} out of {total} students
            </div>
            <div className="pagination-controls">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <StudentModal
          student={modal === 'edit' ? editStudent : null}
          onClose={() => {
            setModal(null);
            setEditStudent(null);
          }}
          onSave={handleSave}
        />
      )}

      {detailStudent && (
        <StudentDetail
          student={detailStudent}
          onClose={() => setDetailStudent(null)}
          onEdit={(s) => {
            setDetailStudent(null);
            setEditStudent(s);
            setModal('edit');
          }}
          onDelete={(s) => setDeleteTarget(s)}
          onPrint={handlePrintReceipt}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          student={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id_client)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Students;
