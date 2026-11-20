/* =========================================================
   MATRIX CLIPPING — CADASTRO E LOGIN
   Com apiBase = null: nada é enviado; mostra aviso de lançamento.
   Com apiBase: POST /v1/auth/cadastro e /v1/auth/login (docs/API.md).
   ========================================================= */

(function () {
  'use strict';

  var C = window.MC_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };

  function msg(el, text, ok) { el.textContent = text; el.className = 'form-msg ' + (ok ? 'ok' : 'err'); }

  function fieldsOk(form, out) {
    var bad = Array.prototype.find.call(form.elements, function (el) { return el.willValidate && !el.checkValidity(); });
    if (bad) { bad.reportValidity(); msg(out, 'Confira os campos destacados.', false); return false; }
    return true;
  }

  async function post(path, data) {
    var r = await fetch(C.apiBase.replace(/\/$/, '') + path, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
    });
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(j.erro || 'Não foi possível concluir agora.');
    return j;
  }

  function wireSignup() {
    var form = $('#signupForm'); if (!form) return;
    var out = $('#signupMsg');
    var plano = new URLSearchParams(location.search).get('plano');
    if (plano && form.plano) form.plano.value = plano;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!fieldsOk(form, out)) return;
      if (form.senha.value !== form.senha2.value) { form.senha2.focus(); msg(out, 'As senhas não conferem.', false); return; }
      var data = { nome: form.nome.value.trim(), empresa: form.empresa.value.trim(), email: form.email.value.trim(), senha: form.senha.value, plano: form.plano.value };
      if (!C.apiBase) {
        msg(out, 'Tudo certo com os dados. O cadastro será ativado no lançamento da plataforma; nada foi enviado ainda.', true);
        return;
      }
      try { await post('/v1/auth/cadastro', data); msg(out, 'Conta criada! Verifique o seu e-mail para ativar o acesso.', true); form.reset(); }
      catch (err) { msg(out, err.message, false); }
    });
  }

  function wireLogin() {
    var form = $('#loginForm'); if (!form) return;
    var out = $('#loginMsg');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!fieldsOk(form, out)) return;
      if (!C.apiBase) { msg(out, 'O acesso será liberado no lançamento da plataforma.', true); return; }
      try {
        await post('/v1/auth/login', { email: form.email.value.trim(), senha: form.senha.value, lembrar: form.lembrar.checked });
        window.location.href = '../processar/index.html';
      } catch (err) { msg(out, err.message, false); }
    });
    var forgot = $('#forgotLink');
    if (forgot) forgot.addEventListener('click', function (e) {
      e.preventDefault();
      msg(out, C.apiBase ? 'Informe o e-mail acima: enviaremos um link para criar uma nova senha.' : 'A recuperação de senha será liberada no lançamento.', true);
    });
  }

  document.addEventListener('DOMContentLoaded', function () { wireSignup(); wireLogin(); });
})();
