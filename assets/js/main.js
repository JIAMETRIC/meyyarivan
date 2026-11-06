/* MEYYARIVAN — site interactions */
(function () {
  'use strict';

  var header = document.querySelector('.header');
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');

  /* ---------- Header state on scroll ---------- */
  function onScroll() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  function setMenu(open) {
    if (!header || !toggle) return;
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (mobileNav) {
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && header && header.classList.contains('menu-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Reveal on scroll ---------- */
  var fades = document.querySelectorAll('.fade');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    fades.forEach(function (el) { io.observe(el); });
  } else {
    fades.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = document.querySelectorAll('.nav a[href^="#"]');
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.querySelector(a.getAttribute('href'));
  }).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Enquiry form ---------- */
  var form = document.getElementById('enquiry-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
    email: function (v) {
      if (!v.trim()) return 'Please enter your email address.';
      return EMAIL_RE.test(v.trim()) ? '' : 'Please enter a valid email address.';
    },
    interest: function (v) { return v ? '' : 'Please choose an area of interest.'; },
    message: function (v) {
      var len = v.trim().length;
      if (!len) return 'Please tell us a little about your enquiry.';
      return len < 20 ? 'Please add a little more detail (at least 20 characters).' : '';
    },
    consent: function (_, el) { return el.checked ? '' : 'Please confirm you agree so we can respond.'; }
  };

  function validateField(el) {
    var rule = rules[el.name];
    if (!rule) return true;
    var msg = rule(el.value, el);
    var errEl = document.getElementById('e-' + el.name);
    if (errEl) errEl.textContent = msg;
    if (msg) el.setAttribute('aria-invalid', 'true');
    else el.removeAttribute('aria-invalid');
    return !msg;
  }

  function showStatus(type, text) {
    statusEl.className = 'form-status is-visible ' + (type === 'success' ? 'success' : 'error-box');
    statusEl.textContent = text;
  }

  Object.keys(rules).forEach(function (name) {
    var el = form.elements[name];
    if (!el) return;
    el.addEventListener('blur', function () { if (el.value || el.type === 'checkbox') validateField(el); });
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) validateField(el); });
    el.addEventListener('change', function () { if (el.getAttribute('aria-invalid')) validateField(el); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    statusEl.className = 'form-status';
    statusEl.textContent = '';

    var firstInvalid = null;
    Object.keys(rules).forEach(function (name) {
      var el = form.elements[name];
      if (el && !validateField(el) && !firstInvalid) firstInvalid = el;
    });
    if (firstInvalid) { firstInvalid.focus(); return; }

    // Honeypot: silently accept bot submissions without sending.
    if (form.elements._gotcha && form.elements._gotcha.value) {
      form.reset();
      showStatus('success', 'Thank you — your message has been received.');
      return;
    }

    var endpoint = (form.getAttribute('action') || '').trim();
    if (!endpoint) {
      showStatus('error', 'Our enquiry form is still being connected. Please try again soon.');
      if (window.console) console.warn('[MEYYARIVAN] Set the action of #enquiry-form to your Formspree URL (https://formspree.io/f/…).');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (res.ok) {
            form.reset();
            showStatus('success', 'Thank you — your message has been sent. We’ll be in touch soon.');
            return;
          }
          // Formspree returns { errors: [{ field, message }] } for rejected submissions.
          var errs = (data && data.errors) || [];
          var fieldErr = errs.filter(function (er) { return er.field && form.elements[er.field]; });
          fieldErr.forEach(function (er) {
            var el = form.elements[er.field];
            var errEl = document.getElementById('e-' + er.field);
            if (errEl) errEl.textContent = er.message.charAt(0).toUpperCase() + er.message.slice(1) + '.';
            el.setAttribute('aria-invalid', 'true');
          });
          if (fieldErr.length) {
            form.elements[fieldErr[0].field].focus();
            showStatus('error', 'Please check the highlighted field and try again.');
            return;
          }
          throw new Error(errs.length ? errs.map(function (er) { return er.message; }).join(' ') : 'HTTP ' + res.status);
        });
      })
      .catch(function (err) {
        if (window.console) console.warn('[MEYYARIVAN] Form submission failed:', err && err.message);
        showStatus('error', 'Sorry, something went wrong sending your message. Please try again in a moment.');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.classList.remove('is-loading');
      });
  });
})();
