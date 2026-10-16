(function () {
  'use strict';

  // ---------- CONFIG ----------
  var WHATSAPP_NUMBER = '5511933401221';

  // ---------- ANO NO RODAPÉ ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- MENU MOBILE ----------
  var toggle = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- IMAGENS AUSENTES (placeholder) ----------
  document.querySelectorAll('.ph').forEach(function (frame) {
    var img = frame.querySelector('img');
    if (!img) return;
    function markMissing() { frame.classList.add('no-img'); }
    img.addEventListener('error', markMissing);
    if (img.complete && img.naturalWidth === 0) markMissing();
  });

  // ---------- LOGOS DE MARCAS AUSENTES ----------
  document.querySelectorAll('.brand-logo img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0) img.style.display = 'none';
  });

  // ---------- FAQ ----------
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.parentElement;
      var answer = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = null;
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        q.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ---------- COUNT-UP ----------
  function animateCount(el) {
    var target = parseInt(el.dataset.target, 10);
    var duration = 1600;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('pt-BR');
    }
    requestAnimationFrame(step);
  }
  var counts = document.querySelectorAll('.count');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); countObs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counts.forEach(function (el) { countObs.observe(el); });
  } else {
    counts.forEach(function (el) {
      el.textContent = parseInt(el.dataset.target, 10).toLocaleString('pt-BR');
    });
  }

  // ---------- SCROLL REVEAL ----------
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var sibs = Array.prototype.filter.call(e.target.parentElement.children, function (c) {
            return c.classList.contains('reveal');
          });
          e.target.style.transitionDelay = (sibs.indexOf(e.target) * 70) + 'ms';
          e.target.classList.add('visible');
          revObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revObs.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // ---------- COPIAR CUPOM ----------
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2200);
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var code = btn.dataset.copy;
      var original = btn.textContent;
      function done() {
        btn.textContent = 'Copiado ✓';
        btn.classList.add('copied');
        showToast('Cupom ' + code + ' copiado!');
        if (typeof gtag === 'function') gtag('event', 'copy_coupon', { coupon: code });
        setTimeout(function () { btn.textContent = original; btn.classList.remove('copied'); }, 2200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, function () { fallbackCopy(code); done(); });
      } else {
        fallbackCopy(code);
        done();
      }
    });
  });

  // ---------- FORMULÁRIO -> WHATSAPP ----------
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var nome = form.nome.value.trim();
      var empresa = form.empresa.value.trim();
      var contato = form.contato.value.trim();
      var formato = form.formato.value;
      var mensagem = form.mensagem.value.trim();

      var ok = true;
      [form.nome, form.empresa, form.contato].forEach(function (f) {
        var bad = !f.value.trim();
        f.classList.toggle('invalid', bad);
        if (bad) ok = false;
      });
      if (!ok) {
        status.style.color = '#ff7a6e';
        status.textContent = 'Preencha nome, marca e uma forma de contato.';
        return;
      }

      var lines = [
        'Olá Lucas! Vim pelo seu site e quero falar sobre uma parceria.',
        '',
        'Nome: ' + nome,
        'Marca/empresa: ' + empresa,
        'Contato: ' + contato
      ];
      if (formato) lines.push('Formato de interesse: ' + formato);
      if (mensagem) lines.push('Mensagem: ' + mensagem);

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
      status.style.color = '#FFA800';
      status.textContent = 'Abrindo o WhatsApp...';
      if (typeof gtag === 'function') gtag('event', 'generate_lead', { form_id: 'contact-form' });
      window.open(url, '_blank', 'noopener');
    });
    form.querySelectorAll('input').forEach(function (i) {
      i.addEventListener('input', function () { i.classList.remove('invalid'); });
    });
  }
})();
