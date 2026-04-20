'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    roomNumber: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success - redirect to login
      router.push('/login?role=STUDENT&registered=true');
      
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="container flex-center animate-fade-in" style={{ minHeight: '100vh', flexDirection: 'column' }}>
      
      <div className="glass-panel animate-slide-up" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderTop: '4px solid var(--accent-primary)',
        '--accent-color': 'var(--accent-primary)',
        '--accent-glow': 'var(--accent-primary-glow)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '16px',
            filter: 'drop-shadow(0 0 15px var(--accent-primary))'
          }}>
            🎓
          </div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>
            Student <span style={{ color: 'var(--accent-primary)' }}>Sign Up</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Create your account to access the hostel portal
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger)',
            color: 'var(--danger)',
            padding: '12px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label>Full Name</label>
            <input 
              name="name"
              type="text" 
              className="input-glass" 
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label>Username / ID</label>
              <input 
                name="username"
                type="text" 
                className="input-glass" 
                placeholder="e.g. john_d"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Room No.</label>
              <input 
                name="roomNumber"
                type="text" 
                className="input-glass" 
                placeholder="A-101"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div>
            <label>Password</label>
            <input 
              name="password"
              type="password" 
              className="input-glass" 
              placeholder="••••••••"
              value={formData.password}
                onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ 
              marginTop: '12px', 
              height: '52px',
              fontSize: '1.1rem'
            }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <button 
            onClick={() => router.push('/login?role=STUDENT')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Already have an account? <span style={{ color: 'var(--accent-primary)' }}>Log In</span>
          </button>
        </div>

      </div>
    </main>
  );
}
