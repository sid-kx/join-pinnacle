/* ========================================
   Pinnacle Realty — Static Site JS
   ======================================== */

(function () {
  'use strict';

  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinksDesktop = document.getElementById('navLinks');
  var form = document.getElementById('applyForm');
  var success = document.getElementById('formSuccess');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Navbar scroll effect ──────────────
  if (navbar) {
    var lastScrolledState = false;
    var ticking = false;

    function updateNavbarState() {
      var isScrolled = window.scrollY > 40;

      if (isScrolled !== lastScrolledState) {
        navbar.classList.toggle('scrolled', isScrolled);
        lastScrolledState = isScrolled;
      }

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateNavbarState);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateNavbarState();
  }

  // ── Mobile menu ───────────────────────
  var mobileMenu = null;

  if (navbar && hamburger && navLinksDesktop) {
    mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.innerHTML = navLinksDesktop.innerHTML;
    navbar.appendChild(mobileMenu);

    function closeMobileMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', function (e) {
      if (!mobileMenu.classList.contains('open')) return;
      if (navbar.contains(e.target)) return;
      closeMobileMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    });
  }

  // ── Smooth scroll for anchor links ────
  function getScrollTargetPosition(target) {
    var navbarHeight = navbar ? navbar.offsetHeight : 0;
    var extraOffset = 12;
    var targetTop = target.getBoundingClientRect().top + window.pageYOffset;
    return Math.max(targetTop - navbarHeight - extraOffset, 0);
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;

      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      window.scrollTo({
        top: getScrollTargetPosition(target),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  // ── Scroll animations ────────────────
  var animEls = document.querySelectorAll('[data-animate]');

  if (animEls.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      animEls.forEach(function (el) {
        el.classList.add('visible');
      });
    } else {
      var observer = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      animEls.forEach(function (el, i) {
        el.style.transitionDelay = (i % 6) * 0.08 + 's';
        observer.observe(el);
      });
    }
  }

  // ── Form submission ──────────────────
  if (form && success) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.style.display = 'none';
      success.style.display = 'block';

      window.scrollTo({
        top: getScrollTargetPosition(success),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }
})();