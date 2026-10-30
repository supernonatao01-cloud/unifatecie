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
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var norm = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var ICON_WA = '<svg class="ic ic--f"><use href="#i-wa"/></svg>';

  /* ---------- contatos e links (fonte única: data.js) ---------- */
  function setHref(id, url) { var el = document.getElementById(id); if (el) el.href = url; }
  function waUrl(msg) { return 'https://wa.me/' + U.contato.whatsappNumero + '?text=' + encodeURIComponent(msg || ''); }
  var mapQ = encodeURIComponent(U.contato.mapa);

  $$('[data-wa]').forEach(function (a) { a.href = waUrl(a.getAttribute('data-wa')); a.target = '_blank'; a.rel = 'noopener'; });
  /* Matrícula: sem links externos — todo botão abre o WhatsApp com mensagem pronta do item clicado */
  ['siteCard', 'fSite'].forEach(function (i) { setHref(i, U.links.site); });
  ['addrCard', 'fMap', 'mapOpen'].forEach(function (i) { setHref(i, 'https://www.google.com/maps/search/?api=1&query=' + mapQ); });
  $('#waShow').textContent = U.contato.whatsappExibicao;
  $('#fWa').textContent = U.contato.whatsappExibicao;
  $('#year').textContent = new Date().getFullYear();

  /* mapa do Google só carrega quando a pessoa pedir (economiza ~1 MB) */
  $('#mapLoad').addEventListener('click', function () {
    var box = $('#mapBox'), f = document.createElement('iframe');
    f.title = 'Mapa do endereço do polo Cajazeiras';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://www.google.com/maps?q=' + mapQ + '&output=embed';
    box.innerHTML = ''; box.appendChild(f);
  });

  /* ---------- ticker de cursos ---------- */
  (function () {
    var t = $('#ticker'), names = ['Pedagogia', 'Administração', 'Engenharia Civil', 'Psicopedagogia', 'Análise e Desenvolvimento de Sistemas', 'Ciências Contábeis', 'Nutrição', 'Fisioterapia', 'Marketing', 'Gestão de RH', 'Educação Física', 'Direito (Pós)', 'Inteligência Artificial', 'Engenharia de Software', 'Serviço Social', 'Logística'];
    var html = names.map(function (n) { return '<span>' + n + '</span>'; }).join('');
    t.innerHTML = html + html;
  })();

  /* ---------- topo, progresso e dock ---------- */
  var nav = $('#nav'), progress = $('#progress');
  var dockIn = $('#dockIn'), dockItems = $$('.dock__i', dockIn);
  var tabIndex = { inicio: 0, cursos: 1, valores: 2, pos: 3, contato: 4 };
  var sectionTab = { inicio: 'inicio', numeros: 'inicio', modalidades: 'inicio', experiencia: 'inicio', cursos: 'cursos', valores: 'valores', pos: 'pos', diploma: 'pos', ingresso: 'pos', polos: 'contato', contato: 'contato', faq: 'contato' };

  function setTab(tab) {
    var i = tabIndex[tab]; if (i === undefined) return;
    dockIn.style.setProperty('--i', i);
    dockItems.forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-tab') === tab); });
  }
  dockItems.forEach(function (a) {
    a.addEventListener('click', function () {
      setTab(a.getAttribute('data-tab'));
      if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) { }
    });
  });
  var tabObs = new IntersectionObserver(function (en) {
    en.forEach(function (e) { if (e.isIntersecting && sectionTab[e.target.id]) setTab(sectionTab[e.target.id]); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(sectionTab).forEach(function (id) { var el = document.getElementById(id); if (el) tabObs.observe(el); });

  /* teclado aberto no celular: esconde dock e botão do WhatsApp */
  document.addEventListener('focusin', function (e) { if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) document.body.classList.add('kb'); });
  document.addEventListener('focusout', function () { document.body.classList.remove('kb'); });

  /* ---------- pausa animações fora da tela ---------- */
  var offObs = new IntersectionObserver(function (en) {
    en.forEach(function (e) { e.target.classList.toggle('off', !e.isIntersecting); });
  }, { rootMargin: '120px 0px' });
  $$('.hero, .ticker, .story, .sec, .final').forEach(function (s) { offObs.observe(s); });

  /* ---------- reveal + contadores ---------- */
  var revObs = new IntersectionObserver(function (en) {
    en.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      revObs.unobserve(e.target);
      var c = $('[data-count]', e.target);
      if (c) countUp(c);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  $$('.reveal').forEach(function (el) { revObs.observe(el); });

  function countUp(el) {
    var end = +el.getAttribute('data-count'), suf = el.getAttribute('data-suffix') || '';
    if (reduce) return;
    var t0 = performance.now(), dur = 1400;
    (function step(now) {
      var k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(end * e) + suf;
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- tilt 3D (só em computador com mouse) ---------- */
  function initTilt(root) {
    if (!canHover || reduce) return;
    $$('[data-tilt]', root).forEach(function (el) {
      if (el._tilt) return; el._tilt = true;
      var max = +(el.getAttribute('data-tilt-max') || 12), raf = 0;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(function () {
          el.style.transition = 'transform .12s ease-out'; el.style.transitionDelay = '0s';
          el.style.transform = 'perspective(900px) rotateX(' + ((0.5 - py) * max).toFixed(2) + 'deg) rotateY(' + ((px - 0.5) * max * 1.3).toFixed(2) + 'deg) translateY(-4px)';
          el.style.setProperty('--mx', (px * 100) + '%'); el.style.setProperty('--my', (py * 100) + '%');
        });
      });
      el.addEventListener('pointerleave', function () {
        cancelAnimationFrame(raf);
        el.style.transition = 'transform .7s cubic-bezier(.22,.8,.24,1)'; el.style.transform = '';
      });
    });
  }
  initTilt(document);

  /* ---------- scroll: progresso, topo e história do celular ---------- */
  var story = $('#experiencia'), phone = $('#phone'), phoneBox = $('.phone-box');
  var steps = $$('.story__step'), dots = $$('.story__dots i'), ring = $('#ring'), ringTxt = $('#ringTxt');
  var storyStage = $('.story__stage'), curStep = -1, ticking = false, storyOn = false;

  function fitPhone() { phoneBox.style.setProperty('--k', clamp(storyStage.clientHeight / 640, 0.3, 1).toFixed(3)); }
  fitPhone();

  function onScroll() {
    var h = document.documentElement, top = h.scrollTop || window.scrollY;
    progress.style.transform = 'scaleX(' + (top / Math.max(h.scrollHeight - h.clientHeight, 1)).toFixed(4) + ')';
    nav.classList.toggle('is-solid', top > 40);

    if (storyOn) {
      var r = story.getBoundingClientRect(), total = r.height - window.innerHeight;
      var p = clamp(-r.top / total, 0, 1);
      phone.style.setProperty('--p', p.toFixed(4));
      var pct = Math.round(8 + p * 88);
      ring.style.strokeDashoffset = (314 * (1 - pct / 100)).toFixed(1);
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
  new IntersectionObserver(function (en) { storyOn = en[0].isIntersecting; onScroll(); }, { rootMargin: '10% 0px' }).observe(story);
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', function () { fitPhone(); onScroll(); });
  onScroll();

  /* ---------- helper: centraliza o item ativo em listas roláveis ---------- */
  /* rola só a própria lista (scrollIntoView também rolava a seção inteira para o lado) */
  function centerInRow(btn) {
    var row = btn && btn.parentElement;
    if (!row || row.scrollWidth <= row.clientWidth) return;
    var left = btn.offsetLeft - (row.clientWidth - btn.offsetWidth) / 2;
    row.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- buscador de cursos (com "mostrar mais") ---------- */
  var G = U.grupos, PAGE = 12;
  var list = $('#courses'), countEl = $('#count'), emptyEl = $('#empty'), q = $('#q'), chips = $('#chips'), moreBtn = $('#more');
  var state = { f: 'todos', q: '', group: null, shown: 0, res: [] };

  function fmtYears(n) { return n === 1 ? '1 ano' : String(n).replace('.', ',') + ' anos'; }
  var courses = U.cursos.map(function (c) {
    return { nome: c[0], grau: c[1], anos: c[2], grupo: c[3], semi: !!c[4], preco: G[c[3]].pontual, key: norm(c[0] + ' ' + c[1]) };
  });

  function courseMsg(c) {
    return 'Olá! Quero me matricular no curso de ' + c.nome + ' (' + c.grau + ', ' + fmtYears(c.anos) + (c.semi ? ', semipresencial' : ', 100% EAD') +
      '), com mensalidade a partir de R$ ' + brl(c.preco) + '. Pode me ajudar com a matrícula?';
  }
  function cardHtml(c, i) {
    return '<article class="course" style="animation-delay:' + Math.min(i % PAGE, 11) * 30 + 'ms">' +
      '<div class="course__tags"><span class="tag tag--o">' + c.grau + '</span>' +
      (c.semi ? '<span class="tag tag--b">Semipresencial</span>' : '<span class="tag">100% EAD</span>') + '</div>' +
      '<h4>' + c.nome + '</h4>' +
      '<div class="course__tags"><span class="tag">' + fmtYears(c.anos) + '</span><span class="tag">' + G[c.grupo].nome + '</span></div>' +
      '<div class="course__foot"><div class="course__price"><small>a partir de</small><b>R$ ' + brl(c.preco) + ' <span>/mês</span></b></div>' +
      '<a class="course__go" href="' + waUrl(courseMsg(c)) + '" target="_blank" rel="noopener" aria-label="Matricular em ' + c.nome + ' pelo WhatsApp">' + ICON_WA + 'Matricular</a></div></article>';
  }

  function filterCourses() {
    var term = norm(state.q.trim());
    state.res = courses.filter(function (c) {
      if (state.group && c.grupo !== state.group) return false;
      if (state.f === 'semi' && !c.semi) return false;
      if (state.f !== 'todos' && state.f !== 'semi' && c.grau !== state.f) return false;
      return !term || c.key.indexOf(term) > -1;
    });
    state.shown = 0; list.innerHTML = '';
    appendCourses();
    var n = state.res.length;
    countEl.textContent = n + (n === 1 ? ' curso' : ' cursos') + (state.group ? ' · ' + G[state.group].nome : '');
    emptyEl.hidden = n > 0;
    syncGroupChip();
  }
  function appendCourses() {
    var next = state.res.slice(state.shown, state.shown + PAGE);
    list.insertAdjacentHTML('beforeend', next.map(function (c, i) { return cardHtml(c, state.shown + i); }).join(''));
    state.shown += next.length;
    var left = state.res.length - state.shown;
    moreBtn.hidden = left <= 0;
    moreBtn.textContent = 'Mostrar mais cursos (' + left + ')';
  }
  function syncGroupChip() {
    var cg = $('#clearGroup');
    if (state.group && !cg) {
      cg = document.createElement('button');
      cg.id = 'clearGroup'; cg.className = 'chip on';
      cg.addEventListener('click', function () { state.group = null; filterCourses(); });
      chips.appendChild(cg);
    } else if (!state.group && cg) { cg.remove(); return; }
    if (cg) cg.textContent = G[state.group].nome + '  ✕';
  }
  function setFilter(f) {
    state.f = f;
    $$('.chip[data-f]', chips).forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-f') === f); });
    filterCourses();
  }
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('.chip[data-f]'); if (b) { setFilter(b.getAttribute('data-f')); centerInRow(b); }
  });
  moreBtn.addEventListener('click', appendCourses);
  var qt; q.addEventListener('input', function () { clearTimeout(qt); qt = setTimeout(function () { state.q = q.value; filterCourses(); }, 140); });
  $$('[data-filter]').forEach(function (a) {
    a.addEventListener('click', function () { state.group = null; setFilter(a.getAttribute('data-filter')); });
  });
  filterCourses();

  /* ---------- tabela de valores ---------- */
  var tiersEl = $('#tiers'), keys = Object.keys(G), curTier = 'BASE', shown = G.BASE.pontual;
  tiersEl.innerHTML = keys.map(function (k) {
    return '<button class="tier' + (k === 'BASE' ? ' on' : '') + '" role="tab" data-k="' + k + '">' + (k === 'BASE' ? 'Base' : 'Grupo ' + k) + '</button>';
  }).join('');

  function tweenPrice(to) {
    var el = $('#pValue'), from = shown, t0 = performance.now(), dur = reduce ? 1 : 600;
    (function step(now) {
      var k = clamp((now - t0) / dur, 0, 1), e = 1 - Math.pow(1 - k, 3);
      shown = from + (to - from) * e; el.textContent = brl(shown);
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
    $('#pBtn').href = waUrl('Olá! Tenho interesse nos cursos do ' + (k === 'BASE' ? 'Grupo Base' : g.nome) + ' da graduação EAD (mensalidade a partir de R$ ' + brl(g.pontual) + '). Pode me passar os cursos desse grupo e me ajudar com a matrícula?');
    tweenPrice(g.pontual);
  }
  tiersEl.addEventListener('click', function (e) { var b = e.target.closest('.tier'); if (b) { selectTier(b.getAttribute('data-k')); centerInRow(b); } });
  $('#pSee').addEventListener('click', function () {
    state.group = curTier; state.f = 'todos';
    $$('.chip[data-f]', chips).forEach(function (c) { c.classList.toggle('on', c.getAttribute('data-f') === 'todos'); });
    filterCourses();
  });
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
    $('#posBtn').href = waUrl('Olá! Quero me matricular em uma pós-graduação na área de ' + c.nome + ' (matrícula de R$ 29,90 + 12x de R$ ' + brl(c.parcela) + '). Pode me ajudar a escolher o curso?');
    $('#posBtn').target = '_blank'; $('#posBtn').rel = 'noopener';
    $('#posList').innerHTML = c.cursos.map(function (n, k) {
      var msg = 'Olá! Quero me matricular na pós-graduação em ' + n + ' (área de ' + c.nome + ', 12x de R$ ' + brl(c.parcela) + '). Pode me ajudar com a matrícula?';
      return '<li style="animation-delay:' + k * 40 + 'ms"><a href="' + waUrl(msg) + '" target="_blank" rel="noopener">' + n + '</a></li>';
    }).join('');
  }
  tabs.addEventListener('click', function (e) { var b = e.target.closest('.ptab'); if (b) { selectCluster(+b.getAttribute('data-i')); centerInRow(b); } });
  selectCluster(0);

  $('#destaque').innerHTML = P.destaque.map(function (d, i) {
    var parc = d.parcela || 47.90;
    return '<article class="dest reveal" data-tilt data-tilt-max="9" style="transition-delay:' + (i * 0.06) + 's"><h4>' + d.nome + '</h4>' +
      '<div class="dest__meta"><span class="tag">' + String(d.meses).padStart(2, '0') + ' meses</span><span class="tag">' + d.horas + 'h</span>' + (d.estagio ? '<span class="tag tag--o">Com estágio</span>' : '') + '</div>' +
      '<p class="dest__price">Matrícula R$ 29,90 + 12x <b>R$ ' + brl(parc) + '</b></p>' +
      '<a class="link" target="_blank" rel="noopener" href="' + waUrl('Olá! Quero me matricular na Especialização em ' + d.nome + ' (' + d.meses + ' meses, ' + d.horas + 'h), matrícula de R$ 29,90 + 12x de R$ ' + brl(parc) + '. Pode me ajudar com a matrícula?') + '">' + ICON_WA + 'Quero esta especialização</a></article>';
  }).join('');
  $$('#destaque .reveal').forEach(function (el) { revObs.observe(el); });
  initTilt($('#destaque'));

  /* ---------- mapa dos polos (SVG leve: sem grade de pontos) ---------- */
  var svg = $('#mapSvg'), NS = 'http://www.w3.org/2000/svg';
  var LON0 = -39.1, LON1 = -34.8, LAT0 = -6.2, LAT1 = -8.3;
  function px(lon) { return 30 + (lon - LON0) / (LON1 - LON0) * 740; }
  function py(lat) { return 30 + (LAT0 - lat) / (LAT0 - LAT1) * 330; }
  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n); return n;
  }
  var PS = window.innerWidth < 700 ? 1.7 : 1;

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
    el('circle', { cx: x, cy: y, r: (p.mega ? 12 : 8) * PS, 'class': 'halo' }, g);
    el('circle', { cx: x, cy: y, r: (p.mega ? 9 : 6.5) * PS, 'class': 'core' }, g);
    el('circle', { cx: x, cy: y, r: 22 * PS, fill: 'transparent' }, g); // alvo de toque maior
    var t = el('text', { x: x + L.dx, y: y + L.dy * (PS > 1 ? 1.5 : 1), 'text-anchor': L.a }, g);
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
  poloListEl.addEventListener('click', function (e) { var li = e.target.closest('li'); if (li) { selectPolo(li.getAttribute('data-id')); centerInRow(li); } });
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
    $('#poloWa').href = waUrl('Olá! Quero informações sobre o polo de ' + p.nome + '-' + p.uf + '.');
    if (!reduce && $('#poloInfo').animate) $('#poloInfo').animate([{ opacity: .3, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.22,.8,.24,1)' });
  }
  selectPolo('cajazeiras');

  /* ---------- modal (bottom sheet no celular) ---------- */
  var dlg = $('#enroll');
  function openEnroll() { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  function closeEnroll() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); }
  $$('[data-open-enroll]').forEach(function (b) { b.addEventListener('click', openEnroll); });
  $$('[data-close]', dlg).forEach(function (b) { b.addEventListener('click', closeEnroll); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) closeEnroll(); });
  $$('a', dlg).forEach(function (a) { a.addEventListener('click', function () { setTimeout(closeEnroll, 150); }); });
})();
