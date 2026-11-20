/* =========================================================
   MATRIX CLIPPING — SCRIPT PRINCIPAL
   Fundo animado, painel 3D, degustação, preços, menu.
   Configurações em assets/js/config.js
   ========================================================= */

(function () {
  'use strict';

  var C = window.MC_CONFIG || {};
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: C.currency || 'BRL', maximumFractionDigits: 0 });
  var brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: C.currency || 'BRL', minimumFractionDigits: 2 });
  var num = new Intl.NumberFormat('pt-BR');
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, REDUCED ? 0 : ms); }); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function track(name, params) { try { if (typeof window.gtag === 'function') window.gtag('event', name, params || {}); } catch (e) {} }
  var SIGNUP = 'cadastro/index.html';

  // ---------------------------------------------------------
  // LINKS, MENU, CABEÇALHO, REVELAÇÃO
  // ---------------------------------------------------------
  function wireLinks() {
    var su = $('.header-actions .btn-primary');
    if (su) SIGNUP = su.getAttribute('href');
    $$('[data-email]').forEach(function (a) { a.href = 'mailto:' + C.email; a.textContent = C.email; });
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  }

  function wireMenu() {
    var btn = $('#menuToggle'), menu = $('#mobileNav');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open)); menu.hidden = open;
    });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { btn.setAttribute('aria-expanded', 'false'); menu.hidden = true; }); });
  }

  function wireHeader() {
    var h = $('.site-header'); if (!h) return;
    var on = function () { h.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', on, { passive: true }); on();
  }

  function wireReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || REDUCED) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: .05 });
    els.forEach(function (e) { io.observe(e); });
  }

  // ---------------------------------------------------------
  // FUNDO: rede de dados animada
  // ---------------------------------------------------------
  function wireCanvas() {
    var cv = $('#bgCanvas'); if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d'), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, pts = [], mouse = { x: -999, y: -999 }, running = true;

    function size() {
      var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(110, W * H / 14000));
      pts = [];
      for (var i = 0; i < n; i++) pts.push({ x: Math.random() * W, y: Math.random() * H, vx: .15 + Math.random() * .45, vy: (Math.random() - .5) * .12, r: Math.random() * 1.6 + .4, hot: Math.random() < .12 });
    }
    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x > W + 20) { p.x = -20; p.y = Math.random() * H; }
        if (p.y < -20 || p.y > H + 20) p.vy *= -1;
        for (var j = i + 1; j < pts.length; j++) {
          var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = dx * dx + dy * dy;
          if (d < 13000) {
            var a = (1 - d / 13000) * .22;
            ctx.strokeStyle = (p.hot || q.hot) ? 'rgba(255,90,10,' + a * 1.5 + ')' : 'rgba(40,50,75,' + a * .9 + ')';
            ctx.lineWidth = .7; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
          }
        }
        var md = (p.x - mouse.x) * (p.x - mouse.x) + (p.y - mouse.y) * (p.y - mouse.y);
        ctx.fillStyle = p.hot || md < 9000 ? 'rgba(255,90,10,.9)' : 'rgba(40,50,75,.35)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (md < 9000 ? 1 : 0), 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(frame);
    }
    size(); window.addEventListener('resize', size);
    cv.parentElement.addEventListener('mousemove', function (e) { var r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    document.addEventListener('visibilitychange', function () { running = !document.hidden; if (running) requestAnimationFrame(frame); });
    if (REDUCED) { frame(); running = false; } else requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------
  // PAINEL 3D: inclina com o mouse
  // ---------------------------------------------------------
  function wireTilt() {
    var stage = $('.stage'), sc = $('#scanner');
    if (!stage || !sc || REDUCED || window.matchMedia('(max-width: 1040px)').matches) return;
    var hero = $('.hero');
    hero.addEventListener('mousemove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - (r.left + r.width / 2)) / r.width;
      var y = (e.clientY - (r.top + r.height / 2)) / r.height;
      sc.style.transform = 'rotateY(' + (14 + x * 12).toFixed(2) + 'deg) rotateX(' + (6 - y * 10).toFixed(2) + 'deg)';
    });
    hero.addEventListener('mouseleave', function () { sc.style.transform = ''; });
  }

  // ---------------------------------------------------------
  // DEGUSTAÇÃO
  // ---------------------------------------------------------
  var SENT = { positivo: 'Positivo', negativo: 'Negativo', neutro: 'Neutro' };
  var busy = false;

  function setStatus(text, done) {
    var s = $('#scanStatus'); if (!s) return;
    s.classList.toggle('done', !!done);
    s.innerHTML = '<b class="pulse"></b>' + esc(text);
  }
  function row(field) { return $('.row[data-field="' + field + '"]'); }
  function setVal(field, html) {
    var r = row(field); if (!r) return;
    $$('.row').forEach(function (x) { x.classList.remove('active'); });
    r.classList.add('filled');
    $('dd', r).innerHTML = html;
  }
  async function typeVal(field, text, speed) {
    var r = row(field); if (!r) return;
    $$('.row').forEach(function (x) { x.classList.remove('active'); });
    r.classList.add('active', 'filled');
    var dd = $('dd', r); dd.textContent = ''; dd.classList.add('caret');
    if (REDUCED) { dd.textContent = text; dd.classList.remove('caret'); return; }
    var step = Math.max(1, Math.round(text.length / 40));
    for (var i = 0; i <= text.length; i += step) { dd.textContent = text.slice(0, i); await sleep(speed || 18); }
    dd.textContent = text; dd.classList.remove('caret');
  }
  async function countVal(field, to, fmt, ms) {
    var r = row(field); if (!r) return;
    $$('.row').forEach(function (x) { x.classList.remove('active'); });
    r.classList.add('active', 'filled');
    var dd = $('dd', r), t0 = performance.now(), dur = REDUCED ? 0 : (ms || 700);
    return new Promise(function (res) {
      function tick(t) {
        var k = dur ? Math.min(1, (t - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
        dd.innerHTML = '<span class="val-strong">' + esc(fmt(to * e)) + '</span>';
        if (k < 1) requestAnimationFrame(tick); else res();
      }
      requestAnimationFrame(tick);
    });
  }
  function resetPanel() {
    $$('.row').forEach(function (r) { r.classList.remove('filled', 'active'); $('dd', r).innerHTML = '<span class="sk"></span>'; });
    var shot = $('#shot'); shot.className = 'shot';
    $('#scanUrl').textContent = 'aguardando link…';
    setStatus('AGUARDANDO');
  }

  async function runDemo(d) {
    busy = true;
    resetPanel();
    var shot = $('#shot');
    $('#scanUrl').textContent = d.url || d.fonte || '';
    shot.classList.add('scanning');
    setStatus('LENDO A PÁGINA');                       await sleep(900);
    shot.classList.add('has-page');
    setStatus('EXTRAINDO DADOS');
    setVal('veiculo', esc(d.veiculo) + ' <span style="color:var(--muted)">· ' + esc(d.fonte || '') + '</span>');
    await sleep(250);
    await typeVal('titulo', d.titulo, 16);
    await typeVal('texto', d.texto.slice(0, 160) + '…', 8);
    setVal('data', esc(d.data));                       await sleep(250);
    setStatus('CAPTURANDO O PRINT');
    shot.classList.add('cropped');
    $('#shotCropLabel').textContent = d.larguraPx + ' × ' + d.alturaPx + ' px';
    await sleep(500);
    setStatus('MEDINDO A MATÉRIA');
    await countVal('medidas', 1, function (k) { return num.format(Math.round(d.larguraPx * k)) + ' × ' + num.format(Math.round(d.alturaPx * k)) + ' px'; }, 700);
    setVal('centimetragem', '<span class="val-strong">' + esc(d.centimetragem) + '</span>'); await sleep(250);
    setStatus('CALCULANDO O RETORNO');
    var valor = parseFloat(String(d.retornoMidia).replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    await countVal('retorno', valor, function (v) { return brl2.format(v); }, 900);
    setStatus('ANALISANDO O SENTIMENTO');                await sleep(500);
    var sent = (d.sentimento || 'neutro').toLowerCase();
    setVal('sentimento', '<span class="pill ' + esc(sent) + '">' + esc(SENT[sent] || sent) + '</span> <span style="color:var(--muted);font-size:12px">' + esc(Math.round((d.confianca || 0) * 100)) + '% de confiança</span>');
    shot.classList.remove('scanning');
    setStatus('CONCLUÍDO · ' + (d.tempo || ''), true);
    busy = false;
  }

  // Demonstração automática: roda, espera e recomeça sozinha.
  function wireAutoDemo() {
    var sc = $('#scanner');
    if (!sc || !C.demoExample) return;
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }, { threshold: .2 }).observe(sc);
    }
    var wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
    async function loop() {
      while (true) {
        if (!visible || document.hidden) { await wait(800); continue; }
        await runDemo(C.demoExample);
        await wait(REDUCED ? 8000 : 3800);
      }
    }
    setTimeout(loop, REDUCED ? 0 : 700);
  }

  // Formulário do topo: leva para a página de processamento.
  function wireProbe() {
    var form = $('#demoForm'); if (!form) return;
    var input = $('#demoUrl');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = (input.value || '').trim();
      if (!/^https?:\/\/[^\s.]+\.[^\s]+/i.test(url)) {
        input.setCustomValidity(url ? 'Cole um link completo, começando com https://' : 'Cole o link da matéria.');
        input.reportValidity(); return;
      }
      input.setCustomValidity('');
      track('processar_envio', { origem: 'home' });
      window.location.href = form.getAttribute('action') + '?url=' + encodeURIComponent(url);
    });
    input.addEventListener('input', function () { input.setCustomValidity(''); });
  }

  // ---------------------------------------------------------
  // PREÇOS
  // ---------------------------------------------------------
  var billing = 'monthly';
  function planPrice(p) { return billing === 'annual' ? Math.round(p.monthly * (1 - (C.annualDiscount || 0))) : p.monthly; }

  function renderPlans() {
    var box = $('#plans'); if (!box || !C.plans) return;
    box.innerHTML = C.plans.map(function (p) {
      var price = planPrice(p);
      var sub = billing === 'annual' ? 'cobrado anualmente: ' + brl.format(price * 12) + '/ano' : 'cobrança mensal, cancele quando quiser';
      var href = p.contact
        ? 'mailto:' + C.email + '?subject=' + encodeURIComponent('Plano ' + p.name + ' - Matrix Clipping')
        : SIGNUP + '?plano=' + encodeURIComponent(p.id);
      var ext = '';
      return '<article class="plan' + (p.highlight ? ' highlight' : '') + '">' +
        (p.badge ? '<span class="badge">' + esc(p.badge) + '</span>' : '') +
        '<h3>' + esc(p.name) + '</h3><p class="tagline">' + esc(p.tagline) + '</p>' +
        '<div class="price"><strong>' + esc(brl.format(price)) + '</strong><span>/mês</span></div>' +
        '<p class="price-sub">' + esc(sub) + '</p>' +
        '<div class="plan-facts"><div><small>Links/mês</small><b>' + esc(num.format(p.links)) + '</b></div><div><small>Usuários</small><b>' + esc(p.users ? p.users : 'Ilimitados') + '</b></div></div>' +
        '<ul>' + p.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>' +
        '<a class="btn ' + (p.highlight ? 'btn-primary' : 'btn-dark') + ' btn-block" data-plan="' + esc(p.id) + '" href="' + esc(href) + '"' + ext + '>' + esc(p.cta) + '</a>' +
        '<p class="extra">link adicional ' + esc(brl2.format(p.extraLink)) + ' · ≈ ' + esc(brl2.format(price / p.links)) + '/link</p>' +
        '</article>';
    }).join('');
    $$('[data-plan]', box).forEach(function (a) { a.addEventListener('click', function () { track('plano_click', { plano: a.getAttribute('data-plan'), cobranca: billing }); }); });
  }
  function wireBilling() {
    var buttons = $$('[data-billing]'); if (!buttons.length) return;
    $$('[data-discount]').forEach(function (el) { el.textContent = '−' + Math.round((C.annualDiscount || 0) * 100) + '%'; });
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        billing = b.getAttribute('data-billing');
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        renderPlans(); track('cobranca_toggle', { cobranca: billing });
      });
    });
  }
  function renderComparison() {
    var table = $('#compareTable'); if (!table || !C.comparison) return;
    var head = '<thead><tr><th scope="col">Recurso</th>' + C.plans.map(function (p) { return '<th scope="col"' + (p.highlight ? ' class="hl"' : '') + '>' + esc(p.name) + '</th>'; }).join('') + '</tr></thead>';
    var body = '<tbody>' + C.comparison.map(function (row) {
      if (row.group) return '<tr class="group"><td colspan="' + (C.plans.length + 1) + '">' + esc(row.group) + '</td></tr>';
      return '<tr><td>' + esc(row.label) + '</td>' + row.values.map(function (v) {
        if (v === true) return '<td><span class="yes" aria-label="Incluído">✓</span></td>';
        if (v === false) return '<td><span class="no" aria-label="Não incluído">—</span></td>';
        return '<td>' + esc(v) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
    table.innerHTML = head + body;
  }

  window.MC = { esc: esc, brl2: brl2, num: num, track: track, sleep: sleep, REDUCED: REDUCED };

  document.addEventListener('DOMContentLoaded', function () {
    wireLinks(); wireMenu(); wireHeader(); wireReveal();
    wireCanvas(); wireTilt(); wireAutoDemo(); wireProbe();
    renderPlans(); wireBilling(); renderComparison();
  });
})();
