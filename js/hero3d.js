/* ============================================================
   Cena 3D do hero (Three.js)
   - Logo UniFatecie "extrudada" em camadas, com brilho que varre a superfície
   - Anéis orbitais, formas flutuantes e partículas
   - Reage ao mouse/toque e ao scroll; pausa quando fora da tela
   ============================================================ */
(function () {
  var canvas = document.getElementById('hero3d');
  var hero = document.getElementById('inicio');
  if (!canvas || !hero) return;

  function fallback() {
    var img = new Image();
    img.src = 'assets/logo-mark-light.png';
    img.alt = '';
    img.style.cssText = 'position:absolute;right:12%;top:50%;width:min(36vw,420px);transform:translateY(-50%);z-index:0;filter:drop-shadow(0 30px 60px rgba(255,106,0,.5))';
    hero.appendChild(img);
    canvas.style.display = 'none';
  }

  if (!window.THREE || !window.UNI_LOGO) { fallback(); return; }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { fallback(); return; }

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  /* ---------- luzes ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var lOrange = new THREE.PointLight(0xff6a00, 2.4, 30); lOrange.position.set(4, 3, 5); scene.add(lOrange);
  var lWhite = new THREE.PointLight(0xffffff, 1.2, 30); lWhite.position.set(-5, -2, 4); scene.add(lWhite);

  /* ---------- texturas auxiliares ---------- */
  function radialTex(inner, outer) {
    var c = document.createElement('canvas'); c.width = c.height = 128;
    var g = c.getContext('2d'); var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, inner); gr.addColorStop(1, outer);
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  /* ---------- logo em camadas ---------- */
  var group = new THREE.Group();
  scene.add(group);
  var logoGroup = new THREE.Group();
  group.add(logoGroup);

  var logoTex = new THREE.TextureLoader().load(window.UNI_LOGO, function () { ready = true; });
  logoTex.minFilter = THREE.LinearFilter;
  logoTex.generateMipmaps = false;
  logoTex.anisotropy = 4;
  var ready = false;

  var LAYERS = 18, SPACING = 0.028, SIZE = 3.1;
  var geo = new THREE.PlaneGeometry(SIZE, SIZE);
  var back = new THREE.Color(0x2a1204), front = new THREE.Color(0xffffff);
  for (var i = 0; i < LAYERS; i++) {
    var k = i / (LAYERS - 1);
    var isFront = i === LAYERS - 1;
    var mat = new THREE.MeshBasicMaterial({
      map: logoTex,
      color: back.clone().lerp(front, Math.pow(k, 2.2)),
      transparent: isFront,
      alphaTest: isFront ? 0.01 : 0.4,
      side: THREE.DoubleSide
    });
    var m = new THREE.Mesh(geo, mat);
    m.position.z = (i - LAYERS / 2) * SPACING;
    logoGroup.add(m);
  }

  /* brilho que varre a logo */
  var shineMat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { map: { value: logoTex }, time: { value: 0 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: [
      'uniform sampler2D map; uniform float time; varying vec2 vUv;',
      'void main(){',
      '  vec4 t = texture2D(map, vUv);',
      '  float x = vUv.x + vUv.y * 0.55;',
      '  float p = fract(time * 0.16) * 3.2 - 0.9;',
      '  float s = smoothstep(0.22, 0.0, abs(x - p));',
      '  gl_FragColor = vec4(vec3(1.0, 0.92, 0.82), t.a * s * 0.75);',
      '}'
    ].join('\n')
  });
  var shine = new THREE.Mesh(geo, shineMat);
  shine.position.z = (LAYERS / 2) * SPACING + 0.004;
  logoGroup.add(shine);

  /* halo atrás da logo */
  var glow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: radialTex('rgba(255,106,0,0.55)', 'rgba(255,106,0,0)'),
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true
  }));
  glow.scale.set(8, 8, 1); glow.position.z = -1.4;
  group.add(glow);

  /* ---------- anéis orbitais ---------- */
  var ring1 = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.012, 12, 200),
    new THREE.MeshBasicMaterial({ color: 0xff8a2b, transparent: true, opacity: 0.85 }));
  ring1.rotation.set(1.25, 0.2, 0);
  var ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.008, 12, 220),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 }));
  ring2.rotation.set(1.05, -0.5, 0.6);
  group.add(ring1, ring2);

  var orb1 = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffb35c }));
  var orb2 = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  ring1.add(orb1); ring2.add(orb2);
  var orbGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTex('rgba(255,170,90,1)', 'rgba(255,106,0,0)'), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  orbGlow.scale.set(0.9, 0.9, 1); orb1.add(orbGlow);

  /* ---------- formas flutuantes ---------- */
  var floaters = [];
  function addFloater(geometry, x, y, z, s, speed) {
    var mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: 0x15151a, metalness: 0.85, roughness: 0.22, flatShading: true }));
    var edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), new THREE.LineBasicMaterial({ color: 0xff8a2b, transparent: true, opacity: 0.9 }));
    mesh.add(edges);
    mesh.position.set(x, y, z); mesh.scale.setScalar(s);
    mesh.userData = { y0: y, speed: speed, ph: Math.random() * 6.28 };
    group.add(mesh); floaters.push(mesh);
  }
  addFloater(new THREE.IcosahedronGeometry(1, 0), -3.2, 1.9, -0.6, 0.34, 0.9);
  addFloater(new THREE.OctahedronGeometry(1, 0), 3.4, -1.7, 0.6, 0.3, 1.1);
  addFloater(new THREE.TetrahedronGeometry(1, 0), -2.9, -2.1, 0.4, 0.28, 0.8);
  addFloater(new THREE.IcosahedronGeometry(1, 0), 3.0, 2.3, -1.2, 0.22, 1.3);
  addFloater(new THREE.OctahedronGeometry(1, 0), 0.4, 3.2, -0.8, 0.2, 1.0);

  /* ---------- partículas ---------- */
  var COUNT = window.innerWidth < 700 ? 280 : 650;
  var pos = new Float32Array(COUNT * 3);
  for (var p = 0; p < COUNT; p++) {
    var r = 4 + Math.random() * 9, th = Math.random() * 6.283, ph = Math.acos(2 * Math.random() - 1);
    pos[p * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[p * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7;
    pos[p * 3 + 2] = r * Math.cos(ph) - 3;
  }
  var pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  var points = new THREE.Points(pg, new THREE.PointsMaterial({
    size: 0.07, map: radialTex('rgba(255,190,130,1)', 'rgba(255,106,0,0)'),
    transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  }));
  scene.add(points);

  /* ---------- tamanho / layout responsivo ---------- */
  var baseScale = 1, baseX = 2.1, baseY = 0;
  function resize() {
    var w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    var wide = camera.aspect > 1.15;
    if (wide) { baseX = Math.min(2.6, 1.1 + camera.aspect * 0.55); baseY = 0; baseScale = 1; camera.position.z = 9; }
    else {
      /* telas estreitas: a logo ocupa a faixa superior, acima do texto */
      camera.position.z = 9;
      var pxPerUnit = h / (2 * 9 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      var band = Math.min(window.innerHeight * 0.46, 380);
      var centerPx = 64 + (band - 64) * 0.52;
      baseX = 0;
      baseY = (h / 2 - centerPx) / pxPerUnit;
      baseScale = Math.min(0.85, (band - 80) / (SIZE * pxPerUnit * 1.5));
    }
    camera.updateProjectionMatrix();
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(hero); else window.addEventListener('resize', resize);

  /* ---------- interação ---------- */
  var mx = 0, my = 0, tx = 0, ty = 0;
  function onMove(e) {
    var pt = e.touches ? e.touches[0] : e;
    mx = (pt.clientX / window.innerWidth) * 2 - 1;
    my = (pt.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });

  /* ---------- loop ---------- */
  var running = true, clock = new THREE.Clock(), t0 = 0;
  new IntersectionObserver(function (en) { running = en[0].isIntersecting; if (running) loop(); }, { threshold: 0 }).observe(hero);
  document.addEventListener('visibilitychange', function () { if (!document.hidden && running) loop(); });

  function ease(x) { return 1 - Math.pow(1 - x, 3); }
  var raf = 0;

  function frame() {
    var t = clock.getElapsedTime();
    var intro = reduce ? 1 : ease(Math.min(t / 2.2, 1));
    var sc = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);

    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;

    group.position.x = baseX;
    group.position.y = baseY + sc * 1.4;
    group.scale.setScalar(baseScale * (0.55 + 0.45 * intro) * (1 - sc * 0.25));

    logoGroup.rotation.y = (1 - intro) * -2.6 + tx * 0.55 + (reduce ? 0 : Math.sin(t * 0.55) * 0.18) + sc * 1.6;
    logoGroup.rotation.x = ty * 0.28 + (reduce ? 0 : Math.cos(t * 0.45) * 0.05);
    logoGroup.position.y = reduce ? 0 : Math.sin(t * 0.9) * 0.09;

    ring1.rotation.z = t * 0.35; ring2.rotation.z = -t * 0.22;
    orb1.position.set(2.55, 0, 0); orb2.position.set(3.15, 0, 0);
    ring1.rotation.y = 0.2 + tx * 0.2; ring2.rotation.x = 1.05 + ty * 0.2;

    for (var i = 0; i < floaters.length; i++) {
      var f = floaters[i], u = f.userData;
      f.rotation.x = t * 0.5 * u.speed; f.rotation.y = t * 0.7 * u.speed;
      f.position.y = u.y0 + Math.sin(t * u.speed + u.ph) * 0.22;
    }

    points.rotation.y = t * 0.02 + tx * 0.08;
    points.rotation.x = ty * 0.05;
    glow.material.opacity = 0.75 + Math.sin(t * 1.2) * 0.15;
    lOrange.position.x = 4 + Math.sin(t * 0.7) * 2;
    shineMat.uniforms.time.value = t;

    renderer.render(scene, camera);
  }

  function loop() {
    cancelAnimationFrame(raf);
    (function tick() {
      if (!running || document.hidden) return;
      frame();
      raf = requestAnimationFrame(tick);
    })();
  }
  loop();
})();
