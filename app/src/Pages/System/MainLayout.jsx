// Pages/System/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../contexts/NotificationContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Car,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  Camera,
  ChevronDown,
  ChartArea,
  CalendarSync,
  CheckCircle,
  AlertCircle,
  Clock,
  UserPlus,
  Calendar as CalendarIcon,
  UserCircle,
  Key,
  Mail,
  Phone,
  Shield,
  Moon,
  Sun,
  Globe,
  BellRing,
  Save,
  XCircle,
  BriefcaseBusiness,
} from 'lucide-react';
import '../../Styles/System/MainLayout.scss';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const { notifications, markAsRead, markAllAsRead, getUnreadCount } = useNotifications();

  const location = useLocation();
  const navigate = useNavigate();

  // User data state
  const [userData, setUserData] = useState({
    id: 1,
    name: 'Alex Johnson',
    email: 'alex.johnson@clario.com',
    role: 'Administrator',
    avatar: null,
    phone: '+212 612 345 678',
    joinDate: '2024-01-15',
    lastLogin: new Date().toLocaleString(),
    preferences: {
      language: 'en',
      notifications: true,
      emailUpdates: true,
    },
  });

  // Form states for profile editing
  const [editProfileForm, setEditProfileForm] = useState({
    name: userData.name,
    email: userData.email,
    phone: userData.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [toast, setToast] = useState(null);

  const menuItems = [
    { path: '/system/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/system/students', icon: <Users size={20} />, label: 'Students' },
    { path: '/system/sessions', icon: <Calendar size={20} />, label: 'Sessions' },
    { path: '/system/calendar', icon: <CalendarSync size={20} />, label: 'Calendar' },
    { path: '/system/vehicles', icon: <Car size={20} />, label: 'Vehicles' },
    { path: '/system/instructors', icon: <BriefcaseBusiness size={20} />, label: 'Instructors' },
    { path: '/system/payments', icon: <CreditCard size={20} />, label: 'Payments' },
    { path: '/system/statistics', icon: <ChartArea size={20} />, label: 'Statistics' },
  ];

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    showToast('Logged out successfully', 'success');
  };

  const unreadCount = getUnreadCount();

  const toggleNotifications = (e) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen && !event.target.closest('.notification-container')) {
        setNotificationsOpen(false);
      }
      if (userMenuOpen && !event.target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [notificationsOpen, userMenuOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'student':
        return <UserPlus size={14} />;
      case 'session':
        return <CalendarIcon size={14} />;
      case 'payment':
        return <CheckCircle size={14} />;
      case 'reminder':
        return <Clock size={14} />;
      default:
        return <Bell size={14} />;
    }
  };

  const formatTime = (time) => {
    const now = new Date();
    const notificationTime = new Date(time);
    const diff = Math.floor((now - notificationTime) / 1000);

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return notificationTime.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    switch (notification.type) {
      case 'student':
        navigate('/system/students');
        break;
      case 'session':
        navigate('/system/sessions');
        break;
      case 'payment':
        navigate('/system/payments');
        break;
      default:
        break;
    }

    setNotificationsOpen(false);
  };

  // Profile Modal Handlers
  const openProfileModal = () => {
    setUserMenuOpen(false);
    setEditProfileForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormErrors({});
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setEditProfileForm({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setFormErrors({});
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!editProfileForm.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!editProfileForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editProfileForm.email)) {
      errors.email = 'Email is invalid';
    }

    if (editProfileForm.newPassword) {
      if (editProfileForm.newPassword.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      if (editProfileForm.newPassword !== editProfileForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!editProfileForm.currentPassword) {
        errors.currentPassword = 'Current password is required to change password';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = () => {
    if (!validateProfileForm()) return;

    // Update user data
    setUserData({
      ...userData,
      name: editProfileForm.name,
      email: editProfileForm.email,
      phone: editProfileForm.phone,
    });

    // Here you would typically make an API call to update user data
    showToast('Profile updated successfully', 'success');
    closeProfileModal();
  };

  // Settings Modal Handlers
  const openSettingsModal = () => {
    setUserMenuOpen(false);
    setSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setSettingsModalOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode to body
    if (!darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    showToast(`${!darkMode ? 'Dark' : 'Light'} mode activated`, 'success');
  };

  const updatePreference = (key, value) => {
    setUserData({
      ...userData,
      preferences: {
        ...userData.preferences,
        [key]: value,
      },
    });
    showToast('Preferences updated', 'success');
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`main-layout ${darkMode ? 'dark-theme' : ''}`}>
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification-main toast-${toast.type}`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg
                onClick={() => setSidebarOpen(!sidebarOpen)}
                xmlns="http://www.w3.org/2000/svg"
                width="41"
                height="23"
                fill="none"
                overflow="visible"
                style={{ cursor: 'pointer' }}
              >
                {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
                <g>
                  <path
                    d="M 21.821 0.929 C 22.354 0.38 23.092 0.068 23.865 0.065 L 33.762 0.065 C 40.198 0.065 43.42 8.011 38.869 12.659 L 28.958 22.783 C 28.503 23.247 27.725 22.918 27.725 22.26 L 27.725 13.345 L 28.87 12.174 C 29.78 11.245 29.136 9.656 27.848 9.656 L 13.276 9.656 L 21.821 0.929 Z"
                    fill="rgb(255, 255, 255)"
                  ></path>
                  <path
                    d="M 19.179 22.071 C 18.646 22.62 17.908 22.932 17.135 22.935 L 7.238 22.935 C 0.802 22.935 -2.42 14.988 2.131 10.341 L 12.042 0.217 C 12.497 -0.247 13.276 0.082 13.276 0.739 L 13.276 9.655 L 12.13 10.825 C 11.22 11.755 11.864 13.344 13.152 13.344 L 27.724 13.344 L 19.178 22.071 Z"
                    fill="rgb(255, 255, 255)"
                  ></path>
                </g>
              </svg>
            </div>
            {sidebarOpen && <span className="logo-text">Clario</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sideBarOpen ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="main-header">
          <div className="header-left">
            <h1>
              {menuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            {/* Notifications Container */}
            <div className="notification-container">
              <button
                className="notification-btn"
                onClick={toggleNotifications}
                aria-label="Notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>

              {notificationsOpen && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="mark-all-read" onClick={markAllAsRead}>
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="notifications-list">
                    {notifications.length === 0 ? (
                      <div className="no-notifications">
                        <Bell size={32} />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${!notification.read ? 'unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="notification-icon">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">{formatTime(notification.time)}</div>
                          </div>
                          {!notification.read && <div className="unread-dot" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu Container */}
            <div className="user-menu-container">
              <div className="user-menu" onClick={toggleUserMenu}>
                <div className="user-avatar">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} />
                  ) : (
                    <User size={20} />
                  )}
                </div>
                <div className="user-info">
                  <span className="user-name">{userData.name}</span>
                  <span className="user-role">{userData.role}</span>
                </div>
                <ChevronDown size={16} />
              </div>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <button onClick={openProfileModal} className="dropdown-item">
                    <UserCircle size={16} />
                    <span>Profile</span>
                  </button>
                  <button onClick={openSettingsModal} className="dropdown-item">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeProfileModal()}
        >
          <div className="profile-modal-container">
            <div className="modal-header">
              <div className="modal-title">
                <div className="title-icon">
                  <UserCircle size={24} color="#8cff2e" />
                </div>
                <div>
                  <h2>Edit Profile</h2>
                  <p>Update your personal information</p>
                </div>
              </div>
              <button onClick={closeProfileModal} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="profile-avatar-section">
                <div className="profile-avatar-large">
                  {userData.avatar ? (
                    <img src={userData.avatar} alt={userData.name} />
                  ) : (
                    <span>{getInitials(userData.name)}</span>
                  )}
                </div>
                <button className="change-avatar-btn">
                  <Camera size={16} />
                  Change Photo
                </button>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <User size={14} />
                  <h4>Personal Information</h4>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={editProfileForm.name}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, name: e.target.value })
                      }
                      className={formErrors.name ? 'error' : ''}
                    />
                    {formErrors.name && <span className="error-message">{formErrors.name}</span>}
                  </div>
                  <div className="form-field">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={editProfileForm.email}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, email: e.target.value })
                      }
                      className={formErrors.email ? 'error' : ''}
                    />
                    {formErrors.email && <span className="error-message">{formErrors.email}</span>}
                  </div>
                  <div className="form-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={editProfileForm.phone}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, phone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <div className="section-header">
                  <Key size={14} />
                  <h4>Change Password</h4>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={editProfileForm.currentPassword}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, currentPassword: e.target.value })
                      }
                      className={formErrors.currentPassword ? 'error' : ''}
                    />
                    {formErrors.currentPassword && (
                      <span className="error-message">{formErrors.currentPassword}</span>
                    )}
                  </div>
                  <div className="form-field">
                    <label>New Password</label>
                    <input
                      type="password"
                      value={editProfileForm.newPassword}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, newPassword: e.target.value })
                      }
                      className={formErrors.newPassword ? 'error' : ''}
                    />
                    {formErrors.newPassword && (
                      <span className="error-message">{formErrors.newPassword}</span>
                    )}
                  </div>
                  <div className="form-field">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={editProfileForm.confirmPassword}
                      onChange={(e) =>
                        setEditProfileForm({ ...editProfileForm, confirmPassword: e.target.value })
                      }
                      className={formErrors.confirmPassword ? 'error' : ''}
                    />
                    {formErrors.confirmPassword && (
                      <span className="error-message">{formErrors.confirmPassword}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <div className="info-item">
                  <Clock size={14} />
                  <span>Member since: {userData.joinDate}</span>
                </div>
                <div className="info-item">
                  <Shield size={14} />
                  <span>Last login: {userData.lastLogin}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={closeProfileModal} className="btn-cancel">
                Cancel
              </button>
              <button onClick={handleProfileUpdate} className="btn-save">
                <Save size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeSettingsModal()}
        >
          <div className="settings-modal-container">
            <div className="modal-header">
              <div className="modal-title">
                <div className="title-icon">
                  <Settings size={24} color="#8cff2e" />
                </div>
                <div>
                  <h2>Settings</h2>
                  <p>Customize your application preferences</p>
                </div>
              </div>
              <button onClick={closeSettingsModal} className="close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="settings-section">
                <div className="section-header">
                  <Sun size={14} />
                  <h4>Appearance</h4>
                </div>
                <div className="settings-option">
                  <div className="option-info">
                    <Moon size={18} />
                    <div>
                      <label>Dark Mode</label>
                      <p>Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-switch ${darkMode ? 'active' : ''}`}
                    onClick={toggleDarkMode}
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <div className="section-header">
                  <BellRing size={14} />
                  <h4>Notifications</h4>
                </div>
                <div className="settings-option">
                  <div className="option-info">
                    <BellRing size={18} />
                    <div>
                      <label>Push Notifications</label>
                      <p>Receive notifications about sessions and updates</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-switch ${userData.preferences.notifications ? 'active' : ''}`}
                    onClick={() =>
                      updatePreference('notifications', !userData.preferences.notifications)
                    }
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
                <div className="settings-option">
                  <div className="option-info">
                    <Mail size={18} />
                    <div>
                      <label>Email Updates</label>
                      <p>Receive weekly summaries and important updates</p>
                    </div>
                  </div>
                  <button
                    className={`toggle-switch ${userData.preferences.emailUpdates ? 'active' : ''}`}
                    onClick={() =>
                      updatePreference('emailUpdates', !userData.preferences.emailUpdates)
                    }
                  >
                    <span className="toggle-slider"></span>
                  </button>
                </div>
              </div>

              <div className="settings-section">
                <div className="section-header">
                  <Globe size={14} />
                  <h4>Language & Region</h4>
                </div>
                <div className="settings-option">
                  <div className="option-info">
                    <Globe size={18} />
                    <div>
                      <label>Language</label>
                      <p>Choose your preferred language</p>
                    </div>
                  </div>
                  <select
                    className="settings-select"
                    value={userData.preferences.language}
                    onChange={(e) => updatePreference('language', e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={closeSettingsModal} className="btn-save">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
