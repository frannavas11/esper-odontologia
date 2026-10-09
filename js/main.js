/**
 * Esper Odontología Mendoza — main.js
 * Funcionalidades: menú hamburguesa, header scroll, slider
 * de galería, animaciones on-scroll y copyright year.
 * Sin dependencias externas.
 */

'use strict';

/* ============================================================
   1. MENÚ HAMBURGUESA (MOBILE)
   ============================================================ */
(function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('main-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!isOpen));
    btn.classList.toggle('is-open', !isOpen);
    nav.classList.toggle('is-open', !isOpen);
  });

  // Cerrar al clickear un enlace del menú
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('is-open');
      nav.classList.remove('is-open');
      btn.focus();
    }
  });
})();

/* ============================================================
   2. HEADER — sombra al hacer scroll
   ============================================================ */
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Ejecutar al cargar por si ya está scrolleado
})();

/* ============================================================
   3. SLIDER DE GALERÍA ANTES/DESPUÉS
   ============================================================ */
(function initGallerySlider() {
  const track  = document.getElementById('gallery-track');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const dotsContainer = document.getElementById('gallery-dots');
  if (!track || !prevBtn || !nextBtn || !dotsContainer) return;

  const slides = Array.from(track.querySelectorAll('.gallery-slide'));
  const dots   = Array.from(dotsContainer.querySelectorAll('.gallery-dot'));
  let current  = 0;

  /** Muestra el slide índice i */
  function goTo(index) {
    // Ocultar slide actual
    slides[current].hidden = true;
    dots[current].classList.remove('gallery-dot--active');
    dots[current].setAttribute('aria-selected', 'false');

    // Mostrar nuevo slide
    current = (index + slides.length) % slides.length;
    slides[current].hidden = false;
    slides[current].removeAttribute('hidden');
    dots[current].classList.add('gallery-dot--active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // Soporte teclado en dots
  dotsContainer.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
  });

  // Auto-avance cada 6s (se detiene con interacción)
  let autoTimer = setInterval(() => goTo(current + 1), 6000);

  const pauseAuto = () => { clearInterval(autoTimer); };
  prevBtn.addEventListener('click', pauseAuto);
  nextBtn.addEventListener('click', pauseAuto);
  dots.forEach(d => d.addEventListener('click', pauseAuto));

  // Touch swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      pauseAuto();
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });
})();

/* ============================================================
   4. ANIMACIONES ON-SCROLL (IntersectionObserver)
   ============================================================ */
(function initScrollAnimations() {
  // Respetar prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll('.animate-fade-up, .animate-fade-left, .animate-fade-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animar solo una vez
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  // Aplicar stagger delay a grupos de cards del mismo contenedor
  document.querySelectorAll('.services-grid, .steps-grid, .testimonials-grid, .tech-grid').forEach(grid => {
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

  els.forEach(el => observer.observe(el));
})();

/* ============================================================
   5. NAVEGACIÓN ACTIVA (highlight link según sección visible)
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
            const href = link.getAttribute('href');
            link.classList.toggle('nav-link--active', href === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ============================================================
   6. AÑO DE COPYRIGHT DINÁMICO
   ============================================================ */
(function initCopyright() {
  const el = document.getElementById('copyright-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ============================================================
   7. SMOOTH SCROLL PARA NAVEGADORES QUE NO SOPORTAN CSS
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
          10
        ) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();
