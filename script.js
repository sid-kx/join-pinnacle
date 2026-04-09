/* ========================================
   Pinnacle Realty — Static Site JS
   ======================================== */

(function () {
  'use strict';

  // ── Navbar scroll effect ──────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Mobile menu ───────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksDesktop = document.getElementById('navLinks');

  // Create mobile menu
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.innerHTML = navLinksDesktop.innerHTML;
  navbar.appendChild(mobileMenu);

  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  // ── Smooth scroll for anchor links ────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── Scroll animations ────────────────
  var animEls = document.querySelectorAll('[data-animate]');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach(function (el, i) {
    el.style.transitionDelay = (i % 6) * 0.1 + 's';
    observer.observe(el);
  });

  // ── Form submission ──────────────────
  var form = document.getElementById('applyForm');
  var success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
})();