(function () {
  var $ = function (s) { return document.querySelector(s) };

  // floating petals, hearts & golden sparkles
  var icons = ['🌸', '💖', '✨', '🌷', '💛', '👑', '💫'];
  for (var i = 0; i < 20; i++) {
    var f = document.createElement('div'); f.className = 'float';
    f.textContent = icons[i % icons.length];
    f.style.left = Math.random() * 100 + 'vw';
    f.style.fontSize = (14 + Math.random() * 20) + 'px';
    f.style.animationDuration = (9 + Math.random() * 10) + 's';
    f.style.animationDelay = (-Math.random() * 15) + 's';
    document.body.appendChild(f);
  }

  // confetti (with golden accents)
  var cv = $('#confetti'), cx = cv.getContext('2d'), P = [], run = false;
  function size() { cv.width = innerWidth; cv.height = innerHeight }
  size(); addEventListener('resize', size);
  var cols = ['#ff7aa8', '#b995ff', '#ffd36e', '#f7b733', '#7fd8ff', '#ffffff', '#ff9ecb'];
  function burst(n) {
    if (n >= 140) sfx('big');
    for (var i = 0; i < n; i++) {
      P.push({
        x: innerWidth / 2, y: innerHeight * .45, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4,
        s: 4 + Math.random() * 6, c: cols[i % cols.length], r: Math.random() * 6, vr: (Math.random() - .5) * .4, l: 1
      });
    }
    if (!run) { run = true; requestAnimationFrame(tick) }
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height);
    P = P.filter(function (p) { return p.l > 0 && p.y < cv.height + 20 });
    P.forEach(function (p) {
      p.vy += .3; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.l -= .004;
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.globalAlpha = Math.max(p.l, 0);
      cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); cx.restore();
    });
    if (P.length) requestAnimationFrame(tick); else run = false;
  }

  // animated milestone counters
  function animateCounter(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseInt(el.dataset.target, 10), dur = 1600, start = performance.now();
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(step);
  }

  // scroll reveal
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        if (!e.target.classList.contains('in') && e.target.tagName === 'H2') sfx('sect');
        e.target.classList.add('in');
        e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      }
    });
  }, { threshold: .2 });
  function watch() { document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el) }) }

  // open surprise
  $('#open').addEventListener('click', function () {
    document.querySelectorAll('.hidden').forEach(function (el) { el.classList.remove('hidden') });
    watch(); burst(160); startBgm();
    setTimeout(function () { $('#cakeSec').scrollIntoView({ behavior: 'smooth' }) }, 250);
  });

  // blow candles
  $('#cake').addEventListener('click', function () {
    var c = $('#cake');
    if (!c.classList.contains('out')) {
      c.classList.add('out'); $('#wish').classList.add('show'); burst(220);
    } else { c.classList.remove('out'); $('#wish').classList.remove('show') }
  });
  $('#again').addEventListener('click', function () { burst(250); window.scrollTo({ top: 0, behavior: 'smooth' }) });

  // countdown
  function cd() {
    var n = new Date(), t = new Date(n.getFullYear(), 10, 25), el = $('#count');
    var d = t - n;
    if (d <= 0 && d > -864e5) { el.textContent = '✨ Happy 25th Golden Birthday — It’s Today! ✨'; return }
    if (d <= -864e5) { t = new Date(n.getFullYear() + 1, 10, 25); d = t - n }
    var h = Math.floor(d / 36e5), dd = Math.floor(h / 24);
    el.textContent = '⏳ ' + (dd > 0 ? dd + ' days ' : '') + (h % 24) + ' hrs ' + Math.floor(d / 6e4) % 60 + ' min until your 25th!';
  }
  cd(); setInterval(cd, 30000);

  // balloons
   var msgs = ['You deserve all the happiness in the world 🌍', 'Never stop being the crazy person you are! 😂', 'Thank you for being my safe place 🏡', 'May this year be your best one yet 🚀', 'You’re stronger than you know 💪', 'Lucky to have a bestie like you! 🍀', 'Dream big — I’m cheering for you 📣', 'You’re a gift, Deepa 🎁'];
  var bb = $('#balloons');
  msgs.forEach(function (m, i) {
    var b = document.createElement('button'); b.className = 'balloon'; b.setAttribute('aria-label', 'Pop balloon');
    b.style.background = i % 3 === 0
      ? 'linear-gradient(135deg, #ffe89e, #f7b733)'
      : 'hsl(' + (i * 47 + 330) % 360 + ',80%,72%)';
    b.addEventListener('click', function () { b.classList.add('pop'); $('#pop').textContent = m; burst(45) });
    bb.appendChild(b);
  });

  // flip cards
  document.querySelectorAll('.flip').forEach(function (c) { c.addEventListener('click', function () { c.classList.toggle('on') }) });

  // birthday song
  var ac, playing = false;
  var song = [[261.63, .75], [261.63, .25], [293.66, 1], [261.63, 1], [349.23, 1], [329.63, 2], [261.63, .75], [261.63, .25], [293.66, 1], [261.63, 1], [392, 1], [349.23, 2], [261.63, .75], [261.63, .25], [523.25, 1], [440, 1], [349.23, 1], [329.63, 1], [293.66, 2], [466.16, .75], [466.16, .25], [440, 1], [349.23, 1], [392, 1], [349.23, 2]];
  $('#song').addEventListener('click', function () {
    if (playing) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); playing = true;
      var t = ac.currentTime + .05, beat = .42;
      song.forEach(function (n) {
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle'; o.frequency.value = n[0];
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.25, t + .03); g.gain.exponentialRampToValueAtTime(.001, t + n[1] * beat);
        o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + n[1] * beat + .05); t += n[1] * beat;
      });
      burst(80);
      setTimeout(function () { playing = false }, (t - ac.currentTime) * 1000);
    } catch (e) { playing = false }
  });

  // sparkle trail
  var last = 0;
  addEventListener('pointermove', function (e) {
    var now = Date.now(); if (now - last < 70) return; last = now;
    var s = document.createElement('span'); s.className = 'spark'; s.textContent = ['✨', '💛', '🌸'][Math.floor(Math.random() * 3)];
    s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px'; document.body.appendChild(s); if (Math.random() < .12) sfx('twinkle');
    setTimeout(function () { s.remove() }, 900);
  });

  // theme toggle
  $('#theme').addEventListener('click', function () {
    var r = document.documentElement, a = r.getAttribute('data-theme');
    var dark = a ? a === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    r.setAttribute('data-theme', dark ? 'light' : 'dark');
  });

  // Spinning 25th Birthday Wheel
  var wc = $('#wheelCanvas'), wx = wc.getContext('2d');
 var slices = [
  { label: '🍔 Burger Treat', color: '#ff9ecb' },
  { label: '🍫 Chocolate Gift', color: '#ffd36e' },
  { label: '📸 Funny Selfie', color: '#b995ff' },
  { label: '😂 Roast Battle', color: '#ffb6cf' },
  { label: '🎤 Sing a Song', color: '#ffe082' },
  { label: '🤝 Bestie Promise', color: '#c9a8ff' }
];
  var arc = (2 * Math.PI) / slices.length, wheelAngle = 0, spinning = false;
  function drawWheel() {
    wx.clearRect(0, 0, 280, 280);
    slices.forEach(function (sl, i) {
      var a = i * arc;
      wx.beginPath();
      wx.moveTo(140, 140);
      wx.arc(140, 140, 136, a, a + arc);
      wx.fillStyle = sl.color;
      wx.fill();
      wx.strokeStyle = 'rgba(255,255,255,0.7)';
      wx.lineWidth = 2;
      wx.stroke();

      wx.save();
      wx.translate(140, 140);
      wx.rotate(a + arc / 2);
      wx.textAlign = 'right';
      wx.fillStyle = '#4a2c4a';
      wx.font = '600 13px Poppins, sans-serif';
      wx.fillText(sl.label, 122, 5);
      wx.restore();
    });
    wx.beginPath();
    wx.arc(140, 140, 22, 0, 2 * Math.PI);
    wx.fillStyle = '#fff';
    wx.fill();
    wx.fillStyle = '#d99b26';
    wx.font = '700 13px Poppins, sans-serif';
    wx.textAlign = 'center';
    wx.fillText('25', 140, 145);
  }
  drawWheel();

  $('#spinBtn').addEventListener('click', function () {
    if (spinning) return;
    spinning = true;
    $('#wheelResult').textContent = 'Spinning for your 25th treat… ✨';
    sfx('start');
    var extra = 1440 + Math.floor(Math.random() * 360);
    wheelAngle += extra;
    wc.style.transform = 'rotate(' + wheelAngle + 'deg)';
    setTimeout(function () {
      spinning = false;
      var deg = (360 - (wheelAngle % 360) + 270) % 360;
      var idx = Math.floor(deg / (360 / slices.length));
      $('#wheelResult').textContent = '🎉 You won: ' + slices[idx].label + '!';
      burst(120);
      sfx('win');
    }, 4250);
  });

  // scratch card (golden shimmer)
  var sc = $('#sc'), sx = sc.getContext('2d'), sdraw = false, sdone = false;
  var gr = sx.createLinearGradient(0, 0, 300, 500);
  gr.addColorStop(0, '#ffd36e');
  gr.addColorStop(.5, '#ff9ecb');
  gr.addColorStop(1, '#b995ff');
  sx.fillStyle = gr; sx.fillRect(0, 0, 300, 500); sx.fillStyle = '#fff'; sx.font = '600 18px Poppins,sans-serif'; sx.textAlign = 'center';
  sx.fillText('✨ Scratch Golden Ticket ✨', 150, 100);
  function scr(e) {
    if (!sdraw || sdone) return;
    var r = sc.getBoundingClientRect(), x = (e.clientX - r.left) * 300 / r.width, y = (e.clientY - r.top) * 500 / r.height;
    sx.globalCompositeOperation = 'destination-out'; sx.beginPath(); sx.arc(x, y, 20, 0, 7); sx.fill();
  }
  function scheck() {
    var d = sx.getImageData(0, 0, 280, 150).data, c = 0, t = 0;
    for (var i = 3; i < d.length; i += 64) { t++; if (d[i] === 0) c++ }
    if (c / t > .45) { sdone = true; sc.style.opacity = 0; sc.style.pointerEvents = 'none'; burst(150) }
  }
  sc.addEventListener('pointerdown', function (e) { sdraw = true; try { sc.setPointerCapture(e.pointerId) } catch (x) { } scr(e) });
  sc.addEventListener('pointermove', scr);
  ['pointerup', 'pointercancel'].forEach(function (n) { sc.addEventListener(n, function () { sdraw = false; if (!sdone) scheck() }) });

  // heart catching game
  var ar = $('#arena'), st = $('#stat'), score = 0, tl = 0, gon = false, sp, tm;
  function upd() { st.textContent = '💛 ' + score + '   ⏱ ' + tl + 's' }
  function endGame() {
    clearInterval(sp); clearInterval(tm); gon = false;
    st.textContent = 'You caught ' + score + ' hearts! ' + (score >= 25 ? '25+ Golden Champion! 👑' : score >= 12 ? 'Amazing! 🎉' : 'So sweet! 💖');
    burst(120); sfx(score >= 12 ? 'win' : 'try');
  }
  $('#start').addEventListener('click', function () {
    if (gon) return; gon = true; score = 0; tl = 20; ar.innerHTML = ''; upd();
    sp = setInterval(function () {
      var b = document.createElement('button'); b.className = 'hp';
      b.textContent = ['💛', '💖', '✨', '🩷', '👑'][Math.floor(Math.random() * 5)];
      b.style.left = Math.random() * (ar.clientWidth - 48) + 'px';
      b.style.animationDuration = (2 + Math.random() * 1.6) + 's';
      b.addEventListener('pointerdown', function () { if (!gon) return; score++; upd(); b.remove() });
      b.addEventListener('animationend', function () { if (gon) sfx('miss'); b.remove() });
      ar.appendChild(b);
    }, 500);
    tm = setInterval(function () { tl--; upd(); if (tl <= 0) endGame() }, 1000);
  });

  // gift boxes (all 3 boxes!)
  var gifts = [
    'A 25th year overflowing with unstoppable laughter 😂',
    'Endless golden moments & big dreams coming true ✨',
    'A lifetime VIP pass to my friendship & support 👑'
  ], emo = ['🧸', '💐', '👑'];
  document.querySelectorAll('.gift').forEach(function (g, i) {
    g.addEventListener('click', function () {
      if (g.classList.contains('open')) return;
      g.classList.add('open'); g.textContent = emo[i]; $('#giftMsg').textContent = gifts[i]; burst(70);
    });
  });

  // wish to the stars
  function sendWish() {
    var inp = $('#wishIn'), v = inp.value.trim(); if (!v) return;
    var w = document.createElement('div'); w.className = 'wstar'; w.textContent = '✨ ' + v + ' ✨';
    document.body.appendChild(w); setTimeout(function () { w.remove() }, 3600);
    inp.value = ''; burst(60); sfx('wish');
  }
  $('#wishGo').addEventListener('click', sendWish);
  $('#wishIn').addEventListener('keydown', function (e) { if (e.key === 'Enter') sendWish() });

  // time capsule
  var capSaved = localStorage.getItem('deepa_25_capsule');
  if (capSaved) $('#capSaved').textContent = '🔒 Sealed memory: “' + capSaved + '”';
  $('#capSave').addEventListener('click', function () {
    var v = $('#capIn').value.trim();
    if (!v) return;
    try { localStorage.setItem('deepa_25_capsule', v); } catch (e) { }
    $('#capSaved').textContent = '🔒 Sealed for your 25th year: “' + v + '”';
    $('#capIn').value = '';
    burst(90);
    sfx('wish');
  });

  // ---- soft background music + typing sound ----
  var bgmOn = false, bar = 0;
  var chords = [[261.63, 329.63, 392], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]];
  function bgmBar() {
    if (document.hidden || playing) return;
    var c = chords[bar % 4], pat = [0, 1, 2, 1, 0, 1, 2, 1]; bar++;
    tn(c[0] / 2, 1.8, 'sine', .05, 0);
    pat.forEach(function (k, j) { tn(c[k] * 2, .7, 'sine', .035, j * .5) });
  }
  function startBgm() { if (bgmOn) return; bgmOn = true; bgmBar(); setInterval(bgmBar, 4000) }
  $('#wishIn').addEventListener('input', function () { sfx('type') });
  $('#capIn').addEventListener('input', function () { sfx('type') });

  // ---- sound effects (Web Audio, no files) ----
  var actx, muted = false, lastTick = 0;
  function A() {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); return actx } catch (e) { return null }
  }
  function tn(f, d, type, v, delay, slide) {
    var c = A(); if (!c || muted) return;
    var t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v || .15, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .05);
  }
  function ns(d, v, lp) {
    var c = A(); if (!c || muted) return;
    var n = Math.floor(c.sampleRate * d), b = c.createBuffer(1, n, c.sampleRate), a = b.getChannelData(0);
    for (var i = 0; i < n; i++)a[i] = (Math.random() * 2 - 1) * (1 - i / n);
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'lowpass'; f.frequency.value = lp || 2000; g.gain.value = v || .2;
    s.buffer = b; s.connect(f); f.connect(g); g.connect(c.destination); s.start();
  }
  function sfx(k, x) {
    if (k === 'pop') { var p = 280 + Math.random() * 320; ns(.12, .4, 3500); tn(p, .1, 'sine', .18, 0, p / 3) }
    else if (k === 'ping') { tn(700 + Math.random() * 500, .28, 'sine', .16) }
    else if (k === 'flip') { tn(320, .08, 'square', .05, 0, 180); tn(520, .08, 'triangle', .08, .05) }
    else if (k === 'gift') { var m = [1, 1.122, 1.335][x || 0];[523, 659, 784, 1047].forEach(function (f, i) { tn(f * m, .3, 'triangle', .14, i * .09) }) }
    else if (k === 'blow') { ns(.9, .3, 1200) }
    else if (k === 'wish') { [880, 1175, 1568, 2093].forEach(function (f, i) { tn(f, .35, 'sine', .09, i * .08) }) }
    else if (k === 'start') { tn(440, .12, 'triangle', .14); tn(660, .22, 'triangle', .14, .12) }
    else if (k === 'click') { tn(600, .06, 'sine', .1) }
    else if (k === 'tick') { ns(.05, .1, 1800) }
    else if (k === 'applause') { for (var q = 0; q < 12; q++)setTimeout(function () { ns(.06 + Math.random() * .05, .12, 3500 + Math.random() * 2000) }, q * 70 + Math.random() * 60) }
    else if (k === 'win') { [523, 659, 784, 1047, 1319, 1568].forEach(function (f, i) { tn(f, .35, 'triangle', .13, i * .1) }) }
    else if (k === 'try') { [440, 392, 349].forEach(function (f, i) { tn(f, .3, 'sine', .12, i * .14) }) }
    else if (k === 'type') { tn(900 + Math.random() * 300, .04, 'sine', .04) }
    else if (k === 'sect') { tn(1318, .4, 'sine', .05); tn(1760, .5, 'sine', .04, .08) }
    else if (k === 'twinkle') { tn(1500 + Math.random() * 1200, .2, 'sine', .035) }
    else if (k === 'miss') { tn(180, .12, 'sine', .05, 0, 90) }
    else if (k === 'big') { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tn(f, .7, 'triangle', .12, i * .07) }); ns(.5, .15, 5000) }
  }
  document.addEventListener('pointerdown', function (e) {
    A();
    var t = e.target.closest ? e.target.closest('.balloon,.hp,.flip,.gift,#cake,#start,#theme') : null;
    if (!t) return;
    if (t.classList.contains('balloon')) { if (!t.classList.contains('pop')) sfx('pop') }
    else if (t.classList.contains('hp')) sfx('ping');
    else if (t.classList.contains('flip')) sfx('flip');
    else if (t.classList.contains('gift')) { if (!t.classList.contains('open')) sfx('gift', Array.prototype.indexOf.call(document.querySelectorAll('.gift'), t)) }
    else if (t.id === 'cake') { if (!t.classList.contains('out')) { sfx('blow'); setTimeout(function () { sfx('applause') }, 900) } }
    else if (t.id === 'start') sfx('start');
    else sfx('click');
  }, true);
  sc.addEventListener('pointermove', function () {
    var n = Date.now(); if (sdraw && !sdone && n - lastTick > 70) { lastTick = n; sfx('tick') }
  });
  $('#snd').addEventListener('click', function () {
    muted = !muted; this.textContent = muted ? '🔇' : '🔊';
    if (!muted) sfx('click');
  });

  // ---- scroll progress ----
  var pg = $('#prog');
  addEventListener('scroll', function () { var h = document.documentElement; pg.style.width = (scrollY / ((h.scrollHeight - innerHeight) || 1) * 100) + '%' }, { passive: true });

  // ---- memory match ----
  var mg = $('#mem'), mf = ['👑', '💖', '🎂', '🦋', '🍰', '✨'], mo = [], mlock = false, mm = 0, mdone = 0;
  function mset() {
    mg.innerHTML = ''; mm = 0; mdone = 0; mo = []; mlock = false; $('#memStat').textContent = 'Find all the golden pairs 💕';
    mf.concat(mf).sort(function () { return Math.random() - .5 }).forEach(function (e) {
      var b = document.createElement('button'); b.className = 'mc'; b.dataset.e = e; b.setAttribute('aria-label', 'Memory card');
      b.innerHTML = '<i class="f">❔</i><i class="b">' + e + '</i>';
      b.addEventListener('click', function () {
        if (mlock || b.classList.contains('on')) return;
        b.classList.add('on'); sfx('flip'); mo.push(b);
        if (mo.length === 2) {
          mm++; var a = mo[0], c = mo[1]; mo = [];
          if (a.dataset.e === c.dataset.e) {
            mdone++; sfx('ping');
            if (mdone === 6) { $('#memStat').textContent = 'All matched in ' + mm + ' moves! 🏆'; burst(150); sfx('win') }
          } else { mlock = true; setTimeout(function () { a.classList.remove('on'); c.classList.remove('on'); mlock = false }, 800) }
        }
      });
      mg.appendChild(b);
    });
  }
  mset(); $('#memReset').addEventListener('click', mset);

  // ---- fortune cookie ----
