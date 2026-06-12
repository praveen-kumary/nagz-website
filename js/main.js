/* ===== Train With Nagz — Main JS ===== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Navbar scroll effect ---- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    let tickingNav = false;
    window.addEventListener('scroll', () => {
      if (!tickingNav) {
        window.requestAnimationFrame(() => {
          navbar.classList.toggle('scrolled', window.scrollY > 60);
          tickingNav = false;
        });
        tickingNav = true;
      }
    }, { passive: true });
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }

  /* ---- Mobile burger ---- */
  const burger = document.getElementById('nav-burger');
  const mobile = document.getElementById('nav-mobile');
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const isOpen = mobile.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });
    // Close menu on link click
    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobile.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Intersection Observer — fade up ---- */
  const fadeEls = document.querySelectorAll('.fade-up');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => obs.observe(el));
  }

  /* ---- Hero Slider ---- */
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 5000);
  }

  /* ---- Counter Animation ---- */
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current + suffix;
          }, 30);
          counterObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => counterObs.observe(el));
  }

  /* ---- Web3Forms submission helper ---- */
  async function submitToWeb3Forms(form, successElId) {
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'SENDING...';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const payload = Object.fromEntries(formData);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        form.style.display = 'none';
        document.getElementById(successElId).style.display = 'block';
      } else {
        btn.textContent = 'FAILED — TRY AGAIN';
        btn.disabled = false;
        setTimeout(() => { btn.textContent = originalText; }, 3000);
      }
    } catch (err) {
      btn.textContent = 'FAILED — TRY AGAIN';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    }
  }

  /* ---- Lead form (landing page) ---- */
  const leadForm = document.getElementById('lead-form-el');
  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitToWeb3Forms(leadForm, 'form-success');
    });
  }

  /* ---- Contact form ---- */
  const contactForm = document.getElementById('contact-form-el');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitToWeb3Forms(contactForm, 'contact-success');
    });
  }

  /* ---- Back to Top Button ---- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    let tickingBtt = false;
    window.addEventListener('scroll', () => {
      if (!tickingBtt) {
        window.requestAnimationFrame(() => {
          backToTop.classList.toggle('visible', window.scrollY > 600);
          tickingBtt = false;
        });
        tickingBtt = true;
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Smooth scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
  /* ---- Testimonial Carousel (transform-based) ---- */
  const testiTrack = document.getElementById('testi-track');
  const testiDots = document.getElementById('testi-dots');

  if (testiTrack && testiDots) {
    const cards = testiTrack.querySelectorAll('.testi-card');
    const total = cards.length;
    let current = 0;
    let autoTimer = null;
    let resumeTimer = null;

    // Build dots
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-carousel__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', () => { goTo(i); pause(); });
      testiDots.appendChild(dot);
    }
    const dots = [...testiDots.children];

    // Slide width = card width + margin
    function slideWidth() {
      const style = getComputedStyle(cards[0]);
      return cards[0].offsetWidth + parseFloat(style.marginRight);
    }

    function goTo(i) {
      if (i < 0) i = total - 1;
      if (i >= total) i = 0;
      current = i;
      testiTrack.style.transform = 'translateX(' + (-current * slideWidth()) + 'px)';
      dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
    }

    function next() { goTo(current + 1); }

    // Auto-play
    function play() {
      stop();
      autoTimer = setInterval(next, 5000);
    }
    function stop() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
    }
    function pause() {
      stop();
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(play, 5000);
    }

    // Touch swipe
    let touchX0 = 0, touchY0 = 0, touchDx = 0, isSwiping = false;

    testiTrack.addEventListener('touchstart', (e) => {
      touchX0 = e.touches[0].clientX;
      touchY0 = e.touches[0].clientY;
      touchDx = 0;
      isSwiping = false;
      testiTrack.classList.add('is-dragging');
    }, { passive: true });

    testiTrack.addEventListener('touchmove', (e) => {
      const dx = e.touches[0].clientX - touchX0;
      const dy = e.touches[0].clientY - touchY0;
      // Only swipe horizontally
      if (!isSwiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
        isSwiping = true;
      }
      if (isSwiping) {
        touchDx = dx;
        const offset = -current * slideWidth() + dx;
        testiTrack.style.transform = 'translateX(' + offset + 'px)';
        e.preventDefault();
      }
    }, { passive: false });

    testiTrack.addEventListener('touchend', () => {
      testiTrack.classList.remove('is-dragging');
      if (Math.abs(touchDx) > 50) {
        touchDx < 0 ? goTo(current + 1) : goTo(current - 1);
      } else {
        goTo(current);
      }
      pause();
    });

    // Mouse drag (desktop)
    let mouseDown = false, mouseX0 = 0, mouseDx = 0;

    testiTrack.addEventListener('mousedown', (e) => {
      mouseDown = true;
      mouseX0 = e.clientX;
      mouseDx = 0;
      testiTrack.classList.add('is-dragging');
      e.preventDefault();
    });

    window.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      mouseDx = e.clientX - mouseX0;
      const offset = -current * slideWidth() + mouseDx;
      testiTrack.style.transform = 'translateX(' + offset + 'px)';
    });

    window.addEventListener('mouseup', () => {
      if (!mouseDown) return;
      mouseDown = false;
      testiTrack.classList.remove('is-dragging');
      if (Math.abs(mouseDx) > 50) {
        mouseDx < 0 ? goTo(current + 1) : goTo(current - 1);
      } else {
        goTo(current);
      }
      pause();
    });

    // Recalc on resize
    window.addEventListener('resize', () => goTo(current));

    // Start
    play();
  }

  /* ---- FAQ Accordion ---- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-item__header');
    if (header) {
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all others
        faqItems.forEach(other => other.classList.remove('open'));
        // Toggle clicked
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ---- Scroll Indicator — hide on scroll ---- */
  const scrollInd = document.querySelector('.scroll-indicator');
  if (scrollInd) {
    let hidden = false;
    window.addEventListener('scroll', () => {
      if (!hidden && window.scrollY > 100) {
        scrollInd.style.opacity = '0';
        scrollInd.style.pointerEvents = 'none';
        hidden = true;
      }
    }, { passive: true });
  }

});
