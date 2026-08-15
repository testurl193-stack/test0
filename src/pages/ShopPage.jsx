import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';

export const ShopPage = () => {
  const { visibleProducts: products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCat = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' || p.category === selectedCategory || p.categoryName === selectedCategory;
    const matchesPrice = parseFloat(p.price) <= maxPrice;
    return matchesCat && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
    return 0; // featured
  });

  return (
    <main className="shop-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <span>المتجر الكامل</span>
        </div>

        {/* Header */}
        <div className="shop-page__header">
          <div>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>جميع المنتجات</h1>
            <span className="shop-page__count">
              عرض {sortedProducts.length} من أصل {products.length} منتج
            </span>
          </div>

          <div className="shop-page__sort">
            <label htmlFor="sort-select">ترتيب حسب:</label>
            <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="featured">الأكثر مبيعاً</option>
              <option value="price-low">السعر: من الأقل إلى الأعلى</option>
              <option value="price-high">السعر: من الأعلى إلى الأقل</option>
            </select>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="shop-page__layout">
          {/* Sidebar */}
          <aside className="shop-sidebar">
            <button
              className="shop-sidebar__toggle"
              onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            >
              <span>{isSidebarOpenMobile ? 'إخفاء الفلاتر' : 'تصفية المنتجات'}</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                width="18"
                height="18"
                style={{
                  transform: isSidebarOpenMobile ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              >
                <path d="M3 4h18M7 8h10M11 12h2" />
              </svg>
            </button>

            <div className={`shop-sidebar__body ${isSidebarOpenMobile ? 'open' : ''}`}>
              <div className="filter-group">
                <h3 className="filter-group__title">الأقسام</h3>
                <ul className="filter-group__list">
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={selectedCategory === 'all'}
                        onChange={() => handleCategoryChange('all')}
                      />{' '}
                      جميع الأقسام
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={selectedCategory === 'niqab'}
                        onChange={() => handleCategoryChange('niqab')}
                      />{' '}
                      النقاب
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={selectedCategory === 'abayas'}
                        onChange={() => handleCategoryChange('abayas')}
                      />{' '}
                      العبايات
                    </label>
                  </li>
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        className="filter-checkbox"
                        checked={selectedCategory === 'khimar'}
                        onChange={() => handleCategoryChange('khimar')}
                      />{' '}
                      الخمار
                    </label>
                  </li>
                </ul>
              </div>

              <div className="filter-group">
                <h3 className="filter-group__title">السعر (حتى)</h3>
                <div className="price-range">
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={maxPrice}
                    className="price-range__slider"
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  />
                  <div className="price-range__values">
                    <span>100 ج.م</span>
                    <span>{maxPrice.toLocaleString('ar-EG')} ج.م</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            {sortedProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f9f9f9', borderRadius: '12px' }}>
                <h3>لا توجد منتجات تطابق الفلترة المحددة</h3>
                <button className="btn btn-secondary" style={{ marginTop: '15px' }} onClick={() => { setSelectedCategory('all'); setMaxPrice(1000); }}>
                  إعادة ضبط الفلاتر
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {sortedProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
