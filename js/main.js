/**
 * Esper Odontología Mendoza — main.js
 * Funcionalidades: menú hamburguesa, header scroll, slider
 * de galería, animaciones on-scroll y copyright year.
 * Sin dependencias externas.
 */

'use strict';

/* ============================================================
   1. MENÚ HAMBURGUESA Y OVERLAY (MOBILE)
   ============================================================ */
(function initHamburger() {
  const btn = document.getElementById('hamburger-btn');
  const nav = document.getElementById('main-nav');
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
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar al tocar el backdrop / overlay exterior
  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
    backdrop.addEventListener('touchstart', closeMenu, { passive: true });
  }

  // Cerrar al clickear cualquier enlace o botón del menú
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Cerrar al hacer clic en cualquier parte fuera del menú y del botón
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('is-open')) {
      if (!nav.contains(e.target) && !btn.contains(e.target)) {
        closeMenu();
      }
    }
  });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      closeMenu();
      btn.focus();
    }
  });

  // Cerrar automáticamente si la pantalla pasa a desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && nav.classList.contains('is-open')) {
      closeMenu();
    }
  }, { passive: true });
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
  document.querySelectorAll('.services-grid, .steps-grid, .tech-grid').forEach(grid => {
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
      } catch (_) {
        // Ignorar selectores no válidos
      }
    });
  });
})();

/* ============================================================
   8. PREGUNTAS FRECUENTES — COMPORTAMIENTO ACORDEÓN (UNA SOLA ABIERTA)
   ============================================================ */
(function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.open) {
            otherItem.open = false;
          }
        });
      }
    });
  });
})();
