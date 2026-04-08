// Pages/System/Payments.jsx
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
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Hash,
  Printer,
  ChevronDown,
  ChevronUp,
  Filter,
  List,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  ReceiptText,
  Banknote,
  Landmark,
  Smartphone,
  Building2,
  Percent,
  AlertTriangle,
  RefreshCw,
  Grid,
  Receipt,
  Send,
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import '../../Styles/System/Payments.scss';

/* ─────────────── Mock Data ─────────────── */
const PAYMENT_STATUSES = ['Paid', 'Partial', 'Pending', 'Overdue'];
const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Card', 'Cheque', 'Online'];
const PAYMENT_TYPES = ['Registration', 'Session', 'Exam', 'Other'];
const CATEGORIES = ['B', 'A', 'A1', 'C', 'D', 'BE'];

const MOCK_PAYMENTS = [
  {
    id: 1,
    reference: 'PAY-2025-001',
    student_name: 'Youssef Alami',
    student_cin: 'AB123456',
    student_phone: '0612345678',
    student_email: 'youssef.alami@gmail.com',
    category: 'B',
    amount_total: 6000,
    amount_paid: 3000,
    amount_remaining: 3000,
    status: 'Partial',
    method: 'Cash',
    type: 'Registration',
    date: '2024-11-10',
    due_date: '2025-03-10',
    instructor: 'Mohammed Rami',
    notes: 'First installment received',
    receipt_number: 'RCP-001',
    payment_reference: null,
  },
  {
    id: 2,
    reference: 'PAY-2025-002',
    student_name: 'Fatima Benali',
    student_cin: 'CD789012',
    student_phone: '0698765432',
    student_email: 'fatima.benali@gmail.com',
    category: 'B',
    amount_total: 6000,
    amount_paid: 6000,
    amount_remaining: 0,
    status: 'Paid',
    method: 'Bank Transfer',
    type: 'Registration',
    date: '2024-10-05',
    due_date: '2024-10-05',
    instructor: 'Sara Filali',
    notes: 'Full payment received',
    receipt_number: 'RCP-002',
    payment_reference: 'TRF-123456',
  },
  {
    id: 3,
    reference: 'PAY-2025-003',
    student_name: 'Karim Cherkaoui',
    student_cin: 'EF345678',
    student_phone: '0655443322',
    student_email: 'karim.ch@outlook.com',
    category: 'C',
    amount_total: 9000,
    amount_paid: 0,
    amount_remaining: 9000,
    status: 'Overdue',
    method: 'Cash',
    type: 'Registration',
    date: '2025-01-18',
    due_date: '2025-02-18',
    instructor: 'Hassan Boulal',
    notes: 'Awaiting payment confirmation',
    receipt_number: null,
    payment_reference: null,
  },
  {
    id: 4,
    reference: 'PAY-2025-004',
    student_name: 'Nadia Tazi',
    student_cin: 'GH901234',
    student_phone: '0611223344',
    student_email: 'nadia.tazi@gmail.com',
    category: 'A',
    amount_total: 4500,
    amount_paid: 4500,
    amount_remaining: 0,
    status: 'Paid',
    method: 'Card',
    type: 'Registration',
    date: '2024-12-22',
    due_date: '2024-12-22',
    instructor: 'Youssef Kadiri',
    notes: '',
    receipt_number: 'RCP-003',
    payment_reference: 'CARD-XXXX-1234',
  },
  {
    id: 5,
    reference: 'PAY-2025-005',
    student_name: 'Hassan Ouazzani',
    student_cin: 'IJ567890',
    student_phone: '0677889900',
    student_email: 'hassan.o@gmail.com',
    category: 'BE',
    amount_total: 7500,
    amount_paid: 2000,
    amount_remaining: 5500,
    status: 'Partial',
    method: 'Cheque',
    type: 'Registration',
    date: '2025-02-03',
    due_date: '2025-05-03',
    instructor: 'Fatima Zahra',
    notes: 'Cheque #1234',
    receipt_number: 'RCP-004',
    payment_reference: 'CHQ-1234',
  },
  {
    id: 6,
    reference: 'PAY-2025-006',
    student_name: 'Imane Bouazza',
    student_cin: 'KL112233',
    student_phone: '0677889911',
    student_email: 'imane.b@outlook.com',
    category: 'B',
    amount_total: 450,
    amount_paid: 450,
    amount_remaining: 0,
    status: 'Paid',
    method: 'Cash',
    type: 'Exam',
    date: '2025-03-01',
    due_date: '2025-03-01',
    instructor: 'Mohammed Rami',
    notes: 'Code exam fee',
    receipt_number: 'RCP-005',
    payment_reference: null,
  },
  {
    id: 7,
    reference: 'PAY-2025-007',
    student_name: 'Omar Mansouri',
    student_cin: 'MN445566',
    student_phone: '0612345699',
    student_email: 'omar.mansouri@gmail.com',
    category: 'B',
    amount_total: 6200,
    amount_paid: 3100,
    amount_remaining: 3100,
    status: 'Pending',
    method: 'Cash',
    type: 'Registration',
    date: '2025-03-10',
    due_date: '2025-06-10',
    instructor: 'Sara Filali',
    notes: '',
    receipt_number: null,
    payment_reference: null,
  },
];

