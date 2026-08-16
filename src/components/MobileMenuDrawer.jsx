import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';

export const MobileMenuDrawer = ({ isOpen, onClose }) => {
  const { categories, settings } = useAdminData();

  const visibleCats = [...(categories || [])]
    .filter(c => c?.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
  const storeName = settings?.storeName || 'سعودي';

  return (
    <>
      <div className={`mobile-menu__overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
      <div className={`mobile-menu ${isOpen ? 'active' : ''}`} id="mobile-menu">
        <div className="mobile-menu__header">
          <span className="header__logo" style={{ fontSize: '1.5rem' }}>
            {settings?.storeName || 'سعودي'}
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
          {visibleCats.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${encodeURIComponent(cat.id)}`}
              className="mobile-menu__nav-link"
              onClick={onClose}
            >
              قسم {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};
