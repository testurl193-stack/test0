/* ============================================
   هدية - Hadiya Abaya Store Cart Management
   Handles localStorage, Cart Drawer & Cart Page
   ============================================ */

class CartManager {
  constructor() {
    this.storageKey = 'hadiya_cart_items';
    this.cart = this.getCart();
    this.init();
  }

  init() {
    this.updateBadges();
    this.renderCartDrawer();
    this.renderCartPage();
    this.bindEvents();
  }

  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey)) || [
        {
          id: '1',
          name: 'نقاب كلاسيكي بدون اسم (جبهة)',
          price: 250,
          image: 'images/products/black-niqab.png',
          color: 'أسود',
          size: 'M',
          quantity: 1
        },
        {
          id: '2',
          name: 'خمار ليلاك بودر درابيه أنيق',
          price: 320,
          image: 'images/products/lilac-khimar.png',
          color: 'ليلاك',
          size: 'L',
          quantity: 1
        }
      ];
    } catch (e) {
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    this.updateBadges();
    this.renderCartDrawer();
    this.renderCartPage();
  }

  addItem(product) {
    const existingIndex = this.cart.findIndex(
      item => item.id === product.id && item.color === product.color && item.size === product.size
    );

    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += product.quantity || 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image,
        color: product.color || 'أسود',
        size: product.size || 'M',
        quantity: product.quantity || 1
      });
    }

    this.saveCart();
    this.openCartDrawer();
    if (window.showToast) {
      window.showToast('تمت إضافة المنتج للسلة بنجاح');
    }
  }

  removeItem(id, color, size) {
    this.cart = this.cart.filter(
      item => !(item.id === id && (!color || item.color === color) && (!size || item.size === size))
    );
    this.saveCart();
    if (window.showToast) {
      window.showToast('تم إزالة المنتج من السلة');
    }
  }

  updateQuantity(id, color, size, delta) {
    const item = this.cart.find(
      i => i.id === id && (!color || i.color === color) && (!size || i.size === size)
    );
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(id, color, size);
      } else {
        this.saveCart();
      }
    }
  }

  getTotalCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  getTotalPrice() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  updateBadges() {
    const count = this.getTotalCount();
    const cartCountEl = document.getElementById('cart-count');
    const drawerCountEl = document.getElementById('cart-drawer-count');
    const mobileCartCountEl = document.getElementById('mobile-cart-count');

    if (cartCountEl) {
      cartCountEl.textContent = count;
      if (count > 0) {
        cartCountEl.classList.add('visible');
        cartCountEl.classList.add('badge-pop');
        setTimeout(() => cartCountEl.classList.remove('badge-pop'), 400);
      } else {
        cartCountEl.classList.remove('visible');
      }
    }

    if (mobileCartCountEl) {
      mobileCartCountEl.textContent = count;
      if (count > 0) mobileCartCountEl.classList.add('visible');
      else mobileCartCountEl.classList.remove('visible');
    }

    if (drawerCountEl) {
      drawerCountEl.textContent = count;
    }
  }

  renderCartDrawer() {
    const drawerItemsContainer = document.getElementById('cart-drawer-items');
    const drawerTotalEl = document.getElementById('cart-drawer-total');

    if (!drawerItemsContainer) return;

    if (this.cart.length === 0) {
      drawerItemsContainer.innerHTML = `
        <div style="text-align:center; padding: 40px 10px; color:#888;">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="margin-bottom:15px; opacity:0.5;"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <p>سلتكِ فارغة حالياً</p>
        </div>
      `;
    } else {
      drawerItemsContainer.innerHTML = this.cart.map(item => `
        <div class="cart-drawer-item" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">
          <div class="cart-drawer-item__image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div>
            <h4 class="cart-drawer-item__name">${item.name}</h4>
            <div class="cart-drawer-item__variant">اللون: ${item.color} | المقاس: ${item.size}</div>
            <div class="cart-drawer-item__bottom">
              <span class="cart-drawer-item__price">${(item.price * item.quantity).toLocaleString('ar-EG')} ج.م</span>
              <div class="quantity-selector" style="transform: scale(0.85); transform-origin: left center;">
                <button class="quantity-selector__btn cart-qty-minus">-</button>
                <input type="text" class="quantity-selector__input" value="${item.quantity}" readonly>
                <button class="quantity-selector__btn cart-qty-plus">+</button>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (drawerTotalEl) {
      drawerTotalEl.textContent = this.getTotalPrice().toLocaleString('ar-EG') + ' ج.م';
    }
  }

  renderCartPage() {
    const itemsContainer = document.getElementById('cart-items-container');
    const wrapper = document.getElementById('cart-content-wrapper');
    const emptyView = document.getElementById('cart-empty-view');
    const subtotalEl = document.getElementById('cart-summary-subtotal');
    const totalEl = document.getElementById('cart-summary-total');

    if (!itemsContainer) return;

    if (this.cart.length === 0) {
      if (wrapper) wrapper.style.display = 'none';
      if (emptyView) emptyView.style.display = 'block';
    } else {
      if (wrapper) wrapper.style.display = 'grid';
      if (emptyView) emptyView.style.display = 'none';

      itemsContainer.innerHTML = this.cart.map(item => `
        <div class="cart-item" data-id="${item.id}" data-color="${item.color}" data-size="${item.size}">
          <div class="cart-item__image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div>
            <h3 class="cart-item__name">${item.name}</h3>
            <div class="cart-item__variant">اللون: <strong>${item.color}</strong> | المقاس: <strong>${item.size}</strong></div>
            <button class="cart-item__remove cart-item-delete">إزالة القطعة</button>
          </div>
          <div style="text-align: left;">
            <div class="cart-item__price" style="margin-bottom:10px;">${(item.price * item.quantity).toLocaleString('ar-EG')} ج.م</div>
            <div class="quantity-selector">
              <button class="quantity-selector__btn cart-qty-minus">-</button>
              <input type="text" class="quantity-selector__input" value="${item.quantity}" readonly>
              <button class="quantity-selector__btn cart-qty-plus">+</button>
            </div>
          </div>
        </div>
      `).join('');

      if (subtotalEl) subtotalEl.textContent = this.getTotalPrice().toLocaleString('ar-EG') + ' ج.م';
      if (totalEl) totalEl.textContent = this.getTotalPrice().toLocaleString('ar-EG') + ' ج.م';
    }
  }

  openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    drawer?.classList.add('active');
    overlay?.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    drawer?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  bindEvents() {
    const cartToggle = document.getElementById('cart-toggle');
    const mobileBottomCart = document.getElementById('mobile-bottom-cart');
    const cartClose = document.getElementById('cart-close');
    const cartOverlay = document.getElementById('cart-overlay');

    cartToggle?.addEventListener('click', () => this.openCartDrawer());
    mobileBottomCart?.addEventListener('click', () => this.openCartDrawer());
    cartClose?.addEventListener('click', () => this.closeCartDrawer());
    cartOverlay?.addEventListener('click', () => this.closeCartDrawer());

    document.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.add-to-cart-btn');
      if (addBtn) {
        const card = addBtn.closest('.product-card');
        if (card) {
          this.addItem({
            id: card.dataset.id,
            name: card.dataset.name,
            price: card.dataset.price,
            image: card.dataset.image,
            quantity: 1
          });
        }
      }

      const detailAddBtn = e.target.closest('.add-to-cart-page-btn');
      if (detailAddBtn) {
        const qtyVal = parseInt(document.getElementById('qty-input')?.value || '1');
        const activeColor = document.querySelector('.color-swatch.active')?.dataset.color || 'أسود';
        const activeSize = document.querySelector('.size-btn.active')?.textContent || 'M';

        this.addItem({
          id: detailAddBtn.dataset.id,
          name: detailAddBtn.dataset.name,
          price: detailAddBtn.dataset.price,
          image: detailAddBtn.dataset.image,
          color: activeColor,
          size: activeSize,
          quantity: qtyVal
        });
      }

      if (e.target.classList.contains('cart-qty-plus')) {
        const itemEl = e.target.closest('[data-id]');
        if (itemEl) {
          this.updateQuantity(itemEl.dataset.id, itemEl.dataset.color, itemEl.dataset.size, 1);
        }
      }

      if (e.target.classList.contains('cart-qty-minus')) {
        const itemEl = e.target.closest('[data-id]');
        if (itemEl) {
          this.updateQuantity(itemEl.dataset.id, itemEl.dataset.color, itemEl.dataset.size, -1);
        }
      }

      if (e.target.classList.contains('cart-item-delete')) {
        const itemEl = e.target.closest('[data-id]');
        if (itemEl) {
          this.removeItem(itemEl.dataset.id, itemEl.dataset.color, itemEl.dataset.size);
        }
      }

      if (e.target.id === 'checkout-btn') {
        alert('شكراً لثقتكِ بـ هدية! تم استلام طلبكِ بنجاح وسيتواصل معكِ فريق الدعم لخدمة التوصيل.');
        this.cart = [];
        this.saveCart();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.cartManager = new CartManager();
});
