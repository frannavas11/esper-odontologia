/**
 * Esper Odontología Mendoza — main.js
 * Funcionalidades: menú hamburguesa, header scroll, animaciones,
 * AOS init, Lucide icons, galería y copyright.
 * Sin dependencias externas (AOS y Lucide vía CDN en HTML).
 */

'use strict';

/* ============================================================
   1. MENÚ HAMBURGUESA Y OVERLAY (MOBILE)
   ============================================================ */
(function initHamburger() {
  const btn      = document.getElementById('hamburger-btn');
  const nav      = document.getElementById('main-nav');
  const backdrop = document.getElementById('nav-backdrop');
  if (!btn || !nav) return;

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-open');
    nav.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('is-open');
    nav.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    btn.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
    backdrop.addEventListener('touchstart', closeMenu, { passive: true });
  }

  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open') && !nav.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      btn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && nav.classList.contains('is-open')) closeMenu();
  }, { passive: true });
})();

/* ============================================================
   2. HEADER — sombra al hacer scroll
   ============================================================ */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   3. LUCIDE ICONS — inicialización
   ============================================================ */
(function initLucide() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
})();

/* ============================================================
   4. AOS — Animate On Scroll
   ============================================================ */
(function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      delay: 0,
    });
  }
})();

/* ============================================================
   5. ANIMACIONES ON-SCROLL (IntersectionObserver – fallback)
   Para elementos con clases .animate-fade-up / left / right
   que no usan data-aos
   ============================================================ */
(function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  // Stagger delay en grids
  document.querySelectorAll('.services-grid, .steps-grid, .tech-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  els.forEach(el => observer.observe(el));
})();

/* ============================================================
   6. NAVEGACIÓN ACTIVA (highlight link según sección visible)
   ============================================================ */
(function initActiveNav() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('nav-link--active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   7. AÑO DE COPYRIGHT DINÁMICO
   ============================================================ */
(function initCopyright() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   8. SMOOTH SCROLL
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerH = parseInt(
            getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
            10
          ) || 72;
          const top = target.getBoundingClientRect().top + window.scrollY - headerH;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } catch (_) { /* selector inválido */ }
    });
  });
})();

/* ============================================================
   9. FAQ ACORDEÓN (una sola abierta a la vez)
   ============================================================ */
(function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item && other.open) other.open = false;
        });
      }
    });
  });
})();

/* ============================================================
   10. IMG-COMPARISON-SLIDER — ajuste de accesibilidad
   El componente ya funciona por sí solo vía CDN.
   Aquí sólo añadimos un atributo de accesibilidad si falta.
   ============================================================ */
(function initComparisonSliders() {
  document.querySelectorAll('img-comparison-slider').forEach(slider => {
    if (!slider.hasAttribute('tabindex')) {
      slider.setAttribute('tabindex', '0');
    }
    if (!slider.hasAttribute('aria-label')) {
      slider.setAttribute('aria-label', 'Comparación antes y después. Usá las flechas del teclado para ajustar.');
    }
    // Keyboard support
    slider.addEventListener('keydown', e => {
      const val = parseFloat(slider.value) || 50;
      if (e.key === 'ArrowLeft')  slider.value = Math.max(0,   val - 5);
      if (e.key === 'ArrowRight') slider.value = Math.min(100, val + 5);
    });
  });
})();
