// Contexts/NotificationContext.jsx
import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Welcome to Clario',
      message: 'Your driving school management system is ready',
      time: new Date().toISOString(),
      read: false,
      type: 'system',
    },
  ]);

  const addNotification = (title, message, type = 'system') => {
    const newNotification = {
      id: Date.now(),
      title,
      message,
      time: new Date().toISOString(),
      read: false,
      type,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    // Optional: Show toast notification
    return newNotification;
  };

  const markAsRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
