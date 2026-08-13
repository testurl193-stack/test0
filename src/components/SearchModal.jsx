import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

export const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const { products } = useProducts();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className={`search-overlay ${isOpen ? 'active' : ''}`} id="search-overlay">
      <div className="search-overlay__inner">
        <div className="search-overlay__input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="search-overlay__input"
            placeholder="ابحثي عن عباية، نقاب، خمار..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-overlay__close" onClick={onClose} aria-label="إغلاق البحث">
            ✕
          </button>
        </div>

        {query.trim() !== '' && (
          <div
            style={{
              background: '#fff',
              borderRadius: '10px',
              marginTop: '10px',
              maxHeight: '320px',
              overflowY: 'auto',
              padding: '12px'
            }}
          >
            {filteredProducts.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#888', padding: '15px' }}>لا توجد نتائج تطابق بحثكِ</p>
            ) : (
              filteredProducts.map((prod) => (
                <Link
                  key={prod.id}
                  to={`/product/${prod.id}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderBottom: '1px solid #eee',
                    color: '#222'
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <div>
                    <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{prod.name}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#C8A96E', fontWeight: 700 }}>
                      {parseFloat(prod.price).toLocaleString('ar-EG')} ج.م
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
