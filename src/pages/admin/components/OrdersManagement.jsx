import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  brown: '#5C2E0A', brownMid: '#8B4513', brownLight: '#C4783A',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', amber: '#B45309', green: '#16A34A', blue: '#1D4ED8',
  dark: '#1C1208', darkMid: '#2E1E0D',
};

const fmt = (n) => Number(n || 0).toLocaleString('ar-EG');

const ORDER_STATUSES = [
  { key: 'new',              label: 'جديد',          color: '#1D4ED8' },
  { key: 'confirmed',        label: 'تم التأكيد',    color: '#16A34A' },
  { key: 'processing',       label: 'قيد التجهيز',   color: '#B45309' },
  { key: 'shipped',          label: 'تم الشحن',      color: '#5C2E0A' },
  { key: 'out_for_delivery', label: 'خرج للتوصيل',   color: '#C4783A' },
  { key: 'delivered',        label: 'تم التسليم',    color: '#16A34A' },
  { key: 'cancelled',        label: 'ملغي',          color: '#DC2626' },
  { key: 'returned',         label: 'مرتجع',         color: '#7A7A7A' },
];

const getStatus = (key) => ORDER_STATUSES.find(s => s.key === key) || { label: key, color: C.muted };

const TIMELINE_FLOW = ['new', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

// ── StatusPill ────────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const s = getStatus(status);
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: 700, color: s.color,
      background: s.color + '14', padding: '5px 12px',
      borderRadius: 20, border: `1px solid ${s.color}28`,
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
};

// ── OrderRow ──────────────────────────────────────────────────────────────
const OrderRow = ({ order, onOpen, isLast }) => {
  const s = getStatus(order.status);
  return (
    <div onClick={() => onOpen(order)} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '15px 20px',
      borderBottom: isLast ? 'none' : `1px solid #F0EBE4`,
      cursor: 'pointer',
      transition: 'background 0.15s',
    }}>
      {/* Color bar */}
      <div style={{ width: 4, height: 36, borderRadius: 2, background: s.color, flexShrink: 0, opacity: 0.75 }} />

      {/* ID + customer */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: C.text }}>{order.id}</div>
        <div style={{ fontSize: '0.75rem', color: C.muted, marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
            {order.customer?.name}
          </span>
          <span style={{ opacity: 0.35, flexShrink: 0 }}>·</span>
          <span style={{ flexShrink: 0 }}>{order.date}</span>
        </div>
      </div>

      {/* Status */}
      <StatusPill status={order.status} />

      {/* Amount */}
      <div style={{
        fontWeight: 900, fontSize: '0.92rem', color: C.brown,
        background: '#F5F0EB', borderRadius: 8, padding: '5px 10px',
        flexShrink: 0, minWidth: 80, textAlign: 'left',
      }}>
        {fmt(order.total)} ج.م
      </div>
    </div>
  );
};

// ── Timeline ──────────────────────────────────────────────────────────────
const Timeline = ({ timeline = [], currentStatus }) => {
  const done = new Set((timeline || []).map(t => t.status));
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {TIMELINE_FLOW.map((key, i) => {
        const isDone = done.has(key);
        const isCurrent = key === currentStatus;
        const entry = timeline.find(t => t.status === key);
        const color = isDone ? C.green : isCurrent ? C.brownMid : C.border;
        return (
          <div key={key} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 22 }}>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: isDone ? C.green : isCurrent ? C.brownMid : '#F5F0EB',
                border: `2px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {isDone && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" style={{ width: 11, height: 11 }}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {i < TIMELINE_FLOW.length - 1 && (
                <div style={{ width: 2, height: 28, background: isDone ? C.green + '60' : C.border }} />
              )}
            </div>
            <div style={{ paddingBottom: i < TIMELINE_FLOW.length - 1 ? 12 : 0, paddingTop: 2 }}>
              <div style={{
                fontWeight: isDone || isCurrent ? 700 : 500,
                fontSize: '0.88rem',
                color: isDone ? C.green : isCurrent ? C.brownMid : C.muted,
              }}>
                {getStatus(key).label}
              </div>
              {entry?.date && (
                <div style={{ fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>
                  {new Date(entry.date).toLocaleString('ar-EG')}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Modal helpers ─────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{
      fontSize: '0.65rem', fontWeight: 800, color: 'rgba(196,168,130,0.6)',
      marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1.2px',
    }}>{title}</div>
    {children}
  </div>
);

const Row = ({ label, value }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid #F0EBE4` }}>
    <span style={{ fontSize: '0.82rem', color: C.muted, fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: C.text, textAlign: 'left', maxWidth: '58%' }}>{value || '—'}</span>
  </div>
);

