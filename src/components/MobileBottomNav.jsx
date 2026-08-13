import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const MobileBottomNav = ({ onOpenSearch }) => {
  const location = useLocation();
  const { getTotalCount, openCart } = useCart();
  const { wishlistItems, openWishlist } = useWishlist();

  const cartCount = getTotalCount();
  const wishlistCount = wishlistItems.length;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="mobile-bottom-nav">
      <div className="mobile-bottom-nav__inner">
        <Link to="/" className={`mobile-bottom-nav__item ${isActive('/') ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24">
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>الرئيسية</span>
        </Link>

        <Link to="/shop" className={`mobile-bottom-nav__item ${isActive('/shop') ? 'active' : ''}`}>
          <svg viewBox="0 0 24 24">
            <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>المتجر</span>
        </Link>

        <button className="mobile-bottom-nav__item" onClick={onOpenSearch}>
          <svg viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>بحث</span>
        </button>

        <button className="mobile-bottom-nav__item" onClick={openWishlist}>
          <svg viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>المفضلة</span>
          <span className={`mobile-bottom-nav__badge ${wishlistCount > 0 ? 'visible' : ''}`}>{wishlistCount}</span>
        </button>

        <button className="mobile-bottom-nav__item" onClick={openCart}>
          <svg viewBox="0 0 24 24">
            <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>السلة</span>
          <span className={`mobile-bottom-nav__badge ${cartCount > 0 ? 'visible' : ''}`}>{cartCount}</span>
        </button>
      </div>
    </div>
  );
};
