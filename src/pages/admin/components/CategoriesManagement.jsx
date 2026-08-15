import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  brown: '#5C2E0A', brownMid: '#8B4513', brownLight: '#C4783A',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', dark: '#1C1208', darkMid: '#2E1E0D',
};

const emptyForm = { name: '', visible: true };

const Toggle = ({ value, onChange }) => (
  <button type="button" onClick={() => onChange(!value)}
    style={{ width: 52, height: 30, borderRadius: 15, background: value ? C.brown : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', position: 'absolute', top: 4, transition: 'right 0.2s', right: value ? 4 : 26 }} />
  </button>
);

export const CategoriesManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory, reorderCategories } = useAdminData();
  const { showToast } = useToast();
  const [isOpen,   setIsOpen]   = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [dragging, setDragging] = useState(null);

  const openAdd  = () => { setEditing(null); setForm(emptyForm); setIsOpen(true); };
  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, visible: cat.visible });
    setIsOpen(true);
  };
  const close = () => { setIsOpen(false); setEditing(null); setForm(emptyForm); };
  const set   = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { showToast('يرجى كتابة اسم التصنيف'); return; }
    if (editing) { updateCategory(editing.id, form); showToast('تم تحديث التصنيف'); }
    else         { addCategory(form);                showToast('تم إضافة التصنيف'); }
    close();
  };

  const handleDelete = (cat) => {
    if (window.confirm(`حذف تصنيف "${cat.name}"؟`)) {
      deleteCategory(cat.id);
      showToast('تم حذف التصنيف');
    }
  };

  const onDragStart = (i) => setDragging(i);
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragging === null || dragging === i) return;
    const list = [...categories];
    const [item] = list.splice(dragging, 1);
    list.splice(i, 0, item);
    reorderCategories(list);
    setDragging(i);
  };
  const onDragEnd = () => setDragging(null);

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.brown, margin: 0 }}>التصنيفات</h2>
          <p style={{ fontSize: '0.78rem', color: C.muted, margin: '4px 0 0' }}>اسحب الصفوف لتغيير الترتيب</p>
        </div>
        <button onClick={openAdd} style={{
          padding: '11px 22px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
          color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700,
          fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
          minHeight: 46, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>+ إضافة تصنيف</button>
      </div>

      {/* ── Table card ── */}
      <div style={{
        background: C.card, borderRadius: 18, border: `1px solid ${C.border}`,
        overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
      }}>
        {/* Table header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '24px 56px 1fr auto',
          alignItems: 'center', gap: 14, padding: '11px 20px',
          background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
        }}>
          <div />
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(196,168,130,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>رمز</div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(196,168,130,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>التصنيف</div>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'rgba(196,168,130,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>إجراءات</div>
        </div>

        {/* Rows */}
        {sorted.map((cat, i) => (
          <div key={cat.id}
            draggable
            onDragStart={() => onDragStart(i)}
            onDragOver={(e) => onDragOver(e, i)}
            onDragEnd={onDragEnd}
            style={{
              display: 'grid', gridTemplateColumns: '24px 56px 1fr auto',
              alignItems: 'center', gap: 14, padding: '14px 20px',
              borderBottom: i < sorted.length - 1 ? `1px solid #F0EBE4` : 'none',
              cursor: 'grab', opacity: dragging === i ? 0.45 : 1,
              transition: 'opacity 0.2s',
              background: cat.visible ? 'transparent' : 'rgba(0,0,0,0.02)',
            }}>

            {/* Drag dots */}
            <div style={{ color: C.muted, fontSize: '1rem', userSelect: 'none', textAlign: 'center' }}>⋮⋮</div>

            {/* Icon box — first letter */}
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: cat.visible ? 'linear-gradient(135deg, #F5F0EB, #EDE8E0)' : '#f0f0f0',
              border: `1px solid ${C.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.1rem', fontWeight: 900,
              color: cat.visible ? C.brown : C.muted,
              flexShrink: 0, opacity: cat.visible ? 1 : 0.5,
            }}>
              {cat.name?.charAt(0) || '؟'}
            </div>

            {/* Name */}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: cat.visible ? C.text : C.muted }}>
                {cat.name}
                {!cat.visible && (
                  <span style={{ marginRight: 8, fontSize: '0.68rem', color: C.muted, fontWeight: 500, background: '#f0f0f0', padding: '2px 8px', borderRadius: 6 }}>مخفي</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => openEdit(cat)}
                style={{ padding: '8px 14px', background: '#FAF7F4', border: `1.5px solid ${C.brown}`, color: C.brown, borderRadius: 8, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 38 }}>
                تعديل
              </button>
              <button onClick={() => handleDelete(cat)}
                style={{ padding: '8px 14px', background: '#FAF7F4', border: `1.5px solid ${C.border}`, color: C.muted, borderRadius: 8, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 38 }}>
                حذف
              </button>
            </div>
          </div>
        ))}

        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: C.muted, fontSize: '0.9rem' }}>
            لا توجد تصنيفات
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={close}>
          <div style={{ background: C.card, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 500, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -10px 50px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, flexShrink: 0 }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#F0E6D6' }}>
                {editing ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
              </span>
              <button onClick={close} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#F0E6D6', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            {/* Form body */}
            <div style={{ padding: '22px 20px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>

              <div>
                <label style={FL.lbl}>اسم التصنيف *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} style={FL.inp} placeholder="مثال: عبايات" />
              </div>

              {/* Visible toggle row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#FAF7F4', borderRadius: 12, border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: C.text }}>ظاهر في الموقع</div>
                  <div style={{ fontSize: '0.72rem', color: C.muted, marginTop: 3 }}>يظهر التصنيف للعملاء في الموقع</div>
                </div>
                <Toggle value={form.visible} onChange={v => set('visible', v)} />
              </div>

              {/* Footer buttons */}
              <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
                <button onClick={close}
                  style={{ flex: 1, padding: '13px', background: '#fff', border: `1.5px solid ${C.border}`, color: C.muted, borderRadius: 12, fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 50 }}>
                  إلغاء
                </button>
                <button onClick={handleSave}
                  style={{ flex: 2, padding: '13px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.92rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 50 }}>
                  {editing ? 'تحديث التصنيف' : 'حفظ التصنيف'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FL = {
  lbl: { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1A1A1A', marginBottom: 8 },
  inp: { width: '100%', padding: '12px 16px', border: `1.5px solid #D9D0C7`, borderRadius: 12, fontSize: '0.92rem', color: '#1A1A1A', fontFamily: "'Cairo', sans-serif", background: '#fff', boxSizing: 'border-box', outline: 'none', minHeight: 50 },
};