var fo = [
  'Your year will be full of fun, laughter and crazy memories! 🎉',
  'Good luck, good vibes and lots of happiness are coming your way! 🍀',
  'Your dreams are getting closer, so keep working hard! 🌟',
  'More success, more smiles and fewer problems await you! 😂',
  'A year full of surprises, adventures and unforgettable friendship! 🥳'
];
  $('#fortuneGo').addEventListener('click', function () {
    var m = $('#fortune'); m.classList.remove('show'); void m.offsetWidth;
    m.textContent = fo[Math.floor(Math.random() * fo.length)]; m.classList.add('show'); burst(50); sfx('wish');
  });

  // ---- fireworks finale ----
  var fc = $('#fw'), fx = fc.getContext('2d'), F = [], frun = false;
  function fsz() { fc.width = innerWidth; fc.height = innerHeight }
  fsz(); addEventListener('resize', fsz);
  function shell() {
    var x = innerWidth * (.15 + Math.random() * .7), y = innerHeight * (.15 + Math.random() * .35);
    var h = Math.random() < .5 ? 45 : Math.random() * 360; // extra golden shells!
    for (var i = 0; i < 48; i++) { var a = i / 48 * 6.283, v = 2 + Math.random() * 3.5; F.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, l: 1, h: h }) }
    sfx('pop'); if (!frun) { frun = true; requestAnimationFrame(ftick) }
  }
  function ftick() {
    fx.clearRect(0, 0, fc.width, fc.height);
    F = F.filter(function (p) { return p.l > 0 });
    F.forEach(function (p) {
      p.vy += .04; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.l -= .012;
      fx.globalAlpha = Math.max(p.l, 0); fx.fillStyle = 'hsl(' + p.h + ',92%,65%)'; fx.beginPath(); fx.arc(p.x, p.y, 2.5, 0, 7); fx.fill();
    });
    if (F.length) requestAnimationFrame(ftick); else frun = false;
  }
  $('#fwGo').addEventListener('click', function () { for (var i = 0; i < 10; i++) setTimeout(shell, i * 400); sfx('big') });
})();
