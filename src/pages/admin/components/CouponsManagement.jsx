import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  brown: '#5C2E0A', brownMid: '#8B4513', brownLight: '#C4783A',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', green: '#16A34A', amber: '#B45309',
  dark: '#1C1208', darkMid: '#2E1E0D',
};
const fmt = (n) => Number(n || 0).toLocaleString('ar-EG');

const empty = {
  code: '', type: 'percent', value: '', minOrder: '', maxDiscount: '',
  startDate: '', endDate: '', usageLimit: '', oncePerCustomer: true, active: true, description: '',
};

const Toggle = ({ value, onChange }) => (
  <button type="button" onClick={() => onChange(!value)}
    style={{ width: 48, height: 28, borderRadius: 14, background: value ? C.brown : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 4, transition: 'right 0.2s', right: value ? 4 : 24 }} />
  </button>
);

const StatusPill = ({ label, color }) => (
  <span style={{
    fontSize: '0.7rem', fontWeight: 700, color,
    background: color + '14', padding: '5px 12px',
    borderRadius: 20, border: `1px solid ${color}28`,
    whiteSpace: 'nowrap',
  }}>
    {label}
  </span>
);

const getCouponStatus = (c) => {
  const isExpired = c.endDate && new Date(c.endDate) < new Date();
  const isExhausted = c.usageLimit && c.usedCount >= c.usageLimit;
  if (!c.active) return { label: 'معطّل', color: C.muted };
  if (isExpired) return { label: 'منتهي', color: C.red };
  if (isExhausted) return { label: 'نفد', color: C.amber };
  return { label: 'نشط', color: C.green };
};

const discountLabel = (c) =>
  c.type === 'percent' ? `${c.value}%` : `${fmt(c.value)} ج.م`;

const amountBadge = {
  fontWeight: 900, fontSize: '0.85rem', color: C.brown,
  background: '#F5F0EB', borderRadius: 8, padding: '4px 10px',
  whiteSpace: 'nowrap',
};

const CouponRow = ({ coupon, onOpen, isLast }) => {
  const st = getCouponStatus(coupon);
  const meta = [
    coupon.description,
    coupon.minOrder > 0 ? `حد أدنى ${fmt(coupon.minOrder)} ج.م` : null,
    coupon.usageLimit ? `${coupon.usedCount}/${coupon.usageLimit} استخدام` : null,
    coupon.endDate ? `ينتهي ${coupon.endDate}` : null,
  ].filter(Boolean);

  return (
    <div onClick={() => onOpen(coupon)} style={{
      display: 'flex', alignItems: 'stretch', gap: 10,
      padding: '14px 16px',
      borderBottom: isLast ? 'none' : '1px solid #F0EBE4',
      cursor: 'pointer', transition: 'background 0.15s',
    }}>
      <div style={{ width: 4, borderRadius: 2, background: st.color, flexShrink: 0, opacity: 0.75, alignSelf: 'stretch', minHeight: 44 }} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: C.text, letterSpacing: 0.5, wordBreak: 'break-all' }} dir="ltr">
          {coupon.code}
        </div>
        {meta.length > 0 && (
          <div style={{ fontSize: '0.74rem', color: C.muted, lineHeight: 1.5, wordBreak: 'break-word' }}>
            {meta.join(' · ')}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <StatusPill label={st.label} color={st.color} />
          <span style={amountBadge}>{discountLabel(coupon)}</span>
        </div>
      </div>
    </div>
  );
};

