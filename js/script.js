(function () {
  'use strict';

  // ---------- CONFIG ----------
  var WHATSAPP_NUMBER = '5511933401221';

  var root = document.documentElement;
  var data = window.SITE_DATA || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasObserver = 'IntersectionObserver' in window;

  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  function create(tag, props) {
    var el = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) { el[k] = props[k]; });
    return el;
  }

  function externalLink(url, className, text) {
    return create('a', { href: url, className: className, textContent: text || '', target: '_blank', rel: 'noopener' });
  }

  function isSafeUrl(url) { return /^https:\/\//i.test(url || ''); }

  // ---------- ANO NO RODAPÉ ----------
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- MENU MOBILE ----------
  var toggle = document.getElementById('menu-toggle');
  var navLinks = document.getElementById('nav-links');
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () { setMenu(!navLinks.classList.contains('open')); });
    navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 940 && navLinks.classList.contains('open')) setMenu(false);
    });
  }

  // ---------- SEÇÃO ATUAL NO MENU ----------
  if (hasObserver && navLinks) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.querySelectorAll('a:not(.btn)').forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
  }

  // ---------- PORTFÓLIO: VÍDEOS (js/dados.js) ----------
  var videoBox = document.getElementById('videos');
  (data.videos || []).forEach(function (v) {
    if (!videoBox || !isSafeUrl(v.url) || !v.miniatura) return;
    var card = externalLink(v.url, 'video');
    card.appendChild(create('img', { src: v.miniatura, alt: '', loading: 'lazy', decoding: 'async' }));
    var body = create('span', { className: 'work-body' });
    body.appendChild(create('em', { textContent: v.categoria || '' }));
    body.appendChild(create('strong', { textContent: v.titulo || 'Vídeo' }));
    body.appendChild(create('em', { textContent: 'Assistir no ' + (v.plataforma || 'site original') + ' ↗' }));
    card.appendChild(body);
    videoBox.appendChild(card);
    videoBox.hidden = false;
  });

  // ---------- MARCAS: FOTOS, LINKS E RESULTADOS (js/dados.js) ----------
  document.querySelectorAll('[data-brand]').forEach(function (card) {
    var info = (data.marcas || {})[card.dataset.brand];
    var box = card.querySelector('.brand-extra');
    if (!info || !box) return;
    var photos = (info.fotos || []).filter(function (p) { return p.src; });
    if (photos.length) {
      var gallery = create('div', { className: 'gallery' });
      photos.forEach(function (p) {
        gallery.appendChild(create('img', { src: p.src, alt: p.alt || '', loading: 'lazy', decoding: 'async' }));
      });
      box.appendChild(gallery);
    }
    if (info.resultados) box.appendChild(create('p', { className: 'results', textContent: info.resultados }));
    (info.links || []).forEach(function (l) {
      if (isSafeUrl(l.url)) box.appendChild(externalLink(l.url, 'text-link', (l.texto || 'Ver publicação') + ' ↗'));
    });
    box.hidden = !box.children.length;
  });

  // ---------- ANIMAÇÕES ----------
  // O valor real já está no HTML: sem JavaScript (ou antes da animação) nunca aparece zero.
  function formatValue(n, shortStyle) {
    if (shortStyle) {
      return (Math.floor(n / 100) / 10).toLocaleString('pt-BR', { minimumFractionDigits: 1 }) + ' mil';
    }
    return Math.round(n).toLocaleString('pt-BR');
  }
  function animateCount(el) {
    var target = Number(el.dataset.value);
    var finalText = el.dataset.short;
    if (!target || !finalText) return;
    var shortStyle = finalText.indexOf('mil') !== -1;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / 1200, 1);
      if (p < 1) {
        // começa em 60% do valor para nunca exibir um número próximo de zero
        el.textContent = formatValue(target * (0.6 + 0.4 * (1 - Math.pow(1 - p, 3))), shortStyle);
        requestAnimationFrame(step);
      } else {
        el.textContent = finalText;
      }
    }
    requestAnimationFrame(step);
  }

  function observeOnce(selector, threshold, callback) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { callback(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: threshold });
    document.querySelectorAll(selector).forEach(function (el) { obs.observe(el); });
  }

  if (hasObserver && !reduceMotion) {
    observeOnce('.reveal', 0.08, function (el) { el.classList.add('visible'); });
    observeOnce('.count', 0.6, animateCount);
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  // ---------- COPIAR CUPOM ----------
  var toast = document.getElementById('toast');
  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('show'); }, 2600);
  }
  function fallbackCopy(text) {
    var ta = create('textarea', { value: text });
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    return ok;
  }
  document.querySelectorAll('.copy-btn').forEach(function (btn) {
    var original = btn.textContent;
    var timer;
    btn.addEventListener('click', function () {
      var code = btn.dataset.copy;
      function done() {
        btn.textContent = 'Copiado ✓';
        btn.classList.add('copied');
        showToast('Cupom ' + code + ' copiado!');
        track('copy_coupon', { coupon: code });
        clearTimeout(timer);
        timer = setTimeout(function () { btn.textContent = original; btn.classList.remove('copied'); }, 2200);
      }
      function fallback() {
        if (fallbackCopy(code)) done();
        else showToast('Não foi possível copiar. Cupom: ' + code);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  // ---------- CLIQUES NO WHATSAPP ----------
  document.querySelectorAll('[data-lead]').forEach(function (a) {
    a.addEventListener('click', function () { track('generate_lead', { form_id: a.dataset.lead }); });
  });

  // ---------- BOTÃO FLUTUANTE: some no topo e no contato para não cobrir botões ----------
  var floating = document.querySelector('.whatsapp-float');
  if (hasObserver && floating) {
    var covering = {};
    var floatObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { covering[entry.target.id] = entry.isIntersecting; });
      floating.classList.toggle('is-hidden', Boolean(covering.inicio || covering.contato));
    }, { rootMargin: '-35% 0px -35% 0px' });
    ['inicio', 'contato'].forEach(function (id) {
      var section = document.getElementById(id);
      if (section) floatObs.observe(section);
    });
  }

  // ---------- FORMULÁRIO -> WHATSAPP ----------
  var form = document.getElementById('contact-form');
  if (!form) return;
  var fields = form.elements;
  var status = document.getElementById('form-status');

  // botões dos cards já preenchem o formulário
  document.querySelectorAll('[data-format]').forEach(function (a) {
    a.addEventListener('click', function () { fields.formato.value = a.dataset.format; });
  });
  document.querySelectorAll('[data-message]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!fields.mensagem.value.trim()) fields.mensagem.value = a.dataset.message;
    });
  });

  function value(name) { return fields[name].value.trim(); }

  function validate() {
    var errors = [];
    var invalid = [];
    function fail(names, message) {
      errors.push(message);
      names.forEach(function (n) { invalid.push(fields[n]); });
    }
    if (!value('nome')) fail(['nome'], 'Informe seu nome.');
    if (!value('empresa')) fail(['empresa'], 'Informe a empresa ou marca.');
    var email = value('email');
    var phone = value('whatsapp');
    if (!email && !phone) fail(['email', 'whatsapp'], 'Informe um e-mail ou WhatsApp.');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(['email'], 'Confira o e-mail.');
    var digits = phone.replace(/\D/g, '').length;
    if (phone && (digits < 10 || digits > 15)) fail(['whatsapp'], 'Confira o WhatsApp (com DDD).');
    return { errors: errors, invalid: invalid };
  }

  form.addEventListener('input', function (e) { e.target.removeAttribute('aria-invalid'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    Array.prototype.forEach.call(fields, function (f) { f.removeAttribute('aria-invalid'); });
    var result = validate();
    status.className = '';
    status.textContent = '';
    if (result.errors.length) {
      status.className = 'error';
      status.textContent = result.errors.join(' ');
      result.invalid.forEach(function (f) { f.setAttribute('aria-invalid', 'true'); });
      result.invalid[0].focus();
      return;
    }

    var lines = ['Olá Lucas! Vim pelo seu site e quero uma proposta comercial.', ''];
    [
      ['Nome', 'nome'],
      ['Marca/empresa', 'empresa'],
      ['E-mail', 'email'],
      ['WhatsApp', 'whatsapp'],
      ['Tipo de parceria', 'formato'],
      ['Orçamento estimado', 'orcamento'],
      ['Data/período', 'periodo'],
      ['Mensagem', 'mensagem']
    ].forEach(function (item) {
      if (value(item[1])) lines.push(item[0] + ': ' + value(item[1]));
    });

    var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    track('generate_lead', { form_id: 'contact-form' });
    window.open(url, '_blank', 'noopener');

    // link de reserva caso o navegador bloqueie a nova aba
    status.textContent = 'Abrindo o WhatsApp... Não abriu? ';
    status.appendChild(externalLink(url, '', 'Toque aqui para enviar'));
  });
})();
