// Boot: fonts → script + timing → captions → shots. Then draw(t) renders film time t (pure function of t).
// window.OP is the API tools/capture.mjs drives: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots().
import { W, H, setCtx, ctx, clamp, eo, eio } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList, CAP } from './core/captions.js';
import { buildShots } from './shots.js';
import { STYLE } from './core/kit.js';

const cv = document.getElementById('cv');
setCtx(cv.getContext('2d'));
const OP = (window.OP = { ready: false });

function drawBrand() {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.92;
  ctx.font = '700 34px Martel'; const label = (OP.script && OP.script.brand) || 'Untold Stories', tw = ctx.measureText(label).width, x = 44, y = 74, h = 62, w = tw + 92;
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
  ctx.fillStyle = 'rgba(14,16,40,0.72)'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 31); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(242,193,78,0.85)'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = '#A8322D'; ctx.beginPath(); ctx.arc(x + 32, y + h / 2, 17, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#F6D98A'; ctx.font = '700 22px Martel'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label[0], x + 32, y + h / 2 + 2);
  ctx.font = '700 34px Martel'; ctx.textAlign = 'left'; ctx.fillStyle = '#F6D98A'; ctx.fillText(label, x + 60, y + h / 2 + 3);
  ctx.restore();
}


// Pattachitra frame: cream patta band with ink + vermilion rules and a running flower/dot motif (style "pattachitra")
function pattaFrame() {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const b = 26;
  ctx.fillStyle = '#EFE0BC'; ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(W - b, b, -(W - 2 * b), H - 2 * b); ctx.fill('evenodd');
  ctx.strokeStyle = '#1C120B'; ctx.lineWidth = 4; ctx.strokeRect(b, b, W - 2 * b, H - 2 * b);
  ctx.strokeStyle = '#B5321F'; ctx.lineWidth = 3; ctx.strokeRect(7, 7, W - 14, H - 14);
  const dot = (x, y, k) => { ctx.fillStyle = k % 2 ? '#B5321F' : '#1C120B'; ctx.beginPath(); ctx.arc(x, y, k % 2 ? 4.5 : 3, 0, Math.PI * 2); ctx.fill(); if (k % 4 === 1) { ctx.fillStyle = '#D9A12E'; for (let a = 0; a < 4; a++) { ctx.beginPath(); ctx.ellipse(x + Math.cos(a * Math.PI / 2) * 7, y + Math.sin(a * Math.PI / 2) * 7, 3.2, 3.2, 0, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#B5321F'; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2); ctx.fill(); } };
  let k = 0; for (let x = 30; x < W - 20; x += 30) { dot(x, 16.5, k); dot(x, H - 16.5, k++); }
  k = 0; for (let y = 50; y < H - 40; y += 30) { dot(16.5, y, k); dot(W - 16.5, y, k++); }
  ctx.restore();
}

// ── cinematic layer (engine-wide, every video): transitions, impact shake/flash, handheld sway, grade, light leak, dust ──
// Per shot (optional): trans: 'fade'|'flash'|'whip'|'zoom'|'dip'|'cut' (default chosen from the cue at the cut), fx: false to skip the grade.
const TR = 0.32;                                                // transition length (s)
const IMPACT = { drum: 1, slam: 1, thud: 0.8, damru: 0.35 }, BLOOM = { bell: 1, conch: 0.8, sparkle: 0.5 };
let mainCtx = null, offA = null, offB = null;
function off() { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; }
function camera(sh, lt, d, t) {
  const punch = 1 + 0.06 * (1 - eo(clamp(lt / 0.25)));
  const drift = 1 + (sh.zoom ?? 0.06) * eio(clamp(lt / d));
  const [cx, cy] = sh.cam || [540, 900];
  // handheld sway + impact shake from the sound cues
  let sx = Math.sin(t * 0.71) * 5 + Math.sin(t * 1.37) * 2, sy = Math.sin(t * 0.53) * 4, rot = Math.sin(t * 0.41) * 0.0025;
  for (const c of OP._impacts) { const dt = t - c.t; if (dt < 0 || dt > 0.45) continue; const a = c.k * Math.exp(-dt * 9); sx += Math.sin(dt * 90) * 16 * a; sy += Math.cos(dt * 77) * 12 * a; rot += Math.sin(dt * 60) * 0.006 * a; }
  ctx.translate(cx + sx, cy + sy); ctx.rotate(rot); ctx.scale(punch * drift, punch * drift); ctx.translate(-cx, -cy);
}
function renderShot(i, lt, t, target) {
  const S = OP._shots, sh = S[i], end = i < S.length - 1 ? S[i + 1].at : T.dur, d = end - sh.at;
  const g = target.getContext('2d'); setCtx(g);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.letterSpacing = '0px'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.save(); camera(sh, clamp(lt, 0, d), d, t); sh.draw(clamp(lt, 0, d), d, t); g.restore();
  setCtx(mainCtx);
}
function autoTrans(sh) {
  if (sh.trans) return sh.trans;
  const c = OP._cueList.find((c) => Math.abs(c.t - sh.at) < 0.25);
  if (c && IMPACT[c.type] >= 0.8) return 'flash';
  if (c && c.type === 'whoosh') return 'whip';
  if (c && (c.type === 'swell' || c.type === 'conch')) return 'zoom';
  return 'fade';
}
function grade(t, sh) {
  if (sh.fx === false) return;
  ctx.save();
  if (STYLE.patta) { // warm cream patta wash (Pattachitra palette: ochre / vermilion / indigo on cream)
    ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.3; ctx.fillStyle = '#F2DFB0'; ctx.fillRect(0, 0, W, H);
  } else {
  // teal shadows / warm highlights (soft-light), like a film grade
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(40,70,110,0.55)'); g.addColorStop(0.55, 'rgba(128,128,128,0)'); g.addColorStop(1, 'rgba(255,150,70,0.5)');
  ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = 0.35; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  // drifting light leak
  const lx = 540 + Math.sin(t * 0.23) * 620, ly = 500 + Math.cos(t * 0.17) * 520, r = ctx.createRadialGradient(lx, ly, 0, lx, ly, 700);
  r.addColorStop(0, 'rgba(255,170,90,0.9)'); r.addColorStop(1, 'rgba(255,170,90,0)');
  ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.10 + 0.05 * Math.sin(t * 0.9); ctx.fillStyle = r; ctx.fillRect(0, 0, W, H);
  // floating dust in the light
  ctx.globalAlpha = 1; for (let i = 0; i < 28; i++) { const sd = i * 12.9898, px = ((Math.sin(sd) * 43758.5453 % 1 + 1) % 1) * W + Math.sin(t * 0.3 + i) * 40, py = (((Math.cos(sd) * 24634.6345 % 1 + 1) % 1) * H - t * (12 + i % 5 * 6)) % H; const yy = py < 0 ? py + H : py; ctx.fillStyle = `rgba(255,236,190,${0.12 + 0.12 * Math.sin(t * 2 + i)})`; ctx.beginPath(); ctx.arc(px, yy, 1.5 + (i % 3), 0, Math.PI * 2); ctx.fill(); }
  // impact flash + bell bloom
  for (const c of OP._cueList) { const dt = t - c.t; if (dt < 0 || dt > 0.6) continue;
    if (IMPACT[c.type]) { ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.22 * IMPACT[c.type] * Math.exp(-dt * 10); ctx.fillStyle = '#FFE2B0'; ctx.fillRect(0, 0, W, H); }
    if (BLOOM[c.type]) { const b = ctx.createRadialGradient(540, 800, 0, 540, 800, 900); b.addColorStop(0, 'rgba(255,220,150,1)'); b.addColorStop(1, 'rgba(255,220,150,0)'); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.16 * BLOOM[c.type] * Math.sin(Math.PI * dt / 0.6); ctx.fillStyle = b; ctx.fillRect(0, 0, W, H); } }
  ctx.restore();
}

function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  if (!mainCtx) { mainCtx = ctx; offA = off(); offB = off(); }
  setCtx(mainCtx); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'; ctx.letterSpacing = '0px';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const S = OP._shots; let i = S.length - 1; while (i > 0 && S[i].at > t) i--;
  const sh = S[i], lt = t - sh.at, tr = i > 0 ? autoTrans(sh) : 'cut', k = clamp(lt / TR);
  renderShot(i, lt, t, offA);
  if (i > 0 && k < 1 && tr !== 'cut') {
    const p = S[i - 1]; renderShot(i - 1, sh.at - p.at + lt, t, offB);
    const e = eio(k);
    if (tr === 'whip') { for (let j = 0; j < 4; j++) { ctx.globalAlpha = 0.3; ctx.drawImage(offB, -e * W * 0.9 - j * 26, 0); ctx.drawImage(offA, (1 - e) * W * 0.9 + j * 26, 0); } ctx.globalAlpha = 1; ctx.drawImage(offA, (1 - e) * W * 0.9, 0); }
    else if (tr === 'zoom') { ctx.drawImage(offB, 0, 0); ctx.globalAlpha = e; const z = 1.25 - 0.25 * e; ctx.drawImage(offA, W / 2 - W * z / 2, H / 2 - H * z / 2, W * z, H * z); }
    else if (tr === 'dip') { if (e < 0.5) { ctx.drawImage(offB, 0, 0); ctx.globalAlpha = e * 2; } else { ctx.drawImage(offA, 0, 0); ctx.globalAlpha = 2 - e * 2; } ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); }
    else { ctx.drawImage(offB, 0, 0); ctx.globalAlpha = e; ctx.drawImage(offA, 0, 0); }
    ctx.globalAlpha = 1;
    if (tr === 'flash') { ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = 0.85 * (1 - e); ctx.fillStyle = '#FFF1D6'; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; }
  } else ctx.drawImage(offA, 0, 0);
  grade(t, sh);
  ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  // film grain (cached noise tiles)
  if (!OP._grain) { OP._grain = [0, 1, 2, 3].map((k) => { const c = document.createElement('canvas'); c.width = 360; c.height = 640; const g = c.getContext('2d'), im = g.createImageData(360, 640); let sd = 1234 + k * 999; for (let i = 0; i < im.data.length; i += 4) { sd = (sd * 16807) % 2147483647; const v = sd % 256; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); return c; }); }
  ctx.save(); ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = 'overlay'; ctx.imageSmoothingEnabled = false; ctx.drawImage(OP._grain[Math.floor(t * 10) % 4], 0, 0, W, H); ctx.restore();
  if (STYLE.patta) pattaFrame();
  if (OP.script && OP.script.brand_badge) drawBrand();
  const fade = Math.min(clamp(t / 0.25), clamp((T.dur - t) / 0.35));
  if (fade < 1) { ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - fade; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  CAP.y = sh.capY ?? 1400;   // per shot: put the caption in an empty part of the frame (shot.capY)
  drawCaption(t);
}

(async () => {
  try {
    await document.fonts.load('900 100px Inter'); await document.fonts.load('700 100px Caladea'); await document.fonts.load('700 100px Martel', 'गंगा Untold');
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming();
    STYLE.patta = script.style === 'pattachitra';
    buildCaptions(script);
    const { shots, cues } = buildShots();
    shots.sort((a, b) => a.at - b.at);
    OP._shots = shots; OP.script = script;
    OP._cueList = cues.slice().sort((a, b) => a.t - b.t); OP._impacts = OP._cueList.filter((c) => IMPACT[c.type]).map((c) => ({ t: c.t, k: IMPACT[c.type] * (c.gain ?? 1) }));
    OP.duration = () => T.dur;
    OP.draw = draw;
    OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, at: +s.at.toFixed(3), end: +(i < shots.length - 1 ? shots[i + 1].at : T.dur).toFixed(3), note: s.note || '' }));
    OP.captions = () => captionList().map((c) => ({ s: +c.s.toFixed(3), e: +c.e.toFixed(3), text: c.words.map((w) => (w.hi ? '*' : '') + w.txt).join(' ') }));
    OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.ready = true;
    // preview mode (not capture): play in real time, ?t=12.3 to hold a frame
    const q = new URLSearchParams(location.search);
    if (!q.has('capture')) {
      if (q.has('t')) draw(+q.get('t'));
      else {
        const audio = new Audio('data/mix.wav'); let t0 = null;
        const btn = document.getElementById('play'); btn.hidden = false;
        btn.onclick = () => { btn.hidden = true; t0 = performance.now(); audio.currentTime = 0; audio.play().catch(() => {}); };
        const loop = (now) => { const t = t0 == null ? 0 : (now - t0) / 1000; draw(t0 == null ? 0 : t); if (t0 != null && t > T.dur) { t0 = null; btn.hidden = false; } requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      }
    }
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
