import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const CartDrawer = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, getTotalPrice, getTotalCount } = useCart();

  const totalCount = getTotalCount();
  const totalPrice = getTotalPrice();

  return (
    <>
      <div className={`cart-drawer__overlay ${isCartOpen ? 'active' : ''}`} onClick={closeCart} />
      <div className={`cart-drawer ${isCartOpen ? 'active' : ''}`} id="cart-drawer">
        <div className="cart-drawer__header">
          <h3 className="cart-drawer__title">سلة التسوق ({totalCount})</h3>
          <button className="mobile-menu__close" onClick={closeCart} aria-label="إغلاق السلة">
            ✕
          </button>
        </div>

        <div className="cart-drawer__items" id="cart-drawer-items">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#888' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ marginBottom: '15px', opacity: 0.5 }}>
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>سلتكِ فارغة حالياً</p>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div className="cart-drawer-item" key={`${item.id}-${item.color}-${item.size}-${idx}`}>
                <div className="cart-drawer-item__image">
                  <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 className="cart-drawer-item__name">{item.name}</h4>
                  <div style={{ fontSize: '11px', color: '#777', marginBottom: '4px' }}>
                    اللون: {item.color} | المقاس: {item.size}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                    <span className="cart-drawer-item__price">
                      {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                    </span>
                    <div className="quantity-selector" style={{ transform: 'scale(0.85)', transformOrigin: 'left center' }}>
                      <button className="quantity-selector__btn" onClick={() => updateQuantity(item.id, item.color, item.size, -1)}>-</button>
                      <input type="text" className="quantity-selector__input" value={item.quantity} readOnly />
                      <button className="quantity-selector__btn" onClick={() => updateQuantity(item.id, item.color, item.size, 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>الإجمالي:</span>
              <span>{totalPrice.toLocaleString('ar-EG')} ج.م</span>
            </div>
            <Link to="/checkout" className="btn btn-primary" style={{ width: '100%' }} onClick={closeCart}>
              إتمام الطلب والدفع
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
