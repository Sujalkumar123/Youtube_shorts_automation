// Boot: fonts → script + timing → captions → shots. Then draw(t) renders film time t (pure function of t).
// window.OP is the API tools/capture.mjs drives: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots().
import { W, H, setCtx, ctx, clamp, eo, eio } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList } from './core/captions.js';
import { buildShots } from './shots.js';

const cv = document.getElementById('cv');
setCtx(cv.getContext('2d'));
const OP = (window.OP = { ready: false });

function drawBrand() {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 0.92;
  ctx.font = '700 34px Martel'; const label = 'Untold Stories', tw = ctx.measureText(label).width, x = 44, y = 74, h = 62, w = tw + 92;
  ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4;
  ctx.fillStyle = 'rgba(14,16,40,0.72)'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 31); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  ctx.strokeStyle = 'rgba(242,193,78,0.85)'; ctx.lineWidth = 2.5; ctx.stroke();
  ctx.fillStyle = '#A8322D'; ctx.beginPath(); ctx.arc(x + 32, y + h / 2, 17, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#F6D98A'; ctx.font = '700 22px Martel'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('U', x + 32, y + h / 2 + 2);
  ctx.font = '700 34px Martel'; ctx.textAlign = 'left'; ctx.fillStyle = '#F6D98A'; ctx.fillText(label, x + 60, y + h / 2 + 3);
  ctx.restore();
}

function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const S = OP._shots; let i = S.length - 1; while (i > 0 && S[i].at > t) i--;
  const sh = S[i], end = i < S.length - 1 ? S[i + 1].at : T.dur, d = end - sh.at, lt = t - sh.at;
  // camera: punch-in on the cut + a slow push across the shot ("camera always moving")
  const punch = 1 + 0.06 * (1 - eo(clamp(lt / 0.25)));
  const drift = 1 + (sh.zoom ?? 0.06) * eio(clamp(lt / d));
  const [cx, cy] = sh.cam || [540, 900];
  ctx.save(); ctx.translate(cx, cy); ctx.scale(punch * drift, punch * drift); ctx.translate(-cx, -cy);
  sh.draw(lt, d, t);
  ctx.restore();
  ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  // film grain (cached noise tiles, changes every frame)
  if (!OP._grain) { OP._grain = [0, 1, 2, 3].map((k) => { const c = document.createElement('canvas'); c.width = 360; c.height = 640; const g = c.getContext('2d'), im = g.createImageData(360, 640); let sd = 1234 + k * 999; for (let i = 0; i < im.data.length; i += 4) { sd = (sd * 16807) % 2147483647; const v = sd % 256; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; } g.putImageData(im, 0, 0); return c; }); }
  ctx.save(); ctx.globalAlpha = 0.05; ctx.globalCompositeOperation = 'overlay'; ctx.imageSmoothingEnabled = false; ctx.drawImage(OP._grain[Math.floor(t * 10) % 4], 0, 0, W, H); ctx.restore();

  // channel watermark: Untold Stories (top-left, clear of the Shorts UI)
  drawBrand();
  // fade from / to black on the first and last 0.25 s
  const fade = Math.min(clamp(t / 0.25), clamp((T.dur - t) / 0.35));
  if (fade < 1) { ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - fade; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  drawCaption(t);
}

(async () => {
  try {
    await document.fonts.load('900 100px Inter'); await document.fonts.load('700 100px Caladea'); await document.fonts.load('700 100px Martel', 'गंगा Untold');
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming();
    buildCaptions(script);
    const { shots, cues } = buildShots();
    shots.sort((a, b) => a.at - b.at);
    OP._shots = shots; OP.script = script;
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
