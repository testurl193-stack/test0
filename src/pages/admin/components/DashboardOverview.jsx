import React from 'react';
import { useProducts } from '../../../context/ProductContext';
import { useAdminData } from '../../../context/AdminDataContext';

const C = {
  brown: '#5C2E0A', brownMid: '#8B4513', brownLight: '#C4783A',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', amber: '#B45309', green: '#16A34A', blue: '#1D4ED8',
  dark: '#1C1208', darkMid: '#2E1E0D',
};

const fmt = (n) => Number(n || 0).toLocaleString('ar-EG');

// ─────────────────────────────────────────────────────────────────────────────
// BigStatCard  — للأرقام المهمة (بني داكن، تأثير فاخر)
// ─────────────────────────────────────────────────────────────────────────────
const BigStatCard = ({ label, value, icon }) => (
  <div style={{
    background: `linear-gradient(135deg, ${C.dark} 0%, ${C.darkMid} 100%)`,
    borderRadius: 18,
    padding: '24px 20px',
    display: 'flex', flexDirection: 'column', gap: 10,
    boxShadow: '0 6px 24px rgba(0,0,0,0.22)',
    position: 'relative', overflow: 'hidden',
  }}>
    {/* decorative circle */}
    <div style={{ position: 'absolute', top: -20, left: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(196,120,58,0.08)' }} />
    <div style={{ fontSize: '0.72rem', color: 'rgba(196,168,130,0.6)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', position: 'relative' }}>{label}</div>
    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#E8C99A', lineHeight: 1, position: 'relative' }}>{value}</div>
    {icon && <div style={{ position: 'absolute', left: 18, bottom: 18, fontSize: '2rem', opacity: 0.12 }}>{icon}</div>}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// StatCard  — بطاقة عادية مع أيقونة لون على الجانب
// ─────────────────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, color }) => (
  <div style={{
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14,
    padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    borderRight: `3px solid ${color}`,
  }}>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.72rem', color: C.muted, fontWeight: 600, marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SectionHeader
// ─────────────────────────────────────────────────────────────────────────────
const SectionHeader = ({ title, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
    <div style={{ width: 3, height: 18, borderRadius: 2, background: accent || C.brownLight }} />
    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#6B4A2E', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// AlertBanner
// ─────────────────────────────────────────────────────────────────────────────
const AlertBanner = ({ color, label, count }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '16px 20px',
    background: color + '10',
    borderRadius: 14,
    border: `1.5px solid ${color}30`,
    borderRight: `4px solid ${color}`,
  }}>
    <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}99` }} />
    </div>
    <span style={{ flex: 1, fontSize: '0.9rem', color: C.text, fontWeight: 700 }}>{label}</span>
    <span style={{ fontSize: '1.4rem', fontWeight: 900, color, flexShrink: 0, minWidth: 32, textAlign: 'center' }}>{count}</span>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// OrderRow
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_INFO = {
  new:              { label: 'جديد',           color: '#1D4ED8' },
  confirmed:        { label: 'مؤكد',           color: '#16A34A' },
  processing:       { label: 'قيد التجهيز',    color: '#B45309' },
  shipped:          { label: 'تم الشحن',       color: '#5C2E0A' },
  out_for_delivery: { label: 'خرج للتوصيل',    color: '#C4783A' },
  delivered:        { label: 'تم التسليم',     color: '#16A34A' },
  cancelled:        { label: 'ملغي',           color: '#DC2626' },
  returned:         { label: 'مرتجع',          color: '#7A7A7A' },
};

const OrderRow = ({ order, isLast }) => {
  const si = STATUS_INFO[order.status] || { label: order.status, color: C.muted };
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '15px 20px',
      borderBottom: isLast ? 'none' : `1px solid #F0EBE4`,
      transition: 'background 0.15s',
    }}>
      {/* Colored left indicator */}
      <div style={{ width: 4, height: 36, borderRadius: 2, background: si.color, flexShrink: 0, opacity: 0.7 }} />

      {/* Order ID + customer */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: C.text }}>{order.id}</div>
        <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>{order.customer?.name}</span>
          <span style={{ opacity: 0.35, flexShrink: 0 }}>·</span>
          <span style={{ flexShrink: 0 }}>{order.date}</span>
        </div>
      </div>

      {/* Status pill */}
      <div style={{
        fontSize: '0.7rem', fontWeight: 700,
        color: si.color,
        background: si.color + '14',
        padding: '5px 12px',
        borderRadius: 20,
        border: `1px solid ${si.color}28`,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>{si.label}</div>

      {/* Amount */}
      <div style={{
        fontWeight: 900, fontSize: '0.92rem',
        color: '#5C2E0A',
        flexShrink: 0, minWidth: 80, textAlign: 'left',
        background: '#F5F0EB', borderRadius: 8, padding: '5px 10px',
      }}>
        {fmt(order.total)} ج.م
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────
export const DashboardOverview = () => {
  const { products } = useProducts();
  const { stats, orders } = useAdminData();

  const lowStock       = products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0);
  const outOfStock     = products.filter(p => (p.stock || 0) === 0);
  const needsAction    = orders.filter(o => o.status === 'new' || o.status === 'confirmed');
  const recentOrders   = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const hasAlerts = lowStock.length > 0 || outOfStock.length > 0 || needsAction.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── SALES ─────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="المبيعات" accent={C.brownLight} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          <BigStatCard label="إجمالي المبيعات" value={`${fmt(stats.totalSales)} ج.م`} />
          <StatCard label="مبيعات اليوم" value={`${fmt(stats.todaySales)} ج.م`} color={C.brownMid} />
          <StatCard label="مبيعات الشهر" value={`${fmt(stats.monthSales)} ج.م`} color={C.text} />
        </div>
      </section>

      {/* ── ORDERS ────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="الطلبات" accent={C.blue} />

        {/* First row: big card + 2 small */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14, marginBottom: 14 }}>
          <BigStatCard label="إجمالي الطلبات" value={stats.totalOrders} />
          <StatCard label="جديدة / تأكيد" value={stats.newOrders} color={C.blue} />
          <StatCard label="قيد التجهيز"  value={stats.processingOrders} color={C.amber} />
        </div>

        {/* Second row: 3 small */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <StatCard label="تم الشحن"    value={stats.shippedOrders}   color={C.brownLight} />
          <StatCard label="تم التسليم"  value={stats.deliveredOrders} color={C.green} />
          <StatCard label="ملغاة"       value={stats.cancelledOrders} color={C.red} />
        </div>
      </section>

      {/* ── PRODUCTS ──────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="المنتجات" accent={C.brownMid} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
          <BigStatCard label="إجمالي المنتجات" value={products.length} />
          <StatCard label="قليلة المخزون ≤5" value={lowStock.length}   color={C.amber} />
          <StatCard label="نفد المخزون"       value={outOfStock.length} color={C.red} />
        </div>
      </section>

      {/* ── RECENT ORDERS ─────────────────────────────────────────────── */}
      {recentOrders.length > 0 && (
        <section>
          <SectionHeader title="آخر الطلبات" accent={C.brownLight} />
          <div style={{
            background: C.card, borderRadius: 18, border: `1px solid ${C.border}`,
            overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
          }}>
            {/* Header row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #2E1E0D 0%, #3D2810 100%)',
              borderBottom: `1px solid rgba(255,255,255,0.06)`,
            }}>
              <div style={{ width: 4, flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: '0.68rem', fontWeight: 700, color: 'rgba(196,168,130,0.7)', textTransform: 'uppercase', letterSpacing: '1px' }}>الطلب / العميل</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(196,168,130,0.7)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', flexShrink: 0, paddingLeft: 12 }}>الحالة</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(196,168,130,0.7)', textTransform: 'uppercase', letterSpacing: '1px', minWidth: 80, textAlign: 'left', paddingLeft: 10 }}>المبلغ</div>
            </div>
            {/* Rows */}
            <div>
              {recentOrders.map((order, i) => (
                <OrderRow key={order.id} order={order} isLast={i === recentOrders.length - 1} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
