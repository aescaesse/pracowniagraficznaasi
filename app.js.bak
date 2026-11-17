(() => {
  'use strict';

  const STORAGE_KEY = 'pracownia_graficzna_asi_cart_v1';
  const SHIPPING_COST = 18;
  const FREE_SHIPPING_THRESHOLD = 350;
  const STRIPE_CONFIG = {
    publishableKey: 'pk_live_twoj_klucz_publiczny_stripe',
    checkoutEndpoint: '/api/create-checkout-session',
    currency: 'pln',
    paymentMethodTypes: ['blik', 'card', 'p24']
  };

  let cart = loadCart();
  let activeCategory = 'all';
  let lenisInstance = null;

  const dom = {
    preloader: document.querySelector('.preloader'),
    preloaderLine: document.querySelector('.preloader__line'),
    productsGrid: document.getElementById('products-grid'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    navFilterLinks: document.querySelectorAll('[data-filter-link]'),
    cartOpenBtn: document.getElementById('cart-open-btn'),
    cartCloseBtn: document.getElementById('cart-close-btn'),
    cartBackdrop: document.getElementById('cart-backdrop'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartCount: document.getElementById('cart-count'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    cartFooter: document.getElementById('cart-footer'),
    cartSubtotal: document.getElementById('cart-subtotal'),
    cartShipping: document.getElementById('cart-shipping'),
    cartTotal: document.getElementById('cart-total'),
    freeShippingNote: document.getElementById('free-shipping-note'),
    checkoutBtn: document.getElementById('checkout-btn'),
    qvModal: document.getElementById('quick-view-modal'),
    qvContent: document.getElementById('qv-content'),
    mobileMenuBtn: document.getElementById('mobile-menu-btn'),
    mobileNav: document.getElementById('mobile-nav'),
    quoteForm: document.getElementById('custom-quote-form'),
    quoteFeedback: document.getElementById('quote-feedback'),
    toast: document.getElementById('toast')
  };

  function formatPrice(amount) {
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2
    }).format(amount);
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      return;
    }
  }

  let toastTimer = null;
  function showToast(message) {
    if (!dom.toast) return;
    dom.toast.textContent = message;
    dom.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toast.classList.remove('is-visible');
    }, 3000);
  }

  function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          closeMobileMenu();
          lenisInstance.scrollTo(targetEl, { offset: -76 });
        }
      });
    });
  }

  function setupProductScrollDivergence() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.getAll()
      .filter((st) => st.vars && st.vars.id && st.vars.id.startsWith('prod-card-'))
      .forEach((st) => st.kill());

    const cards = gsap.utils.toArray('.product-card');
    cards.forEach((card, index) => {
      const col = index % 3;
      const enterX = col === 0 ? -95 : col === 2 ? 95 : 0;
      const enterY = col === 1 ? 85 : 35;
      const enterRot = col === 0 ? -3.5 : col === 2 ? 3.5 : 0;

      gsap.fromTo(card,
        {
          x: enterX,
          y: enterY,
          rotation: enterRot,
          opacity: 0.25
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            id: `prod-card-in-${index}`,
            trigger: card,
            start: 'top 95%',
            end: 'top 58%',
            scrub: 0.75
          }
        }
      );

      const exitX = col === 0 ? -120 : col === 2 ? 120 : 0;
      const exitY = col === 1 ? 75 : -45;
      const exitRot = col === 0 ? -4 : col === 2 ? 4 : 0;

      gsap.fromTo(card,
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1
        },
        {
          x: exitX,
          y: exitY,
          rotation: exitRot,
          opacity: 0.15,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            id: `prod-card-out-${index}`,
            trigger: card,
            start: 'bottom 35%',
            end: 'bottom -20%',
            scrub: 0.85
          }
        }
      );
    });
  }

  function setupScrollAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;

    const headerEl = document.getElementById('header');
    const logoEl = document.querySelector('.logo');
    const navEl = document.querySelector('.nav');
    const actionsEl = document.querySelector('.header__actions');

    if (headerEl && logoEl && actionsEl) {
      const headerSplitTl = gsap.timeline({ paused: true });
      headerSplitTl
        .to(logoEl, { x: -70, opacity: 0, duration: 0.45, ease: 'power3.inOut' }, 0)
        .to(actionsEl, { x: 70, opacity: 0, duration: 0.45, ease: 'power3.inOut' }, 0)
        .to(navEl, { y: -24, opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 0)
        .to(headerEl, {
          backgroundColor: 'rgba(234, 234, 234, 0)',
          borderBottomColor: 'rgba(20, 20, 20, 0)',
          backdropFilter: 'blur(0px)',
          duration: 0.4,
          ease: 'power2.out'
        }, 0.05);

      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        onUpdate: (self) => {
          if (self.direction === 1 && self.scroll() > 140) {
            headerSplitTl.play();
            headerEl.style.pointerEvents = 'none';
          } else if (self.direction === -1 || self.scroll() <= 140) {
            headerSplitTl.reverse();
            headerEl.style.pointerEvents = 'auto';
          }
        }
      });
    }

    const heroDivergeTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.75
      }
    });

    heroDivergeTl
      .to('.hero__top-meta', { y: -55, opacity: 0, ease: 'none' }, 0)
      .to('.hero__line--left', { xPercent: -26, y: -35, rotation: -1.5, opacity: 0.1, ease: 'none' }, 0)
      .to('.hero__line--right', { xPercent: 26, y: -20, rotation: 1.5, opacity: 0.1, ease: 'none' }, 0)
      .to('.bento-card--left', { xPercent: -24, y: 55, rotation: -5, opacity: 0.25, ease: 'none' }, 0.05)
      .to('.bento-card--center', { y: 110, scale: 0.93, opacity: 0.15, ease: 'none' }, 0.05)
      .to('.bento-card--right', { xPercent: 24, y: 55, rotation: 5, opacity: 0.25, ease: 'none' }, 0.05);

    gsap.utils.toArray('.split-header').forEach((header) => {
      const left = header.querySelector('.split-header__left');
      const right = header.querySelector('.split-header__right');

      if (left) {
        gsap.fromTo(left,
          { x: -90, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 92%',
              end: 'top 55%',
              scrub: 0.7
            }
          }
        );

        gsap.fromTo(left,
          { x: 0, opacity: 1 },
          {
            x: -110,
            opacity: 0.15,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: header,
              start: 'top 20%',
              end: 'top -25%',
              scrub: 0.75
            }
          }
        );
      }

      if (right) {
        gsap.fromTo(right,
          { x: 90, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 92%',
              end: 'top 55%',
              scrub: 0.7
            }
          }
        );

        gsap.fromTo(right,
          { x: 0, opacity: 1 },
          {
            x: 110,
            opacity: 0.15,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: {
              trigger: header,
              start: 'top 20%',
              end: 'top -25%',
              scrub: 0.75
            }
          }
        );
      }
    });

    gsap.utils.toArray('.craft-card').forEach((card, index) => {
      const dirX = index === 0 ? -110 : index === 1 ? -40 : index === 2 ? 40 : 110;
      const dirY = index % 2 === 0 ? 70 : -55;
      const rot = index < 2 ? -3 : 3;

      gsap.fromTo(card,
        {
          x: dirX,
          y: dirY,
          rotation: rot,
          opacity: 0.2
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.craft__bento',
            start: 'top 92%',
            end: 'top 42%',
            scrub: 0.75
          }
        }
      );

      gsap.fromTo(card,
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1
        },
        {
          x: dirX * 1.15,
          y: index % 2 === 0 ? -65 : 65,
          rotation: -rot,
          opacity: 0.15,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: '.craft__bento',
            start: 'bottom 45%',
            end: 'bottom -15%',
            scrub: 0.85
          }
        }
      );
    });

    const customInfo = document.querySelector('.custom__info');
    const customForm = document.querySelector('.custom-form');
    if (customInfo && customForm) {
      gsap.fromTo(customInfo,
        { x: -110, rotation: -2, opacity: 0.2 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.custom__wrapper',
            start: 'top 92%',
            end: 'top 45%',
            scrub: 0.75
          }
        }
      );

      gsap.fromTo(customForm,
        { x: 110, rotation: 2, opacity: 0.2 },
        {
          x: 0,
          rotation: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.custom__wrapper',
            start: 'top 92%',
            end: 'top 45%',
            scrub: 0.75
          }
        }
      );
    }

    gsap.utils.toArray('.parallax-img').forEach((img) => {
      const speed = parseFloat(img.dataset.speed || '0.08');
      gsap.to(img, {
        yPercent: speed * 100,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: img.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    setupProductScrollDivergence();
  }

  function initAnimations() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const drawFrame = document.querySelector('.draw-frame');
    const drawLoop = document.querySelector('.draw-loop');
    const drawBar = document.querySelector('.draw-bar');

    if (drawFrame && drawLoop && drawBar) {
      const frameLen = 400;
      const loopLen = 280;
      const barLen = 24;
      gsap.set(drawFrame, { strokeDasharray: frameLen, strokeDashoffset: frameLen });
      gsap.set(drawLoop, { strokeDasharray: loopLen, strokeDashoffset: loopLen });
      gsap.set(drawBar, { strokeDasharray: barLen, strokeDashoffset: barLen });
    }

    const introTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set('.hero-reveal', { clearProps: 'transform,opacity' });
        setupScrollAnimations();
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }
    });

    if (dom.preloader && dom.preloaderLine) {
      introTl
        .to('.draw-frame', { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0)
        .to('.draw-loop', { strokeDashoffset: 0, duration: 0.65, ease: 'power2.out' }, 0.25)
        .to('.draw-bar', { strokeDashoffset: 0, duration: 0.25, ease: 'power2.out' }, 0.65)
        .to(dom.preloaderLine, { scaleX: 1, duration: 0.75, ease: 'power2.inOut' }, 0.15)
        .to(dom.preloader, {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut',
          onComplete: () => {
            dom.preloader.style.display = 'none';
          }
        }, 0.95)
        .from('.hero-reveal', {
          y: 34,
          opacity: 0,
          duration: 0.85,
          stagger: 0.1
        }, '-=0.45')
        .from('.hero .image-reveal', {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.05,
          stagger: 0.15,
          ease: 'power4.out'
        }, '-=0.7');
    } else {
      setupScrollAnimations();
    }
  }

  function initMagneticButtons() {
    if (window.matchMedia('(hover: none)').matches) return;

    document.querySelectorAll('.magnetic-btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.22;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.22;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  function renderProducts(category = 'all') {
    if (!dom.productsGrid || typeof PRODUCTS_DATA === 'undefined') return;

    const filtered = category === 'all'
      ? PRODUCTS_DATA
      : PRODUCTS_DATA.filter((item) => item.category === category);

    dom.productsGrid.innerHTML = filtered.map((product) => {
      const defaultVariant = product.variants[0];
      const initialPrice = product.basePrice + defaultVariant.priceDelta;

      const optionsHtml = product.variants.map((variant, idx) => `
        <option value="${variant.id}" data-delta="${variant.priceDelta}" ${idx === 0 ? 'selected' : ''}>
          ${variant.label}
        </option>
      `).join('');

      return `
        <article class="product-card" data-product-id="${product.id}">
          <div class="product-card__media" data-open-qv="${product.id}">
            <span class="product-card__badge">${product.categoryLabel}</span>
            <img
              src="${product.imagePrimary}"
              alt="${product.title}"
              class="product-card__img product-card__img--primary"
              loading="lazy"
            >
            <img
              src="${product.imageDetail}"
              alt="Detal papieru i wykończenia — ${product.title}"
              class="product-card__img product-card__img--detail"
              loading="lazy"
            >
            <button type="button" class="product-card__qv-btn" data-open-qv="${product.id}">
              Szybki podgląd
            </button>
          </div>

          <div class="product-card__body">
            <p class="product-card__paper">${product.paperInfo}</p>
            <h3 class="product-card__title">${product.title}</h3>

            <label class="product-card__variant-label" for="select-${product.id}">Wybierz wariant</label>
            <select id="select-${product.id}" class="product-card__select" data-variant-select="${product.id}">
              ${optionsHtml}
            </select>

            <div class="product-card__footer">
              <span class="product-card__price" data-price-display="${product.id}">
                ${formatPrice(initialPrice)}
              </span>
              <button type="button" class="product-card__add-btn" data-add-to-cart="${product.id}">
                Dodaj do koszyka
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    setupProductScrollDivergence();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  }

  function setCategoryFilter(category) {
    activeCategory = category;
    dom.filterButtons.forEach((btn) => {
      const isMatch = btn.dataset.filter === category;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-selected', String(isMatch));
    });
    renderProducts(category);
  }

  function openQuickView(productId) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product || !dom.qvModal || !dom.qvContent) return;

    const defaultVariant = product.variants[0];
    const initialPrice = product.basePrice + defaultVariant.priceDelta;

    const optionsHtml = product.variants.map((v, i) => `
      <option value="${v.id}" ${i === 0 ? 'selected' : ''}>${v.label}</option>
    `).join('');

    dom.qvContent.innerHTML = `
      <div>
        <div class="qv-zoom-box" id="qv-zoom-box">
          <img src="${product.imagePrimary}" alt="${product.title}" id="qv-main-img">
          <span class="qv-zoom-hint">Najedź, aby powiększyć splot papieru</span>
        </div>
        <div class="qv-thumbs">
          <button type="button" class="qv-thumb is-active" data-qv-src="${product.imagePrimary}" aria-label="Widok główny">
            <img src="${product.imagePrimary}" alt="">
          </button>
          <button type="button" class="qv-thumb" data-qv-src="${product.imageDetail}" aria-label="Widok detalu">
            <img src="${product.imageDetail}" alt="">
          </button>
        </div>
      </div>

      <div class="qv-details">
        <p class="eyebrow">${product.categoryLabel}</p>
        <h3 id="qv-title" class="qv-title">${product.title}</h3>
        <p class="qv-price" id="qv-price">${formatPrice(initialPrice)}</p>
        <p class="qv-desc">${product.description}</p>
        <div class="qv-spec">
          <strong>Podłoże i technika:</strong> ${product.paperInfo}
        </div>

        <label class="product-card__variant-label" for="qv-variant-select">Wariant / Nakład</label>
        <select id="qv-variant-select" class="product-card__select">
          ${optionsHtml}
        </select>

        <button type="button" class="btn btn--primary btn--full" id="qv-add-btn">
          Dodaj do koszyka
        </button>
      </div>
    `;

    const zoomBox = document.getElementById('qv-zoom-box');
    const mainImg = document.getElementById('qv-main-img');
    const qvSelect = document.getElementById('qv-variant-select');
    const qvPrice = document.getElementById('qv-price');
    const qvAddBtn = document.getElementById('qv-add-btn');

    zoomBox.addEventListener('mousemove', (e) => {
      const rect = zoomBox.getBoundingClientRect();
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
      mainImg.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      mainImg.style.transform = 'scale(2)';
    });

    zoomBox.addEventListener('mouseleave', () => {
      mainImg.style.transform = 'scale(1)';
      mainImg.style.transformOrigin = 'center center';
    });

    dom.qvContent.querySelectorAll('.qv-thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        dom.qvContent.querySelectorAll('.qv-thumb').forEach((t) => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
        mainImg.src = thumb.dataset.qvSrc;
      });
    });

    qvSelect.addEventListener('change', () => {
      const selectedVariant = product.variants.find((v) => v.id === qvSelect.value);
      if (selectedVariant) {
        qvPrice.textContent = formatPrice(product.basePrice + selectedVariant.priceDelta);
      }
    });

    qvAddBtn.addEventListener('click', () => {
      addToCart(product.id, qvSelect.value);
      closeQuickView();
    });

    dom.qvModal.classList.add('is-open');
    dom.qvModal.setAttribute('aria-hidden', 'false');
    if (lenisInstance) lenisInstance.stop();
  }

  function closeQuickView() {
    if (!dom.qvModal) return;
    dom.qvModal.classList.remove('is-open');
    dom.qvModal.setAttribute('aria-hidden', 'true');
    if (lenisInstance) lenisInstance.start();
  }

  function addToCart(productId, variantId) {
    const product = PRODUCTS_DATA.find((p) => p.id === productId);
    if (!product) return;

    const variant = product.variants.find((v) => v.id === variantId) || product.variants[0];
    const unitPrice = product.basePrice + variant.priceDelta;
    const cartItemKey = `${product.id}__${variant.id}`;

    const existing = cart.find((item) => item.key === cartItemKey);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        key: cartItemKey,
        productId: product.id,
        variantId: variant.id,
        title: product.title,
        variantLabel: variant.label,
        unitPrice,
        image: product.imagePrimary,
        quantity: 1
      });
    }

    saveCart();
    renderCart();
    openCartDrawer();
    showToast(`Dodano do koszyka: ${product.title}`);
  }

  function updateCartQuantity(key, delta) {
    const item = cart.find((entry) => entry.key === key);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((entry) => entry.key !== key);
    }

    saveCart();
    renderCart();
  }

  function removeFromCart(key) {
    cart = cart.filter((entry) => entry.key !== key);
    saveCart();
    renderCart();
  }

  function renderCart() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (dom.cartCount) {
      dom.cartCount.textContent = String(totalCount);
    }

    if (!dom.cartItemsContainer || !dom.cartFooter) return;

    if (cart.length === 0) {
      dom.cartItemsContainer.innerHTML = `
        <div class="cart-empty">
          <p>Twój koszyk jest obecnie pusty.</p>
          <p style="font-size: 0.85rem; margin-top: 0.5rem;">Odkryj autorskie wydruki na papierze bawełnianym oraz papeterię ślubną z Pracowni Graficznej Asi.</p>
        </div>
      `;
      dom.cartFooter.style.display = 'none';
      return;
    }

    dom.cartFooter.style.display = 'block';

    dom.cartItemsContainer.innerHTML = cart.map((item) => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}" class="cart-item__img">
        <div class="cart-item__info">
          <h4 class="cart-item__title">${item.title}</h4>
          <p class="cart-item__variant">${item.variantLabel}</p>
          <div class="cart-item__controls">
            <div>
              <div class="qty-stepper">
                <button type="button" data-qty-minus="${item.key}" aria-label="Zmniejsz ilość">&minus;</button>
                <span>${item.quantity}</span>
                <button type="button" data-qty-plus="${item.key}" aria-label="Zwiększ ilość">&plus;</button>
              </div>
              <button type="button" class="cart-item__remove" data-remove-item="${item.key}">Usuń</button>
            </div>
            <span class="cart-item__price">${formatPrice(item.unitPrice * item.quantity)}</span>
          </div>
        </div>
      </div>
    `).join('');

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    dom.cartSubtotal.textContent = formatPrice(subtotal);
    dom.cartShipping.textContent = shipping === 0 ? 'Bezpłatnie' : formatPrice(shipping);
    dom.cartTotal.textContent = formatPrice(total);

    if (shipping === 0) {
      dom.freeShippingNote.textContent = 'Przysługuje Ci darmowa dostawa kurierska!';
    } else {
      const missing = FREE_SHIPPING_THRESHOLD - subtotal;
      dom.freeShippingNote.textContent = `Brakuje ${formatPrice(missing)} do darmowej dostawy.`;
    }
  }

  function openCartDrawer() {
    if (!dom.cartDrawer) return;
    dom.cartDrawer.classList.add('is-open');
    dom.cartDrawer.setAttribute('aria-hidden', 'false');
    if (lenisInstance) lenisInstance.stop();
  }

  function closeCartDrawer() {
    if (!dom.cartDrawer) return;
    dom.cartDrawer.classList.remove('is-open');
    dom.cartDrawer.setAttribute('aria-hidden', 'true');
    if (lenisInstance) lenisInstance.start();
  }

  async function initiateStripeCheckout() {
    if (cart.length === 0 || !dom.checkoutBtn) return;

    const originalLabel = dom.checkoutBtn.textContent;
    dom.checkoutBtn.disabled = true;
    dom.checkoutBtn.textContent = 'Łączenie ze Stripe Checkout...';

    const subtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

    const checkoutPayload = {
      currency: STRIPE_CONFIG.currency,
      payment_method_types: STRIPE_CONFIG.paymentMethodTypes,
      line_items: cart.map((item) => ({
        price_data: {
          currency: STRIPE_CONFIG.currency,
          product_data: {
            name: item.title,
            description: item.variantLabel,
            images: [item.image]
          },
          unit_amount: Math.round(item.unitPrice * 100)
        },
        quantity: item.quantity
      })),
      shipping_amount: Math.round(shippingAmount * 100),
      success_url: `${window.location.origin}/dziekujemy?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${window.location.origin}/#kolekcja`
    };

    try {
      const response = await fetch(STRIPE_CONFIG.checkoutEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload)
      });

      if (!response.ok) {
        throw new Error('Brak aktywnego backendu płatności w trybie podglądu.');
      }

      const session = await response.json();
      if (session.url) {
        window.location.href = session.url;
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 900));
      showToast('Tryb demonstracyjny: ładunek sesji Stripe (BLIK/Karta) gotowy do wysłania.');
    } finally {
      dom.checkoutBtn.disabled = false;
      dom.checkoutBtn.textContent = originalLabel;
    }
  }

  function closeMobileMenu() {
    if (!dom.mobileMenuBtn || !dom.mobileNav) return;
    dom.mobileMenuBtn.setAttribute('aria-expanded', 'false');
    dom.mobileNav.classList.remove('is-open');
    dom.mobileNav.setAttribute('aria-hidden', 'true');
  }

  function bindEvents() {
    dom.filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        setCategoryFilter(btn.dataset.filter);
      });
    });

    dom.navFilterLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const filterVal = link.dataset.filterLink;
        if (filterVal) setCategoryFilter(filterVal);
      });
    });

    if (dom.productsGrid) {
      dom.productsGrid.addEventListener('change', (e) => {
        const select = e.target.closest('[data-variant-select]');
        if (!select) return;

        const productId = select.dataset.variantSelect;
        const product = PRODUCTS_DATA.find((p) => p.id === productId);
        const variant = product?.variants.find((v) => v.id === select.value);
        const priceEl = dom.productsGrid.querySelector(`[data-price-display="${productId}"]`);

        if (product && variant && priceEl) {
          priceEl.textContent = formatPrice(product.basePrice + variant.priceDelta);
        }
      });

      dom.productsGrid.addEventListener('click', (e) => {
        const addBtn = e.target.closest('[data-add-to-cart]');
        if (addBtn) {
          const productId = addBtn.dataset.addToCart;
          const select = dom.productsGrid.querySelector(`[data-variant-select="${productId}"]`);
          addToCart(productId, select ? select.value : null);
          return;
        }

        const qvTrigger = e.target.closest('[data-open-qv]');
        if (qvTrigger) {
          openQuickView(qvTrigger.dataset.openQv);
        }
      });
    }

    if (dom.qvModal) {
      dom.qvModal.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close-modal')) {
          closeQuickView();
        }
      });
    }

    dom.cartOpenBtn?.addEventListener('click', openCartDrawer);
    dom.cartCloseBtn?.addEventListener('click', closeCartDrawer);
    dom.cartBackdrop?.addEventListener('click', closeCartDrawer);

    dom.cartItemsContainer?.addEventListener('click', (e) => {
      const minusBtn = e.target.closest('[data-qty-minus]');
      if (minusBtn) {
        updateCartQuantity(minusBtn.dataset.qtyMinus, -1);
        return;
      }

      const plusBtn = e.target.closest('[data-qty-plus]');
      if (plusBtn) {
        updateCartQuantity(plusBtn.dataset.qtyPlus, 1);
        return;
      }

      const removeBtn = e.target.closest('[data-remove-item]');
      if (removeBtn) {
        removeFromCart(removeBtn.dataset.removeItem);
      }
    });

    dom.checkoutBtn?.addEventListener('click', initiateStripeCheckout);

    dom.mobileMenuBtn?.addEventListener('click', () => {
      const expanded = dom.mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      dom.mobileMenuBtn.setAttribute('aria-expanded', String(!expanded));
      dom.mobileNav.classList.toggle('is-open', !expanded);
      dom.mobileNav.setAttribute('aria-hidden', String(expanded));
    });

    dom.quoteForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(dom.quoteForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const details = String(formData.get('details') || '').trim();

      if (!name || !email || !email.includes('@') || !details) {
        dom.quoteFeedback.classList.add('is-error');
        dom.quoteFeedback.textContent = 'Uzupełnij imię, poprawny adres e-mail oraz opis projektu.';
        return;
      }

      dom.quoteFeedback.classList.remove('is-error');
      dom.quoteFeedback.textContent = `Dziękujemy, ${name}. Asia przygotuje indywidualną wycenę i dobór papierów w ciągu 24 godzin.`;
      dom.quoteForm.reset();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeQuickView();
        closeCartDrawer();
        closeMobileMenu();
      }
    });
  }

  function init() {
    renderProducts(activeCategory);
    renderCart();
    bindEvents();
    initSmoothScroll();
    initAnimations();
    initMagneticButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();