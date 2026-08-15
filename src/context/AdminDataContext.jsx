import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminDataContext = createContext();

// ── بيانات أولية للطلبات ──────────────────────────────────────────────────
const initialOrders = [
  {
    id: 'HD-1001', date: '2026-08-10', status: 'new',
    customer: { name: 'فاطمة أحمد', phone: '01001234567', email: 'fatima@example.com', governorate: 'القاهرة', address: 'مدينة نصر، شارع عباس العقاد' },
    items: [
      { name: 'نقاب كلاسيكي', size: 'M', color: { name: 'أسود', hex: '#000000' }, qty: 2, price: 250 },
      { name: 'خمار ليلاك', size: 'L', color: { name: 'وردي', hex: '#FFC0CB' }, qty: 1, price: 320 },
    ],
    subtotal: 820, discount: 0, shippingCost: 50, total: 870,
    payment: { method: 'cash', status: 'pending', ref: '' },
    shippingInfo: { company: '', trackingNo: '', status: 'pending' },
    notes: '',
    timeline: [{ status: 'new', label: 'تم إنشاء الطلب', date: '2026-08-10T10:00:00' }],
  },
  {
    id: 'HD-1002', date: '2026-08-09', status: 'processing',
    customer: { name: 'مريم خالد', phone: '01119876543', email: 'maryam@example.com', governorate: 'الإسكندرية', address: 'سيدي جابر، شارع الجيش' },
    items: [
      { name: 'عباية بيج كريمي', size: 'L', color: { name: 'بيج', hex: '#F5F5DC' }, qty: 1, price: 450 },
    ],
    subtotal: 450, discount: 50, shippingCost: 60, total: 460,
    payment: { method: 'vodafone', status: 'paid', ref: 'VF-99123' },
    shippingInfo: { company: '', trackingNo: '', status: 'pending' },
    notes: 'العميلة طلبت تغليف هدية',
    timeline: [
      { status: 'new', label: 'تم إنشاء الطلب', date: '2026-08-09T09:00:00' },
      { status: 'confirmed', label: 'تم تأكيد الطلب', date: '2026-08-09T10:30:00' },
      { status: 'processing', label: 'قيد التجهيز', date: '2026-08-09T14:00:00' },
    ],
  },
  {
    id: 'HD-1003', date: '2026-08-08', status: 'shipped',
    customer: { name: 'نور السيد', phone: '01234567890', email: 'noor@example.com', governorate: 'الجيزة', address: 'المهندسين، شارع جامعة الدول' },
    items: [
      { name: 'خمار بني شوكولاتة', size: 'M', color: { name: 'بني', hex: '#8B4513' }, qty: 2, price: 280 },
    ],
    subtotal: 560, discount: 0, shippingCost: 50, total: 610,
    payment: { method: 'cash', status: 'pending', ref: '' },
    shippingInfo: { company: 'بريد مصر', trackingNo: 'EG123456789', status: 'shipped' },
    notes: '',
    timeline: [
      { status: 'new', label: 'تم إنشاء الطلب', date: '2026-08-08T08:00:00' },
      { status: 'confirmed', label: 'تم تأكيد الطلب', date: '2026-08-08T09:00:00' },
      { status: 'processing', label: 'قيد التجهيز', date: '2026-08-08T11:00:00' },
      { status: 'shipped', label: 'تم الشحن', date: '2026-08-08T16:00:00' },
    ],
  },
  {
    id: 'HD-1004', date: '2026-08-07', status: 'delivered',
    customer: { name: 'سارة محمد', phone: '01098765432', email: 'sara@example.com', governorate: 'القاهرة', address: 'مصر الجديدة، شارع الحجاز' },
    items: [
      { name: 'عباية كحلي ملكية', size: 'XL', color: { name: 'كحلي', hex: '#000080' }, qty: 1, price: 480 },
    ],
    subtotal: 480, discount: 0, shippingCost: 50, total: 530,
    payment: { method: 'cash', status: 'paid', ref: '' },
    shippingInfo: { company: 'J&T Express', trackingNo: 'JT987654321', status: 'delivered' },
    notes: '',
    timeline: [
      { status: 'new', label: 'تم إنشاء الطلب', date: '2026-08-07T10:00:00' },
      { status: 'confirmed', label: 'تم تأكيد الطلب', date: '2026-08-07T10:30:00' },
      { status: 'processing', label: 'قيد التجهيز', date: '2026-08-07T13:00:00' },
      { status: 'shipped', label: 'تم الشحن', date: '2026-08-07T17:00:00' },
      { status: 'out_for_delivery', label: 'خرج للتوصيل', date: '2026-08-08T09:00:00' },
      { status: 'delivered', label: 'تم التسليم', date: '2026-08-08T14:00:00' },
    ],
  },
  {
    id: 'HD-1005', date: '2026-08-06', status: 'cancelled',
    customer: { name: 'هناء علي', phone: '01155443322', email: 'hanaa@example.com', governorate: 'المنصورة', address: 'شارع الجلاء' },
    items: [
      { name: 'نقاب مائل تانوش', size: 'M', color: { name: 'أسود', hex: '#000000' }, qty: 3, price: 290 },
    ],
    subtotal: 870, discount: 0, shippingCost: 55, total: 925,
    payment: { method: 'cash', status: 'pending', ref: '' },
    shippingInfo: { company: '', trackingNo: '', status: 'cancelled' },
    notes: 'العميلة ألغت الطلب',
    timeline: [
      { status: 'new', label: 'تم إنشاء الطلب', date: '2026-08-06T11:00:00' },
      { status: 'cancelled', label: 'تم الإلغاء', date: '2026-08-06T12:00:00' },
    ],
  },
];

