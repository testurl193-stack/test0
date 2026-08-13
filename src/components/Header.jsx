import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const Header = ({ onOpenSearch, onToggleMobileMenu }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const { getTotalCount, openCart } = useCart();
  const { wishlistItems, openWishlist } = useWishlist();

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`} id="header">
      <div className="container header__inner">
        <Link to="/" className="header__brand">
          <span className="header__logo">
            <span className="header__logo-text">هدية</span>
          </span>
        </Link>

        <nav className="header__nav">
          <ul className="header__nav-list">
            <li>
              <Link to="/" className={`header__nav-link ${isActive('/') ? 'active' : ''}`}>
                الرئيسية
              </Link>
            </li>
            <li>
              <Link to="/shop" className={`header__nav-link ${isActive('/shop') && !location.search ? 'active' : ''}`}>
                المتجر
              </Link>
            </li>
            <li>
              <Link to="/shop?category=abayas" className={`header__nav-link ${location.search.includes('abayas') ? 'active' : ''}`}>
                العبايات
              </Link>
            </li>
            <li>
              <Link to="/shop?category=niqab" className={`header__nav-link ${location.search.includes('niqab') ? 'active' : ''}`}>
                النقاب
              </Link>
            </li>
            <li>
              <Link to="/shop?category=khimar" className={`header__nav-link ${location.search.includes('khimar') ? 'active' : ''}`}>
                الخمار
              </Link>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <button className="header__action-btn" onClick={onOpenSearch} aria-label="بحث في المتجر">
            <svg viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button className="header__action-btn" id="wishlist-btn" onClick={openWishlist} aria-label="المفضلة">
            <svg viewBox="0 0 24 24">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`header__badge ${wishlistCount > 0 ? 'visible' : ''}`}>{wishlistCount}</span>
          </button>

          <button className="header__action-btn" onClick={openCart} aria-label="سلة التسوق">
            <svg viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`header__badge ${cartCount > 0 ? 'visible' : ''}`}>{cartCount}</span>
          </button>

          <button className="header__menu-toggle" onClick={onToggleMobileMenu} aria-label="القائمة البرمجية">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};
