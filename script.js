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

  var savedModalScrollY = 0;
  var openModalCount = 0;

  function lockPageScroll() {
    openModalCount += 1;

    if (openModalCount > 1) return;

    savedModalScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add('modal-scroll-locked');
    document.body.classList.add('legal-modal-open', 'modal-scroll-locked');
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + savedModalScrollY + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockPageScroll() {
    openModalCount = Math.max(openModalCount - 1, 0);

    if (openModalCount > 0) return;

    document.documentElement.classList.remove('modal-scroll-locked');
    document.body.classList.remove('legal-modal-open', 'modal-scroll-locked');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, savedModalScrollY);
  }

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
    if (window.innerWidth <= 640) {
      legalModalContent.style.overflowY = 'auto';
      legalModalContent.style.webkitOverflowScrolling = 'touch';
    } else {
      legalModalContent.style.overflowY = 'visible';
      legalModalContent.style.webkitOverflowScrolling = 'auto';
    }
    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    lockPageScroll();

    if (legalModalClose) legalModalClose.focus();
  }

  function closeLegalModal() {
    if (!legalModal || !legalModalContent) return;

    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
    legalModalContent.style.overflowY = '';
    legalModalContent.style.webkitOverflowScrolling = '';
    legalModalContent.innerHTML = '';
    unlockPageScroll();
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

  // ── Article modal (Blogs & Articles) ──
  var articleModal = document.getElementById('articleModal');
  var articleModalContent = document.getElementById('articleModalContent');
  var articleModalClose = document.getElementById('articleModalClose');
  var articleTriggers = document.querySelectorAll('.blog-modal-trigger');

  var articleCopy = {
    momentum: {
      html: `
        <h2 id="articleModalTitle">5 Ways Serious Agents Build Momentum Faster</h2>
        <p>Building momentum in real estate isn’t about working harder—it’s about working with structure, clarity, and consistency. The agents who grow the fastest aren’t guessing their next move. They follow systems that compound over time and turn small daily actions into long-term results.</p>
        <p><strong>1. Consistent Follow-Up Systems</strong></p>
        <p>Most opportunities in real estate are not lost—they’re forgotten. Serious agents understand that timing matters. A structured follow-up system ensures every lead is nurtured properly. Whether it’s a CRM, scheduled check-ins, or simple reminders, consistent communication builds trust and keeps you top of mind when clients are ready to act.</p>
        <p><strong>2. Clear Personal Branding</strong></p>
        <p>In a crowded market, being “another agent” is the fastest way to get overlooked. Strong agents define what they stand for—whether it’s luxury service, first-time buyers, or investment expertise. Your branding should be visible in your content, your communication, and your presentation. When people recognize your value instantly, decisions become easier for them.</p>
        <p><strong>3. Daily Lead Generation Habits</strong></p>
        <p>Momentum comes from consistency, not bursts of effort. Top agents commit to daily actions—calls, outreach, content, or networking. Even small numbers, done daily, create a pipeline that compounds. The key isn’t perfection—it’s repetition.</p>
        <p><strong>4. Leveraging Modern Tools</strong></p>
        <p>Today’s real estate environment rewards efficiency. Agents who use digital tools—automated marketing, transaction coordinators, analytics—free up time to focus on relationships and deals. Working smarter allows you to scale without burnout.</p>
        <p><strong>5. Long-Term Mindset</strong></p>
        <p>Quick wins are great, but sustainable growth comes from thinking long-term. The best agents treat every interaction as a relationship, not just a transaction. This mindset leads to referrals, repeat clients, and a reputation that grows year after year.</p>
        <p>Momentum isn’t built overnight. But when these systems are applied consistently, results become predictable—and success becomes scalable.</p>
      `
    },
    'local-marketing': {
      html: `
        <h2 id="articleModalTitle">Local Marketing That Helps You Stand Out</h2>
        <p>In real estate, visibility is everything—but not just any visibility. Local visibility is what drives real results. The agents who dominate their market aren’t everywhere—they’re strategically positioned where their audience is already looking.</p>
        <p><strong>1. Understanding Your Local Audience</strong></p>
        <p>Effective marketing starts with knowing who you’re speaking to. Buyers, sellers, investors—all have different priorities. When your messaging speaks directly to your local audience’s needs, it becomes far more impactful than generic content.</p>
        <p><strong>2. Google & Local Search Presence</strong></p>
        <p>When someone searches “homes for sale near me,” you want to be visible. Optimizing your presence through Google, maps, and local SEO ensures you show up where it matters most. Reviews, consistent information, and location-based content all play a major role.</p>
        <p><strong>3. Content That Reflects Your Market</strong></p>
        <p>Posting generic content won’t differentiate you. Instead, focus on your area—local market updates, neighborhood highlights, recent sales insights. When your content reflects real knowledge of your market, it positions you as the authority.</p>
        <p><strong>4. Social Media with Purpose</strong></p>
        <p>Social media isn’t just about posting—it’s about positioning. High-quality visuals, consistent messaging, and a clear identity create trust. When done correctly, social platforms become powerful lead-generation tools rather than just awareness channels.</p>
        <p><strong>5. Combining Online and Offline Efforts</strong></p>
        <p>Local marketing works best when digital and physical presence align. Open houses, networking, signage, and community involvement should complement your online brand. When people see you both online and in their environment, credibility increases significantly.</p>
        <p>Standing out locally isn’t about doing everything—it’s about doing the right things consistently. When your marketing is aligned, intentional, and localized, it naturally attracts higher-quality opportunities.</p>
      `
    },
    'social-vs-website': {
      html: `
        <h2 id="articleModalTitle">Social Media vs. Your Own Website</h2>
        <p>Many agents wonder where they should focus their efforts—social media or their own website. The truth is, both play important roles, but they serve very different purposes. Understanding how they work together is what creates a strong and stable business.</p>
        <p><strong>Social Media: Reach and Attention</strong></p>
        <p>Social media platforms are designed for discovery. They help you reach new audiences, build awareness, and stay visible. With consistent posting and engaging content, you can attract attention and generate inbound interest.</p>
        <p>However, social media comes with limitations:</p>
        <p>• You don’t own the platform<br>• Algorithms control visibility<br>• Content lifespan is short</p>
        <p>While it’s powerful for exposure, it’s not fully reliable for long-term control.</p>
        <p><strong>Your Website: Control and Conversion</strong></p>
        <p>Your website is your foundation. It’s where serious clients go when they want to learn more, explore listings, or contact you. Unlike social media, your website is fully under your control.</p>
        <p>A strong website allows you to:</p>
        <p>• Present your brand professionally<br>• Capture leads directly<br>• Showcase listings and services clearly<br>• Build long-term credibility</p>
        <p>It turns attention into action.</p>
        <p><strong>Why You Need Both</strong></p>
        <p>The most effective strategy is not choosing one over the other—it’s combining them.</p>
        <p>• Social media brings people in<br>• Your website converts them</p>
        <p>For example, someone might discover you on Instagram, but they’ll visit your website before deciding to work with you. If your website isn’t strong, you risk losing that opportunity.</p>
        <p><strong>The Hybrid Approach</strong></p>
        <p>Serious agents use social media as the entry point and their website as the destination. Content, ads, and outreach drive traffic, while the website builds trust and captures leads.</p>
        <p>This combination creates stability. Even if one platform changes, your business remains strong because your foundation is in place.</p>
      `
    }
  };

  function openArticleModal(type) {
    var copy = articleCopy[type];
    if (!copy || !articleModal || !articleModalContent) return;

    articleModalContent.innerHTML = copy.html;
    articleModalContent.style.overflowY = 'auto';
    articleModalContent.style.webkitOverflowScrolling = 'touch';
    articleModal.classList.add('open');
    articleModal.setAttribute('aria-hidden', 'false');
    lockPageScroll();

    if (articleModalClose) articleModalClose.focus();
  }

  function closeArticleModal() {
    if (!articleModal || !articleModalContent) return;

    articleModal.classList.remove('open');
    articleModal.setAttribute('aria-hidden', 'true');
    articleModalContent.style.overflowY = '';
    articleModalContent.style.webkitOverflowScrolling = '';
    articleModalContent.innerHTML = '<h2 id="articleModalTitle">Article</h2>';
    unlockPageScroll();
  }

  if (articleTriggers.length) {
    articleTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openArticleModal(trigger.dataset.article);
      });
    });
  }

  if (articleModalClose) {
    articleModalClose.addEventListener('click', closeArticleModal);
  }

  if (articleModal) {
    articleModal.addEventListener('click', function (event) {
      if (event.target instanceof HTMLElement && event.target.hasAttribute('data-article-close')) {
        closeArticleModal();
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && articleModal && articleModal.classList.contains('open')) {
      closeArticleModal();
    }
  });
})();