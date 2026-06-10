/* ════════════════════════════════════════════════════════════════
   KU NÁAY REAL ESTATE — SITE BEHAVIOUR (source of truth)
   ────────────────────────────────────────────────────────────────
   One shared, cached script for every page. Each feature is
   guarded by the presence of its markup, so pages only pay for
   what they use. Pages load the minified build (main.min.js,
   regenerate with `npm run build`) and pass page data through an
   inline `window.KUNAAY_PAGE` object *before* this script runs:

     window.KUNAAY_PAGE = {
       galleries:  { g0: [url, …], … },   // property-card sliders
       lightbox:   [url, …],              // full gallery (detail pages)
       bookedDays: [3, 4, …]              // availability calendar
     };

   CONTENTS
     1. Navbar scroll effect
     2. Mobile hamburger menu
     3. Home hero slider
     4. Property-card gallery sliders
     5. Property type filter (All / Rentals / Sales)
     6. Scroll fade-in animation
     7. Lightbox (detail-page photo gallery)
     8. Reviews: expand on click + slider arrows
     9. Availability calendar
    10. Contact form (validation + mailto handoff)
   ════════════════════════════════════════════════════════════════ */

'use strict';

const PAGE = window.KUNAAY_PAGE || {};

/* ─── 1. Navbar scroll effect (rAF-throttled, passive) ─────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  let navTicking = false;
  const updateNav = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    navTicking = false;
  };
  window.addEventListener('scroll', () => {
    if (!navTicking) {
      window.requestAnimationFrame(updateNav);
      navTicking = true;
    }
  }, { passive: true });
  updateNav();
}

/* ─── 2. Mobile hamburger menu ─────────────────────────────────── */
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  // Close the overlay when a navigation link is chosen
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ─── 3. Home hero slider ──────────────────────────────────────── */
/* Slides 2-n carry their image in data-bg so only the first (LCP)
   hero image loads up front; the rest are fetched just before they
   are shown, then all are warmed after window load + idle. */
(function () {
  const slides = document.querySelectorAll('#heroSlider .hero-slide');
  if (!slides.length) return;
  const dots = document.querySelectorAll('#heroSliderDots .hero-slider-dot');
  let cur = 0;
  let timer;

  function loadSlide(n) {
    const s = slides[n];
    if (s && s.dataset.bg) {
      s.style.backgroundImage = "url('" + s.dataset.bg + "')";
      s.removeAttribute('data-bg');
    }
  }
  function goTo(n) {
    slides[cur].classList.remove('active');
    dots[cur].classList.remove('active');
    cur = (n + slides.length) % slides.length;
    loadSlide(cur);
    slides[cur].classList.add('active');
    dots[cur].classList.add('active');
  }
  window.goToHeroSlide = function (n) {
    clearInterval(timer);
    goTo(n);
    timer = setInterval(() => goTo(cur + 1), 5000);
  };
  timer = setInterval(() => goTo(cur + 1), 5000);
  window.addEventListener('load', () => {
    setTimeout(() => { for (let i = 1; i < slides.length; i++) loadSlide(i); }, 1500);
  });
})();

/* ─── 4. Property-card gallery sliders ─────────────────────────── */
const galleryData = {};
const galleryIndexes = {};

function initGallery(id, images) {
  galleryData[id] = images;
  galleryIndexes[id] = 0;
}

function slideGallery(id, dir, event) {
  if (event) event.stopPropagation();
  const imgs = galleryData[id];
  if (!imgs) return;
  galleryIndexes[id] = (galleryIndexes[id] + dir + imgs.length) % imgs.length;
  const el = document.getElementById(id);
  if (!el) return;
  const img = el.querySelector('img');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = imgs[galleryIndexes[id]];
    img.style.opacity = '1';
  }, 200);
  el.querySelectorAll('.card-dot').forEach((d, i) => {
    d.classList.toggle('active', i === galleryIndexes[id]);
  });
}

// Register card galleries declared by the page
if (PAGE.galleries) {
  Object.keys(PAGE.galleries).forEach(id => initGallery(id, PAGE.galleries[id]));
}

/* ─── 5. Property type filter (All / Rentals / Sales) ──────────── */
function filterProps(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.property-card').forEach(card => {
    card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
  });
}

/* ─── 6. Scroll fade-in animation ──────────────────────────────── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ─── 7. Lightbox (detail-page photo gallery) ──────────────────── */
/* The full image list comes from KUNAAY_PAGE.lightbox; only the
   visible grid images exist in the DOM (class="lb-img"), in the
   same order as the head of the list. Images are fetched on demand
   when shown, so opening the page never downloads the whole set. */
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
  lightboxImages = PAGE.lightbox || [];
  if (!lightboxImages.length) return;
  document.querySelectorAll('.lb-img').forEach((img, i) => {
    img.addEventListener('click', e => {
      e.preventDefault();
      lightboxIndex = i;
      openLightbox();
    });
  });
}

function openLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
  updateLightboxImage();
}

