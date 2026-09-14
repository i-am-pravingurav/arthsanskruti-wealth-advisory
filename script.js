'use strict';

const WHATSAPP_NUMBER = '919604529328';
const BUSINESS_ADDRESS = 'City Centre, CTS - Ground Floor, 39/2, Erandwana, Karve Road, Pune City, Maharashtra, India - 411004';

/* =========================================================
   Service category data
   ========================================================= */
const SERVICE_CATEGORIES = [
  {
    id: 'insurance',
    title: 'Insurance Services',
    desc: 'Protect what matters most with a range of trusted insurance solutions for individuals and families.',
    icon: '<svg viewBox="0 0 48 48"><path d="M24 4 L42 12 V22 C42 34 34 42 24 44 C14 42 6 34 6 22 V12 Z" fill="none" stroke="var(--color-gold)" stroke-width="2.5"/></svg>',
    items: ['General Insurance', 'Health Insurance', 'Vehicle Insurance', 'Travel Insurance', 'Term Plans & Policies', 'Mediclaim', 'Life Insurance']
  },
  {
    id: 'investment',
    title: 'Investment Services',
    desc: 'Grow your wealth with structured, goal-oriented investment options suited to your risk profile.',
    icon: '<svg viewBox="0 0 48 48"><path d="M6 40 L16 26 L24 32 L42 10" fill="none" stroke="var(--color-gold)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    items: ['Mutual Funds', 'SIP — Systematic Investment Plan', 'SWP — Systematic Withdrawal Plan', 'Smallcase', 'PMS — Portfolio Management Services', 'SIF — Specialized Investment Funds', 'Bonds']
  },
  {
    id: 'specialized',
    title: 'Specialized Insurance Solutions',
    desc: 'Tailored coverage for businesses, contractors, and groups, addressing specific operational risks.',
    icon: '<svg viewBox="0 0 48 48"><rect x="8" y="16" width="32" height="24" rx="3" fill="none" stroke="var(--color-gold)" stroke-width="2.5"/><path d="M17 16 V10 A7 7 0 0 1 31 10 V16" fill="none" stroke="var(--color-gold)" stroke-width="2.5"/></svg>',
    items: ["WC — Workers' Compensation", 'CPM — Contractors Plant & Machinery', 'FIRE Insurance', 'MARINE Insurance', 'GMC — Group Mediclaim', 'GPA — Group Personal Accident', 'GTL — Group Term Life']
  },
  {
    id: 'planning',
    title: 'Financial Planning & Taxation',
    desc: 'Simplify your taxation needs and build a personalized roadmap for long-term financial planning.',
    icon: '<svg viewBox="0 0 48 48"><rect x="10" y="6" width="28" height="36" rx="2" fill="none" stroke="var(--color-gold)" stroke-width="2.5"/><path d="M16 16 H32 M16 24 H32 M16 32 H26" stroke="var(--color-gold)" stroke-width="2.5" stroke-linecap="round"/></svg>',
    items: ['Income Tax Services', 'GST Registration & Filing', 'Policy Advisory', 'Personalized Financial Planning']
  }
];

/* =========================================================
   Render service cards
   ========================================================= */
function renderServiceCards() {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  const markup = SERVICE_CATEGORIES.map(function (category) {
    return (
      '<article class="service-card">' +
        '<div class="service-card__icon-ring"><span class="service-card__icon">' + category.icon + '</span></div>' +
        '<h3 class="service-card__title">' + category.title + '</h3>' +
        '<p class="service-card__desc">' + category.desc + '</p>' +
        '<button type="button" class="service-card__btn" data-service-id="' + category.id + '">Learn More</button>' +
      '</article>'
    );
  }).join('');

  grid.innerHTML = markup;
}

/* =========================================================
   Mobile navigation toggle
   ========================================================= */
function initNavToggle() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  function openMenu() {
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
  }

  toggle.addEventListener('click', function () {
    const isOpen = menu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.querySelectorAll('[data-nav-link]').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      toggle.focus();
    }
  });
}

/* =========================================================
   Smooth scrolling + active nav link tracking
   ========================================================= */