// ── بيانات أولية للتصنيفات ────────────────────────────────────────────────
const initialCategories = [
  { id: 'abaya', name: 'عبايات', nameEn: 'Abayas', icon: '👗', order: 1, visible: true, productCount: 0 },
  { id: 'niqab', name: 'نقاب', nameEn: 'Niqab', icon: '🖤', order: 2, visible: true, productCount: 0 },
  { id: 'khimar', name: 'خمار', nameEn: 'Khimar', icon: '🧕', order: 3, visible: true, productCount: 0 },
  { id: 'accessories', name: 'إكسسوارات', nameEn: 'Accessories', icon: '✨', order: 4, visible: true, productCount: 0 },
];

// ── بيانات أولية للكوبونات ────────────────────────────────────────────────
const initialCoupons = [
  {
    id: 'CPN-001', code: 'WELCOME10', type: 'percent', value: 10,
    minOrder: 200, maxDiscount: 100,
    startDate: '2026-01-01', endDate: '2026-12-31',
    usageLimit: 100, usedCount: 23, oncePerCustomer: true,
    active: true, description: 'خصم ترحيبي للعملاء الجدد',
  },
  {
    id: 'CPN-002', code: 'EID50', type: 'fixed', value: 50,
    minOrder: 500, maxDiscount: 50,
    startDate: '2026-03-01', endDate: '2026-04-30',
    usageLimit: 50, usedCount: 50, oncePerCustomer: false,
    active: false, description: 'خصم العيد',
  },
];

// ── بيانات أولية لإعدادات المتجر ─────────────────────────────────────────
const initialSettings = {
  storeName: 'هدية للعبايات',
  storeNameEn: 'Hadiya Abayas',
  currency: 'ج.م',
  phone: '01234567890',
  whatsapp: '01234567890',
  email: 'hadiya@example.com',
  address: 'القاهرة، مصر',
  facebook: '',
  instagram: '',
  tiktok: '',
  minOrderFree: 1000,
  defaultShipping: 50,
  freeShippingEnabled: true,
  returnPolicy: '7 أيام استرجاع',
  metaTitle: 'هدية للعبايات — أفخر العبايات والأزياء المحتشمة',
  metaDescription: 'تسوقي أجمل العبايات والنقاب والخمار من متجر هدية',
};

