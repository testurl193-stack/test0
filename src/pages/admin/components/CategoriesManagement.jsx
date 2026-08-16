import React, { useState } from 'react';
import { useAdminData } from '../../../context/AdminDataContext';
import { useToast } from '../../../context/ToastContext';

const C = {
  brown: '#5C2E0A', brownMid: '#8B4513', brownLight: '#C4783A',
  card: '#FFFFFF', border: '#D9D0C7', text: '#1A1A1A', muted: '#7A7A7A',
  red: '#DC2626', green: '#16A34A',
  dark: '#1C1208', darkMid: '#2E1E0D',
};

const emptyForm = { name: '', visible: true };

const Toggle = ({ value, onChange }) => (
  <button type="button" onClick={() => onChange(!value)}
    style={{ width: 48, height: 28, borderRadius: 14, background: value ? C.brown : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
    <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 4, transition: 'right 0.2s', right: value ? 4 : 24 }} />
  </button>
);

const StatusPill = ({ visible }) => {
  const color = visible ? C.green : C.muted;
  const label = visible ? 'ظاهر' : 'مخفي';
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: 700, color,
      background: color + '14', padding: '5px 12px',
      borderRadius: 20, border: `1px solid ${color}28`,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
};

const CategoryRow = ({ cat, index, onOpen, onDragStart, onDragOver, onDragEnd, dragging, isLast }) => {
  const barColor = cat.visible ? C.green : C.muted;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onClick={() => onOpen(cat)}
      style={{
        display: 'flex', alignItems: 'stretch', gap: 10,
        padding: '14px 16px',
        borderBottom: isLast ? 'none' : '1px solid #F0EBE4',
        cursor: 'pointer', transition: 'background 0.15s, opacity 0.2s',
        opacity: dragging ? 0.45 : 1,
        background: cat.visible ? 'transparent' : 'rgba(0,0,0,0.02)',
      }}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ color: C.muted, fontSize: '1rem', userSelect: 'none', flexShrink: 0, width: 18, textAlign: 'center', cursor: 'grab', alignSelf: 'center' }}>
        ⋮⋮
      </div>

      <div style={{ width: 4, borderRadius: 2, background: barColor, flexShrink: 0, opacity: 0.75, alignSelf: 'stretch', minHeight: 44 }} />

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: cat.visible ? C.text : C.muted, wordBreak: 'break-word' }}>
          {cat.name}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: C.muted, background: '#F5F0EB', border: `1px solid ${C.border}`, padding: '3px 9px', borderRadius: 7 }}>
            الترتيب {index + 1}
          </span>
          <StatusPill visible={cat.visible} />
        </div>
      </div>
    </div>
  );
};

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

  const handleDelete = () => {
    if (!editing) return;
    if (window.confirm(`حذف تصنيف "${editing.name}"؟`)) {
      deleteCategory(editing.id);
      showToast('تم حذف التصنيف');
      close();
    }
  };

  const sorted = [...categories].sort((a, b) => a.order - b.order);

  const onDragStart = (i) => setDragging(i);
  const onDragOver  = (e, i) => {
    e.preventDefault();
    if (dragging === null || dragging === i) return;
    const list = [...sorted];
    const [item] = list.splice(dragging, 1);
    list.splice(i, 0, item);
    reorderCategories(list);
    setDragging(i);
  };
  const onDragEnd = () => setDragging(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.brown, margin: 0 }}>التصنيفات</h2>
          <p style={{ fontSize: '0.78rem', color: C.muted, margin: '4px 0 0' }}>اسحب ⋮⋮ لتغيير الترتيب · اضغط للتعديل</p>
        </div>
        <button onClick={openAdd} style={{
          padding: '11px 22px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`,
          color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700,
          fontSize: '0.9rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif",
          minHeight: 46, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', whiteSpace: 'nowrap',
        }}>+ إضافة تصنيف</button>
      </div>

      <div style={{ fontSize: '0.8rem', color: C.muted, fontWeight: 600 }}>{sorted.length} تصنيف</div>

      {/* Table card — same layout as Orders */}
      {sorted.length > 0 ? (
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
            اسحب ⋮⋮ لتغيير الترتيب · اضغط للتعديل
          </div>
          <div>
            {sorted.map((cat, i) => (
              <CategoryRow
                key={cat.id}
                cat={cat}
                index={i}
                onOpen={openEdit}
                onDragStart={() => onDragStart(i)}
                onDragOver={(e) => onDragOver(e, i)}
                onDragEnd={onDragEnd}
                dragging={dragging === i}
                isLast={i === sorted.length - 1}
              />
            ))}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: C.muted, fontSize: '0.95rem', background: C.card, borderRadius: 16, border: `1px solid ${C.border}` }}>
          لا توجد تصنيفات
        </div>
      )}

      {/* Modal */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}
          onClick={close}>
          <div style={{ background: C.card, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 -10px 50px rgba(0,0,0,0.3)' }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, flexShrink: 0 }}>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: '#F0E6D6' }}>
                {editing ? `تعديل ${editing.name}` : 'إضافة تصنيف جديد'}
              </span>
              <button type="button" onClick={close} style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: '#F0E6D6', fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ padding: '18px 16px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>

              <div>
                <label style={FL.lbl}>اسم التصنيف *</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} style={FL.inp} placeholder="مثال: عبايات" />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#FAF7F4', borderRadius: 10, border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: C.text }}>ظاهر في الموقع</div>
                  <div style={{ fontSize: '0.7rem', color: C.muted, marginTop: 2 }}>يظهر التصنيف للعملاء في الموقع</div>
                </div>
                <Toggle value={form.visible} onChange={v => set('visible', v)} />
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={close}
                  style={{ flex: 1, padding: '11px', background: '#fff', border: `1.5px solid ${C.border}`, color: C.muted, borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}>
                  إلغاء
                </button>
                <button type="button" onClick={handleSave}
                  style={{ flex: 2, padding: '11px', background: `linear-gradient(135deg, ${C.dark}, ${C.darkMid})`, color: '#F0E6D6', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}>
                  {editing ? 'تحديث التصنيف' : 'حفظ التصنيف'}
                </button>
              </div>

              {editing && (
                <button type="button" onClick={handleDelete}
                  style={{ width: '100%', padding: '12px', background: 'rgba(220,38,38,0.06)', border: '1.5px solid rgba(220,38,38,0.25)', color: C.red, borderRadius: 12, fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', fontFamily: "'Cairo', sans-serif", minHeight: 44 }}>
                  حذف التصنيف
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FL = {
  lbl: { display: 'block', fontSize: '0.8rem', fontWeight: 700, color: C.text, marginBottom: 6 },
  inp: {
    width: '100%', padding: '10px 12px', border: `1.5px solid ${C.border}`,
    borderRadius: 10, fontSize: '0.88rem', color: C.text, fontFamily: "'Cairo', sans-serif",
    background: '#fff', boxSizing: 'border-box', outline: 'none', minHeight: 42,
  },
};
