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
  let heroSplitInstance = null;
  let sectionSplitInstances = [];

  const dom = {
    preloader: document.querySelector('.preloader'),
    preloaderLine: document.querySelector('.preloader__line'),
    header: document.getElementById('header'),
    scrollProgress: document.getElementById('scroll-progress'),
    velocityStage: document.querySelector('.velocity-stage'),
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
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    const isDesktop = () => window.innerWidth >= 1024;
    let currentSkew = 0;

    lenisInstance.on('scroll', (e) => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.update();
      }

      if (dom.scrollProgress) {
        dom.scrollProgress.style.transform = `scaleX(${e.progress || 0})`;
      }

      if (dom.header) {
        if (e.scroll > 40) {
          dom.header.classList.add('is-scrolled');
        } else {
          dom.header.classList.remove('is-scrolled');
        }

        if (e.direction === 1 && e.scroll > 260 && !dom.mobileNav?.classList.contains('is-open')) {
          dom.header.classList.add('is-hidden');
        } else if (e.direction === -1 || e.scroll <= 260) {
          dom.header.classList.remove('is-hidden');
        }
      }

      if (dom.velocityStage && isDesktop()) {
        const targetSkew = Math.max(-1.6, Math.min(1.6, (e.velocity || 0) * 0.045));
        currentSkew += (targetSkew - currentSkew) * 0.14;
        dom.velocityStage.style.transform = Math.abs(currentSkew) > 0.01 ? `skewY(${currentSkew.toFixed(3)}deg)` : '';
      }
    });

    if (typeof gsap !== 'undefined') {
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
          lenisInstance.scrollTo(targetEl, { offset: -78 });
        }
      });
    });
  }

  function buildTextSplits() {
    if (typeof SplitType === 'undefined') return;

    if (heroSplitInstance) {
      heroSplitInstance.revert();
    }
    sectionSplitInstances.forEach((inst) => inst.revert());
    sectionSplitInstances = [];

    const heroTitle = document.getElementById('hero-dissolve-title');
    if (heroTitle) {
      heroSplitInstance = new SplitType(heroTitle, { types: 'lines,words,chars' });
    }

    document.querySelectorAll('.dissolve-heading').forEach((heading) => {
      const inst = new SplitType(heading, { types: 'words,chars' });
      sectionSplitInstances.push(inst);
    });
  }

  function setupDissolveTypography() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.getAll()
      .filter((st) => st.vars && st.vars.id && st.vars.id.startsWith('dissolve-'))
      .forEach((st) => st.kill());

    const heroTitle = document.getElementById('hero-dissolve-title');
    const displacementEl = document.getElementById('displacement-hero');
    const turbulenceEl = document.getElementById('turbulence-hero');

    if (heroTitle && heroSplitInstance && heroSplitInstance.chars) {
      const isMobile = window.innerWidth < 768;
      const spreadX = isMobile ? 65 : 160;
      const spreadY = isMobile ? -90 : -180;

      const heroDissolveTl = gsap.timeline({
        scrollTrigger: {
          id: 'dissolve-hero',
          trigger: '.hero',
          start: 'top top',
          end: 'bottom 15%',
          scrub: 0.75
        }
      });

      heroDissolveTl.to(heroSplitInstance.chars, {
        x: () => gsap.utils.random(-spreadX, spreadX),
        y: () => gsap.utils.random(spreadY, -20),
        rotation: () => gsap.utils.random(-42, 42),
        scale: () => gsap.utils.random(0.55, 1.45),
        filter: 'blur(9px)',
        opacity: 0,
        stagger: {
          amount: 0.42,
          from: 'random'
        },
        ease: 'power1.in'
      }, 0);

      if (displacementEl && turbulenceEl && !isMobile) {
        const turbState = { scale: 0, freqX: 0.012, freqY: 0.045 };
        heroDissolveTl.to(turbState, {
          scale: 52,
          freqX: 0.032,
          freqY: 0.095,
          ease: 'power2.in',
          onUpdate: () => {
            displacementEl.setAttribute('scale', turbState.scale.toFixed(1));
            turbulenceEl.setAttribute('baseFrequency', `${turbState.freqX.toFixed(4)} ${turbState.freqY.toFixed(4)}`);
          }
        }, 0);
      }
    }

    sectionSplitInstances.forEach((inst, idx) => {
      if (!inst.chars || !inst.chars.length) return;
      const parentHeading = inst.elements[0];

      gsap.fromTo(inst.chars,
        {
          y: 44,
          x: () => gsap.utils.random(-28, 28),
          rotation: () => gsap.utils.random(-16, 16),
          filter: 'blur(7px)',
          opacity: 0
        },
        {
          y: 0,
          x: 0,
          rotation: 0,
          filter: 'blur(0px)',
          opacity: 1,
          stagger: { amount: 0.35, from: 'start' },
          ease: 'power3.out',
          scrollTrigger: {
            id: `dissolve-sec-in-${idx}`,
            trigger: parentHeading,
            start: 'top 92%',
            end: 'top 56%',
            scrub: 0.65
          }
        }
      );

      gsap.fromTo(inst.chars,
        {
          y: 0,
          x: 0,
          rotation: 0,
          filter: 'blur(0px)',
          opacity: 1
        },
        {
          y: () => gsap.utils.random(-55, -18),
          x: () => gsap.utils.random(-45, 45),
          rotation: () => gsap.utils.random(-22, 22),
          filter: 'blur(6px)',
          opacity: 0,
          stagger: { amount: 0.3, from: 'random' },
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            id: `dissolve-sec-out-${idx}`,
            trigger: parentHeading,
            start: 'top 16%',
            end: 'top -22%',
            scrub: 0.75
          }
        }
      );
    });
  }

  function setupProductScrollDivergence() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    ScrollTrigger.getAll()
      .filter((st) => st.vars && st.vars.id && st.vars.id.startsWith('prod-card-'))
      .forEach((st) => st.kill());

    const cards = gsap.utils.toArray('.product-card');
    const isDesktop = window.innerWidth >= 1080;
    const isTablet = window.innerWidth >= 640 && window.innerWidth < 1080;

    cards.forEach((card, index) => {
      let enterX = 0;
      let enterY = 45;
      let enterRot = 0;

      if (isDesktop) {
        const col = index % 3;
        enterX = col === 0 ? -95 : col === 2 ? 95 : 0;
        enterY = col === 1 ? 85 : 35;
        enterRot = col === 0 ? -3.5 : col === 2 ? 3.5 : 0;
      } else if (isTablet) {
        const col = index % 2;
        enterX = col === 0 ? -65 : 65;
        enterRot = col === 0 ? -2.5 : 2.5;
      } else {
        enterX = index % 2 === 0 ? -36 : 36;
      }

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

      gsap.fromTo(card,
        {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1
        },
        {
          x: enterX * 1.2,
          y: isDesktop && index % 3 === 1 ? 70 : -40,
          rotation: enterRot * 1.15,
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

    const isDesktop = window.innerWidth >= 960;

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
      .to('.bento-card--left', {
        xPercent: isDesktop ? -24 : -10,
        y: 55,
        rotation: isDesktop ? -5 : -2,
        opacity: 0.2,
        ease: 'none'
      }, 0.05)
      .to('.bento-card--center', {
        y: 110,
        scale: 0.92,
        opacity: 0.15,
        ease: 'none'
      }, 0.05)
      .to('.bento-card--right', {
        xPercent: isDesktop ? 24 : 10,
        y: 55,
        rotation: isDesktop ? 5 : 2,
        opacity: 0.2,
        ease: 'none'
      }, 0.05);

    gsap.utils.toArray('.split-header').forEach((header) => {
      const right = header.querySelector('.split-header__right');
      if (!right) return;

      gsap.fromTo(right,
        { x: isDesktop ? 85 : 35, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 92%',
            end: 'top 56%',
            scrub: 0.7
          }
        }
      );

      gsap.fromTo(right,
        { x: 0, opacity: 1 },
        {
          x: isDesktop ? 105 : 40,
          opacity: 0.15,
          ease: 'none',
          immediateRender: false,
          scrollTrigger: {
            trigger: header,
            start: 'top 18%',
            end: 'top -24%',
            scrub: 0.75
          }
        }
      );
    });

    gsap.utils.toArray('.craft-card').forEach((card, index) => {
      const dirX = isDesktop
        ? (index === 0 ? -110 : index === 1 ? -40 : index === 2 ? 40 : 110)
        : (index % 2 === 0 ? -45 : 45);
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
        { x: isDesktop ? -110 : -35, rotation: isDesktop ? -2 : 0, opacity: 0.2 },
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
        { x: isDesktop ? 110 : 35, rotation: isDesktop ? 2 : 0, opacity: 0.2 },
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
      const speed = parseFloat(img.dataset.speed || '0.09');
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

    setupDissolveTypography();
    setupProductScrollDivergence();
  }

  function initAnimations() {
    if (typeof gsap === 'undefined') return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    buildTextSplits();

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

    const heroChars = heroSplitInstance?.chars || [];

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
        .from(heroChars, {
          y: 45,
          opacity: 0,
          filter: 'blur(8px)',
          rotation: () => gsap.utils.random(-14, 14),
          duration: 0.85,
          stagger: 0.022,
          ease: 'power3.out'
        }, '-=0.45')
        .from('.hero-reveal', {
          y: 28,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1
        }, '-=0.65')
        .from('.hero .image-reveal', {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.05,
          stagger: 0.15,
          ease: 'power4.out'
        }, '-=0.7');
    } else {
      setupScrollAnimations();
    }

    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildTextSplits();
        setupScrollAnimations();
        if (typeof ScrollTrigger !== 'undefined') {
          ScrollTrigger.refresh();
        }
      }, 280);
    });
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
        closeMobileMenu();
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
      if (lenisInstance) {
        if (!expanded) lenisInstance.stop();
        else lenisInstance.start();
      }
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