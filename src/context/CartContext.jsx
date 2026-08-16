import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('saudi_cart_items');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          name: 'نقاب كلاسيكي بدون اسم (جبهة)',
          price: 250,
          image: '/images/products/black-niqab.png',
          color: 'أسود',
          size: 'M',
          quantity: 1
        },
        {
          id: '2',
          name: 'خمار ليلاك بودر درابيه أنيق',
          price: 320,
          image: '/images/products/lilac-khimar.png',
          color: 'ليلاك',
          size: 'L',
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('saudi_cart_items', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const color = product.color || 'أسود';
    const size = product.size || 'M';
    const qty = product.quantity || 1;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id && item.color === color && item.size === size
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            name: product.name,
            price: parseFloat(product.price),
            image: product.image,
            color,
            size,
            quantity: qty
          }
        ];
      }
    });

    setIsCartOpen(true);
    showToast('تمت إضافة المنتج للسلة بنجاح');
  };

  const removeFromCart = (id, color, size) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.id === id && (!color || item.color === color) && (!size || item.size === size))
      )
    );
    showToast('تم إزالة المنتج من السلة');
  };

  const updateQuantity = (id, color, size, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.id === id && (!color || item.color === color) && (!size || item.size === size)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalCount,
        getTotalPrice,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false)
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
