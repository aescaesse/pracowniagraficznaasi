/**
 * Pracownia graficzna Asi — Główny Moduł Logiki (Vanilla JS ES6+)
 * Odpowiada za: Lenis Smooth Scroll, GSAP ScrollTrigger, dynamiczne filtrowanie,
 * interaktywny modal Quick View, koszyk w localStorage oraz obsługę płatności Stripe.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. STAN APLIKACJI I INICJALIZACJA
  // ==========================================================================
  let cart = JSON.parse(localStorage.getItem('pracownia_cart')) || [];
  let currentFilter = 'all';
  let activeQuickViewProduct = null;
  let selectedSizeIndex = 0;
  let selectedPaperIndex = 0;
  let currentQty = 1;

  // Stałe handlowe
  const FREE_SHIPPING_THRESHOLD = 350;
  const BASE_SHIPPING_COST = 16;

  // Inicjalizacja głównych systemów
  initPreloader();
  initLenisAndScrollTrigger();
  initNavigation();
  renderProducts();
  updateCartUI();
  initQuickViewModal();
  initCustomOrderForm();
  initStripeCheckout();

  // Aktualizacja roku w stopce
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ==========================================================================
  // 2. PRELOADER & ANIMACJE WEJŚCIA (GSAP)
  // ==========================================================================
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.getElementById('preloaderProgress');

    // Symulacja postępu ładowania arkusza papieru
    gsap.to(progressBar, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.out',
      onComplete: () => {
        setTimeout(() => {
          preloader.classList.add('is-loaded');
          // Uruchom animacje sekcji Hero po zdjęciu preloadera
          triggerHeroAnimations();
        }, 300);
      }
    });
  }

  function initLenisAndScrollTrigger() {
    // Inicjalizacja Lenis dla jedwabistego scrolla
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integracja Lenis z GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Animacje wejścia elementów przy scrollowaniu (ScrollTrigger)
    gsap.utils.toArray('.scroll-reveal').forEach((elem) => {
      gsap.fromTo(elem, 
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: elem,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Efekt delikatnej paralaksy na zdjęciach
    document.querySelectorAll('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.05;
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  function triggerHeroAnimations() {
    gsap.from('.hero-reveal', {
      opacity: 0,
      y: 35,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out'
    });
  }

  // ==========================================================================
  // 3. NAWIGACJA I MOBILNE MENU
  // ==========================================================================
  function initNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const mainNav = document.getElementById('mainNav');
    const header = document.getElementById('header');

    // Sticky header background transition
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(250, 248, 245, 0.95)';
        header.style.boxShadow = '0 4px 20px rgba(28,27,26,0.04)';
      } else {
        header.style.backgroundColor = 'rgba(250, 248, 245, 0.8)';
        header.style.boxShadow = 'none';
      }
    });

    // Mobilne menu toggle
    if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      // Zamknij menu po kliknięciu w link
      mainNav.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
          mainNav.classList.remove('is-open');
          mobileToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          
          // Obsługa szybkiego filtrowania z poziomu menu
          const filterJump = link.getAttribute('data-filter-jump');
          if (filterJump) {
            setActiveFilter(filterJump);
          }
        });
      });
    }

    // Filtry w sekcji sklepu
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filter = e.target.getAttribute('data-filter');
        setActiveFilter(filter);
      });
    });
  }

  function setActiveFilter(filterName) {
    currentFilter = filterName;
    document.querySelectorAll('.filter-btn').forEach(b => {
      const isActive = b.getAttribute('data-filter') === filterName;
      b.classList.toggle('is-active', isActive);
      b.setAttribute('aria-selected', isActive);
    });
    renderProducts();
  }

  // ==========================================================================
  // 4. RENDEROWANIE KATALOGU PRODUKTÓW
  // ==========================================================================
  function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const filtered = currentFilter === 'all' 
      ? PRODUCTS_DATA 
      : PRODUCTS_DATA.filter(p => p.category === currentFilter);

    grid.innerHTML = '';

    filtered.forEach((product, idx) => {
      const card = document.createElement('article');
      card.className = 'product-card scroll-reveal';
      card.style.animationDelay = `${idx * 0.1}s`;

      card.innerHTML = `
        <div class="product-card__image-wrap" data-product-id="${product.id}">
          ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
          <img src="${product.imageMain}" alt="${product.title}" class="product-card__image product-card__image--main" loading="lazy" />
          <img src="${product.imageDetail}" alt="${product.title} - Detal" class="product-card__image product-card__image--detail" loading="lazy" />
          <button class="product-card__quick-view" aria-label="Szybki podgląd">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
        <div class="product-card__content">
          <div>
            <span class="product-card__category">${product.categoryLabel}</span>
            <h3 class="product-card__title">${product.title}</h3>
            <p class="product-card__subtitle">${product.subtitle}</p>
          </div>
          <div class="product-card__footer">
            <span class="product-card__price">od ${product.basePrice.toFixed(2).replace('.', ',')} zł</span>
            <button class="product-card__btn" data-product-id="${product.id}">
              <span>Konfiguruj i wybierz</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      `;

      // Nasłuch kliknięcia w kartę / przycisk otwierający Quick View
      card.querySelectorAll('.product-card__image-wrap, .product-card__btn').forEach(trigger => {
        trigger.addEventListener('click', () => openQuickView(product.id));
      });

      grid.appendChild(card);
    });
  }

  // ==========================================================================
  // 5. MODAL SZYBKIEGO PODGLĄDU I KONFIGURATOR WARIANTÓW
  // ==========================================================================
  function initQuickViewModal() {
    const modal = document.getElementById('quickViewModal');
    const closeBtn = document.getElementById('closeQuickView');
    const qtyMinus = document.getElementById('qvQtyMinus');
    const qtyPlus = document.getElementById('qvQtyPlus');
    const qtyInput = document.getElementById('qvQtyInput');
    const sizeSelect = document.getElementById('qvSizeSelect');
    const paperSelect = document.getElementById('qvPaperSelect');
    const addToCartBtn = document.getElementById('qvAddToCart');

    if (!modal) return;

    // Zamknięcie modala
    closeBtn.addEventListener('click', closeQuickView);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeQuickView();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeQuickView();
    });

    // Zmiana wariantów / recalculate price
    sizeSelect.addEventListener('change', (e) => {
      selectedSizeIndex = parseInt(e.target.value, 10);
      updateQuickViewPrice();
    });

    paperSelect.addEventListener('change', (e) => {
      selectedPaperIndex = parseInt(e.target.value, 10);
      updateQuickViewPrice();
    });

    // Sterowanie ilością z uwzględnieniem minQty
    qtyMinus.addEventListener('click', () => {
      if (!activeQuickViewProduct) return;
      const step = activeQuickViewProduct.stepQty || 1;
      const min = activeQuickViewProduct.minQty || 1;
      if (currentQty - step >= min) {
        currentQty -= step;
        qtyInput.value = currentQty;
        updateQuickViewPrice();
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (!activeQuickViewProduct) return;
      const step = activeQuickViewProduct.stepQty || 1;
      currentQty += step;
      qtyInput.value = currentQty;
      updateQuickViewPrice();
    });

    // Dodanie skonfigurowanego produktu do koszyka
    addToCartBtn.addEventListener('click', () => {
      if (!activeQuickViewProduct) return;

      const selectedSize = activeQuickViewProduct.variants.size[selectedSizeIndex];
      const selectedPaper = activeQuickViewProduct.variants.paper[selectedPaperIndex];
      const unitPrice = activeQuickViewProduct.basePrice + selectedSize.priceMod + selectedPaper.priceMod;

      const cartItem = {
        cartId: `${activeQuickViewProduct.id}-${selectedSizeIndex}-${selectedPaperIndex}`,
        id: activeQuickViewProduct.id,
        title: activeQuickViewProduct.title,
        subtitle: `${selectedSize.label} / ${selectedPaper.label}`,
        price: unitPrice,
        quantity: currentQty,
        image: activeQuickViewProduct.imageMain
      };

      addToCart(cartItem);
      closeQuickView();
      openCartDrawer();
    });
  }

  function openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    activeQuickViewProduct = product;
    selectedSizeIndex = 0;
    selectedPaperIndex = 0;
    currentQty = product.minQty || 1;

    // Wypełnij dane modala
    document.getElementById('qvCategory').textContent = product.categoryLabel;
    document.getElementById('qvTitle').textContent = product.title;
    document.getElementById('qvSubtitle').textContent = product.subtitle;
    document.getElementById('qvDescription').textContent = product.description;
    document.getElementById('qvQtyInput').value = currentQty;

    const mainImg = document.getElementById('qvMainImg');
    mainImg.src = product.imageMain;
    mainImg.alt = product.title;

    // Miniaturki
    const thumbMain = document.getElementById('qvThumbMain');
    const thumbDetail = document.getElementById('qvThumbDetail');
    thumbMain.querySelector('img').src = product.imageMain;
    thumbDetail.querySelector('img').src = product.imageDetail;

    thumbMain.onclick = () => {
      mainImg.src = product.imageMain;
      thumbMain.classList.add('is-active');
      thumbDetail.classList.remove('is-active');
    };
    thumbDetail.onclick = () => {
      mainImg.src = product.imageDetail;
      thumbDetail.classList.add('is-active');
      thumbMain.classList.remove('is-active');
    };
    thumbMain.classList.add('is-active');
    thumbDetail.classList.remove('is-active');

    // Specyfikacje
    const specsList = document.getElementById('qvSpecs');
    specsList.innerHTML = product.specs.map(spec => `<li>${spec}</li>`).join('');

    // Select formatów
    const sizeSelect = document.getElementById('qvSizeSelect');
    sizeSelect.innerHTML = product.variants.size.map((s, i) => `
      <option value="${i}">${s.label} ${s.priceMod > 0 ? `(+${s.priceMod.toFixed(2)} zł)` : ''}</option>
    `).join('');

    // Select papierów
    const paperSelect = document.getElementById('qvPaperSelect');
    paperSelect.innerHTML = product.variants.paper.map((p, i) => `
      <option value="${i}">${p.label} ${p.priceMod > 0 ? `(+${p.priceMod.toFixed(2)} zł)` : ''}</option>
    `).join('');

    // Informacja o minimalnym nakładzie
    const minNote = document.getElementById('qvMinNote');
    if (product.minQty > 1) {
      minNote.textContent = `Minimalne zamówienie dla tego produktu to ${product.minQty} szt. (krok: ${product.stepQty})`;
      minNote.style.display = 'block';
    } else {
      minNote.style.display = 'none';
    }

    updateQuickViewPrice();

    const modal = document.getElementById('quickViewModal');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeQuickViewProduct = null;
  }

  function updateQuickViewPrice() {
    if (!activeQuickViewProduct) return;
    const sizeMod = activeQuickViewProduct.variants.size[selectedSizeIndex].priceMod;
    const paperMod = activeQuickViewProduct.variants.paper[selectedPaperIndex].priceMod;
    const unitPrice = activeQuickViewProduct.basePrice + sizeMod + paperMod;
    const totalPrice = unitPrice * currentQty;

    document.getElementById('qvPrice').textContent = `${totalPrice.toFixed(2).replace('.', ',')} zł`;
  }

  // ==========================================================================
  // 6. ZARZĄDZANIE KOSZYKIEM (LOCALSTORAGE) I SZUFLADĄ
  // ==========================================================================
  function initCart() {
    const cartTrigger = document.getElementById('cartTrigger');
    const closeCartDrawerBtn = document.getElementById('closeCartDrawer');
    const cartBackdrop = document.getElementById('cartBackdrop');

    if (cartTrigger) {
      cartTrigger.addEventListener('click', openCartDrawer);
    }
    if (closeCartDrawerBtn) {
      closeCartDrawerBtn.addEventListener('click', closeCartDrawer);
    }
    if (cartBackdrop) {
      cartBackdrop.addEventListener('click', closeCartDrawer);
    }
  }
  initCart();

  function openCartDrawer() {
    document.getElementById('cartDrawer').classList.add('is-open');
    document.getElementById('cartBackdrop').classList.add('is-open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    document.getElementById('cartDrawer').classList.remove('is-open');
    document.getElementById('cartBackdrop').classList.remove('is-open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function addToCart(newItem) {
    const existingIndex = cart.findIndex(item => item.cartId === newItem.cartId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += newItem.quantity;
    } else {
      cart.push(newItem);
    }

    saveCart();
    updateCartUI();
    showToast(`Dodano do koszyka: ${newItem.title}`);
  }

  function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    saveCart();
    updateCartUI();
  }

  function updateItemQuantity(cartId, delta) {
    const item = cart.find(i => i.cartId === cartId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(cartId);
    } else {
      saveCart();
      updateCartUI();
    }
  }

  function saveCart() {
    localStorage.setItem('pracownia_cart', JSON.stringify(cart));
  }

  function updateCartUI() {
    const badge = document.getElementById('cartBadge');
    const container = document.getElementById('cartItemsContainer');
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    const shippingText = document.getElementById('shippingText');
    const shippingFill = document.getElementById('shippingFill');

    // Liczba produktów w badge
    const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    badge.textContent = totalItemsCount;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <p>Twój koszyk jest aktualnie pusty.</p>
          <a href="#kolekcja" class="btn btn--primary" onclick="document.getElementById('closeCartDrawer').click()">Wybierz wydruki i papeterię</a>
        </div>
      `;
      subtotalEl.textContent = '0,00 zł';
      shippingEl.textContent = '0,00 zł';
      totalEl.textContent = '0,00 zł';
      shippingText.innerHTML = `Do darmowej dostawy brakuje <strong>${FREE_SHIPPING_THRESHOLD.toFixed(2).replace('.', ',')} zł</strong>`;
      shippingFill.style.width = '0%';
      return;
    }

    // Renderowanie elementów koszyka
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item__img" />
        <div class="cart-item__info">
          <h5>${item.title}</h5>
          <p class="cart-item__meta">${item.subtitle}</p>
          <span class="cart-item__price">${(item.price * item.quantity).toFixed(2).replace('.', ',')} zł</span>
          <div class="cart-item__controls">
            <button class="cart-item__qty-btn" onclick="window.updateCartQty('${item.cartId}', -1)" aria-label="Zmniejsz ilość">&minus;</button>
            <span>${item.quantity} szt.</span>
            <button class="cart-item__qty-btn" onclick="window.updateCartQty('${item.cartId}', 1)" aria-label="Zwiększ ilość">+</button>
          </div>
        </div>
        <button class="cart-item__remove" onclick="window.removeCartItem('${item.cartId}')" aria-label="Usuń pozycję">&times;</button>
      </div>
    `).join('');

    // Obliczenia finansowe
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : BASE_SHIPPING_COST;
    const total = subtotal + shipping;

    subtotalEl.textContent = `${subtotal.toFixed(2).replace('.', ',')} zł`;
    shippingEl.textContent = shipping === 0 ? '0,00 zł (Darmowa dostawa)' : `${shipping.toFixed(2).replace('.', ',')} zł`;
    totalEl.textContent = `${total.toFixed(2).replace('.', ',')} zł`;

    // Pasek postępu darmowej dostawy
    const diff = FREE_SHIPPING_THRESHOLD - subtotal;
    const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    shippingFill.style.width = `${progressPercent}%`;

    if (diff > 0) {
      shippingText.innerHTML = `Do darmowej dostawy brakuje <strong>${diff.toFixed(2).replace('.', ',')} zł</strong>`;
    } else {
      shippingText.innerHTML = `🎉 Korzystasz z <strong>darmowej dostawy kurierem!</strong>`;
    }
  }

  // Globalne handlery dla inline onclick w elementach koszyka
  window.updateCartQty = (cartId, delta) => updateItemQuantity(cartId, delta);
  window.removeCartItem = (cartId) => removeFromCart(cartId);

  // ==========================================================================
  // 7. INTEGRACJA PŁATNOŚCI STRIPE CHECKOUT
  // ==========================================================================
  function initStripeCheckout() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Twój koszyk jest pusty.');
        return;
      }

      // ----------------------------------------------------------------------
      // INSTRUKCJA INTEGRACJI ZE STRIPE CHECKOUT:
      // ----------------------------------------------------------------------
      // 1. W środowisku produkcyjnym koszyk należy przesłać do backendu (Node.js/PHP),
      //    gdzie tworzona jest sesja Stripe Checkout za pomocą Stripe API:
      //    const session = await stripe.checkout.sessions.create({
      //      payment_method_types: ['card', 'blik', 'p24'],
      //      line_items: cart.map(item => ({
      //        price_data: {
      //          currency: 'pln',
      //          product_data: { name: item.title, description: item.subtitle },
      //          unit_amount: Math.round(item.price * 100),
      //        },
      //        quantity: item.quantity,
      //      })),
      //      mode: 'payment',
      //      success_url: 'https://twojadomena.pl/sukces?session_id={CHECKOUT_SESSION_ID}',
      //      cancel_url: 'https://twojadomena.pl/koszyk',
      //    });
      // 2. Następnie następuje przekierowanie klienta:
      //    window.location.href = session.url;
      // ----------------------------------------------------------------------

      checkoutBtn.textContent = 'Przygotowywanie bezpiecznej sesji Stripe...';
      checkoutBtn.disabled = true;

      setTimeout(() => {
        alert(`[Demo Stripe Checkout]\n\nPrzekierowujemy do bramki płatności (BLIK, Karta, Przelewy24).\nSuma zamówienia: ${document.getElementById('cartTotal').textContent}\n\nAby włączyć prawdziwe płatności, podłącz klucz API Stripe w pliku app.js.`);
        checkoutBtn.textContent = 'Przejdź do płatności (BLIK / Karta)';
        checkoutBtn.disabled = false;
      }, 1200);
    });
  }

  // ==========================================================================
  // 8. FORMULARZ ZAMÓWIENIA INDYWIDUALNEGO
  // ==========================================================================
  function initCustomOrderForm() {
    const form = document.getElementById('customOrderForm');
    const feedback = document.getElementById('customFormFeedback');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const details = document.getElementById('projectDetails').value.trim();

      if (!name || !email || !details) {
        feedback.style.color = '#E06D53';
        feedback.textContent = 'Proszę wypełnić wszystkie wymagane pola oznaczone gwiazdką.';
        return;
      }

      // Symulacja wysyłki zapytania o wycenę
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Wysyłanie zapytania...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        feedback.style.color = '#A3D9A5';
        feedback.textContent = 'Dziękujemy! Zapytanie dotarło do pracowni. Odpiszemy w ciągu 24 godzin.';
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1000);
    });
  }

  // ==========================================================================
  // 9. POMOCNICZY SYSTEM POWIADOMIEN (TOAST)
  // ==========================================================================
  function showToast(message) {
    let toast = document.getElementById('toastNotification');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 3200);
  }
});