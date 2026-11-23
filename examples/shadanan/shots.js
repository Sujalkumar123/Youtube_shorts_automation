// महादेव के बेटे के छह मुख क्यों हैं? Why Kartikeya has six faces — cinematic cut paper.
// Shiva Purana Rudra Samhita (Kumara Khanda); Mahabharata Vana Parva; Skanda Purana / Kanda Puranam.
// Palette: cosmic saffron (hook) → asura blood-red → Kailash moon blue → fear slate → wedding rose gold →
// tej white-gold → Agni fire orange → Saravana night teal → lotus dawn pink → Krittika star violet →
// embrace gold → Shadanan blaze → senapati saffron dawn → Kartik full-moon night.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky, cloud, diya, water } from './atmos.js';
import { raja, devi, shiva, lotus, lightning } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const COSMIC = [[0, '#05030F'], [0.45, '#1E0E3A'], [0.8, '#6A2A3A'], [1, '#E2803A']];
const BLOOD = [[0, '#0A0204'], [0.5, '#3A0A0E'], [0.85, '#8A1E14'], [1, '#D2502A']];
const MOON = [[0, '#060A1E'], [0.45, '#13204A'], [0.8, '#2A3C72'], [1, '#4A5E92']];
const SLATE = [[0, '#05070E'], [0.5, '#161C2E'], [1, '#34405A']];
const ROSE = [[0, '#2A1A3A'], [0.45, '#8A3A5A'], [0.8, '#F08A6A'], [1, '#FFD8A0']];
const TEJ = [[0, '#2A1A06'], [0.5, '#A86A1A'], [0.85, '#F6D080'], [1, '#FFF6D8']];
const FIRE = [[0, '#140402'], [0.45, '#5A1206'], [0.8, '#C8401A'], [1, '#FF9A3A']];
const TEAL = [[0, '#020A10'], [0.5, '#0A2A34'], [1, '#1E5A60']];
const STARV = [[0, '#04030E'], [0.5, '#1A1240'], [0.85, '#3A2A6A'], [1, '#6A4A8A']];
const GOLD = [[0, '#2A1206'], [0.5, '#8A4A12'], [1, '#F6C860']];
const SAFF = [[0, '#1A0A10'], [0.45, '#5A1E2A'], [0.75, '#D2603A'], [1, '#FFB060']];
const KUMAR = { robe: '#E2552A', sash: '#F2C14E' };

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function qmark(lt, w, x, y, size = 220) { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, '#FCE7B0'); ctx.restore(); } }
function ribbonAt(lt, w, text, x, y, size = 110) { if (lt > w - 0.15) K.ribbon(text, x, y, eob(seg(lt, w - 0.15, w + 0.2)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }
function ring(lt, w, x, y, col = '#FFE6A0', len = 0.9, R = 900) { if (lt > w && lt < w + len) { const k = seg(lt, w, w + len); ctx.save(); ctx.strokeStyle = rgba(col, 0.8 * (1 - k)); ctx.lineWidth = 30 * (1 - k) + 4; ctx.beginPath(); ctx.ellipse(x, y, R * eo(k), R * 0.4 * eo(k), 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
function clouds(t, cols, px = 0, a = 0.85) { for (const [cx, cy, s] of [[180, 420, 1.2], [880, 300, 1.0], [600, 1250, 1.4], [120, 1100, 0.9], [1000, 980, 1.1]]) cloud(((cx - px) % 1500 + 1500) % 1500 - 200, cy, s, cols[0], cols[1], cols[2], a); }
function kailashPeak(px = 0, py = 0, rot = 0, col = '#6A7CAE', snow = '#F2F5FF') {
  ctx.save(); ctx.translate(540 + px, 1250 + py); ctx.rotate(rot); ctx.translate(-540, -1250);
  cut(P_poly([[60, 1250], [380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [1020, 1250]]), col, { shadow: 0.8, edge: 4 });
  cut(P_poly([[380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [640, 740], [590, 790], [540, 730], [490, 790], [440, 740]]), snow, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
function shakti(x, y, s, g = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(0, -410);
  if (g) glow(0, -440, 260, '#FFB070', 0.45 * g);
  cut(P_rr(-11, -330, 22, 740, 10), '#8A5A34', { shadow: 0.6, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(0, -620); ctx.bezierCurveTo(90, -520, 80, -400, 0, -330); ctx.bezierCurveTo(-80, -400, -90, -520, 0, -620); ctx.closePath(); }, '#F0C860', { shadow: 0.6, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(0, -580); ctx.bezierCurveTo(40, -510, 36, -420, 0, -370); ctx.bezierCurveTo(-36, -420, -40, -510, 0, -580); ctx.closePath(); }, '#FFE6A0', { shadow: 0, edge: 0 });
  ctx.restore();
}

// ---------- new kit ----------
// a small serene crowned head (closed eyes), centre (x, y), r ~ face half-height. Used for the six faces of Shadanana.
export function miniHead(x, y, r, tilt = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(tilt); const k = r / 82;
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 70 * k, 82 * k, 0, 0, TAU); }, '#B97A4E', { shadow: 0.5, edge: 3 });
  ctx.strokeStyle = '#2A1C14'; ctx.lineWidth = 5 * k; ctx.lineCap = 'round';
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 26 * k, -12 * k, 12 * k, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, 30 * k, 14 * k, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#A8322D'; ctx.fillRect(-3 * k, -60 * k, 6 * k, 24 * k);
  cut(P_rr(-78 * k, -92 * k, 156 * k, 26 * k, 8 * k), '#E0A93A', { shadow: 0.3, edge: 2 });
  cut(P_poly([[-70 * k, -90 * k], [-50 * k, -140 * k], [-25 * k, -112 * k], [0, -170 * k], [25 * k, -112 * k], [50 * k, -140 * k], [70 * k, -90 * k]]), '#E0A93A', { shadow: 0.3, edge: 2 });
  circle(0, -150 * k, 7 * k, '#F7EFDC');
  ctx.restore();
}
// child Kartikeya: saffron robe; six: 0..1 shows the five extra faces (fanned behind the main face).
export function kumar(x, y, h, t, o = {}) {
  const s = h / 1150, six = o.six || 0;
  if (o.aura) { glow(x, y - 900 * s, 520 * s, '#FFE6A0', 0.5 * o.aura); }
  if (six > 0) { ctx.save(); ctx.globalAlpha *= six;
    const spread = 0.4 + 0.6 * eo(six);
    for (const [lx, ly, tl] of [[-120, -1040, -0.2], [120, -1040, 0.2], [0, -1150, 0], [-160, -880, -0.15], [160, -880, 0.15]]) miniHead(x + lx * s * spread, y + ly * s, 74 * s, tl);
    ctx.restore(); }
  raja({ x, y, h, t, pose: o.pose || 'stand', robe: KUMAR.robe, sash: KUMAR.sash, eyes: o.eyes ?? 0, dir: o.dir || 1 });
}
// a giant asura silhouette (no face detail): horns + glowing red eyes. base (x, y), s ~ 1 = 1300 tall.
export function asura(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.col || '#0C0306', br = Math.sin(t * 1.3) * 10;
  if (o.aura) glow(0, -800, 700, '#FF3A1A', 0.3 * o.aura);
  cut(() => { ctx.beginPath(); ctx.moveTo(-420, 0); ctx.quadraticCurveTo(-460, -500, -330, -820 + br); ctx.quadraticCurveTo(-200, -930, -110, -960); ctx.lineTo(110, -960); ctx.quadraticCurveTo(200, -930, 330, -820 + br); ctx.quadraticCurveTo(460, -500, 420, 0); ctx.closePath(); }, col, { shadow: 0.6, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -1080, 150, 170, 0, 0, TAU); }, col, { shadow: 0.4, edge: 4 });
  for (const k of [-1, 1]) cut(() => { ctx.beginPath(); ctx.moveTo(k * 90, -1180); ctx.quadraticCurveTo(k * 230, -1260, k * 250, -1420); ctx.quadraticCurveTo(k * 170, -1300, k * 60, -1230); ctx.closePath(); }, col, { shadow: 0.4, edge: 3 });
  const ea = o.eyes ?? 1; for (const k of [-1, 1]) { glow(k * 55, -1090, 70, '#FF3A1A', 0.8 * ea); cut(() => { ctx.beginPath(); ctx.ellipse(k * 55, -1090, 26, 10, k * 0.3, 0, TAU); }, rgba('#FF6A3A', ea), { shadow: 0, edge: 0 }); }
  ctx.restore();
}
// the six Krittikas (Pleiades) as star-maidens in an arc; a = alpha, rise 0..1
function krittikas(t, a, y0 = 1500, h = 520, rise = 1) {
  const xs = [110, 290, 450, 630, 790, 970];
  for (let i = 0; i < 6; i++) { const x = xs[i], y = y0 - (i === 2 || i === 3 ? 60 : i === 1 || i === 4 ? 30 : 0) + (1 - rise) * 300 + Math.sin(t * 1.5 + i) * 8;
    ctx.save(); ctx.globalAlpha *= a; glow(x, y - h * 0.85, 140, '#BFD8FF', 0.4);
    devi({ x, y, h, t: t + i, pose: 'namaste', sari: i % 2 ? '#6A7ACE' : '#8A6ACE', border: '#E6EEFF', dir: x < 540 ? 1 : -1, eyes: 0 });
    star(x, y - h * 1.08, 22, t + i); ctx.restore(); }
}
function star(x, y, r, t) { const p = 1 + 0.15 * Math.sin(t * 4); glow(x, y, r * 4, '#DCE8FF', 0.5); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); cut(P_poly([[0, -r * 1.6], [r * 0.35, -r * 0.35], [r * 1.6, 0], [r * 0.35, r * 0.35], [0, r * 1.6], [-r * 0.35, r * 0.35], [-r * 1.6, 0], [-r * 0.35, -r * 0.35]]), '#F4F8FF', { shadow: 0, edge: 0 }); ctx.restore(); }
function pleiades(x, y, s, t, a = 1) { ctx.save(); ctx.globalAlpha *= a; for (const [dx, dy, r] of [[-60, -40, 16], [10, -70, 20], [70, -20, 14], [30, 30, 18], [-40, 40, 13], [-100, 10, 12]]) star(x + dx * s, y + dy * s, r * s, t + dx); ctx.restore(); }
function reeds(t, y, col = '#0A2A22', n = 26, hgt = 420, seed = 3) { ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const x = -60 + i * (W + 120) / n + rnd(i + seed) * 30, h = hgt * (0.6 + 0.5 * rnd(i * 2 + seed)), sw = Math.sin(t * 1.2 + i) * 18; ctx.lineWidth = 8 + 6 * rnd(i + 5); ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * 0.5, y - h * 0.5, x + sw, y - h); ctx.stroke(); cut(() => { ctx.beginPath(); ctx.ellipse(x + sw, y - h, 9, 34, sw * 0.01, 0, TAU); }, '#5A3A1A', { shadow: 0, edge: 0 }); } ctx.restore(); }
function flames(x, y, s, t, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); glow(0, -160, 320, '#FF7A2A', 0.6);
  for (const [c, w, hh] of [['#C8301A', 150, 380], ['#F2702A', 110, 300], ['#FFC24A', 70, 210], ['#FFF0B0', 34, 120]]) { const f = Math.sin(t * 9 + w) * 14; cut(() => { ctx.beginPath(); ctx.moveTo(-w, 0); ctx.quadraticCurveTo(-w * 1.1, -hh * 0.5, f, -hh); ctx.quadraticCurveTo(w * 1.1, -hh * 0.5, w, 0); ctx.closePath(); }, c, { shadow: 0, edge: 0 }); }
  ctx.restore(); }
function embers(t, n = 50, seed = 1, col = '#FFB050') { motes(t, n, [0, 200, W, 1600], col, 0.9, 120, seed, 5); }
function agniDev(x, y, h, t) { glow(x, y - h * 0.7, h * 0.7, '#FF7A2A', 0.5); flames(x, y - h * 0.82, h / 900, t, 0.9); raja({ x, y, h, t, pose: 'stand', robe: '#C8401A', sash: '#FFC24A', eyes: 0 }); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK: six-faced child Kartikeya blazing in a cosmic sky, six stars; ? on क्यों (thumbnail)
  { const ch = W_('छह', 0), ky = W_('क्यों', 0);
    add({ id: 'S01', at: 0, cam: [540, 960], zoom: 0.14, note: 'cosmic saffron: Kartikeya with six crowned faces blazing, six stars arc above, god rays; ? on क्यों', draw(lt, d, t) {
      gradSky(COSMIC); stars(t, 120, -200, 1100, 3, 0.7); paperGrain(0.04, 3);
      godRays(540, 900, 0, TAU, 30, 1500, '#FFE6A0', 0.16, t);
      ranges([{ y: 1250, h: 260, col: '#3A1428', seed: 4, haze: 0.4 }, { y: 1400, h: 160, col: '#1E0A18', seed: 7 }], lt * 20, '#E2803A');
      ground('#12060E', 1520);
      kumar(540, 1530, 760, t, { six: 0.6 + 0.4 * seg(lt, 0, ch + 0.3), aura: 1 });
      pleiades(540, 230, 1.3, t, 0.9);
      qmark(lt, ky, 870, 520, 170); ring(lt, ch, 540, 900, '#FFE6A0', 0.9, 700);
      motes(t, 60, [0, 200, W, 1500], '#FFB060', 0.8, 50, 3, 4); vignette(0.5);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'bell', { gain: 0.6 }); cue(0.1, 'swell', { dur: 2.2, gain: 0.5 }); cue(ky, 'damru', { gain: 0.6 }); }

  // 1 · and why six mothers? six star-maidens rise
  { const ma = W_('माँओं', 1), pl = W_('पाला', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 950], zoom: 0.08, note: 'star violet: six Krittika maidens rise in an arc, star over each head; slip छह माँएँ, ? on पाला', draw(lt, d, t) {
      gradSky(STARV); stars(t, 160, -200, 1200, 5, 0.8); glow(540, 700, 600, '#8A6ACE', 0.3);
      mist(1300, 300, '#6A5A9A', 0.35, t); krittikas(t, 1, 1520, 480, eo(seg(lt, 0, 1.2)));
      ground('#0A0818', 1530); slipAt(lt, ma, 'छह माँएँ', 540, 300, 64); qmark(lt, pl, 540, 520, 160);
      motes(t, 40, [0, 200, W, 1500], '#DCE8FF', 0.7, 30, 5, 3); vignette(0.5);
    } });
    cue(cut_(1), 'whoosh', { gain: 0.5 }); cue(cut_(1) + ma, 'sparkle', { gain: 0.6 }); cue(cut_(1) + pl, 'drum', { gain: 0.6 }); }

  // 2 · the asura Taraka and his strange boon
  { const tr = W_('तारक', 2), vr = W_('वरदान', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 950], zoom: 0.12, note: 'blood-red: giant Taraka silhouette rises behind burning hills, red eyes ignite on तारक; slip असुर तारक, then वरदान scroll glow', draw(lt, d, t) {
      gradSky(BLOOD); clouds(t, ['#3A0A0E', '#6A1A14', '#1A0406'], lt * 40, 0.8);
      const up = eo(seg(lt, 0, 1.2)); asura(540, 1700 + 200 * (1 - up), 1.0, t, { aura: 1, eyes: seg(lt, tr - 0.2, tr + 0.3) });
      ranges([{ y: 1350, h: 220, col: '#1A0406', seed: 9 }], lt * 30, '#D2502A'); ground('#0A0203', 1520);
      embers(t, 50, 9); slipAt(lt, tr, 'असुर तारक', 540, 280, 66);
      if (lt > vr - 0.1) { const k = eob(seg(lt, vr - 0.1, vr + 0.3)); glow(540, 520, 200 * k, '#FFE6A0', 0.6); slipAt(lt, vr, 'वरदान', 540, 520, 60, 0.02); }
      vignette(0.6);
    } });
    cue(cut_(2), 'slam', { gain: 0.7 }); cue(cut_(2) + tr, 'thud', { gain: 0.8 }); cue(cut_(2) + vr, 'bell', { gain: 0.4 }); }

  // 3 · only Shiva's son could defeat him
  { const pt = W_('पुत्र', 3), hr = W_('हरा', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 950], zoom: 0.1, note: 'red dusk, Taraka laughs huge (left), a tiny glowing child silhouette of light on the right horizon; slip केवल शिव पुत्र', draw(lt, d, t) {
      gradSky(BLOOD); stars(t, 40, -200, 500, 11, 0.4); glow(840, 1250, 300, '#FFE6A0', 0.25 + 0.3 * seg(lt, pt - 0.2, pt + 0.5));
      ranges([{ y: 1250, h: 240, col: '#2A0A0E', seed: 12, haze: 0.3 }], lt * 25, '#D2502A');
      asura(300, 1600, 0.8, t, { eyes: 1, aura: 0.6 });
      ground('#0A0203', 1500);
      ctx.save(); ctx.globalAlpha = seg(lt, pt - 0.3, pt + 0.4); kumar(840, 1500, 300, t, { aura: 1 }); ctx.restore();
      slipAt(lt, pt, 'केवल शिव पुत्र', 540, 300, 62); ring(lt, hr, 840, 1350, '#FFE6A0', 0.8, 400);
      embers(t, 30, 13); vignette(0.55);
    } });
    cue(cut_(3) + pt, 'sparkle', { gain: 0.6 }); cue(cut_(3) + hr, 'drum', { gain: 0.7 }); }

  // 4 · but Mahadev was in deep samadhi
  { const sm = W_('समाधि', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 900], zoom: 0.1, note: 'moonlit Kailash, Shiva still in meditation glow, snow drifting, slow push; slip गहरी समाधि', draw(lt, d, t) {
      gradSky(MOON); stars(t, 160, -200, 1100, 15, 0.8); glow(800, 300, 200, '#EAF0FF', 0.4); cut(P_circ(800, 300, 60), '#F4F6FF', { shadow: 0, edge: 0 });
      kailashPeak(0, -40, 0, '#3A4A7A', '#E8EEFF'); mist(1200, 300, '#8AA0D0', 0.35, t);
      ground('#141C34', 1540); shiva(540, 1560, { s: 0.85, t, aura: 0.6 + 0.2 * Math.sin(t * 1.5), eyes: 0 });
      for (let i = 0; i < 40; i++) { const k = (t * 0.08 + rnd(i)) % 1; circle(rnd(i + 3) * W + Math.sin(t + i) * 30, k * 1600, 4 + 3 * rnd(i + 7), rgba('#F4F8FF', 0.7)); }
      slipAt(lt, sm, 'गहरी समाधि', 540, 280, 60); vignette(0.55);
    } });
    cue(cut_(4), 'swell', { dur: 2, gain: 0.4 }); cue(cut_(4) + sm, 'bell', { gain: 0.4 }); }

  // 5 · the three worlds tremble
  { const dr = W_('डर', 5), kp = W_('काँप', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 950], zoom: 0.12, note: 'storm slate: three stacked worlds (sky, earth, nether bands) shaking, Taraka shadow over all, lightning on काँप; slip तीनों लोक', draw(lt, d, t) {
      gradSky(SLATE); clouds(t, ['#1E2234', '#3A4058', '#0E1018'], lt * 120, 0.9);
      const sh = lt > kp ? Math.sin(t * 60) * 10 : 0;
      ctx.save(); ctx.translate(sh, 0); asura(540, 1620, 0.85, t, { col: rgba('#05020A', 0.85), eyes: seg(lt, dr - 0.2, dr + 0.3) });
      for (let i = 0; i < 3; i++) { const y = 700 + i * 300; ctx.save(); ctx.strokeStyle = rgba(['#BFD8FF', '#C8A060', '#C84A3A'][i], 0.8); ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(540, y, 360 - i * 30, 70, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      ctx.restore();
      if (lt > kp) lightning(300, -50, 900, t, 0.9, Math.floor(lt * 4));
      ground('#0E1018', 1530); slipAt(lt, 0.1, 'तीनों लोक', 540, 280, 62); flash(lt, kp, '#DDE6FF', 0.4, 0.4);
      vignette(0.6);
    } });
    cue(cut_(5) + dr, 'heartbeat', { gain: 0.7 }); cue(cut_(5) + kp, 'slam', { gain: 0.8 }); }

  // 6 · Shiva and Parvati wed
  { const pv = W_('पार्वती', 6), vv = W_('विवाह', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 920], zoom: 0.1, note: 'rose gold wedding: Shiva and Parvati side by side under a garland arch, petals, sacred fire; ribbon विवाह', draw(lt, d, t) {
      gradSky(ROSE); glow(540, 900, 600, '#FFD8A0', 0.35); clouds(t, ['#C86A7A', '#FFD8C0', '#7A3A5A'], lt * 50, 0.7);
      ctx.save(); ctx.strokeStyle = '#E2B24A'; ctx.lineWidth = 16; ctx.beginPath(); ctx.arc(540, 1500, 470, Math.PI, TAU); ctx.stroke(); ctx.restore();
      for (let i = 0; i < 20; i++) { const a = Math.PI + i / 19 * Math.PI; circle(540 + Math.cos(a) * 470, 1500 + Math.sin(a) * 470, 18, i % 2 ? '#F2A23A' : '#E8566A'); }
      ground('#3A1A22', 1520); shiva(380, 1540, { s: 0.62, t, aura: 0.7, eyes: 0 });
      ctx.save(); ctx.globalAlpha = eo(seg(lt, pv - 0.4, pv + 0.3)); devi({ x: 700, y: 1540, h: 600, t, pose: 'namaste', sari: '#C0392B', dir: -1, eyes: 0 }); ctx.restore();
      flames(540, 1560, 0.35, t);
      ribbonAt(lt, vv, 'शिव · पार्वती विवाह', 540, 300, 80);
      for (let i = 0; i < 26; i++) { const k = (t * 0.15 + rnd(i)) % 1; ctx.save(); ctx.translate(rnd(i + 9) * W, k * 1600); ctx.rotate(t * 2 + i); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, TAU); }, i % 3 ? '#F2A23A' : '#E8566A', { shadow: 0, edge: 0 }); ctx.restore(); }
      vignette(0.45);
    } });
    cue(cut_(6), 'bell', { gain: 0.6 }); cue(cut_(6) + vv, 'conch', { dur: 1.8, gain: 0.5 }); }

  // 7 · open loop: but the real turn was still to come
  { const md = W_('मोड़', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 950], zoom: 0.12, note: 'dark Kailash night, a single point of white-gold light pulsing on the peak; big ? on मोड़', draw(lt, d, t) {
      gradSky(MOON); stars(t, 180, -200, 1200, 21, 0.8);
      ctx.save(); ctx.translate(540, 1250); ctx.scale(0.9, 0.9); ctx.translate(-540, -1250); kailashPeak(0, 0, 0, '#1E2640', '#5A6A90'); ctx.restore();
      glow(540, 760, 160 + 60 * Math.sin(t * 4), '#FFF6D8', 0.5 + 0.2 * Math.sin(t * 4)); mist(1250, 300, '#5A6A90', 0.35, t);
      ground('#080A18', 1510); qmark(lt, md, 540, 380, 220); vignette(0.6);
    } });
    cue(cut_(7) + md, 'heartbeat', { gain: 0.6 }); }

  // 8 · WOW: Shiva's tej, so fierce...
  { const tj = W_('तेज', 8), pc = W_('प्रचंड', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 900], zoom: 0.16, note: 'white-gold blaze: an orb of tej bursting from Kailash, rays + shockwave ring + flash on प्रचंड; ribbon शिव का तेज', draw(lt, d, t) {
      gradSky(TEJ); const k = eo(seg(lt, 0, pc + 0.2));
      godRays(540, 820, 0, TAU, 40, 1600, '#FFFFFF', 0.15 + 0.2 * k, t * 2);
      ctx.save(); ctx.translate(540, 1250); ctx.scale(0.8, 0.8); ctx.translate(-540, -1250); kailashPeak(0, 150, 0, '#8A6A4A', '#FFF2D8'); ctx.restore();
      glow(540, 820, 200 + 400 * k, '#FFFFFF', 0.6); cut(P_circ(540, 820, 60 + 80 * k), '#FFFBEA', { shadow: 0, edge: 0 });
      ribbonAt(lt, tj, 'शिव का तेज', 540, 300, 96); ring(lt, pc, 540, 820, '#FFFFFF', 1.0, 1000); flash(lt, pc, '#FFFFFF', 0.7, 0.6);
      motes(t, 70, [0, 200, W, 1500], '#FFF6D8', 0.9, 80, 25, 4); vignette(0.35);
    } });
    cue(cut_(8) + tj, 'swell', { dur: 1.2, gain: 0.6 }); cue(cut_(8) + pc, 'drum', { gain: 0.9 }); cue(cut_(8) + pc + 0.05, 'bell', { gain: 0.6 }); }

  // 9 · even Agni could not hold it
  { const ag = W_('अग्नि', 9), sb = W_('संभाल', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 950], zoom: 0.12, note: 'fire orange: Agni dev with flame crown holds the white orb; it blazes, he staggers back (shake) on संभाल; slip अग्नि देव', draw(lt, d, t) {
      gradSky(FIRE); embers(t, 70, 27);
      ranges([{ y: 1250, h: 260, col: '#3A0A06', seed: 28, haze: 0.4 }], lt * 30, '#FF9A3A'); ground('#1A0402', 1520);
      const back = eo(seg(lt, sb, sb + 0.6)); const sh = lt > sb ? Math.sin(t * 50) * 8 * (1 - seg(lt, sb, sb + 1)) : 0;
      agniDev(560 + 80 * back + sh, 1540, 780, t);
      const ox = 300 - 40 * back, oy = 900, gr = 1 + 0.6 * seg(lt, sb - 0.5, sb + 0.5);
      glow(ox, oy, 220 * gr, '#FFFFFF', 0.7); cut(P_circ(ox, oy, 60 * gr), '#FFFBEA', { shadow: 0, edge: 0 });
      slipAt(lt, ag, 'अग्नि देव', 540, 280, 62); flash(lt, sb, '#FFF0C0', 0.5, 0.5); vignette(0.5);
    } });
    cue(cut_(9) + ag, 'sizzle', { gain: 0.5 }); cue(cut_(9) + sb, 'slam', { gain: 0.8 }); }

  // 10 · Ganga leaves it in the reed lake (Saravana)
  { const gg = W_('गंगा', 10), sr = W_('सरोवर', 10), cd = W_('छोड़', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 950], zoom: 0.1, note: 'night teal: Ganga devi on the water carries the glowing orb, sets it among swaying reeds of the Saravana lake; slip शरवण सरोवर', draw(lt, d, t) {
      gradSky(TEAL); stars(t, 120, -200, 900, 31, 0.7); glow(780, 380, 160, '#EAF0FF', 0.4); cut(P_circ(780, 380, 50), '#F4F6FF', { shadow: 0, edge: 0 });
      ranges([{ y: 1100, h: 200, col: '#0A2A2E', seed: 31, haze: 0.3 }], lt * 20, '#5AA0A0');
      water(t, 1280, ['#1A5A60', '#0E3A40'], '#DCF0FF', 0.5); reeds(t, 1320, '#0A2A22', 22, 380, 3);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0, 0.8)); devi({ x: 360, y: 1520, h: 720, t, pose: 'hold', sari: '#2A8A8A', border: '#E6F6FF', eyes: 0 }); ctx.restore();
      const k = eio(seg(lt, cd - 0.6, cd + 0.4)); const ox = lerp(440, 700, k), oy = lerp(1060, 1340, k);
      glow(ox, oy, 160, '#FFF6D8', 0.7); cut(P_circ(ox, oy, 34), '#FFFBEA', { shadow: 0, edge: 0 });
      reeds(t, 1560, '#06201A', 18, 300, 11); ground('#041210', 1600);
      slipAt(lt, gg, 'माँ गंगा', 300, 280, 58); slipAt(lt, sr, 'शरवण सरोवर', 640, 440, 54, 0.03);
      motes(t, 30, [0, 300, W, 1500], '#C8FFE0', 0.5, 20, 33, 3); vignette(0.5);
    } });
    cue(cut_(10), 'whoosh', { gain: 0.5 }); cue(cut_(10) + cd, 'plop', { gain: 0.6 }); }

  // 11 · WOW: six lotuses, six babies born
  { const km = W_('कमलों', 11), bl = W_('बालक', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 980], zoom: 0.14, note: 'dawn pink lake: six lotuses open in a row, a baby of light glows on each, ring + flash on बालक; ribbon छह बालक', draw(lt, d, t) {
      dawnSky(t, 1, 1150, 13); water(t, 1180, ['#C86A7A', '#7A3A5A'], '#FFE6C8', 0.6);
      reeds(t, 1240, '#3A1A2A', 14, 260, 7);
      const op = seg(lt, km - 0.4, km + 0.6), xs = [130, 290, 450, 630, 790, 950];
      for (let i = 0; i < 6; i++) { const y = 1380 + (i % 2) * 60, o2 = clamp(op * 1.4 - i * 0.08); lotus(xs[i], y, 1.3, o2);
        const b = eob(seg(lt, bl - 0.3 + i * 0.05, bl + 0.3 + i * 0.05)); if (b > 0) { glow(xs[i], y - 90, 110 * b, '#FFF6D8', 0.8); cut(() => { ctx.beginPath(); ctx.ellipse(xs[i], y - 80, 34 * b, 40 * b, 0, 0, TAU); }, '#F6D8B0', { shadow: 0.3, edge: 2 }); circle(xs[i], y - 128 * b, 22 * b, '#F6D8B0'); } }
      ribbonAt(lt, bl, 'छह बालक', 540, 340, 110); ring(lt, bl, 540, 1300, '#FFE6A0', 1.0, 800); flash(lt, bl, '#FFF6D8', 0.6, 0.6);
      motes(t, 60, [0, 200, W, 1500], '#FFE6A0', 0.8, 50, 13, 4); vignette(0.45);
    } });
    cue(cut_(11) + km, 'swell', { dur: 1.2, gain: 0.6 }); cue(cut_(11) + bl, 'drum', { gain: 0.9 }); cue(cut_(11) + bl + 0.05, 'bell', { gain: 0.6 }); }

  // 12 · the six star-goddesses, the Krittikas, come down
  { const tr = W_('तारों', 12), kt = W_('कृत्तिकाएँ', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 950], zoom: 0.1, note: 'star violet: six stars fall from the Pleiades cluster and become six maidens by the lake; ribbon कृत्तिकाएँ', draw(lt, d, t) {
      gradSky(STARV); stars(t, 200, -200, 1200, 37, 0.8);
      const k = eio(seg(lt, tr - 0.3, kt + 0.3));
      pleiades(540, lerp(260, 200, k), 1.6, t, 1 - 0.5 * k);
      for (let i = 0; i < 6; i++) { const sx = 540 + (i - 2.5) * 40, ex = [110, 290, 450, 630, 790, 970][i]; const x = lerp(sx, ex, k), y = lerp(260, 900, k); ctx.save(); ctx.strokeStyle = rgba('#DCE8FF', 0.4 * (1 - seg(lt, kt, kt + 1))); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx, 260); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); star(x, y, 18, t + i); }
      water(t, 1380, ['#2A2A6A', '#1A1240'], '#DCE8FF', 0.4);
      krittikas(t, seg(lt, kt - 0.3, kt + 0.5), 1540, 460, 1);
      ribbonAt(lt, kt, 'कृत्तिकाएँ', 540, 1180, 96); vignette(0.5);
    } });
    cue(cut_(12) + tr, 'sparkle', { gain: 0.6 }); cue(cut_(12) + kt, 'bell', { gain: 0.6 }); }

  // 13 · each mother longs to hold her child
  { const mm = W_('माँ', 13), sn = W_('सीने', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 900], zoom: 0.12, note: 'warm close: one Krittika kneels to a glowing baby on a lotus, others behind softly; heartbeat; slip ममता', draw(lt, d, t) {
      gradSky(STARV); glow(540, 1000, 600, '#FFD8A0', 0.3); stars(t, 100, -200, 900, 41, 0.6);
      water(t, 1400, ['#3A2A6A', '#1A1240'], '#FFE6C8', 0.4);
      ctx.save(); ctx.globalAlpha = 0.5; for (const x of [140, 940]) devi({ x, y: 1500, h: 520, t, pose: 'namaste', sari: '#6A7ACE', dir: x < 540 ? 1 : -1, eyes: 0 }); ctx.restore();
      lotus(640, 1560, 1.8, 1); const b = 1 + 0.06 * Math.sin(t * 3); glow(640, 1420, 160 * b, '#FFF6D8', 0.8); cut(() => { ctx.beginPath(); ctx.ellipse(640, 1440, 48, 56, 0, 0, TAU); }, '#F6D8B0', { shadow: 0.3, edge: 2 }); circle(640, 1372, 30, '#F6D8B0');
      devi({ x: 400, y: 1620, h: 900, t, pose: 'hold', sari: '#8A6ACE', border: '#E6EEFF', eyes: 0 });
      slipAt(lt, sn, 'ममता', 540, 280, 66); motes(t, 40, [0, 200, W, 1500], '#FFE6C8', 0.6, 30, 41, 3); vignette(0.5);
    } });
    cue(cut_(13) + mm, 'heartbeat', { gain: 0.5 }); cue(cut_(13) + sn, 'heartbeat', { gain: 0.6 }); }

  // 14 · then Mother Parvati embraced all six
  { const pv = W_('पार्वती', 14), gl = W_('गले', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 900], zoom: 0.12, note: 'embrace gold: Parvati arrives in a blaze, arms open, six small glows drift to her; slip माँ पार्वती', draw(lt, d, t) {
      gradSky(GOLD); godRays(540, 600, 0, TAU, 28, 1400, '#FFF0C0', 0.18, t);
      clouds(t, ['#C8862A', '#FFE0A0', '#8A4A12'], lt * 40, 0.6); ground('#3A2410', 1560);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0, pv + 0.2)); devi({ x: 540, y: 1580, h: 1000, t, pose: 'boon', sari: '#C0392B', glowA: 1, eyes: 0 }); ctx.restore();
      const k = eio(seg(lt, gl - 0.8, gl + 0.4));
      for (let i = 0; i < 6; i++) { const sx = [110, 290, 450, 630, 790, 970][i]; const x = lerp(sx, 540 + (i - 2.5) * 30, k), y = lerp(1450, 1000, k); glow(x, y, 80, '#FFF6D8', 0.8); circle(x, y, 22, '#F6D8B0'); }
      slipAt(lt, pv, 'माँ पार्वती', 540, 260, 62); motes(t, 60, [0, 200, W, 1500], A.paleGold, 0.8, 50, 43, 4); vignette(0.45);
    } });
    cue(cut_(14), 'bell', { gain: 0.5 }); cue(cut_(14) + gl, 'swell', { dur: 1.5, gain: 0.6 }); }

  // 15 · WOW: and six children became one!
  { const ek = W_('एक', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 950], zoom: 0.16, note: 'six glows spiral together into one blaze, flash + shockwave on एक, child Kartikeya appears; big text 6 → 1', draw(lt, d, t) {
      gradSky(TEJ); godRays(540, 1000, 0, TAU, 36, 1600, '#FFFFFF', 0.2, t * 2);
      const k = eio(seg(lt, 0, ek));
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + k * 5; const r = 380 * (1 - k); glow(540 + Math.cos(a) * r, 1050 + Math.sin(a) * r * 0.6, 90, '#FFFFFF', 0.8); }
      const b = eo(seg(lt, ek, ek + 0.6)); ground('#5A3410', 1560);
      if (b > 0) { ctx.save(); ctx.globalAlpha = b; kumar(540, 1570, 620, t, { aura: 1 }); ctx.restore(); }
      if (lt > ek) { ctx.save(); ctx.globalAlpha = eo(seg(lt, ek, ek + 0.3)); ctx.shadowColor = rgba('#8A4A12', 0.8); ctx.shadowBlur = 30; bigText('6 → 1', 540, 330, 150, '#FFFBEA'); ctx.restore(); }
      ring(lt, ek, 540, 1050, '#FFFFFF', 1.0, 1000); flash(lt, ek, '#FFFFFF', 0.8, 0.7);
      motes(t, 70, [0, 200, W, 1500], '#FFF6D8', 0.9, 80, 45, 4); vignette(0.35);
    } });
    cue(cut_(15), 'swell', { dur: 1.4, gain: 0.6 }); cue(cut_(15) + ek, 'drum', { gain: 1.0 }); cue(cut_(15) + ek + 0.05, 'conch', { dur: 2, gain: 0.6 }); }

  // 16 · one body, six faces: Shadanana
  { const sr = W_('शरीर', 16), mk = W_('मुख', 16), sd = W_('षडानन', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 820], zoom: 0.12, note: 'Shadanana reveal: close on Kartikeya, the five extra faces fan out behind on मुख; slips एक शरीर / छह मुख, ribbon षडानन', draw(lt, d, t) {
      gradSky(GOLD); godRays(540, 700, 0, TAU, 30, 1500, '#FFF0C0', 0.2, t); glow(540, 800, 600, '#FFE6A0', 0.3);
      kumar(540, 1750, 1150, t, { six: seg(lt, mk - 0.3, mk + 0.5), aura: 1 });
      slipAt(lt, sr, 'एक शरीर', 260, 260, 56, -0.04); slipAt(lt, mk, 'छह मुख', 820, 260, 56, 0.04);
      ribbonAt(lt, sd, 'षडानन', 540, 1380, 120); ring(lt, mk, 540, 750, '#FFE6A0', 0.9, 600);
      motes(t, 60, [0, 200, W, 1500], A.paleGold, 0.8, 50, 47, 4); vignette(0.45);
    } });
    cue(cut_(16) + mk, 'slam', { gain: 0.7 }); cue(cut_(16) + sd, 'bell', { gain: 0.7 }); }

  // 17 · raised by the Krittikas, so: Kartikeya
  { const kt = W_('कृत्तिकाओं', 17), kk = W_('कार्तिकेय', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 950], zoom: 0.1, note: 'starry dawn: the six Krittikas around the six-faced child, star-lines link each mother to a face; ribbon कार्तिकेय', draw(lt, d, t) {
      gradSky(STARV); stars(t, 160, -200, 1000, 49, 0.8); dawnSky(t, 0.35, 1200, 49);
      water(t, 1420, ['#3A2A6A', '#1A1240'], '#FFE6C8', 0.4);
      krittikas(t, 1, 1560, 440, 1);
      kumar(540, 1560, 620, t, { six: 1, aura: 0.8 });
      const k = seg(lt, kt, kt + 1); ctx.save(); ctx.strokeStyle = rgba('#DCE8FF', 0.5 * k); ctx.lineWidth = 4; ctx.setLineDash([4, 18]); for (const x of [110, 290, 450, 630, 790, 970]) { ctx.beginPath(); ctx.moveTo(x, 1560 - 440 * 1.08); ctx.lineTo(540, 1560 - 620 * 0.85); ctx.stroke(); } ctx.restore();
      ribbonAt(lt, kk, 'कार्तिकेय', 540, 330, 120);
      motes(t, 40, [0, 200, W, 1500], '#DCE8FF', 0.7, 30, 49, 3); vignette(0.5);
    } });
    cue(cut_(17) + kt, 'sparkle', { gain: 0.6 }); cue(cut_(17) + kk, 'drum', { gain: 0.8 }); cue(cut_(17) + kk + 0.05, 'bell', { gain: 0.6 }); }

  // 18 · WOW: commander of the devas, defeats Taraka (no violence: a wave of light dissolves the shadow)
  { const sp = W_('सेनापति', 18), hr = W_('हराया', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 950], zoom: 0.14, note: 'saffron dawn: Kartikeya raises the glowing vel (shakti), deva banners behind; a wave of light sweeps and Taraka shadow dissolves to smoke on हराया', draw(lt, d, t) {
      gradSky(SAFF); godRays(300, 900, 0, TAU, 28, 1500, '#FFE6A0', 0.15, t);
      const dz = seg(lt, hr - 0.1, hr + 0.9);
      ctx.save(); ctx.globalAlpha = 1 - dz; asura(860, 1550, 0.75, t, { eyes: 1 - dz, aura: 0.5 }); ctx.restore();
      for (let i = 0; i < 18; i++) { const k = dz; if (k > 0) { glow(860 + (rnd(i) - 0.5) * 500, 900 - k * 600 * rnd(i + 3) + rnd(i + 5) * 500, 80, '#5A4A5A', 0.3 * (1 - k)); } }
      for (let i = 0; i < 5; i++) { const x = 60 + i * 70; ctx.strokeStyle = '#5A2A16'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x, 1520); ctx.lineTo(x, 1080); ctx.stroke(); const fl = Math.sin(t * 4 + i) * 20; cut(P_poly([[x, 1080], [x + 110 + fl, 1110], [x, 1150]]), i % 2 ? '#E2552A' : '#F2C14E', { shadow: 0.3, edge: 2 }); }
      ground('#2A0E0A', 1530); kumar(380, 1540, 700, t, { six: 1, aura: 0.8 }); shakti(560, 1540, 0.9, 1 + seg(lt, sp, hr), -0.12);
      if (lt > hr - 0.1) { const k = eo(seg(lt, hr - 0.1, hr + 0.6)); ctx.save(); ctx.strokeStyle = rgba('#FFF6D8', 0.8 * (1 - k)); ctx.lineWidth = 40 * (1 - k) + 6; ctx.beginPath(); ctx.arc(560, 1000, 100 + 900 * k, -0.8, 0.8); ctx.stroke(); ctx.restore(); }
      slipAt(lt, sp, 'देव सेनापति', 540, 280, 62); flash(lt, hr, '#FFF6D8', 0.6, 0.6);
      embers(t, 40, 51, '#FFE6A0'); vignette(0.45);
    } });
    cue(cut_(18) + sp, 'conch', { dur: 1.6, gain: 0.6 }); cue(cut_(18) + hr, 'whoosh', { gain: 0.6 }); cue(cut_(18) + hr + 0.05, 'drum', { gain: 0.9 }); }

  // 19 · even today, the month of Kartik bears the mothers' name
  { const kt = W_('कार्तिक', 19), mo = W_('माँओं', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 950], zoom: 0.1, note: 'Kartik full-moon night: big full moon beside the Pleiades, ghat with rows of diyas on the river; slip कार्तिक मास, star cluster glows on माँओं', draw(lt, d, t) {
      gradSky(MOON); stars(t, 180, -200, 1000, 53, 0.8);
      glow(360, 500, 300, '#FFF6D8', 0.45); cut(P_circ(360, 500, 120), '#FFF8E6', { shadow: 0, edge: 0 });
      pleiades(800, 420, 1.2, t, 0.6 + 0.4 * seg(lt, mo - 0.3, mo + 0.4)); if (lt > mo) glow(800, 420, 220, '#DCE8FF', 0.4 * seg(lt, mo, mo + 0.5));
      ranges([{ y: 1150, h: 160, col: '#141C34', seed: 55, haze: 0.3 }], lt * 20, '#8AA0D0');
      water(t, 1260, ['#1A2A5A', '#0A1430'], '#FFE6A0', 0.6);
      for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) diya(70 + i * 118 + r * 30, 1300 + r * 90, 0.45 + r * 0.1, t, i + r * 9);
      cut(P_rr(-400, 1520, W + 800, H, 0), '#2A1E2A', { shadow: 0.4, edge: 3 });
      slipAt(lt, kt, 'कार्तिक मास', 540, 260, 64); slipAt(lt, mo, 'कृत्तिका नक्षत्र', 800, 600, 50, 0.03);
      vignette(0.5);
    } });
    cue(cut_(19), 'bell', { gain: 0.5 }); cue(cut_(19) + mo, 'sparkle', { gain: 0.6 }); }

  // 20 · loop: six mothers... six faces... and one son
  { const ma = W_('माँएँ', 20), mk = W_('मुख', 20), bt = W_('बेटा', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 960], zoom: 0.12, note: 'hook frame echo: six faint Krittikas, then six faces, then the one son blazing; slips stack', draw(lt, d, t) {
      gradSky(COSMIC); stars(t, 140, -200, 1100, 57, 0.7); godRays(540, 900, 0, TAU, 30, 1500, '#FFE6A0', 0.14, t);
      ctx.save(); ctx.globalAlpha = 0.5; krittikas(t, 1, 1500, 380, 1); ctx.restore();
      ground('#12060E', 1520); kumar(540, 1530, 720, t, { six: seg(lt, mk - 0.3, mk + 0.4), aura: 0.6 + 0.6 * seg(lt, bt - 0.2, bt + 0.4) });
      slipAt(lt, ma, 'छह माँएँ', 260, 260, 54, -0.04); slipAt(lt, mk, 'छह मुख', 820, 260, 54, 0.04); ribbonAt(lt, bt, 'एक बेटा', 540, 430, 100);
      ring(lt, bt, 540, 900, '#FFE6A0', 0.9, 700); flash(lt, bt, '#FFF6D8', 0.4, 0.6);
      motes(t, 60, [0, 200, W, 1500], '#FFB060', 0.8, 50, 57, 4); vignette(0.5);
    } });
    cue(cut_(20) + ma, 'heartbeat', { gain: 0.5 }); cue(cut_(20) + bt, 'drum', { gain: 0.8 }); cue(cut_(20) + bt + 0.05, 'bell', { gain: 0.7 }); }

  // 21-22 · end card
  { const st = cut_(21), f = Wd('फ़ॉलो', 22) - st;
    add({ id: 'S22', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: Kartik night, Pleiades + full moon over a diya-lit river, Untold Stories in gold', draw(lt, d, t) {
      gradSky(MOON); stars(t, 120, -200, 900, 59, 0.6); pleiades(820, 300, 1, t, 0.8); glow(260, 320, 200, '#FFF6D8', 0.35); cut(P_circ(260, 320, 80), '#FFF8E6', { shadow: 0, edge: 0 });
      water(t, 1260, ['#1A2A5A', '#0A1430'], '#FFE6A0', 0.5); for (let i = 0; i < 8; i++) diya(90 + i * 130, 1400, 0.55, t, i + 3);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 640, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 790, 80, '#FFE6C8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 940, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
