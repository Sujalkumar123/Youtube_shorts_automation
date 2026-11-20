// गंगा धरती पर कैसे आईं? v2: cinematic cut paper. Deep skies, layered parallax, light, and a real cast.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, cloud, motes, water, diya, skyline, palm, birds, luminous, partial, polyLens, vignette } from './atmos.js';
import { raja, warrior, kapila, shiva, horse } from './cast.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

// ══════════ the map ══════════
const ll = (lon, lat) => [60 + (lon - 67) * 31, 170 + (37.5 - lat) * 36];
const INDIA = [
  [68.2, 23.7], [69.0, 22.4], [70.4, 20.9], [72.6, 21.2], [72.8, 19.0], [73.4, 16.5], [74.6, 13.0], [76.0, 10.0], [77.5, 8.1],
  [78.2, 9.0], [79.3, 10.3], [80.2, 13.1], [80.3, 15.5], [82.3, 16.6], [84.8, 19.2], [86.9, 20.8], [87.6, 21.6], [88.2, 21.5],
  [88.9, 21.9], [89.0, 23.0], [88.6, 24.2], [88.1, 25.3], [88.6, 26.3], [89.8, 26.0], [90.2, 25.3], [92.0, 25.0], [92.3, 23.6],
  [92.8, 22.1], [93.5, 23.6], [94.6, 25.1], [95.4, 26.6], [97.2, 28.2], [96.0, 29.4], [94.0, 28.9], [92.0, 27.8], [89.8, 26.9],
  [88.9, 27.9], [88.1, 27.6], [88.0, 26.6], [86.0, 26.6], [84.0, 27.4], [81.0, 28.6], [80.1, 28.9], [80.9, 30.2], [79.0, 31.2],
  [78.6, 32.6], [79.4, 33.2], [78.4, 35.0], [77.0, 35.6], [75.0, 36.8], [73.6, 36.3], [73.8, 34.3], [74.6, 32.8], [74.6, 31.0],
  [73.9, 29.9], [72.4, 28.0], [70.0, 27.9], [69.5, 26.5], [70.8, 25.4], [68.8, 24.3],
].map(([a, b]) => ll(a, b));
const GANGA = [[78.9, 31.0], [78.5, 30.3], [78.16, 29.95], [78.8, 28.6], [80.3, 26.5], [81.85, 25.43], [83.0, 25.3], [85.1, 25.6],
  [87.0, 25.2], [88.1, 24.5], [88.3, 23.1], [88.35, 22.57], [88.1, 21.65]].map(([a, b]) => ll(a, b));
const PLACES = [['गंगोत्री', 0, [-150, -55]], ['हरिद्वार', 2, [-150, 45]], ['प्रयाग', 5, [-130, -60]], ['काशी', 6, [30, 80]], ['गंगासागर', 12, [-70, 85]]];
const AYODHYA = ll(82.2, 26.8);
const GL = polyLens(GANGA), GTOT = GL[GL.length - 1], fracAt = (i) => GL[i] / GTOT;

function indiaMap(o = {}) {
  gradSky([[0, '#2A2238'], [1, '#14112A']]);
  // the map sheet, lit like candlelight
  ctx.save(); ctx.translate(540, 760); ctx.rotate(-0.012); ctx.translate(-540, -760);
  cut(P_rr(30, 100, 1020, 1300, 10), P.parch, { shadow: 1.6, edge: 0 });
  ctx.save(); ctx.beginPath(); ctx.rect(30, 100, 1020, 1300); ctx.clip(); K.parchment(o.seed || 21); ctx.restore();
  ctx.save(); ctx.globalAlpha = 0.85; ctx.fillStyle = '#8FAAA6'; ctx.fillRect(56, 126, 968, 1248); ctx.restore();
  ctx.strokeStyle = 'rgba(40,30,20,0.13)'; ctx.lineWidth = 2;
  for (let x = 56; x <= 1024; x += 121) { ctx.beginPath(); ctx.moveTo(x, 126); ctx.lineTo(x, 1374); ctx.stroke(); }
  for (let y = 126; y <= 1374; y += 124.8) { ctx.beginPath(); ctx.moveTo(56, y); ctx.lineTo(1024, y); ctx.stroke(); }
  cut(P_poly(INDIA), o.dry ? '#CDB383' : '#DCC9A0', { shadow: 1.1, edge: 6 });
  if (o.dry) { ctx.strokeStyle = 'rgba(120,85,50,0.5)'; ctx.lineWidth = 3; for (let i = 0; i < 34; i++) { const x = 230 + rnd(i + 3) * 520, y = 480 + rnd(i + 9) * 560; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 18, y + 14); ctx.lineTo(x + 6, y + 30); ctx.lineTo(x + 20, y + 44); ctx.stroke(); } }
  for (let i = 0; i < 9; i++) { const [x, y] = ll(75.5 + i * 1.5, 33.2 - i * 0.62); cut(P_poly([[x - 34, y + 22], [x, y - 32], [x + 34, y + 22]]), '#8E8270', { shadow: 0.5, edge: 3 }); cut(P_poly([[x - 13, y - 13], [x, y - 32], [x + 13, y - 13]]), '#F7F3EA', { shadow: 0, edge: 0 }); }
  ctx.strokeStyle = '#3E2C1E'; ctx.lineWidth = 5; ctx.strokeRect(56, 126, 968, 1248); ctx.lineWidth = 2; ctx.strokeRect(68, 138, 944, 1224);
  K.compass(940, 1270, 0.5);
  let head = null;
  if (o.river) { const part = partial(GANGA, o.river); if (part.length > 1) head = luminous(part, 17, o.t || 0, { glowA: 0.9 }); }
  if (o.labels) PLACES.forEach(([name, idx, off], k) => { const a = o.labels[k] || 0; if (a <= 0) return; const [x, y] = GANGA[idx]; circle(x, y, 11, '#3E2C1E'); K.slip(name, x + off[0], y + off[1], eob(clamp(a)) * 0.8, k % 2 ? 0.03 : -0.03, 44); });
  if (o.extra) o.extra();
  ctx.restore();
  // candlelight + vignette
  glow(700, 500, 900, '#FFB45A', 0.12, 'lighter'); vignette(0.75, '#0B0818');
  return head;
}