const Tag = ({ label, value }) => (
  <span style={{ fontSize: '0.72rem', color: C.muted, background: '#F5F0EB', border: `1px solid ${C.border}`, padding: '4px 9px', borderRadius: 7 }}>
    {label}: <strong style={{ color: C.text }}>{value}</strong>
  </span>
);

// ── OrderModal ────────────────────────────────────────────────────────────
const OrderModal = ({ order, onClose, onUpdateStatus, onDelete }) => {
  if (!order) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div style={{ background: C.card, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 640, maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -10px 50px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header — dark brown like sidebar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, flexShrink: 0 }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#F0E6D6' }}>طلب {order.id}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(196,168,130,0.6)', marginTop: 4 }}>{order.date}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <StatusPill status={order.status} />
            <button onClick={onClose}
              style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#F0E6D6', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 22px 32px', overflowY: 'auto', flex: 1 }}>

          {/* Customer */}
          <Section title="بيانات العميل">
            <Row label="الاسم"      value={order.customer?.name} />
            <Row label="الهاتف"     value={order.customer?.phone} />
            <Row label="المحافظة"   value={order.customer?.governorate} />
            <Row label="العنوان"    value={order.customer?.address} />
          </Section>

          {/* Items */}
          <Section title="المنتجات">
            {(order.items || []).map((item, i) => (
              <div key={i} style={{ padding: '12px 14px', background: '#FAF7F4', borderRadius: 12, marginBottom: 8, border: `1px solid ${C.border}` }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: C.text, marginBottom: 8 }}>{item.name}</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {item.size && <Tag label="مقاس" value={item.size} />}
                  {item.color && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: C.muted, background: '#F5F0EB', border: `1px solid ${C.border}`, padding: '4px 9px', borderRadius: 7 }}>
                      <span style={{ width: 12, height: 12, borderRadius: '50%', background: item.color.hex, border: `1px solid ${C.border}`, flexShrink: 0 }} />
                      {item.color.name}
                    </span>
                  )}
                  <Tag label="الكمية" value={item.qty} />
                  <Tag label="السعر"  value={`${fmt(item.price)} ج.م`} />
                </div>
              </div>
            ))}
          </Section>

          {/* Summary */}
          <Section title="ملخص الطلب">
            <Row label="المنتجات" value={`${fmt(order.subtotal)} ج.م`} />
            {order.discount > 0 && <Row label="الخصم" value={`- ${fmt(order.discount)} ج.م`} />}
            <Row label="الشحن" value={`${fmt(order.shippingCost || 50)} ج.م`} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', marginTop: 4 }}>
              <span style={{ fontWeight: 800, color: C.text, fontSize: '0.95rem' }}>الإجمالي</span>
              <span style={{ fontWeight: 900, color: C.brown, fontSize: '1.2rem', background: '#F5F0EB', padding: '6px 14px', borderRadius: 10 }}>{fmt(order.total)} ج.م</span>
            </div>
          </Section>

          {/* Payment */}
          <Section title="الدفع">
            <Row label="طريقة الدفع" value={{ cash: 'كاش عند الاستلام', vodafone: 'فودافون كاش', instapay: 'انستاباي' }[order.payment?.method] || order.payment?.method} />
            <Row label="حالة الدفع" value={order.payment?.status === 'paid' ? 'تم الدفع' : 'في الانتظار'} />
            {order.payment?.ref && <Row label="رقم العملية" value={order.payment.ref} />}
          </Section>

          {/* Shipping */}
          {(order.shippingInfo?.company || order.shippingInfo?.trackingNo) && (
            <Section title="الشحن">
              {order.shippingInfo.company    && <Row label="شركة الشحن" value={order.shippingInfo.company} />}
              {order.shippingInfo.trackingNo && <Row label="رقم التتبع" value={order.shippingInfo.trackingNo} />}
            </Section>
          )}

          {/* Timeline */}
          <Section title="مسار الطلب">
            <Timeline timeline={order.timeline} currentStatus={order.status} />
          </Section>

          {/* Notes */}
          {order.notes && (
            <Section title="ملاحظات">
              <div style={{ fontSize: '0.88rem', color: C.text, padding: '12px 14px', background: '#FAF7F4', borderRadius: 10, border: `1px solid ${C.border}` }}>{order.notes}</div>
            </Section>
          )}

          {/* Status Actions */}
          <Section title="تحديث الحالة">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {ORDER_STATUSES.filter(s => s.key !== order.status).map(s => (
                <button key={s.key}
                  style={{ padding: '10px 18px', background: s.color + '12', border: `1.5px solid ${s.color}30`, borderRadius: 10, color: s.color, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}
                  onClick={() => { onUpdateStatus(order.id, s.key); onClose(); }}>
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Delete */}
          <button
            style={{ width: '100%', padding: '14px', background: 'rgba(220,38,38,0.06)', border: `1.5px solid rgba(220,38,38,0.25)`, color: C.red, borderRadius: 12, fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 52 }}
            onClick={() => { onDelete(order.id); onClose(); }}>
            حذف الطلب نهائياً
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────
export const OrdersManagement = () => {
  const { orders, updateOrderStatus, deleteOrder } = useAdminData();
  const { showToast } = useToast();
  const [filter, setFilter]   = useState('all');
  const [selected, setSelected] = useState(null);
  const [search, setSearch]   = useState('');

  const filtered = orders.filter(o => {
    const matchStatus = filter === 'all' || o.status === filter;
    const matchSearch = !search
      || o.id.includes(search)
      || o.customer?.name?.includes(search)
      || o.customer?.phone?.includes(search);
    return matchStatus && matchSearch;
  });

  const handleUpdateStatus = (id, status) => {
    updateOrderStatus(id, status);
    showToast('تم تحديث حالة الطلب');
  };

  const handleDelete = (id) => {
    if (window.confirm('هل تريد حذف هذا الطلب نهائياً؟')) {
      deleteOrder(id);
      showToast('تم حذف الطلب');
    }
  };

  const counts = {
    all: orders.length,
    ...Object.fromEntries(ORDER_STATUSES.map(s => [s.key, orders.filter(o => o.status === s.key).length])),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="ابحث برقم الطلب أو اسم العميل أو الهاتف..."
        style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: '0.95rem', fontFamily: "'Cairo', sans-serif", background: C.card, color: C.text, boxSizing: 'border-box', minHeight: 52, outline: 'none' }}
      />

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
        {[{ key: 'all', label: 'الكل', color: C.brown }, ...ORDER_STATUSES].map(s => {
          const active = filter === s.key;
          const cnt = counts[s.key];
          return (
            <button key={s.key} onClick={() => setFilter(s.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 20, cursor: 'pointer',
                fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: '0.8rem',
                whiteSpace: 'nowrap', flexShrink: 0, minHeight: 40,
                border: `1.5px solid ${active ? (s.color || C.brown) : C.border}`,
                background: active ? (s.color || C.brown) : C.card,
                color: active ? '#fff' : C.muted,
                transition: 'all 0.15s',
              }}>
              {s.label}
              {cnt > 0 && (
                <span style={{ fontSize: '0.7rem', fontWeight: 800, background: active ? 'rgba(255,255,255,0.22)' : C.border, borderRadius: 10, padding: '1px 7px' }}>
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: 600 }}>{filtered.length} طلب</div>

      {/* Table card */}
      {filtered.length > 0 ? (
        <div style={{
          background: C.card, borderRadius: 18, border: `1px solid ${C.border}`,
          overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 20px',
            background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
          }}>
            <div style={{ width: 4, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.65rem', fontWeight: 700, color: 'rgba(196,168,130,0.65)', textTransform: 'uppercase', letterSpacing: '1px' }}>الطلب / العميل</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(196,168,130,0.65)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', paddingLeft: 12 }}>الحالة</div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(196,168,130,0.65)', textTransform: 'uppercase', letterSpacing: '1px', minWidth: 80, textAlign: 'left', paddingLeft: 10 }}>المبلغ</div>
          </div>
          {/* Rows */}
          <div>
            {filtered.map((order, i) => (
              <OrderRow key={order.id} order={order} onOpen={setSelected} isLast={i === filtered.length - 1} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted, fontSize: '0.95rem', background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          لا توجد طلبات
        </div>
      )}

      <OrderModal order={selected} onClose={() => setSelected(null)} onUpdateStatus={handleUpdateStatus} onDelete={handleDelete} />
    </div>
  );
};
