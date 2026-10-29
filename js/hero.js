/* ============================================================
   Hero 3D leve (CSS 3D, sem bibliotecas)
   - Logo "extrudada" por camadas empilhadas em translateZ
   - Inclina com mouse ou arrastando o dedo; balança sozinha
   - Partículas em canvas 2D (poucas); tudo pausa fora da tela
   - Modo econômico (.lite) em aparelhos fracos / economia de dados
   ============================================================ */
(function () {
  'use strict';
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var conn = navigator.connection || {};
  var lite = reduce || conn.saveData === true || (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
  window.UNI_LITE = !!lite;
  if (lite) doc.classList.add('lite');

  var hero = document.getElementById('inicio');
  var stage = document.getElementById('stage');
  var logo = document.getElementById('logo3d');
  var slab = document.getElementById('slab');
  var cv = document.getElementById('sparks');
  if (!hero || !stage || !logo || !slab) return;

  /* camadas de profundidade */
  var narrow = window.innerWidth < 700;
  var LAYERS = lite ? 0 : (narrow ? 9 : 13);
  for (var k = 1; k <= LAYERS; k++) {
    var l = document.createElement('i');
    l.className = 'ly ' + (k <= 3 ? 'ly--a' : 'ly--b');
    l.style.setProperty('--i', k * (13 / Math.max(LAYERS, 1)));
    slab.insertBefore(l, slab.firstChild);
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  if (lite) return;

  /* ---------- interação ---------- */
  var tx = 0, ty = 0, cx = 0, cy = 0;
  function aim(e) {
    var r = stage.getBoundingClientRect();
    var px = ((e.clientX - r.left) / r.width) * 2 - 1;
    var py = ((e.clientY - r.top) / r.height) * 2 - 1;
    ty = clamp(px, -1, 1) * 38;
    tx = clamp(py, -1, 1) * -16;
  }
  function rest() { tx = 0; ty = 0; }
  stage.addEventListener('pointermove', aim, { passive: true });
  stage.addEventListener('pointerdown', aim, { passive: true });
  stage.addEventListener('pointerleave', rest);
  stage.addEventListener('pointerup', rest);
  stage.addEventListener('pointercancel', rest);
  hero.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'mouse') aim(e);
  }, { passive: true });

  /* ---------- partículas ---------- */
  var ctx = cv && cv.getContext ? cv.getContext('2d') : null;
  var W = 0, H = 0, parts = [];
  function sizeCanvas() {
    if (!ctx) return;
    W = cv.width = stage.clientWidth;
    H = cv.height = stage.clientHeight;
    var n = narrow ? 22 : 42;
    parts = [];
    for (var i = 0; i < n; i++) parts.push(spawn(true));
  }
  function spawn(initial) {
    return {
      x: Math.random() * W, y: initial ? Math.random() * H : H + 10,
      r: 0.8 + Math.random() * 1.8, v: 0.15 + Math.random() * 0.45,
      a: 0.25 + Math.random() * 0.6, p: Math.random() * 6.28
    };
  }
  function drawSparks(t) {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.y -= p.v; p.x += Math.sin(t * 0.0007 + p.p) * 0.25;
      if (p.y < -10) parts[i] = spawn(false);
      var fade = Math.min(1, p.y / (H * 0.3), (H - p.y) / (H * 0.2));
      ctx.globalAlpha = Math.max(0, p.a * fade);
      ctx.fillStyle = i % 3 ? '#ff8a2b' : '#ffd9b0';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  if (window.ResizeObserver) new ResizeObserver(sizeCanvas).observe(stage); else sizeCanvas();

  /* ---------- loop (só roda com o hero visível) ---------- */
  var running = false, raf = 0, t0 = 0;
  function frame(now) {
    if (!running) return;
    if (!t0) t0 = now;
    var t = (now - t0) / 1000;
    var e = 1 - Math.pow(1 - Math.min(t / 1.7, 1), 3);

    cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
    var ry = -72 * (1 - e) + cy + Math.sin(t * 0.6) * 12;
    var rx = 6 + cx + Math.cos(t * 0.5) * 3;
    var sc = clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);

    logo.style.transform = 'translate3d(0,' + (-sc * 50).toFixed(1) + 'px,0) scale(' + (1 - sc * 0.18).toFixed(3) + ') rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + (ry + sc * 30).toFixed(2) + 'deg)';
    drawSparks(now);
    raf = requestAnimationFrame(frame);
  }
  function start() { if (!running && !document.hidden) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  new IntersectionObserver(function (en) { en[0].isIntersecting ? start() : stop(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', function () { document.hidden ? stop() : (hero.getBoundingClientRect().bottom > 0 && start()); });
})();
