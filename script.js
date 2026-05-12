/* ============================================================
   MAGUZEIRA'S STORE — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. HAMBURGER MENU
  ---------------------------------------------------------- */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');
  const overlay     = document.getElementById('overlay');
  const closeBtn    = document.getElementById('closeMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  function openMenu() {
    mobileMenu.classList.add('open');
    overlay.classList.add('visible');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    overlay.classList.remove('visible');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  mobileLinks.forEach(link => link.addEventListener('click', closeMenu));


  /* ----------------------------------------------------------
     2. CARD TAGS — build pills from data-tags attribute
  ---------------------------------------------------------- */
  document.querySelectorAll('.product-card').forEach(card => {
    const rawTags = card.getAttribute('data-tags');
    const tagsEl  = card.querySelector('.card-tags');

    if (!rawTags || !tagsEl) return;

    const tags = rawTags.split(',').map(t => t.trim());
    tags.forEach(tag => {
      const pill = document.createElement('span');
      pill.className = 'tag-pill';
      pill.textContent = tag;
      tagsEl.appendChild(pill);
    });
  });


  /* ----------------------------------------------------------
     3. HEADER SCROLL OPACITY
  ---------------------------------------------------------- */
  const header = document.getElementById('header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(10,10,10,0.88)';
    } else {
      header.style.background = 'rgba(10,10,10,0.72)';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ----------------------------------------------------------
     4. SMOOTH SCROLL + ACTIVE NAV HIGHLIGHTING
  ---------------------------------------------------------- */
  const sections    = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav-desktop a');

  const observerOpts = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.85';
          link.style.color   = link.getAttribute('href') === `#${id}` ? 'var(--blue)' : '';
        });
      }
    });
  }, observerOpts);

  sections.forEach(s => sectionObserver.observe(s));


  /* ----------------------------------------------------------
     5. SCROLL-REVEAL ANIMATION
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll(
    '.product-card, .section-header, .contact-card, .hero-content, .hero-image'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.06}s, transform 0.7s ease ${i * 0.06}s`;
    revealObserver.observe(el);
  });

  // Add "revealed" class styles via JS (avoid needing extra CSS rule)
  const style = document.createElement('style');
  style.textContent = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);


  /* ----------------------------------------------------------
     6. HERO IMAGE — fallback visibility
  ---------------------------------------------------------- */
  const heroImg      = document.querySelector('.hero-image img');
  const phoneFallback = document.querySelector('.hero-phone-fallback');

  if (heroImg) {
    heroImg.addEventListener('load', () => {
      if (phoneFallback) phoneFallback.style.display = 'none';
    });
    heroImg.addEventListener('error', () => {
      heroImg.style.display = 'none';
      if (phoneFallback) phoneFallback.style.display = 'flex';
    });
  }


  /* ----------------------------------------------------------
     7. BACK TO TOP — smooth
  ---------------------------------------------------------- */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ----------------------------------------------------------
     8. CONTACT BUTTONS — WhatsApp & Instagram UTM
  ---------------------------------------------------------- */
  const whatsBtn = document.querySelector('a[href*="wa.me"]');
  if (whatsBtn) {
    whatsBtn.href = 'https://wa.me/5500000000000?text=Olá!%20Vi%20o%20site%20da%20Maguzeira%27s%20Store%20e%20gostaria%20de%20saber%20mais.';
  }

});
