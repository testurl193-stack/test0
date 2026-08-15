import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  brown: '#5C2E0A', brownLight: '#C4783A', bg: '#F2F2F2',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', green: '#16A34A', amber: '#B45309',
};
const fmt = (n) => Number(n || 0).toLocaleString('ar-EG');

const empty = { code: '', type: 'percent', value: '', minOrder: '', maxDiscount: '', startDate: '', endDate: '', usageLimit: '', oncePerCustomer: true, active: true, description: '' };

export const CouponsManagement = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useAdminData();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);

  const openAdd = () => { setEditing(null); setForm(empty); setIsOpen(true); };
  const openEdit = (c) => { setEditing(c); setForm({ ...c, value: String(c.value), minOrder: String(c.minOrder), maxDiscount: String(c.maxDiscount || ''), usageLimit: String(c.usageLimit || '') }); setIsOpen(true); };
  const close = () => { setIsOpen(false); setEditing(null); };
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const isExpired = (c) => c.endDate && new Date(c.endDate) < new Date();
  const isExhausted = (c) => c.usageLimit && c.usedCount >= c.usageLimit;

  const handleSave = () => {
    if (!form.code.trim()) { showToast('يرجى كتابة كود الكوبون'); return; }
    if (!form.value) { showToast('يرجى كتابة قيمة الخصم'); return; }
    const data = { ...form, code: form.code.toUpperCase().trim(), value: parseFloat(form.value), minOrder: parseFloat(form.minOrder || 0), maxDiscount: parseFloat(form.maxDiscount || 0), usageLimit: parseInt(form.usageLimit || 0) || null };
    if (editing) { updateCoupon(editing.id, data); showToast('تم تحديث الكوبون'); }
    else { addCoupon(data); showToast('تم إضافة الكوبون'); }
    close();
  };

  const handleDelete = (c) => {
    if (window.confirm(`حذف الكوبون "${c.code}"؟`)) { deleteCoupon(c.id); showToast('تم الحذف'); }
  };

  const getStatus = (c) => {
    if (!c.active) return { label: 'معطّل', color: C.muted };
    if (isExpired(c)) return { label: 'منتهي', color: C.red };
    if (isExhausted(c)) return { label: 'نفدت الاستخدامات', color: C.amber };
    return { label: 'نشط', color: C.green };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.brown, margin: 0 }}>الكوبونات</h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, margin: '4px 0 0' }}>{coupons.length} كوبون</p>
        </div>
        <button onClick={openAdd} style={Btn.primary}>+ إضافة</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {coupons.map(c => {
          const st = getStatus(c);
          return (
            <div key={c.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: '1.15rem', color: C.text, letterSpacing: 1 }}>{c.code}</div>
                  <div style={{ fontSize: '0.82rem', color: C.muted, marginTop: 4 }}>{c.description}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: st.color, background: st.color + '18', padding: '4px 10px', borderRadius: 8 }}>{st.label}</span>
                  <span style={{ fontWeight: 800, color: C.brown, fontSize: '1rem' }}>
                    {c.type === 'percent' ? `${c.value}%` : `${fmt(c.value)} ج.م`}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {c.minOrder > 0 && <Chip label={`حد أدنى: ${fmt(c.minOrder)} ج.م`} />}
                {c.maxDiscount > 0 && c.type === 'percent' && <Chip label={`حد أقصى: ${fmt(c.maxDiscount)} ج.م`} />}
                {c.usageLimit && <Chip label={`${c.usedCount}/${c.usageLimit} استخدام`} />}
                {c.oncePerCustomer && <Chip label="مرة لكل عميل" />}
                {c.endDate && <Chip label={`ينتهي ${c.endDate}`} />}
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => updateCoupon(c.id, { active: !c.active })} style={{ ...Btn.small, flex: 1 }}>{c.active ? 'تعطيل' : 'تفعيل'}</button>
                <button onClick={() => openEdit(c)} style={{ ...Btn.small, flex: 1 }}>تعديل</button>
                <button onClick={() => handleDelete(c)} style={{ ...Btn.smallDanger, flex: 1 }}>حذف</button>
              </div>
            </div>
          );
        })}
      </div>

      {coupons.length === 0 && <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted }}>لا توجد كوبونات</div>}

      {/* Modal */}
      {isOpen && (
        <div style={MS.overlay} onClick={close}>
          <div style={MS.modal} onClick={e => e.stopPropagation()}>
            <div style={MS.header}>
              <span style={{ fontWeight: 800 }}>{editing ? 'تعديل الكوبون' : 'إضافة كوبون'}</span>
              <button style={MS.closeBtn} onClick={close}>✕</button>
            </div>
            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Field label="كود الكوبون *">
                <input value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} style={{ ...FL.input, letterSpacing: 2, fontWeight: 700 }} placeholder="WELCOME10" dir="ltr" />
              </Field>
              <Field label="الوصف">
                <input value={form.description} onChange={e => set('description', e.target.value)} style={FL.input} placeholder="وصف مختصر للكوبون" />
              </Field>
              <Field label="نوع الخصم">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[{ v: 'percent', l: 'نسبة %' }, { v: 'fixed', l: 'مبلغ ثابت ج.م' }].map(t => (
                    <button key={t.v} onClick={() => set('type', t.v)}
                      style={{ padding: '14px', border: `2px solid ${form.type === t.v ? C.brown : C.border}`, borderRadius: 12, background: form.type === t.v ? C.brown : '#fff', color: form.type === t.v ? '#fff' : C.muted, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 52 }}>
                      {t.l}
                    </button>
                  ))}
                </div>
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field label={form.type === 'percent' ? 'نسبة الخصم (%)' : 'قيمة الخصم (ج.م)'}>
                  <input type="number" value={form.value} onChange={e => set('value', e.target.value)} style={FL.input} placeholder="10" />
                </Field>
                <Field label="الحد الأدنى للطلب">
                  <input type="number" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} style={FL.input} placeholder="200" />
                </Field>
                {form.type === 'percent' && (
                  <Field label="الحد الأقصى للخصم">
                    <input type="number" value={form.maxDiscount} onChange={e => set('maxDiscount', e.target.value)} style={FL.input} placeholder="100" />
                  </Field>
                )}
                <Field label="عدد الاستخدامات الكلي">
                  <input type="number" value={form.usageLimit} onChange={e => set('usageLimit', e.target.value)} style={FL.input} placeholder="∞" />
                </Field>
                <Field label="تاريخ البداية">
                  <input type="date" value={form.startDate} onChange={e => set('startDate', e.target.value)} style={FL.input} />
                </Field>
                <Field label="تاريخ الانتهاء">
                  <input type="date" value={form.endDate} onChange={e => set('endDate', e.target.value)} style={FL.input} />
                </Field>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.bg, borderRadius: 12 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text }}>مرة واحدة لكل عميل</span>
                <Toggle value={form.oncePerCustomer} onChange={v => set('oncePerCustomer', v)} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: C.bg, borderRadius: 12 }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text }}>الكوبون نشط</span>
                <Toggle value={form.active} onChange={v => set('active', v)} />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={close} style={Btn.cancel}>إلغاء</button>
                <button onClick={handleSave} style={Btn.save}>حفظ</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Field = ({ label, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{label}</label>
    {children}
  </div>
);
const Chip = ({ label }) => <span style={{ fontSize: '0.72rem', color: '#6B6B6B', background: '#F7F3EF', border: '1px solid #E8DDD4', padding: '4px 10px', borderRadius: 8 }}>{label}</span>;
const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    style={{ width: 52, height: 30, borderRadius: 15, background: value ? '#7C3D12' : '#E8DDD4', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 4, transition: 'right 0.2s', right: value ? 4 : 26 }} />
  </button>
);

