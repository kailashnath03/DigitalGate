'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';
import NotificationBell from '@/components/NotificationBell';

export default function SecurityPortal() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [passes, setPasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/login?role=SECURITY');
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadUser();
    fetchPasses();
  }, [router]);

  const fetchPasses = async () => {
    try {
      const res = await fetch(`/api/gatepass`); 
      if (res.ok) {
        const data = await res.json();
        // Security only cares about passes that are APPROVED (ready to exit) or have Exited (ready to enter)
        setPasses(data.filter(p => ['APPROVED', 'COMPLETED'].includes(p.status) || p.exitTime));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAction = async (id, action) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/gatepass/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        fetchPasses();
        setSearchTerm('');
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const filteredPasses = passes.filter(p => 
    p.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.student?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
      <header className="card-header" style={{ marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
            Security <span className="text-gradient">Portal</span>
          </h1>
          <p className="text-muted">Gate Verification & Terminal Logistics</p>
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

      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px', borderTop: '4px solid var(--accent-primary)' }}>
        <div className="card-header" style={{ marginBottom: '16px' }}>
           <h3>Verify Pass Credentials</h3>
           <span style={{ fontSize: '1.2rem' }}>🔍</span>
        </div>
        <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-glass" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Scan ID or enter name/serial number..."
              style={{ fontSize: '1.1rem', padding: '18px 24px' }}
            />
            {searchTerm && (
                <button 
                    onClick={() => setSearchTerm('')}
                    style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >✕</button>
            )}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <h4 className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {filteredPasses.length} Record{filteredPasses.length !== 1 ? 's' : ''} found
        </h4>
        
        {filteredPasses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)', borderRadius: '16px', border: '1px dashed var(--border-glass)' }}>
            No active or historical records match your search.
          </div>
        )}
        
        {filteredPasses.map(pass => {
          const hasExited = !!pass.exitTime && !pass.entryTime;
          const isCompleted = !!pass.entryTime;
          
          return (
            <div key={pass.id} className="glass-panel" style={{ 
                padding: '28px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderLeft: `4px solid ${hasExited ? 'var(--warning)' : isCompleted ? 'var(--success)' : 'var(--accent-primary)'}`
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1.5rem' }}>{pass.student?.name}</h4>
                  <span className="badge-info" style={{ 
                      padding: '4px 12px', 
                      borderRadius: '6px', 
                      background: 'rgba(56, 189, 248, 0.1)', 
                      fontSize: '1rem', 
                      fontFamily: 'monospace', 
                      color: 'var(--accent-primary)',
                      border: '1px solid var(--accent-primary-glow)',
                      fontWeight: '700'
                  }}>
                    {pass.serialNumber}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '1rem' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>DEST:</strong> {pass.destination} 
                  <span style={{ margin: '0 12px', opacity: 0.2 }}>|</span>
                  <strong style={{ color: 'var(--text-muted)' }}>ROOM:</strong> {pass.student?.roomNumber}
                </p>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  {pass.exitTime && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }}></span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>EXIT: {new Date(pass.exitTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  )}
                  {pass.entryTime && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>ENTRY: {new Date(pass.entryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                {!hasExited && !isCompleted && (
                  <button 
                    className="btn" 
                    onClick={() => handleAction(pass.id, 'exit')}
                    disabled={loading}
                    style={{ background: 'var(--warning)', color: '#000', width: '140px' }}
                  >Verify Exit</button>
                )}
                {hasExited && !isCompleted && (
                  <button 
                    className="btn btn-success" 
                    onClick={() => handleAction(pass.id, 'entry')}
                    disabled={loading}
                    style={{ width: '140px' }}
                  >Verify Entry</button>
                )}
                {isCompleted && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--success)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                     <span>CLEARED</span>
                     <span style={{ fontSize: '1.2rem' }}>✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
