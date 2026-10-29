/* ============================================================
   Interações da landing page UniFatecie
   ============================================================ */
(function () {
  'use strict';
  var U = window.UNI;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var brl = function (n) { return n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var norm = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };

  /* ---------- contatos e links (fonte única: data.js) ---------- */
  function setHref(id, url) { var el = document.getElementById(id); if (el) el.href = url; }
  function waUrl(msg) { return 'https://wa.me/' + U.contato.whatsappNumero + '?text=' + encodeURIComponent(msg || ''); }
  var mapQ = encodeURIComponent(U.contato.mapa);

  $$('[data-wa]').forEach(function (a) {
    a.href = waUrl(a.getAttribute('data-wa'));
    a.target = '_blank'; a.rel = 'noopener';
  });
  ['lnkGrad', 'fGrad', 'oGrad'].forEach(function (i) { setHref(i, U.links.graduacao); });
  ['lnkPos', 'fPos', 'oPos', 'posBtn'].forEach(function (i) { setHref(i, U.links.pos); });
  ['lnkSeg', 'fSeg', 'oSeg', 'diplomaBtn'].forEach(function (i) { setHref(i, U.links.segundaGraduacao); });
  ['siteCard', 'fSite'].forEach(function (i) { setHref(i, U.links.site); });
  ['addrCard', 'fMap'].forEach(function (i) { setHref(i, 'https://www.google.com/maps/search/?api=1&query=' + mapQ); });
  $('#mapFrame').src = 'https://www.google.com/maps?q=' + mapQ + '&output=embed';
  $('#waShow').textContent = U.contato.whatsappExibicao;
  $('#fWa').textContent = U.contato.whatsappExibicao;
  $('#year').textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = $('#nav'), burger = $('#burger'), navLinks = $('#navLinks');
  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('a', navLinks).forEach(function (a) {
    a.addEventListener('click', function () { navLinks.classList.remove('open'); burger.setAttribute('aria-expanded', false); });
  });

  var secIds = ['modalidades', 'cursos', 'valores', 'pos', 'polos', 'contato'];
  var secObs = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (e.isIntersecting) {
        $$('a', navLinks).forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  secIds.forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });

  /* ---------- reveal + contadores ---------- */
  var revObs = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revObs.unobserve(e.target);
      var c = $('[data-count]', e.target);
      if (c) countUp(c);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(function (el) { revObs.observe(el); });

  function countUp(el) {
    var end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = end + suf; return; }
    var t0 = performance.now(), dur = 1600;
    (function step(now) {
      var k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(end * e) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- tilt 3D ---------- */
  $$('[data-tilt]').forEach(function (el) {
    var max = +(el.getAttribute('data-tilt-max') || 12), raf = 0;
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || reduce) return;
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.transition = 'transform .12s ease-out';
        el.style.transitionDelay = '0s';
        el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * max).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * max * 1.3).toFixed(2) + 'deg) translateY(-4px)';
        el.style.setProperty('--mx', (px * 100) + '%');
        el.style.setProperty('--my', (py * 100) + '%');
      });
    });
    el.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      el.style.transition = 'transform .7s cubic-bezier(.22,.8,.24,1)';
      el.style.transform = '';
    });
  });

  /* ---------- scroll: progresso + história do celular ---------- */
  var progress = $('#progress'), story = $('#experiencia'), phone = $('#phone');
  var steps = $$('.story__step'), dots = $$('.story__dots i'), ring = $('#ring'), ringTxt = $('#ringTxt');
  var curStep = -1, ticking = false;

  function onScroll() {
    var h = document.documentElement;
    progress.style.transform = 'scaleX(' + (h.scrollTop / Math.max(h.scrollHeight - h.clientHeight, 1)).toFixed(4) + ')';
    nav.classList.toggle('is-solid', h.scrollTop > 40);

    var r = story.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    if (r.top < window.innerHeight && r.bottom > 0) {
      var p = clamp(-r.top / total, 0, 1);
      phone.style.setProperty('--p', p.toFixed(4));
      var pct = Math.round(8 + p * 88);
      ring.style.strokeDashoffset = 314 * (1 - pct / 100);
      ringTxt.textContent = pct + '%';
      var idx = clamp(Math.floor(p * 3 * 0.999), 0, 2);
      if (idx !== curStep) {
        curStep = idx;
        steps.forEach(function (s, i) { s.classList.toggle('is-on', i === idx); });
        dots.forEach(function (d, i) { d.classList.toggle('on', i === idx); });
      }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- buscador de cursos ---------- */
  var G = U.grupos;
  var list = $('#courses'), countEl = $('#count'), emptyEl = $('#empty'), q = $('#q'), chips = $('#chips');
  var state = { f: 'todos', q: '', group: null };

  function fmtYears(n) { return (n === 1 ? '1 ano' : String(n).replace('.', ',') + ' anos'); }

  var courses = U.cursos.map(function (c) {
    return { nome: c[0], grau: c[1], anos: c[2], grupo: c[3], semi: !!c[4], preco: G[c[3]].pontual, key: norm(c[0] + ' ' + c[1]) };
  });

  function renderCourses() {
    var term = norm(state.q.trim());
    var res = courses.filter(function (c) {
      if (state.group && c.grupo !== state.group) return false;
      if (state.f === 'semi' && !c.semi) return false;
      if (state.f !== 'todos' && state.f !== 'semi' && c.grau !== state.f) return false;
      return !term || c.key.indexOf(term) > -1;
    });
    list.innerHTML = res.map(function (c, i) {
      return '<article class="course" style="animation-delay:' + Math.min(i, 14) * 35 + 'ms">' +
        '<div class="course__tags"><span class="tag tag--o">' + c.grau + '</span>' +
        (c.semi ? '<span class="tag tag--b">Semipresencial</span>' : '<span class="tag">100% EAD</span>') + '</div>' +
        '<h4>' + c.nome + '</h4>' +
        '<div class="course__tags"><span class="tag">' + fmtYears(c.anos) + '</span><span class="tag">' + G[c.grupo].nome + '</span></div>' +
        '<div class="course__foot"><div class="course__price"><small>a partir de</small><b>R$ ' + brl(c.preco) + ' <span>/mês</span></b></div>' +
        '<a class="course__go" href="' + U.links.graduacao + '" target="_blank" rel="noopener" aria-label="Matricular em ' + c.nome + '">' +
        '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></a></div></article>';
    }).join('');
    countEl.textContent = res.length + (res.length === 1 ? ' curso' : ' cursos') + (state.group ? ' · ' + G[state.group].nome : '');
    emptyEl.hidden = res.length > 0;
    var cg = $('#clearGroup');
    if (state.group && !cg) {
      cg = document.createElement('button');
      cg.id = 'clearGroup'; cg.className = 'chip on'; cg.textContent = G[state.group].nome + '  ✕';
      cg.addEventListener('click', function () { state.group = null; renderCourses(); });
      chips.appendChild(cg);
    } else if (!state.group && cg) { cg.remove(); }
    else if (cg) { cg.textContent = G[state.group].nome + '  ✕'; }
  }

  function setFilter(f) {
    state.f = f;
    $$('.chip[data-f]', chips).forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-f') === f); });
    renderCourses();
  }
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip[data-f]'); if (b) setFilter(b.getAttribute('data-f'));
  });
  var qt; q.addEventListener('input', function () { clearTimeout(qt); qt = setTimeout(function () { state.q = q.value; renderCourses(); }, 120); });
  $$('[data-filter]').forEach(function (a) {
    a.addEventListener('click', function () { state.group = null; setFilter(a.getAttribute('data-filter')); });
  });
  renderCourses();

  /* ---------- tabela de valores ---------- */
  var tiersEl = $('#tiers'), keys = Object.keys(G), curTier = 'BASE', shown = G.BASE.pontual;
  tiersEl.innerHTML = keys.map(function (k) {
    return '<button class="tier' + (k === 'BASE' ? ' on' : '') + '" role="tab" data-k="' + k + '">' + (k === 'BASE' ? 'Base' : 'Grupo ' + k) + '</button>';
  }).join('');

  function tweenPrice(to) {
    var el = $('#pValue'), from = shown, t0 = performance.now(), dur = reduce ? 1 : 650;
    (function step(now) {
      var k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      shown = from + (to - from) * e;
      el.textContent = brl(shown);
      if (k < 1) requestAnimationFrame(step); else { shown = to; el.textContent = brl(to); }
    })(t0);
  }

  function selectTier(k) {
    curTier = k;
    var g = G[k], qty = courses.filter(function (c) { return c.grupo === k; });
    $$('.tier', tiersEl).forEach(function (t) { t.classList.toggle('on', t.getAttribute('data-k') === k); });
    $('#pGroup').textContent = g.nome;
    $('#pFull').textContent = 'R$ ' + brl(g.cheio);
    $('#pOff').textContent = Math.round((1 - g.pontual / g.cheio) * 100) + '% OFF';
    $('#pCoursesQty').textContent = qty.length + (qty.length === 1 ? ' curso' : ' cursos') + ' neste grupo';
    var names = qty.slice(0, 3).map(function (c) { return c.nome; });
    $('#pCoursesNames').textContent = names.join(', ') + (qty.length > 3 ? ' e mais ' + (qty.length - 3) : '');
    $('#pBtn').href = U.links.graduacao;
    tweenPrice(g.pontual);
  }
  tiersEl.addEventListener('click', function (e) { var b = e.target.closest('.tier'); if (b) selectTier(b.getAttribute('data-k')); });
  $('#pSee').addEventListener('click', function () { state.group = curTier; state.f = 'todos'; $$('.chip[data-f]', chips).forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-f') === 'todos'); }); renderCourses(); });
  selectTier('BASE');

  /* ---------- pós-graduação ---------- */
  var P = U.pos, tabs = $('#posTabs');
  tabs.innerHTML = P.clusters.map(function (c, i) {
    return '<button class="ptab' + (i === 0 ? ' on' : '') + '" role="tab" data-i="' + i + '">' + c.nome + '</button>';
  }).join('');

  function selectCluster(i) {
    var c = P.clusters[i];
    $$('.ptab', tabs).forEach(function (t, j) { t.classList.toggle('on', i === j); });
    $('#posQtd').textContent = c.qtd + ' cursos';
    $('#posName').textContent = c.nome;
    $('#posParcela').textContent = 'R$ ' + brl(c.parcela);
    $('#posList').innerHTML = c.cursos.map(function (n, k) {
      return '<li style="animation-delay:' + k * 45 + 'ms">' + n + '</li>';
    }).join('');
  }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('.ptab'); if (b) selectCluster(+b.getAttribute('data-i')); });
  selectCluster(0);

  $('#destaque').innerHTML = P.destaque.map(function (d) {
    var parc = d.parcela || 47.90;
    return '<article class="dest reveal" data-tilt data-tilt-max="9"><h4>' + d.nome + '</h4>' +
      '<div class="dest__meta"><span class="tag">' + String(d.meses).padStart(2, '0') + ' meses</span><span class="tag">' + d.horas + 'h</span>' + (d.estagio ? '<span class="tag tag--o">Com estágio</span>' : '') + '</div>' +
      '<p class="dest__price">Matrícula R$ 29,90 + 12x <b>R$ ' + brl(parc) + '</b></p></article>';
  }).join('');
  $$('#destaque .reveal').forEach(function (el, i) { el.style.transitionDelay = (i * 0.07) + 's'; revObs.observe(el); });
  // tilt para os cards de destaque criados dinamicamente
  $$('#destaque [data-tilt]').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch' || reduce) return;
      var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.transition = 'transform .12s ease-out'; el.style.transitionDelay = '0s';
      el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * 9).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * 12).toFixed(2) + 'deg) translateY(-4px)';
    });
    el.addEventListener('pointerleave', function () { el.style.transition = 'transform .7s cubic-bezier(.22,.8,.24,1)'; el.style.transform = ''; });
  });

  /* ---------- mapa dos polos ---------- */
  var svg = $('#mapSvg'), NS = 'http://www.w3.org/2000/svg';
  var LON0 = -39.1, LON1 = -34.8, LAT0 = -6.2, LAT1 = -8.3;
  function px(lon) { return 30 + (lon - LON0) / (LON1 - LON0) * 740; }
  function py(lat) { return 30 + (LAT0 - lat) / (LAT0 - LAT1) * 330; }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n); return n;
  }

  var dots = el('g', {}, svg);
  for (var gx = 10; gx < 800; gx += 26) for (var gy = 10; gy < 440; gy += 26) el('circle', { cx: gx, cy: gy, r: 1.4, 'class': 'dotgrid' }, dots);

  [['PARAÍBA', 330, 240, 40], ['CEARÁ', 34, 32, 32], ['RIO GRANDE DO NORTE', 330, 40, 30], ['PERNAMBUCO', 520, 340, 34]].forEach(function (s) {
    var t = el('text', { x: s[1], y: s[2], fill: 'rgba(255,255,255,.07)', 'font-size': s[3], 'font-weight': 800, 'font-family': 'Inter,sans-serif' }, svg);
    t.textContent = s[0];
  });

  var mega = U.polos[0], mx0 = px(mega.lon), my0 = py(mega.lat);
  var routes = el('g', {}, svg);
  U.polos.slice(1).forEach(function (p) {
    var x = px(p.lon), y = py(p.lat), cx = (mx0 + x) / 2, cy = Math.min(my0, y) - 40 - Math.abs(x - mx0) * 0.08;
    el('path', { d: 'M' + mx0 + ',' + my0 + ' Q' + cx + ',' + cy + ' ' + x + ',' + y, 'class': 'route' }, routes);
  });

  var labelPos = {
    cajazeiras: { dx: 0, dy: -24, a: 'middle' }, sjp: { dx: 16, dy: 5, a: 'start' }, patos: { dx: 16, dy: 5, a: 'start' },
    itaporanga: { dx: 16, dy: 5, a: 'start' }, pombal: { dx: 0, dy: -20, a: 'middle' }, ico: { dx: 16, dy: 5, a: 'start' },
    caico: { dx: 16, dy: 5, a: 'start' }, jaboatao: { dx: -18, dy: 5, a: 'end' }
  };
  var pins = {};
  U.polos.forEach(function (p) {
    var x = px(p.lon), y = py(p.lat), L = labelPos[p.id];
    var g = el('g', { 'class': 'pin' + (p.mega ? ' pin--mega' : ''), tabindex: 0, role: 'button', 'aria-label': 'Polo ' + p.nome }, svg);
    el('circle', { cx: x, cy: y, r: p.mega ? 12 : 8, 'class': 'halo' }, g);
    el('circle', { cx: x, cy: y, r: p.mega ? 9 : 6.5, 'class': 'core' }, g);
    var t = el('text', { x: x + L.dx, y: y + L.dy, 'text-anchor': L.a }, g);
    t.textContent = p.nome;
    g.addEventListener('click', function () { selectPolo(p.id); });
    g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPolo(p.id); } });
    pins[p.id] = g;
  });

  var UF = { PB: 'Paraíba', CE: 'Ceará', RN: 'Rio Grande do Norte', PE: 'Pernambuco' };
  var poloListEl = $('#poloList');
  poloListEl.innerHTML = U.polos.map(function (p) {
    return '<li data-id="' + p.id + '" tabindex="0">' + p.nome + '<small>' + p.uf + '</small></li>';
  }).join('');
  poloListEl.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) selectPolo(li.getAttribute('data-id')); });
  poloListEl.addEventListener('keydown', function (e) { var li = e.target.closest('li'); if (li && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectPolo(li.getAttribute('data-id')); } });

  function selectPolo(id) {
    var p = U.polos.filter(function (x) { return x.id === id; })[0];
    Object.keys(pins).forEach(function (k) { pins[k].classList.toggle('on', k === id); });
    $$('li', poloListEl).forEach(function (li) { li.classList.toggle('on', li.getAttribute('data-id') === id); });
    $('#poloTag').textContent = p.mega ? 'Mega Polo' : 'Polo parceiro';
    $('#poloName').textContent = p.nome;
    $('#poloState').textContent = UF[p.uf];
    $('#poloAddr').textContent = p.mega
      ? U.contato.endereco + ' — ' + U.contato.referencia + '.'
      : 'Atendimento e matrícula para a região de ' + p.nome + '. Chame no WhatsApp para saber endereço e horários.';
    var wa = $('#poloWa');
    wa.href = waUrl('Olá! Quero informações sobre o polo de ' + p.nome + '-' + p.uf + '.');
    var info = $('#poloInfo');
    info.animate([{ opacity: .3, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 400, easing: 'cubic-bezier(.22,.8,.24,1)' });
  }
  selectPolo('cajazeiras');

  /* ---------- modal de matrícula ---------- */
  var dlg = $('#enroll');
  function openEnroll() { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  function closeEnroll() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  $$('[data-open-enroll]').forEach(function (b) { b.addEventListener('click', openEnroll); });
  $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', closeEnroll); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeEnroll(); });
  $$('a', dlg).forEach(function (a) { a.addEventListener('click', function () { setTimeout(closeEnroll, 150); }); });
})();
