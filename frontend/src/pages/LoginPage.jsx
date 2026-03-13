import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { endpoints } from '../api/api';

/* ── Floating aurora orbs ─────────────────────────────────────── */
const Orb = ({ cx, cy, r, color, delay }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: cx, top: cy,
      width: r * 2, height: r * 2,
      borderRadius: '50%',
      background: color,
      filter: 'blur(80px)',
      opacity: 0.35,
      pointerEvents: 'none',
    }}
    animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.08, 1] }}
    transition={{ duration: 8, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
);

/* ── Animated input field ─────────────────────────────────────── */
const Field = ({ label, id, name, type = 'text', placeholder, defaultValue = '' }) => {
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const active = focused || value.length > 0;

  return (
    <div style={{ position: 'relative', marginBottom: '1.4rem' }}>
      <label
        htmlFor={id}
        style={{
          position: 'absolute', left: '1rem', pointerEvents: 'none',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: active ? '0.68rem' : '0.875rem',
          color: active ? '#a78bfa' : '#6b7280',
          top: active ? '0.35rem' : '50%',
          transform: active ? 'none' : 'translateY(-50%)',
          transition: 'all 0.2s ease',
          letterSpacing: active ? '0.08em' : '0.02em',
          textTransform: active ? 'uppercase' : 'none',
          zIndex: 1,
        }}
      >
        {label}
      </label>
      <input
        id={id} name={name} type={type}
        value={value}
        onChange={e => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={focused ? placeholder : ''}
        required
        style={{
          width: '100%',
          padding: active ? '1.6rem 1rem 0.5rem' : '1rem',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${focused ? 'rgba(167,139,250,0.6)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '12px',
          color: '#f3f0ff',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.95rem',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
          boxShadow: focused
            ? '0 0 0 3px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.05)'
            : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      />
    </div>
  );
};

/* ── Main component ───────────────────────────────────────────── */
const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const existingToken = localStorage.getItem('token');
    if (existingToken === 'demo-auth-token') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    try {
      const response = await endpoints.auth.login({ email, password });
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 20% 50%, #0d0521 0%, #06000f 60%, #000208 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflowX: 'hidden', overflowY: 'auto', position: 'relative', padding: '2rem',
      boxSizing: 'border-box',
    }}>
      {/* Aurora orbs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <Orb cx="-10%" cy="5%"  r={320} color="radial-gradient(circle, #7c3aed, transparent)" delay={0} />
        <Orb cx="70%"  cy="-5%" r={280} color="radial-gradient(circle, #0ea5e9, transparent)" delay={2} />
        <Orb cx="60%"  cy="70%" r={240} color="radial-gradient(circle, #6d28d9, transparent)" delay={4} />
        <Orb cx="-5%"  cy="65%" r={200} color="radial-gradient(circle, #0891b2, transparent)" delay={1.5} />
      </div>

      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <motion.div
        style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '460px', marginTop: 'auto', marginBottom: 'auto' }}
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px', padding: '3rem 2.5rem',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>

          {/* Logo mark */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <motion.div
              style={{
                width: 48, height: 48, borderRadius: '14px',
                background: 'linear-gradient(135deg, #7c3aed, #0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(124,58,237,0.4)',
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </div>

          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
            <motion.h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '2.4rem', fontWeight: 300,
                color: '#f3f0ff', margin: '0 0 0.4rem',
                letterSpacing: '-0.01em', lineHeight: 1.1,
              }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.85rem', color: '#6b7280', margin: 0,
                letterSpacing: '0.06em', textTransform: 'uppercase',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              Sign in to your account
            </motion.p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  background: 'rgba(239,68,68,0.12)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px', padding: '0.75rem 1rem',
                  marginBottom: '1.5rem', color: '#fca5a5',
                  fontSize: '0.83rem', fontFamily: "'DM Sans', sans-serif",
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '1rem' }}>⚠</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Field label="Email Address" id="email"    name="email"    type="email"    placeholder="you@example.com" />
            <Field label="Password"      id="password" name="password" type="password" placeholder="Your password" />

            {/* Remember + Forgot */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: '1.6rem',
            }}>
              <label style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#6b7280',
              }}>
                <input
                  type="checkbox"
                  name="remember-me"
                  style={{ accentColor: '#7c3aed', width: 14, height: 14 }}
                />
                Remember me
              </label>
              <a
                href="#"
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem',
                  color: '#a78bfa', textDecoration: 'none',
                  borderBottom: '1px solid rgba(167,139,250,0.3)', paddingBottom: '1px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.target.style.color = '#c4b5fd'; }}
                onMouseLeave={e => { e.target.style.color = '#a78bfa'; }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={!loading ? { scale: 1.015 } : {}}
              whileTap={!loading ? { scale: 0.985 } : {}}
              style={{
                width: '100%', padding: '0.95rem',
                background: loading
                  ? 'rgba(124,58,237,0.3)'
                  : 'linear-gradient(135deg, #7c3aed 0%, #0ea5e9 100%)',
                border: 'none', borderRadius: '12px',
                color: '#fff', fontFamily: "'DM Sans', sans-serif",
                fontSize: '0.9rem', fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 8px 32px rgba(124,58,237,0.35)',
                transition: 'background 0.3s ease, box-shadow 0.3s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                  Signing In…
                </>
              ) : 'Sign In'}
            </motion.button>
          </motion.form>

          {/* Divider + Sign up link */}
          <div style={{ marginTop: '1.8rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.2rem' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#374151', letterSpacing: '0.06em', textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.85rem', color: '#4b5563', margin: 0 }}>
              Don't have an account?{' '}
              <a
                href="/signup"
                style={{
                  color: '#a78bfa', textDecoration: 'none', fontWeight: 500,
                  borderBottom: '1px solid rgba(167,139,250,0.3)', paddingBottom: '1px',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => { e.target.style.color = '#c4b5fd'; e.target.style.borderColor = 'rgba(196,181,253,0.5)'; }}
                onMouseLeave={e => { e.target.style.color = '#a78bfa'; e.target.style.borderColor = 'rgba(167,139,250,0.3)'; }}
              >
                Create account
              </a>
            </p>
          </div>
        </div>

        {/* Bottom note */}
        <motion.p
          style={{
            textAlign: 'center', marginTop: '1.5rem',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '0.72rem', color: '#374151', letterSpacing: '0.04em',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Protected by end-to-end encryption
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;