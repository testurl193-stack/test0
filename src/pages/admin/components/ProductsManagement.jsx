import React, { useState } from 'react';
import { useProducts } from '../../../context/ProductContext';
import { useAdminData } from '../../../context/AdminDataContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  brown: '#5C2E0A', brownMid: '#8B4513', brownLight: '#C4783A',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', green: '#16A34A',
  dark: '#1C1208', darkMid: '#2E1E0D',
};

const PRESET_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'One Size'];
const PRESET_COLORS = [
  { name: 'أسود',     hex: '#000000' }, { name: 'أبيض',     hex: '#FFFFFF' },
  { name: 'بني',      hex: '#8B4513' }, { name: 'بيج',      hex: '#D4B896' },
  { name: 'كحلي',     hex: '#1B2A5E' }, { name: 'رمادي',    hex: '#808080' },
  { name: 'وردي',     hex: '#F4A0B0' }, { name: 'أزرق',     hex: '#3B7DD8' },
  { name: 'أخضر',     hex: '#2D8A4E' }, { name: 'أحمر',     hex: '#C0392B' },
  { name: 'ذهبي',     hex: '#C9A84C' }, { name: 'برتقالي',  hex: '#E07B39' },
];

const emptyForm = {
  name: '', category: '', categoryName: '', description: '',
  price: '', oldPrice: '', stock: '', lowStockAlert: '5',
  coverImage: null, additionalImages: [],
  sizes: [], colors: [], customColor: '',
};

const readFile = (file) => new Promise((res) => {
  const reader = new FileReader();
  reader.onloadend = () => res(reader.result);
  reader.readAsDataURL(file);
});

