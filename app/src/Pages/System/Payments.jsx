// Pages/System/Payments.jsx
import { useState, useMemo, useEffect, useCallback } from 'react';
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
  Loader,
  Car,
  Wrench,
} from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import axios from '../../services/axios';
import '../../Styles/System/Payments.scss';

/* ─────────────── Constants ─────────────── */
const PAYMENT_STATUSES = ['Paid', 'Partial', 'Pending', 'Overdue'];
const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'Card', 'Cheque', 'Online'];
const PAYMENT_TYPES = ['Registration', 'Session', 'Exam', 'Maintenance', 'Incident', 'Other'];
const CATEGORIES = ['B', 'A', 'A1', 'C', 'D', 'BE'];

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
const PaymentCard = ({ payment, onView, onEdit, onDelete, onPrintReceipt }) => {
  const amountTotal = Number(payment.amount_total) || 0;
  const amountPaid = Number(payment.amount_paid) || 0;
  const amountRemaining = Number(payment.amount_remaining) || 0;

  const percentPaid =
    amountTotal > 0 ? Math.min(100, Math.round((amountPaid / amountTotal) * 100)) : 0;
  const isOverdue = payment.status === 'Overdue';
  const daysOverdue =
    isOverdue && payment.due_date
      ? Math.ceil((new Date() - new Date(payment.due_date)) / 86400000)
      : null;

  // Check if this is an expense (Maintenance or Incident)
  const isExpense = payment.type === 'Maintenance' || payment.type === 'Incident';

  return (
    <div className={`payment-card ${isExpense ? 'expense-card' : ''}`}>
      <div className="payment-card-header">
        <div className="payment-ref">
          <ReceiptText size={16} />
          <span>{payment.reference || 'N/A'}</span>
        </div>
        <StatusBadge status={payment.status} />
      </div>

      {/* Payment Linked Items */}
      <div className="payment-linked-items">
        {payment.session_id && (
          <div className="linked-item">
            <Calendar size={12} />
            <span>Session: {payment.session_date || payment.session_id}</span>
          </div>
        )}
        {payment.vehicle_id && (
          <div className="linked-item">
            <Car size={12} />
            <span>Vehicle: {payment.vehicle_plate || payment.vehicle_id}</span>
          </div>
        )}
      </div>

      <div className="payment-card-body">
        <div className="payment-student">
          <div
            className="student-avatar"
            style={isExpense ? { background: '#ef444415', color: '#ef4444' } : {}}
          >
            {isExpense ? (
              payment.type === 'Maintenance' ? (
                <Wrench size={20} />
              ) : (
                <AlertTriangle size={20} />
              )
            ) : payment.student_name ? (
              payment.student_name
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()
            ) : (
              '??'
            )}
          </div>
          <div className="student-info">
            <h4>{isExpense ? payment.type : payment.student_name || 'N/A'}</h4>
            {!isExpense && <p>CIN: {payment.student_cin || 'N/A'}</p>}
            <span className="category-badge">
              {isExpense
                ? payment.type === 'Maintenance'
                  ? 'Vehicle Expense'
                  : 'Incident Cost'
                : `Cat. ${payment.category || 'N/A'}`}
            </span>
          </div>
        </div>

        <div className="payment-amounts">
          <div className="amount-item total">
            <span>Total</span>
            <strong>{amountTotal.toLocaleString()} DH</strong>
          </div>
          <div className="amount-item paid">
            <span>Paid</span>
            <strong className={isExpense ? 'text-danger' : 'text-success'}>
              {amountPaid.toLocaleString()} DH
            </strong>
          </div>
          <div className="amount-item remaining">
            <span>Remaining</span>
            <strong className={amountRemaining > 0 ? 'text-danger' : 'text-success'}>
              {amountRemaining.toLocaleString()} DH
            </strong>
          </div>
        </div>

        <div className="payment-progress">
          <div className="progress-bar">
            <div
              className={`progress-fill ${isExpense ? 'expense-fill' : ''}`}
              style={{ width: `${percentPaid}%` }}
            />
          </div>
          <div className="progress-percent">{percentPaid}% paid</div>
        </div>

        <div className="payment-meta">
          <div className="meta-item">
            <MethodIcon method={payment.method} />
            <span>{payment.method || 'N/A'}</span>
          </div>
          <div className="meta-item">
            <Calendar size={12} />
            <span>{payment.date || 'N/A'}</span>
          </div>
          {payment.due_date && (
            <div className={`meta-item ${isOverdue ? 'overdue' : ''}`}>
              <AlertCircle size={12} />
              <span>Due: {payment.due_date}</span>
              {daysOverdue && <span className="overdue-badge">+{daysOverdue}d</span>}
            </div>
          )}
        </div>

        {payment.instructor && !isExpense && (
          <div className="payment-instructor">
            <User size={12} />
            <span>{payment.instructor}</span>
          </div>
        )}
        {payment.notes && (
          <div className="payment-notes">
            <FileText size={12} />
            <span className="notes-text">{payment.notes}</span>
          </div>
        )}
      </div>

      <div className="payment-card-actions">
        <button className="action-btn view" onClick={() => onView(payment)} title="View Details">
          <Eye size={14} />
        </button>
        <button
          className="action-btn print"
          onClick={() => onPrintReceipt(payment)}
          title="Print Receipt"
        >
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
const PaymentModal = ({ payment, onClose, onSave, isSaving }) => {
  const [form, setForm] = useState(payment ? { ...payment } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => {
      const updated = { ...f, [k]: v };
      const total = parseFloat(updated.amount_total) || 0;
      const paid = parseFloat(updated.amount_paid) || 0;
      updated.amount_remaining = Math.max(0, total - paid);
      if (paid === 0) updated.status = 'Pending';
      else if (paid >= total) updated.status = 'Paid';
      else updated.status = 'Partial';
      return updated;
    });
  };

  const validate = () => {
    const e = {};
    // For expenses, student name is optional
    const isExpense = form.type === 'Maintenance' || form.type === 'Incident';

    if (!isExpense) {
      if (!form.student_name?.trim()) e.student_name = 'Student name is required';
      if (!form.student_cin?.trim()) e.student_cin = 'CIN is required';
    }

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

  const isExpense = form.type === 'Maintenance' || form.type === 'Incident';

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
          <div className="payment-preview-card">
            <div className="preview-amounts">
              <div className="preview-item">
                <span className="preview-label">Total</span>
                <span className="preview-value">
                  {parseFloat(form.amount_total || 0).toLocaleString()} DH
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Paid</span>
                <span className="preview-value paid">
                  {parseFloat(form.amount_paid || 0).toLocaleString()} DH
                </span>
              </div>
              <div className="preview-item">
                <span className="preview-label">Remaining</span>
                <span className="preview-value remaining">
                  {parseFloat(form.amount_remaining || 0).toLocaleString()} DH
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

          <div className="form-section">
            <h4 className="section-title">
              {isExpense ? <Wrench size={14} /> : <User size={14} />}
              {isExpense ? 'Expense Information' : 'Student Information'}
            </h4>

            {!isExpense ? (
              <>
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
                    {errors.student_name && (
                      <span className="error-msg">{errors.student_name}</span>
                    )}
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
              </>
            ) : (
              <div className="form-row">
                <div className="form-field full-width">
                  <label>Description / Notes</label>
                  <textarea
                    placeholder={`Enter ${form.type.toLowerCase()} description...`}
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-section">
            <h4 className="section-title">
              <CreditCard size={14} /> Payment Details
            </h4>
            <div className="form-row">
              <div className="form-field">
                <label>Total Amount (DH) *</label>
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
                <label>Amount Paid (DH)</label>
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
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? <Loader size={15} className="spinner" /> : <CheckCircle size={15} />}
            {payment ? 'Save Changes' : 'Create Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Payment Detail Modal ── */
const PaymentDetail = ({ payment, onClose, onEdit, onDelete, onPrintReceipt, onSendReceipt }) => {
  const amountTotal = Number(payment.amount_total) || 0;
  const amountPaid = Number(payment.amount_paid) || 0;
  const amountRemaining = Number(payment.amount_remaining) || 0;
  const percentPaid =
    amountTotal > 0 ? Math.min(100, Math.round((amountPaid / amountTotal) * 100)) : 0;
  const isOverdue = payment.status === 'Overdue';
  const daysOverdue =
    isOverdue && payment.due_date
      ? Math.ceil((new Date() - new Date(payment.due_date)) / 86400000)
      : null;
  const isExpense = payment.type === 'Maintenance' || payment.type === 'Incident';

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
          <div className="amount-summary">
            <div className="amount-main">
              <span className="amount-label">Total Amount</span>
              <span className="amount-value">
                {amountTotal.toLocaleString()} <small>DH</small>
              </span>
            </div>
            <div className="amount-breakdown">
              <div className={`breakdown-item ${isExpense ? 'red' : 'green'}`}>
                <span>Paid</span>
                <strong>{amountPaid.toLocaleString()} DH</strong>
              </div>
              <div className="breakdown-item red">
                <span>Remaining</span>
                <strong>{amountRemaining.toLocaleString()} DH</strong>
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
                {isExpense ? <Wrench size={13} /> : <User size={13} />}
                {isExpense ? 'Expense Information' : 'Student Information'}
              </h4>
              <div className="detail-rows">
                {!isExpense ? (
                  <>
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
                  </>
                ) : (
                  <div className="detail-row full-width">
                    <span>Description</span>
                    <strong>{payment.notes || 'No description provided'}</strong>
                  </div>
                )}
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
                  <strong>
                    <span className={`type-badge ${payment.type?.toLowerCase()}`}>
                      {payment.type}
                    </span>
                  </strong>
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
          <button className="btn-print" onClick={() => onPrintReceipt(payment)}>
            <Printer size={14} /> Print Receipt
          </button>
          {!isExpense && (
            <button className="btn-email" onClick={() => onSendReceipt(payment)}>
              <Send size={14} /> Email Receipt
            </button>
          )}
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
const DeleteConfirm = ({ payment, onConfirm, onCancel, isDeleting }) => (
  <div className="modal-overlay">
    <div className="delete-confirm-modal">
      <div className="delete-icon">
        <Trash2 size={26} />
      </div>
      <h3>Delete Payment?</h3>
      <p>
        Are you sure you want to delete payment <strong>{payment.reference}</strong> for{' '}
        <strong>
          {payment.type === 'Maintenance' || payment.type === 'Incident'
            ? payment.type
            : payment.student_name}
        </strong>
        ? This action cannot be undone.
      </p>
      <div className="delete-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-delete" onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? <Loader size={16} className="spinner" /> : null}Delete Payment
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
const KpiCard = ({ icon: Icon, label, value, trend, trendValue, trendUp, isExpense }) => (
  <div className={`kpi-card ${isExpense ? 'expense-kpi' : ''}`}>
    <div className="kpi-icon">{Icon}</div>
    <div className="kpi-info">
      <div className={`kpi-value ${isExpense ? 'expense-value' : ''}`}>{value}</div>
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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
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

  // Expense tracking states
  const [maintenanceTotal, setMaintenanceTotal] = useState(0);
  const [incidentTotal, setIncidentTotal] = useState(0);
  const [netRevenue, setNetRevenue] = useState(0);

  const { addNotification } = useNotifications();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch payments from API
  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/payments');
      console.log('Payments response:', response.data);

      if (response.data.success) {
        // Ensure amounts are numbers
        const paymentsData = response.data.data.map((payment) => ({
          ...payment,
          amount_total: Number(payment.amount_total) || 0,
          amount_paid: Number(payment.amount_paid) || 0,
          amount_remaining: Number(payment.amount_remaining) || 0,
        }));
        setPayments(paymentsData);

        // Calculate expense totals
        const maintenance = paymentsData
          .filter((p) => p.type === 'Maintenance')
          .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);
        const incidents = paymentsData
          .filter((p) => p.type === 'Incident')
          .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);
        const revenue = paymentsData
          .filter((p) => ['Registration', 'Session', 'Exam'].includes(p.type))
          .reduce((sum, p) => sum + (Number(p.amount_paid) || 0), 0);

        setMaintenanceTotal(maintenance);
        setIncidentTotal(incidents);
        setNetRevenue(revenue - maintenance - incidents);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      showToast('Failed to load payments', 'error');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  /* ── KPIs ── */
  const kpis = useMemo(() => {
    if (!payments.length) {
      return {
        total: 0,
        totalRevenue: 0,
        totalExpenses: 0,
        totalPending: 0,
        paid: 0,
        overdue: 0,
        partial: 0,
        collectionRate: 0,
      };
    }

    const totalRevenue = payments
      .filter((p) => ['Registration', 'Session', 'Exam'].includes(p.type))
      .reduce((sum, payment) => sum + (Number(payment.amount_paid) || 0), 0);
    const totalExpenses = payments
      .filter((p) => ['Maintenance', 'Incident'].includes(p.type))
      .reduce((sum, payment) => sum + (Number(payment.amount_paid) || 0), 0);
    const totalPending = payments.reduce(
      (sum, payment) => sum + (Number(payment.amount_remaining) || 0),
      0,
    );
    const paid = payments.filter((p) => p.status === 'Paid').length;
    const overdue = payments.filter((p) => p.status === 'Overdue').length;
    const partial = payments.filter((p) => p.status === 'Partial').length;
    const collectionRate =
      totalRevenue + totalPending > 0 ? (totalRevenue / (totalRevenue + totalPending)) * 100 : 0;

    return {
      total: payments.length,
      totalRevenue,
      totalExpenses,
      totalPending,
      paid,
      overdue,
      partial,
      collectionRate,
    };
  }, [payments]);

  /* ── Filter + Sort ── */
  const filtered = useMemo(() => {
    let list = [...payments];
    if (search) {
      list = list.filter(
        (p) =>
          p.student_name?.toLowerCase().includes(search.toLowerCase()) ||
          p.student_cin?.toLowerCase().includes(search.toLowerCase()) ||
          p.reference?.toLowerCase().includes(search.toLowerCase()) ||
          (p.instructor && p.instructor.toLowerCase().includes(search.toLowerCase())) ||
          (p.type && p.type.toLowerCase().includes(search.toLowerCase())) ||
          (p.notes && p.notes.toLowerCase().includes(search.toLowerCase())),
      );
    }
    if (filterStatus !== 'All') list = list.filter((p) => p.status === filterStatus);
    if (filterMethod !== 'All') list = list.filter((p) => p.method === filterMethod);
    if (filterType !== 'All') list = list.filter((p) => p.type === filterType);
    list.sort((a, b) => {
      let va = a[sortField] ?? '';
      let vb = b[sortField] ?? '';
      if (
        sortField === 'amount_total' ||
        sortField === 'amount_paid' ||
        sortField === 'amount_remaining'
      ) {
        va = Number(va) || 0;
        vb = Number(vb) || 0;
      }
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

  // Export handlers
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'All') params.append('status', filterStatus);
      if (filterMethod !== 'All') params.append('method', filterMethod);
      if (filterType !== 'All') params.append('type', filterType);
      if (search) params.append('search', search);

      const response = await axios.get(`/payments/export/excel?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.xlsx`);
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
      if (filterStatus !== 'All') params.append('status', filterStatus);
      if (filterMethod !== 'All') params.append('method', filterMethod);
      if (filterType !== 'All') params.append('type', filterType);
      if (search) params.append('search', search);

      const response = await axios.get(`/payments/export/pdf?${params.toString()}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments_${new Date().toISOString().split('T')[0]}.pdf`);
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

  // Print receipt handler
  const handlePrintReceipt = async (payment) => {
    try {
      const response = await axios.get(`/payments/${payment.id}/receipt`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' }),
      );
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);

      showToast(`Receipt for ${payment.reference} is ready`);
    } catch (error) {
      console.error('Print failed:', error);
      showToast('Failed to generate receipt', 'error');
    }
  };

  // Send receipt via email
  const handleSendReceipt = (payment) => {
    if (payment.student_email) {
      showToast(`Receipt sent to ${payment.student_email}`);
    } else {
      showToast('No email address available for this student', 'error');
    }
  };

  /* ── CRUD ── */
  const handleSave = async (form) => {
    setIsSaving(true);
    const isNew = !form.id;

    try {
      let response;
      if (isNew) {
        response = await axios.post('/payments', form);
      } else {
        response = await axios.put(`/payments/${form.id}`, form);
      }

      if (response.data.success) {
        await fetchPayments();

        if (isNew) {
          const isExpense = form.type === 'Maintenance' || form.type === 'Incident';
          const message = isExpense
            ? `${form.type} expense of ${Number(form.amount_paid).toLocaleString()} DH recorded`
            : `Payment of ${Number(form.amount_paid).toLocaleString()} DH received from ${form.student_name}`;

          addNotification(
            isExpense ? 'New Expense Recorded' : 'New Payment Recorded',
            message,
            'payment',
          );
          showToast(isExpense ? 'Expense recorded successfully' : 'Payment created successfully');
        } else {
          showToast('Payment updated successfully');
        }
      }
    } catch (error) {
      console.error('Failed to save payment:', error);
      showToast(error.response?.data?.message || 'Failed to save payment', 'error');
    } finally {
      setIsSaving(false);
      setModal(null);
      setEditPayment(null);
    }
  };

  const handleDelete = async (id) => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(`/payments/${id}`);
      if (response.data.success) {
        await fetchPayments();
        showToast('Payment deleted successfully', 'error');
      }
    } catch (error) {
      console.error('Failed to delete payment:', error);
      showToast(error.response?.data?.message || 'Failed to delete payment', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
      setDetailPayment(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="payments-loading">
        <div className="loading-spinner">
          <Loader size={48} className="spinner" />
          <p>Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payments-page">
      <Toast toast={toast} />

      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Global Payments</h1>
            <p>Track all student payments, vehicle expenses, and financial transactions</p>
          </div>
          <div className="revenue-card">
            <span className="revenue-label">Net Revenue</span>
            <span className="revenue-value">
              {netRevenue.toLocaleString()} <small>DH</small>
            </span>
            <div className="collection-progress">
              <div
                className="progress-fill"
                style={{ width: `${Math.min(100, kpis.collectionRate)}%` }}
              />
            </div>
            <span className="collection-pct">
              {Math.round(kpis.collectionRate)}% collection rate
            </span>
          </div>
        </div>
      </div>

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
          value={`${(kpis.totalRevenue / 1000).toFixed(1)}k DH`}
          trend="+12.4%"
          trendValue="this month"
          trendUp={true}
        />
        <KpiCard
          icon={<Wrench size={24} />}
          label="Maintenance Expenses"
          value={`${(maintenanceTotal / 1000).toFixed(1)}k DH`}
          trend="Vehicle costs"
          trendUp={null}
          isExpense={true}
        />
        <KpiCard
          icon={<AlertTriangle size={24} />}
          label="Incident Costs"
          value={`${(incidentTotal / 1000).toFixed(1)}k DH`}
          trend="Damage repairs"
          trendUp={null}
          isExpense={true}
        />
        <KpiCard
          icon={<DollarSign size={24} />}
          label="Net Revenue"
          value={`${(netRevenue / 1000).toFixed(1)}k DH`}
          trend="After expenses"
          trendUp={netRevenue >= 0}
        />
        <KpiCard
          icon={<Clock size={24} />}
          label="Pending Balance"
          value={`${(kpis.totalPending / 1000).toFixed(1)}k DH`}
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

      <div className="toolbar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, CIN, reference, type, notes..."
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
        <button className="btn-export" onClick={handleExportExcel} disabled={isExporting}>
          {isExporting ? <Loader size={15} className="spinner" /> : <Download size={15} />} Excel
        </button>
        <button className="btn-export" onClick={handleExportPdf} disabled={isExporting}>
          {isExporting ? <Loader size={15} className="spinner" /> : <FileText size={15} />} PDF
        </button>
        <button
          className="btn-add"
          onClick={() => {
            setEditPayment(null);
            setModal('add');
          }}
        >
          <Plus size={16} /> New Transaction
        </button>
      </div>

      {viewMode === 'cards' ? (
        <div className="payments-cards-grid">
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <CreditCard size={48} />
              <div>No transactions found</div>
              <p>Try adjusting your filters or create a new transaction</p>
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
                onPrintReceipt={handlePrintReceipt}
              />
            ))
          )}
        </div>
      ) : (
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
                    Student/Expense{' '}
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
                      <div>No transactions found</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => {
                    const isExpense = p.type === 'Maintenance' || p.type === 'Incident';
                    return (
                      <tr
                        key={p.id}
                        onClick={() => setDetailPayment(p)}
                        className={isExpense ? 'expense-row' : ''}
                      >
                        <td>
                          <span className="reference-badge">{p.reference}</span>
                        </td>
                        <td>
                          <div className="student-info-cell">
                            <div
                              className={`student-avatar-sm ${isExpense ? 'expense-avatar' : ''}`}
                            >
                              {isExpense ? (
                                p.type === 'Maintenance' ? (
                                  <Wrench size={14} />
                                ) : (
                                  <AlertTriangle size={14} />
                                )
                              ) : (
                                p.student_name
                                  ?.split(' ')
                                  .map((w) => w[0])
                                  .join('')
                                  .slice(0, 2)
                                  .toUpperCase() || '??'
                              )}
                            </div>
                            <div>
                              <div className="student-name-cell">
                                {isExpense ? p.type : p.student_name}
                              </div>
                              {!isExpense && (
                                <div className="student-cin-cell">{p.student_cin}</div>
                              )}
                              {isExpense && p.notes && (
                                <div className="expense-note-preview">{p.notes.slice(0, 50)}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`type-badge ${p.type?.toLowerCase()}`}>{p.type}</span>
                        </td>
                        <td className={`amount-cell total ${isExpense ? 'expense-amount' : ''}`}>
                          {(Number(p.amount_total) || 0).toLocaleString()} DH
                        </td>
                        <td className={`amount-cell paid ${isExpense ? 'expense-paid' : ''}`}>
                          {(Number(p.amount_paid) || 0).toLocaleString()} DH
                        </td>
                        <td className="amount-cell remaining">
                          {p.amount_remaining > 0 ? (
                            <span className="text-danger">
                              {(Number(p.amount_remaining) || 0).toLocaleString()} DH
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
                              onClick={() => handlePrintReceipt(p)}
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
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <div className="footer-summary">
              <span>
                Showing {filtered.length} of {payments.length} transactions
              </span>
              <span className="footer-totals">
                Revenue:{' '}
                <strong className="text-success">
                  {filtered
                    .filter((p) => ['Registration', 'Session', 'Exam'].includes(p.type))
                    .reduce((s, p) => s + (Number(p.amount_paid) || 0), 0)
                    .toLocaleString()}{' '}
                  DH
                </strong>{' '}
                · Expenses:{' '}
                <strong className="text-danger">
                  {filtered
                    .filter((p) => ['Maintenance', 'Incident'].includes(p.type))
                    .reduce((s, p) => s + (Number(p.amount_paid) || 0), 0)
                    .toLocaleString()}{' '}
                  DH
                </strong>{' '}
                · Net:{' '}
                <strong>
                  {(
                    filtered
                      .filter((p) => ['Registration', 'Session', 'Exam'].includes(p.type))
                      .reduce((s, p) => s + (Number(p.amount_paid) || 0), 0) -
                    filtered
                      .filter((p) => ['Maintenance', 'Incident'].includes(p.type))
                      .reduce((s, p) => s + (Number(p.amount_paid) || 0), 0)
                  ).toLocaleString()}{' '}
                  DH
                </strong>
              </span>
            </div>
            <div className="pagination-controls">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(modal === 'add' || modal === 'edit') && (
        <PaymentModal
          payment={modal === 'edit' ? editPayment : null}
          onClose={() => {
            setModal(null);
            setEditPayment(null);
          }}
          onSave={handleSave}
          isSaving={isSaving}
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
          onPrintReceipt={handlePrintReceipt}
          onSendReceipt={handleSendReceipt}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          payment={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default Payments;
