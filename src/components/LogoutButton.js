'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="btn"
      style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid var(--danger)',
        color: 'var(--danger)',
        padding: '8px 16px',
        fontSize: '0.9rem',
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? 'Logging out...' : 'Logout'}
    </button>
  );
}
