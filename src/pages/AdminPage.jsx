import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

export const AdminPage = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'niqab',
    categoryName: 'النقاب',
    price: '',
    stock: ''
  });

  // Mock Orders State
  const [orders, setOrders] = useState([
    { id: '#HD-101', customer: 'فاطمة أحمد', city: 'القاهرة', phone: '01001234567', total: '570 ج.م', status: 'تم التوصيل', badge: 'success' },
    { id: '#HD-102', customer: 'مريم خالد', city: 'الإسكندرية', phone: '01119876543', total: '800 ج.م', status: 'جاري الشحن', badge: 'pending' }
  ]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'niqab',
      categoryName: 'النقاب',
      price: '250',
      stock: '20'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category || 'niqab',
      categoryName: prod.categoryName || 'النقاب',
      price: prod.price,
      stock: prod.stock || 15
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('الرجاء إدخال اسم المنتج');
      return;
    }

    const catNameMap = {
      niqab: 'النقاب',
      abayas: 'العبايات',
      khimar: 'الخمار'
    };

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      categoryName: catNameMap[formData.category] || 'قسم فاخر',
      price: parseFloat(formData.price) || 250,
      stock: parseInt(formData.stock) || 20
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      showToast('تم تعديل بيانات المنتج بنجاح');
    } else {
      addProduct(payload);
      showToast('تمت إضافة المنتج بنجاح');
    }

    setIsModalOpen(false);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) {
      deleteProduct(id);
      showToast('تم حذف المنتج بنجاح');
    }
  };

  const handleToggleOrderStatus = (orderId) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const isDelivered = ord.status === 'تم التوصيل';
          return {
            ...ord,
            status: isDelivered ? 'جاري الشحن' : 'تم التوصيل',
            badge: isDelivered ? 'pending' : 'success'
          };
        }
        return ord;
      })
    );
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('هل أنتِ متأكدة من حذف هذا الطلب؟')) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      showToast('تم حذف الطلب');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f0f12', color: '#e2e8f0', minHeight: '100vh' }}>
      <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh' }}>
        {/* Admin Sidebar */}
        <aside className="admin-sidebar" style={{ width: '250px', background: '#16161a', borderLeft: '1px solid #27272a', display: 'flex', flexDirection: 'column', padding: '20px 0', flexShrink: 0 }}>
          <div className="admin-sidebar__logo" style={{ padding: '0 24px 20px', fontSize: '1.6rem', fontWeight: 900, color: '#fff', borderBottom: '1px solid #27272a' }}>
            <span>لوحة تحكم سعودي</span>
          </div>

          <div className="admin-sidebar__menu" style={{ padding: '20px 12px', flex: 1 }}>
            <div className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <svg viewBox="0 0 24 24"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              <span>الإحصائيات الرئيسية</span>
            </div>

            <div className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
              <svg viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span>إدارة المنتجات</span>
            </div>

            <div className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
              <svg viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span>إدارة الطلبات</span>
            </div>

            <div className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
              <svg viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span>إعدادات المتجر</span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
              <Link to="/" className="admin-nav-item" style={{ color: '#ef4444' }}>
                <svg viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span>العودة للموقع</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="admin-main" style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
          <div className="admin-header">
            <div>
              <h1 className="admin-header__title">لوحة التحكم الفعالة</h1>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', margin: '4px 0 0 0' }}>إدارة شاملة ومباشرة لمتجر سعودي (React Powered)</p>
            </div>

            <div className="admin-user-pill">
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#43A047' }} />
              <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>مديرة النظام</span>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'dashboard' && (
            <div id="tab-dashboard" className="tab-content">
              <div className="admin-stats">
                <div className="stat-card">
                  <div className="stat-card__title">إجمالي المبيعات</div>
                  <div className="stat-card__value">4,250 ج.م</div>
                  <div className="stat-card__trend">مبيعات اليوم</div>
                </div>

                <div className="stat-card">
                  <div className="stat-card__title">إجمالي الطلبات</div>
                  <div className="stat-card__value">{orders.length} طلب</div>
                  <div className="stat-card__trend">طلبات نشطة</div>
                </div>

                <div className="stat-card">
                  <div className="stat-card__title">المنتجات النشطة</div>
                  <div className="stat-card__value">{products.length} منتج</div>
                  <div className="stat-card__trend">متوفرة بالمتجر</div>
                </div>

                <div className="stat-card">
                  <div className="stat-card__title">العميلات</div>
                  <div className="stat-card__value">15 عميلة</div>
                  <div className="stat-card__trend">عملاء مسجلين</div>
                </div>
              </div>

              <div className="admin-card">
                <div className="admin-card__header">
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>أحدث الطلبات المستلمة</h3>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>اسم العميلة</th>
                      <th>المحافظة</th>
                      <th>إجمالي المبلغ</th>
                      <th>حالة الطلب</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td>{ord.id}</td>
                        <td>{ord.customer}</td>
                        <td>{ord.city}</td>
                        <td>{ord.total}</td>
                        <td><span className={`badge-status ${ord.badge}`}>{ord.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Products CRUD Tab */}
          {activeTab === 'products' && (
            <div id="tab-products" className="tab-content">
              <div className="admin-card">
                <div className="admin-card__header">
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>إدارة قائمة المنتجات ({products.length})</h3>
                  <button className="admin-btn" onClick={handleOpenAdd}>+ إضافة منتج جديد</button>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>الصورة</th>
                      <th>اسم المنتج</th>
                      <th>القسم</th>
                      <th>السعر</th>
                      <th>المخزون</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => (
                      <tr key={prod.id}>
                        <td>
                          <img src={prod.image} width="40" height="50" style={{ objectFit: 'cover', borderRadius: '4px' }} alt={prod.name} />
                        </td>
                        <td>{prod.name}</td>
                        <td>{prod.categoryName || prod.category}</td>
                        <td>{parseFloat(prod.price).toLocaleString('ar-EG')} ج.م</td>
                        <td>{prod.stock || 15} قطعة</td>
                        <td>
                          <button className="admin-btn admin-btn-outline" style={{ padding: '4px 8px', marginLeft: '6px' }} onClick={() => handleOpenEdit(prod)}>
                            تعديل
                          </button>
                          <button className="admin-btn admin-btn-outline" style={{ padding: '4px 8px', color: '#ef4444' }} onClick={() => handleDeleteProduct(prod.id)}>
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div id="tab-orders" className="tab-content">
              <div className="admin-card">
                <div className="admin-card__header">
                  <h3 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>إدارة وتتبع الطلبات</h3>
                </div>

                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>رقم الطلب</th>
                      <th>اسم العميلة</th>
                      <th>رقم الهاتف</th>
                      <th>المبلغ</th>
                      <th>الحالة الحالية</th>
                      <th>الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td>{ord.id}</td>
                        <td>{ord.customer}</td>
                        <td>{ord.phone}</td>
                        <td>{ord.total}</td>
                        <td><span className={`badge-status ${ord.badge}`}>{ord.status}</span></td>
                        <td>
                          <button className="admin-btn admin-btn-outline" style={{ padding: '4px 8px', marginLeft: '6px' }} onClick={() => handleToggleOrderStatus(ord.id)}>
                            تغيير الحالة
                          </button>
                          <button className="admin-btn admin-btn-outline" style={{ padding: '4px 8px', color: '#ef4444' }} onClick={() => handleDeleteOrder(ord.id)}>
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div id="tab-settings" className="tab-content">
              <div className="admin-card" style={{ maxWidth: '550px' }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '20px' }}>إعدادات المتجر العامة</h3>
                
                <div className="admin-form-group">
                  <label>اسم البراند:</label>
                  <input type="text" className="admin-input" defaultValue="سعودي (Saudi Boutique)" />
                </div>

                <div className="admin-form-group">
                  <label>حد الشحن المجاني (ج.م):</label>
                  <input type="number" className="admin-input" defaultValue="500" />
                </div>

                <div className="admin-form-group">
                  <label>كود الخصم الفعال:</label>
                  <input type="text" className="admin-input" defaultValue="SAUDI15" />
                </div>

                <button className="admin-btn" style={{ marginTop: '10px' }} onClick={() => showToast('تم حفظ إعدادات المتجر بنجاح!')}>
                  حفظ التغييرات
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal Dialog */}
      <div className={`admin-modal ${isModalOpen ? 'active' : ''}`} id="product-modal">
        <div className="admin-modal__content">
          <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '15px' }}>
            {editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
          </h3>

          <form onSubmit={handleSaveProduct}>
            <div className="admin-form-group">
              <label>اسم المنتج:</label>
              <input
                type="text"
                className="admin-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="مثال: نقاب ساتان فاخر"
              />
            </div>

            <div className="admin-form-group">
              <label>القسم:</label>
              <select
                className="admin-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="niqab">النقاب</option>
                <option value="abayas">العبايات</option>
                <option value="khimar">الخمار</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>السعر (ج.م):</label>
              <input
                type="number"
                className="admin-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="250"
              />
            </div>

            <div className="admin-form-group">
              <label>المخزون (قطع):</label>
              <input
                type="number"
                className="admin-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="20"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button type="button" className="admin-btn admin-btn-outline" onClick={() => setIsModalOpen(false)}>
                إلغاء
              </button>
              <button type="submit" className="admin-btn">
                حفظ المنتج
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
