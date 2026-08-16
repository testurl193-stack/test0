import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useAdminData } from '../context/AdminDataContext';
import { ProductCard } from '../components/ProductCard';

export const HomePage = () => {
  const { visibleProducts: products } = useProducts();
  const { categories } = useAdminData();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesData = [
    {
      subtitle: 'مجموعة 2026 الجديدة',
      title: 'أناقة الاحتشام والجمال',
      desc: 'تصاميم راقية تجمع بين البساطة والوقار بأجود الأقمشة الفاخرة التي تمنحكِ راحة وثقة في كل لحظة.',
      btnText: 'تسوقي التشكيلة الآن',
      link: '/shop',
      image: '/images/banner.png'
    },
    {
      subtitle: 'احتشامك اختيارك',
      title: 'نقاب بخامات مسامية ناعمة',
      desc: 'تشكيلة مميزة من النقاب المائل وبدون اسم المصنوع من أحدث الخامات المريحة للتنفس طوال اليوم.',
      btnText: 'اكتشفي قسم النقاب',
      link: '/shop?category=niqab',
      image: '/images/banner.png'
    },
    {
      subtitle: 'عروض حصرية',
      title: 'خصومات تصل إلى 40%',
      desc: 'لا تفوتي فرصة الحصول على أجمل عبايات وخمار الحجاب بأفضل الأسعار لفترة محدودة.',
      btnText: 'تسوقي العروض الآن',
      link: '/shop',
      image: '/images/banner.png'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slidesData.length]);

  const visibleCats = [...(categories || [])]
    .filter(c => c?.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const pickCategoryImage = (catId) => {
    const p = products.find(x => x.category === catId);
    return p?.image || '/images/products/black-niqab.png';
  };

  return (
    <main>
      <div className="container">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero__slider">
            {slidesData.map((slide, idx) => (
              <div key={idx} className={`hero__slide ${idx === currentSlide ? 'active' : ''}`}>
                <img src={slide.image} alt={slide.title} className="hero__slide-bg" />
                <div className="hero__overlay" />
                <div className="hero__content">
                  <span className="hero__subtitle">{slide.subtitle}</span>
                  <h1 className="hero__title">{slide.title}</h1>
                  <p className="hero__desc">{slide.desc}</p>
                  <div className="hero__cta">
                    <Link to={slide.link} className="btn btn-secondary btn-lg">
                      {slide.btnText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero__nav">
            {slidesData.map((_, idx) => (
              <div
                key={idx}
                className={`hero__dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>

          <div className="hero__arrows">
            <button
              className="hero__arrow"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length)}
              aria-label="السابق"
            >
              <svg viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              className="hero__arrow"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slidesData.length)}
              aria-label="التالي"
            >
              <svg viewBox="0 0 24 24">
                <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>

        {/* Features Bar */}
        <section className="features-bar">
          <div className="features-bar__grid">
            <div className="feature-item">
              <div className="feature-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <div>
                <h4 className="feature-item__title">شحن سريع وآمن</h4>
                <p className="feature-item__text">توصيل لكل المحافظات خلال 48 ساعة</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h4 className="feature-item__title">جودة مضمونة 100%</h4>
                <p className="feature-item__text">أجود خامات الكريب والقطن الفاخر</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <h4 className="feature-item__title">دعم متواصل</h4>
                <p className="feature-item__text">خدمة عملاء ممتازة لتلبية كل استفساراتكِ</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div>
                <h4 className="feature-item__title">الدفع عند الاستلام</h4>
                <p className="feature-item__text">مع إمكانية الفحص والمعاينة قبل الدفع</p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="section categories">
          <div className="section-header">
            <h2>تسوقي حسب الفئة</h2>
            <p>اكتشفي الأقسام المتنوعة لعلامة سعودي وتأنقي بما يناسب ذوقكِ الفريد</p>
          </div>

          <div className="categories__grid">
            {visibleCats.map((cat) => {
              const count = products.filter(p => p.category === cat.id).length;
              return (
                <Link key={cat.id} to={`/shop?category=${encodeURIComponent(cat.id)}`} className="category-card">
                  <img src={pickCategoryImage(cat.id)} alt={cat.name} className="category-card__image" loading="lazy" />
                  <div className="category-card__overlay">
                    <h3 className="category-card__name">قسم {cat.name}</h3>
                    <span className="category-card__count">{count} منتجات</span>
                  </div>
                  <div className="category-card__arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Featured Products */}
        <section className="section products-section">
          <div className="section-header">
            <h2>الأكثر مبيعاً ورواجاً</h2>
            <p>اختيارات عميلاتنا المفضلة بتصميماتها المميزة وجودتها الاستثنائية</p>
          </div>

          <div className="products-grid">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Promo Banner */}
        <section className="section">
          <div className="promo-banner">
            <img src="/images/banner.png" alt="بانر سعودي" className="promo-banner__bg" loading="lazy" />
            <div className="promo-banner__overlay" />
            <div className="promo-banner__content">
              <h2 className="promo-banner__title">احتشامك اختيارك وجمالك</h2>
              <p className="promo-banner__text">
                نعتني بكافة التفاصيل لنقدم لكِ عبايات ونقاب وخمار بأعلى معايير الجودة والراحة مع المحافظة على قيم الوقار والجمال.
              </p>
              <Link to="/shop" className="btn btn-secondary btn-lg">
                استكشفي المجموعات الكاملة
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};
