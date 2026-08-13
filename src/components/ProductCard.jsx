import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const wishlisted = isInWishlist(product.id);

  const getBadgeClass = (badge) => {
    if (badge === 'hot') return 'product-card__badge--hot';
    if (badge === 'new') return 'product-card__badge--new';
    if (badge === 'sale') return 'product-card__badge--sale';
    return '';
  };

  return (
    <div className="product-card">
      <div className="product-card__image-wrapper">
        {product.badgeText && (
          <span className={`product-card__badge ${getBadgeClass(product.badge)}`}>
            {product.badgeText}
          </span>
        )}

        <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />

        <div className="product-card__actions">
          <button
            className={`product-card__action ${wishlisted ? 'wishlisted' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            aria-label="إضافة للمفضلة"
          >
            <svg viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          <Link to={`/product/${product.id}`} className="product-card__action" aria-label="عرض التفاصيل">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </Link>
        </div>

        <div className="product-card__quick-add">
          <button className="btn btn-primary" onClick={() => addToCart(product)}>
            أضف للسلة
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <span className="product-card__category">{product.categoryName || 'قسم فاخر'}</span>
        <h3 className="product-card__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-card__price">
          <span className="product-card__price-current">{parseFloat(product.price).toLocaleString('ar-EG')} ج.م</span>
          {product.oldPrice && (
            <span className="product-card__price-old">{parseFloat(product.oldPrice).toLocaleString('ar-EG')} ج.م</span>
          )}
        </div>
      </div>
    </div>
  );
};
