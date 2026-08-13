import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export const WishlistDrawer = () => {
  const { wishlistItems, isWishlistOpen, closeWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  return (
    <>
      <div className={`wishlist-drawer__overlay ${isWishlistOpen ? 'active' : ''}`} onClick={closeWishlist} />
      <div className={`wishlist-drawer ${isWishlistOpen ? 'active' : ''}`} id="wishlist-drawer">
        <div className="wishlist-drawer__header">
          <h3 className="cart-drawer__title">قائمة المفضلة ({wishlistItems.length})</h3>
          <button className="mobile-menu__close" onClick={closeWishlist} aria-label="إغلاق المفضلة">
            ✕
          </button>
        </div>

        <div className="wishlist-drawer__items" id="wishlist-drawer-items">
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#888' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ marginBottom: '15px', opacity: 0.5 }}>
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <p>لا توجد منتجات في قائمة المفضلة حالياً</p>
            </div>
          ) : (
            wishlistItems.map((item) => (
              <div className="cart-drawer-item" key={item.id}>
                <div className="cart-drawer-item__image">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 className="cart-drawer-item__name">{item.name}</h4>
                  <div className="cart-drawer-item__price">
                    {parseFloat(item.price).toLocaleString('ar-EG')} ج.م
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '4px 12px', fontSize: '12px' }}
                      onClick={() => {
                        addToCart(item);
                        removeFromWishlist(item.id);
                      }}
                    >
                      أضف للسلة
                    </button>
                    <button
                      style={{ color: '#ef4444', fontSize: '12px', border: 'none', background: 'none', cursor: 'pointer' }}
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
