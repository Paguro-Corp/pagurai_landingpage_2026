(function () {
  'use strict';

  function initVidewayAcademy() {
    var root = document.getElementById('vw-ghl-landing');
    if (!root || root.dataset.vwReady === '1') return;
    root.dataset.vwReady = '1';

    var config = window.VW_GHL_CONFIG || {};
    var assets = config.assets || {};
    var links = config.links || {};
    var videos = config.videos || {};

    // Wire asset images
    root.querySelectorAll('[data-vw-asset]').forEach(function (el) {
      var key = el.getAttribute('data-vw-asset');
      if (assets[key]) {
        el.setAttribute('src', assets[key]);
      }
    });

    // Wire privacy policy links
    root.querySelectorAll('[data-vw-link]').forEach(function (el) {
      var key = el.getAttribute('data-vw-link');
      if (links[key]) {
        el.setAttribute('href', links[key]);
      }
    });

    // Try playing muted videos inline
    function tryPlayVideo(video) {
      if (!video || !video.getAttribute('src')) return;
      video.muted = true;
      video.defaultMuted = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      try {
        var p = video.play();
        if (p && p.catch) {
          p.catch(function () {});
        }
      } catch (e) {}
    }

    // Wire MP4 videos with poster fallbacks
    function wireVideo(key) {
      var video = root.querySelector('[data-vw-video="' + key + '"]');
      if (!video) return;

      var posterKey = video.getAttribute('data-vw-poster');
      var url = (videos[key] || '').trim();
      var poster = assets[posterKey] || '';
      var wrap = video.closest('[data-vw-video-wrap]');

      if (poster) {
        video.setAttribute('poster', poster);
      }
      
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.autoplay = true;
      video.playsInline = true;
      video.setAttribute('muted', '');
      video.setAttribute('autoplay', '');
      video.setAttribute('loop', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');

      if (url) {
        video.setAttribute('src', url);
        if (wrap) {
          wrap.classList.add('vw-video-ready');
        }
        try {
          video.load();
        } catch (e) {}
        tryPlayVideo(video);
        video.addEventListener('loadeddata', function () { tryPlayVideo(video); }, { once: true });
        video.addEventListener('canplay', function () { tryPlayVideo(video); }, { once: true });
        setTimeout(function () { tryPlayVideo(video); }, 250);
        setTimeout(function () { tryPlayVideo(video); }, 1000);
      }
    }

    wireVideo('hero');
    wireVideo('vertical1');
    wireVideo('vertical2');
    wireVideo('vertical3');

    // Button mouse glow effect coordinates
    root.querySelectorAll('.vw-cta-btn').forEach(function (btn) {
      if (!btn.querySelector('.vw-btn-glow')) {
        var glow = document.createElement('span');
        glow.className = 'vw-btn-glow';
        btn.insertBefore(glow, btn.firstChild);
      }
      btn.addEventListener('pointermove', function (e) {
        var rect = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        btn.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });

    // Card mouse glow effect coordinates
    document.addEventListener('pointermove', function (e) {
      root.querySelectorAll('.vw-glow-card').forEach(function (card) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--glow-x', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--glow-y', (e.clientY - rect.top) + 'px');
      });
    });

    // Intersection observers for animations
    if ('IntersectionObserver' in window) {
      // General scroll fade-ins
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('vw-visible');
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

      root.querySelectorAll('.vw-reveal, .vw-reveal-stagger').forEach(function (el) {
        revealObserver.observe(el);
      });

      // Accent text reveals
      var accentObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('vw-animated');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.28 });

      root.querySelectorAll('.vw-accent-reveal').forEach(function (el) {
        accentObserver.observe(el);
      });

      // Instantly animate hero accents
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          root.querySelectorAll('.vw-hero-accent-line').forEach(function (el) {
            el.classList.add('vw-animated');
          });
        });
      });

      // Floating badges fade in
      var badgeObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('vw-badges-visible');
          }
        });
      }, { threshold: 0.3 });

      root.querySelectorAll('[data-vw-badges]').forEach(function (el) {
        badgeObserver.observe(el);
      });

      // Feature strip lists slide in
      var featureObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('vw-in-view');
          }
        });
      }, { threshold: 0.18, rootMargin: '0px 0px -80px 0px' });

      root.querySelectorAll('[data-vw-feature]').forEach(function (el) {
        featureObserver.observe(el);
      });

      // Hand drawn oval path animation
      var ovalWrap = root.querySelector('[data-vw-oval]');
      if (ovalWrap) {
        var ovalObserver = new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              ovalWrap.classList.add('vw-drawn');
              obs.unobserve(ovalWrap);
            }
          });
        }, { threshold: 0.38 });
        ovalObserver.observe(ovalWrap);
      }

      // Stats counters animation
      var counterObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          if (el.dataset.vwCounted === '1') return;
          el.dataset.vwCounted = '1';

          var target = parseInt(el.dataset.target || '0', 10);
          var suffix = el.dataset.suffix || '';
          var duration = 1600;
          var start = performance.now();

          function render(now) {
            var progress = Math.min((now - start) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(eased * target);
            if (suffix === '-90s') {
              el.textContent = current + '-90s';
            } else {
              el.textContent = current + suffix;
            }
            if (progress < 1) {
              requestAnimationFrame(render);
            }
          }
          requestAnimationFrame(render);
          obs.unobserve(el);
        });
      }, { threshold: 0.5 });

      root.querySelectorAll('[data-vw-counter]').forEach(function (el) {
        counterObserver.observe(el);
      });

      // Autoplay videos when they scroll into viewport
      var videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;
          if (!video.getAttribute('src')) return;
          if (entry.isIntersecting) {
            tryPlayVideo(video);
          }
        });
      }, { threshold: 0.05 });

      root.querySelectorAll('video[data-vw-video]').forEach(function (video) {
        videoObserver.observe(video);
      });

    } else {
      // Fallback if IntersectionObserver is not supported
      root.querySelectorAll('.vw-reveal, .vw-reveal-stagger').forEach(function (el) { el.classList.add('vw-visible'); });
      root.querySelectorAll('.vw-accent-reveal, .vw-hero-accent-line').forEach(function (el) { el.classList.add('vw-animated'); });
      root.querySelectorAll('[data-vw-feature]').forEach(function (el) { el.classList.add('vw-in-view'); });
    }

    // FAQ Accordion click triggers
    root.querySelectorAll('.vw-faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.vw-faq-item');
        var wasActive = item.classList.contains('vw-active');
        root.querySelectorAll('.vw-faq-item').forEach(function (faq) {
          faq.classList.remove('vw-active');
          var q = faq.querySelector('.vw-faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!wasActive) {
          item.classList.add('vw-active');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Nav scrolled style toggling
    var nav = root.querySelector('[data-vw-nav]');
    function updateNav() {
      if (!nav) return;
      if (window.scrollY > 40) {
        nav.classList.add('vw-scrolled');
      } else {
        nav.classList.remove('vw-scrolled');
      }
    }
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });

    // Testimonial / Video Carousel on Mobile
    function initMobileCarousel() {
      var track = root.querySelector('.vw-video-track');
      var cards = root.querySelectorAll('.vw-vertical-card');
      if (!track || !cards.length) return;

      var active = 0;
      var timer;

      function updateCarousel() {
        cards.forEach(function (card, i) {
          card.classList.toggle('vw-active', i === active);
        });
      }

      function nextCard() {
        active = (active + 1) % cards.length;
        updateCarousel();
      }

      function startAutoplay() {
        clearInterval(timer);
        timer = setInterval(nextCard, 4500);
      }

      track.addEventListener('mouseenter', function () { clearInterval(timer); });
      track.addEventListener('mouseleave', startAutoplay);
      startAutoplay();
    }
    initMobileCarousel();

    // Dot Matrix Canvas Generator
    function createDotMatrix(canvas, section, revealFromCenter) {
      if (!canvas || !section) return;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;
      var GRID = 20;
      var DOT_R = 1.5;
      var ACCENT = [0, 152, 255];
      var dots = [];
      var time = 0;
      var raf;

      function hash(x, y) {
        return ((Math.sin(x * 127.1 + y * 311.7) * 43758.5453123) % 1 + 1) % 1;
      }

      function resize() {
        var dpr = window.devicePixelRatio || 1;
        var rect = section.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        dots = [];
        var cols = Math.ceil(rect.width / GRID) + 1;
        var rows = Math.ceil(rect.height / GRID) + 1;
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            dots.push({
              x: c * GRID + GRID / 2,
              y: r * GRID + GRID / 2,
              seed: hash(c, r),
              delay: hash(c + 0.5, r + 0.5)
            });
          }
        }
      }

      function draw() {
        var rect = section.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        time += 0.016;
        var cx = rect.width / 2;
        var cy = rect.height / 2;
        var maxDist = Math.sqrt(cx * cx + cy * cy) || 1;

        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          var flicker = Math.sin(time * 3.5 + d.seed * 50) * 0.5 + 0.5;
          var phase = Math.sin(time * 1.5 + d.delay * 12) * 0.5 + 0.5;
          var blink = Math.sin(time * 1.8 + d.seed * 100 + d.delay * 60);
          var blinkOn = blink > (d.seed > 0.7 ? -0.4 : 0.1) ? 1 : 0;
          var baseOpacity;
          
          if (d.seed > 0.85) {
            baseOpacity = (0.35 + flicker * 0.3) * blinkOn;
          } else if (d.seed > 0.6) {
            baseOpacity = (0.15 + phase * 0.15) * blinkOn;
          } else {
            baseOpacity = (0.04 + flicker * 0.06) * blinkOn;
          }
          
          var opacity = baseOpacity;
          
          if (revealFromCenter) {
            var dist = Math.sqrt(Math.pow(d.x - cx, 2) + Math.pow(d.y - cy, 2));
            var revealThreshold = (dist / maxDist) * 3 + d.delay * 0.8;
            var revealProgress = Math.max(0, Math.min(1, (time * 1.2 - revealThreshold)));
            opacity = baseOpacity * revealProgress;
          }
          
          if (opacity < 0.01) continue;
          
          var rgb = d.seed > 0.92 ? ACCENT : [255, 255, 255];
          ctx.beginPath();
          ctx.arc(d.x, d.y, DOT_R, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + opacity + ')';
          ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      }

      resize();
      draw();
      window.addEventListener('resize', resize);

      if ('IntersectionObserver' in window) {
        var active = true;
        var observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting && active) {
              cancelAnimationFrame(raf);
              active = false;
            } else if (entry.isIntersecting && !active) {
              active = true;
              draw();
            }
          });
        }, { threshold: 0 });
        observer.observe(section);
      }
    }

    createDotMatrix(root.querySelector('[data-vw-dot="hero"]'), root.querySelector('.vw-hero'), true);
    createDotMatrix(root.querySelector('[data-vw-dot="footer"]'), root.querySelector('.vw-globe-section'), false);

    // pricing tiers particles canvas
    root.querySelectorAll('.vw-tier-particles').forEach(function (canvas) {
      var ctx = canvas.getContext('2d');
      var tier = canvas.closest('.vw-tier');
      if (!ctx || !tier) return;

      var level = parseInt(canvas.getAttribute('data-vw-tier') || '1', 10);
      var count = 25 + level * 12;
      var sparks = [];
      var frame;
      var palette = {
        1: [[0, 152, 255], [77, 184, 255]],
        2: [[77, 184, 255], [179, 224, 255]],
        3: [[253, 224, 71], [77, 184, 255], [0, 152, 255]]
      };

      function resetSpark(s, w, h) {
        s.x = Math.random() * w;
        s.y = h + Math.random() * 20;
        s.vy = -(0.3 + Math.random() * 0.6) * (0.7 + level * 0.2);
        s.vx = (Math.random() - 0.5) * 0.4;
        s.size = 0.6 + Math.random() * 0.8;
        s.life = 0;
        s.maxLife = 120 + Math.random() * 100;
        s.wobbleSpeed = 1 + Math.random() * 2;
        s.wobbleAmp = 0.3 + Math.random() * 0.8;
        var cols = palette[level] || palette[1];
        s.color = cols[Math.floor(Math.random() * cols.length)];
      }

      function resizeTier() {
        var dpr = window.devicePixelRatio || 1;
        var rect = tier.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        sparks = [];
        for (var i = 0; i < count; i++) {
          var s = {};
          resetSpark(s, rect.width, rect.height);
          s.life = Math.random() * s.maxLife;
          sparks.push(s);
        }
      }

      function drawTier() {
        var rect = tier.getBoundingClientRect();
        var w = rect.width;
        var h = rect.height;
        ctx.clearRect(0, 0, w, h);
        for (var i = 0; i < sparks.length; i++) {
          var s = sparks[i];
          s.life++;
          if (s.life > s.maxLife || s.y < -10) {
            resetSpark(s, w, h);
          }
          s.y += s.vy;
          s.x += s.vx + Math.sin(s.life * 0.02 * s.wobbleSpeed) * s.wobbleAmp;
          var progress = s.life / s.maxLife;
          var alpha = progress < 0.1 ? progress / 0.1 : 1 - Math.pow((progress - 0.1) / 0.9, 2);
          var a = alpha * 0.6;
          if (a < 0.02) continue;
          
          var color = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (a * 0.08) + ')';
          ctx.fill();
          
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + a + ')';
          ctx.fill();
        }
        frame = requestAnimationFrame(drawTier);
      }

      resizeTier();
      drawTier();
      window.addEventListener('resize', resizeTier);

      if ('IntersectionObserver' in window) {
        var live = true;
        var obs = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting && live) {
              cancelAnimationFrame(frame);
              live = false;
            } else if (entry.isIntersecting && !live) {
              live = true;
              drawTier();
            }
          });
        }, { threshold: 0 });
        obs.observe(tier);
      }
    });

    // Custom Form Popup Modal interactive control
    var popupOverlay = document.getElementById('vw-form-popup');
    var popupCloseBtn = document.getElementById('vw-popup-close-btn');
    var modalForm = document.getElementById('vw-modal-form');

    function openPopupModal() {
      if (popupOverlay) {
        popupOverlay.classList.add('vw-active');
        document.body.style.overflow = 'hidden';
      }
    }

    function closePopupModal() {
      if (popupOverlay) {
        popupOverlay.classList.remove('vw-active');
        document.body.style.overflow = '';
        resetFormErrors();
      }
    }

    // Trigger popup modal when clicking any element with [data-vw-popup]
    document.querySelectorAll('[data-vw-popup]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        openPopupModal();
      });
    });

    // Close when close btn is clicked
    if (popupCloseBtn) {
      popupCloseBtn.addEventListener('click', closePopupModal);
    }

    // Close when overlay BG is clicked
    if (popupOverlay) {
      popupOverlay.addEventListener('click', function (e) {
        if (e.target === popupOverlay) {
          closePopupModal();
        }
      });
    }

    // Form inputs error states resets
    function resetFormErrors() {
      if (!modalForm) return;
      modalForm.querySelectorAll('.vw-form-group').forEach(function (group) {
        group.classList.remove('vw-invalid');
      });
      var errRadio = document.getElementById('err-radio');
      if (errRadio) errRadio.style.display = 'none';
    }

    // Modal Form submission validation and redirect action
    if (modalForm) {
      modalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        resetFormErrors();

        var isValid = true;

        // 1. Validate Radio Choice
        var radios = modalForm.querySelectorAll('input[name="qu_te_interesa_ms_ahora_mismo"]');
        var radioSelected = false;
        var selectedVal = '';
        radios.forEach(function (r) {
          if (r.checked) {
            radioSelected = true;
            selectedVal = r.value;
          }
        });
        if (!radioSelected) {
          var errRadio = document.getElementById('err-radio');
          if (errRadio) errRadio.style.display = 'block';
          isValid = false;
        }

        // 2. Validate Name
        var inputNombre = document.getElementById('vw-input-nombre');
        if (inputNombre && !inputNombre.value.trim()) {
          document.getElementById('group-nombre').classList.add('vw-invalid');
          isValid = false;
        }

        // 3. Validate Email
        var inputEmail = document.getElementById('vw-input-email');
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (inputEmail && (!inputEmail.value.trim() || !emailPattern.test(inputEmail.value.trim()))) {
          document.getElementById('group-email').classList.add('vw-invalid');
          isValid = false;
        }

        // 4. Validate Phone
        var inputPhone = document.getElementById('vw-input-phone');
        if (inputPhone && !inputPhone.value.trim()) {
          document.getElementById('group-phone').classList.add('vw-invalid');
          isValid = false;
        }

        // 5. Validate Consent Checkbox
        var inputTerms = document.getElementById('vw-input-terms');
        if (inputTerms && !inputTerms.checked) {
          inputTerms.style.outline = '2px solid #ef4444';
          setTimeout(function() { inputTerms.style.outline = ''; }, 2000);
          isValid = false;
        }

        if (!isValid) return;

        // Form valid! Store locally to simulate submission
        var submissionData = {
          qu_te_interesa_ms_ahora_mismo: selectedVal,
          nombre: inputNombre.value.trim(),
          correo_electronico: inputEmail.value.trim(),
          numero_de_telefono: document.getElementById('vw-phone-country').value + ' ' + inputPhone.value.trim(),
          timestamp: new Date().toISOString()
        };
        localStorage.setItem('pagurai_form_submission', JSON.stringify(submissionData));

        // Display success/loading state
        var submitBtn = modalForm.querySelector('.vw-popup-submit-btn');
        submitBtn.disabled = true;
        submitBtn.style.backgroundColor = '#0098FF';
        submitBtn.textContent = 'Enviando...';

        // Redirect based on selected option
        setTimeout(function () {
          if (selectedVal === 'Reducir costes de producción de mis anuncios') {
            window.location.href = 'https://artista.videway.com/metodo-richard';
          } else {
            window.location.href = 'https://artista.videway.com/video-acceso';
          }
        }, 1200);
      });
    }

  }

  // Run on page loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVidewayAcademy);
  } else {
    initVidewayAcademy();
  }
})();
