'use client';

import { useState, useEffect, useRef } from 'react';

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/notifications?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      // Update local state instead of refetching for smoothness
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) {
      // Small delay to let the user see unread ones before marking all as read
      setTimeout(markAllAsRead, 1000);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid var(--border-glass)', 
          borderRadius: '50%', 
          width: '40px', 
          height: '40px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          cursor: 'pointer',
          fontSize: '1.2rem',
          position: 'relative',
          transition: 'var(--transition-fast)'
        }}
        className="btn-notification"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: '-2px', 
            right: '-2px', 
            background: 'var(--danger)', 
            color: '#fff', 
            borderRadius: '50%', 
            width: '18px', 
            height: '18px', 
            fontSize: '0.65rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontWeight: '700',
            border: '2px solid var(--bg-primary)',
            boxShadow: '0 0 10px var(--danger-glow)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="glass-panel" style={{ 
          position: 'absolute', 
          top: '50px', 
          right: 0, 
          width: '320px', 
          maxHeight: '400px', 
          overflowY: 'auto', 
          zIndex: 1000, 
          padding: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
            <h4 style={{ margin: 0, fontSize: '1rem' }}>Activity Alerts</h4>
            {unreadCount > 0 && (
              <span 
                style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: '600' }} 
                onClick={markAllAsRead}
              >
                Clear all
              </span>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '2rem', opacity: 0.3, marginBottom: '8px' }}>📭</div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No recent alerts</p>
              </div>
            ) : notifications.map(n => (
              <div key={n.id} style={{ 
                padding: '12px', 
                borderRadius: 'var(--border-radius-sm)', 
                background: n.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(59, 130, 246, 0.08)',
                borderLeft: `3px solid ${n.type === 'SUCCESS' ? 'var(--success)' : n.type === 'WARNING' ? 'var(--danger)' : 'var(--accent-primary)'}`,
                transition: 'var(--transition-fast)'
              }}>
                <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5', color: n.isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                  {n.message}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', alignItems: 'center' }}>
                   <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </small>
                  {!n.isRead && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-primary)' }} />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
