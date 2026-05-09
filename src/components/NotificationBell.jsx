import React, { useState, useEffect, useRef } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const dropdownRef = useRef(null);
  const prevUnreadCount = useRef(unreadCount);

  
  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationStyle = (type) => {
    switch(type) {
      case 'task_assigned':
        return { 
          backgroundColor: 'rgba(255, 140, 66, 0.15)', 
          borderLeft: `4px solid ${theme.primary}`,
        };
      case 'task_completed':
        return { 
          backgroundColor: 'rgba(46, 204, 113, 0.15)', 
          borderLeft: `4px solid ${theme.success}`,
        };
      default:
        return {};
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const styles = {
    bellContainer: {
      position: 'relative',
      cursor: 'pointer',
      marginRight: '1rem',
    },
    bellIcon: {
      fontSize: '1.6rem',
      color: theme.text,
      transition: 'transform 0.2s, color 0.2s',
      animation: shake ? 'shake 0.4s ease' : 'none',
      display: 'inline-block',
    },
    badge: {
      position: 'absolute',
      top: '-10px',
      right: '-14px',
      backgroundColor: theme.danger,
      color: 'white',
      borderRadius: '50%',
      padding: '2px 7px',
      fontSize: '0.7rem',
      fontWeight: 'bold',
      boxShadow: '0 0 5px rgba(231,76,60,0.5)',
      animation: 'pulse 1s infinite',
    },
    dropdown: {
      position: 'absolute',
      top: '45px',
      right: '0',
      width: '380px',
      maxHeight: '450px',
      overflowY: 'auto',
      backgroundColor: theme.cardBg,
      backdropFilter: 'blur(12px)',
      borderRadius: '16px',
      boxShadow: theme.shadow,
      border: `1px solid ${theme.border}`,
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-out',
    },
    header: {
      padding: '1rem 1.2rem',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderRadius: '16px 16px 0 0',
    },
    headerTitle: {
      fontWeight: 'bold',
      color: theme.text,
      fontSize: '1rem',
    },
    markAllButton: {
      fontSize: '0.75rem',
      color: theme.primary,
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      transition: 'color 0.2s',
    },
    notificationItem: {
      padding: '1rem 1.2rem',
      borderBottom: `1px solid ${theme.border}`,
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    notificationMessage: {
      fontSize: '0.9rem',
      color: theme.text,
      marginBottom: '0.35rem',
      lineHeight: '1.4',
    },
    notificationTime: {
      fontSize: '0.7rem',
      color: theme.textMuted,
    },
    emptyMessage: {
      padding: '2rem',
      textAlign: 'center',
      color: theme.textMuted,
      fontSize: '0.9rem',
    },
  };

  return (
    <div style={styles.bellContainer} ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={e => {
          e.currentTarget.querySelector('span').style.transform = 'scale(1.1)';
          e.currentTarget.querySelector('span').style.color = theme.primary;
        }}
        onMouseLeave={e => {
          e.currentTarget.querySelector('span').style.transform = 'scale(1)';
          e.currentTarget.querySelector('span').style.color = theme.text;
        }}
      >
        <span style={styles.bellIcon}>🔔</span>
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </div>
      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <span style={styles.headerTitle}>🔔 Notifications</span>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead} 
                style={styles.markAllButton}
                onMouseEnter={e => e.currentTarget.style.color = theme.secondary}
                onMouseLeave={e => e.currentTarget.style.color = theme.primary}
              >
                Mark all as read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div style={styles.emptyMessage}>📭 No notifications yet</div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif._id}
                style={{
                  ...styles.notificationItem,
                  ...getNotificationStyle(notif.type),
                  opacity: notif.read ? 0.7 : 1,
                }}
                onClick={() => markAsRead(notif._id)}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}
              >
                <div style={styles.notificationMessage}>
                  <strong>{notif.sender?.name || 'System'}</strong> {notif.message}
                </div>
                <div style={styles.notificationTime}>
                  {formatTime(notif.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