export const CouponsManagement = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdminData();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openAdd = () => { setEditing(null); setForm(empty); setIsOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      ...c,
      value: String(c.value),
      minOrder: String(c.minOrder),
      maxDiscount: String(c.maxDiscount || ''),
      usageLimit: String(c.usageLimit || ''),
    });
    setIsOpen(true);
  };
  const close = () => { setIsOpen(false); setEditing(null); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.code.trim()) { showToast('يرجى كتابة كود الكوبون'); return; }
    if (!form.value) { showToast('يرجى كتابة قيمة الخصم'); return; }
    const data = {
      ...form,
      code: form.code.toUpperCase().trim(),
      value: parseFloat(form.value),
      minOrder: parseFloat(form.minOrder || 0),
      maxDiscount: parseFloat(form.maxDiscount || 0),
      usageLimit: parseInt(form.usageLimit || 0) || null,
    };
    if (editing) { updateCoupon(editing.id, data); showToast('تم تحديث الكوبون'); }
    else { addCoupon(data); showToast('تم إضافة الكوبون'); }
    close();
  };

  const handleDelete = () => {
    if (!editing) return;
    if (window.confirm(`حذف الكوبون "${editing.code}"؟`)) {
      deleteCoupon(editing.id);
      showToast('تم الحذف');
      close();
    }
  };

  const handleToggleActive = () => {
    if (!editing) return;
    updateCoupon(editing.id, { active: !editing.active });
    set('active', !editing.active);
    setEditing(prev => ({ ...prev, active: !prev.active }));
    showToast(editing.active ? 'تم تعطيل الكوبون' : 'تم تفعيل الكوبون');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.brown, margin: 0 }}>الكوبونات</h2>
          <p style={{ fontSize: '0.78rem', color: C.muted, margin: '4px 0 0' }}>اضغط على أي كوبون للتعديل</p>
        </div>
        <button onClick={openAdd} style={{
          padding: '11px 22px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
          color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700,
          fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
          minHeight: 46, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', whiteSpace: 'nowrap',
        }}>+ إضافة كوبون</button>
      </div>

      <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: 600 }}>{coupons.length} كوبون</div>

      {/* Table card — same layout as Orders */}
      {coupons.length > 0 ? (
        <div style={{
          background: C.card, borderRadius: 18, border: `1px solid ${C.border}`,
          overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        }}>
          <div style={{
            padding: '12px 16px',
            background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.72rem', fontWeight: 700, color: 'rgba(196,168,130,0.75)',
          }}>
            اضغط على أي كوبون للتعديل
          </div>
          <div>
            {coupons.map((c, i) => (
              <CouponRow key={c.id} coupon={c} onOpen={openEdit} isLast={i === coupons.length - 1} />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted, fontSize: '0.95rem', background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          لا توجد كوبونات
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div className="coupon-modal-overlay" style={MS.overlay} onClick={close}>
          <div className="coupon-modal-sheet" style={MS.modal} onClick={e => e.stopPropagation()}>
            <div style={MS.header}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#F0E6D6' }}>
                {editing ? `تعديل ${editing.code}` : 'إضافة كوبون جديد'}
              </span>
              <button type="button" style={MS.closeBtn} onClick={close}>✕</button>
            </div>

            <div style={MS.body}>
              <Field label="كود الكوبون *">
                <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())}
                  className="coupon-modal-input"
                  style={{ ...FL.inp, letterSpacing: 1.5, fontWeight: 700 }}
                  placeholder="WELCOME10" dir="ltr" />
              </Field>

              <Field label="الوصف">
                <input value={form.description} onChange={e => set('description', e.target.value)}
                  className="coupon-modal-input"
                  style={FL.inp} placeholder="وصف مختصر" />
              </Field>

              <Field label="نوع الخصم">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ v: 'percent', l: 'نسبة %' }, { v: 'fixed', l: 'مبلغ ثابت' }].map(t => (
                    <button key={t.v} type="button" onClick={() => set('type', t.v)}
                      style={{
                        padding: '10px 8px', border: `1.5px solid ${form.type === t.v ? C.brown : C.border}`,
                        borderRadius: 10, background: form.type === t.v ? C.brown : '#fff',
                        color: form.type === t.v ? '#fff' : C.muted, fontWeight: 700,
                        fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 42,
                      }}>
                      {t.l}
                    </button>
                  ))}
                </div>
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
                <Field label={form.type === 'percent' ? 'نسبة الخصم (%)' : 'قيمة الخصم (ج.م)'}>
                  <input type="number" value={form.value} onChange={e => set('value', e.target.value)} className="coupon-modal-input" style={FL.inp} placeholder="10" inputMode="decimal" />
                </Field>
                <Field label="الحد الأدنى للطلب">
                  <input type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} className="coupon-modal-input" style={FL.inp} placeholder="200" inputMode="decimal" />
                </Field>
                {form.type === 'percent' && (
                  <Field label="الحد الأقصى للخصم">
                    <input type="number" value={form.maxDiscount} onChange={e => set('maxDiscount', e.target.value)} className="coupon-modal-input" style={FL.inp} placeholder="100" inputMode="decimal" />
                  </Field>
                )}
                <Field label="عدد الاستخدامات">
                  <input type="number" value={form.usageLimit} onChange={e => set('usageLimit', e.target.value)} className="coupon-modal-input" style={FL.inp} placeholder="∞" inputMode="numeric" />
                </Field>
                <Field label="تاريخ البداية">
                  <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} className="coupon-modal-input" style={FL.inp} />
                </Field>
                <Field label="تاريخ الانتهاء">
                  <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} className="coupon-modal-input" style={FL.inp} />
                </Field>
              </div>

              <div style={FL.toggleRow}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: C.text }}>مرة واحدة لكل عميل</div>
                  <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: 2 }}>لا يمكن استخدامه أكثر من مرة</div>
                </div>
                <Toggle value={form.oncePerCustomer} onChange={v => set('oncePerCustomer', v)} />
              </div>

              <div style={FL.toggleRow}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: C.text }}>الكوبون نشط</div>
                  <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: 2 }}>يظهر للعملاء في المتجر</div>
                </div>
                <Toggle value={form.active} onChange={v => set('active', v)} />
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={close} style={Btn.cancel}>إلغاء</button>
                <button type="button" onClick={handleSave} style={Btn.save}>
                  {editing ? 'تحديث الكوبون' : 'حفظ الكوبون'}
                </button>
              </div>

              {editing && (
                <>
                  <button type="button" onClick={handleToggleActive}
                    style={{ width: '100%', padding: '12px', background: '#FAF7F4', border: `1.5px solid ${C.border}`, color: C.brown, borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}>
                    {editing.active ? 'تعطيل الكوبون' : 'تفعيل الكوبون'}
                  </button>
                  <button type="button" onClick={handleDelete}
                    style={{ width: '100%', padding: '12px', background: 'rgba(220,38,38,0.06)', border: '1.5px solid rgba(220,38,38,0.25)', color: C.red, borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}>
                    حذف الكوبون
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .coupon-modal-input {
          font-size: 16px !important;
        }

        @media (max-width: 768px) {
          .coupon-modal-overlay {
            align-items: flex-end;
          }

          .coupon-modal-sheet {
            max-width: 100% !important;
            max-height: 82dvh !important;
            border-radius: 18px 18px 0 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={FL.lbl}>{label}</label>
    {children}
  </div>
);

const Btn = {
  cancel: {
    flex: 1, padding: '11px', background: '#fff', border: `1.5px solid ${C.border}`,
    color: C.muted, borderRadius: 12, fontWeight: 700, fontSize: '0.88rem',
    cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44,
  },
  save: {
    flex: 2, padding: '11px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
    color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem',
    cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44,
  },
};

const FL = {
  lbl: { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: C.text, marginBottom: 6 },
  inp: {
    width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`,
    borderRadius: 10, fontSize: '16px', color: C.text, fontFamily: "'Cairo', sans-serif",
    background: '#fff', boxSizing: 'border-box', outline: 'none', minHeight: 42,
  },
  toggleRow: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 14px', background: '#FAF7F4', borderRadius: 10, border: `1px solid ${C.border}`,
  },
};

const MS = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 1000, backdropFilter: 'blur(4px)', overflow: 'hidden',
  },
  modal: {
    background: C.card, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480,
    maxHeight: 'min(88vh, 88dvh)', display: 'flex', flexDirection: 'column', overflow: 'hidden',
    boxShadow: '0 -10px 50px rgba(0,0,0,0.3)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 18px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, flexShrink: 0,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)', color: '#F0E6D6', fontSize: '1.1rem',
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  body: {
    padding: '18px 16px 24px', overflowY: 'auto', flex: 1,
    display: 'flex', flexDirection: 'column', gap: 14,
  },
};
