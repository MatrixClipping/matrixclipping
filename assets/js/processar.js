/* =========================================================
   MATRIX CLIPPING — PÁGINA "PROCESSAR MATÉRIA"
   Com apiBase = null (config.js): modo demonstração.
   Com apiBase preenchido: usa a API (contrato em docs/API.md).
   ========================================================= */

(function () {
  'use strict';

  var C = window.MC_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var STEPS = ['fila', 'leitura', 'extracao', 'print', 'medidas', 'retorno', 'sentimento', 'veiculo'];
  var SENT = { positivo: 'Positivo', negativo: 'Negativo', neutro: 'Neutro' };
  var lastResult = null, running = false;

  function U() { return window.MC || {}; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, U().REDUCED ? 0 : ms); }); }

  // ---------------------------------------------------------
  // ETAPAS
  // ---------------------------------------------------------
  function setStep(key, state, info) {
    var li = $('#steps li[data-step="' + key + '"]'); if (!li) return;
    li.className = state;                      // '', 'run', 'ok', 'err'
    $('.t', li).textContent = info || '';
  }
  function resetSteps() { STEPS.forEach(function (k) { setStep(k, '', ''); }); }

  // ---------------------------------------------------------
  // RESULTADO
  // ---------------------------------------------------------
  function render(d) {
    var num = U().num || new Intl.NumberFormat('pt-BR');
    lastResult = d;
    $('#emptyState').hidden = true;
    $('#resultContent').hidden = false;
    $('#rVeiculo').textContent = (d.veiculo || '') + (d.fonte ? ' · ' + d.fonte : '');
    $('#rTitulo').textContent = d.titulo || '';
    $('#rMeta').textContent = [d.data, d.secao, d.autor ? 'Por ' + d.autor : ''].filter(Boolean).join(' · ');
    var s = (d.sentimento || 'neutro').toLowerCase();
    var pill = $('#rSent'); pill.className = 'pill ' + s; pill.textContent = SENT[s] || s;
    $('#rRetorno').textContent = d.retornoMidia || '—';
    $('#rCm').textContent = d.centimetragem || '—';
    $('#rPx').textContent = num.format(d.larguraPx || 0) + ' × ' + num.format(d.alturaPx || 0) + ' px';
    $('#rDims').textContent = 'Print recortado · ' + (d.larguraPx || 0) + ' × ' + (d.alturaPx || 0) + ' px';
    $('#rConf').textContent = Math.round((d.confianca || 0) * 100) + '%';
    $('#rTexto').textContent = d.texto || '';
    $('#rJust').textContent = d.justificativa || '';
    var m = d.metricas || (C.demoExample && C.demoExample.metricas) || [];
    $('#rMetricas').innerHTML = m.map(function (p) {
      var e = U().esc || String;
      return '<div class="metric"><small>' + e(p[0]) + '</small><b>' + e(p[1]) + '</b></div>';
    }).join('');
  }

  // ---------------------------------------------------------
  // MODO DEMONSTRAÇÃO
  // ---------------------------------------------------------
  async function runDemo(url) {
    var times = [400, 900, 800, 900, 500, 600, 700, 600];
    $('#jobMeta').textContent = 'Link: ' + url.replace(/^https?:\/\//, '');
    for (var i = 0; i < STEPS.length; i++) {
      setStep(STEPS[i], 'run', 'processando…');
      await wait(times[i]);
      setStep(STEPS[i], 'ok', (times[i] / 1000).toFixed(1).replace('.', ',') + ' s');
    }
    $('#demoBanner').hidden = false;
    render(C.demoExample);
  }

  // ---------------------------------------------------------
  // MODO API (ver docs/API.md)
  // ---------------------------------------------------------
  async function runApi(url, cliente) {
    var base = C.apiBase.replace(/\/$/, '');
    setStep('fila', 'run', 'enviando…');
    var r = await fetch(base + '/v1/materias', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: url, cliente: cliente || null })
    });
    if (!r.ok) throw new Error('Envio recusado (HTTP ' + r.status + ')');
    var job = await r.json();
    $('#jobMeta').textContent = 'Job ' + job.id;
    while (true) {
      await wait(1000);
      var s = await fetch(base + '/v1/materias/' + encodeURIComponent(job.id), { credentials: 'include' });
      if (!s.ok) throw new Error('Consulta falhou (HTTP ' + s.status + ')');
      var j = await s.json();
      (j.etapas || []).forEach(function (e) {
        var st = e.status === 'concluida' ? 'ok' : e.status === 'executando' ? 'run' : e.status === 'erro' ? 'err' : '';
        setStep(e.id, st, e.duracao_ms ? (e.duracao_ms / 1000).toFixed(1).replace('.', ',') + ' s' : (st === 'run' ? 'processando…' : ''));
      });
      if (j.status === 'concluido') { render(j.resultado); return; }
      if (j.status === 'erro') throw new Error(j.erro || 'Não foi possível processar este link.');
    }
  }

  // ---------------------------------------------------------
  async function start(url, cliente) {
    if (running) return;
    running = true;
    resetSteps();
    $('#demoBanner').hidden = true;
    $('#resultContent').hidden = true;
    $('#emptyState').hidden = false;
    $('#emptyState p').innerHTML = 'Processando…';
    if (U().track) U().track('processar_inicio', { modo: C.apiBase ? 'api' : 'demo' });
    try {
      if (C.apiBase) await runApi(url, cliente);
      else await runDemo(url);
    } catch (err) {
      $('#emptyState p').textContent = err.message;
      STEPS.forEach(function (k) { var li = $('#steps li[data-step="' + k + '"]'); if (li && li.className === 'run') setStep(k, 'err', 'erro'); });
    }
    running = false;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var form = $('#procForm'); if (!form) return;
    var input = $('#procUrl');
    $('#modeBadge').textContent = C.apiBase ? 'Conectado' : 'Modo demonstração';
    $('#modeBadge').classList.toggle('live', !!C.apiBase);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var url = (input.value || '').trim();
      if (!/^https?:\/\/[^\s.]+\.[^\s]+/i.test(url)) {
        input.setCustomValidity('Cole um link completo, começando com https://'); input.reportValidity(); return;
      }
      input.setCustomValidity('');
      history.replaceState(null, '', '?url=' + encodeURIComponent(url));
      start(url, $('#procCliente').value.trim());
    });
    input.addEventListener('input', function () { input.setCustomValidity(''); });

    $('#copyJson').addEventListener('click', function () {
      if (!lastResult) return;
      var txt = JSON.stringify(lastResult, null, 2), b = this;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject())
        .then(function () { b.textContent = 'JSON copiado ✓'; setTimeout(function () { b.textContent = 'Copiar JSON'; }, 1800); })
        .catch(function () { b.textContent = 'Não foi possível copiar'; });
    });

    var q = new URLSearchParams(location.search).get('url');
    if (q) { input.value = q; start(q, ''); }
    else input.focus();
  });
})();