const Btn = {
  primary: { padding: '12px 24px', background: 'linear-gradient(135deg, #7C3D12, #A0522D)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 48 },
  small: { padding: '10px 16px', background: '#fff', border: `1.5px solid #7C3D12`, color: '#7C3D12', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 },
  smallDanger: { padding: '10px 16px', background: '#fff', border: `1.5px solid #DC2626`, color: '#DC2626', borderRadius: 10, fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 },
  cancel: { flex: 1, padding: '14px', background: '#fff', border: `1.5px solid #E8DDD4`, color: '#6B6B6B', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 52 },
  save: { flex: 1, padding: '14px', background: 'linear-gradient(135deg, #7C3D12, #A0522D)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 52 },
};
const FL = {
  input: { width: '100%', padding: '13px 16px', border: `2px solid #E8DDD4`, borderRadius: 12, fontSize: '0.95rem', color: '#1A1A1A', fontFamily: "'Cairo', sans-serif", background: '#fff', boxSizing: 'border-box', outline: 'none', minHeight: 52 },
};
const MS = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' },
  modal: { background: '#fff', borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 540, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'linear-gradient(135deg, #7C3D12, #A0522D)', color: '#fff', borderRadius: '20px 20px 0 0', position: 'sticky', top: 0 },
  closeBtn: { width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer', minWidth: 38 },
};
