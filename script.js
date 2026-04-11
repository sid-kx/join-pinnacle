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
  // ── Legal modal (Privacy & Terms) ─────
  var legalModal = document.getElementById('legalModal');
  var legalModalContent = document.getElementById('legalModalContent');
  var legalModalClose = document.getElementById('legalModalClose');
  var legalTriggers = document.querySelectorAll('.footer-legal-trigger');

  var legalCopy = {
    privacy: {
      title: 'Privacy Policy',
      html: `
        <h2 id="legalModalTitle">Privacy Policy</h2>
        <p>At Pinnacle Realty, your privacy matters. This website may collect personal information you choose to submit, such as your name, email address, phone number, property preferences, and any details you provide through forms or direct inquiries.</p>
        <p>We use this information to respond to requests, provide real estate guidance, share relevant updates, and improve the overall experience of the website. We may also use limited website analytics to understand how visitors interact with our pages and to improve performance, navigation, and content.</p>
        <p>Your information is not sold to third parties. Information may be shared only with trusted service providers or licensed team members when necessary to support communication, scheduling, listings-related services, or legal and regulatory obligations connected to real estate operations.</p>
        <p>While we take reasonable steps to protect submitted information, no method of internet transmission or storage can be guaranteed to be completely secure. By using this website, you understand and accept that standard online communication carries some level of risk.</p>
        <p>This website may contain links, future integrations, or embedded services from third parties. Those services may operate under their own privacy practices. We encourage visitors to review third-party terms and privacy notices when using those features.</p>
        <p>If you would like to request an update, correction, or deletion of information you have submitted through this website, please contact Pinnacle Realty directly using the website contact page.</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      html: `
        <h2 id="legalModalTitle">Terms of Service</h2>
        <p>By accessing and using the Pinnacle Realty website, you agree to use the site only for lawful purposes related to learning about services, browsing information, making inquiries, or contacting the brokerage.</p>
        <p>All website content, including branding, design elements, text, visuals, page structure, and presentation, is provided for general informational purposes only and may be updated, modified, or removed at any time without notice.</p>
        <p>Real estate information shown on this website, including future listing tools, property descriptions, market-related content, and service details, may change over time and should not be considered guaranteed, final, or legally binding unless confirmed directly through a licensed representative.</p>
        <p>You agree not to misuse the website, attempt unauthorized access, interfere with performance, copy protected content for commercial use, or use automated tools in a way that disrupts the normal operation of the site.</p>
        <p>Pinnacle Realty is not responsible for losses or damages arising from reliance on website content alone, service interruptions, technical errors, third-party tools, or external links. Visitors should confirm material details directly before making real estate decisions.</p>
        <p>Continued use of this website means you accept these terms. If you do not agree with them, you should discontinue use of the website.</p>
      `
    }
  };

  function openLegalModal(type) {
    var copy = legalCopy[type];
    if (!copy || !legalModal || !legalModalContent) return;

    legalModalContent.innerHTML = copy.html;
    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('legal-modal-open');

    if (legalModalClose) legalModalClose.focus();
  }

  function closeLegalModal() {
    if (!legalModal || !legalModalContent) return;

    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
    legalModalContent.innerHTML = '';
    document.body.classList.remove('legal-modal-open');
  }

  if (legalTriggers.length) {
    legalTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openLegalModal(trigger.dataset.legal);
      });
    });
  }

  if (legalModalClose) {
    legalModalClose.addEventListener('click', closeLegalModal);
  }

  if (legalModal) {
    legalModal.addEventListener('click', function (event) {
      if (event.target instanceof HTMLElement && event.target.hasAttribute('data-legal-close')) {
        closeLegalModal();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && legalModal && legalModal.classList.contains('open')) {
      closeLegalModal();
    }
  });
})();