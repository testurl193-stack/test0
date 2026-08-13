import React from 'react';
import { Link } from 'react-router-dom';

export const MobileMenuDrawer = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`mobile-menu__overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`} id="mobile-menu">
        <div className="mobile-menu__header">
          <span className="header__logo" style={{ fontSize: '1.5rem' }}>
            سعودي
          </span>
          <button className="mobile-menu__close" onClick={onClose} aria-label="إغلاق القائمة">
            ✕
          </button>
        </div>
        <nav className="mobile-menu__nav">
          <Link to="/" className="mobile-menu__nav-link" onClick={onClose}>
            الرئيسية
          </Link>
          <Link to="/shop" className="mobile-menu__nav-link" onClick={onClose}>
            المتجر الرئيسي
          </Link>
          <Link to="/shop?category=abayas" className="mobile-menu__nav-link" onClick={onClose}>
            قسم العبايات
          </Link>
          <Link to="/shop?category=niqab" className="mobile-menu__nav-link" onClick={onClose}>
            قسم النقاب
          </Link>
          <Link to="/shop?category=khimar" className="mobile-menu__nav-link" onClick={onClose}>
            قسم الخمار
          </Link>
        </nav>
      </div>
    </>
  );
};
