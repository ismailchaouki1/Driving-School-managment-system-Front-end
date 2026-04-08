// Pages/System/Vehicles.jsx
import { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Download,
  FileText,
  Eye,
  Pencil,
  Trash2,
  X,
  Car,
  Fuel,
  Calendar,
  Hash,
  CheckCircle,
  Clock,
  AlertCircle,
  Wrench,
  ChevronDown,
  ChevronUp,
  Grid,
  List,
  Filter,
  TrendingUp,
  TrendingDown,
  Shield,
  Gauge,
  Upload,
  File,
  Image,
  AlertTriangle,
  MapPin,
  User,
  DollarSign,
  Settings,
  RefreshCw,
  Bell,
  FileCheck,
  Truck,
} from 'lucide-react';
import '../../Styles/System/Vehicles.scss';

/* ─────────────── Mock Data ─────────────── */
const CATEGORIES = ['B', 'A', 'A1', 'C', 'D', 'BE'];
const VEHICLE_STATUSES = ['Active', 'Maintenance', 'Inactive', 'Out of Service'];
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const MAINTENANCE_TYPES = [
  'Oil Change',
  'Tire Rotation',
  'Brake Service',
  'Engine Tune-up',
  'Transmission Service',
  'Battery Replacement',
  'Inspection',
  'Other',
];

const MOCK_VEHICLES = [
  {
    id: 1,
    brand: 'Dacia',
    model: 'Sandero',
    year: 2022,
    plate: '12345-A-1',
    vin: 'VF1ABCDE123456789',
    category: 'B',
    fuel: 'Gasoline',
    transmission: 'Manual',
    color: '#e74c3c',
    status: 'Active',
    mileage: 34200,
    last_maintenance: '2025-01-15',
    next_maintenance: '2025-07-15',
    insurance_expiry: '2025-12-31',
    insurance_provider: 'AXA Assurance',
    insurance_policy: 'AXA-2025-001',
    technical_inspection: '2025-10-20',
    registration_expiry: '2025-11-30',
    assigned_instructor: 'Mohammed Rami',
    sessions_count: 142,
    purchase_price: 120000,
    current_value: 85000,
    fuel_efficiency: 6.5,
    notes: 'Primary training vehicle for category B',
    images: [],
    documents: [],
    maintenance_history: [
      {
        id: 1,
        date: '2025-01-15',
        type: 'Oil Change',
        mileage: 32500,
        cost: 450,
        notes: 'Regular oil change with synthetic oil',
      },
      {
        id: 2,
        date: '2024-10-10',
        type: 'Tire Rotation',
        mileage: 28900,
        cost: 200,
        notes: 'Tires rotated and balanced',
      },
    ],
    incidents: [],
  },
  {
    id: 2,
    brand: 'Renault',
    model: 'Clio',
    year: 2021,
    plate: '67890-B-2',
    vin: 'VF2BCDEF234567890',
    category: 'B',
    fuel: 'Diesel',
    transmission: 'Manual',
    color: '#3498db',
    status: 'Active',
    mileage: 52100,
    last_maintenance: '2025-02-20',
    next_maintenance: '2025-08-20',
    insurance_expiry: '2025-11-30',
    insurance_provider: 'Wafa Assurance',
    insurance_policy: 'WAFA-2025-045',
    technical_inspection: '2025-09-15',
    registration_expiry: '2025-10-31',
    assigned_instructor: 'Sara Filali',
    sessions_count: 218,
    purchase_price: 135000,
    current_value: 92000,
    fuel_efficiency: 5.2,
    notes: 'Fuel-efficient vehicle for long distance training',
    images: [],
    documents: [],
    maintenance_history: [
      { id: 1, date: '2025-02-20', type: 'Oil Change', mileage: 51200, cost: 480, notes: '' },
      {
        id: 2,
        date: '2024-12-05',
        type: 'Brake Service',
        mileage: 46800,
        cost: 1200,
        notes: 'Front brake pads replaced',
      },
    ],
    incidents: [],
  },
  {
    id: 3,
    brand: 'Honda',
    model: 'CB500',
    year: 2023,
    plate: '11223-C-3',
    vin: 'VF3CDEFG345678901',
    category: 'A',
    fuel: 'Gasoline',
    transmission: 'Manual',
    color: '#2ecc71',
    status: 'Active',
    mileage: 12400,
    last_maintenance: '2025-03-01',
    next_maintenance: '2025-09-01',
    insurance_expiry: '2026-01-31',
    insurance_provider: 'CNIA Saada',
    insurance_policy: 'CNIA-2026-078',
    technical_inspection: '2025-11-10',
    registration_expiry: '2026-01-15',
    assigned_instructor: 'Youssef Kadiri',
    sessions_count: 67,
    purchase_price: 85000,
    current_value: 75000,
    fuel_efficiency: 4.2,
    notes: 'Motorcycle category A',
    images: [],
    documents: [],
    maintenance_history: [],
    incidents: [],
  },
  {
    id: 4,
    brand: 'Mercedes',
    model: 'Actros',
    year: 2020,
    plate: '44556-D-4',
    vin: 'VF4DEFGH456789012',
    category: 'C',
    fuel: 'Diesel',
    transmission: 'Manual',
    color: '#95a5a6',
    status: 'Maintenance',
    mileage: 98000,
    last_maintenance: '2025-04-01',
    next_maintenance: '2025-04-30',
    insurance_expiry: '2025-09-15',
    insurance_provider: 'Alliance Assurance',
    insurance_policy: 'ALL-2025-112',
    technical_inspection: '2025-08-05',
    registration_expiry: '2025-09-20',
    assigned_instructor: 'Hassan Boulal',
    sessions_count: 89,
    purchase_price: 450000,
    current_value: 320000,
    fuel_efficiency: 18.5,
    notes: 'Heavy vehicle, scheduled oil change',
    images: [],
    documents: [],
    maintenance_history: [],
    incidents: [],
  },
  {
    id: 5,
    brand: 'Peugeot',
    model: '208',
    year: 2023,
    plate: '99887-E-5',
    vin: 'VF5EFGHI567890123',
    category: 'B',
    fuel: 'Electric',
    transmission: 'Automatic',
    color: '#9b59b6',
    status: 'Active',
    mileage: 8900,
    last_maintenance: '2025-03-20',
    next_maintenance: '2025-09-20',
    insurance_expiry: '2026-03-31',
    insurance_provider: 'Sanad Assurance',
    insurance_policy: 'SAN-2026-089',
    technical_inspection: '2025-12-01',
    registration_expiry: '2026-02-28',
    assigned_instructor: 'Fatima Zahra',
    sessions_count: 44,
    purchase_price: 210000,
    current_value: 195000,
    fuel_efficiency: 0,
    notes: 'Electric vehicle for eco-driving sessions',
    images: [],
    documents: [],
    maintenance_history: [],
    incidents: [],
  },
  {
    id: 6,
    brand: 'Toyota',
    model: 'Hilux',
    year: 2019,
    plate: '33445-F-6',
    vin: 'VF6FGHIJ678901234',
    category: 'BE',
    fuel: 'Diesel',
    transmission: 'Manual',
    color: '#e67e22',
    status: 'Inactive',
    mileage: 145000,
    last_maintenance: '2024-11-10',
    next_maintenance: '2025-05-10',
    insurance_expiry: '2025-06-30',
    insurance_provider: 'AXA Assurance',
    insurance_policy: 'AXA-2024-567',
    technical_inspection: '2024-12-15',
    registration_expiry: '2025-05-20',
    assigned_instructor: 'N/A',
    sessions_count: 312,
    purchase_price: 280000,
    current_value: 150000,
    fuel_efficiency: 12.5,
    notes: 'Awaiting renewal of registration',
    images: [],
    documents: [],
    maintenance_history: [],
    incidents: [],
  },
];

