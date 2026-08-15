import React, { useState, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductsManagement } from './components/ProductsManagement';
import { OrdersManagement } from './components/OrdersManagement';
import { CategoriesManagement } from './components/CategoriesManagement';
import { CouponsManagement } from './components/CouponsManagement';
import { StoreSettings } from './components/StoreSettings';

const C = {
  // Browns
  brown:      '#5C2E0A',   // داكن — أزرار، active
  brownMid:   '#8B4513',   // متوسط — accents
  brownLight: '#C4783A',   // فاتح — hover, gradients
  brownFaint: '#EDE0D4',   // خفيف جداً — خلفيات فاتحة

  // Greys
  bg:         '#F2F2F2',   // خلفية الصفحة
  bgDeep:     '#E6E1DC',   // خلفية أعمق قليلاً
  card:       '#FFFFFF',   // البطاقات
  border:     '#D9D0C7',   // الحدود
  muted:      '#7A7A7A',   // نص ثانوي
  mutedLight: '#A8A8A8',   // نص أضعف

  // Text
  text:       '#1A1A1A',   // نص رئيسي
  textSoft:   '#3D3D3D',   // نص ناعم

  // Sidebar
  sidebar:    '#1C1208',   // الـ sidebar — أسود بني داكن جداً
  sidebarBorder: '#2E1E0D',
  sidebarText: '#C4A882',  // نص sidebar غير active
};

const NAV = [
  { key: 'overview',    label: 'الرئيسية',   icon: HomeIcon },
  { key: 'orders',      label: 'الطلبات',     icon: OrderIcon },
  { key: 'products',    label: 'المنتجات',    icon: ProductIcon },
  { key: 'categories',  label: 'التصنيفات',   icon: CategoryIcon },
  { key: 'coupons',     label: 'الكوبونات',   icon: CouponIcon },
  { key: 'settings',    label: 'الإعدادات',   icon: SettingsIcon },
];

function HomeIcon() { return <Ico><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><polyline points="9,22 9,12 15,12 15,22"/></Ico>; }
function OrderIcon() { return <Ico><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></Ico>; }
function ProductIcon() { return <Ico><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></Ico>; }
function CategoryIcon() { return <Ico><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Ico>; }
function CouponIcon() { return <Ico><path d="M7 7h.01M17 17h.01M3 6a3 3 0 003 3 3 3 0 00-3 3v2a2 2 0 002 2h14a2 2 0 002-2v-2a3 3 0 00-3-3 3 3 0 003-3V6a2 2 0 00-2-2H5a2 2 0 00-2 2v0z"/></Ico>; }
function SettingsIcon() { return <Ico><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></Ico>; }

function Ico({ children }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
      {children}
    </svg>
  );
}

const TITLES = {
  overview: 'الرئيسية',
  orders: 'الطلبات',
  products: 'المنتجات',
  categories: 'التصنيفات',
  coupons: 'الكوبونات',
  settings: 'الإعدادات',
};

// ── Sidebar Nav Item ──────────────────────────────────────────────────────
const NavItem = ({ item, active, onClick }) => {
  const Icon = item.icon;
  return (
    <button onClick={() => onClick(item.key)}
      style={{
        display: 'flex', alignItems: 'center', gap: 13,
        padding: '13px 16px', borderRadius: 10, border: 'none',
        background: active ? `linear-gradient(135deg, ${C.brownMid}, ${C.brownLight})` : 'rgba(255,255,255,0.04)',
        color: active ? '#fff' : C.sidebarText,
        fontWeight: active ? 700 : 500, fontSize: '0.92rem',
        cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
        textAlign: 'right', width: '100%',
        transition: 'all 0.15s',
        minHeight: 50,
        boxShadow: active ? `0 3px 12px rgba(92,46,10,0.4)` : 'none',
      }}>
      <Icon />
      <span>{item.label}</span>
      {active && <div style={{ marginRight: 'auto', marginLeft: 0, width: 6, height: 6, borderRadius: '50%', background: '#fff', opacity: 0.6 }} />}
    </button>
  );
};

