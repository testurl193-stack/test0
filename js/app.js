/* ============================================
   هدية - Hadiya Abaya Store Main Application Logic
   Optimized for Ultra-Fast 60FPS Performance
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Toast Notification System ---- */
  window.showToast = function(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  };

  /* ---- Prevent Default on Dead Links (#) ---- */
  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.addEventListener('click', (e) => e.preventDefault());
  });

  /* ---- Header Scroll (Throttled with requestAnimationFrame for 60fps) ---- */
  const header = document.getElementById('header');
  let isScrolling = false;

  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 20) {
          header?.classList.add('scrolled');
        } else {
          header?.classList.remove('scrolled');
        }
        isScrolling = false;
      });
      isScrolling = true;
    }
  }, { passive: true });

  /* ---- Fast Hero Slider ---- */
  const slides = document.querySelectorAll('.hero__slide');
  const dots = document.querySelectorAll('.hero__dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');
  let currentSlide = 0;
  let slideInterval = null;

  function goToSlide(index) {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide]?.classList.remove('active');

    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide]?.classList.add('active');
  }

  function startSlideShow() {
    if (slides.length <= 1) return;
    stopSlideShow();
    slideInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 4500);
  }

  function stopSlideShow() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (slides.length > 0) {
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        startSlideShow();
      });
    });

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      startSlideShow();
    });

    nextBtn?.addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      startSlideShow();
    });

    startSlideShow();
  }

  /* ---- Mobile Navigation Menu ---- */
  const menuToggle = document.getElementById('menu-toggle');
  const menuClose = document.getElementById('menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileOverlay = document.getElementById('mobile-overlay');

  function openMobileMenu() {
    mobileMenu?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeMobileMenu() {
    mobileMenu?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  menuToggle?.addEventListener('click', openMobileMenu);
  menuClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  /* ---- Search Overlay & Real-Time Search Filter ---- */
  const searchToggle = document.getElementById('search-toggle');
  const mobileBottomSearch = document.getElementById('mobile-bottom-search');
  const searchClose = document.getElementById('search-close');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = document.getElementById('search-input');

  function openSearch() {
    searchOverlay?.classList.add('active');
    setTimeout(() => searchInput?.focus(), 80);
  }

  function closeSearch() {
    searchOverlay?.classList.remove('active');
  }

  searchToggle?.addEventListener('click', openSearch);
  mobileBottomSearch?.addEventListener('click', openSearch);
  searchClose?.addEventListener('click', closeSearch);

  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const productCards = document.querySelectorAll('.products-grid .product-card');
    
    productCards.forEach(card => {
      const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
      const cat = card.querySelector('.product-card__category')?.textContent.toLowerCase() || '';
      
      if (name.includes(query) || cat.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearch();
      closeMobileMenu();
      closeWishlistDrawer();
    }
  });

  /* ---- Wishlist Drawer ---- */
  let wishlistedItems = JSON.parse(localStorage.getItem('hadiya_wishlist_items')) || [];

  const wishlistBtnHeader = document.getElementById('wishlist-btn');
  const mobileBottomWishlist = document.getElementById('mobile-bottom-wishlist');
  const wishlistCountBadge = document.getElementById('wishlist-count');
  const mobileWishlistBadge = document.getElementById('mobile-wishlist-count');
  const wishlistDrawer = document.getElementById('wishlist-drawer');
  const wishlistOverlay = document.getElementById('wishlist-overlay');
  const wishlistClose = document.getElementById('wishlist-close');
  const wishlistItemsContainer = document.getElementById('wishlist-drawer-items');

  function updateWishlistUI() {
    const count = wishlistedItems.length;
    if (wishlistCountBadge) {
      wishlistCountBadge.textContent = count;
      if (count > 0) wishlistCountBadge.classList.add('visible');
      else wishlistCountBadge.classList.remove('visible');
    }
    if (mobileWishlistBadge) {
      mobileWishlistBadge.textContent = count;
      if (count > 0) mobileWishlistBadge.classList.add('visible');
      else mobileWishlistBadge.classList.remove('visible');
    }

    if (wishlistItemsContainer) {
      if (wishlistedItems.length === 0) {
        wishlistItemsContainer.innerHTML = `
          <div style="text-align:center; padding: 40px 10px; color:#888;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="margin-bottom:15px; opacity:0.5;"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            <p>لا توجد منتجات في قائمة المفضلة حالياً</p>
          </div>
        `;
      } else {
        wishlistItemsContainer.innerHTML = wishlistedItems.map(item => `
          <div class="cart-drawer-item" data-id="${item.id}">
            <div class="cart-drawer-item__image">
              <img src="${item.image}" alt="${item.name}">
            </div>
            <div style="flex:1;">
              <h4 class="cart-drawer-item__name">${item.name}</h4>
              <div class="cart-drawer-item__price">${parseFloat(item.price).toLocaleString('ar-EG')} ج.م</div>
              <div style="display:flex; gap:8px; margin-top:8px;">
                <button class="btn btn-primary add-to-cart-btn" style="padding:4px 12px; font-size:12px;">أضف للسلة</button>
                <button class="remove-wishlist-item" data-id="${item.id}" style="color:#ef4444; font-size:12px; border:none; background:none; cursor:pointer;">إزالة</button>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  function openWishlistDrawer() {
    updateWishlistUI();
    wishlistDrawer?.classList.add('active');
    wishlistOverlay?.classList.add('active');
    document.body.classList.add('no-scroll');
  }

  function closeWishlistDrawer() {
    wishlistDrawer?.classList.remove('active');
    wishlistOverlay?.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }

  wishlistBtnHeader?.addEventListener('click', openWishlistDrawer);
  mobileBottomWishlist?.addEventListener('click', openWishlistDrawer);
  wishlistClose?.addEventListener('click', closeWishlistDrawer);
  wishlistOverlay?.addEventListener('click', closeWishlistDrawer);

  document.addEventListener('click', (e) => {
    const wishlistToggle = e.target.closest('.wishlist-toggle-btn');
    if (wishlistToggle) {
      e.preventDefault();
      const card = wishlistToggle.closest('.product-card') || wishlistToggle.closest('.product-gallery');
      const id = card?.dataset.id || '1';
      const name = card?.dataset.name || document.querySelector('.product-details__title')?.textContent || 'منتج هدية';
      const price = card?.dataset.price || '250';
      const image = card?.dataset.image || document.getElementById('main-product-img')?.src || 'images/products/black-niqab.png';

      const existingIndex = wishlistedItems.findIndex(i => i.id === id);
      if (existingIndex > -1) {
        wishlistedItems.splice(existingIndex, 1);
        wishlistToggle.classList.remove('wishlisted');
        showToast('تمت إزالة المنتج من مفضلتكِ');
      } else {
        wishlistedItems.push({ id, name, price, image });
        wishlistToggle.classList.add('wishlisted');
        showToast('تمت إضافة المنتج لمفضلتكِ');
      }

      localStorage.setItem('hadiya_wishlist_items', JSON.stringify(wishlistedItems));
      updateWishlistUI();
    }

    if (e.target.classList.contains('remove-wishlist-item')) {
      const id = e.target.dataset.id;
      wishlistedItems = wishlistedItems.filter(i => i.id !== id);
      localStorage.setItem('hadiya_wishlist_items', JSON.stringify(wishlistedItems));
      updateWishlistUI();
      showToast('تمت إزالة المنتج من المفضلة');
    }
  });

  updateWishlistUI();

  /* ---- Scroll to Top Button ---- */
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn?.classList.add('visible');
    } else {
      scrollTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---- Product Page Interactivity ---- */
  const mainImg = document.getElementById('main-product-img');
  const thumbs = document.querySelectorAll('.product-gallery__thumb');
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.querySelector('img')?.src;
      if (mainImg && newSrc) mainImg.src = newSrc;
    });
  });

  const colorSwatches = document.querySelectorAll('.color-swatch');
  const colorLabel = document.getElementById('selected-color-label');
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      if (colorLabel && swatch.dataset.color) colorLabel.textContent = swatch.dataset.color;
    });
  });

  const sizeBtns = document.querySelectorAll('.size-btn');
  const sizeLabel = document.getElementById('selected-size-label');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (sizeLabel) sizeLabel.textContent = btn.textContent;
    });
  });

  const qtyInput = document.getElementById('qty-input');
  document.getElementById('qty-minus')?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    if (val > 1) qtyInput.value = val - 1;
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    let val = parseInt(qtyInput.value) || 1;
    qtyInput.value = val + 1;
  });

  /* ---- Shop Page Live Filters ---- */
  const productCards = document.querySelectorAll('.products-grid .product-card');
  const categoryCheckboxes = document.querySelectorAll('.filter-checkbox');
  const priceRange = document.getElementById('price-range');
  const priceValue = document.getElementById('price-value');
  const sortSelect = document.getElementById('sort-select');

  function applyShopFilters() {
    if (productCards.length === 0) return;

    const selectedCategories = Array.from(categoryCheckboxes)
      .filter(cb => cb.checked)
      .map(cb => cb.dataset.category);

    const maxPrice = priceRange ? parseInt(priceRange.value) : 1000;
    let visibleCount = 0;

    // إذا ما في شيء محدد أو "all" محدود → اعرض الكل
    const showAll = selectedCategories.length === 0 || selectedCategories.includes('all');

    productCards.forEach(card => {
      const cat = card.querySelector('.product-card__category')?.textContent.trim() || '';
      const price = parseFloat(card.dataset.price || '0');

      const catMap = { 'niqab': 'نقاب', 'abayas': 'عبايات', 'khimar': 'خمار' };
      let matchesCat = showAll || selectedCategories.some(c => catMap[c] === cat || c === cat);
      let matchesPrice = price <= maxPrice;

      if (matchesCat && matchesPrice) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const countEl = document.querySelector('.shop-page__count');
    if (countEl) {
      countEl.textContent = `عرض ${visibleCount} من أصل ${productCards.length} منتج`;
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('category');
  if (catParam && categoryCheckboxes.length > 0) {
    categoryCheckboxes.forEach(cb => cb.checked = false);
    const targetCb = document.querySelector(`[data-category="${catParam}"]`);
    if (targetCb) targetCb.checked = true;
    else {
      // fallback: إذا ما لقى الـ category يعرض الكل
      const allCb = document.querySelector('[data-category="all"]');
      if (allCb) allCb.checked = true;
    }
  }

  categoryCheckboxes.forEach(cb => cb.addEventListener('change', applyShopFilters));

  priceRange?.addEventListener('input', (e) => {
    if (priceValue) priceValue.textContent = parseInt(e.target.value).toLocaleString('ar-EG') + ' ج.م';
    applyShopFilters();
  });

  sortSelect?.addEventListener('change', () => {
    const val = sortSelect.value;
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const cardsArray = Array.from(productCards);

    if (val === 'price-low') {
      cardsArray.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
    } else if (val === 'price-high') {
      cardsArray.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
    }

    cardsArray.forEach(card => grid.appendChild(card));
  });

  applyShopFilters();

  /* ---- Mobile: Shop Filter Sidebar Toggle ---- */
  const filterToggle = document.getElementById('filter-toggle');
  const sidebarBody = document.getElementById('sidebar-body');

  if (filterToggle && sidebarBody) {
    // Show button only on mobile via CSS, but handle JS toggle
    filterToggle.style.display = 'flex';

    filterToggle.addEventListener('click', () => {
      const isOpen = sidebarBody.classList.toggle('open');
      const arrow = filterToggle.querySelector('svg');
      if (arrow) {
        arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        arrow.style.transition = 'transform 0.2s ease';
      }
      filterToggle.querySelector('span').textContent = isOpen ? 'إخفاء الفلاتر' : 'تصفية المنتجات';
    });

    // On desktop, always show the sidebar body
    function checkSidebarVisibility() {
      if (window.innerWidth >= 869) {
        sidebarBody.classList.add('open');
        filterToggle.style.display = 'none';
      } else {
        filterToggle.style.display = 'flex';
        if (!sidebarBody.classList.contains('open')) {
          sidebarBody.classList.remove('open');
        }
      }
    }

    checkSidebarVisibility();
    window.addEventListener('resize', checkSidebarVisibility, { passive: true });
  }

  /* ---- Mobile: Product Card Quick-Add always visible ---- */
  function setupMobileCards() {
    if (window.innerWidth <= 868) {
      document.querySelectorAll('.product-card__quick-add').forEach(el => {
        el.style.transform = 'none';
        el.style.opacity = '1';
      });
    }
  }
  setupMobileCards();
  window.addEventListener('resize', setupMobileCards, { passive: true });
});
