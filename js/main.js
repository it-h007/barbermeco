'use strict';

/* ── VIDEO URL CONFIG ─────────────────────────────────
   Replace with YouTube embed or MP4 path:
   'https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1'
   ──────────────────────────────────────────────────── */
const videoUrl = 'videos/videoplayback.mp4';

/* ── WHATSAPP ─────────────────────────────────────── */
const WA_NUMBER = '355692080017';

/* ── LANGUAGE ─────────────────────────────────────── */
let currentLang = 'en';

const MESSAGES = {
  en: {
    quickBook: (service) =>
`Hello Barber Meço 3!

I would like to book an appointment:
Service: ${service}

Please confirm availability. Thank you!`,

    fullBooking: (d) =>
`Hello Barber Meço 3!

--- APPOINTMENT REQUEST ---
Name:     ${d.name}
Phone:    ${d.phone}
Service:  ${d.service}
Date:     ${d.date}
Time:     ${d.time}${d.message ? '\nNote:     ' + d.message : ''}
--------------------------
Please confirm. Thank you!`,

    experience: `Hello Barber Meço 3!\n\nI would like to book a Premium Grooming Experience.\nPlease let me know your availability. Thank you!`,
    heroBook:   `Hello Barber Meço 3!\n\nI would like to book an appointment. Please let me know your availability. Thank you!`,
  },
  al: {
    quickBook: (service) =>
`Pershendetje Barber Meco 3!

Dua te rezervoj nje takim:
Sherbimi: ${service}

Ju lutem konfirmoni disponibilitetin. Faleminderit!`,

    fullBooking: (d) =>
`Pershendetje Barber Meco 3!

--- KERKESE PER TAKIM ---
Emri:      ${d.name}
Telefon:   ${d.phone}
Sherbimi:  ${d.service}
Data:      ${d.date}
Ora:       ${d.time}${d.message ? '\nShenime:   ' + d.message : ''}
-------------------------
Ju lutem konfirmoni. Faleminderit!`,

    experience: `Pershendetje Barber Meco 3!\n\nDua te rezervoj nje Eksperience Premium Grooming.\nJu lutem me tregoni disponibilitetin tuaj. Faleminderit!`,
    heroBook:   `Pershendetje Barber Meco 3!\n\nDua te rezervoj nje takim. Ju lutem me tregoni disponibilitetin tuaj. Faleminderit!`,
  }
};

function openWA(msg) {
  window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
}

/* ======================================================
   LANGUAGE SYSTEM
   ====================================================== */
function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);

  document.querySelectorAll('[data-en]').forEach(el => {
    const txt = el.getAttribute(`data-${lang}`);
    if (txt !== null && el.children.length === 0) el.textContent = txt;
  });

  // Update intro tagline
  const tagEl = document.querySelector('#intro-tagline span');
  if (tagEl) {
    tagEl.textContent = lang === 'al' ? 'Berberi Më i Mirë në Tiranë' : 'The Best Barber In Tirana';
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.l === lang);
  });

  updateOpenStatus();
}

function initLanguage() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.l));
  });
}

/* ======================================================
   DYNAMIC INTRO ANIMATION
   Phase 1: Logo fades in + scales up (0.5s delay)
   Phase 2: Tagline slides up (logo shown at 1.4s)
   Phase 3: Tagline collapses into logo (at 2.8s)
   Phase 4: Logo + tagline shrink & fly to header (at 3.6s)
   Phase 5: Intro fades out, page revealed (at 4.2s)
   ====================================================== */
function initIntro() {
  const screen  = document.getElementById('intro-screen');
  const logo    = document.getElementById('intro-logo');
  const tagline = document.getElementById('intro-tagline');
  if (!screen || !logo) return;

  document.body.style.overflow = 'hidden';

  // Phase 2: show tagline after logo appears
  setTimeout(() => {
    tagline && tagline.classList.add('visible');
  }, 1500);

  // Phase 3: tagline collapses into logo
  setTimeout(() => {
    tagline && tagline.classList.add('collapse');
  }, 3000);

  // Phase 4: logo flies up to header position
  setTimeout(() => {
    screen.classList.add('fly-out');
    logo.classList.add('fly-to-header');
  }, 3700);

  // Phase 5: remove intro, show page
  setTimeout(() => {
    screen.classList.add('done');
    document.body.style.overflow = '';
  }, 4500);
}

/* ======================================================
   OPEN / CLOSED STATUS
   Mon-Sat: 09:00-20:00 | Sun: 10:00-17:00
   ====================================================== */