export const AdminDashboard = () => {
  const { isAuthenticated, isLoading, logout } = useAdmin();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const changeTab = useCallback((key) => {
    setTab(key);
    setDrawerOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    if (window.confirm('تسجيل الخروج؟')) {
      logout();
      navigate('/a7d9f2e8b1c3/login');
    }
  }, [logout, navigate]);

  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.sidebar, fontFamily: "'Cairo', sans-serif", color: C.sidebarText, fontSize: '1rem', fontWeight: 700 }}>
      جاري التحميل...
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/a7d9f2e8b1c3/login" replace />;

  // ── Sidebar Content ───────────────────────────────────────────────────────
  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: C.sidebar }}>

      {/* Logo */}
      <div style={{ padding: '20px 20px 18px', borderBottom: `1px solid ${C.sidebarBorder}`, display: 'flex', alignItems: 'center', gap: 13, flexShrink: 0 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
          <img src="/images/logo.png" alt="سعودي نقاب" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#fff', lineHeight: 1.2 }}>سعودي نقاب</div>
          <div style={{ fontSize: '0.68rem', color: C.sidebarText, marginTop: 2 }}>لوحة التحكم</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {/* Section label */}
        <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(196,168,130,0.45)', letterSpacing: '1.5px', padding: '4px 6px 10px', textTransform: 'uppercase' }}>القائمة</div>
        {NAV.map((item) => (
          <NavItem key={item.key} item={item} active={tab === item.key} onClick={changeTab} />
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 12px 22px', borderTop: `1px solid ${C.sidebarBorder}`, flexShrink: 0 }}>
        <button onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 11,
            padding: '12px 16px', borderRadius: 10, border: `1px solid rgba(220,38,38,0.25)`,
            background: 'rgba(220,38,38,0.08)', color: '#F87171',
            fontWeight: 700, fontSize: '0.88rem',
            cursor: 'pointer', fontFamily: "'Cairo', sans-serif", width: '100%', minHeight: 48,
          }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'linear-gradient(135deg, #F5F0EB 0%, #EDE8E2 25%, #E8E0D6 50%, #EAE4DC 75%, #F0EBE4 100%)', fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>

      {/* ── Desktop Sidebar ── */}
      <aside className="admin-sidebar-desktop"
        style={{ width: 252, background: C.sidebar, borderLeft: `1px solid ${C.sidebarBorder}`, position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>
        <SidebarContent />
      </aside>

      {/* ── Mobile Drawer Overlay ── */}
      {drawerOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, backdropFilter: 'blur(4px)' }}
          onClick={() => setDrawerOpen(false)} />
      )}

      {/* ── Mobile Drawer ── */}
      <aside className="admin-sidebar-mobile"
        style={{ position: 'fixed', top: 0, right: drawerOpen ? 0 : '-260px', width: 252, height: '100%', background: C.sidebar, borderLeft: `1px solid ${C.sidebarBorder}`, zIndex: 201, transition: 'right 0.26s cubic-bezier(0.4,0,0.2,1)', boxShadow: drawerOpen ? '-8px 0 36px rgba(0,0,0,0.4)' : 'none' }}>
        <SidebarContent />
      </aside>

      {/* ── Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Header ── */}
        <header style={{
          background: 'linear-gradient(135deg, #2A1506 0%, #3D1F09 100%)',
          borderBottom: `1px solid #4A2810`,
          height: 64,
          display: 'flex', alignItems: 'center',
          padding: '0 24px',
          gap: 16,
          position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          {/* Hamburger */}
          <button onClick={() => setDrawerOpen(true)} className="admin-hamburger"
            style={{ width: 42, height: 42, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: `1px solid rgba(255,255,255,0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(196,168,130,0.9)" strokeWidth="2.5" style={{ width: 20, height: 20 }}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Mobile: logo + page name */}
          <div className="admin-mobile-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, overflow: 'hidden', flexShrink: 0 }}>
              <img src="/images/logo.png" alt="سعودي نقاب" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#F0E6D6', lineHeight: 1.2 }}>سعودي نقاب</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(196,168,130,0.6)' }}>{TITLES[tab]}</div>
            </div>
          </div>

          {/* Desktop: title */}
          <div className="admin-desktop-title" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 20, borderRadius: 2, background: C.brownLight, opacity: 0.7 }} />
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#F0E6D6' }}>{TITLES[tab]}</span>
          </div>

          {/* Right: online indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(22,163,74,0.15)', border: '1px solid rgba(22,163,74,0.25)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px rgba(74,222,128,0.7)' }} />
              <span className="admin-online-label" style={{ fontSize: '0.72rem', fontWeight: 600, color: '#4ADE80' }}>متصل</span>
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main style={{ flex: 1, padding: '28px 24px', overflowY: 'auto', WebkitOverflowScrolling: 'touch', background: 'transparent' }}>
          {tab === 'overview'   && <DashboardOverview />}
          {tab === 'orders'     && <OrdersManagement />}
          {tab === 'products'   && <ProductsManagement />}
          {tab === 'categories' && <CategoriesManagement />}
          {tab === 'coupons'    && <CouponsManagement />}
          {tab === 'settings'   && <StoreSettings />}
        </main>

      </div>

      {/* ── Responsive CSS ── */}
      <style>{`
        .admin-sidebar-desktop { display: flex !important; flex-direction: column; }
        .admin-hamburger        { display: none !important; }
        .admin-sidebar-mobile   { display: none !important; flex-direction: column; }
        .admin-mobile-logo      { display: none !important; }
        .admin-desktop-title    { display: flex !important; }

        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-hamburger        { display: flex !important; }
          .admin-sidebar-mobile   { display: flex !important; }
          .admin-mobile-logo      { display: flex !important; }
          .admin-desktop-title    { display: none !important; }
          .admin-online-label     { display: none; }
        }

        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input, select, textarea, button { -webkit-appearance: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
