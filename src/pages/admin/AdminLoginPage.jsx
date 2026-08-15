import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export const AdminLoginPage = () => {
  const { isAuthenticated, login } = useAdmin();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/a7d9f2e8b1c3/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API delay for security
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = login(password);
    
    if (success) {
      // Redirect handled by Navigate above
    } else {
      setError('كلمة المرور غير صحيحة');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        {/* Logo */}
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <img src="/images/logo.png" alt="سعودي نقاب" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h1 style={styles.title}>لوحة التحكم</h1>
          <p style={styles.subtitle}>سعودي نقاب</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخلي كلمة المرور"
              style={styles.input}
              disabled={isLoading}
              autoFocus
            />
          </div>

          {error && (
            <div style={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              ...styles.button,
              ...(isLoading ? styles.buttonDisabled : {})
            }}
            disabled={isLoading || !password}
          >
            {isLoading ? (
              <>
                <span style={styles.spinner}>⏳</span>
                جاري التحقق...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={styles.footer}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
          <span>نظام محمي بكلمة مرور</span>
        </div>
      </div>

      {/* Background decoration */}
      <div style={styles.bgDecoration1} />
      <div style={styles.bgDecoration2} />
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(160deg, #1C1208 0%, #0D0A06 60%, #111 100%)',
    fontFamily: "'Cairo', sans-serif",
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  
  loginBox: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(196,120,58,0.25)',
    borderRadius: '20px',
    padding: '44px 32px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
    position: 'relative',
    zIndex: 10,
    backdropFilter: 'blur(12px)',
  },

  logoSection: {
    textAlign: 'center',
    marginBottom: '40px',
  },

  logo: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    margin: '0 auto',
    marginBottom: '16px',
    background: 'transparent',
  },

  title: {
    fontSize: '1.6rem',
    fontWeight: 900,
    margin: '0 0 8px 0',
    color: '#F0E6D6',
  },

  subtitle: {
    fontSize: '0.85rem',
    color: 'rgba(196,168,130,0.7)',
    margin: 0,
    fontWeight: 500,
  },

  form: {
    marginBottom: '24px',
  },

  inputGroup: {
    marginBottom: '24px',
  },

  label: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'rgba(196,168,130,0.8)',
    marginBottom: '10px',
  },

  input: {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(255,255,255,0.07)',
    border: '1.5px solid rgba(196,120,58,0.25)',
    borderRadius: '12px',
    fontSize: '1rem',
    color: '#F0E6D6',
    fontFamily: "'Cairo', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    minHeight: '52px',
  },

  button: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #5C2E0A 0%, #C4783A 100%)',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 800,
    color: '#fff',
    cursor: 'pointer',
    fontFamily: "'Cairo', sans-serif",
    transition: 'opacity 0.2s',
    boxShadow: '0 6px 20px rgba(92,46,10,0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    minHeight: '52px',
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  error: {
    padding: '12px 16px',
    background: 'rgba(220,38,38,0.12)',
    border: '1px solid rgba(220,38,38,0.3)',
    borderRadius: '10px',
    color: '#F87171',
    fontSize: '0.88rem',
    marginBottom: '18px',
    textAlign: 'center',
    fontWeight: 600,
  },

  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '0.75rem',
    color: 'rgba(196,168,130,0.4)',
    paddingTop: '22px',
    borderTop: '1px solid rgba(196,120,58,0.12)',
    fontWeight: 500,
  },

  spinner: {
    display: 'inline-block',
  },

  bgDecoration1: { display: 'none' },
  bgDecoration2: { display: 'none' },
};

// Add keyframe animations via style tag
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = ``;
  document.head.appendChild(style);
}

export default AdminLoginPage;
