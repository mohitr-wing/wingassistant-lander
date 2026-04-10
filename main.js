// ═══════════════════════════════════════════════
// WING ASSISTANT — FRANCHISE FUNNEL JS
// ═══════════════════════════════════════════════

// ─── STORE URL PARAMETERS IN COOKIES ───
(function () {
  var params = new URLSearchParams(window.location.search);
  params.forEach(function (value, key) {
    document.cookie = encodeURIComponent(key) + '=' + encodeURIComponent(value) + ';path=/;max-age=' + (30 * 24 * 60 * 60) + ';SameSite=Lax';
  });
})();

// ─── FORWARD URL PARAMS + FB COOKIES TO QUALIFY.HTML LINKS ───
(function () {
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
  }

  document.querySelectorAll('a[href*="qualify.html"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var currentParams = new URLSearchParams(window.location.search);
      var url = new URL(link.href, window.location.origin);

      // Forward all URL params
      currentParams.forEach(function (value, key) {
        if (!url.searchParams.has(key)) {
          url.searchParams.set(key, value);
        }
      });

      // Read _fbp from cookie (set by FB pixel)
      var fbp = getCookie('_fbp');
      if (fbp && !url.searchParams.has('fbp')) url.searchParams.set('fbp', fbp);

      // Read _fbc from cookie, or construct it from fbclid if pixel hasn't set it
      var fbc = getCookie('_fbc');
      if (!fbc && currentParams.has('fbclid')) {
        fbc = 'fb.1.' + Date.now() + '.' + currentParams.get('fbclid');
      }
      if (fbc && !url.searchParams.has('fbc')) url.searchParams.set('fbc', fbc);

      window.location.href = url.pathname + '?' + url.searchParams.toString();
    });
  });
})();

// Header scroll effect
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-answer');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('active');
      i.querySelector('.faq-answer').style.maxHeight = null;
    });

    if (!isActive) {
      item.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Count-up animation for rating scores
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = (eased * target).toFixed(1);
        el.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.count-up').forEach(el => countObserver.observe(el));

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Mobile toggle
const mobileToggle = document.getElementById('mobileToggle');
const nav = document.querySelector('.nav');
if (mobileToggle && nav) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-open');
    nav.style.display = isOpen ? 'flex' : 'none';
  });
  // Close nav when a link is clicked
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-open');
      nav.style.display = 'none';
    });
  });
}

// ─── QUALIFICATION FORM LOGIC ───
const qualifyForm = document.getElementById('qualifyForm');
if (qualifyForm) {
  const steps = qualifyForm.querySelectorAll('.qualify-step');
  const bars = document.querySelectorAll('.qualify-progress .bar');
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    bars.forEach((b, i) => {
      b.classList.remove('active', 'done');
      if (i < index) b.classList.add('done');
      if (i === index) b.classList.add('active');
    });
    currentStep = index;
  }

  // Next buttons
  qualifyForm.querySelectorAll('.btn-next').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        showStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Back buttons
  qualifyForm.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        showStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  // Option cards (single select per group)
  qualifyForm.querySelectorAll('.option-grid').forEach(grid => {
    grid.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        grid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  });

  // Form submit
  qualifyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = 'book.html';
  });

  showStep(0);
}

// ─── VIDEO CAROUSEL ───
const videoTrack = document.getElementById('videoTrack');
const videoPrev = document.getElementById('videoPrev');
const videoNext = document.getElementById('videoNext');
if (videoTrack && videoPrev && videoNext) {
  const scrollAmount = 340;

  videoNext.addEventListener('click', () => {
    videoTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  });

  videoPrev.addEventListener('click', () => {
    videoTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  });
}

// ─── VIDEO THUMBNAIL CLICK-TO-PLAY ───
document.querySelectorAll('.video-thumbnail').forEach(thumb => {
  thumb.addEventListener('click', () => {
    const videoId = thumb.dataset.video;
    if (!videoId) return;
    // On local file:// or if embed fails, open in new tab
    if (window.location.protocol === 'file:') {
      window.open('https://www.youtube.com/watch?v=' + videoId, '_blank');
      return;
    }
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + videoId + '?autoplay=1&rel=0';
    iframe.title = 'Wing Assistant Testimonial';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    thumb.innerHTML = '';
    thumb.appendChild(iframe);
    thumb.classList.remove('video-thumbnail');
  });
});
