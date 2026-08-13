import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const OrderSuccessPage = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  const whatsappPhone = '201040871855';

  const generateWhatsAppMessage = () => {
    if (!orderData) return '';
    const text = `مرحباً متجر سعودي 👋
أود تأكيد طلبي برقم: ${orderData.orderId}
الاسم: ${orderData.customer.fullName}
الهاتف: ${orderData.customer.phone}
طريقة الدفع: ${orderData.paymentMethod}
المبلغ الإجمالي: ${orderData.totalAmount} ج.م
العنوان: ${orderData.customer.city} - ${orderData.customer.address}`;
    return encodeURIComponent(text);
  };

  return (
    <main className="container" style={{ padding: '60px 15px', minHeight: '80vh' }}>
      <div style={{ maxWidth: '650px', margin: '0 auto', background: '#fff', padding: '40px 30px', borderRadius: '16px', border: '1px solid var(--color-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        
        {/* Success Icon */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', margin: '0 auto 20px' }}>
          ✓
        </div>

        <h1 style={{ fontSize: '1.8rem', color: 'var(--color-heading)', fontWeight: 900, marginBottom: '10px' }}>
          شكراً لثقتكِ بـ متجر سعودي! 🎉
        </h1>
        <p style={{ color: '#555', fontSize: '1.05rem', marginBottom: '25px' }}>
          تم استلام طلبكِ بنجاح وجاري تجهيزه وتسليمه لشركة الشحن.
        </p>

        {orderData ? (
          <div style={{ background: 'var(--color-bg-alt)', padding: '20px', borderRadius: '10px', textAlign: 'right', marginBottom: '30px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
              <span>رقم الطلب:</span>
              <strong style={{ color: 'var(--color-secondary)', fontSize: '1.1rem' }}>{orderData.orderId}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>الاسم:</span>
              <strong>{orderData.customer.fullName}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>طريقة الدفع:</span>
              <strong style={{ color: '#D9251D' }}>{orderData.paymentMethod}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>عنوان التوصيل:</span>
              <strong>{orderData.customer.city} - {orderData.customer.address}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '10px' }}>
              <span>المبلغ الإجمالي:</span>
              <span style={{ color: 'var(--color-primary)' }}>{orderData.totalAmount.toLocaleString('ar-EG')} ج.م</span>
            </div>

            {/* If Vodafone Cash Receipt Preview */}
            {orderData.receiptPreview && (
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #ccc' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginBottom: '8px', color: '#444' }}>
                  📸 صورة إيصال التحويل المرفقة:
                </div>
                <img
                  src={orderData.receiptPreview}
                  alt="إيصال التحويل"
                  style={{ maxHeight: '150px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            )}
          </div>
        ) : null}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orderData && (
            <a
              href={`https://wa.me/${whatsappPhone}?text=${generateWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
              style={{ background: '#25D366', color: '#fff', border: 'none', gap: '8px' }}
            >
              💬 إرسال تفاصيل الطلب والإيصال عبر الواتساب فوراً
            </a>
          )}

          <Link to="/shop" className="btn btn-primary btn-lg">
            مواصلة التسوق في المتجر
          </Link>
        </div>

      </div>
    </main>
  );
};