function updateOpenStatus() {
  const statusEl = document.getElementById('openStatus');
  const dotEl    = document.getElementById('openDot');
  const textEl   = document.getElementById('openText');
  if (!statusEl) return;

  const now  = new Date();
  const day  = now.getDay(); // 0=Sun, 6=Sat
  const hour = now.getHours();
  const min  = now.getMinutes();
  const time = hour * 60 + min;

  let isOpen = false;
  if (day === 0) {
    isOpen = time >= 600 && time < 1020; // 10:00-17:00
  } else {
    isOpen = time >= 540 && time < 1200; // 09:00-20:00
  }

  const openEn  = 'Open Now';
  const openAl  = 'Hapur Tani';
  const closeEn = 'Closed Now';
  const closeAl = 'Mbyllur Tani';

  if (isOpen) {
    statusEl.style.color = '#4ade80';
    if (dotEl) { dotEl.style.background = '#4ade80'; dotEl.style.display = 'inline-block'; }
    if (textEl) textEl.textContent = currentLang === 'al' ? openAl : openEn;
  } else {
    statusEl.style.color = '#ef4444';
    if (dotEl) { dotEl.style.background = '#ef4444'; dotEl.style.animation = 'none'; }
    if (textEl) textEl.textContent = currentLang === 'al' ? closeAl : closeEn;
  }
}

/* ======================================================
   SCROLL PROGRESS
   ====================================================== */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = Math.min(pct, 100) + '%';
  }, { passive: true });
}

/* ======================================================
   STICKY HEADER
   ====================================================== */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ======================================================
   MOBILE NAV
   ====================================================== */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobileNav');
  const closeBtn   = document.getElementById('mobileClose');
  if (!hamburger || !mobileNav) return;

  const open  = () => { hamburger.classList.add('active'); mobileNav.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { hamburger.classList.remove('active'); mobileNav.classList.remove('open'); document.body.style.overflow = ''; };

  hamburger.addEventListener('click', () => mobileNav.classList.contains('open') ? close() : open());
  if (closeBtn) closeBtn.addEventListener('click', close);
  document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', close));
  mobileNav.addEventListener('click', e => { if (e.target === mobileNav) close(); });
}

/* ======================================================
   CANVAS PARTICLES
   ====================================================== */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);
  const count = window.innerWidth < 768 ? 10 : 20;
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 2.5 + .8, speed: Math.random() * .5 + .15,
    opacity: Math.random() * .5 + .15, drift: (Math.random() - .5) * .3,
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.y -= p.speed; p.x += p.drift;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10 || p.x > canvas.width + 10) p.x = Math.random() * canvas.width;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      g.addColorStop(0, `rgba(201,168,76,${p.opacity})`);
      g.addColorStop(1, 'rgba(201,168,76,0)');
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ======================================================
   REVEAL ON SCROLL
   ====================================================== */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
}

/* ======================================================
   COUNTERS
   ====================================================== */
function initCounters() {
  const statsEl = document.getElementById('stats');
  if (!statsEl) return;
  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    obs.disconnect();
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const dec = parseInt(el.dataset.decimal || '0');
      let cur = 0;
      const inc = target / (2200 / 16);
      const t = setInterval(() => {
        cur = Math.min(cur + inc, target);
        el.textContent = (dec ? cur.toFixed(dec) : Math.floor(cur).toLocaleString()) + suffix;
        if (cur >= target) clearInterval(t);
      }, 16);
    });
  }, { threshold: 0.4 });
  obs.observe(statsEl);
}

/* ======================================================
   GALLERY FILTER + LIGHTBOX
   ====================================================== */
function initGallery() {
  document.querySelectorAll('.gallery-filters .filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filters .filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.gi').forEach(i => i.classList.toggle('hidden', f !== 'all' && i.dataset.cat !== f));
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lbImg');
  const lbCount  = document.getElementById('lbCounter');
  const items    = Array.from(document.querySelectorAll('.gi'));
  let cur = 0;

  const visible = () => items.filter(i => !i.classList.contains('hidden'));

  function openLB(idx) {
    cur = idx;
    const v = visible();
    lbImg.src = v[cur].querySelector('img').src;
    lbCount.textContent = (cur + 1) + ' / ' + v.length;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  window.closeLB = () => { lightbox.classList.remove('open'); document.body.style.overflow = ''; };
  window.lbNav = (dir) => {
    const v = visible();
    cur = (cur + dir + v.length) % v.length;
    lbImg.src = v[cur].querySelector('img').src;
    lbCount.textContent = (cur + 1) + ' / ' + v.length;
  };

  items.forEach(item => item.addEventListener('click', () => {
    const v = visible();
    const i = v.indexOf(item);
    if (i !== -1) openLB(i);
  }));

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') window.closeLB();
    if (e.key === 'ArrowLeft') window.lbNav(-1);
    if (e.key === 'ArrowRight') window.lbNav(1);
  });
}

