/* ════════════════════════════════════════════════════════════
   Ku Náay Real Estate — shared site behaviour
   (navbar, mobile menu, card galleries, filters, scroll-in,
    lightbox, reviews slider). Loaded once and cached per visit.
   ════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════
   KU NÁAY — SHARED JAVASCRIPT
   ═══════════════════════════════════════════ */

// ─── Navbar scroll effect (rAF-throttled, passive) ───
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
  // Init on load
  updateNav();
}

// ─── Mobile hamburger menu ───
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  // Close menu when clicking a link
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── Card gallery slider ───
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
  const dots = el.querySelectorAll('.card-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === galleryIndexes[id]));
}

// ─── Filter properties ───
function filterProps(type, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.property-card').forEach(card => {
    if (type === 'all') {
      card.style.display = '';
    } else {
      card.style.display = card.dataset.type === type ? '' : 'none';
    }
  });
}

// ─── Scroll fade-in animation ───
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
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

// ─── Lightbox ───
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox(selector) {
  const imgs = document.querySelectorAll(selector);
  lightboxImages = Array.from(imgs).map(img => img.src || img.href);
  
  imgs.forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
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

// ─── Review expand on click ───
function initReviewExpand() {
  document.querySelectorAll('.review-card').forEach(card => {
    const text = card.querySelector('.review-text');
    if (!text || text.scrollHeight <= text.clientHeight + 2) return;
    const btn = document.createElement('button');
    btn.className = 'review-toggle';
    btn.textContent = 'Read more';
    text.after(btn);
    btn.addEventListener('click', () => {
      const expanded = text.classList.toggle('full');
      btn.textContent = expanded ? 'Show less' : 'Read more';
    });
  });
}

// ─── Reviews slider ───
function slideReviews(btn, dir) {
  const wrapper = btn.closest('.reviews-wrapper');
  const track = wrapper.querySelector('.reviews-track');
  const card = track.querySelector('.review-card');
  if (!card) return;
  const cardWidth = card.offsetWidth + parseInt(getComputedStyle(track).gap || 32);
  track.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
}

// ─── Init on DOM ready ───
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initReviewExpand();

  // Close lightbox on background click
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
  }

  // Keyboard nav for lightbox
  document.addEventListener('keydown', (e) => {
    if (!document.getElementById('lightbox')?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxNav(-1);
    if (e.key === 'ArrowRight') lightboxNav(1);
  });
});
