import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const { showToast } = useToast();

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <main className="cart-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <span>سلة التسوق</span>
        </div>

        <h1 style={{ fontSize: '1.8rem', marginBottom: '25px' }}>سلة التسوق الخاصة بكِ</h1>

        {cart.length === 0 ? (
          <div className="cart-empty" id="cart-empty-view">
            <div className="cart-empty__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="cart-empty__title">سلة التسوق فارغة حالياً</h2>
            <p style={{ color: '#777', marginBottom: '20px' }}>يبدو أنكِ لم تضيفي أي من العبايات أو النقاب لسلتكِ بعد.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">
              ابدأي التسوق الآن
            </Link>
          </div>
        ) : (
          <div className="cart-page__grid" id="cart-content-wrapper">
            {/* Cart Items List */}
            <div id="cart-items-container">
              {cart.map((item, idx) => (
                <div className="cart-item" key={`${item.id}-${item.color}-${item.size}-${idx}`}>
                  <div className="cart-item__image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div>
                    <h3 className="cart-item__name">{item.name}</h3>
                    <div className="cart-item__variant" style={{ fontSize: '0.85rem', color: '#555', margin: '4px 0 8px' }}>
                      اللون: <strong>{item.color}</strong> | المقاس: <strong>{item.size}</strong>
                    </div>
                    <button
                      className="cart-item__remove"
                      style={{ color: '#ef4444', fontSize: '0.85rem', border: 'none', background: 'none', cursor: 'pointer' }}
                      onClick={() => removeFromCart(item.id, item.color, item.size)}
                    >
                      إزالة القطعة
                    </button>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <div className="cart-item__price" style={{ marginBottom: '10px', fontWeight: 800, fontSize: '1.1rem' }}>
                      {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                    </div>
                    <div className="quantity-selector">
                      <button className="quantity-selector__btn" onClick={() => updateQuantity(item.id, item.color, item.size, -1)}>
                        -
                      </button>
                      <input type="text" className="quantity-selector__input" value={item.quantity} readOnly />
                      <button className="quantity-selector__btn" onClick={() => updateQuantity(item.id, item.color, item.size, 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <h3 className="cart-summary__title">ملخص الطلب</h3>

              <div className="cart-summary__row">
                <span>المجموع الفرعي:</span>
                <span>{totalPrice.toLocaleString('ar-EG')} ج.م</span>
              </div>

              <div className="cart-summary__row">
                <span>تكلفة الشحن:</span>
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>مجاناً (عرض خاص)</span>
              </div>

              <div className="cart-summary__row">
                <span>خصم كود Promocode:</span>
                <span style={{ color: 'var(--color-sale)', fontWeight: 700 }}>0 ج.م</span>
              </div>

              <div className="cart-summary__total">
                <span>الإجمالي الكلي:</span>
                <span>{totalPrice.toLocaleString('ar-EG')} ج.م</span>
              </div>

              <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '20px' }} onClick={handleCheckout}>
                تأكيد الطلب والدفع عند الاستلام
              </button>

              <Link to="/shop" style={{ display: 'block', textAlign: 'center', marginTop: '15px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                العودة لمواصلة التسوق
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