/* ======================================================
   PRICE FILTER
   ====================================================== */
function initPriceFilter() {
  document.querySelectorAll('.price-filters .filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.price-filters .filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.pb-group').forEach(g => g.classList.toggle('hidden', f !== 'all' && g.dataset.cat !== f));
    });
  });
}

/* ======================================================
   TESTIMONIALS SLIDER
   ====================================================== */
function initTestimonials() {
  const track   = document.getElementById('testiTrack');
  const prevBtn = document.getElementById('tsPrev');
  const nextBtn = document.getElementById('tsNext');
  const dotsEl  = document.getElementById('tsDots');
  if (!track) return;
  const cards = Array.from(track.querySelectorAll('.testi-card'));
  let cur = 0, auto;
  const cW = 358;
  cards.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'ts-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goTo(i);
    dotsEl.appendChild(d);
  });
  function maxOffset() { return Math.max(0, cards.length - Math.max(1, Math.floor(track.parentElement.offsetWidth / cW))); }
  function goTo(idx) {
    cur = Math.max(0, Math.min(idx, maxOffset()));
    track.style.transform = `translateX(-${cur * cW}px)`;
    dotsEl.querySelectorAll('.ts-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
  }
  prevBtn.addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
  nextBtn.addEventListener('click', () => { goTo(cur + 1 > maxOffset() ? 0 : cur + 1); resetAuto(); });
  let touchX = 0;
  track.addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const d = touchX - e.changedTouches[0].clientX;
    if (Math.abs(d) > 50) d > 0 ? nextBtn.click() : prevBtn.click();
  });
  function resetAuto() { clearInterval(auto); auto = setInterval(() => goTo(cur + 1 > maxOffset() ? 0 : cur + 1), 5000); }
  resetAuto();
}

/* ======================================================
   WHATSAPP BUTTONS (service cards + hero)
   ====================================================== */
function initWAButtons() {
  document.querySelectorAll('.wa-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const msgKey = currentLang === 'al' ? 'data-al-msg' : 'data-en-msg';
      const msg = btn.getAttribute(msgKey) || btn.getAttribute('data-en-msg') || '';
      if (msg) openWA(msg);
    });
  });
}

/* ======================================================
   BOOKING FORM → WHATSAPP (clean, no broken emojis)
   ====================================================== */
function submitBookingWA(e) {
  e.preventDefault();
  const form = e.target;
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = 'rgba(239,68,68,.6)';
      valid = false;
      field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
    }
  });
  if (!valid) return;

  const data = {
    name:    form.name.value.trim(),
    phone:   form.phone.value.trim(),
    service: form.service.value.trim(),
    date:    form.date.value,
    time:    form.time.value,
    message: form.message.value.trim(),
  };

  const msg = MESSAGES[currentLang].fullBooking(data);
  openWA(msg);
}

/* ======================================================
   VIDEO SECTION
   ====================================================== */
function initVideo() {
  const playBtn = document.getElementById('videoPlayBtn');
  if (!playBtn) return;
  playBtn.addEventListener('click', () => {
    if (!videoUrl) {
      const note = document.createElement('p');
      note.style.cssText = 'color:var(--gold2);font-size:11px;text-align:center;padding:0 20px;margin-top:12px;letter-spacing:1px;';
      note.textContent = 'Video coming soon!';
      note.className = 'video-coming';
      if (!document.querySelector('.video-coming')) {
        document.querySelector('.vp-overlay').appendChild(note);
      }
      return;
    }
    const vpWrap = document.querySelector('.video-placeholder');
    if (videoUrl.includes('youtube') || videoUrl.includes('youtu')) {
      const iframe = document.createElement('iframe');
      iframe.src = videoUrl; iframe.allow = 'autoplay; encrypted-media'; iframe.allowFullscreen = true;
      iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      vpWrap.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.src = videoUrl; video.controls = true; video.autoplay = true;
      video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
      vpWrap.appendChild(video);
    }
    document.querySelector('.vp-overlay').style.display = 'none';
    document.querySelector('.vp-logo-bg').style.display = 'none';
  });
}

/* ======================================================
   SMOOTH SCROLL
   ====================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      }
    });
  });
}

/* ======================================================
   INIT
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initIntro();
  initLanguage();
  initScrollProgress();
  initHeader();
  initMobileNav();
  initParticles();
  initReveal();
  initCounters();
  initGallery();
  initPriceFilter();
  initTestimonials();
  initWAButtons();
  initVideo();
  initSmoothScroll();
  updateOpenStatus();

  const dateInput = document.querySelector('#bookingForm input[type="date"]');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
});

window.submitBookingWA = submitBookingWA;
