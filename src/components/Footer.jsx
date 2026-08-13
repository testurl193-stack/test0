import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link to="/" className="footer__brand-logo">
              سعودي
            </Link>
            <p className="footer__brand-text">
              متجر سعودي متخصص في توفير أرقى العبايات، النقاب، الخمار ومكملات الحجاب بخامات فاخرة عالية الجودة وتصاميم عصرية يناسب أسلوبكِ الراقي.
            </p>
            <div className="footer__social">
              <a href="#" onClick={(e) => e.preventDefault()} className="footer__social-link" aria-label="إنستجرام">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="footer__social-link" aria-label="فيسبوك">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="#" onClick={(e) => e.preventDefault()} className="footer__social-link" aria-label="تيك توك">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer__title">تسوقي معنا</h4>
            <ul className="footer__links">
              <li><Link to="/">الصفحة الرئيسية</Link></li>
              <li><Link to="/shop">جميع المنتجات</Link></li>
              <li><Link to="/shop?category=abayas">قسم العبايات</Link></li>
              <li><Link to="/shop?category=niqab">قسم النقاب</Link></li>
              <li><Link to="/shop?category=khimar">قسم الخمار</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">تواصل معنا</h4>
            <div className="footer__contact-item">
              <span>المملكة العربية السعودية</span>
            </div>
            <div className="footer__contact-item">
              <span dir="ltr">+966 50 000 0000</span>
            </div>
            <div className="footer__contact-item">
              <span>support@saudi-store.com</span>
            </div>
            <div className="footer__contact-item">
              <span>السبت - الخميس: 9:00 ص - 10:00 م</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
