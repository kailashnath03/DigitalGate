'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = (role) => {
    setLoadingRole(role);
    setTimeout(() => {
      router.push(`/login?role=${role}`);
    }, 400);
  };

  const roles = [
    {
      id: 'STUDENT',
      title: 'Students',
      description: 'Request passes and report issues in seconds from any device.',
      color: 'var(--accent-primary)',
      icon: '🎓'
    },
    {
      id: 'WARDEN',
      title: 'Wardens',
      description: 'Review and approve logistics with full visibility and control.',
      color: 'var(--accent-secondary)',
      icon: '🛡️'
    },
    {
      id: 'SECURITY',
      title: 'Security',
      description: 'Verify identifications and log entries with instant validation.',
      color: 'var(--warning)',
      icon: '🔐'
    }
  ];

  const features = [
    { title: 'Smart Pass', desc: 'Secure Serial & QR based exit verification system.', icon: '🎫' },
    { title: 'Live Alerts', desc: 'Instant WhatsApp and Email notifications for status updates.', icon: '🔔' },
    { title: 'Maintenance Hub', desc: 'Direct technical support requests with resolution tracking.', icon: '🛠️' },
    { title: 'Visual Analytics', desc: 'Real-time logs and attendance heatmaps for administrators.', icon: '📊' },
    { title: 'Cloud Infrastructure', desc: '99.9% uptime with high-security data encryption.', icon: '☁️' },
    { title: 'Mobile First', desc: 'Optimized experience across all smartphones and tablets.', icon: '📱' }
  ];

  const reviews = [
    { name: 'Sathwik M.', role: 'Student Council', text: 'DigitalGate transformed how we handle weekend leaves. No more paper trail mess!' },
    { name: 'Dr. Ramesh Kumar', role: 'Head Warden', text: 'Tracking 500+ students used to be a nightmare. Now it’s just a click away.' },
    { name: 'Vijay Pratap', role: 'Security Supervisor', text: 'The verification speed is incredible. We’ve cut down gate queues by 80%.' },
    { name: 'Ananya S.', role: 'Hostel Resident', text: 'Resolved my fan issue in hours! The maintenance tracking is so transparent.' }
  ];

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Background Polish */}
      <div style={{ position: 'fixed', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }}></div>
      <div style={{ position: 'fixed', bottom: '10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: -1 }}></div>

      {/* Navigation Bar */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        padding: isScrolled ? '16px 0' : '32px 0', 
        background: isScrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(10px)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border-glass)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-1px', cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
            DIGITAL<span className="text-gradient">GATE</span>
          </div>
          <div style={{ display: 'flex', gap: '40px', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('features')}>Features</span>
            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('reviews')}>Reviews</span>
            <span className="nav-link" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('support')}>Support</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="hero" className="container animate-fade-in" style={{ paddingTop: '180px', paddingBottom: '100px' }}>
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto' }}>
          <div className="badge badge-info" style={{ marginBottom: '24px', letterSpacing: '0.1em', fontWeight: '800' }}>ENTERPRISE SOLUTION</div>
          <h1 style={{ fontSize: '5rem', lineHeight: '0.95', marginBottom: '28px', letterSpacing: '-0.03em' }}>
            Elevate Your <span className="text-gradient">Hostel Experience</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.35rem', lineHeight: '1.6', marginBottom: '48px', fontWeight: '400' }}>
            A unified full-stack ecosystem to digitize logbooks, gate passes, and maintenance workflows for the next generation of hostels.
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
             <button className="btn btn-primary" onClick={() => scrollToSection('portals')} style={{ height: '56px', padding: '0 40px', fontSize: '1rem' }}>Get Started</button>
             <button className="btn btn-secondary" onClick={() => scrollToSection('features')} style={{ height: '56px', padding: '0 40px', fontSize: '1rem' }}>System Overview</button>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" style={{ background: 'rgba(255,255,255,0.01)', padding: '120px 0', borderY: '1px solid var(--border-glass)' }}>
        <div className="container">
          <div className="card-header" style={{ flexDirection: 'column', textAlign: 'center', marginBottom: '80px', gap: '16px' }}>
              <h2 style={{ fontSize: '3rem', letterSpacing: '-0.02em' }}>Advanced <span className="text-gradient">Capabilities</span></h2>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>Designed to solve real-world campus logistics challenges</p>
          </div>
          <div className="grid-3" style={{ gap: '32px' }}>
            {features.map((f, i) => (
              <div key={i} className="glass-panel" style={{ padding: '40px', transition: 'transform 0.3s ease', cursor: 'default' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '24px' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '16px', fontSize: '1.5rem' }}>{f.title}</h3>
                <p className="text-secondary" style={{ lineHeight: '1.7', fontSize: '1rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Portals */}
      <section id="portals" className="container" style={{ padding: '140px 24px' }}>
        <div className="card-header" style={{ marginBottom: '64px', flexDirection: 'column', textAlign: 'left', gap: '12px' }}>
          <h2 style={{ fontSize: '3.5rem', letterSpacing: '-0.02em' }}>Unified Access <span className="text-gradient">Hub</span></h2>
          <p className="text-muted" style={{ fontSize: '1.2rem', maxWidth: '600px' }}>Select your designated portal to continue with secure authentication.</p>
        </div>
        <div className="grid-3" style={{ gap: '24px' }}>
          {roles.map((role, idx) => (
            <div 
              key={role.id}
              className="glass-panel animate-slide-up"
              style={{ 
                padding: '48px 40px', 
                cursor: 'pointer',
                animationDelay: `${idx * 0.1}s`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '24px',
                borderBottom: `4px solid ${role.color}`
              }}
              onClick={() => handleLogin(role.id)}
            >
              <div style={{ 
                fontSize: '3.5rem', 
                padding: '24px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '50%',
                border: `1px solid ${role.color}`,
                boxShadow: `0 0 30px ${role.color}15`
              }}>
                {role.icon}
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{role.title}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '32px', lineHeight: '1.6' }}>
                  {role.description}
                </p>
                <div style={{ 
                    color: role.color, 
                    fontWeight: '800', 
                    fontSize: '0.9rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    justifyContent: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}>
                    {loadingRole === role.id ? 'Connecting...' : 'Secure Entry →'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews & Social Proof */}
      <section id="reviews" style={{ padding: '120px 0', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '80px', alignItems: 'center' }}>
            <div>
              <div className="badge badge-info" style={{ marginBottom: '24px' }}>TRUSTED BY 10+ CAMPUSES</div>
              <h2 style={{ fontSize: '3.5rem', marginBottom: '24px', letterSpacing: '-0.03em' }}>Real Impact, <br/><span className="text-gradient">Real Feedback</span></h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: '1.7', marginBottom: '40px' }}>
                Digitization is not just about tools; it’s about improving the daily lives of thousands of students and administrative staff.
              </p>
              <div style={{ display: 'flex', gap: '32px' }}>
                 <div><div style={{ fontSize: '2rem', fontWeight: '800' }}>98%</div><div className="text-muted">Satisfaction</div></div>
                 <div style={{ width: '1px', background: 'var(--border-glass)' }}></div>
                 <div><div style={{ fontSize: '2rem', fontWeight: '800' }}>24h</div><div className="text-muted">Avg. Resolution</div></div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {reviews.map((r, i) => (
                <div key={i} className="glass-panel" style={{ padding: '32px', transform: i % 2 === 0 ? 'translateX(20px)' : 'translateX(-20px)' }}>
                  <p style={{ fontStyle: 'italic', fontSize: '1.1rem', marginBottom: '24px', color: 'var(--text-primary)', lineHeight: '1.6' }}>"{r.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', background: 'var(--bg-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', border: '1px solid var(--border-glass)' }}>👤</div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem' }}>{r.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.85rem' }}>{r.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" className="container" style={{ padding: '120px 24px' }}>
         <div className="glass-panel" style={{ padding: '80px', textAlign: 'center', background: 'radial-gradient(circle at top right, rgba(56, 189, 248, 0.05), transparent)' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '24px' }}>Need <span className="text-gradient">Assistance?</span></h2>
            <p className="text-muted" style={{ fontSize: '1.2rem', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px auto' }}>
                Our dedicated support team is available 24/7 for technical inquiries, system integration, and on-campus training.
            </p>
            <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div style={{ padding: '24px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase' }}>Technical Support</div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>support@digitalgate.edu</div>
                </div>
                <div style={{ padding: '24px 40px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border-glass)' }}>
                    <div className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '8px', textTransform: 'uppercase' }}>Institutional Inquiry</div>
                    <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>admin@logistics.corp</div>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '80px 0 40px 0', background: 'rgba(0,0,0,0.3)' }}>
        <div className="container">
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '60px', flexWrap: 'wrap', gap: '40px' }}>
              <div style={{ maxWidth: '300px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>DIGITAL<span className="text-gradient">GATE</span></div>
                <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>Next-generation utility management platform for institutional logistics and student safety.</p>
              </div>
              <div style={{ display: 'flex', gap: '80px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontWeight: '700', marginBottom: '8px' }}>Platform</div>
                    <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('features')}>Features</span>
                    <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('reviews')}>Testimonials</span>
                    <span className="text-muted" style={{ cursor: 'pointer' }} onClick={() => scrollToSection('portals')}>Portals</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontWeight: '700', marginBottom: '8px' }}>Security</div>
                    <span className="text-muted" style={{ cursor: 'pointer' }}>Privacy Policy</span>
                    <span className="text-muted" style={{ cursor: 'pointer' }}>GDPR Compliance</span>
                    <span className="text-muted" style={{ cursor: 'pointer' }}>Data Protection</span>
                </div>
              </div>
           </div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>© 2026 Educational Logistics Inc. All rights reserved.</p>
              <div className="badge badge-success" style={{ fontSize: '0.7rem' }}>NETWORK: CLOUD CLUSTER A-42</div>
           </div>
        </div>
      </footer>

      <style jsx>{`
        .nav-link:hover {
            color: var(--accent-primary) !important;
            text-shadow: 0 0 10px var(--accent-primary-glow);
        }
        .text-muted:hover {
            color: var(--text-primary) !important;
        }
      `}</style>
    </main>
  );
}
