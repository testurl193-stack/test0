import React, { useState, useEffect } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  brown: '#5C2E0A', brownLight: '#C4783A', bg: '#F2F2F2',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', green: '#16A34A',
};

const Toggle = ({ value, onChange }) => (
  <button onClick={() => onChange(!value)}
    style={{ width: 52, height: 30, borderRadius: 15, background: value ? C.brown : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 4, transition: 'right 0.2s', right: value ? 4 : 26 }} />
  </button>
);

const Field = ({ label, children, hint }) => (
  <div style={{ marginBottom: 18 }}>
    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>{label}</label>
    {children}
    {hint && <p style={{ fontSize: '0.75rem', color: C.muted, marginTop: 6 }}>{hint}</p>}
  </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', dir }) => (
  <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} dir={dir}
    style={{ width: '100%', padding: '13px 16px', border: `2px solid ${C.border}`, borderRadius: 12, fontSize: '0.95rem', color: C.text, fontFamily: "'Cairo', sans-serif", background: '#fff', boxSizing: 'border-box', outline: 'none', minHeight: 52 }} />
);

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
    style={{ width: '100%', padding: '13px 16px', border: `2px solid ${C.border}`, borderRadius: 12, fontSize: '0.95rem', color: C.text, fontFamily: "'Cairo', sans-serif", background: '#fff', boxSizing: 'border-box', outline: 'none', resize: 'vertical' }} />
);

const TABS = [
  { key: 'general', label: 'عام' },
  { key: 'contact', label: 'تواصل' },
  { key: 'shipping', label: 'الشحن' },
  { key: 'seo', label: 'SEO' },
];

export const StoreSettings = () => {
  const { settings, updateSettings } = useAdminData();
  const { showToast } = useToast();
  const [form, setForm] = useState(settings);
  const [activeTab, setActiveTab] = useState('general');
  const [dirty, setDirty] = useState(false);

  useEffect(() => { setForm(settings); }, [settings]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setDirty(true); };

  const handleSave = () => {
    updateSettings(form);
    showToast('تم حفظ الإعدادات بنجاح');
    setDirty(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.brown, margin: 0 }}>إعدادات المتجر</h2>
        {dirty && (
          <button onClick={handleSave}
            style={{ padding: '12px 24px', background: `linear-gradient(135deg, ${C.brown}, ${C.brownLight})`, color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 48 }}>
            حفظ التغييرات
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, WebkitOverflowScrolling: 'touch' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            style={{ padding: '10px 22px', borderRadius: 12, border: `1.5px solid ${activeTab === t.key ? C.brown : C.border}`, background: activeTab === t.key ? C.brown : C.card, color: activeTab === t.key ? '#fff' : C.muted, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap', minHeight: 46, flexShrink: 0 }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: '24px 20px' }}>

        {/* ── General ── */}
        {activeTab === 'general' && (
          <div>
            <Field label="اسم المتجر بالعربي">
              <Input value={form.storeName} onChange={v => set('storeName', v)} placeholder="هدية للعبايات" />
            </Field>
            <Field label="اسم المتجر بالإنجليزي">
              <Input value={form.storeNameEn} onChange={v => set('storeNameEn', v)} placeholder="Hadiya Abayas" dir="ltr" />
            </Field>
            <Field label="العملة">
              <Input value={form.currency} onChange={v => set('currency', v)} placeholder="ج.م" />
            </Field>
            <Field label="سياسة الاسترجاع">
              <Textarea value={form.returnPolicy} onChange={v => set('returnPolicy', v)} placeholder="7 أيام استرجاع..." />
            </Field>
          </div>
        )}

        {/* ── Contact ── */}
        {activeTab === 'contact' && (
          <div>
            <Field label="رقم الهاتف">
              <Input value={form.phone} onChange={v => set('phone', v)} placeholder="01234567890" type="tel" />
            </Field>
            <Field label="واتساب">
              <Input value={form.whatsapp} onChange={v => set('whatsapp', v)} placeholder="01234567890" type="tel" />
            </Field>
            <Field label="البريد الإلكتروني">
              <Input value={form.email} onChange={v => set('email', v)} placeholder="info@hadiya.com" type="email" dir="ltr" />
            </Field>
            <Field label="العنوان">
              <Input value={form.address} onChange={v => set('address', v)} placeholder="القاهرة، مصر" />
            </Field>
            <div style={{ height: 1, background: C.border, margin: '20px 0' }} />
            <p style={{ fontSize: '0.88rem', fontWeight: 700, color: C.text, marginBottom: 14 }}>حسابات التواصل الاجتماعي</p>
            <Field label="فيسبوك">
              <Input value={form.facebook} onChange={v => set('facebook', v)} placeholder="https://facebook.com/..." dir="ltr" />
            </Field>
            <Field label="إنستجرام">
              <Input value={form.instagram} onChange={v => set('instagram', v)} placeholder="https://instagram.com/..." dir="ltr" />
            </Field>
            <Field label="تيكتوك">
              <Input value={form.tiktok} onChange={v => set('tiktok', v)} placeholder="https://tiktok.com/..." dir="ltr" />
            </Field>
          </div>
        )}

        {/* ── Shipping ── */}
        {activeTab === 'shipping' && (
          <div>
            <Field label="تكلفة الشحن الافتراضية (ج.م)">
              <Input type="number" value={form.defaultShipping} onChange={v => set('defaultShipping', v)} placeholder="50" />
            </Field>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: C.bg, borderRadius: 12, marginBottom: 18 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: C.text }}>الشحن المجاني</div>
                <div style={{ fontSize: '0.78rem', color: C.muted, marginTop: 4 }}>تفعيل الشحن المجاني عند حد معين</div>
              </div>
              <Toggle value={form.freeShippingEnabled} onChange={v => set('freeShippingEnabled', v)} />
            </div>
            {form.freeShippingEnabled && (
              <Field label="الحد الأدنى للشحن المجاني (ج.م)" hint="سيتم تطبيق الشحن المجاني للطلبات التي تتجاوز هذا المبلغ">
                <Input type="number" value={form.minOrderFree} onChange={v => set('minOrderFree', v)} placeholder="1000" />
              </Field>
            )}
          </div>
        )}

        {/* ── SEO ── */}
        {activeTab === 'seo' && (
          <div>
            <Field label="عنوان الصفحة الرئيسية (Meta Title)" hint="يظهر في نتائج البحث، يُفضل أن يكون أقل من 60 حرف">
              <Input value={form.metaTitle} onChange={v => set('metaTitle', v)} placeholder="هدية للعبايات — أجمل العبايات والأزياء المحتشمة" />
            </Field>
            <Field label="وصف الصفحة (Meta Description)" hint="يظهر في نتائج البحث، يُفضل أن يكون 150-160 حرف">
              <Textarea value={form.metaDescription} onChange={v => set('metaDescription', v)} placeholder="تسوقي أجمل العبايات والنقاب والخمار من متجر هدية..." />
            </Field>
          </div>
        )}

      </div>

      {/* Save Button */}
      <button onClick={handleSave}
        style={{ width: '100%', padding: '16px', background: `linear-gradient(135deg, ${C.brown}, ${C.brownLight})`, color: '#fff', border: 'none', borderRadius: 14, fontWeight: 700, fontSize: '1rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 56, boxShadow: '0 4px 16px rgba(124, 61, 18, 0.3)' }}>
        حفظ الإعدادات
      </button>
    </div>
  );
};
