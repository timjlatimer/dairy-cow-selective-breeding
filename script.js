/* ============================================
   EIGHT CENTURIES OF THE DAIRY COW
   Interactive Script
   ============================================ */

(function () {
  'use strict';

  // ---- Utility: Intersection Observer for fade-in animations ----
  function initScrollAnimations() {
    const fadeEls = document.querySelectorAll('.fade-in, .fade-in-timeline');

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      fadeEls.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Trigger bar animations inside this element
          animateBarsIn(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    fadeEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Animate bars when their container becomes visible ----
  function animateBarsIn(container) {
    // Production chart bars
    var bars = container.querySelectorAll('.bar-chart__bar:not(.animated)');
    bars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.classList.add('animated');
      }, i * 100);
    });

    // Comparison bars
    var compBars = container.querySelectorAll('.comp-bar:not(.animated)');
    compBars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.classList.add('animated');
      }, i * 80);
    });

    // Gain chart bars
    var gainBars = container.querySelectorAll('.gain-chart__bar:not(.animated)');
    gainBars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.classList.add('animated');
      }, i * 150);
    });

    // Trade-off stat bars
    var tradeoffBars = container.querySelectorAll('.tradeoff-stat-bar__fill:not(.animated)');
    tradeoffBars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.classList.add('animated');
      }, i * 200);
    });

    // Lifespan bars
    var lifespanBars = container.querySelectorAll('.lifespan-bar__fill:not(.animated)');
    lifespanBars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.classList.add('animated');
      }, i * 200);
    });
  }

  // ---- Also observe chart containers directly for bar animations ----
  function initChartObservers() {
    var chartContainers = document.querySelectorAll('.chart-container, .comparison-viz, .gain-chart, .tradeoff-card, .tradeoff-lifespan');

    if (!('IntersectionObserver' in window)) {
      chartContainers.forEach(function (el) { animateBarsIn(el); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateBarsIn(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -40px 0px'
    });

    chartContainers.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ---- Timeline progress line ----
  function initTimelineProgress() {
    var timeline = document.querySelector('.timeline');
    var progressBar = document.querySelector('.timeline__progress');
    if (!timeline || !progressBar) return;

    function updateProgress() {
      var rect = timeline.getBoundingClientRect();
      var timelineTop = rect.top;
      var timelineHeight = rect.height;
      var viewportHeight = window.innerHeight;

      // Calculate how far we've scrolled through the timeline
      var scrolled = (viewportHeight * 0.5 - timelineTop) / timelineHeight;
      scrolled = Math.max(0, Math.min(1, scrolled));

      progressBar.style.height = (scrolled * 100) + '%';
    }

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          updateProgress();
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  // ---- Hero stat counter animation ----
  function initHeroCounter() {
    var counter = document.querySelector('.hero__stat-number');
    if (!counter) return;

    var target = parseInt(counter.getAttribute('data-target'), 10);
    var duration = 2000; // ms
    var startTime = null;
    var started = false;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function animateCount(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var current = Math.round(easedProgress * target);
      counter.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    }

    // Start when hero is visible (immediately on load)
    setTimeout(function () {
      requestAnimationFrame(animateCount);
    }, 1200); // Delay to sync with hero fade-in animations
  }

  // ---- Smooth scroll for internal links ----
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---- Parallax-like effect on hero ----
  function initHeroParallax() {
    var hero = document.querySelector('.hero');
    var heroContent = document.querySelector('.hero__content');
    if (!hero || !heroContent) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          var heroHeight = hero.offsetHeight;
          if (scrollY < heroHeight) {
            var opacity = 1 - (scrollY / heroHeight) * 1.2;
            var translateY = scrollY * 0.3;
            heroContent.style.opacity = Math.max(0, opacity);
            heroContent.style.transform = 'translateY(' + translateY + 'px)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ---- Text Size Control ----
  function initTextSizeControl() {
    var btn = document.getElementById('textSizeBtn');
    if (!btn) return;

    var sizes = ['', 'text-large', 'text-xl'];
    var labels = ['Aa', 'A+', 'A++'];
    var currentIdx = 0;

    // Restore from localStorage
    try {
      var saved = localStorage.getItem('dairy-cow-text-size');
      if (saved) {
        var idx = sizes.indexOf(saved);
        if (idx > -1) {
          currentIdx = idx;
          if (sizes[currentIdx]) document.body.classList.add(sizes[currentIdx]);
          btn.textContent = labels[currentIdx];
        }
      }
    } catch (e) {}

    btn.addEventListener('click', function () {
      // Remove current
      if (sizes[currentIdx]) document.body.classList.remove(sizes[currentIdx]);
      // Advance
      currentIdx = (currentIdx + 1) % sizes.length;
      // Apply new
      if (sizes[currentIdx]) document.body.classList.add(sizes[currentIdx]);
      btn.textContent = labels[currentIdx];
      // Save
      try { localStorage.setItem('dairy-cow-text-size', sizes[currentIdx]); } catch (e) {}
    });
  }

  // ---- Initialize everything ----
  function init() {
    initScrollAnimations();
    initChartObservers();
    initTimelineProgress();
    initHeroCounter();
    initSmoothScroll();
    initHeroParallax();
    initTextSizeControl();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