const EMPTY_FORM = {
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  plate: '',
  vin: '',
  category: 'B',
  fuel: 'Gasoline',
  transmission: 'Manual',
  color: '#8cff2e',
  status: 'Active',
  mileage: '',
  last_maintenance: '',
  next_maintenance: '',
  insurance_expiry: '',
  insurance_provider: '',
  insurance_policy: '',
  technical_inspection: '',
  registration_expiry: '',
  assigned_instructor: '',
  purchase_price: '',
  current_value: '',
  fuel_efficiency: '',
  notes: '',
};

/* ─────────────── Sub-components ─────────────── */

const StatusBadge = ({ status }) => {
  const map = {
    Active: { icon: CheckCircle, cls: 'active' },
    Maintenance: { icon: Wrench, cls: 'maintenance' },
    Inactive: { icon: AlertCircle, cls: 'inactive' },
    'Out of Service': { icon: AlertTriangle, cls: 'inactive' },
  };
  const { icon: Icon, cls } = map[status] || map['Active'];
  return (
    <span className={`status-badge status-${cls}`}>
      <Icon size={12} /> {status}
    </span>
  );
};

const SortIcon = ({ field, sortField, sortDir }) => {
  if (sortField !== field) return <ChevronDown size={13} style={{ opacity: 0.3 }} />;
  return sortDir === 'asc' ? (
    <ChevronUp size={13} className="sort-icon-active" />
  ) : (
    <ChevronDown size={13} className="sort-icon-active" />
  );
};

