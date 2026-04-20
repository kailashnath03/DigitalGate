'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import NotificationBell from '@/components/NotificationBell';

export default function WardenDashboard() {
  const router = useRouter();  
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('gatepass');
  const [passes, setPasses] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/login?role=WARDEN');
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadUser();
    fetchPasses();
    fetchMaintenance();
  }, [router]);

  const fetchPasses = async () => {
    try {
      const res = await fetch(`/api/gatepass`);
      if (res.ok) {
        const data = await res.json();
        setPasses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMaintenance = async () => {
    try {
      const res = await fetch(`/api/maintenance`);
      if (res.ok) {
        const data = await res.json();
        setMaintenance(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePassAction = async (id, action) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gatepass/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchPasses();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleMaintenanceAction = async (id, status) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchMaintenance();
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const stats = {
    pendingPasses: passes.filter(p => p.status === 'PENDING').length,
    activeOut: passes.filter(p => p.exitTime && !p.entryTime).length,
    openMaintenance: maintenance.filter(m => m.status === 'OPEN' || m.status === 'IN_PROGRESS').length,
    awaitingConfirm: maintenance.filter(m => m.status === 'RESOLVED').length
  };

  return (
    <div className="container animate-fade-in">
      <header className="card-header" style={{ marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '4px' }}>Warden <span className="text-gradient">Console</span></h1>
          <p className="text-muted">Hostel Management & Safety Terminal</p>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user && <NotificationBell userId={user.id} />}
          <div style={{ width: '1px', height: '30px', background: 'var(--border-glass)' }}></div>
          <button 
            onClick={() => router.push('/change-password')}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            🔒 Security
          </button>
          <LogoutButton />
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', marginBottom: '40px' }}>
        <div className="glass-panel stats-card" style={{ borderLeft: '4px solid var(--warning)' }}>
          <span className="label">Pending Passes</span>
          <span className="value">{stats.pendingPasses}</span>
        </div>
        <div className="glass-panel stats-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
          <span className="label">Current Students Out</span>
          <span className="value">{stats.activeOut}</span>
        </div>
        <div className="glass-panel stats-card" style={{ borderLeft: '4px solid var(--danger)' }}>
          <span className="label">Unresolved Issues</span>
          <span className="value">{stats.openMaintenance}</span>
        </div>
        <div className="glass-panel stats-card" style={{ borderLeft: '4px solid var(--success)' }}>
          <span className="label">Awaiting Confirm</span>
          <span className="value">{stats.awaitingConfirm}</span>
        </div>
      </div>

      {/* Tabs Layout */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '32px', 
        background: 'rgba(0,0,0,0.2)', 
        padding: '6px', 
        borderRadius: '12px',
        width: 'fit-content',
        border: '1px solid var(--border-glass)'
      }}>
        <button 
          className={`btn ${activeTab === 'gatepass' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('gatepass')}
          style={{ 
            background: activeTab === 'gatepass' ? '' : 'transparent',
            borderRadius: '10px',
            padding: '10px 32px',
            boxShadow: activeTab === 'gatepass' ? '' : 'none'
          }}
        >
          🎫 Gate Passes
        </button>
        <button 
          className={`btn ${activeTab === 'maintenance' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('maintenance')}
          style={{ 
            background: activeTab === 'maintenance' ? '' : 'transparent',
            borderRadius: '10px',
            padding: '10px 32px',
            boxShadow: activeTab === 'maintenance' ? '' : 'none'
          }}
        >
          🛠️ Maintenance
        </button>
      </div>

      {activeTab === 'gatepass' ? (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
            <div className="card-header">
              <h3 style={{ color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🕒</span> Pending Request Inbox
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {passes.filter(p => p.status === 'PENDING').length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No pending gate pass requests currently.
                </div>
              )}
              {passes.filter(p => p.status === 'PENDING').map(pass => (
                <div key={pass.id} style={{ 
                    padding: '24px', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border-glass)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                      {pass.student?.name} 
                      <span className="text-muted" style={{ fontSize: '0.9rem', fontWeight: '400', marginLeft: '12px' }}>
                        • Room {pass.student?.roomNumber}
                      </span>
                    </h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '600px' }}>
                      <strong style={{ color: 'var(--accent-primary)' }}>To:</strong> {pass.destination} 
                      <span style={{ margin: '0 12px', opacity: 0.2 }}>|</span>
                      <strong style={{ color: 'var(--accent-primary)' }}>Reason:</strong> {pass.reason}
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '12px' }}>
                      Requested: {new Date(pass.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-success" onClick={() => handlePassAction(pass.id, 'approve')} disabled={loading}>Approve</button>
                    <button className="btn btn-danger" onClick={() => handlePassAction(pass.id, 'reject')} disabled={loading}>Reject</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '32px' }}>
             <div className="card-header">
              <h3>Recent History</h3>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>Last 10 Actions</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
              {passes.filter(p => p.status !== 'PENDING').slice(0, 10).map(pass => (
                <div key={pass.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong>{pass.student?.name} <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>→ {pass.destination}</span></strong>
                    <span className={`badge badge-${pass.status.toLowerCase()}`}>{pass.status}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{pass.reason}</p>
                    {pass.serialNumber && <span style={{ color: 'var(--accent-primary)', fontFamily: 'monospace', fontWeight: '700' }}>{pass.serialNumber}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="card-header">
              <h3 style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span>🛠️</span> Active Maintenance Tickets
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {maintenance.filter(m => m.status !== 'COMPLETED').length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No active maintenance issues.
                  </div>
              )}
              {maintenance.filter(m => m.status !== 'COMPLETED').map(item => (
                <div key={item.id} style={{ 
                    padding: '24px', 
                    background: 'rgba(255,255,255,0.02)', 
                    borderRadius: '16px', 
                    border: '1px solid var(--border-glass)',
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center' 
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                      <span className="badge badge-info">{item.category}</span>
                      <h4 style={{ fontSize: '1.2rem' }}>
                        {item.student?.name} 
                        <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: '400', marginLeft: '8px' }}>
                            • Room {item.student?.roomNumber}
                        </span>
                      </h4>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '12px 0', maxWidth: '600px' }}>{item.description}</p>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                      <small className="text-muted">Reported: {new Date(item.createdAt).toLocaleDateString()}</small>
                      <span className="badge" style={{ 
                          background: item.status === 'RESOLVED' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(56, 189, 248, 0.1)',
                          color: item.status === 'RESOLVED' ? 'var(--warning)' : 'var(--accent-primary)',
                          border: 'none'
                      }}>
                        {item.status === 'RESOLVED' ? 'AWAITING CONFIRMATION' : item.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    {item.status === 'OPEN' && (
                      <button className="btn btn-secondary" onClick={() => handleMaintenanceAction(item.id, 'IN_PROGRESS')} disabled={loading}>Start Work</button>
                    )}
                    {item.status !== 'RESOLVED' && (
                      <button className="btn btn-success" onClick={() => handleMaintenanceAction(item.id, 'RESOLVED')} disabled={loading}>Mark Resolved</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '48px' }}>
              <div className="card-header">
                <h3 style={{ color: 'var(--text-muted)' }}>Resolution History</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '16px' }}>
                {maintenance.filter(m => m.status === 'COMPLETED').slice(0, 10).map(item => (
                  <div key={item.id} style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px solid var(--border-glass)', opacity: 0.8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <strong>{item.student?.name} <span style={{ fontWeight: '400', color: 'var(--text-muted)' }}>- {item.category}</span></strong>
                      <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: '800' }}>✓ COMPLETED</span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.description}</p>
                    <small className="text-muted" style={{ display: 'block', marginTop: '10px' }}>Closed on: {new Date(item.updatedAt).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