// ══════════ scenes ══════════
const NIGHT_SKY = [[0, '#070A1C'], [0.45, '#141C46'], [0.8, '#2C2A5E'], [1, '#4A3466']];
const DUSK_SKY = [[0, '#1B1640'], [0.35, '#4A2C5E'], [0.62, '#B4566A'], [0.8, '#E8894A'], [1, '#F5C27A']];
const DAWN_SKY = [[0, '#22305E'], [0.4, '#6C6A9A'], [0.7, '#E6A27A'], [1, '#F8D9A0']];
const HIMAL_DAWN = [[0, '#1C2550'], [0.5, '#56628F'], [0.8, '#C99AA0'], [1, '#F0C8A0']];

function heavenSky(t, a = 1) {
  gradSky([[0, '#05071A'], [0.4, '#121B4A'], [0.75, '#2B2A66'], [1, '#463470']]);
  glow(260, 420, 600, '#7B5BD6', 0.22); glow(860, 900, 700, '#3E7BD6', 0.18); glow(540, 1400, 800, '#D67B9E', 0.15);
  stars(t, 170, -200, 1700, 3, a); paperGrain(0.05, 5);
}
function himalaya(px, t, sky = HIMAL_DAWN, near = '#5B6680') {
  gradSky(sky);
  ranges([
    { y: 1040, h: 520, col: '#8E93B5', seed: 1.3, snow: 0.95, rough: 0.8 },
    { y: 1170, h: 430, col: '#6E7499', seed: 3.1, snow: 0.8, haze: 0.35 },
    { y: 1320, h: 330, col: '#555B80', seed: 5.4, snow: 0.5, haze: 0.4 },
    { y: 1480, h: 220, col: near, seed: 7.7, snow: 0, haze: 0.2 },
  ], px, '#D9C9D6');
  mist(1150, 260, '#EDE4F0', 0.3, t, 2); mist(1380, 220, '#EDE4F0', 0.25, t, 7, 20);
}
function ground(col, y = 1480) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.35)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function ashHeap(x, y, s = 1, ember = 0, t = 0) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-74, 0); ctx.quadraticCurveTo(-58, -44, -10, -58); ctx.quadraticCurveTo(44, -62, 74, 0); ctx.closePath(); }, '#7D7570', { shadow: 0.5, edge: 3 }); for (let i = 0; i < 5; i++) circle(-34 + i * 17, -18 - (i % 2) * 16, 5, '#9C948C'); if (ember > 0) for (let i = 0; i < 4; i++) circle(-30 + i * 20, -10 - (i % 2) * 12, 4 + Math.sin(t * 8 + i) * 1.5, rgba('#FF7A2E', ember)); ctx.restore(); }
function soul(x, y, r, a, col = '#BFE6FF') { glow(x, y, r, col, a); glow(x, y, r * 0.3, '#FFFFFF', a * 0.8); }
const ROWS = [[900, 0.6], [1060, 0.72], [1240, 0.85], [1440, 1.0]];
function princes(fn) { let n = 0; ROWS.forEach(([y, sc], r) => { for (let c = 0; c < 7; c++) fn(400 + c * 100 + (r % 2) * 46 - r * 26, y, sc, n++, r); }); }
function crown(x, y, s, lit) { if (lit) glow(x, y - 30 * s, 110 * s, A.gold, 0.5); cut(P_poly([[x - 44 * s, y], [x - 54 * s, y - 56 * s], [x - 22 * s, y - 26 * s], [x, y - 70 * s], [x + 22 * s, y - 26 * s], [x + 54 * s, y - 56 * s], [x + 44 * s, y]]), lit ? '#E8B13E' : '#9C8456', { shadow: 0.5, edge: 3 }); }
function torrentBand(cx, w, top, bot, t, glowA = 1) {
  const path = () => { ctx.beginPath(); ctx.moveTo(cx - w / 2, top); for (let y = top; y <= bot; y += 40) ctx.lineTo(cx - w / 2 + Math.sin(y * 0.018 + t * 9) * 18, y); ctx.quadraticCurveTo(cx, bot + 70, cx + w / 2, bot); for (let y = bot; y >= top; y -= 40) ctx.lineTo(cx + w / 2 + Math.sin(y * 0.018 + t * 9 + 2) * 18, y); ctx.closePath(); };
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = A.glowWater; ctx.shadowBlur = 80 * glowA; path(); ctx.fillStyle = rgba(A.glowWater, 0.22 * glowA); ctx.fill(); ctx.restore();
  cut(path, '#3F86B4', { shadow: 1, edge: 8 });
  ctx.save(); path(); ctx.clip(); const g = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0); g.addColorStop(0, 'rgba(255,255,255,0.05)'); g.addColorStop(0.5, rgba(A.glowWater, 0.55)); g.addColorStop(1, 'rgba(255,255,255,0.05)'); ctx.fillStyle = g; ctx.fillRect(cx - w, top, w * 2, bot - top + 80);
  ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 7; ctx.setLineDash([90, 70]); ctx.lineDashOffset = -t * 1500; for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(cx + k * w / 8, top); ctx.lineTo(cx + k * w / 8 + Math.sin(k) * 6, bot + 40); ctx.stroke(); } ctx.restore();
}
function spray(cx, y, w, t, n = 26, a = 1) { for (let i = 0; i < n; i++) { const ph = (t * 1.6 + rnd(i)) % 1, x = cx + (rnd(i * 3) - 0.5) * w * 1.6 * (0.6 + ph), yy = y - ph * 220 * rnd(i * 5) + ph * ph * 160; glow(x, yy, 40 + rnd(i) * 40, '#E8F6FF', 0.35 * (1 - ph) * a); } }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · गंगा तो स्वर्ग में बहती थीं: the river of heaven among stars and golden clouds
  add({ id: 'S01', at: 0, cam: [540, 860], zoom: 0.12, note: 'cosmic heaven, luminous celestial river, lit clouds, god rays', draw(lt, d, t) {
    heavenSky(t);
    godRays(540, -200, Math.PI * 0.3, Math.PI * 0.7, 9, 1900, A.paleGold, 0.16, t);
    cloud(200 - lt * 10, 330, 1.0, '#6E5C9A', '#C9B6F0', '#3E3270'); cloud(900 + lt * 8, 260, 0.8, '#6E5C9A', '#C9B6F0', '#3E3270');
    const pts = []; for (let x = -400; x <= W + 400; x += 40) pts.push([x, 820 + Math.sin(x * 0.0045 + 0.6 + lt * 0.15) * 110]);
    luminous(pts, 170, t, { glowA: 1, speed: 4 });
    motes(t, 40, [-100, 600, W + 100, 1050], '#DFF6FF', 0.8, 30, 2, 4);
    cloud(260 + lt * 14, 1150, 1.4, '#C98FA8', '#FFE2C2', '#7A4A78'); cloud(880 - lt * 12, 1250, 1.2, '#C98FA8', '#FFE2C2', '#7A4A78'); cloud(560, 1420, 1.7, '#E0A88E', '#FFE9C8', '#8A5276');
    vignette(0.6);
  } });
  cue(0.0, 'bell', { gain: 0.8 }); cue(0.1, 'sparkle', { dur: 1.6, gain: 0.4 });

  // 1 · फिर धरती पर आईं कैसे?: falling to a parched earth (dry map), a crimson question seal
  { const st = cut_(1), q = W_('कैसे', 1);
    add({ id: 'S02', at: st, cam: [540, 760], zoom: 0.06, note: 'dry map, no river; ? seal on कैसे', draw(lt, d, t) {
      ctx.save(); ctx.translate(0, lerp(-600, 0, eo(seg(lt, 0, 0.5)))); indiaMap({ dry: true }); ctx.restore();
      if (lt > q - 0.1) { const p = eob(seg(lt, q - 0.1, q + 0.2)); ctx.save(); ctx.translate(560, 600); ctx.scale(p * 1.2, p * 1.2); K.seal(0, 0, 1.3, '?'); ctx.restore(); }
    } });
    cue(st, 'whoosh'); cue(st + q, 'drum', { gain: 0.6 }); }

  // 2 · राजा सगर के साठ हज़ार बेटे: dusk over the capital; Sagara; rows of princes into the haze
  { const st = cut_(2), sx = W_('साठ', 2);
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'dusk skyline, Sagara in front, 60,000 princes in silhouette rows', draw(lt, d, t) {
      gradSky(DUSK_SKY); glow(780, 820, 600, '#FFB066', 0.45); cut(P_circ(780, 820, 110), '#FFD9A0', { shadow: 0, edge: 0 });
      skyline(900, '#3A2448', 0.95, 560 - lt * 10); mist(900, 200, '#E8A0A0', 0.25, t, 3);
      ground('#2A1C2E', 900);
      princes((x, y, sc, n, r) => { const p = eob(seg(lt, sx - 0.1 + n * 0.03, sx + 0.15 + n * 0.03)); if (p > 0) warrior(x, y, 230 * sc * p, ['#3A2A40', '#2E2236', '#241A2C', '#1A1220'][r], rgba('#FFB066', 0.9), t, n); });
      K.ribbon('सूर्यवंश', 540, 260, eob(seg(lt, 0.05, 0.4)), 80);
      raja({ x: 230, y: 1560, h: 1000, pose: 'decree', t, robe: '#F0E2C4', sash: '#7A2E3A' });
      K.slip('राजा सगर', 260, 470, eob(seg(lt, 0.15, 0.45)), -0.03, 50);
      if (lt > sx) K.slip('60,000 पुत्र', 760, 470, eob(seg(lt, sx, sx + 0.3)), 0.03, 56);
      vignette(0.55);
    } });
    cue(st, 'whoosh'); cue(st + 0.05, 'conch', { dur: 2.2, gain: 0.7 }); cue(st + sx, 'drum', { gain: 0.7 }); for (let i = 0; i < 5; i++) cue(st + sx + 0.2 + i * 0.18, 'drum', { gain: 0.25 }); }

  // 3 · एक खोया हुआ घोड़ा ढूँढते हुए: the horse's trail across the map
  { const st = cut_(3); const trail = [AYODHYA, ll(84.2, 25.0), ll(86.0, 23.6), ll(87.2, 22.6), ll(88.1, 21.65)];
    add({ id: 'S04', at: st, cam: [720, 800], zoom: 0.16, note: 'map: crimson trail Ayodhya → the sea, decorated horse at its head', draw(lt, d, t) {
      indiaMap({ dry: true, extra() {
        circle(AYODHYA[0], AYODHYA[1], 12, '#3E2C1E'); K.slip('अयोध्या', AYODHYA[0] - 110, AYODHYA[1] - 70, 0.75, -0.03, 44);
        const p = eio(seg(lt, 0.15, d - 0.1)); const hd = K.dashedRoute(trail, p); glow(hd[0], hd[1] - 40, 120, A.gold, 0.25); horse(hd[0], hd[1] + 10, 0.34, lt * 12, 1);
      } });
    } });
    cue(st, 'whoosh'); cue(st + 0.15, 'slide', { dur: 1.8, gain: 0.4 }); }

  // 4 · कपिल मुनि के आश्रम पहुँचे: the ashram by the sea at sunset
  { const st = cut_(4), k = W_('कपिल', 4);
    add({ id: 'S05', at: st, cam: [560, 1080], zoom: 0.09, note: 'sunset ashram: palms, hut, tied horse, Kapila in meditation', draw(lt, d, t) {
      gradSky(DUSK_SKY); glow(540, 1000, 700, '#FFB066', 0.5); cut(P_circ(540, 1010, 130), '#FFD9A0', { shadow: 0, edge: 0 });
      birds(lt, 120, 520, 5, '#3A2448', 0.9);
      water(t, 1050, ['#6A4E7A', '#4A3A66'], '#FFD9A0', 0.6);
      ground('#5A3E3A', 1330);
      palm(120, 1340, 700, '#2A1C2E', 0.12, t); palm(1000, 1330, 640, '#2A1C2E', -0.18, t);
      ctx.save(); ctx.translate(860, 1340); ctx.scale(0.9, 0.9); cut(P_rr(-170, -200, 340, 200, 6), '#6E4A3A'); cut(P_rr(-45, -130, 90, 130, 30), '#1E1418', { shadow: 0, edge: 3 }); glow(0, -60, 90, '#FFB066', 0.35); cut(P_poly([[-230, -180], [0, -380], [230, -180]]), '#4E3436'); ctx.restore();
      ctx.strokeStyle = '#2A1C2E'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(150, 1260); ctx.quadraticCurveTo(200, 1320, 250, 1300); ctx.stroke();
      horse(330, 1390, 0.55, 0, -1);
      kapila(620, 1490, 0.95, { t });
      K.slip('कपिल मुनि', 540, 420, eob(seg(lt, k, k + 0.3)), -0.03, 58);
      vignette(0.55);
    } });
    cue(st, 'whoosh'); cue(st + k, 'bell', { gain: 0.5 }); }

  // 5 · और मुनि की आँखें खुलते ही: the eyes open, and blaze
  { const st = cut_(5), o = W_('खुलते', 5);
    add({ id: 'S06', at: st, cam: [540, 720], zoom: 0.2, note: 'close on Kapila; eyes open on खुलते, golden blaze + rays', draw(lt, d, t) {
      const f = eo(seg(lt, o, o + 0.5));
      gradSky([[0, '#1B1640'], [0.5, lerpCol('#4A2C5E', '#E8894A', f)], [1, lerpCol('#B4566A', '#FFD07A', f)]]);
      godRays(540, 600, 0, TAU, 28, 1300, A.gold, 0.35 * f, t);
      kapila(540, 1440, 2.2, { t, eyes: eo(seg(lt, o, o + 0.2)), fire: f });
      motes(t, 50, [0, 300, W, 1500], '#FFC66A', f, 120, 9, 6);
      vignette(0.5 * (1 - f) + 0.2);
    } });
    cue(st, 'swell', { dur: Math.max(0.6, o), gain: 0.8 }); cue(st + o, 'drum'); cue(st + o, 'bell', { gain: 0.9 }); }

  // 6 · सब राख हो गए: the princes become ash; embers rise
  { const st = cut_(6), r = W_('राख', 6);
    add({ id: 'S07', at: st, cam: [600, 1100], zoom: 0.06, note: 'golden light floods the princes; they fall into ash heaps, embers rise', draw(lt, d, t) {
      const f = eo(seg(lt, r - 0.2, r + 0.4));
      gradSky([[0, '#2A1830'], [0.6, '#8A3A3A'], [1, '#E8894A']]); glow(0, 900, 900, '#FFC66A', 0.6 * (1 - f * 0.6));
      ground('#2A1C24', 900);
      princes((x, y, sc, n, rr_) => { const p = eo(seg(lt, r - 0.1 + n * 0.01, r + 0.25 + n * 0.01)); if (p < 1) { ctx.save(); ctx.globalAlpha = 1 - p; warrior(x, y, 230 * sc * (1 - p * 0.6), '#1A1220', rgba('#FFC66A', 1), t, n); ctx.restore(); } ashHeap(x, y, sc * p, 1 - seg(lt, r + 0.5, d), t); });
      motes(t, 60, [300, 600, W, 1500], '#FF8A3D', f, 160, 4, 5);
      vignette(0.55);
    } });
    cue(st, 'whoosh'); cue(st + r, 'slam', { gain: 0.6 }); cue(st + r, 'sizzle', { dur: 1.2, gain: 0.5 }); }

  // 7 · उन्हें मुक्ति सिर्फ़ गंगा का जल दिला सकता था: night; ash and lost souls; heaven's river glimmers far above
  { const st = cut_(7), m = W_('मुक्ति', 7), g = W_('गंगा', 7);
    add({ id: 'S08', at: st, cam: [540, 820], zoom: 0.1, note: 'night: ash heaps, pale souls hover; the sky river appears above on गंगा', draw(lt, d, t) {
      gradSky(NIGHT_SKY); stars(t, 110, -200, 900, 8);
      const ga = eo(seg(lt, g - 0.2, g + 0.5)); if (ga > 0) { ctx.save(); ctx.globalAlpha = ga; const pts = []; for (let x = -400; x <= W + 400; x += 40) pts.push([x, 330 + Math.sin(x * 0.005 + lt * 0.2) * 60]); luminous(pts, 90, t, { glowA: 1 }); ctx.restore(); }
      ground('#151A33', 1000); mist(1050, 200, '#8FA0D0', 0.18, t, 4);
      princes((x, y, sc, n) => { ashHeap(x - 160, y, sc); soul(x - 160, y - 130 * sc - 18 * Math.sin(t * 2 + n), 70 * sc, 0.4 * eo(seg(lt, m - 0.2, m + 0.4))); });
      vignette(0.6);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + g, 'sparkle', { dur: 1.6, gain: 0.5 }); }

  // 8 · पीढ़ियाँ बीत गईं: generations: three crowns light up in turn
  { const st = cut_(8);
    add({ id: 'S09', at: st, cam: [540, 760], zoom: 0.05, note: 'three crowns on dark velvet: अंशुमान → दिलीप → भगीरथ', draw(lt, d, t) {
      gradSky([[0, '#120E24'], [1, '#2A1E3A']]); paperGrain(0.05, 9);
      const p = eio(seg(lt, 0.1, d - 0.1)), act = Math.min(2, Math.floor(p * 2.99));
      [0, 1, 2].forEach((i) => crown(180 + i * 360, 650, i <= act ? 1.5 : 1.0, i <= act));
      ctx.save(); K.timeline(['', '', ''], 180, 790, 720, p, act); ctx.restore();
      ['अंशुमान', 'दिलीप', 'भगीरथ'].forEach((n, i) => K.label(n, 180 + i * 360, 860, 46, i === act ? A.gold : '#D8CBB0'));
      motes(t, 24, [0, 300, W, 1300], A.gold, 0.6, 20, 11, 3);
      vignette(0.6);
    } });
    cue(st, 'bell', { gain: 0.35 }); cue(st + 0.45, 'bell', { gain: 0.3 }); }

  // 9 · फिर राजा भगीरथ ने: Bhagiratha before the Himalaya at dawn
  { const st = cut_(9);
    add({ id: 'S10', at: st, cam: [540, 1100], zoom: 0.08, note: 'layered Himalaya at dawn, Bhagiratha stands, light behind', draw(lt, d, t) {
      himalaya(-lt * 30, t); godRays(540, 500, Math.PI * 0.25, Math.PI * 0.75, 8, 1500, A.paleGold, 0.18, t);
      ground('#3E4466', 1480);
      raja({ x: 540, y: 1520, h: 900, pose: 'stand', t, eyes: 1 });
      K.slip('भगीरथ', 540, 380, eob(seg(lt, 0.1, 0.4)), -0.03, 64);
      vignette(0.5);
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'conch', { dur: 1.8, gain: 0.5 }); }

  // 10 · बरसों तक कठोर तप किया: tapas; suns and moons wheel; snow falls
  { const st = cut_(10);
    add({ id: 'S11', at: st, cam: [540, 1120], zoom: 0.1, note: 'tapas, arms raised; sun/moon cycle fast; snow; aura grows', draw(lt, d, t) {
      const cyc = lt * 6, day = (Math.cos(cyc) + 1) / 2;
      gradSky([[0, lerpCol('#05071A', '#3C5A9A', day)], [0.6, lerpCol('#1A2350', '#C99AA0', day)], [1, lerpCol('#2B2A66', '#F0C8A0', day)]]);
      stars(t, 90, -200, 900, 2, 1 - day);
      const sx = 540 + Math.cos(cyc + Math.PI) * 500, sy = 900 - Math.sin(cyc + Math.PI) * -1 * 0 - Math.abs(Math.sin(cyc)) * 600;
      if (day > 0.3) { glow(sx, sy, 200, '#FFD07A', day); cut(P_circ(sx, sy, 70), '#FFE2A0', { shadow: 0, edge: 0 }); } else { glow(1080 - sx, sy, 120, '#DDE8FF', 1 - day); cut(P_circ(1080 - sx, sy, 50), '#F2F0E8', { shadow: 0, edge: 0 }); }
      ranges([{ y: 1100, h: 480, col: lerpCol('#2A3058', '#8E93B5', day), seed: 1.3, snow: 0.9 }, { y: 1300, h: 340, col: lerpCol('#20264A', '#6E7499', day), seed: 3.1, snow: 0.6, haze: 0.3 }], 0, '#C9D3E6');
      ground(lerpCol('#1A1E38', '#3E4466', day), 1480);
      raja({ x: 540, y: 1520, h: 1000, pose: 'tapas', t, eyes: 0 });
      glow(540, 1050, 500, A.paleGold, 0.15 + 0.25 * seg(lt, 0, d));
      motes(t * 0.6, 50, [0, 0, W, 1500], '#FFFFFF', 0.7, -120, 5, 3);
    } });
    cue(st, 'swell', { dur: 1.6, gain: 0.6 }); cue(st + 0.2, 'bell', { gain: 0.3 }); }

  // 11 · गंगा मान गईं: heaven's river turns and bends toward the earth
  { const st = cut_(11);
    add({ id: 'S12', at: st, cam: [540, 820], zoom: 0.08, note: 'cosmic sky: the luminous river bends downward through clouds', draw(lt, d, t) {
      heavenSky(t); godRays(540, 200, Math.PI * 0.35, Math.PI * 0.65, 7, 1600, A.paleGold, 0.2, t);
      const b = eio(seg(lt, 0.05, d)); const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([lerp(-350, 540, eo(u)), 380 + Math.sin(u * 3) * 40 * (1 - b) + b * 1050 * Math.pow(u, 3)]); }
      luminous(pts, 150, t, { glowA: 1 });
      cloud(840, 1180, 1.3, '#C98FA8', '#FFE2C2', '#7A4A78'); cloud(250, 1320, 1.1, '#C98FA8', '#FFE2C2', '#7A4A78');
      vignette(0.55);
    } });
    cue(st, 'conch', { dur: 1.6, gain: 0.6 }); cue(st + 0.2, 'slide', { dur: 1.2, gain: 0.5 }); }

  // 12 · पर उनका वेग इतना तेज़ था: the torrent: an ocean falling from the sky
  { const st = cut_(12), v = W_('वेग', 12);
    add({ id: 'S13', at: st, cam: [540, 900], zoom: 0.12, note: 'stormy sky; a luminous torrent plunges toward the dry earth', draw(lt, d, t) {
      gradSky([[0, '#0A0C1E'], [0.5, '#1E2448'], [1, '#4A3A5A']]);
      cloud(150, 200, 1.6, '#2E2E52', '#4E4E80', '#1A1A36'); cloud(930, 260, 1.4, '#2E2E52', '#4E4E80', '#1A1A36');
      ranges([{ y: 1480, h: 260, col: '#3A2E3A', seed: 9.1, rough: 1.2 }], 0); ground('#4A3A36', 1480);
      const bot = lerp(150, 1220, eio(seg(lt, 0, d))); torrentBand(540, 420 + 40 * Math.sin(t * 7), -300, bot, t);
      spray(540, bot + 30, 420, t, 22);
      if (lt > v) K.slip('वेग', 880, 480, eob(seg(lt, v, v + 0.3)), 0.04, 70);
      vignette(0.6);
    } });
    cue(st, 'slide', { dur: 2.0, gain: 0.9 }); cue(st + 0.2, 'bubbles', { dur: 1.6, gain: 0.5 }); cue(st + v, 'drum', { gain: 0.8 }); }

  // 13 · कि धरती ही टूट जाती: the ground splits with glowing cracks; dust; shake
  { const st = cut_(13), tt_ = W_('टूट', 13);
    add({ id: 'S14', at: st, cam: [540, 1260], zoom: 0.08, note: 'torrent just above; ground cracks glow red, dust, camera shake', draw(lt, d, t) {
      const sh = lt > tt_ ? (1 - seg(lt, tt_, tt_ + 1.0)) * 16 : 0; ctx.save(); ctx.translate(Math.sin(t * 60) * sh, Math.cos(t * 47) * sh);
      gradSky([[0, '#0A0C1E'], [0.6, '#2A2240'], [1, '#5A3A40']]);
      ground('#4A3A36', 1380);
      torrentBand(540, 460, -300, 1230, t); spray(540, 1260, 460, t, 26);
      const c = eo(seg(lt, tt_ - 0.1, tt_ + 0.6));
      ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (let pass = 0; pass < 2; pass++) { if (pass === 0) { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = '#FF6A2E'; ctx.shadowBlur = 30; ctx.strokeStyle = 'rgba(255,120,50,0.9)'; ctx.lineWidth = 16; } else { ctx.globalCompositeOperation = 'source-over'; ctx.shadowBlur = 0; ctx.strokeStyle = '#FFD07A'; ctx.lineWidth = 5; }
        for (let k = 0; k < 7; k++) { const dir = k < 3 ? -1 : k < 6 ? 1 : 0; ctx.beginPath(); let x = 540 + dir * 70, y = 1400; ctx.moveTo(x, y); for (let j = 0; j < Math.floor(7 * c); j++) { x += dir * (45 + rnd(k * 7 + j) * 40) + (dir === 0 ? (rnd(j) - 0.5) * 40 : 0); y += (rnd(k * 3 + j) - 0.2) * 45 + (k % 3) * 10 + (dir === 0 ? 40 : 0); ctx.lineTo(x, y); } ctx.stroke(); } }
      ctx.restore();
      if (c > 0) mist(1380, 240, '#B8A08A', 0.45 * c, t, 6, 40);
      ctx.restore(); vignette(0.6);
    } });
    cue(st, 'bubbles', { dur: 1.4, gain: 0.5 }); cue(st + tt_, 'slam'); cue(st + tt_ + 0.15, 'drum'); }

  // 14 · तब शिव ने: Shiva on Kailash, moonlit, haloed; the torrent coming
  { const st = cut_(14);
    add({ id: 'S15', at: st, cam: [540, 1000], zoom: 0.06, note: 'Shiva on Kailash at night, aura, trident; torrent approaching', draw(lt, d, t) {
      gradSky(NIGHT_SKY); stars(t, 120, -200, 1000, 6); glow(540, 400, 700, '#8FB4FF', 0.2);
      ranges([{ y: 1120, h: 560, col: '#3A4470', seed: 2.2, snow: 0.9, rough: 0.7 }, { y: 1330, h: 380, col: '#2A3258', seed: 4.4, snow: 0.6, haze: 0.25 }, { y: 1490, h: 200, col: '#1C2244', seed: 6.6, haze: 0.2 }], -lt * 20, '#8FA0D0');
      mist(1300, 260, '#AFC0E8', 0.2, t, 3);
      const bot = lerp(-300, 160, eo(seg(lt, 0, d))); torrentBand(540, 300, -500, bot, t, 0.8);
      shiva(540, 1500, { s: 0.95, t, aura: eo(seg(lt, 0, 0.6)) });
      K.slip('शिव', 190, 440, eob(seg(lt, 0.05, 0.35)), -0.04, 72);
      vignette(0.55);
    } });
    cue(st, 'conch', { dur: 2.0, gain: 0.8 }); cue(st + 0.05, 'damru', { dur: 1.0, gain: 0.6 }); }

  // 15 · उन्हें अपनी जटाओं में थाम लिया: the torrent pours into the jata and coils, tamed
  { const st = cut_(15), j = W_('जटाओं', 15);
    add({ id: 'S16', at: st, cam: [540, 620], zoom: 0.14, note: 'close: torrent enters the jata, coils glowing around it', draw(lt, d, t) {
      gradSky(NIGHT_SKY); stars(t, 120, -200, 1000, 6); glow(540, 400, 700, '#8FB4FF', 0.25);
      ranges([{ y: 1120, h: 560, col: '#3A4470', seed: 2.2, snow: 0.9, rough: 0.7 }, { y: 1330, h: 380, col: '#2A3258', seed: 4.4, snow: 0.6, haze: 0.25 }], 0, '#8FA0D0');
      const s = 0.95, top = 1500 - 1290 * s, shrink = eo(seg(lt, j, j + 0.8)), w = lerp(300, 0, shrink);
      if (w > 6) torrentBand(540, w, -500, top, t, 0.8);
      shiva(540, 1500, { s, t, lockWater: eo(seg(lt, 0.15, j + 0.6)) });
      motes(t, 30, [200, 0, 880, 600], A.glowWater, eo(seg(lt, j, j + 0.5)), 60, 3, 4);
      vignette(0.5);
    } });
    cue(st, 'bubbles', { dur: 1.8, gain: 0.5 }); cue(st + j, 'drum', { gain: 0.7 }); cue(st + j + 0.1, 'bell', { gain: 0.8 }); }

  // 16 · और धीरे-धीरे धरती पर छोड़ा: dawn; one gentle stream slips from a lock and runs down the mountain
  { const st = cut_(16);
    add({ id: 'S17', at: st, cam: [620, 1100], zoom: 0.08, note: 'dawn breaks; a thin glowing stream flows from a lock down the slopes', draw(lt, d, t) {
      himalaya(0, t, [[0, '#1C2550'], [0.5, '#56628F'], [0.85, '#E6A27A'], [1, '#F8D9A0']], '#47506E');
      godRays(1000, 700, Math.PI * 0.7, Math.PI * 1.1, 8, 1400, A.paleGold, 0.22, t);
      ground('#3E4466', 1480);
      shiva(400, 1500, { s: 0.85, t, lockWater: 1, stream: eio(seg(lt, 0.1, d)) });
      vignette(0.45);
    } });
    cue(st, 'bubbles', { dur: 1.8, gain: 0.3 }); cue(st + 0.2, 'sparkle', { dur: 1.4, gain: 0.4 }); }

  // 17 · भगीरथ आगे-आगे चले, गंगा पीछे-पीछे: the map: Bhagiratha leads, the river follows
  { const st = cut_(17), endP = fracAt(6);
    add({ id: 'S18', at: st, cam: [470, 520], zoom: 0.25, note: 'map: Bhagiratha walks Gangotri → Kashi, the glowing river behind him', draw(lt, d, t) {
      const p = lerp(0.01, endP, eio(seg(lt, 0.1, d)));
      const lab = PLACES.map(([, idx]) => (fracAt(idx) <= p + 0.001 ? (p - fracAt(idx)) * 25 + 0.01 : 0)); lab[0] = 1;
      indiaMap({ river: p, t, labels: lab, extra() { const hd = partial(GANGA, p).pop(); glow(hd[0], hd[1] - 60, 120, A.gold, 0.4); raja({ x: hd[0] + 10, y: hd[1] + 8, h: 130, pose: 'walk', t }); } });
    } });
    cue(st, 'whoosh'); cue(st + 0.1, 'bubbles', { dur: 3.0, gain: 0.3 }); for (let i = 0; i < 4; i++) cue(st + 0.2 + i * 0.75, 'drum', { gain: 0.3 }); }

  // 18 · हिमालय से सागर तक: on to the sea
  { const st = cut_(18), sg = W_('सागर', 18), from = fracAt(6);
    add({ id: 'S19', at: st, cam: [700, 700], zoom: 0.12, note: 'map: the river reaches the Bay of Bengal; गंगासागर', draw(lt, d, t) {
      const p = lerp(from, 1, eio(seg(lt, 0, sg + 0.1)));
      const lab = PLACES.map((_, k) => (k < 4 ? 1 : (p >= 0.999 ? (lt - sg - 0.1) * 4 : 0)));
      indiaMap({ river: p, t, labels: lab, extra() { const hd = partial(GANGA, p).pop(); glow(hd[0], hd[1] - 60, 120, A.gold, 0.4); raja({ x: hd[0] + 10, y: hd[1] + 8, h: 130, pose: p < 0.999 ? 'walk' : 'stand', t }); } });
    } });
    cue(st, 'slide', { dur: 1.2, gain: 0.4 }); cue(st + sg + 0.15, 'bell', { gain: 0.5 }); }

  // 19 · और जहाँ राख पड़ी थी: dawn at the shore; the river flows over the ash
  { const st = cut_(19), r = W_('राख', 19);
    add({ id: 'S20', at: st, cam: [540, 1150], zoom: 0.08, note: 'dawn shore at the ashram; Ganga flows in over the ash heaps', draw(lt, d, t) {
      gradSky(DAWN_SKY); glow(540, 1050, 700, '#FFD07A', 0.45); cut(P_circ(540, 1060, 120), '#FFE7B0', { shadow: 0, edge: 0 });
      water(t, 1080, ['#7A86B0', '#5A6A98'], '#FFE7B0', 0.6);
      ground('#6A5A60', 1330);
      palm(110, 1340, 620, '#2E2A40', 0.12, t);
      ctx.save(); ctx.translate(880, 1340); ctx.scale(0.8, 0.8); cut(P_rr(-170, -200, 340, 200, 6), '#7A5A4E'); cut(P_rr(-45, -130, 90, 130, 30), '#2A1E22', { shadow: 0, edge: 3 }); cut(P_poly([[-230, -180], [0, -380], [230, -180]]), '#5A4044'); ctx.restore();
      for (let i = 0; i < 7; i++) ashHeap(130 + i * 120, 1450 - (i % 2) * 40, 0.9);
      const wx = lerp(-300, 1400, eio(seg(lt, 0.1, d + 0.4)));
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; glow(wx, 1420, 220, A.glowWater, 0.5); ctx.restore();
      cut(() => { ctx.beginPath(); ctx.moveTo(-300, 1385); for (let x = -300; x <= wx; x += 40) ctx.lineTo(x, 1385 + Math.sin(x * 0.02 + t * 5) * 10); ctx.lineTo(wx, 1490); ctx.lineTo(-300, 1490); ctx.closePath(); }, '#4E8FB0', { shadow: 0.5, edge: 5 });
      if (lt > r) K.slip('राख', 540, 420, eob(seg(lt, r, r + 0.3)), 0.03, 64);
      vignette(0.5);
    } });
    cue(st, 'bubbles', { dur: 1.8, gain: 0.5 }); cue(st + r, 'bell', { gain: 0.4 }); }

  // 20 · वहाँ आज है गंगासागर: the souls rise as golden lights; diyas float; Gangasagar
  { const st = cut_(20), g = W_('गंगासागर', 20);
    add({ id: 'S21', at: st, cam: [540, 1000], zoom: 0.06, note: 'golden souls rise into the dawn; diyas float on the water; गंगासागर', draw(lt, d, t) {
      gradSky(DAWN_SKY); godRays(540, 1060, Math.PI * 1.15, Math.PI * 1.85, 12, 1500, A.paleGold, 0.3, t);
      glow(540, 1050, 800, '#FFD07A', 0.5); cut(P_circ(540, 1060, 120), '#FFE7B0', { shadow: 0, edge: 0 });
      water(t, 1080, ['#7A86B0', '#5A6A98'], '#FFE7B0', 0.7);
      for (let i = 0; i < 9; i++) diya(80 + i * 120 + Math.sin(t + i) * 10, 1260 + (i % 3) * 70, 0.55, t, i, eo(seg(lt, 0.05 * i, 0.4 + 0.05 * i)));
      for (let i = 0; i < 9; i++) { const up = eo(seg(lt, 0.1 + i * 0.1, 1.8 + i * 0.1)); const x = 80 + i * 120 + Math.sin(t * 2 + i) * 24, y = lerp(1300, 180 + (i % 3) * 140, up); glow(x, y, 110, A.gold, 0.8 * (1 - up * 0.3)); glow(x, y, 26, '#FFFFFF', 0.9); }
      if (lt > g - 0.1) K.slip('गंगासागर', 540, 640, eob(seg(lt, g - 0.1, g + 0.25)), -0.03, 74);
      vignette(0.45);
    } });
    cue(st, 'sparkle', { dur: 2.0 }); cue(st + 0.1, 'swell', { dur: 1.2, gain: 0.5 }); cue(st + g, 'bell'); }

  // 21 · इसीलिए गंगा का एक नाम है: the whole river, glowing on the map
  { const st = cut_(21);
    add({ id: 'S22', at: st, cam: [600, 700], zoom: 0.08, note: 'full map, the river from Gangotri to Gangasagar', draw(lt, d, t) { indiaMap({ river: 1, t, labels: [1, 1, 1, 1, 1] }); } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  // 22 · भागीरथी: the name, sealed in gold
  { const st = cut_(22);
    add({ id: 'S23', at: st, cam: [540, 980], zoom: 0.1, note: 'the river glows; ribbon भागीरथी + wax seal, radiant', draw(lt, d, t) {
      indiaMap({ river: 1, t, labels: [1, 1, 1, 1, 1] }); ctx.fillStyle = 'rgba(10,8,24,0.45)'; ctx.fillRect(-400, -400, W + 800, H + 800);
      godRays(520, 1130, 0, TAU, 24, 900, A.gold, 0.3 * eo(seg(lt, 0, 0.4)), t); glow(520, 1130, 500, A.gold, 0.35);
      K.ribbon('भागीरथी', 520, 1130, eob(seg(lt, 0.0, 0.35)) * 1.1, 110);
      K.seal(560, 1380, eob(seg(lt, 0.35, 0.6)), 'भ');
    } });
    cue(st, 'drum'); cue(st + 0.05, 'bell', { gain: 1.0 }); cue(st + 0.38, 'slam', { gain: 0.5 }); }

  // 23-24 · end card
  { const st = cut_(23), f = Wd('फ़ॉलो', 24) - st;
    add({ id: 'S24', at: st, cam: [540, 800], zoom: 0.05, note: 'end card: cosmic, celestial river, Untold Stories in gold', draw(lt, d, t) {
      heavenSky(t); const pts = []; for (let x = -400; x <= W + 400; x += 40) pts.push([x, 1330 + Math.sin(x * 0.005 + lt * 0.3) * 40]); luminous(pts, 80, t, { glowA: 0.9 });
      glow(540, 700, 600, A.gold, 0.18);
      K.seal(540, 400, eob(seg(lt, 0.1, 0.4)) * 1.2, 'अ');
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.3, 0.7)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 690, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 860, 84, '#E8A0A0'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 1070, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1500], A.paleGold, 0.6, 30, 13, 3);
      vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.4, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function lerpCol(a, b, k) { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); const c = [16, 8, 0].map((s) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, clamp(k)))); return `rgb(${c[0]},${c[1]},${c[2]})`; }
