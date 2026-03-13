import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Floating aurora orbs ─────────────────────────────────────── */
const Orb = ({ cx, cy, r, color, delay }) => (
  <motion.div
    style={{
      position: 'fixed', left: cx, top: cy,
      width: r * 2, height: r * 2, borderRadius: '50%',
      background: color, filter: 'blur(90px)', opacity: 0.28, pointerEvents: 'none', zIndex: 0,
    }}
    animate={{ y: [0, -25, 0], x: [0, 12, 0], scale: [1, 1.06, 1] }}
    transition={{ duration: 10, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
});

/* ── Stat Card ────────────────────────────────────────────────── */
const StatCard = ({ icon, value, label, accent, delay }) => (
  <motion.div {...fadeUp(delay)}
    whileHover={{ y: -3, boxShadow: `0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px ${accent}33` }}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)',
      backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px',
      padding: '1.4rem 1.5rem',
      boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'default',
    }}
  >
    <div style={{
      width: 48, height: 48, borderRadius: '13px', flexShrink: 0,
      background: `linear-gradient(135deg, ${accent}cc, ${accent}55)`,
      boxShadow: `0 4px 16px ${accent}44`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', fontWeight: 400, color: '#f3f0ff', lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#6b7280', marginTop: '0.25rem', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</div>
    </div>
  </motion.div>
);

/* ── Activity Row ─────────────────────────────────────────────── */
const ActivityRow = ({ dotColor, title, time, badge, badgeColor, border }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0.9rem 0',
    borderBottom: border ? '1px solid rgba(255,255,255,0.06)' : 'none',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: `${dotColor}18`, border: `1px solid ${dotColor}40`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: dotColor,
      }}>
        <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.87rem', color: '#e5e7eb', margin: 0 }}>{title}</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.73rem', color: '#4b5563', margin: '0.15rem 0 0' }}>{time}</p>
      </div>
    </div>
    <span style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 500,
      color: badgeColor, letterSpacing: '0.04em',
      background: `${badgeColor}16`, border: `1px solid ${badgeColor}30`,
      borderRadius: '20px', padding: '0.22rem 0.7rem',
    }}>{badge}</span>
  </div>
);

/* ── Action Button ────────────────────────────────────────────── */
const ActionBtn = ({ label, icon, onClick, primary }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.03 }}
    whileTap={{ scale: 0.97 }}
    style={{
      padding: '0.75rem 1.4rem',
      background: primary ? 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)' : 'rgba(255,255,255,0.05)',
      border: primary ? 'none' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px', color: '#fff', cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', fontWeight: 500,
      letterSpacing: '0.05em',
      boxShadow: primary ? '0 6px 24px rgba(124,58,237,0.3)' : 'none',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
    }}
  >
    {icon}{label}
  </motion.button>
);

/* ── Dashboard ────────────────────────────────────────────────── */
const Dashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [itemsLent] = useState(0);
  const [itemsBorrowed] = useState(0);
  const [credits] = useState(10);
  const [rating] = useState(0);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUserName(userData?.name || 'User');
  }, []);

  const stats = [
    { value: itemsLent,     label: 'Items Lent',       accent: '#7c3aed', delay: 0.15, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
    { value: itemsBorrowed, label: 'Items Borrowed',    accent: '#0ea5e9', delay: 0.22, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
    { value: credits,       label: 'Credits Earned',    accent: '#10b981', delay: 0.29, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { value: rating,        label: 'Community Rating',  accent: '#f59e0b', delay: 0.36, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 40%, #0d0521 0%, #06000f 55%, #000208 100%)',
      color: '#f3f0ff', overflowX: 'hidden', position: 'relative',
    }}>
      {/* Background */}
      <Orb cx="-8%"  cy="0%"  r={350} color="radial-gradient(circle, #7c3aed, transparent)" delay={0} />
      <Orb cx="72%"  cy="-4%" r={300} color="radial-gradient(circle, #0ea5e9, transparent)" delay={2} />
      <Orb cx="55%"  cy="65%" r={260} color="radial-gradient(circle, #6d28d9, transparent)" delay={4} />
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>

        {/* Header */}
        <motion.div {...fadeUp(0.05)} style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 0.3rem' }}>Dashboard</p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: '#f3f0ff', margin: 0, lineHeight: 1.1 }}>
              Welcome back,{' '}
              <span style={{ background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {userName}
              </span>
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#4b5563', margin: '0.5rem 0 0' }}>Here's what's happening in your community today.</p>
          </div>
          <div style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#4b5563',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '10px', padding: '0.5rem 1rem', letterSpacing: '0.04em', whiteSpace: 'nowrap',
          }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </div>

        {/* Quick Actions */}
        <motion.div {...fadeUp(0.42)} style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.9rem' }}>Quick Actions</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <ActionBtn primary label="Add New Item" onClick={() => navigate('/add-item')}
              icon={<svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/></svg>}
            />
            <ActionBtn label="Browse Community" onClick={() => navigate('/browse')} />
            <ActionBtn label="My Profile" onClick={() => navigate('/profile')} />
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div {...fadeUp(0.5)} style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
          padding: '1.75rem',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.72rem', color: '#4b5563', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Recent Activity</p>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#7c3aed', cursor: 'pointer', letterSpacing: '0.04em' }}>View all →</span>
          </div>
          <ActivityRow dotColor="#10b981" title="Power Drill borrowed by Ashika" time="2 hours ago" badge="+15 credits" badgeColor="#10b981" border />
          <ActivityRow dotColor="#0ea5e9" title="New item: Camera Lens added"    time="1 day ago"   badge="New"         badgeColor="#0ea5e9" border />
          <ActivityRow dotColor="#a78bfa" title="Joined successfully"            time="Today"       badge="Welcome"     badgeColor="#a78bfa" border={false} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;