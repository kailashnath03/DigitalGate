'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChangePasswordPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (e) {
        console.error(e);
        router.push('/login');
      }
    }
    loadUser();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Update failed');
      }

      setSuccess(true);
      setTimeout(async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
      }, 2500);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container flex-center" style={{ minHeight: '100vh' }}>
        <div className="animate-pulse text-muted">Authenticating secure session...</div>
      </div>
    );
  }

  return (
    <main className="container flex-center animate-fade-in" style={{ minHeight: '100vh', padding: '24px' }}>
      <div className="glass-panel animate-slide-up" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '48px',
        borderTop: '4px solid var(--accent-primary)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Security Settings</h1>
          <p className="text-muted">Maintain the integrity of your account</p>
        </div>

        {error && (
          <div className="badge" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--danger)',
            padding: '16px',
            width: '100%',
            marginBottom: '24px',
            textAlign: 'center',
            display: 'block',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {success ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '20px 0' }}>
            <div className="badge badge-success" style={{ padding: '16px 24px', fontSize: '1rem', width: '100%' }}>
              ✓ Password Updated Successfully
            </div>
            <p className="text-muted" style={{ marginTop: '16px', fontSize: '0.9rem' }}>
              Re-authenticating your session. Please wait...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Password</label>
              <input 
                type="password" 
                className="input-glass" 
                placeholder="••••••••"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                required
                style={{ padding: '16px' }}
              />
            </div>
            
            <div style={{ height: '1px', background: 'var(--border-glass)', margin: '10px 0' }}></div>

            <div>
              <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label>
              <input 
                type="password" 
                className="input-glass" 
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                style={{ padding: '16px' }}
              />
            </div>

            <div>
              <label className="text-muted" style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm Security Shield</label>
              <input 
                type="password" 
                className="input-glass" 
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                style={{ padding: '16px' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ 
                marginTop: '12px', 
                height: '56px',
                fontSize: '1rem'
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Apply Secure Changes'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button 
            type="button"
            onClick={() => router.back()}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              textDecoration: 'underline',
              textUnderlineOffset: '4px'
            }}
          >
            Cancel and Return
          </button>
        </div>
      </div>
    </main>
  );
}