function initSmoothScrollAndActiveNav() {
  const navLinks = Array.from(document.querySelectorAll('[data-nav-link]'));
  const sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', targetId);
    });
  });

  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const id = '#' + entry.target.id;
      navLinks.forEach(function (link) {
        link.classList.toggle('is-active', link.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(function (section) { observer.observe(section); });
}

/* =========================================================
   Service detail modal
   ========================================================= */
function initServiceModal() {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('modal');
  const closeBtn = document.getElementById('modalClose');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const listEl = document.getElementById('modalList');
  const ctaEl = document.getElementById('modalCta');
  const grid = document.getElementById('servicesGrid');

  if (!overlay || !modal || !grid) return;

  let lastFocusedElement = null;

  function openModal(category) {
    titleEl.textContent = category.title;
    descEl.textContent = category.desc;
    listEl.innerHTML = category.items.map(function (item) {
      return '<li>' + item + '</li>';
    }).join('');

    const whatsappText = 'Hi, I am interested in ' + category.title + '. Please share more details.';
    ctaEl.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(whatsappText);

    lastFocusedElement = document.activeElement;
    overlay.hidden = false;
    closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  grid.addEventListener('click', function (event) {
    const btn = event.target.closest('[data-service-id]');
    if (!btn) return;
    const category = SERVICE_CATEGORIES.find(function (c) { return c.id === btn.dataset.serviceId; });
    if (category) openModal(category);
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !overlay.hidden) closeModal();
  });

  // Basic focus trap within the modal
  modal.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab') return;
    const focusable = modal.querySelectorAll('a, button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

/* =========================================================
   Contact form validation
   ========================================================= */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const status = document.getElementById('formStatus');
  const fields = {
    name: { input: document.getElementById('name'), error: document.getElementById('nameError') },
    phone: { input: document.getElementById('phone'), error: document.getElementById('phoneError') },
    email: { input: document.getElementById('email'), error: document.getElementById('emailError') },
    message: { input: document.getElementById('message'), error: document.getElementById('messageError') }
  };

  const PHONE_PATTERN = /^[0-9+\-\s]{10,15}$/;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    field.input.closest('.form-group').classList.toggle('has-error', Boolean(message));
    field.error.textContent = message || '';
  }

  function validateField(key) {
    const field = fields[key];
    const value = field.input.value.trim();

    if (!value) {
      setError(field, 'This field is required.');
      return false;
    }

    if (key === 'phone' && !PHONE_PATTERN.test(value)) {
      setError(field, 'Enter a valid phone number.');
      return false;
    }

    if (key === 'email' && !EMAIL_PATTERN.test(value)) {
      setError(field, 'Enter a valid email address.');
      return false;
    }

    setError(field, '');
    return true;
  }

  Object.keys(fields).forEach(function (key) {
    fields[key].input.addEventListener('blur', function () { validateField(key); });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const results = Object.keys(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (!allValid) {
      status.textContent = 'Please correct the highlighted fields.';
      status.className = 'contact-form__status is-error';
      return;
    }

    const name = fields.name.input.value.trim();
    const phone = fields.phone.input.value.trim();
    const email = fields.email.input.value.trim();
    const message = fields.message.input.value.trim();

    const whatsappText =
      'Hello, my name is ' + name + '.\n' +
      'Phone: ' + phone + '\n' +
      'Email: ' + email + '\n' +
      'Message: ' + message;

    const whatsappUrl = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(whatsappText);
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    status.textContent = 'WhatsApp is opening with your details filled in — tap Send there to deliver your message.';
    status.className = 'contact-form__status is-success';
    form.reset();
    Object.keys(fields).forEach(function (key) { setError(fields[key], ''); });
  });
}

/* =========================================================
   Header scroll shadow
   ========================================================= */
function initHeaderScrollEffect() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function updateHeader() {
    header.classList.toggle('site-header--scrolled', window.scrollY > 8);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}

/* =========================================================
   Scroll-reveal animations
   ========================================================= */
function initScrollReveal() {
  const targets = Array.from(document.querySelectorAll('[data-reveal]'));
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { observer.observe(el); });
}

/* =========================================================
   Map link — opens Apple Maps on iOS, Google Maps elsewhere
   ========================================================= */
function initMapLink() {
  const mapButton = document.getElementById('mapButton');
  if (!mapButton) return;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const encodedAddress = encodeURIComponent(BUSINESS_ADDRESS);
  const mapUrl = isIOS
    ? 'https://maps.apple.com/?q=' + encodedAddress
    : 'https://www.google.com/maps/search/?api=1&query=' + encodedAddress;

  mapButton.addEventListener('click', function () {
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
  });
}

/* =========================================================
   Footer year
   ========================================================= */
function setFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* =========================================================
   Init
   ========================================================= */
document.addEventListener('DOMContentLoaded', function () {
  renderServiceCards();
  initNavToggle();
  initSmoothScrollAndActiveNav();
  initServiceModal();
  initContactForm();
  initMapLink();
  initHeaderScrollEffect();
  initScrollReveal();
  setFooterYear();
});
