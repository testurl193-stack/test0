import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialProducts } from '../data/products';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('hadiya_products');
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  useEffect(() => {
    localStorage.setItem('hadiya_products', JSON.stringify(products));
  }, [products]);

  // returns only products whose category is visible
  // (filters out products from hidden categories)
  const getVisibleProducts = () => {
    try {
      const cats = JSON.parse(localStorage.getItem('hadiya_categories') || '[]');
      if (!cats.length) return products;
      const hiddenIds = new Set(cats.filter(c => c.visible === false).map(c => c.id));
      if (!hiddenIds.size) return products;
      return products.filter(p => !hiddenIds.has(p.category));
    } catch {
      return products;
    }
  };

  const addProduct = (newProd) => {
    const created = {
      ...newProd,
      id: Date.now().toString(),
      image: newProd.image || '/images/products/black-niqab.png',
      productImages: newProd.productImages || [],
      sizes: newProd.sizes || [],
      colors: newProd.colors || [],
      badgeText: null,
      badge: null
    };
    setProducts((prev) => [created, ...prev]);
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields } : item))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        visibleProducts: getVisibleProducts(),
        addProduct,
        updateProduct,
        deleteProduct
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
