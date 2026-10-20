/* Erivelto Santos · hero com vídeo contínuo e janela de contato.
   Vídeo sem som, em loop; com movimento reduzido ou economia de dados fica só a foto de capa. */
(() => {
  'use strict';
  const d = document;
  // Preencher com o número real (só dígitos, com 55 e DDD), ex.: '5551999999999'. Vazio = botão avisa que ainda não está ligado.
  const WHATS = '';

  initHero();
  initConversa();

  const topo = d.getElementById('topo'), hero = d.querySelector('.hero__palco');
  if (topo && hero) new IntersectionObserver(es => topo.classList.toggle('is-solido', !es[0].isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(hero);

  function initHero() {
    const sec = d.querySelector('.hero'), v = d.querySelector('.hero__video'), bt = d.querySelector('.hero__pausa');
    if (!sec || !v) return;
    const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const poucoDado = navigator.connection && (navigator.connection.saveData || /(^|-)2g$/.test(navigator.connection.effectiveType || ''));
    if (reduzir || poucoDado) { v.remove(); return; }
    const ic = bt && bt.querySelector('use');
    const rotulo = tocando => { if (!bt) return; bt.setAttribute('aria-pressed', tocando ? 'false' : 'true'); bt.setAttribute('aria-label', tocando ? 'Pausar vídeo' : 'Tocar vídeo'); ic.setAttribute('href', tocando ? '#i-pause' : '#i-play'); };
    v.addEventListener('playing', () => { sec.classList.add('is-tocando'); if (bt) bt.hidden = false; rotulo(true); });
    const tentar = () => { const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    tentar();
    if (bt) bt.addEventListener('click', () => { if (v.paused) { tentar(); rotulo(true); } else { v.pause(); rotulo(false); } });
    // só toca com o hero na tela (poupa bateria)
    new IntersectionObserver(es => { if (bt && bt.getAttribute('aria-pressed') === 'true') return; es[0].isIntersecting ? tentar() : v.pause(); }, { threshold: .1 }).observe(sec);
  }

  function initConversa() {
    const dlg = d.getElementById('conversa'); if (!dlg) return;
    const form = dlg.querySelector('form'), interesse = dlg.querySelector('.conversa__interesse');
    let origem = null, imovel = '';
    const campos = { nome: form.nome, tel: form.tel };
    const marca = (el, ruim) => { const c = el.closest('.campo'), m = c.querySelector('.campo__msg'); c.classList.toggle('is-erro', ruim); m.hidden = !ruim; el.setAttribute('aria-invalid', ruim ? 'true' : 'false'); };
    const digitos = v => v.replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
    const nomeOk = v => v.trim().replace(/[^\p{L}]/gu, '').length >= 2;
    const telOk = v => { const n = digitos(v); return n.length === 10 || (n.length === 11 && n[2] === '9'); };
    const limpa = () => Object.values(campos).forEach(el => marca(el, false));
    const abrir = (b, casa) => {
      origem = b; imovel = casa || ''; limpa();
      interesse.hidden = !imovel; interesse.textContent = imovel ? 'Imóvel: ' + imovel : '';
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      d.documentElement.style.overflow = 'hidden';
    };
    d.querySelectorAll('[data-abrir-conversa]').forEach(b => b.addEventListener('click', () => abrir(b, '')));
    d.querySelectorAll('[data-interesse]').forEach(b => b.addEventListener('click', () => abrir(b, b.dataset.interesse)));
    const fechar = () => { dlg.close ? dlg.close() : dlg.removeAttribute('open'); };
    dlg.addEventListener('close', () => { d.documentElement.style.overflow = ''; origem && origem.focus(); });
    dlg.querySelector('[data-fechar]').addEventListener('click', fechar);
    dlg.addEventListener('click', e => { if (e.target === dlg) fechar(); });
    form.tel.addEventListener('input', () => {
      const n = digitos(form.tel.value).slice(0, 11);
      form.tel.value = n.length > 6 ? `(${n.slice(0, 2)}) ${n.slice(2, n.length - 4)}-${n.slice(-4)}` : n.length > 2 ? `(${n.slice(0, 2)}) ${n.slice(2)}` : n;
      if (form.tel.closest('.campo').classList.contains('is-erro') && telOk(form.tel.value)) marca(form.tel, false);
    });
    form.nome.addEventListener('input', () => { if (form.nome.closest('.campo').classList.contains('is-erro') && nomeOk(form.nome.value)) marca(form.nome, false); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const rn = !nomeOk(form.nome.value), rt = !telOk(form.tel.value);
      marca(form.nome, rn); marca(form.tel, rt);
      if (rn || rt) { (rn ? form.nome : form.tel).focus(); return; }
      const tipo = form.querySelector('input[name=tipo]:checked').value;
      const msg = `Olá, Erivelto! Meu nome é ${form.nome.value.trim()}. Quero ${tipo.toLowerCase()}.` + (imovel ? ` Imóvel: ${imovel}.` : '') + ` Meu WhatsApp: ${form.tel.value}.`;
      fechar(); form.reset(); limpa();
      if (WHATS) window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
      else window.Arcane && Arcane.toast('Pedido recebido na tela. O WhatsApp do Erivelto ainda será ligado neste botão.', { tipo: 'info' });
    });
    d.querySelectorAll('[data-whats]').forEach(b => b.addEventListener('click', () => {
      if (WHATS) window.open(`https://wa.me/${WHATS}?text=${encodeURIComponent('Olá, Erivelto! Vim pelo seu site.')}`, '_blank', 'noopener');
      else window.Arcane && Arcane.toast('O WhatsApp do Erivelto ainda será ligado neste botão.', { tipo: 'info' });
    }));
  }
})();
