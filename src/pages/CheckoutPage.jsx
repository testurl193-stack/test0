import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export const CheckoutPage = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();

  // Form State
  const [paymentMethod, setPaymentMethod] = useState('vodafone'); // 'vodafone' or 'cod'
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    whatsapp: '',
    city: 'بورسعيد',
    address: '',
    notes: ''
  });

  // Vodafone Cash Transfer Receipt State
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  const vodafoneNumber = '01040871855';

  const egyptGovernorates = [
    'بورسعيد',
    'القاهرة',
    'الجيزة',
    'الإسكندرية',
    'القليوبية',
    'الدقهلية (المنصورة)',
    'الشرقية (الزقازيق)',
    'المنوفية (شبين الكوم)',
    'الغربية (طنطا)',
    'البحيرة (دمنهور)',
    'دمياط',
    'الإسماعيلية',
    'السويس',
    'كفر الشيخ',
    'الفيوم',
    'بني سويف',
    'المنيا',
    'أسيوط',
    'سوهاج',
    'قنا',
    'الأقصر',
    'أسوان',
    'البحر الأحمر (الغردقة)',
    'الوادي الجديد',
    'مطروح',
    'شمال سيناء (العريش)',
    'جنوب سيناء (شرم الشيخ / الطور)'
  ];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(vodafoneNumber);
    showToast('تم نسخ رقم فودافون كاش: ' + vodafoneNumber);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار صورة صحيحة لإيصال التحويل');
        return;
      }
      setReceiptImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptPreview(reader.result);
      };
      reader.readAsDataURL(file);
      showToast('تم إرفاق صورة إيصال التحويل بنجاح');
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      alert('الرجاء إدخال الاسم بالكامل');
      return;
    }
    if (!formData.phone.trim()) {
      alert('الرجاء إدخال رقم الهاتف للتواصل');
      return;
    }
    if (!formData.address.trim()) {
      alert('الرجاء إدخال العنوان التفصيلي للشحن');
      return;
    }

    if (paymentMethod === 'vodafone' && !receiptImage) {
      alert('الرجاء إرفاق صورة إيصال تحويل فودافون كاش لتأكيد الطلب');
      return;
    }

    // Generate Random Order ID
    const orderId = 'SAUDI-' + Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderId,
      customer: formData,
      paymentMethod: paymentMethod === 'vodafone' ? 'فودافون كاش' : 'الدفع عند الاستلام',
      cartItems: [...cart],
      totalAmount: totalPrice,
      receiptPreview: receiptPreview,
      date: new Date().toLocaleString('ar-EG')
    };

    // Save order in localStorage for history & Admin Page
    const existingOrders = JSON.parse(localStorage.getItem('saudi_orders') || '[]');
    localStorage.setItem('saudi_orders', JSON.stringify([orderData, ...existingOrders]));

    // Clear Cart
    clearCart();

    // Navigate to Order Success Page with state
    navigate('/order-success', { state: { orderData } });
  };

  if (cart.length === 0) {
    return (
      <main className="container" style={{ padding: '60px 15px', textAlign: 'center' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <h2 style={{ marginBottom: '15px' }}>لا توجد منتجات لإتمام الشراء</h2>
          <p style={{ color: '#666', marginBottom: '25px' }}>السلة فارغة، قم بإضافة بعض العبايات أو النقاب لسلتك أولاً.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">
            الذهاب للمتجر
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page" style={{ padding: '40px 0', background: 'var(--color-bg-alt)', minHeight: '85vh' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: '25px' }}>
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <Link to="/cart">سلة التسوق</Link>
          <span>/</span>
          <span>إتمام الطلب والدفع</span>
        </div>

        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-heading)', marginBottom: '30px', fontWeight: 800 }}>
          صفحة إتمام الطلب والدفع
        </h1>

        <form onSubmit={handleSubmitOrder}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }} className="checkout-grid">
            
            {/* Left Column: Customer Info First, Then Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
              
              {/* Box 1: Customer Details (First) */}
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '20px' }}>
                  1. بيانات المشترية والتوصيل
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>الاسم بالكامل *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      placeholder="أدخلي اسمك بالكامل"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>رقم الهاتف *</label>
                    <input
                      type="tel"
                      className="admin-input"
                      required
                      placeholder="010XXXXXXXX"
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>رقم الواتساب (اختياري)</label>
                    <input
                      type="tel"
                      className="admin-input"
                      placeholder="010XXXXXXXX"
                      dir="ltr"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>المحافظة *</label>
                    <select
                      className="admin-input"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', background: '#fff' }}
                    >
                      {egyptGovernorates.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>العنوان التفصيلي (الشارع / المنطقة / رقم العمارة والشقة) *</label>
                    <input
                      type="text"
                      className="admin-input"
                      required
                      placeholder="مثال: حي الشروق - شارع 23 يوليو - عمارة 15 شقة 4"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>ملاحظات إضافية على الطلب</label>
                    <textarea
                      rows="2"
                      placeholder="أي ملاحظات خاصة بالمقاس، اللون، أو موعد التسليم المطلوب"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      style={{ width: '100%', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Payment Method Selection (Second, After Details) */}
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h2 style={{ fontSize: '1.25rem', color: 'var(--color-heading)', marginBottom: '20px' }}>
                  2. اختر طريقة الدفع المفضلة
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  
                  {/* Option 1: Vodafone Cash */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px',
                      padding: '16px',
                      borderRadius: '10px',
                      border: paymentMethod === 'vodafone' ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                      background: paymentMethod === 'vodafone' ? '#FFFDF7' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="vodafone"
                      checked={paymentMethod === 'vodafone'}
                      onChange={() => setPaymentMethod('vodafone')}
                      style={{ marginTop: '4px', accentColor: 'var(--color-secondary)' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#D9251D' }}>فودافون كاش (Vodafone Cash)</span>
                        <span style={{ background: '#FFEBEB', color: '#D9251D', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>طريقة سريعة ومضمونة</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', marginBottom: 0 }}>
                        تحويل المبلغ مباشرة لرقم فودافون كاش المتجر وإرفاق صورة إيصال التحويل لتأكيد الحجز فوراً.
                      </p>

                      {/* Vodafone Cash Box Details */}
                      {paymentMethod === 'vodafone' && (
                        <div style={{ marginTop: '16px', padding: '16px', background: '#FFFDF0', borderRadius: '8px', border: '1px solid #FFE699' }}>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E6C280' }}>
                            <div>
                              <div style={{ fontSize: '0.8rem', color: '#888' }}>رقم فودافون كاش المحول إليه:</div>
                              <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#3D231D', letterSpacing: '1px' }} dir="ltr">
                                {vodafoneNumber}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyNumber}
                              className="btn btn-secondary"
                              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                            >
                              نسخ الرقم
                            </button>
                          </div>

                          <div style={{ marginTop: '14px', fontSize: '0.88rem', color: '#444', lineHeight: 1.6 }}>
                            <strong>خطوات التحويل:</strong>
                            <ol style={{ paddingRight: '20px', marginTop: '6px' }}>
                              <li>اطلبي كود <code style={{ background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>*9#</code> أو استخدمي تطبيق أنا فودافون.</li>
                              <li>دفع مبلغ: <strong style={{ color: '#D9251D' }}>{totalPrice.toLocaleString('ar-EG')} ج.م</strong> للرقم <strong>01040871855</strong>.</li>
                              <li>خذي سكرين شوت (لقطة شاشة) لرسالة التأكيد أو إيصال التحويل الناجح.</li>
                              <li>ارفعي صورة الإيصال بالأسفل:</li>
                            </ol>
                          </div>

                          {/* Image Upload Input */}
                          <div style={{ marginTop: '15px' }}>
                            <label style={{ display: 'block', fontWeight: 800, marginBottom: '8px', fontSize: '0.9rem', color: '#3D231D' }}>
                              رفع صورة إيصال التحويل (ضروري لتأكيد الطلب) *
                            </label>
                            
                            <input
                              type="file"
                              accept="image/*"
                              id="receipt-upload"
                              onChange={handleImageChange}
                              style={{ display: 'none' }}
                            />
                            
                            <label
                              htmlFor="receipt-upload"
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '20px',
                                border: '2px dashed var(--color-secondary)',
                                borderRadius: '8px',
                                background: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {receiptPreview ? (
                                <div style={{ textAlign: 'center' }}>
                                  <img
                                    src={receiptPreview}
                                    alt="إيصال التحويل"
                                    style={{ maxHeight: '180px', borderRadius: '6px', border: '1px solid #ddd', marginBottom: '10px' }}
                                  />
                                  <div style={{ fontSize: '0.85rem', color: 'var(--color-success)', fontWeight: 700 }}>
                                    تم إرفاق الصورة بنجاح. انقري للتغيير
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <span style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '0.95rem' }}>
                                    اضغطي هنا لاختيار صورة الإيصال من جهازك
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: '#888', marginTop: '4px' }}>
                                    (يدعم صور JPG, PNG, Screenshots)
                                  </span>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </label>

                  {/* Option 2: Cash on Delivery */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '15px',
                      padding: '16px',
                      borderRadius: '10px',
                      border: paymentMethod === 'cod' ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                      background: paymentMethod === 'cod' ? '#FFFDF7' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      style={{ marginTop: '4px', accentColor: 'var(--color-secondary)' }}
                    />
                    <div>
                      <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-heading)' }}>الدفع عند الاستلام (Cash On Delivery)</span>
                      <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px', marginBottom: 0 }}>
                        ادفع كاش لمندوب التوصيل بعد الفحص والمعاينة عند استلام الشحنة في عنوانك.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Submit Button */}
            <div>
              <div style={{ background: '#fff', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)', position: 'sticky', top: '90px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--color-heading)', marginBottom: '18px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  ملخص المنتجات ({cart.length})
                </h3>

                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', paddingLeft: '5px' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{ width: '55px', height: '65px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eee' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-heading)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#777' }}>
                          الكمية: {item.quantity} | {item.size} - {item.color}
                        </div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                        {(item.price * item.quantity).toLocaleString('ar-EG')} ج.م
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                    <span>إجمالي المنتجات:</span>
                    <span>{totalPrice.toLocaleString('ar-EG')} ج.م</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#666' }}>
                    <span>مصاريف الشحن والتوصيل:</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>مجاناً</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, color: 'var(--color-primary)', borderTop: '2px dashed var(--color-border)', paddingTop: '12px', marginTop: '5px' }}>
                    <span>المبلغ الإجمالي المطلوبة:</span>
                    <span style={{ color: 'var(--color-secondary)' }}>{totalPrice.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '25px', padding: '16px', fontSize: '1.1rem', fontWeight: 800, borderRadius: '8px' }}
                >
                  تأكيد الطلب والدفع الآن
                </button>

                <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.78rem', color: '#888' }}>
                  معلوماتك محمية ومُشفرة 100% وفق أعلى معايير الأمان
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
};
