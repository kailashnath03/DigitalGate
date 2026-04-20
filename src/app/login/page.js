'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'STUDENT';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Role visual mapping
  const roleStyles = {
    STUDENT: { title: 'Student Portal', color: 'var(--accent-primary)', icon: '🎓' },
    WARDEN: { title: 'Warden Dashboard', color: 'var(--accent-secondary)', icon: '🛡️' },
    SECURITY: { title: 'Security Terminal', color: 'var(--warning)', icon: '🔐' }
  };

  const currentStyle = roleStyles[role] || roleStyles.STUDENT;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Check if user is trying to login to correct role portal
      if (data.user.role !== role) {
        throw new Error(`Invalid access: Your role is ${data.user.role}, but you are trying to access the ${role} portal.`);
      }

      // Route to respective dashboard
      router.push(`/${role.toLowerCase()}`);
      router.refresh();
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="container flex-center animate-fade-in" style={{ minHeight: '100vh', flexDirection: 'column' }}>
      
      <div className="glass-panel animate-slide-up" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '48px',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        position: 'relative',
        overflow: 'hidden',
        borderTop: `4px solid ${currentStyle.color}`,
        '--accent-color': currentStyle.color,
        '--accent-glow': currentStyle.color.replace(')', ', 0.35)').replace('var(', 'rgba(')
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3.5rem', 
            marginBottom: '20px',
            filter: `drop-shadow(0 0 20px ${currentStyle.color})`
          }}>
            {currentStyle.icon}
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            {currentStyle.title.split(' ')[0]} <span style={{ color: currentStyle.color }}>Login</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Secure access to your {currentStyle.title.toLowerCase()}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        {searchParams.get('registered') && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success)',
            color: 'var(--success)',
            padding: '14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            Registration successful! Please login.
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label>Username</label>
            <input 
              type="text" 
              className="input-glass" 
              placeholder="e.g. student1"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              style={{ '--accent-color': currentStyle.color }}
            />
          </div>
          
          <div>
            <label>Password</label>
            <input 
              type="password" 
              className="input-glass" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ '--accent-color': currentStyle.color }}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              marginTop: '12px', 
              background: currentStyle.color,
              height: '52px',
              fontSize: '1.1rem',
              opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '0px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Don't have an account? {' '}
            <button 
              onClick={() => router.push(`/register?role=${role}`)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentStyle.color, 
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600',
                textDecoration: 'underline'
              }}
            >
              Sign up now
            </button>
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <button 
            onClick={() => router.push('/')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseOver={e => e.target.style.color = currentStyle.color}
            onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
          >
            ← Back to role selection
          </button>
        </div>

      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container flex-center" style={{ minHeight: '100vh' }}>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
