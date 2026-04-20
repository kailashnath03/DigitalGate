'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import NotificationBell from '@/components/NotificationBell';

export default function StudentDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('gatepass');
  
  // Gate Pass state
  const [passes, setPasses] = useState([]);
  const [destination, setDestination] = useState('');
  const [reason, setReason] = useState('');
  
  // Maintenance state
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [mCategory, setMCategory] = useState('Electrical');
  const [mDescription, setMDescription] = useState('');
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch logged in user
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          fetchPasses(data.user.id);
          fetchMaintenance(data.user.id);
        } else {
          router.push('/login?role=STUDENT');
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadUser();
  }, [router]);

  const fetchPasses = async (studentId) => {
    try {
      const res = await fetch(`/api/gatepass?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setPasses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMaintenance = async (studentId) => {
    try {
      const res = await fetch(`/api/maintenance?studentId=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setMaintenanceRequests(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestPass = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gatepass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, destination, reason })
      });
      if (res.ok) {
        setDestination('');
        setReason('');
        fetchPasses(user.id);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleRequestMaintenance = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user.id, category: mCategory, description: mDescription })
      });
      if (res.ok) {
        setMDescription('');
        fetchMaintenance(user.id);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleConfirmResolution = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/maintenance/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED' })
      });
      if (res.ok) {
        fetchMaintenance(user.id);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '20px' }}>
        <div style={{ fontSize: '3rem', animation: 'spin 2s linear infinite' }}>⚙️</div>
        <h2 className="text-muted">Authenticating Portal...</h2>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <header className="card-header" style={{ marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
            Hello, <span className="text-gradient">{user.name.split(' ')[0]}</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge badge-info">Student Portal</span>
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>Room {user.roomNumber}</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <NotificationBell userId={user.id} />
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

      {/* Navigation Tabs */}
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
            padding: '10px 24px',
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
            padding: '10px 24px',
            boxShadow: activeTab === 'maintenance' ? '' : 'none'
          }}
        >
          🛠️ Maintenance
        </button>
      </div>

      {activeTab === 'gatepass' ? (
        <div className="grid-2">
          {/* Request Form */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="card-header">
              <h3>Request New Pass</h3>
              <span style={{ fontSize: '1.5rem' }}>🎫</span>
            </div>
            <form onSubmit={handleRequestPass}>
              <div style={{ marginBottom: '20px' }}>
                <label>Destination</label>
                <input 
                  type="text" 
                  className="input-glass" 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                  placeholder="e.g. City Library"
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label>Reason for Exit</label>
                <textarea 
                  className="input-glass" 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  required
                  placeholder="Provide a brief explanation..."
                  rows="3"
                  style={{ resize: 'none' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px' }} disabled={loading}>
                {loading ? 'Processing...' : 'Submit Request'}
              </button>
            </form>
          </div>

          {/* Passes List */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="card-header">
              <h3>History & Status</h3>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>{passes.length} Requests</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
              {passes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No gate passes requested yet.</p>
                </div>
              ) : passes.map(pass => (
                <div key={pass.id} style={{ 
                  padding: '20px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '14px',
                  border: '1px solid var(--border-glass)',
                  transition: 'var(--transition-normal)'
                }} className="list-item-hover">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <strong style={{ fontSize: '1.1rem' }}>{pass.destination}</strong>
                    <span className={`badge badge-${pass.status.toLowerCase()}`}>{pass.status}</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '16px', lineHeight: '1.5' }}>
                    {pass.reason}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <small style={{ color: 'var(--text-muted)' }}>{new Date(pass.createdAt).toLocaleDateString()}</small>
                    {pass.serialNumber && (
                      <div style={{ 
                        padding: '6px 14px', 
                        background: 'rgba(56, 189, 248, 0.1)', 
                        fontFamily: 'monospace',
                        letterSpacing: '1px',
                        color: 'var(--accent-primary)',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        border: '1px dashed var(--accent-primary)'
                      }}>
                        {pass.serialNumber}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          {/* Maintenance Form */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="card-header">
              <h3>Report an Issue</h3>
              <span style={{ fontSize: '1.5rem' }}>🛠️</span>
            </div>
            <form onSubmit={handleRequestMaintenance}>
              <div style={{ marginBottom: '20px' }}>
                <label>Category</label>
                <select 
                  className="input-glass" 
                  value={mCategory}
                  onChange={(e) => setMCategory(e.target.value)}
                  style={{ appearance: 'none', background: 'rgba(0,0,0,0.3)' }}
                >
                  <option value="Electrical">Electrical</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Internet">Internet</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label>Problem Description</label>
                <textarea 
                  className="input-glass" 
                  value={mDescription}
                  onChange={(e) => setMDescription(e.target.value)}
                  required
                  placeholder="Describe what's wrong in your room..."
                  rows="4"
                  style={{ resize: 'none' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '52px' }} disabled={loading}>
                {loading ? 'Submitting...' : 'File Report'}
              </button>
            </form>
          </div>

          {/* Maintenance List */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            <div className="card-header">
              <h3>My Requests</h3>
              <span className="text-muted" style={{ fontSize: '0.9rem' }}>{maintenanceRequests.length} Total</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '500px', overflowY: 'auto', paddingRight: '8px' }}>
              {maintenanceRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No maintenance reports found.</p>
                </div>
              ) : maintenanceRequests.map(req => (
                <div key={req.id} style={{ 
                  padding: '20px', 
                  background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '14px',
                  border: '1px solid var(--border-glass)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', alignItems: 'flex-start' }}>
                    <div>
                        <strong style={{ fontSize: '1.1rem', display: 'block' }}>{req.category}</strong>
                        <small style={{ color: 'var(--text-muted)' }}>{new Date(req.createdAt).toLocaleDateString()}</small>
                    </div>
                    <span className={`badge`} style={{ 
                      background: req.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : (req.status === 'RESOLVED' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(56, 189, 248, 0.1)'),
                      color: req.status === 'COMPLETED' ? 'var(--success)' : (req.status === 'RESOLVED' ? 'var(--warning)' : 'var(--accent-primary)'),
                      border: `1px solid ${req.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : (req.status === 'RESOLVED' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(56, 189, 248, 0.2)')}`
                    }}>
                      {req.status === 'RESOLVED' ? 'Awaiting Confirmation' : req.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: req.status === 'RESOLVED' ? '20px' : '0', lineHeight: '1.5' }}>
                    {req.description}
                  </p>
                  
                  {req.status === 'RESOLVED' && (
                    <button 
                      className="btn btn-success" 
                      style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
                      onClick={() => handleConfirmResolution(req.id)}
                      disabled={loading}
                    >
                      {loading ? 'Updating...' : 'Confirm Resolution'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .list-item-hover:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: var(--accent-primary-glow) !important;
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
