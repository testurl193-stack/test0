import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
      fontFamily: "'Cairo', sans-serif"
    }}>
      <div style={{ fontSize: '8rem', marginBottom: '20px' }}>🔍</div>
      <h1 style={{ fontSize: '3rem', fontWeight: 900, color: '#3D231D', marginBottom: '16px' }}>
        404
      </h1>
      <p style={{ fontSize: '1.2rem', color: '#6B5951', marginBottom: '32px', maxWidth: '500px' }}>
        عذراً، الصفحة التي تبحثين عنها غير موجودة
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          padding: '14px 32px',
          background: '#3D231D',
          color: '#fff',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '1rem',
          fontWeight: 700,
          transition: 'background 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.background = '#2B1713'}
        onMouseLeave={(e) => e.target.style.background = '#3D231D'}
      >
        العودة للصفحة الرئيسية
      </Link>
    </div>
  );
};