const EMPTY_FORM = {
  reference: `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`,
  student_name: '',
  student_cin: '',
  student_phone: '',
  student_email: '',
  category: 'B',
  amount_total: '',
  amount_paid: '',
  status: 'Pending',
  method: 'Cash',
  type: 'Registration',
  date: new Date().toISOString().split('T')[0],
  due_date: '',
  instructor: '',
  notes: '',
  payment_reference: '',
};

/* ─────────────── Sub-components ─────────────── */

const StatusBadge = ({ status }) => {
  const map = {
    Paid: { icon: CheckCircle, cls: 'paid' },
    Partial: { icon: Clock, cls: 'partial' },
    Pending: { icon: Clock, cls: 'pending' },
    Overdue: { icon: AlertCircle, cls: 'overdue' },
  };
  const { icon: Icon, cls } = map[status] || map['Pending'];
  return (
    <span className={`status-badge status-${cls}`}>
      <Icon size={12} /> {status}
    </span>
  );
};

const MethodIcon = ({ method }) => {
  const icons = {
    Cash: Banknote,
    'Bank Transfer': Landmark,
    Card: CreditCard,
    Cheque: Receipt,
    Online: Smartphone,
  };
  const Icon = icons[method] || Banknote;
  return <Icon size={14} />;
};

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ChevronDown size={13} className="sort-icon-inactive" />;
  return sortDir === 'asc' ? (
    <ChevronUp size={13} className="sort-icon-active" />
  ) : (
    <ChevronDown size={13} className="sort-icon-active" />
  );
};

