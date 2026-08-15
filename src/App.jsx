import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import './styles/style.css';
import './styles/animations.css';

import { ToastProvider } from './context/ToastContext';
import { ProductProvider } from './context/ProductContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { AdminProvider } from './context/AdminContext';
import { AdminDataProvider } from './context/AdminDataContext';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { MobileMenuDrawer } from './components/MobileMenuDrawer';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { NotFoundPage } from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function AdminLayout() {
  return (
    <Routes>
      <Route path="/a7d9f2e8b1c3/login" element={<AdminLoginPage />} />
      <Route path="/a7d9f2e8b1c3/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

function MainLayout() {
  const location = useLocation();

  // Check if on admin route
  const isAdminRoute = location.pathname.startsWith('/a7d9f2e8b1c3');

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTopBtn, setShowScrollTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin routes - no header/footer
  if (isAdminRoute) {
    return (
      <>
        <ScrollToTop />
        <AdminLayout />
      </>
    );
  }

  // Regular site routes
  return (
    <>
      <ScrollToTop />
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(true)}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccessPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Footer />
      <MobileBottomNav onOpenSearch={() => setIsSearchOpen(true)} />

      <CartDrawer />
      <WishlistDrawer />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <MobileMenuDrawer isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <button
        className={`scroll-top ${showScrollTopBtn ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="الرجوع للأعلى"
      >
        ↑
      </button>
    </>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AdminProvider>
        <AdminDataProvider>
        <ProductProvider>
          <WishlistProvider>
            <CartProvider>
              <BrowserRouter>
                <MainLayout />
              </BrowserRouter>
            </CartProvider>
          </WishlistProvider>
        </ProductProvider>
        </AdminDataProvider>
      </AdminProvider>
    </ToastProvider>
  );
}
