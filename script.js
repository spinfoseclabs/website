/* ============================================
   SP INFOSEC LABS — JAVASCRIPT
   ============================================ */

// ---- MATRIX CANVAS BACKGROUND ----
(function initMatrix() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let cols, drops;

  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
  const fontSize = 13;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / fontSize);
    drops = new Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(8, 13, 26, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00d4ff';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);
  setInterval(draw, 60);
})();

// ---- NAVBAR SCROLL ----
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();

// ---- HAMBURGER MENU ----
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    if (!open) {
      links.style.flexDirection = 'column';
      links.style.position = 'absolute';
      links.style.top = '70px';
      links.style.left = '0';
      links.style.right = '0';
      links.style.background = 'rgba(8,13,26,0.97)';
      links.style.padding = '16px 24px';
      links.style.borderBottom = '1px solid rgba(0,212,255,0.15)';
      links.style.zIndex = '999';
    }
  });
  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      if (window.innerWidth < 768) links.style.display = 'none';
    });
  });
})();

// ---- INTERSECTION OBSERVER — SERVICE CARDS ----
(function initCardAnimations() {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || '0');
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
})();

// ---- SCROLL-REVEAL for sections ----
(function initScrollReveal() {
  const targets = document.querySelectorAll('.pillar, .highlight-item, .about-card-stack');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`;
    observer.observe(el);
  });
})();

// ---- CONTACT FORM — Google Forms AJAX ----
(function initContactForm() {
  const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScWy63KdxmQQgBD6gJgYhWnTspiO7rYNtDEMtbRxqLp11rrAA/formResponse';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = 'Sending&hellip;';
    btn.disabled = true;
    if (successEl) { successEl.style.display = 'none'; successEl.className = 'form-success'; }

    const formData = new FormData(form);

    // Google Forms doesn't allow CORS — use no-cors mode.
    // The fetch will always "succeed" (opaque response), so we treat
    // any network completion as success and any network error as failure.
    fetch(FORM_URL, { method: 'POST', body: formData, mode: 'no-cors' })
      .then(() => {
        form.reset();
        btn.innerHTML = '&#10003; Sent!';
        btn.style.background = 'linear-gradient(135deg,#00ff88,#00cc66)';
        if (successEl) {
          successEl.textContent = '✓ Thank you! We\'ll get back to you within 24 hours.';
          successEl.style.display = 'block';
        }
        setTimeout(() => {
          btn.innerHTML = origHTML;
          btn.disabled = false;
          btn.style.background = '';
          if (successEl) successEl.style.display = 'none';
        }, 5000);
      })
      .catch(() => {
        btn.innerHTML = origHTML;
        btn.disabled = false;
        if (successEl) {
          successEl.textContent = '✗ Something went wrong. Please email us directly at contact@spinfoseclabs.com';
          successEl.className = 'form-error';
          successEl.style.display = 'block';
        }
      });
  });
})();

// ---- ACTIVE NAV LINK on scroll ----
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));

  // Inject active style
  const style = document.createElement('style');
  style.textContent = `.nav-links a.active { color: var(--cyan) !important; background: var(--cyan-dim) !important; }`;
  document.head.appendChild(style);
})();

// ---- SMOOTH anchor scrolling with offset ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ---- TYPED EFFECT on hero tagline ----
(function initTypedEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const lines = [
    'Your trusted partner in securing what matters most —',
    'your digital assets, your business, your future.'
  ];
  const fullText = tagline.innerHTML;

  // Only animate on first load if not reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  tagline.innerHTML = '';
  tagline.style.minHeight = '3em';

  let lineIdx = 0, charIdx = 0;
  let el = document.createElement('span');
  tagline.appendChild(el);

  function type() {
    if (lineIdx >= lines.length) {
      tagline.innerHTML = fullText;
      return;
    }
    if (charIdx < lines[lineIdx].length) {
      el.textContent += lines[lineIdx][charIdx];
      charIdx++;
      setTimeout(type, 28);
    } else {
      if (lineIdx < lines.length - 1) {
        tagline.appendChild(document.createElement('br'));
        el = document.createElement('span');
        tagline.appendChild(el);
        lineIdx++;
        charIdx = 0;
        setTimeout(type, 200);
      }
    }
  }

  // Delay start to let page settle
  setTimeout(type, 800);
})();

// ---- COUNTER ANIMATION for stats ----
(function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();

      // Extract number and suffix
      const match = raw.match(/^([\d.]+)(\D*)$/);
      if (!match) return;

      const target = parseFloat(match[1]);
      const suffix = match[2];
      const isDecimal = match[1].includes('.');
      const duration = 1400;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => observer.observe(s));
})();