/* ── Payment Card (for card view) ── */
const PaymentCard = ({ payment, onView, onEdit, onDelete, onPrint }) => {
  const percentPaid = Math.min(
    100,
    Math.round((payment.amount_paid / (payment.amount_total || 1)) * 100),
  );
  const isOverdue = payment.status === 'Overdue';
  const daysOverdue =
    isOverdue && payment.due_date
      ? Math.ceil((new Date() - new Date(payment.due_date)) / 86400000)
      : null;

  return (
    <div className="payment-card">
      <div className="payment-card-header">
        <div className="payment-ref">
          <ReceiptText size={16} />
          <span>{payment.reference}</span>
        </div>
        <StatusBadge status={payment.status} />
      </div>

      <div className="payment-card-body">
        <div className="payment-student">
          <div className="student-avatar">
            {payment.student_name
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div className="student-info">
            <h4>{payment.student_name}</h4>
            <p>CIN: {payment.student_cin}</p>
            <span className="category-badge">Cat. {payment.category}</span>
          </div>
        </div>

        <div className="payment-amounts">
          <div className="amount-item total">
            <span>Total</span>
            <strong>{payment.amount_total.toLocaleString()} MAD</strong>
          </div>
          <div className="amount-item paid">
            <span>Paid</span>
            <strong className="text-success">{payment.amount_paid.toLocaleString()} MAD</strong>
          </div>
          <div className="amount-item remaining">
            <span>Remaining</span>
            <strong className={payment.amount_remaining > 0 ? 'text-danger' : 'text-success'}>
              {payment.amount_remaining.toLocaleString()} MAD
            </strong>
          </div>
        </div>

        <div className="payment-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${percentPaid}%` }} />
          </div>
          <div className="progress-percent">{percentPaid}% paid</div>
        </div>

        <div className="payment-meta">
          <div className="meta-item">
            <MethodIcon method={payment.method} />
            <span>{payment.method}</span>
          </div>
          <div className="meta-item">
            <Calendar size={12} />
            <span>{payment.date}</span>
          </div>
          {payment.due_date && (
            <div className={`meta-item ${isOverdue ? 'overdue' : ''}`}>
              <AlertCircle size={12} />
              <span>Due: {payment.due_date}</span>
              {daysOverdue && <span className="overdue-badge">+{daysOverdue}d</span>}
            </div>
          )}
        </div>

        {payment.instructor && (
          <div className="payment-instructor">
            <User size={12} />
            <span>{payment.instructor}</span>
          </div>
        )}
      </div>

      <div className="payment-card-actions">
        <button className="action-btn view" onClick={() => onView(payment)} title="View Details">
          <Eye size={14} />
        </button>
        <button className="action-btn print" onClick={() => onPrint(payment)} title="Print Receipt">
          <Printer size={14} />
        </button>
        <button className="action-btn edit" onClick={() => onEdit(payment)} title="Edit Payment">
          <Pencil size={14} />
        </button>
        <button
          className="action-btn delete"
          onClick={() => onDelete(payment)}
          title="Delete Payment"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

/* ── Payment Modal ── */
const PaymentModal = ({ payment, onClose, onSave }) => {
  const [form, setForm] = useState(payment ? { ...payment } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => {
      const updated = { ...f, [k]: v };
      // Auto-calculate remaining
      const total = parseFloat(updated.amount_total) || 0;
      const paid = parseFloat(updated.amount_paid) || 0;
      updated.amount_remaining = Math.max(0, total - paid);
      // Auto-set status
      if (paid === 0) updated.status = 'Pending';
      else if (paid >= total) updated.status = 'Paid';
      else updated.status = 'Partial';
      return updated;
    });
  };

  const validate = () => {
    const e = {};
    if (!form.student_name.trim()) e.student_name = 'Student name is required';
    if (!form.student_cin.trim()) e.student_cin = 'CIN is required';
    if (!form.amount_total || parseFloat(form.amount_total) <= 0)
      e.amount_total = 'Enter a valid total amount';
    if (parseFloat(form.amount_paid) > parseFloat(form.amount_total))
      e.amount_paid = 'Paid cannot exceed total';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  const percentPaid =
    form.amount_total > 0
      ? Math.min(
          100,
          Math.round((parseFloat(form.amount_paid || 0) / parseFloat(form.amount_total)) * 100),
        )
      : 0;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="payment-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <CreditCard size={22} color="#8cff2e" />
            </div>
            <div>
              <h2>{payment ? 'Edit Payment' : 'New Payment'}</h2>
              <p>{payment ? 'Update payment record' : 'Register a new payment transaction'}</p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Progress preview */}
          <div className="payment-preview-card">
            <div className="preview-amounts">
              <div className="preview-item">
                <span className="preview-label">Total</span>
                <span className="preview-value">
                  {parseFloat(form.amount_total || 0).toLocaleString()} MAD
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Paid</span>
                <span className="preview-value paid">
                  {parseFloat(form.amount_paid || 0).toLocaleString()} MAD
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Remaining</span>
                <span className="preview-value remaining">
                  {parseFloat(form.amount_remaining || 0).toLocaleString()} MAD
                </span>
              </div>
            </div>
            <div className="preview-progress-bar">
              <div className="progress-fill" style={{ width: `${percentPaid}%` }} />
            </div>
            <div className="preview-pct">{percentPaid}% paid</div>
            <div className="preview-status">
              <StatusBadge status={form.status} />
            </div>
          </div>

          {/* Student Info */}
          <div className="form-section">
            <h4 className="section-title">
              <User size={14} /> Student Information
            </h4>
            <div className="form-row">
              <div className="form-field">
                <label>Student Name *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.student_name}
                  onChange={(e) => set('student_name', e.target.value)}
                  className={errors.student_name ? 'error' : ''}
                />
                {errors.student_name && <span className="error-msg">{errors.student_name}</span>}
              </div>
              <div className="form-field">
                <label>CIN *</label>
                <input
                  type="text"
                  placeholder="e.g. AB123456"
                  value={form.student_cin}
                  onChange={(e) => set('student_cin', e.target.value)}
                  className={errors.student_cin ? 'error' : ''}
                />
                {errors.student_cin && <span className="error-msg">{errors.student_cin}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.student_phone}
                  onChange={(e) => set('student_phone', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.student_email}
                  onChange={(e) => set('student_email', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      Category {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Instructor</label>
                <input
                  type="text"
                  placeholder="Instructor name"
                  value={form.instructor}
                  onChange={(e) => set('instructor', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="form-section">
            <h4 className="section-title">
              <CreditCard size={14} /> Payment Details
            </h4>
            <div className="form-row">
              <div className="form-field">
                <label>Total Amount (MAD) *</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount_total}
                  onChange={(e) => set('amount_total', e.target.value)}
                  className={errors.amount_total ? 'error' : ''}
                />
                {errors.amount_total && <span className="error-msg">{errors.amount_total}</span>}
              </div>
              <div className="form-field">
                <label>Amount Paid (MAD)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={form.amount_paid}
                  onChange={(e) => set('amount_paid', e.target.value)}
                  className={errors.amount_paid ? 'error' : ''}
                />
                {errors.amount_paid && <span className="error-msg">{errors.amount_paid}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Payment Method</label>
                <select value={form.method} onChange={(e) => set('method', e.target.value)}>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Payment Type</label>
                <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                  {PAYMENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Payment Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set('date', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Due Date</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => set('due_date', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Transaction Reference</label>
                <input
                  type="text"
                  placeholder="Bank transfer ref, cheque number, etc."
                  value={form.payment_reference}
                  onChange={(e) => set('payment_reference', e.target.value)}
                />
              </div>
            </div>
            <div className="form-field full-width">
              <label>Notes</label>
              <textarea
                placeholder="Additional notes..."
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            <CheckCircle size={15} />
            {payment ? 'Save Changes' : 'Create Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Payment Detail Modal ── */
const PaymentDetail = ({ payment, onClose, onEdit, onDelete, onPrint, onSendReceipt }) => {
  const percentPaid = Math.min(
    100,
    Math.round((payment.amount_paid / (payment.amount_total || 1)) * 100),
  );
  const isOverdue = payment.status === 'Overdue';
  const daysOverdue =
    isOverdue && payment.due_date
      ? Math.ceil((new Date() - new Date(payment.due_date)) / 86400000)
      : null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="payment-detail-modal">
        <div className="detail-header">
          <div className="detail-ref-badge">
            <ReceiptText size={18} />
            <span>{payment.reference}</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-body">
          {/* Amount Summary */}
          <div className="amount-summary">
            <div className="amount-main">
              <span className="amount-label">Total Amount</span>
              <span className="amount-value">
                {payment.amount_total.toLocaleString()} <small>MAD</small>
              </span>
            </div>
            <div className="amount-breakdown">
              <div className="breakdown-item green">
                <span>Paid</span>
                <strong>{payment.amount_paid.toLocaleString()} MAD</strong>
              </div>
              <div className="breakdown-item red">
                <span>Remaining</span>
                <strong>{payment.amount_remaining.toLocaleString()} MAD</strong>
              </div>
            </div>
            <div className="detail-progress-bar">
              <div className="progress-fill" style={{ width: `${percentPaid}%` }} />
            </div>
            <div className="detail-pct-row">
              <StatusBadge status={payment.status} />
              <span className="pct-text">{percentPaid}% completed</span>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-section">
              <h4>
                <User size={13} /> Student Information
              </h4>
              <div className="detail-rows">
                <div className="detail-row">
                  <span>Name</span>
                  <strong>{payment.student_name}</strong>
                </div>
                <div className="detail-row">
                  <span>CIN</span>
                  <strong className="mono">{payment.student_cin}</strong>
                </div>
                {payment.student_phone && (
                  <div className="detail-row">
                    <Phone size={12} />
                    <span>Phone</span>
                    <strong>{payment.student_phone}</strong>
                  </div>
                )}
                {payment.student_email && (
                  <div className="detail-row">
                    <Mail size={12} />
                    <span>Email</span>
                    <strong>{payment.student_email}</strong>
                  </div>
                )}
                <div className="detail-row">
                  <span>Category</span>
                  <strong>
                    <span className="category-badge">{payment.category}</span>
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Instructor</span>
                  <strong>{payment.instructor || '—'}</strong>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>
                <CreditCard size={13} /> Transaction Details
              </h4>
              <div className="detail-rows">
                <div className="detail-row">
                  <span>Method</span>
                  <strong>
                    <MethodIcon method={payment.method} /> {payment.method}
                  </strong>
                </div>
                <div className="detail-row">
                  <span>Type</span>
                  <strong>{payment.type}</strong>
                </div>
                <div className="detail-row">
                  <span>Date</span>
                  <strong>{payment.date}</strong>
                </div>
                <div className="detail-row">
                  <span>Due Date</span>
                  <strong className={isOverdue ? 'text-danger' : ''}>
                    {payment.due_date || '—'}
                    {isOverdue && daysOverdue && (
                      <span className="overdue-badge"> ({daysOverdue} days overdue)</span>
                    )}
                  </strong>
                </div>
                {payment.payment_reference && (
                  <div className="detail-row">
                    <span>Reference</span>
                    <strong className="mono">{payment.payment_reference}</strong>
                  </div>
                )}
                {payment.receipt_number && (
                  <div className="detail-row">
                    <span>Receipt #</span>
                    <strong>{payment.receipt_number}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {payment.notes && (
            <div className="detail-notes">
              <h4>Notes</h4>
              <p>{payment.notes}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-print" onClick={() => onPrint(payment)}>
            <Printer size={14} /> Print Receipt
          </button>
          <button className="btn-email" onClick={() => onSendReceipt(payment)}>
            <Send size={14} /> Email Receipt
          </button>
          <div className="footer-right">
            <button className="btn-delete" onClick={() => onDelete(payment)}>
              <Trash2 size={14} /> Delete
            </button>
            <button className="btn-save" onClick={() => onEdit(payment)}>
              <Pencil size={14} /> Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Delete Confirm ── */
const DeleteConfirm = ({ payment, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="delete-confirm-modal">
      <div className="delete-icon">
        <Trash2 size={26} />
      </div>
      <h3>Delete Payment?</h3>
      <p>
        Are you sure you want to delete payment <strong>{payment.reference}</strong> for{' '}
        <strong>{payment.student_name}</strong>? This action cannot be undone.
      </p>
      <div className="delete-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-delete" onClick={onConfirm}>
          Delete Payment
        </button>
      </div>
    </div>
  </div>
);

/* ── Toast ── */
const Toast = ({ toast }) =>
  toast ? (
    <div className={`toast-notification toast-${toast.type}`}>
      {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {toast.msg}
    </div>
  ) : null;

/* ── KPI Card Component ── */
const KpiCard = ({ icon: Icon, label, value, trend, trendValue, trendUp }) => (
  <div className="kpi-card">
    <div className="kpi-icon">{Icon}</div>
    <div className="kpi-info">
      <div className="kpi-value">{value}</div>
      <div className="kpi-label">{label}</div>
      {trend && (
        <div className={`kpi-trend ${trendUp ? 'trend-up' : 'trend-down'}`}>
          {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend} {trendValue && `(${trendValue})`}
        </div>
      )}
    </div>
  </div>
);

/* ─────────────── Main Component ─────────────── */
const Payments = () => {
  const [payments, setPayments] = useState(MOCK_PAYMENTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [viewMode, setViewMode] = useState('table');
  const [modal, setModal] = useState(null);
  const [editPayment, setEditPayment] = useState(null);
  const [detailPayment, setDetailPayment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);

  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── KPIs ── */
  const kpis = useMemo(() => {
    const totalRevenue = payments.reduce((s, p) => s + p.amount_paid, 0);
    const totalPending = payments.reduce((s, p) => s + p.amount_remaining, 0);
    const paid = payments.filter((p) => p.status === 'Paid').length;
    const overdue = payments.filter((p) => p.status === 'Overdue').length;
    const partial = payments.filter((p) => p.status === 'Partial').length;
    const collectionRate = totalRevenue / (totalRevenue + totalPending || 1);
    const avgPayment = totalRevenue / payments.length || 0;
    return {
      totalRevenue,
      totalPending,
      paid,
      overdue,
      partial,
      total: payments.length,
      collectionRate,
      avgPayment,
    };
  }, [payments]);

  /* ── Filter + Sort ── */
  const filtered = useMemo(() => {
    let list = [...payments];
    if (search)
      list = list.filter(
        (p) =>
          p.student_name.toLowerCase().includes(search.toLowerCase()) ||
          p.student_cin.toLowerCase().includes(search.toLowerCase()) ||
          p.reference.toLowerCase().includes(search.toLowerCase()) ||
          (p.instructor && p.instructor.toLowerCase().includes(search.toLowerCase())),
      );
    if (filterStatus !== 'All') list = list.filter((p) => p.status === filterStatus);
    if (filterMethod !== 'All') list = list.filter((p) => p.method === filterMethod);
    if (filterType !== 'All') list = list.filter((p) => p.type === filterType);
    list.sort((a, b) => {
      const va = a[sortField] ?? '';
      const vb = b[sortField] ?? '';
      return sortDir === 'asc' ? (va < vb ? -1 : 1) : va > vb ? -1 : 1;
    });
    return list;
  }, [payments, search, filterStatus, filterMethod, filterType, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  /* ── CRUD ── */
  const handleSave = (form) => {
    if (modal === 'add') {
      const newP = {
        ...form,
        id: Date.now(),
        amount_total: parseFloat(form.amount_total),
        amount_paid: parseFloat(form.amount_paid || 0),
        amount_remaining: parseFloat(form.amount_remaining || form.amount_total),
        receipt_number:
          form.amount_paid >= form.amount_total ? `RCP-${String(Date.now()).slice(-6)}` : null,
      };
      setPayments((p) => [newP, ...p]);

      addNotification(
        'New Payment Recorded',
        `Payment of ${newP.amount_paid.toLocaleString()} MAD received from ${newP.student_name}`,
        'payment',
      );

      showToast('Payment created successfully');
    } else {
      setPayments((p) =>
        p.map((x) =>
          x.id === form.id
            ? {
                ...form,
                amount_total: parseFloat(form.amount_total),
                amount_paid: parseFloat(form.amount_paid || 0),
                amount_remaining: parseFloat(form.amount_remaining || 0),
                receipt_number:
                  form.amount_paid >= form.amount_total
                    ? `RCP-${String(form.id).slice(-6)}`
                    : x.receipt_number,
              }
            : x,
        ),
      );
      showToast('Payment updated successfully');
    }
    setModal(null);
    setEditPayment(null);
  };

  const handleDelete = (id) => {
    const deletedPayment = payments.find((p) => p.id === id);
    setPayments((p) => p.filter((x) => x.id !== id));
    setDeleteTarget(null);
    setDetailPayment(null);

    if (deletedPayment) {
      addNotification(
        'Payment Deleted',
        `Payment ${deletedPayment.reference} for ${deletedPayment.student_name} has been removed`,
        'system',
      );
    }

    showToast('Payment deleted', 'error');
  };

  const handlePrint = (payment) => {
    showToast(`Receipt for ${payment.reference} is ready for printing`);
  };

  const handleSendReceipt = (payment) => {
    if (payment.student_email) {
      showToast(`Receipt sent to ${payment.student_email}`);
    } else {
      showToast('No email address available for this student', 'error');
    }
  };

  return (
    <div className="payments-page">
      <Toast toast={toast} />

      {/* ── Header ── */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Global Payments</h1>
            <p>Track all student payments, transactions and outstanding balances</p>
          </div>
          <div className="revenue-card">
            <span className="revenue-label">Total Collected</span>
            <span className="revenue-value">
              {kpis.totalRevenue.toLocaleString()} <small>MAD</small>
            </span>
            <div className="collection-progress">
              <div
                className="progress-fill"
                style={{ width: `${Math.round(kpis.collectionRate * 100)}%` }}
              />
            </div>
            <span className="collection-pct">
              {Math.round(kpis.collectionRate * 100)}% collection rate
            </span>
          </div>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="kpi-grid">
        <KpiCard
          icon={<ReceiptText size={24} />}
          label="Total Transactions"
          value={kpis.total}
          trend="All payments"
          trendUp={null}
        />
        <KpiCard
          icon={<Wallet size={24} />}
          label="Revenue Collected"
          value={`${(kpis.totalRevenue / 1000).toFixed(1)}k MAD`}
          trend="+12.4%"
          trendValue="this month"
          trendUp={true}
        />
        <KpiCard
          icon={<Clock size={24} />}
          label="Pending Balance"
          value={`${(kpis.totalPending / 1000).toFixed(1)}k MAD`}
          trend="Outstanding"
          trendUp={false}
        />
        <KpiCard
          icon={<AlertCircle size={24} />}
          label="Overdue Payments"
          value={kpis.overdue}
          trend="Require action"
          trendUp={false}
        />
      </div>

      {/* ── View Toggle ── */}
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

      {/* ── Toolbar ── */}
      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, CIN, reference, instructor..."
          />
        </div>

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

        <select
          className="filter-select"
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
        >
          <option value="All">All Methods</option>
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          {PAYMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
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
            setEditPayment(null);
            setModal('add');
          }}
        >
          <Plus size={16} /> New Payment
        </button>
      </div>

      {/* ── Content: Cards or Table ── */}
      {viewMode === 'cards' ? (
        <div className="payments-cards-grid">
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <CreditCard size={48} />
              <div>No payments found</div>
              <p>Try adjusting your filters or create a new payment</p>
            </div>
          ) : (
            filtered.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onView={setDetailPayment}
                onEdit={(p) => {
                  setEditPayment(p);
                  setModal('edit');
                }}
                onDelete={setDeleteTarget}
                onPrint={handlePrint}
              />
            ))
          )}
        </div>
      ) : (
        /* ── Table View ── */
        <div className="table-container">
          <div className="table-header">
            <h3>
              Transactions{' '}
              <span>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </h3>
          </div>

          <div className="payments-table-wrapper">
            <table className="payments-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('reference')}>
                    Reference <SortIcon field="reference" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('student_name')}>
                    Student{' '}
                    <SortIcon field="student_name" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('type')}>
                    Type <SortIcon field="type" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('amount_total')}>
                    Total <SortIcon field="amount_total" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('amount_paid')}>
                    Paid <SortIcon field="amount_paid" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('amount_remaining')}>
                    Remaining{' '}
                    <SortIcon field="amount_remaining" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('method')}>
                    Method <SortIcon field="method" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('status')}>
                    Status <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('date')}>
                    Date <SortIcon field="date" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="empty-state">
                      <CreditCard size={32} />
                      <div>No payments found</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} onClick={() => setDetailPayment(p)}>
                      <td>
                        <span className="reference-badge">{p.reference}</span>
                      </td>
                      <td>
                        <div className="student-info-cell">
                          <div className="student-avatar-sm">
                            {p.student_name
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>
                          <div>
                            <div className="student-name-cell">{p.student_name}</div>
                            <div className="student-cin-cell">{p.student_cin}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="type-badge">{p.type}</span>
                      </td>
                      <td className="amount-cell total">{p.amount_total.toLocaleString()} MAD</td>
                      <td className="amount-cell paid">{p.amount_paid.toLocaleString()} MAD</td>
                      <td className="amount-cell remaining">
                        {p.amount_remaining > 0 ? (
                          <span className="text-danger">
                            {p.amount_remaining.toLocaleString()} MAD
                          </span>
                        ) : (
                          <span className="text-success">—</span>
                        )}
                      </td>
                      <td>
                        <span className="method-text">
                          <MethodIcon method={p.method} /> {p.method}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="date-text">{p.date}</td>
                      <td>
                        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="action-btn"
                            onClick={() => setDetailPayment(p)}
                            title="View"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => {
                              setEditPayment(p);
                              setModal('edit');
                            }}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => handlePrint(p)}
                            title="Print"
                          >
                            <Printer size={14} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => setDeleteTarget(p)}
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
            <div className="footer-summary">
              <span>
                Showing {filtered.length} of {payments.length} payments
              </span>
              <span className="footer-totals">
                Collected:{' '}
                <strong>
                  {filtered.reduce((s, p) => s + p.amount_paid, 0).toLocaleString()} MAD
                </strong>{' '}
                · Remaining:{' '}
                <strong className="text-danger">
                  {filtered.reduce((s, p) => s + p.amount_remaining, 0).toLocaleString()} MAD
                </strong>
              </span>
            </div>
            <div className="pagination-controls">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {(modal === 'add' || modal === 'edit') && (
        <PaymentModal
          payment={modal === 'edit' ? editPayment : null}
          onClose={() => {
            setModal(null);
            setEditPayment(null);
          }}
          onSave={handleSave}
        />
      )}

      {detailPayment && (
        <PaymentDetail
          payment={detailPayment}
          onClose={() => setDetailPayment(null)}
          onEdit={(p) => {
            setDetailPayment(null);
            setEditPayment(p);
            setModal('edit');
          }}
          onDelete={(p) => {
            setDetailPayment(null);
            setDeleteTarget(p);
          }}
          onPrint={handlePrint}
          onSendReceipt={handleSendReceipt}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          payment={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default Payments;