// Used by the “View All Photos” tile: open at a given image index
function openGalleryLightbox(startIndex) {
  lightboxIndex = startIndex;
  openLightbox();
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxNav(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = document.getElementById('lightboxImg');
  if (img) img.src = lightboxImages[lightboxIndex];
}

/* ─── 8. Reviews: expand on click + slider arrows ──────────────── */
function initReviewExpand() {
  document.querySelectorAll('.review-card').forEach(card => {
    const text = card.querySelector('.review-text');
    if (!text) return;
    // Always insert the toggle placeholder so every card reserves the same vertical space.
    const btn = document.createElement('button');
    btn.className = 'review-toggle';
    btn.textContent = 'Read more';
    text.after(btn);
    if (text.scrollHeight <= text.clientHeight + 2) {
      // Text fits — keep space but make it invisible and non-interactive
      btn.style.visibility = 'hidden';
      btn.style.pointerEvents = 'none';
      return;
    }
    card.classList.add('expandable');
    card.addEventListener('click', () => {
      const expanded = text.classList.toggle('full');
      btn.textContent = expanded ? 'Show less' : 'Read more';
      card.classList.toggle('expanded', expanded);
      // Restore frozen height on collapse; auto on expand
      card.style.height = expanded ? 'auto' : card.dataset.baseHeight;
    });
  });

  // After the first paint, freeze each card's rendered height so that expanding
  // one card never resizes its siblings.
  const track = document.querySelector('.reviews-track');
  if (!track) return;
  requestAnimationFrame(() => {
    track.querySelectorAll('.review-card').forEach(card => {
      card.dataset.baseHeight = card.getBoundingClientRect().height + 'px';
      card.style.height = card.dataset.baseHeight;
    });
    track.style.alignItems = 'flex-start';
  });
}

function slideReviews(btn, dir) {
  const wrapper = btn.closest('.reviews-wrapper');
  const track = wrapper.querySelector('.reviews-track');
  const card = track.querySelector('.review-card');
  if (!card) return;
  const cardWidth = card.offsetWidth + parseInt(getComputedStyle(track).gap || 32);
  track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
}

/* ─── 9. Availability calendar ─────────────────────────────────── */
/* Renders the month grid into #calDays. Booked days come from
   KUNAAY_PAGE.bookedDays. renderCal is exposed globally so the
   language toggle can re-render month names after switching. */
(function () {
  if (!document.getElementById('calDays')) return;

  const bookedDays = PAGE.bookedDays || [];
  const today = new Date();
  let calYear = today.getFullYear();
  let calMonth = today.getMonth();

  const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTHS_ES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

  window.calNav = function (dir) {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    if (calMonth < 0) { calMonth = 11; calYear--; }
    window.renderCal();
  };

  window.renderCal = function () {
    const months = (window.KUNAAY_LANG === 'es') ? MONTHS_ES : MONTHS_EN;
    document.getElementById('calMonthLabel').textContent = months[calMonth] + ' ' + calYear;

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const now = new Date();
    const container = document.getElementById('calDays');
    container.innerHTML = '';

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      container.appendChild(empty);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      const isPast = (calYear < now.getFullYear())
        || (calYear === now.getFullYear() && calMonth < now.getMonth())
        || (calYear === now.getFullYear() && calMonth === now.getMonth() && d < now.getDate());
      const isToday = calYear === now.getFullYear() && calMonth === now.getMonth() && d === now.getDate();
      const isBooked = bookedDays.indexOf(d) !== -1;
      cell.textContent = d;
      if (isPast) cell.className = 'cal-day past';
      else if (isToday) cell.className = 'cal-day today';
      else if (isBooked) cell.className = 'cal-day booked';
      else cell.className = 'cal-day available';
      container.appendChild(cell);
    }
  };

  window.renderCal();
})();

/* ─── 10. Contact form (validation + mailto handoff) ───────────── */
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const es = () => (window.KUNAAY_LANG === 'es');

  function show(msg, isError) {
    status.hidden = false;
    status.textContent = msg;
    status.style.color = isError ? '#e06a5a' : 'var(--gold)';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim() || 'Website enquiry';
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !message) {
      show(es()
        ? 'Por favor complete su nombre, un correo electrónico válido y un mensaje.'
        : 'Please enter your name, a valid email address, and a message.', true);
      return;
    }

    const body = 'Name: ' + name + '\nEmail: ' + email + '\n\n' + message;
    const href = 'mailto:jessy@kunaay.com?cc=carolina@kunaay.com'
      + '&subject=' + encodeURIComponent('[' + subject + '] ' + name)
      + '&body=' + encodeURIComponent(body);

    show(es()
      ? '¡Gracias! Se abrirá su aplicación de correo para enviar el mensaje.'
      : 'Thank you! Your email app will open to send the message.', false);
    window.location.href = href;
    form.reset();
  });
})();

/* ─── Init on DOM ready ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initReviewExpand();
  initLightbox();

  // Close lightbox on background click
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('click', e => {
      if (e.target === lb) closeLightbox();
    });
  }

  // Keyboard navigation for the lightbox
  document.addEventListener('keydown', e => {
    if (!document.getElementById('lightbox')?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
});
