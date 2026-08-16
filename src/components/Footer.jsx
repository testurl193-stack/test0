import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminData } from '../context/AdminDataContext';

export const Footer = () => {
  const { settings, categories } = useAdminData();
  const storeName = settings?.storeName || 'سعودي';
  const whatsapp = (settings?.whatsapp || '').toString().replace(/\s+/g, '');
  const address = settings?.address || 'بورسعيد';

  const visibleCats = [...(categories || [])]
    .filter(c => c?.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const fb = settings?.facebook || '';
  const ig = settings?.instagram || '';
  const tt = settings?.tiktok || '';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="footer__brand-logo">
              {storeName}
            </Link>
            <p className="footer__brand-text">
              متجر سعودي متخصص في توفير أرقى العبايات، النقاب، الخمار ومكملات الحجاب بخامات فاخرة عالية الجودة وتصاميم عصرية يناسب أسلوبكِ الراقي.
            </p>
            <div className="footer__social">
              {fb && (
                <a href={fb} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="فيسبوك">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp.startsWith('20') ? whatsapp : `20${whatsapp.replace(/^0/, '')}`}`} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="واتساب">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </a>
              )}
              {ig && (
                <a href={ig} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="إنستجرام">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
              )}
              {tt && (
                <a href={tt} target="_blank" rel="noopener noreferrer" className="footer__social-link" aria-label="تيكتوك">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 3v12a4 4 0 1 1-4-4" />
                    <path d="M16 3c0 3 2 5 5 5" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="footer__title">تسوقي معنا</h4>
            <ul className="footer__links">
              <li><Link to="/">الصفحة الرئيسية</Link></li>
              <li><Link to="/shop">جميع المنتجات</Link></li>
              {visibleCats.map((cat) => (
                <li key={cat.id}><Link to={`/shop?category=${encodeURIComponent(cat.id)}`}>قسم {cat.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__title">تواصل معنا</h4>
            <div className="footer__contact-item">
              <span>جمهورية مصر العربية - {address}</span>
            </div>
            {whatsapp && (
              <div className="footer__contact-item">
                <span>واتساب <a href={`https://wa.me/${whatsapp.startsWith('20') ? whatsapp : `20${whatsapp.replace(/^0/, '')}`}`} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{whatsapp}</a></span>
              </div>
            )}
            <div className="footer__contact-item">
              <span>مفتوح على مدار 24 ساعة (طوال أيام الأسبوع)</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
