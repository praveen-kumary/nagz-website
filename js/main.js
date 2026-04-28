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

});