// ── ProductCard ────────────────────────────────────────────────────────────
const ProductCard = ({ product, onEdit, onDelete }) => {
  const isLow = (product.stock || 0) > 0 && (product.stock || 0) <= 5;
  const isOut = (product.stock || 0) === 0;
  const colors = Array.isArray(product.colors)
    ? product.colors.map(c => typeof c === 'string' ? { name: c, hex: '#888' } : c)
    : [];

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 18, overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
    }}>
      {/* Image */}
      <div style={{ height: 200, background: 'linear-gradient(135deg, #F5F0EB, #E8DDD4)', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
        {product.image
          ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.muted, fontSize: '0.85rem' }}>لا توجد صورة</div>}
        {(isLow || isOut) && (
          <div style={{ position: 'absolute', top: 10, right: 10, padding: '4px 10px', borderRadius: 8, background: isOut ? C.red : '#B45309', color: '#fff', fontSize: '0.7rem', fontWeight: 700 }}>
            {isOut ? 'نفد المخزون' : `متبقي ${product.stock}`}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: C.text }}>{product.name}</div>
          <div style={{ fontSize: '0.78rem', color: C.brownLight, fontWeight: 600, marginTop: 3 }}>{product.categoryName}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: `1px solid #F0EBE4`, borderBottom: `1px solid #F0EBE4` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontWeight: 900, color: C.brown, fontSize: '1.1rem' }}>{product.price} ج.م</span>
            {product.oldPrice && <span style={{ fontSize: '0.75rem', color: C.muted, textDecoration: 'line-through' }}>{product.oldPrice}</span>}
          </div>
          <span style={{ fontSize: '0.75rem', color: C.muted, background: '#F5F0EB', padding: '3px 10px', borderRadius: 8 }}>مخزون: {product.stock}</span>
        </div>

        {/* Sizes */}
        {product.sizes?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.sizes.map((s, i) => (
              <span key={i} style={{ padding: '3px 9px', background: '#F5F0EB', border: `1px solid ${C.border}`, borderRadius: 6, fontSize: '0.7rem', fontWeight: 700, color: C.muted, fontFamily: "'Arial', sans-serif" }}>{s}</span>
            ))}
          </div>
        )}

        {/* Colors */}
        {colors.length > 0 && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            {colors.map((c, i) => (
              <div key={i} title={c.name} style={{ width: 22, height: 22, borderRadius: '50%', background: c.hex, border: `2px solid ${C.border}`, flexShrink: 0, boxShadow: '0 1px 4px rgba(0,0,0,0.12)' }} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 'auto', paddingTop: 4 }}>
          <button type="button" onClick={() => onEdit(product)}
            style={{ flex: 1, padding: '11px', background: '#FAF7F4', border: `1.5px solid ${C.brown}`, color: C.brown, borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}>
            تعديل
          </button>
          <button type="button" onClick={() => onDelete(product.id, product.name)}
            style={{ flex: 1, padding: '11px', background: '#FAF7F4', border: `1.5px solid ${C.border}`, color: C.muted, borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}>
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Modal Tabs ─────────────────────────────────────────────────────────────
const MODAL_TABS = [
  { key: 'basic',    label: 'الأساسي'   },
  { key: 'pricing',  label: 'الأسعار'   },
  { key: 'variants', label: 'المتغيرات' },
  { key: 'images',   label: 'الصور'     },
];

// ── Labeled Field helper ───────────────────────────────────────────────────
const FL = Object.assign(
  ({ label, children }) => (
    <div>
      <label style={FL.lbl}>{label}</label>
      {children}
    </div>
  ),
  {
    lbl: { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 },
    inp: { width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: '0.92rem', color: C.text, fontFamily: "'Cairo', sans-serif", background: '#fff', boxSizing: 'border-box', outline: 'none', minHeight: 50 },
  }
);

// ── Main ───────────────────────────────────────────────────────────────────
export const ProductsManagement = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { categories } = useAdminData();
  const { showToast } = useToast();

  const [isOpen,    setIsOpen]    = useState(false);
  const [editing,   setEditing]   = useState(null);
  const [form,      setForm]      = useState(emptyForm);
  const [modalTab,  setModalTab]  = useState('basic');
  const [search,    setSearch]    = useState('');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalTab('basic'); setIsOpen(true); };
  const openEdit = (p) => {
    const colors = Array.isArray(p.colors)
      ? p.colors.map(c => typeof c === 'string' ? { name: c, hex: '#888' } : c)
      : [];
    setEditing(p);
    setForm({
      ...emptyForm,
      name: p.name || '', category: p.category || '', categoryName: p.categoryName || '',
      description: p.description || '', price: String(p.price || ''),
      oldPrice: String(p.oldPrice || ''), stock: String(p.stock || ''),
      lowStockAlert: String(p.lowStockAlert || '5'),
      coverImage: p.image || null, additionalImages: p.productImages || [],
      sizes: p.sizes || [], colors,
    });
    setModalTab('basic');
    setIsOpen(true);
  };
  const close = () => { setIsOpen(false); setEditing(null); };

  const toggleSize = (s) => set('sizes', form.sizes.includes(s) ? form.sizes.filter(x => x !== s) : [...form.sizes, s]);
  const toggleColor = (c) => {
    const exists = form.colors.find(x => x.hex === c.hex);
    set('colors', exists ? form.colors.filter(x => x.hex !== c.hex) : [...form.colors, c]);
  };
  const addCustomColor = () => {
    const v = form.customColor.trim();
    if (!v) return;
    const hex = v.startsWith('#') ? v : '#' + v;
    if (!/^#[0-9A-F]{3,6}$/i.test(hex)) { showToast('كود اللون غير صحيح (مثال: #FF5733)'); return; }
    if (!form.colors.find(c => c.hex === hex)) set('colors', [...form.colors, { name: v, hex }]);
    set('customColor', '');
  };

  const handleCoverImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast('الصورة أكبر من 5MB'); return; }
    set('coverImage', await readFile(file));
  };
  const handleAdditionalImages = async (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    const results = await Promise.all(files.map(f => f.size > 5 * 1024 * 1024 ? null : readFile(f)));
    set('additionalImages', results.filter(Boolean));
  };

  const handleSave = () => {
    if (!form.name.trim()) { showToast('يرجى كتابة اسم المنتج'); return; }
    if (!form.category)    { showToast('يرجى اختيار التصنيف');   return; }
    if (!form.price)       { showToast('يرجى كتابة السعر');       return; }
    if (!form.stock)       { showToast('يرجى كتابة المخزون');     return; }
    const data = {
      name: form.name.trim(), category: form.category,
      categoryName: form.categoryName, description: form.description,
      price: parseFloat(form.price), oldPrice: form.oldPrice ? parseFloat(form.oldPrice) : null,
      stock: parseInt(form.stock), lowStockAlert: parseInt(form.lowStockAlert || 5),
      image: form.coverImage, productImages: form.additionalImages,
      sizes: form.sizes, colors: form.colors,
    };
    if (editing) { updateProduct(editing.id, data); showToast('تم تحديث المنتج'); }
    else         { addProduct(data);                showToast('تم إضافة المنتج'); }
    close();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`حذف "${name}"؟`)) { deleteProduct(id); showToast('تم الحذف'); }
  };

  const filtered = products.filter(p =>
    !search || p.name?.includes(search) || p.categoryName?.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.brown, margin: 0 }}>المنتجات</h2>
          <p style={{ fontSize: '0.8rem', color: C.muted, margin: '4px 0 0' }}>{products.length} منتج</p>
        </div>
        <button onClick={openAdd} style={{
          padding: '11px 22px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
          color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700,
          fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
          minHeight: 46, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>+ إضافة منتج</button>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="ابحث بالاسم أو التصنيف..."
        style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: '0.92rem', fontFamily: "'Cairo', sans-serif", background: C.card, color: C.text, boxSizing: 'border-box', minHeight: 50, outline: 'none' }}
      />

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
        {filtered.map(p => <ProductCard key={p.id} product={p} onEdit={openEdit} onDelete={handleDelete} />)}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted, background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          لا توجد منتجات
        </div>
      )}

      {/* ── Modal ── */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={close}>
          <div style={{ background: C.card, borderRadius: '22px 22px 0 0', width: '100%', maxWidth: 680, maxHeight: '94vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -10px 50px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header — dark like sidebar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, flexShrink: 0 }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F0E6D6' }}>
                {editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </span>
              <button onClick={close} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#F0E6D6', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, background: '#FAF7F4', flexShrink: 0, overflowX: 'auto' }}>
              {MODAL_TABS.map(t => (
                <button key={t.key} onClick={() => setModalTab(t.key)}
                  style={{ flex: 1, padding: '13px 12px', background: 'transparent', border: 'none', borderBottom: `2.5px solid ${modalTab === t.key ? C.brown : 'transparent'}`, color: modalTab === t.key ? C.brown : C.muted, fontWeight: modalTab === t.key ? 800 : 500, fontSize: '0.86rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", whiteSpace: 'nowrap', minWidth: 75, minHeight: 50 }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div style={{ padding: '22px 20px', overflowY: 'auto', flex: 1 }}>

              {/* ── Basic ── */}
              {modalTab === 'basic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <FL label="اسم المنتج *">
                    <input value={form.name} onChange={e => set('name', e.target.value)} style={FL.inp} placeholder="مثال: نقاب ساتان فاخر" />
                  </FL>
                  <FL label="التصنيف *">
                    <select value={form.category} onChange={e => {
                      const cat = categories.find(c => c.id === e.target.value);
                      set('category', e.target.value);
                      set('categoryName', cat?.name || '');
                    }} style={FL.inp}>
                      <option value="">اختر التصنيف</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </FL>
                  <FL label="وصف المنتج">
                    <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={4}
                      style={{ ...FL.inp, resize: 'vertical', minHeight: 100 }} placeholder="اكتب وصفاً مفصلاً للمنتج..." />
                  </FL>
                </div>
              )}

              {/* ── Pricing ── */}
              {modalTab === 'pricing' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <FL label="السعر (ج.م) *">
                      <input type="number" value={form.price} onChange={e => set('price', e.target.value)} style={FL.inp} placeholder="250" />
                    </FL>
                    <FL label="السعر قبل الخصم">
                      <input type="number" value={form.oldPrice} onChange={e => set('oldPrice', e.target.value)} style={FL.inp} placeholder="320" />
                    </FL>
                    <FL label="المخزون *">
                      <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} style={FL.inp} placeholder="20" />
                    </FL>
                    <FL label="تنبيه عند المخزون">
                      <input type="number" value={form.lowStockAlert} onChange={e => set('lowStockAlert', e.target.value)} style={FL.inp} placeholder="5" />
                    </FL>
                  </div>
                  {form.price && form.oldPrice && parseFloat(form.oldPrice) > parseFloat(form.price) && (
                    <div style={{ padding: '14px 16px', background: C.brown + '12', border: `1.5px solid ${C.brown}28`, borderRight: `4px solid ${C.brown}`, borderRadius: 12, fontSize: '0.9rem', color: C.brown, fontWeight: 700 }}>
                      نسبة الخصم: {Math.round((1 - form.price / form.oldPrice) * 100)}%
                    </div>
                  )}
                </div>
              )}

              {/* ── Variants ── */}
              {modalTab === 'variants' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Sizes */}
                  <div>
                    <label style={FL.lbl}>المقاسات المتوفرة</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10 }}>
                      {PRESET_SIZES.map(s => {
                        const active = form.sizes.includes(s);
                        return (
                          <button key={s} type="button" onClick={() => toggleSize(s)}
                            style={{ padding: '12px 8px', background: active ? `linear-gradient(135deg, ${C.dark}, ${C.darkMid})` : '#FAF7F4', border: `1.5px solid ${active ? C.dark : C.border}`, borderRadius: 10, color: active ? '#F0E6D6' : C.muted, fontWeight: 700, fontSize: '0.85rem', fontFamily: "'Arial', sans-serif", cursor: 'pointer', minHeight: 46 }}>
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label style={FL.lbl}>الألوان المتوفرة</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginTop: 10 }}>
                      {PRESET_COLORS.map(c => {
                        const sel = !!form.colors.find(x => x.hex === c.hex);
                        return (
                          <button key={c.hex} type="button" onClick={() => toggleColor(c)} title={c.name}
                            style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', background: c.hex, border: `3px solid ${sel ? C.brown : 'transparent'}`, outline: sel ? `3px solid #fff` : 'none', outlineOffset: -5, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.15)', transition: 'all 0.15s' }} />
                        );
                      })}
                    </div>

                    {/* Custom color */}
                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                      <input value={form.customColor} onChange={e => set('customColor', e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                        style={{ ...FL.inp, flex: 1 }} placeholder="كود لون مخصص (#FF5733)" dir="ltr" />
                      <button type="button" onClick={addCustomColor}
                        style={{ padding: '0 18px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", flexShrink: 0, minHeight: 50 }}>
                        إضافة
                      </button>
                    </div>

                    {/* Selected colors */}
                    {form.colors.length > 0 && (
                      <div style={{ marginTop: 14, padding: '14px 16px', background: '#FAF7F4', borderRadius: 12, border: `1px solid ${C.border}` }}>
                        <p style={{ fontSize: '0.78rem', fontWeight: 700, color: C.muted, marginBottom: 12 }}>محدد ({form.colors.length})</p>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {form.colors.map((c, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <div style={{ width: 42, height: 42, borderRadius: '50%', background: c.hex, border: `2px solid ${C.border}`, boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                              <button type="button" onClick={() => set('colors', form.colors.filter((_, j) => j !== i))}
                                style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, borderRadius: '50%', background: C.red, border: 'none', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Images ── */}
              {modalTab === 'images' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Cover */}
                  <div>
                    <label style={FL.lbl}>صورة الغلاف</label>
                    <label style={{ display: 'block', cursor: 'pointer', marginTop: 10 }}>
                      <input type="file" accept="image/*" onChange={handleCoverImage} style={{ display: 'none' }} />
                      {form.coverImage
                        ? <div style={{ width: '100%', height: 130, borderRadius: 14, overflow: 'hidden', border: `1.5px solid ${C.border}` }}><img src={form.coverImage} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                        : <div style={{ width: '100%', height: 130, border: `2px dashed ${C.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: '0.88rem', fontWeight: 600, background: '#FAF7F4' }}>اضغط لاختيار صورة الغلاف</div>}
                    </label>
                  </div>
                  {/* Additional */}
                  <div>
                    <label style={FL.lbl}>صور إضافية (4 كحد أقصى)</label>
                    <label style={{ display: 'block', cursor: 'pointer', marginTop: 10 }}>
                      <input type="file" accept="image/*" multiple onChange={handleAdditionalImages} style={{ display: 'none' }} />
                      <div style={{ width: '100%', height: 65, border: `2px dashed ${C.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: '0.85rem', fontWeight: 600, background: '#FAF7F4' }}>
                        اضغط لاختيار الصور
                      </div>
                    </label>
                    {form.additionalImages.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 12 }}>
                        {form.additionalImages.map((img, i) => (
                          <div key={i} style={{ aspectRatio: '1', borderRadius: 10, overflow: 'hidden', border: `1.5px solid ${C.border}`, position: 'relative' }}>
                            <img src={img} alt={`img${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button type="button" onClick={() => set('additionalImages', form.additionalImages.filter((_, j) => j !== i))}
                              style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: C.red, border: 'none', color: '#fff', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', gap: 12, padding: '16px 20px', borderTop: `1px solid ${C.border}`, background: '#FAF7F4', flexShrink: 0 }}>
              <button type="button" onClick={close}
                style={{ flex: 1, padding: '13px', background: '#fff', border: `1.5px solid ${C.border}`, color: C.muted, borderRadius: 12, fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 50 }}>
                إلغاء
              </button>
              <button type="button" onClick={handleSave}
                style={{ flex: 2, padding: '13px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, border: 'none', color: '#F0E6D6', borderRadius: 12, fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 50 }}>
                {editing ? 'تحديث المنتج' : 'حفظ المنتج'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
