import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = products.find((p) => p.id === id) || products[0];

  const colors = product.colors || ['أسود', 'بني', 'كحلي'];
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  const [selectedImage, setSelectedImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[1] || sizes[0]);
  const [quantity, setQuantity] = useState(1);

  const wishlisted = isInWishlist(product.id);

  const colorHexMap = {
    'أسود': '#000000',
    'بني': '#5A2A1F',
    'كحلي': '#1F2644',
    'بيج': '#D2B48C',
    'ليلاك': '#C8A2C8',
    'أوف وايت': '#F5F5DC'
  };

  return (
    <main className="product-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">الرئيسية</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`}>{product.categoryName || 'المتجر'}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="product-page__grid">
          {/* Gallery Left */}
          <div className="product-gallery">
            <div className="product-gallery__main">
              <img src={selectedImage || product.image} alt={product.name} id="main-product-img" />
              <button
                className={`product-gallery__wishlist ${wishlisted ? 'wishlisted' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label="المفضلة"
              >
                <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="22" height="22">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            <div className="product-gallery__thumbs">
              {[product.image, product.image, product.image, product.image].map((img, idx) => (
                <div
                  key={idx}
                  className={`product-gallery__thumb ${selectedImage === img ? 'active' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`صورة ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Details Right */}
          <div className="product-details">
            <h1 className="product-details__title">{product.name}</h1>

            <div className="product-details__price">
              <span className="product-details__price-current">
                {parseFloat(product.price).toLocaleString('ar-EG')} ج.م
              </span>
              {product.oldPrice && (
                <span className="product-details__price-old">
                  {parseFloat(product.oldPrice).toLocaleString('ar-EG')} ج.م
                </span>
              )}
              {product.oldPrice && (
                <span className="product-details__price-badge">
                  وفر {Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.8 }}>
              {product.description}
            </p>

            <hr className="product-details__divider" />

            {/* Colors */}
            <div>
              <span className="product-details__label">
                اللون: <strong>{selectedColor}</strong>
              </span>
              <div className="product-details__colors">
                {colors.map((col) => (
                  <span
                    key={col}
                    className={`color-swatch ${selectedColor === col ? 'active' : ''}`}
                    style={{ background: colorHexMap[col] || '#333' }}
                    onClick={() => setSelectedColor(col)}
                    title={col}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginTop: '20px' }}>
              <span className="product-details__label">
                المقاس: <strong>{selectedSize}</strong>
              </span>
              <div className="product-details__sizes">
                {sizes.map((sz) => (
                  <button
                    key={sz}
                    className={`size-btn ${selectedSize === sz ? 'active' : ''}`}
                    onClick={() => setSelectedSize(sz)}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to cart */}
            <div style={{ marginTop: '25px' }}>
              <span className="product-details__label">الكمية:</span>
              <div className="product-details__quantity">
                <div className="quantity-selector">
                  <button className="quantity-selector__btn" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    -
                  </button>
                  <input type="text" className="quantity-selector__input" value={quantity} readOnly />
                  <button className="quantity-selector__btn" onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <button
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%' }}
                    onClick={() =>
                      addToCart({
                        ...product,
                        color: selectedColor,
                        size: selectedSize,
                        quantity
                      })
                    }
                  >
                    أضف للسلة الآن
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
