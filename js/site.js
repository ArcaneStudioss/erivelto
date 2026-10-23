/* Olavo Taygoro e Aline Santiago · hero com o tour em vídeo e janela de contato.
   Vídeo sem som, em laço; com movimento reduzido ou economia de dados fica só a foto de capa. */
(() => {
  'use strict';
  const d = document;
  // Preencher com o número real (só dígitos, com 55 e DDD), ex.: '5551999999999'. Vazio = botão avisa que ainda não está ligado.
  // Olavo ainda sem número: enquanto estiver vazio, tudo vai para a Aline e a janela esconde a escolha "Falar com".
  const PESSOAS = { olavo: { nome: 'Olavo', num: '' }, aline: { nome: 'Aline', num: '5521974323367' } };
  const comNumero = () => Object.keys(PESSOAS).filter(k => PESSOAS[k].num);
  const abreZap = (chave, texto) => { const p = PESSOAS[chave]; if (p && p.num) window.open(`https://wa.me/${p.num}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener'); };

  initHero();
  initConversa();
  // botões de WhatsApp direto (também na página de obrigado, que não tem a janela)
  d.querySelectorAll('[data-whats]').forEach(b => b.addEventListener('click', () => {
    const chave = b.dataset.com || comNumero()[0], p = PESSOAS[chave];
    if (p && p.num) abreZap(chave, `Olá, ${p.nome}! Vim pelo site de vocês.`);
    else window.Arcane && Arcane.toast(`O WhatsApp ${p ? 'do ' + p.nome + ' ' : ''}ainda será ligado neste botão.`, { tipo: 'info' });
  }));

  const topo = d.getElementById('topo'), hero = d.querySelector('.hero');
  if (topo && hero) new IntersectionObserver(es => topo.classList.toggle('is-solido', !es[0].isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(hero);

  // botão de WhatsApp no canto: aparece depois que o hero sai da tela
  const zaps = d.querySelector('.zaps'), heroSec = d.querySelector('.hero');
  if (zaps && heroSec) new IntersectionObserver(es => { const fora = !es[0].isIntersecting; zaps.classList.toggle('is-on', fora); zaps.setAttribute('aria-hidden', fora ? 'false' : 'true'); zaps.querySelectorAll('.zap').forEach(z => { z.tabIndex = fora ? 0 : -1; }); }, { threshold: .05 }).observe(heroSec);

  // links de âncora: rolagem suave só no clique (nada de scroll-behavior global, que faz a página "voltar sozinha" no celular)
  const sem = matchMedia('(prefers-reduced-motion: reduce)').matches;
  d.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const alvo = a.getAttribute('href').length > 1 && d.querySelector(a.getAttribute('href'));
    if (!alvo) return;
    e.preventDefault(); alvo.scrollIntoView({ behavior: sem ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', a.getAttribute('href'));
  }));

  function initHero() {
    const sec = d.querySelector('.hero'), v = d.querySelector('.hero__video'), bt = d.querySelector('.hero__pausa');
    if (!sec || !v) return;
    const reduzir = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conexao = navigator.connection || {};
    const poucoDado = conexao.saveData || /(^|-)(2g|3g)$/.test(conexao.effectiveType || '');
    if (reduzir || poucoDado || !window.fetch || !window.URL) { v.remove(); return; }
    // Trecho de 19 s do tour do Olavo, em laço contínuo (o fim se funde com o começo).
    // Para nunca travar: baixa o arquivo INTEIRO (2,4 MB) antes de tocar e toca da memória.
    // Enquanto isso, e se algo falhar ou engasgar, fica a foto de capa (mesmo quadro do começo do vídeo).
    const ic = bt && bt.querySelector('use');
    let pronto = false, pausaManual = false, naTela = true;
    const rotulo = tocando => {
      if (!bt) return;
      bt.setAttribute('aria-pressed', tocando ? 'false' : 'true');
      bt.setAttribute('aria-label', tocando ? 'Pausar vídeo' : 'Tocar vídeo');
      ic.setAttribute('href', tocando ? '#i-pause' : '#i-play');
    };
    const tentar = () => { if (!pronto || pausaManual || !naTela || d.hidden) return; const p = v.play(); if (p && p.catch) p.catch(() => {}); };
    v.addEventListener('playing', () => { sec.classList.add('is-tocando'); if (bt) bt.hidden = false; rotulo(true); });
    v.addEventListener('waiting', () => sec.classList.remove('is-tocando')); // engasgou: mostra a capa em vez do quadro parado
    v.addEventListener('error', () => { sec.classList.remove('is-tocando'); if (bt) bt.hidden = true; });
    const ctrl = 'AbortController' in window ? new AbortController() : null;
    const limite = setTimeout(() => ctrl && ctrl.abort(), 15000); // rede lenta demais: desiste e fica a foto
    fetch('video/hero.mp4?v=3', { signal: ctrl && ctrl.signal, priority: 'low' })
      .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(b => {
        clearTimeout(limite);
        v.src = URL.createObjectURL(b);
        v.addEventListener('canplaythrough', () => { pronto = true; tentar(); }, { once: true });
        v.load();
      })
      .catch(() => { clearTimeout(limite); v.remove(); });
    if (bt) bt.addEventListener('click', () => {
      if (v.paused) { pausaManual = false; tentar(); }
      else { pausaManual = true; v.pause(); rotulo(false); }
    });
    // só toca com o hero na tela e a aba visível (poupa bateria e processador)
    new IntersectionObserver(es => { naTela = es[0].isIntersecting; naTela ? tentar() : v.pause(); }, { threshold: .1 }).observe(sec);
    d.addEventListener('visibilitychange', () => { d.hidden ? v.pause() : tentar(); });
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
    // trava a rolagem de fundo guardando a posição (html overflow:hidden faz a página pular no celular)
    let yTrava = 0;
    const trava = () => { yTrava = scrollY; const s = d.body.style; s.position = 'fixed'; s.top = `-${yTrava}px`; s.left = '0'; s.right = '0'; };
    const solta = () => { const s = d.body.style; if (s.position !== 'fixed') return; s.position = s.top = s.left = s.right = ''; scrollTo({ top: yTrava, behavior: 'instant' }); };
    const grupoCom = form.querySelector('[data-com-grupo]'), nomes = comNumero();
    grupoCom.hidden = nomes.length < 2;
    const escolheCom = chave => { const r = form.querySelector(`input[name=com][value="${chave}"]`); if (r && PESSOAS[chave].num) r.checked = true; };
    const abrir = (b, casa) => {
      origem = b; imovel = casa || ''; limpa();
      escolheCom(b.dataset.com || nomes[0]);
      interesse.hidden = !imovel; interesse.textContent = imovel ? 'Imóvel: ' + imovel : '';
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
      trava();
    };
    d.querySelectorAll('[data-abrir-conversa]').forEach(b => b.addEventListener('click', () => {
      abrir(b, '');
      const r = b.dataset.tipo && form.querySelector(`input[name=tipo][value="${b.dataset.tipo}"]`);
      if (r) r.checked = true;
    }));
    d.querySelectorAll('[data-interesse]').forEach(b => b.addEventListener('click', () => abrir(b, b.dataset.interesse)));
    const fechar = () => { dlg.close ? dlg.close() : dlg.removeAttribute('open'); };
    dlg.addEventListener('close', () => { solta(); origem && origem.focus({ preventScroll: true }); });
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
      const chave = nomes.length > 1 ? form.querySelector('input[name=com]:checked').value : nomes[0];
      const msg = `Olá, ${PESSOAS[chave].nome}! Meu nome é ${form.nome.value.trim()}. Quero ${tipo.toLowerCase()}.` + (imovel ? ` Imóvel: ${imovel}.` : '') + ` Meu WhatsApp: ${form.tel.value}.`;
      fechar(); form.reset(); limpa();
      // abre o WhatsApp com a mensagem pronta e leva para a página de obrigado (onde o Analytics conta o contato)
      abreZap(chave, msg);
      location.href = '/obrigado/';
    });
  }
})();