/* ── Maintenance Record Modal ── */
const MaintenanceModal = ({ vehicle, onClose, onSave }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: MAINTENANCE_TYPES[0],
    mileage: vehicle?.mileage || 0,
    cost: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.date) e.date = 'Date is required';
    if (!form.type) e.type = 'Maintenance type is required';
    if (!form.mileage || form.mileage < 0) e.mileage = 'Valid mileage is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSave({ ...form, id: Date.now() });
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="maintenance-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <Wrench size={22} color="#8cff2e" />
            </div>
            <div>
              <h2>Record Maintenance</h2>
              <p>
                Add maintenance record for {vehicle?.brand} {vehicle?.model}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label>Maintenance Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                className={errors.date ? 'error' : ''}
              />
              {errors.date && <span className="error-msg">{errors.date}</span>}
            </div>
            <div className="form-field">
              <label>Maintenance Type *</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                {MAINTENANCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Mileage at Service (km) *</label>
              <input
                type="number"
                value={form.mileage}
                onChange={(e) => set('mileage', parseInt(e.target.value) || 0)}
                className={errors.mileage ? 'error' : ''}
              />
              {errors.mileage && <span className="error-msg">{errors.mileage}</span>}
            </div>
            <div className="form-field">
              <label>Cost (MAD)</label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => set('cost', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-field full-width">
            <label>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes about the maintenance..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            <CheckCircle size={15} /> Add Record
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Document Upload Modal ── */
const DocumentModal = ({ vehicle, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    type: 'Insurance',
    expiry_date: '',
    file: null,
  });
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      set('file', e.target.files[0]);
      if (!form.name) set('name', e.target.files[0].name);
    }
  };

  const handleSubmit = () => {
    if (form.name && form.type) {
      onSave({
        ...form,
        id: Date.now(),
        upload_date: new Date().toISOString().split('T')[0],
        file_name: form.file?.name || 'document.pdf',
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="document-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <FileText size={22} color="#8cff2e" />
            </div>
            <div>
              <h2>Upload Document</h2>
              <p>
                Add document for {vehicle?.brand} {vehicle?.model}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label>Document Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g., Insurance Certificate 2025"
              />
            </div>
            <div className="form-field">
              <label>Document Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="Insurance">Insurance</option>
                <option value="Registration">Registration</option>
                <option value="Technical Inspection">Technical Inspection</option>
                <option value="Maintenance">Maintenance Record</option>
                <option value="Purchase">Purchase Document</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Expiry Date (if applicable)</label>
              <input
                type="date"
                value={form.expiry_date}
                onChange={(e) => set('expiry_date', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Upload File</label>
              <div className="file-upload-area" onClick={() => fileInputRef.current?.click()}>
                <Upload size={24} />
                <p>Click to upload or drag and drop</p>
                <small>PDF, JPG, PNG (max 5MB)</small>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                />
              </div>
              {form.file && <span className="file-name">Selected: {form.file.name}</span>}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            <Upload size={15} /> Upload Document
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Incident Report Modal ── */
const IncidentModal = ({ vehicle, onClose, onSave }) => {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'Accident',
    description: '',
    cost: '',
    reported_by: '',
    resolved: false,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (form.description) {
      onSave({ ...form, id: Date.now() });
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="incident-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <AlertTriangle size={22} color="#e74c3c" />
            </div>
            <div>
              <h2>Report Incident</h2>
              <p>
                Record incident for {vehicle?.brand} {vehicle?.model}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="form-row">
            <div className="form-field">
              <label>Incident Date</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <div className="form-field">
              <label>Incident Type</label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}>
                <option value="Accident">Accident</option>
                <option value="Damage">Damage</option>
                <option value="Traffic Violation">Traffic Violation</option>
                <option value="Theft">Theft</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Reported By</label>
              <input
                type="text"
                value={form.reported_by}
                onChange={(e) => set('reported_by', e.target.value)}
                placeholder="Name of person reporting"
              />
            </div>
            <div className="form-field">
              <label>Estimated Cost (MAD)</label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => set('cost', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
          <div className="form-field full-width">
            <label>Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={4}
              placeholder="Detailed description of the incident..."
            />
          </div>
          <div className="form-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={form.resolved}
                onChange={(e) => set('resolved', e.target.checked)}
              />
              <span>Mark as Resolved</span>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            <AlertTriangle size={15} /> Report Incident
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Vehicle Card (Enhanced) ── */
const VehicleCard = ({
  vehicle,
  onEdit,
  onDelete,
  onView,
  onMaintenance,
  onDocument,
  onIncident,
}) => {
  const daysToMaintenance = vehicle.next_maintenance
    ? Math.ceil((new Date(vehicle.next_maintenance) - new Date()) / 86400000)
    : null;
  const daysToInsurance = vehicle.insurance_expiry
    ? Math.ceil((new Date(vehicle.insurance_expiry) - new Date()) / 86400000)
    : null;

  return (
    <div className="vehicle-card">
      <div className="vehicle-card-header" style={{ borderTopColor: vehicle.color }}>
        <div className="vehicle-icon-wrap" style={{ background: `${vehicle.color}18` }}>
          <Car size={32} style={{ color: vehicle.color }} />
        </div>
        <div className="vehicle-status-wrap">
          <StatusBadge status={vehicle.status} />
        </div>
        <div className="vehicle-category-badge">Cat. {vehicle.category}</div>
      </div>

      <div className="vehicle-card-body">
        <h3 className="vehicle-name">
          {vehicle.brand} {vehicle.model}
        </h3>
        <p className="vehicle-plate">
          <Hash size={13} /> {vehicle.plate}
        </p>

        <div className="vehicle-meta-grid">
          <div className="meta-item">
            <Calendar size={13} />
            <span>{vehicle.year}</span>
          </div>
          <div className="meta-item">
            <Fuel size={13} />
            <span>{vehicle.fuel}</span>
          </div>
          <div className="meta-item">
            <Gauge size={13} />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
          <div className="meta-item">
            <Shield size={13} />
            <span>{vehicle.insurance_expiry}</span>
          </div>
        </div>

        {(daysToMaintenance !== null || daysToInsurance !== null) && (
          <div className="vehicle-alerts">
            {daysToMaintenance !== null && (
              <div className={`maintenance-alert ${daysToMaintenance <= 30 ? 'urgent' : 'normal'}`}>
                <Wrench size={12} />
                <span>
                  {daysToMaintenance <= 0
                    ? 'Maintenance overdue!'
                    : `Service in ${daysToMaintenance} days`}
                </span>
              </div>
            )}
            {daysToInsurance !== null && daysToInsurance <= 60 && (
              <div className={`insurance-alert ${daysToInsurance <= 30 ? 'urgent' : 'warning'}`}>
                <Shield size={12} />
                <span>Insurance expires in {daysToInsurance} days</span>
              </div>
            )}
          </div>
        )}

        <div className="vehicle-instructor">
          <span className="instructor-label">Instructor</span>
          <span className="instructor-name">{vehicle.assigned_instructor || '—'}</span>
        </div>

        <div className="sessions-count">
          <span>{vehicle.sessions_count}</span>
          <span className="sessions-label">sessions completed</span>
        </div>
      </div>

      <div className="vehicle-card-actions">
        <button
          className="action-btn view-btn"
          onClick={() => onView(vehicle)}
          title="View Details"
        >
          <Eye size={14} />
        </button>
        <button
          className="action-btn edit-btn"
          onClick={() => onEdit(vehicle)}
          title="Edit Vehicle"
        >
          <Pencil size={14} />
        </button>
        <button
          className="action-btn maintenance-btn"
          onClick={() => onMaintenance(vehicle)}
          title="Add Maintenance"
        >
          <Wrench size={14} />
        </button>
        <button
          className="action-btn document-btn"
          onClick={() => onDocument(vehicle)}
          title="Upload Document"
        >
          <FileText size={14} />
        </button>
        <button
          className="action-btn incident-btn"
          onClick={() => onIncident(vehicle)}
          title="Report Incident"
        >
          <AlertTriangle size={14} />
        </button>
        <button
          className="action-btn delete-btn"
          onClick={() => onDelete(vehicle)}
          title="Delete Vehicle"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

/* ── Vehicle Modal (Add / Edit) ── */
const VehicleModal = ({ vehicle, onClose, onSave }) => {
  const [form, setForm] = useState(vehicle ? { ...vehicle } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.model.trim()) e.model = 'Model is required';
    if (!form.plate.trim()) e.plate = 'Plate number is required';
    if (!form.year || form.year < 1990 || form.year > new Date().getFullYear() + 1)
      e.year = 'Enter a valid year';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="vehicle-modal">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon">
              <Car size={22} color="#8cff2e" />
            </div>
            <div>
              <h2>{vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h2>
              <p>
                {vehicle ? 'Update vehicle information' : 'Register a new vehicle in the fleet'}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Basic Info */}
          <div className="form-section">
            <h4 className="section-title">
              <Car size={14} /> Vehicle Information
            </h4>
            <div className="form-row">
              <div className="form-field">
                <label>Brand *</label>
                <input
                  type="text"
                  placeholder="e.g. Dacia, Renault"
                  value={form.brand}
                  onChange={(e) => set('brand', e.target.value)}
                  className={errors.brand ? 'error' : ''}
                />
                {errors.brand && <span className="error-msg">{errors.brand}</span>}
              </div>
              <div className="form-field">
                <label>Model *</label>
                <input
                  type="text"
                  placeholder="e.g. Sandero, Clio"
                  value={form.model}
                  onChange={(e) => set('model', e.target.value)}
                  className={errors.model ? 'error' : ''}
                />
                {errors.model && <span className="error-msg">{errors.model}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Year *</label>
                <input
                  type="number"
                  placeholder="2023"
                  value={form.year}
                  onChange={(e) => set('year', parseInt(e.target.value))}
                  className={errors.year ? 'error' : ''}
                />
                {errors.year && <span className="error-msg">{errors.year}</span>}
              </div>
              <div className="form-field">
                <label>Plate Number *</label>
                <input
                  type="text"
                  placeholder="e.g. 12345-A-1"
                  value={form.plate}
                  onChange={(e) => set('plate', e.target.value)}
                  className={errors.plate ? 'error' : ''}
                />
                {errors.plate && <span className="error-msg">{errors.plate}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>VIN (Chassis Number)</label>
                <input
                  type="text"
                  placeholder="Vehicle Identification Number"
                  value={form.vin}
                  onChange={(e) => set('vin', e.target.value)}
                />
              </div>
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
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Fuel Type</label>
                <select value={form.fuel} onChange={(e) => set('fuel', e.target.value)}>
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Transmission</label>
                <select
                  value={form.transmission}
                  onChange={(e) => set('transmission', e.target.value)}
                >
                  {TRANSMISSIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Color</label>
                <div className="color-input-wrap">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => set('color', e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-value">{form.color}</span>
                </div>
              </div>
              <div className="form-field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value)}>
                  {VEHICLE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Current Mileage (km)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.mileage}
                  onChange={(e) => set('mileage', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="form-field">
                <label>Assigned Instructor</label>
                <input
                  type="text"
                  placeholder="Instructor name"
                  value={form.assigned_instructor}
                  onChange={(e) => set('assigned_instructor', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="form-section">
            <h4 className="section-title">
              <DollarSign size={14} /> Financial Information
            </h4>
            <div className="form-row">
              <div className="form-field">
                <label>Purchase Price (MAD)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.purchase_price}
                  onChange={(e) => set('purchase_price', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="form-field">
                <label>Current Value (MAD)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.current_value}
                  onChange={(e) => set('current_value', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="form-field">
                <label>Fuel Efficiency (L/100km)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={form.fuel_efficiency}
                  onChange={(e) => set('fuel_efficiency', parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Maintenance & Insurance */}
          <div className="form-section">
            <h4 className="section-title">
              <Wrench size={14} /> Maintenance & Insurance
            </h4>
            <div className="form-row">
              <div className="form-field">
                <label>Last Maintenance Date</label>
                <input
                  type="date"
                  value={form.last_maintenance}
                  onChange={(e) => set('last_maintenance', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Next Maintenance Date</label>
                <input
                  type="date"
                  value={form.next_maintenance}
                  onChange={(e) => set('next_maintenance', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Insurance Provider</label>
                <input
                  type="text"
                  placeholder="Insurance company"
                  value={form.insurance_provider}
                  onChange={(e) => set('insurance_provider', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Insurance Policy Number</label>
                <input
                  type="text"
                  placeholder="Policy number"
                  value={form.insurance_policy}
                  onChange={(e) => set('insurance_policy', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Insurance Expiry Date</label>
                <input
                  type="date"
                  value={form.insurance_expiry}
                  onChange={(e) => set('insurance_expiry', e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Technical Inspection Date</label>
                <input
                  type="date"
                  value={form.technical_inspection}
                  onChange={(e) => set('technical_inspection', e.target.value)}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Registration Expiry Date</label>
                <input
                  type="date"
                  value={form.registration_expiry}
                  onChange={(e) => set('registration_expiry', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="form-section">
            <h4 className="section-title">
              <FileText size={14} /> Additional Notes
            </h4>
            <div className="form-field full-width">
              <textarea
                placeholder="Additional notes about this vehicle..."
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
            {vehicle ? 'Save Changes' : 'Add Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Vehicle Detail Modal (Enhanced) ── */
const VehicleDetail = ({
  vehicle,
  onClose,
  onEdit,
  onDelete,
  onAddMaintenance,
  onAddDocument,
  onAddIncident,
}) => {
  const [activeTab, setActiveTab] = useState('details');
  const daysToMaint = vehicle.next_maintenance
    ? Math.ceil((new Date(vehicle.next_maintenance) - new Date()) / 86400000)
    : null;
  const daysToInsurance = vehicle.insurance_expiry
    ? Math.ceil((new Date(vehicle.insurance_expiry) - new Date()) / 86400000)
    : null;

  const maintenanceHistory = vehicle.maintenance_history || [];
  const documents = vehicle.documents || [];
  const incidents = vehicle.incidents || [];

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="vehicle-detail-modal large">
        <div className="detail-header" style={{ borderTopColor: vehicle.color }}>
          <div className="detail-vehicle-icon" style={{ background: `${vehicle.color}20` }}>
            <Car size={48} style={{ color: vehicle.color }} />
          </div>
          <div className="detail-vehicle-info">
            <h2>
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="detail-plate">
              <Hash size={14} /> {vehicle.plate}
            </p>
            <StatusBadge status={vehicle.status} />
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="detail-tabs">
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Car size={14} /> Details
          </button>
          <button
            className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <Wrench size={14} /> Maintenance ({maintenanceHistory.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <FileText size={14} /> Documents ({documents.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={() => setActiveTab('incidents')}
          >
            <AlertTriangle size={14} /> Incidents ({incidents.length})
          </button>
        </div>

        <div className="detail-body">
          {activeTab === 'details' && (
            <>
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>
                    <Car size={14} /> Vehicle Specifications
                  </h4>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span>Brand/Model</span>
                      <strong>
                        {vehicle.brand} {vehicle.model}
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Year</span>
                      <strong>{vehicle.year}</strong>
                    </div>
                    <div className="detail-row">
                      <span>VIN</span>
                      <strong className="mono">{vehicle.vin || '—'}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Category</span>
                      <strong>
                        <span className="category-badge">{vehicle.category}</span>
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Fuel Type</span>
                      <strong>{vehicle.fuel}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Transmission</span>
                      <strong>{vehicle.transmission}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Color</span>
                      <strong>
                        <span className="color-dot" style={{ background: vehicle.color }}></span>{' '}
                        {vehicle.color}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>
                    <Gauge size={14} /> Usage & Performance
                  </h4>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span>Current Mileage</span>
                      <strong>{vehicle.mileage.toLocaleString()} km</strong>
                    </div>
                    <div className="detail-row">
                      <span>Total Sessions</span>
                      <strong>{vehicle.sessions_count}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Fuel Efficiency</span>
                      <strong>
                        {vehicle.fuel_efficiency ? `${vehicle.fuel_efficiency} L/100km` : '—'}
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Assigned Instructor</span>
                      <strong>{vehicle.assigned_instructor || '—'}</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>
                    <DollarSign size={14} /> Financial
                  </h4>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span>Purchase Price</span>
                      <strong>
                        {vehicle.purchase_price
                          ? `${vehicle.purchase_price.toLocaleString()} MAD`
                          : '—'}
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Current Value</span>
                      <strong>
                        {vehicle.current_value
                          ? `${vehicle.current_value.toLocaleString()} MAD`
                          : '—'}
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Depreciation</span>
                      <strong>
                        {vehicle.purchase_price && vehicle.current_value
                          ? `${Math.round((1 - vehicle.current_value / vehicle.purchase_price) * 100)}%`
                          : '—'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>
                    <Shield size={14} /> Insurance & Compliance
                  </h4>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span>Insurance Provider</span>
                      <strong>{vehicle.insurance_provider || '—'}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Policy Number</span>
                      <strong>{vehicle.insurance_policy || '—'}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Insurance Expiry</span>
                      <strong
                        className={
                          daysToInsurance !== null && daysToInsurance <= 60 ? 'text-warning' : ''
                        }
                      >
                        {vehicle.insurance_expiry || '—'}{' '}
                        {daysToInsurance !== null &&
                          daysToInsurance <= 60 &&
                          `(${daysToInsurance}d left)`}
                      </strong>
                    </div>
                    <div className="detail-row">
                      <span>Technical Inspection</span>
                      <strong>{vehicle.technical_inspection || '—'}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Registration Expiry</span>
                      <strong>{vehicle.registration_expiry || '—'}</strong>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>
                    <Wrench size={14} /> Maintenance Schedule
                  </h4>
                  <div className="detail-rows">
                    <div className="detail-row">
                      <span>Last Maintenance</span>
                      <strong>{vehicle.last_maintenance || '—'}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Next Maintenance</span>
                      <strong
                        className={daysToMaint !== null && daysToMaint <= 30 ? 'text-warning' : ''}
                      >
                        {vehicle.next_maintenance || '—'}{' '}
                        {daysToMaint !== null &&
                          (daysToMaint <= 0
                            ? '(Overdue!)'
                            : daysToMaint <= 30
                              ? `(${daysToMaint}d)`
                              : '')}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {vehicle.notes && (
                <div className="detail-notes">
                  <h4>
                    <FileText size={14} /> Notes
                  </h4>
                  <p>{vehicle.notes}</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'maintenance' && (
            <div className="maintenance-list">
              <div className="section-header">
                <h4>Maintenance History</h4>
                <button className="btn-add-small" onClick={() => onAddMaintenance(vehicle)}>
                  <Plus size={14} /> Add Record
                </button>
              </div>
              {maintenanceHistory.length === 0 ? (
                <div className="empty-state-small">No maintenance records yet</div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Mileage</th>
                      <th>Cost</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceHistory.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td>{record.type}</td>
                        <td>{record.mileage.toLocaleString()} km</td>
                        <td>{record.cost ? `${record.cost.toLocaleString()} MAD` : '—'}</td>
                        <td>{record.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="documents-list">
              <div className="section-header">
                <h4>Documents</h4>
                <button className="btn-add-small" onClick={() => onAddDocument(vehicle)}>
                  <Plus size={14} /> Upload Document
                </button>
              </div>
              {documents.length === 0 ? (
                <div className="empty-state-small">No documents uploaded yet</div>
              ) : (
                <div className="documents-grid">
                  {documents.map((doc) => (
                    <div key={doc.id} className="document-item">
                      <File size={32} />
                      <div className="document-info">
                        <div className="document-name">{doc.name}</div>
                        <div className="document-meta">
                          {doc.type} • Uploaded: {doc.upload_date}
                        </div>
                        {doc.expiry_date && (
                          <div className="document-expiry">Expires: {doc.expiry_date}</div>
                        )}
                      </div>
                      <button className="document-download">
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'incidents' && (
            <div className="incidents-list">
              <div className="section-header">
                <h4>Incident Reports</h4>
                <button className="btn-add-small" onClick={() => onAddIncident(vehicle)}>
                  <Plus size={14} /> Report Incident
                </button>
              </div>
              {incidents.length === 0 ? (
                <div className="empty-state-small">No incidents reported</div>
              ) : (
                incidents.map((incident) => (
                  <div
                    key={incident.id}
                    className={`incident-item ${incident.resolved ? 'resolved' : 'open'}`}
                  >
                    <AlertTriangle size={20} />
                    <div className="incident-info">
                      <div className="incident-header">
                        <span className="incident-type">{incident.type}</span>
                        <span className="incident-date">{incident.date}</span>
                      </div>
                      <div className="incident-description">{incident.description}</div>
                      <div className="incident-meta">
                        {incident.reported_by && <span>Reported by: {incident.reported_by}</span>}
                        {incident.cost && <span>Cost: {incident.cost.toLocaleString()} MAD</span>}
                        <span className={`incident-status ${incident.resolved ? 'resolved' : ''}`}>
                          {incident.resolved ? 'Resolved' : 'Open'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={() => onDelete(vehicle)}>
            <Trash2 size={14} /> Delete
          </button>
          <button className="btn-save" onClick={() => onEdit(vehicle)}>
            <Pencil size={14} /> Edit Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Delete Confirm ── */
const DeleteConfirm = ({ vehicle, onConfirm, onCancel }) => (
  <div className="modal-overlay">
    <div className="delete-confirm-modal">
      <div className="delete-icon">
        <Trash2 size={26} />
      </div>
      <h3>Delete Vehicle?</h3>
      <p>
        Are you sure you want to remove{' '}
        <strong>
          {vehicle.brand} {vehicle.model}
        </strong>{' '}
        ({vehicle.plate}) from the fleet? This action cannot be undone.
      </p>
      <div className="delete-actions">
        <button className="btn-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn-delete" onClick={onConfirm}>
          Delete Vehicle
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

/* ─────────────── Main Component ─────────────── */
const Vehicles = () => {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField] = useState('brand');
  const [sortDir, setSortDir] = useState('asc');
  const [viewMode, setViewMode] = useState('cards');
  const [modal, setModal] = useState(null);
  const [editVehicle, setEditVehicle] = useState(null);
  const [detailVehicle, setDetailVehicle] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [maintenanceTarget, setMaintenanceTarget] = useState(null);
  const [documentTarget, setDocumentTarget] = useState(null);
  const [incidentTarget, setIncidentTarget] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── KPIs ── */
  const kpis = useMemo(() => {
    const active = vehicles.filter((v) => v.status === 'Active').length;
    const maintenance = vehicles.filter((v) => v.status === 'Maintenance').length;
    const inactive = vehicles.filter((v) => v.status === 'Inactive').length;
    const totalMileage = vehicles.reduce((s, v) => s + v.mileage, 0);
    const totalValue = vehicles.reduce((s, v) => s + (v.current_value || 0), 0);
    return { total: vehicles.length, active, maintenance, inactive, totalMileage, totalValue };
  }, [vehicles]);

  /* ── Filter + Sort ── */
  const filtered = useMemo(() => {
    let list = [...vehicles];
    if (search)
      list = list.filter(
        (v) =>
          `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase()) ||
          v.plate.toLowerCase().includes(search.toLowerCase()) ||
          v.assigned_instructor.toLowerCase().includes(search.toLowerCase()),
      );
    if (filterCategory !== 'All') list = list.filter((v) => v.category === filterCategory);
    if (filterStatus !== 'All') list = list.filter((v) => v.status === filterStatus);
    list.sort((a, b) => {
      const va = a[sortField] ?? '';
      const vb = b[sortField] ?? '';
      return sortDir === 'asc' ? (va < vb ? -1 : 1) : va > vb ? -1 : 1;
    });
    return list;
  }, [vehicles, search, filterCategory, filterStatus, sortField, sortDir]);

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
      const newV = {
        ...form,
        id: Date.now(),
        sessions_count: 0,
        maintenance_history: [],
        documents: [],
        incidents: [],
      };
      setVehicles((v) => [newV, ...v]);
      showToast('Vehicle added successfully');
    } else {
      setVehicles((v) => v.map((x) => (x.id === form.id ? { ...x, ...form } : x)));
      showToast('Vehicle updated successfully');
    }
    setModal(null);
    setEditVehicle(null);
  };

  const handleDelete = (id) => {
    setVehicles((v) => v.filter((x) => x.id !== id));
    setDeleteTarget(null);
    setDetailVehicle(null);
    showToast('Vehicle removed from fleet');
  };

  const handleAddMaintenance = (vehicle, record) => {
    setVehicles((v) =>
      v.map((x) => {
        if (x.id === vehicle.id) {
          const history = [...(x.maintenance_history || []), record];
          return {
            ...x,
            maintenance_history: history,
            last_maintenance: record.date,
            next_maintenance: '',
          };
        }
        return x;
      }),
    );
    setMaintenanceTarget(null);
    showToast('Maintenance record added');
  };

  const handleAddDocument = (vehicle, doc) => {
    setVehicles((v) =>
      v.map((x) => {
        if (x.id === vehicle.id) {
          return { ...x, documents: [...(x.documents || []), doc] };
        }
        return x;
      }),
    );
    setDocumentTarget(null);
    showToast('Document uploaded');
  };

  const handleAddIncident = (vehicle, incident) => {
    setVehicles((v) =>
      v.map((x) => {
        if (x.id === vehicle.id) {
          return { ...x, incidents: [...(x.incidents || []), incident] };
        }
        return x;
      }),
    );
    setIncidentTarget(null);
    showToast('Incident reported');
  };

  return (
    <div className="vehicles-page">
      <Toast toast={toast} />

      <div className="dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <h1>Fleet Management</h1>
            <p>Manage your driving school vehicles, maintenance, insurance, and documents</p>
          </div>
          <div className="fleet-summary-card">
            <div className="fleet-stat">
              <span className="stat-num">{kpis.active}</span>
              <span className="stat-lbl">Active</span>
            </div>
            <div className="fleet-divider" />
            <div className="fleet-stat">
              <span className="stat-num warn">{kpis.maintenance}</span>
              <span className="stat-lbl">Maintenance</span>
            </div>
            <div className="fleet-divider" />
            <div className="fleet-stat">
              <span className="stat-num muted">{kpis.inactive}</span>
              <span className="stat-lbl">Inactive</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="kpi-grid">
        {[
          { label: 'Total Vehicles', value: kpis.total, IconComp: Truck, trend: 'fleet size' },
          {
            label: 'Active Fleet',
            value: kpis.active,
            IconComp: CheckCircle,
            trend: 'operational',
          },
          {
            label: 'In Maintenance',
            value: kpis.maintenance,
            IconComp: Wrench,
            trend: 'scheduled',
          },
          {
            label: 'Total Mileage',
            value: `${(kpis.totalMileage / 1000).toFixed(1)}k km`,
            IconComp: Gauge,
            trend: 'cumulative',
          },
          {
            label: 'Fleet Value',
            value: `${(kpis.totalValue / 1000).toFixed(0)}k MAD`,
            IconComp: DollarSign,
            trend: 'estimated',
          },
        ].map((item) => {
          const IconElement = item.IconComp;
          return (
            <div className="kpi-card" key={item.label}>
              <div className="kpi-icon">
                <IconElement size={24} />
              </div>
              <div className="kpi-info">
                <div className="kpi-value">{item.value}</div>
                <div className="kpi-label">{item.label}</div>
                <span className="kpi-trend trend-neutral">{item.trend}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="view-toggle">
        <button
          className={viewMode === 'cards' ? 'active' : ''}
          onClick={() => setViewMode('cards')}
        >
          <Grid size={15} /> Cards
        </button>
        <button
          className={viewMode === 'table' ? 'active' : ''}
          onClick={() => setViewMode('table')}
        >
          <List size={15} /> Table
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
            placeholder="Search by brand, plate, instructor..."
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
          {VEHICLE_STATUSES.map((s) => (
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
            setEditVehicle(null);
            setModal('add');
          }}
        >
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {viewMode === 'cards' ? (
        <div className="vehicles-cards-grid">
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
              <Car size={48} />
              <p>No vehicles found</p>
            </div>
          ) : (
            filtered.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onEdit={(x) => {
                  setEditVehicle(x);
                  setModal('edit');
                }}
                onDelete={setDeleteTarget}
                onView={setDetailVehicle}
                onMaintenance={(x) => setMaintenanceTarget(x)}
                onDocument={(x) => setDocumentTarget(x)}
                onIncident={(x) => setIncidentTarget(x)}
              />
            ))
          )}
        </div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h3>
              Vehicles{' '}
              <span>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </h3>
          </div>
          <div className="vehicles-table-wrapper">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('brand')}>
                    Vehicle <SortIcon field="brand" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('plate')}>
                    Plate <SortIcon field="plate" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('category')}>
                    Category <SortIcon field="category" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('mileage')}>
                    Mileage <SortIcon field="mileage" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th onClick={() => toggleSort('status')}>
                    Status <SortIcon field="status" sortField={sortField} sortDir={sortDir} />
                  </th>
                  <th>Insurance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty-state">
                      <Car size={32} />
                      <div>No vehicles found</div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((v) => (
                    <tr key={v.id} onClick={() => setDetailVehicle(v)}>
                      <td>
                        <div className="vehicle-info-cell">
                          <div className="vehicle-dot" style={{ background: v.color }} />
                          <div>
                            <div className="vehicle-name-cell">
                              {v.brand} {v.model}
                            </div>
                            <div className="vehicle-year-cell">{v.year}</div>
                          </div>
                        </div>
                      </td>
                      <td className="mono">{v.plate}</td>
                      <td>
                        <span className="category-badge">{v.category}</span>
                      </td>
                      <td>{v.mileage.toLocaleString()} km</td>
                      <td>
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="date-text">{v.insurance_expiry}</td>
                      <td>
                        <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                          <button className="action-btn" onClick={() => setDetailVehicle(v)}>
                            <Eye size={14} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => {
                              setEditVehicle(v);
                              setModal('edit');
                            }}
                          >
                            <Pencil size={14} />
                          </button>
                          <button className="action-btn" onClick={() => setDeleteTarget(v)}>
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
              Showing {filtered.length} out of {vehicles.length} vehicles
            </div>
            <div className="pagination-controls">
              <button className="page-btn active">1</button>
            </div>
          </div>
        </div>
      )}

      {(modal === 'add' || modal === 'edit') && (
        <VehicleModal
          vehicle={modal === 'edit' ? editVehicle : null}
          onClose={() => {
            setModal(null);
            setEditVehicle(null);
          }}
          onSave={handleSave}
        />
      )}
      {detailVehicle && (
        <VehicleDetail
          vehicle={detailVehicle}
          onClose={() => setDetailVehicle(null)}
          onEdit={(v) => {
            setDetailVehicle(null);
            setEditVehicle(v);
            setModal('edit');
          }}
          onDelete={(v) => {
            setDetailVehicle(null);
            setDeleteTarget(v);
          }}
          onAddMaintenance={setMaintenanceTarget}
          onAddDocument={setDocumentTarget}
          onAddIncident={setIncidentTarget}
        />
      )}
      {deleteTarget && (
        <DeleteConfirm
          vehicle={deleteTarget}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {maintenanceTarget && (
        <MaintenanceModal
          vehicle={maintenanceTarget}
          onClose={() => setMaintenanceTarget(null)}
          onSave={(record) => handleAddMaintenance(maintenanceTarget, record)}
        />
      )}
      {documentTarget && (
        <DocumentModal
          vehicle={documentTarget}
          onClose={() => setDocumentTarget(null)}
          onSave={(doc) => handleAddDocument(documentTarget, doc)}
        />
      )}
      {incidentTarget && (
        <IncidentModal
          vehicle={incidentTarget}
          onClose={() => setIncidentTarget(null)}
          onSave={(incident) => handleAddIncident(incidentTarget, incident)}
        />
      )}
    </div>
  );
};

export default Vehicles;