// ─────────────────────────────────────────────────────────────────────────────

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
};

export const AdminDataProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => load('hadiya_orders', initialOrders));
  const [categories, setCategories] = useState(() => load('hadiya_categories', initialCategories));
  const [coupons, setCoupons] = useState(() => load('hadiya_coupons', initialCoupons));
  const [settings, setSettings] = useState(() => load('hadiya_settings', initialSettings));

  useEffect(() => { localStorage.setItem('hadiya_orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('hadiya_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('hadiya_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('hadiya_settings', JSON.stringify(settings)); }, [settings]);

  // ── Orders ────────────────────────────────────────────────────────────────
  const addOrder = (order) => {
    const newOrder = { ...order, id: `HD-${Date.now()}`, date: new Date().toISOString().split('T')[0], timeline: [{ status: 'new', label: 'تم إنشاء الطلب', date: new Date().toISOString() }] };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrder = (id, fields) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...fields } : o));
  };

  const updateOrderStatus = (id, newStatus) => {
    const statusLabels = {
      confirmed: 'تم تأكيد الطلب', processing: 'قيد التجهيز',
      shipped: 'تم الشحن', out_for_delivery: 'خرج للتوصيل',
      delivered: 'تم التسليم', cancelled: 'تم الإلغاء', returned: 'تم الاسترجاع',
    };
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const newStep = { status: newStatus, label: statusLabels[newStatus] || newStatus, date: new Date().toISOString() };
      return { ...o, status: newStatus, timeline: [...(o.timeline || []), newStep] };
    }));
  };

  const deleteOrder = (id) => setOrders(prev => prev.filter(o => o.id !== id));

  // ── Categories ────────────────────────────────────────────────────────────
  const addCategory = (cat) => {
    const newCat = { ...cat, id: cat.name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(), order: categories.length + 1 };
    setCategories(prev => [...prev, newCat]);
  };
  const updateCategory = (id, fields) => setCategories(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));
  const reorderCategories = (newList) => setCategories(newList.map((c, i) => ({ ...c, order: i + 1 })));

  // ── Coupons ───────────────────────────────────────────────────────────────
  const addCoupon = (coupon) => {
    const newCoupon = { ...coupon, id: `CPN-${Date.now()}`, usedCount: 0 };
    setCoupons(prev => [newCoupon, ...prev]);
  };
  const updateCoupon = (id, fields) => setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...fields } : c));
  const deleteCoupon = (id) => setCoupons(prev => prev.filter(c => c.id !== id));

  // ── Settings ──────────────────────────────────────────────────────────────
  const updateSettings = (fields) => setSettings(prev => ({ ...prev, ...fields }));

  // ── Computed stats ────────────────────────────────────────────────────────
  const stats = React.useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = today.slice(0, 7);
    const delivered = orders.filter(o => o.status === 'delivered');
    const todayOrders = orders.filter(o => o.date === today);
    const monthOrders = orders.filter(o => o.date?.startsWith(thisMonth));
    return {
      totalSales: delivered.reduce((s, o) => s + (o.total || 0), 0),
      todaySales: todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total || 0), 0),
      monthSales: monthOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.total || 0), 0),
      totalOrders: orders.length,
      newOrders: orders.filter(o => o.status === 'new').length,
      processingOrders: orders.filter(o => o.status === 'processing').length,
      shippedOrders: orders.filter(o => o.status === 'shipped' || o.status === 'out_for_delivery').length,
      deliveredOrders: delivered.length,
      cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
    };
  }, [orders]);

  return (
    <AdminDataContext.Provider value={{
      orders, addOrder, updateOrder, updateOrderStatus, deleteOrder,
      categories, addCategory, updateCategory, deleteCategory, reorderCategories,
      coupons, addCoupon, updateCoupon, deleteCoupon,
      settings, updateSettings,
      stats,
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error('useAdminData must be used within AdminDataProvider');
  return ctx;
};
