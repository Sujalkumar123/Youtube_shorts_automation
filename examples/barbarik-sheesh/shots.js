// खाटू श्याम को 'हारे का सहारा' क्यों कहते हैं? The story of Barbarik — cinematic cut paper.
// Skanda Purana (Kaumarika Khanda) + the Khatu Shyam tradition of Rajasthan.
// Palette: Kurukshetra dusk ember (hook) → arrow-blaze violet → forest dusk → Devi gold → war slate → mother's lamp amber →
// scale crimson → night path indigo → dawn road rose → peepal green-gold → Krishna blaze → empty-field blood sun →
// sheesh-daan white-gold → Kaliyug cosmic → Khatu temple saffron night → hook echo.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky, cloud, diya } from './atmos.js';
import { raja, devi, rishi, krishna, warrior, lotus, sudarshan } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const EMBER = [[0, '#0A0408'], [0.45, '#2A0E1A'], [0.78, '#8A2E1E'], [1, '#F08A3A']];
const VIOLET = [[0, '#05030F'], [0.5, '#1E1040'], [0.85, '#4A2A7A'], [1, '#8A5AB0']];
const FOREST = [[0, '#06100C'], [0.5, '#123A2A'], [0.85, '#3A6A3A'], [1, '#C89A4A']];
const GOLD = [[0, '#2A1206'], [0.5, '#8A4A12'], [1, '#F6C860']];
const SLATE = [[0, '#05070E'], [0.5, '#161C2E'], [1, '#3A465E']];
const AMBER = [[0, '#0E0604'], [0.5, '#3A1E0E'], [1, '#B8682A']];
const CRIMSON = [[0, '#100206'], [0.5, '#4A0E18'], [1, '#B83A2A']];
const INDIGO = [[0, '#03040E'], [0.5, '#0E1434'], [1, '#283A6A']];
const PEEPAL = [[0, '#0A1A10'], [0.5, '#2A4A22'], [0.85, '#8A9A3A'], [1, '#F2D27A']];
const BLAZE = [[0, '#0A1430'], [0.45, '#2A4A8A'], [0.8, '#8AB0E8'], [1, '#FFF2C8']];
const BLOOD = [[0, '#0A0204'], [0.5, '#3A0A0E'], [0.85, '#8A1E14'], [1, '#D2502A']];
const TEJ = [[0, '#2A1A06'], [0.5, '#A86A1A'], [0.85, '#F6D080'], [1, '#FFF6D8']];
const COSMIC = [[0, '#05030F'], [0.45, '#1E0E3A'], [0.8, '#3A2A7A'], [1, '#6A8AD0']];
const SAFF = [[0, '#12060E'], [0.45, '#4A1424'], [0.75, '#C2502A'], [1, '#FFB060']];
const BARB = { robe: '#2E3F7A', sash: '#E2552A' };

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function qmark(lt, w, x, y, size = 220) { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, '#FCE7B0'); ctx.restore(); } }
function ribbonAt(lt, w, text, x, y, size = 110) { if (lt > w - 0.15) K.ribbon(text, x, y, eob(seg(lt, w - 0.15, w + 0.2)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }
function ring(lt, w, x, y, col = '#FFE6A0', len = 0.9, R = 900) { if (lt > w && lt < w + len) { const k = seg(lt, w, w + len); ctx.save(); ctx.strokeStyle = rgba(col, 0.8 * (1 - k)); ctx.lineWidth = 30 * (1 - k) + 4; ctx.beginPath(); ctx.ellipse(x, y, R * eo(k), R * 0.4 * eo(k), 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
function clouds(t, cols, px = 0, a = 0.85) { for (const [cx, cy, s] of [[180, 420, 1.2], [880, 300, 1.0], [600, 1250, 1.4], [120, 1100, 0.9], [1000, 980, 1.1]]) cloud(((cx - px) % 1500 + 1500) % 1500 - 200, cy, s, cols[0], cols[1], cols[2], a); }
function embers(t, n = 50, seed = 1, col = '#FFB050') { motes(t, n, [0, 200, W, 1600], col, 0.9, 120, seed, 5); }
function petals(t, n, seed, cols = ['#F2A23A', '#E8566A']) { for (let i = 0; i < n; i++) { const k = (t * 0.14 + rnd(i + seed)) % 1; ctx.save(); ctx.translate(rnd(i + 9 + seed) * W + Math.sin(t + i) * 40, k * 1600); ctx.rotate(t * 2 + i); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, TAU); }, cols[i % cols.length], { shadow: 0, edge: 0 }); ctx.restore(); } }

// ---------- new kit ----------
// a glowing arrow (baan): tip at (x, y), pointing along rot (0 = right); len px; g glow 0..1
export function baan(x, y, len, rot, g = 1, col = '#F6D98A') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  if (g) { glow(-len * 0.4, 0, len * 0.6, '#FFE6A0', 0.35 * g); glow(0, 0, 60, '#FFFFFF', 0.6 * g); }
  cut(P_rr(-len, -5, len - 30, 10, 4), '#8A5A34', { shadow: 0.4, edge: 2 });
  cut(P_poly([[0, 0], [-46, -20], [-36, 0], [-46, 20]]), col, { shadow: 0.4, edge: 2 });
  for (const k of [-1, 1]) cut(P_poly([[-len + 6, 0], [-len - 24, k * 22], [-len + 40, k * 6]]), '#E2552A', { shadow: 0.2, edge: 2 });
  ctx.restore();
}
// a longbow (dhanush) at (x, y) = grip, height h, tilt rot
export function dhanush(x, y, h, rot = 0, col = '#6A3A1A') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.strokeStyle = col; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.quadraticCurveTo(h * 0.32, 0, 0, h / 2); ctx.stroke();
  ctx.strokeStyle = '#E0A93A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(h * 0.15, -16); ctx.lineTo(h * 0.15, 16); ctx.stroke();
  ctx.strokeStyle = 'rgba(247,239,220,0.85)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(0, h / 2); ctx.stroke();
  ctx.restore();
}
// Barbarik: young warrior in deep blue with saffron sash, bow at his side, three arrows in a quiver
export function barbarik(x, y, h, t, o = {}) {
  const s = h / 1150, dir = o.dir || 1;
  if (o.aura) glow(x, y - 700 * s, 560 * s, '#9FC4FF', 0.35 * o.aura);
  ctx.save(); ctx.translate(x - dir * 120 * s, y - 760 * s); ctx.rotate(-dir * 0.35); cut(P_rr(-30 * s, -60 * s, 60 * s, 300 * s, 20 * s), '#5A2A16', { shadow: 0.4, edge: 2 });
  for (let i = -1; i <= 1; i++) { glow(i * 22 * s, -90 * s, 40 * s, '#FFE6A0', 0.5 * (o.arrows ?? 1)); cut(P_poly([[i * 22 * s, -120 * s], [i * 22 * s - 12 * s, -70 * s], [i * 22 * s + 12 * s, -70 * s]]), '#F6D98A', { shadow: 0.2, edge: 1 }); }
  ctx.restore();
  raja({ x, y, h, t, pose: o.pose || 'stand', robe: BARB.robe, sash: BARB.sash, eyes: o.eyes ?? 0, dir });
  if (o.bow !== false) dhanush(x + dir * 170 * s, y - 560 * s, 820 * s, dir * 0.08);
}
// a peepal tree with heart-shaped leaves; base (x, y), s scale. pierce 0..1 marks leaves (glowing hole) in order; hide = index of the hidden leaf (skipped)
const LEAVES = (() => { const out = []; for (let i = 0; i < 46; i++) { const a = -Math.PI * (0.06 + 0.88 * rnd(i * 3 + 1)), r = 170 + 360 * Math.sqrt(rnd(i * 7 + 2)); out.push([Math.cos(a) * r * 1.15, -620 + Math.sin(a) * r * 0.85, rnd(i + 11) * 1.4 - 0.7]); } out.sort((p, q) => p[0] - q[0]); return out; })();
export function leaf(x, y, sz, rot, col, hole = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sz, sz);
  cut(() => { ctx.beginPath(); ctx.moveTo(0, 34); ctx.bezierCurveTo(-34, 10, -30, -26, 0, -16); ctx.bezierCurveTo(30, -26, 34, 10, 0, 34); ctx.lineTo(0, 54); ctx.closePath(); }, col, { shadow: 0.3, edge: 1.5 });
  if (hole > 0) { glow(0, 4, 26, '#FFF2C0', 0.9 * hole); circle(0, 4, 6 * hole, '#FFF8E0'); }
  ctx.restore();
}
export function peepal(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-40, -260, -30, -420); ctx.quadraticCurveTo(-180, -560, -320, -620); ctx.lineTo(-300, -650); ctx.quadraticCurveTo(-120, -600, -10, -500); ctx.quadraticCurveTo(0, -640, -60, -780); ctx.lineTo(-20, -790); ctx.quadraticCurveTo(50, -640, 30, -500); ctx.quadraticCurveTo(160, -600, 310, -640); ctx.lineTo(320, -610); ctx.quadraticCurveTo(170, -560, 40, -420); ctx.quadraticCurveTo(40, -260, 80, 0); ctx.closePath(); }, '#4A2E1A', { shadow: 0.7, edge: 3 });
  for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(74,46,26,0.8)'; ctx.lineWidth = 6; const rx = -60 + i * 26; ctx.beginPath(); ctx.moveTo(rx, -400); ctx.quadraticCurveTo(rx + Math.sin(t + i) * 8, -200, rx + 4, 0); ctx.stroke(); }
  const n = LEAVES.length, pierced = (o.pierce || 0) * n;
  LEAVES.forEach(([lx, ly, lr], i) => { if (i === o.hide) return; const sw = Math.sin(t * 1.6 + i) * 0.08; leaf(lx, ly, 1.25 + 0.3 * rnd(i), lr + sw, i % 3 ? '#3E7A2E' : i % 2 ? '#5A9A3A' : '#2E5A24', clamp(pierced - i)); });
  ctx.restore();
}
// a serene crowned head (Shyam): centre (x, y), r ~ face half-height; o = { aura, open (big eyes), garland, skin }
export function sheesh(x, y, r, t, o = {}) {
  ctx.save(); ctx.translate(x, y); const k = r / 82;
  if (o.aura) { glow(0, -20 * k, 260 * k, '#FFE6A0', 0.55 * o.aura); godRays(0, -20 * k, 0, TAU, 24, 380 * k, '#FFF0C0', 0.12 * o.aura, t); }
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 70 * k, 82 * k, 0, 0, TAU); }, o.skin || '#3A5FA8', { shadow: 0.5, edge: 3 });
  ctx.strokeStyle = '#141C34'; ctx.lineWidth = 5 * k; ctx.lineCap = 'round';
  if (o.open) { for (const s of [-1, 1]) { cut(() => { ctx.beginPath(); ctx.ellipse(s * 28 * k, -10 * k, 20 * k, 12 * k, 0, 0, TAU); }, '#F7EFDC', { shadow: 0, edge: 0 }); circle(s * 28 * k, -10 * k, 8 * k, '#141C34'); } }
  else for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(s * 26 * k, -12 * k, 12 * k, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke(); }
  ctx.strokeStyle = '#C8323D'; ctx.beginPath(); ctx.arc(0, 26 * k, 16 * k, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.fillStyle = '#F2A23A'; ctx.fillRect(-4 * k, -62 * k, 8 * k, 28 * k);
  for (const s of [-1, 1]) circle(s * 72 * k, 20 * k, 10 * k, '#E0A93A');
  cut(P_rr(-80 * k, -94 * k, 160 * k, 28 * k, 8 * k), '#E0A93A', { shadow: 0.3, edge: 2 });
  cut(P_poly([[-72 * k, -92 * k], [-52 * k, -146 * k], [-26 * k, -116 * k], [0, -180 * k], [26 * k, -116 * k], [52 * k, -146 * k], [72 * k, -92 * k]]), '#E0A93A', { shadow: 0.3, edge: 2 });
  circle(0, -158 * k, 8 * k, '#F7EFDC'); for (const s of [-1, 1]) circle(s * 40 * k, -112 * k, 6 * k, '#C8323D');
  ctx.save(); ctx.translate(34 * k, -150 * k); ctx.rotate(0.35); cut(() => { ctx.beginPath(); ctx.ellipse(0, -40 * k, 20 * k, 36 * k, 0, 0, TAU); }, '#2E8A6A', { shadow: 0.3, edge: 2 }); circle(0, -36 * k, 9 * k, '#1E4FA0'); ctx.restore();
  if (o.garland) for (let i = 0; i <= 22; i++) { const an = Math.PI * (0.05 + 0.9 * i / 22); circle(Math.cos(an) * 96 * k, 40 * k + Math.sin(an) * 70 * k, 13 * k, i % 2 ? '#F2A23A' : '#E8566A'); }
  ctx.restore();
}
// rows of soldier silhouettes with banners (no violence); side -1 left / +1 right
export function army(side, t, col, rim, n = 6, y0 = 1460, scale = 1, a = 1) {
  ctx.save(); ctx.globalAlpha *= a;
  for (let r = 0; r < 3; r++) for (let i = 0; i < n; i++) { const x = 540 + side * (80 + i * 70 + r * 30) * scale, y = y0 - r * 50; warrior(x, y, (150 - r * 25) * scale, col, rim, t, i + r * 7 + (side > 0 ? 40 : 0)); }
  for (let i = 0; i < 2; i++) { const x = 540 + side * (200 + i * 220) * scale, fl = Math.sin(t * 4 + i + side) * 16; ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y0 - 100); ctx.lineTo(x, y0 - 420 * scale); ctx.stroke(); cut(P_poly([[x, y0 - 420 * scale], [x - side * (110 + fl), y0 - 390 * scale], [x, y0 - 350 * scale]]), side < 0 ? '#C8401A' : '#E0A93A', { shadow: 0.3, edge: 2 }); }
  ctx.restore();
}
// golden scales (taraazu); base (x, y), tilt rad (+ = right pan down)
export function scales(x, y, s, tilt) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-12, -520, 24, 520, 8), '#B07A22', { shadow: 0.5, edge: 2 }); cut(P_rr(-120, -20, 240, 30, 10), '#8A5A1A', { shadow: 0.5, edge: 2 });
  ctx.save(); ctx.translate(0, -520); ctx.rotate(tilt); cut(P_rr(-360, -12, 720, 24, 10), '#E0A93A', { shadow: 0.5, edge: 2 });
  for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 340, 0); ctx.rotate(-tilt); ctx.strokeStyle = '#E0A93A'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, 220); ctx.moveTo(0, 0); ctx.lineTo(90, 220); ctx.stroke(); cut(() => { ctx.beginPath(); ctx.ellipse(0, 230, 110, 30, 0, 0, Math.PI); }, '#B07A22', { shadow: 0.4, edge: 2 }); ctx.restore(); }
  ctx.restore(); circle(0, -520, 22, '#F6D98A'); ctx.restore();
}
// a Rajasthani temple shikhara with a saffron flag; base centre (cx, base)
export function temple(cx, base, s, col = '#E8C07A', col2 = '#C8864A') {
  ctx.save(); ctx.translate(cx, base); ctx.scale(s, s);
  cut(P_rr(-380, -320, 760, 320, 6), col2, { shadow: 0.7, edge: 3 });
  cut(P_poly([[-300, -320], [-220, -700], [-120, -880], [0, -1020], [120, -880], [220, -700], [300, -320]]), col, { shadow: 0.7, edge: 3 });
  for (let i = 1; i < 6; i++) { ctx.strokeStyle = 'rgba(90,40,20,0.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-300 + i * 18, -320 - i * 110); ctx.lineTo(300 - i * 18, -320 - i * 110); ctx.stroke(); }
  cut(P_circ(0, -1050, 46), '#E0A93A', { shadow: 0.4, edge: 2 }); ctx.strokeStyle = '#6A3A1A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -1090); ctx.lineTo(0, -1260); ctx.stroke();
  cut(P_poly([[0, -1260], [150, -1220], [0, -1180]]), '#F2702A', { shadow: 0.3, edge: 2 });
  ctx.restore();
}
export function nishan(x, y, h, t, col = '#F2702A') { ctx.strokeStyle = '#4A2A14'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - h); ctx.stroke(); const fl = Math.sin(t * 4 + x) * 14; cut(P_poly([[x, y - h], [x + 90 + fl, y - h + 26], [x, y - h + 60]]), col, { shadow: 0.3, edge: 2 }); }
// the brahmin (Krishna in disguise) seen big: his foot comes down at about (600, 1530) as down goes 0..1
function brahminBig(t, down) { rishi(560, 1540 - 70 * (1 - down), { s: 1.25, t, pose: 'stand', dir: -1 }); }
export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK (thumbnail)
  { const pl = W_('पल', 0), kh = W_('ख़त्म', 0);
    add({ id: 'S01', at: 0, cam: [540, 900], zoom: 0.14, note: 'ember dusk: Barbarik on a ridge, three blazing arrows fanned above, two armies with banners below; ring on पल', draw(lt, d, t) {
      gradSky(EMBER); stars(t, 60, -200, 700, 3, 0.5); glow(540, 1050, 520, '#F08A3A', 0.35);
      godRays(540, 560, 0, TAU, 30, 1500, '#FFE6A0', 0.14, t);
      ranges([{ y: 1230, h: 240, col: '#3A1420', seed: 4, haze: 0.4 }], lt * 20, '#F08A3A');
      army(-1, t, '#14060C', '#F08A3A', 6, 1500, 1, 0.95); army(1, t, '#14060C', '#F08A3A', 6, 1500, 1, 0.95);
      cut(P_poly([[300, 1540], [430, 1300], [650, 1300], [780, 1540]]), '#1E0A12', { shadow: 0.6, edge: 3 });
      for (let i = -1; i <= 1; i++) { const a = -Math.PI / 2 + i * 0.42, r = 520; baan(540 + Math.cos(a) * r, 760 + Math.sin(a) * r * 0.6 - 60, 300, a, 0.9 + 0.1 * Math.sin(t * 5 + i)); }
      barbarik(540, 1310, 640, t, { aura: 1 });
      ring(lt, pl, 540, 900, '#FFE6A0', 0.9, 700); slipAt(lt, pl, 'सिर्फ़ 1 पल', 540, 300, 64); flash(lt, kh, '#FFE6A0', 0.35, 0.5);
      embers(t, 60, 3); vignette(0.5);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'bell', { gain: 0.6 }); cue(0.1, 'swell', { dur: 2.2, gain: 0.5 }); cue(pl, 'damru', { gain: 0.6 }); }

  // 1 · just three arrows. but whose?
  { const tn = W_('तीन', 1), ks = W_('किसके', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 900], zoom: 0.1, note: 'violet: three glowing arrows spin around a light core; ? on किसके', draw(lt, d, t) {
      gradSky(VIOLET); stars(t, 160, -200, 1200, 5, 0.8); mist(1300, 300, '#6A5A9A', 0.35, t);
      const k = eo(seg(lt, 0, tn + 0.4)); glow(540, 900, 260, '#FFE6A0', 0.5);
      for (let i = 0; i < 3; i++) { const a = i / 3 * TAU + t * 0.6; const r = 260 * k; baan(540 + Math.cos(a) * r, 900 + Math.sin(a) * r, 340, a + Math.PI / 2, 1); }
      ranges([{ y: 1380, h: 160, col: '#120A24', seed: 8 }], lt * 20, '#8A5AB0'); ground('#0A0818', 1530);
      slipAt(lt, tn, '3 बाण', 540, 300, 70); qmark(lt, ks, 540, 520, 180);
      motes(t, 40, [0, 200, W, 1500], '#DCE8FF', 0.7, 30, 5, 3); vignette(0.5);
    } });
    cue(cut_(1), 'whoosh', { gain: 0.5 }); cue(cut_(1) + tn, 'sparkle', { gain: 0.6 }); cue(cut_(1) + ks, 'drum', { gain: 0.7 }); }

  // 2 · grandson of Bhima, son of Ghatotkacha: Barbarik
  { const bh = W_('भीम', 2), gh = W_('घटोत्कच', 2), bb = W_('बर्बरीक', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 920], zoom: 0.1, note: 'forest dusk: two giant ancestor silhouettes behind young Barbarik who steps forward; slips + ribbon बर्बरीक', draw(lt, d, t) {
      gradSky(FOREST); glow(540, 1100, 500, '#C89A4A', 0.3);
      ranges([{ y: 1150, h: 260, col: '#0E2A1E', seed: 13, haze: 0.4 }, { y: 1320, h: 160, col: '#08180F', seed: 15 }], lt * 25, '#C89A4A');
      ctx.save(); ctx.globalAlpha = 0.5 * eo(seg(lt, bh - 0.2, bh + 0.4)); warrior(240, 1500, 700, '#0A140E', '#C89A4A', t, 2); ctx.restore();
      ctx.save(); ctx.globalAlpha = 0.5 * eo(seg(lt, gh - 0.2, gh + 0.4)); warrior(840, 1500, 820, '#0A140E', '#C89A4A', t, 5); ctx.restore();
      ground('#06120A', 1530);
      const st = eo(seg(lt, 0, 1)); barbarik(540, 1540 + 30 * (1 - st), 720, t, { aura: seg(lt, bb - 0.2, bb + 0.4) });
      slipAt(lt, bh, 'भीम का पोता', 250, 280, 52, -0.04); slipAt(lt, gh, 'घटोत्कच का बेटा', 780, 380, 50, 0.04);
      ribbonAt(lt, bb, 'बर्बरीक', 540, 560, 120);
      motes(t, 40, [0, 200, W, 1500], '#F2D27A', 0.6, 30, 13, 3); vignette(0.55);
    } });
    cue(cut_(2) + bh, 'thud', { gain: 0.7 }); cue(cut_(2) + gh, 'thud', { gain: 0.7 }); cue(cut_(2) + bb, 'drum', { gain: 0.8 }); cue(cut_(2) + bb + 0.05, 'bell', { gain: 0.5 }); }

  // 3 · WOW: by penance to the Devi, three infallible arrows
  { const dv = W_('देवी', 3), am = W_('अमोघ', 3), ml = W_('मिले', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 880], zoom: 0.14, note: 'Devi gold: Barbarik in tapas (left), the Devi in a blaze (right), three arrows of light descend to him; ring + flash on मिले', draw(lt, d, t) {
      gradSky(GOLD); godRays(700, 600, 0, TAU, 32, 1500, '#FFF0C0', 0.18, t);
      clouds(t, ['#C8862A', '#FFE0A0', '#8A4A12'], lt * 40, 0.6); ground('#3A2410', 1540);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, dv - 0.4, dv + 0.4)); devi({ x: 760, y: 1240, h: 760, t, pose: 'boon', sari: '#C0392B', glowA: 1, eyes: 0, dir: -1 }); ctx.restore();
      raja({ x: 300, y: 1550, h: 680, t, pose: 'tapas', robe: BARB.robe, sash: BARB.sash, eyes: 0 });
      const k = eio(seg(lt, am - 0.4, ml + 0.2));
      for (let i = -1; i <= 1; i++) { const x = lerp(760 + i * 60, 300 + i * 40, k), y = lerp(560, 780, k); baan(x, y, 220, Math.PI / 2 + 0.6 - i * 0.2 + (1 - k) * 0.4, 1); }
      slipAt(lt, dv, 'देवी की तपस्या', 540, 260, 56); ribbonAt(lt, am, '3 अमोघ बाण', 540, 1380, 84);
      ring(lt, ml, 300, 800, '#FFFFFF', 0.9, 600); flash(lt, ml, '#FFF6D8', 0.5, 0.6);
      motes(t, 60, [0, 200, W, 1500], A.paleGold, 0.8, 50, 23, 4); vignette(0.4);
    } });
    cue(cut_(3) + dv, 'bell', { gain: 0.6 }); cue(cut_(3) + am, 'swell', { dur: 1.2, gain: 0.6 }); cue(cut_(3) + ml, 'drum', { gain: 0.9 }); }

  // 4 · one arrow could mark an entire army
  { const bn = W_('बाण', 4), sn = W_('सेना', 4), ns = W_('निशाना', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 960], zoom: 0.12, note: 'war slate: one arrow streaks over rows of soldiers; a glowing mark lights on each in sequence', draw(lt, d, t) {
      gradSky(SLATE); clouds(t, ['#1E2234', '#3A4058', '#0E1018'], lt * 80, 0.8);
      ranges([{ y: 1200, h: 200, col: '#141A2A', seed: 21, haze: 0.3 }], lt * 30, '#8AA0D0');
      const k = seg(lt, bn, ns + 0.6);
      for (let r = 0; r < 3; r++) for (let i = 0; i < 12; i++) { const x = 60 + i * 88 + r * 30, y = 1500 - r * 70, hh = 160 - r * 28; warrior(x, y, hh, '#0A0E18', '#5A6A90', t, i + r * 13);
        const on = clamp(k * 14 - i - r * 0.3); if (on > 0) { glow(x - 10, y - hh * 0.9, 40, '#FFE6A0', 0.9 * on); circle(x - 10, y - hh * 0.9, 7 * on, '#FFF8E0'); } }
      const ax = lerp(-200, 1300, eio(k)); baan(ax, 700 + Math.sin(k * 6) * 80, 360, 0.05 + Math.cos(k * 6) * 0.2, 1);
      ctx.save(); ctx.strokeStyle = rgba('#FFE6A0', 0.4); ctx.lineWidth = 6; ctx.setLineDash([10, 20]); ctx.beginPath(); for (let i = 0; i <= 30; i++) { const kk = i / 30 * eio(k); const xx = lerp(-200, 1300, kk); i ? ctx.lineTo(xx, 700 + Math.sin(kk * 6) * 80) : ctx.moveTo(xx, 700); } ctx.stroke(); ctx.restore();
      ground('#05070E', 1540); slipAt(lt, bn, 'एक बाण', 300, 280, 60); slipAt(lt, sn, 'पूरी सेना', 780, 380, 58, 0.04);
      vignette(0.55);
    } });
    cue(cut_(4) + bn, 'whoosh', { gain: 0.7 }); cue(cut_(4) + sn, 'sparkle', { gain: 0.6 }); cue(cut_(4) + ns, 'slam', { gain: 0.7 }); }

  // 5 · he had given his mother a promise
  { const ma = W_('माँ', 5), vc = W_('वचन', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 880], zoom: 0.1, note: 'lamp amber night: mother (left) and Barbarik (right) facing each other over a diya; ribbon एक वचन', draw(lt, d, t) {
      gradSky(AMBER); stars(t, 60, -200, 600, 27, 0.4); glow(540, 1300, 420, '#FFB050', 0.45);
      ranges([{ y: 1250, h: 180, col: '#2A1408', seed: 27, haze: 0.3 }], lt * 20, '#B8682A');
      ground('#1A0C06', 1540);
      devi({ x: 290, y: 1550, h: 760, t, pose: 'namaste', sari: '#7A2A5A', border: '#E0A93A', eyes: 0 });
      barbarik(790, 1550, 760, t, { pose: 'stand', dir: -1, bow: false });
      diya(540, 1430, 1.4, t, 3); glow(540, 1380, 140 + 20 * Math.sin(t * 6), '#FFC24A', 0.6);
      slipAt(lt, ma, 'माँ', 300, 300, 66); ribbonAt(lt, vc, 'एक वचन', 540, 420, 100);
      motes(t, 30, [0, 200, W, 1500], '#FFC24A', 0.6, 40, 27, 3); vignette(0.55);
    } });
    cue(cut_(5) + ma, 'heartbeat', { gain: 0.5 }); cue(cut_(5) + vc, 'bell', { gain: 0.6 }); }

  // 6 · I will always fight for the losing side
  { const hm = W_('हमेशा', 6), hr = W_('हारने', 6), ld = W_('लड़ूँगा', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 900], zoom: 0.12, note: 'crimson: giant golden scales tilt; a small glowing Barbarik appears on the lower, losing pan; ribbon हारे का साथ', draw(lt, d, t) {
      gradSky(CRIMSON); godRays(540, 600, 0, TAU, 24, 1400, '#FFB070', 0.1, t); embers(t, 40, 31);
      ranges([{ y: 1300, h: 180, col: '#2A0610', seed: 31, haze: 0.3 }], lt * 20, '#B83A2A');
      const tilt = 0.2 * eio(seg(lt, 0, hr + 0.3));
      scales(540, 1500, 1.1, tilt);
      const px = 540 + Math.cos(tilt) * 374, py = 1500 - 572 + Math.sin(tilt) * 374 + 253 - 10;
      ctx.save(); ctx.globalAlpha = seg(lt, hr - 0.3, hr + 0.3); barbarik(px, py, 230, t, { aura: 1 }); ctx.restore();
      ground('#100206', 1530);
      slipAt(lt, hm, 'हमेशा', 540, 280, 58); ribbonAt(lt, hr, 'हारे का साथ', 540, 420, 96);
      flash(lt, ld, '#FFE6A0', 0.3, 0.5); vignette(0.55);
    } });
    cue(cut_(6) + hr, 'tock', { gain: 0.6 }); cue(cut_(6) + ld, 'drum', { gain: 0.8 }); }

  // 7 · open loop
  { const md = W_('मोड़', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 950], zoom: 0.12, note: 'night indigo: a lone path to the dark horizon, Barbarik walking, a point of blue light far ahead; ? on मोड़', draw(lt, d, t) {
      gradSky(INDIGO); stars(t, 200, -200, 1200, 33, 0.8);
      ranges([{ y: 1100, h: 200, col: '#0E1434', seed: 33, haze: 0.3 }, { y: 1300, h: 140, col: '#070A1C', seed: 35 }], lt * 15, '#6A8AD0');
      cut(P_poly([[480, 1100], [600, 1100], [900, 1920], [180, 1920]]), '#1A2244', { shadow: 0.3, edge: 2 });
      glow(540, 1080, 80 + 20 * Math.sin(t * 4), '#9FC4FF', 0.7);
      barbarik(540, 1520 - lt * 20, 380, t, { pose: 'walk' });
      mist(1350, 300, '#3A4A8A', 0.35, t); qmark(lt, md, 540, 420, 220); vignette(0.6);
    } });
    cue(cut_(7) + md, 'heartbeat', { gain: 0.7 }); }

  // 8 · on the way a brahmin stopped him
  { const br = W_('ब्राह्मण', 8), rk = W_('रोका', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 920], zoom: 0.1, note: 'rose dawn road: an old brahmin raises a hand; Barbarik halts (left); slip एक ब्राह्मण', draw(lt, d, t) {
      dawnSky(t, 1, 1150, 37); ranges([{ y: 1200, h: 200, col: '#6A3A4A', seed: 37, haze: 0.4 }], lt * 20, '#F08A6A');
      ground('#3A1A22', 1530);
      const stop = seg(lt, rk - 0.3, rk + 0.2); barbarik(300 + 60 * eo(seg(lt, 0, rk)), 1540, 700, t, { pose: stop < 0.5 ? 'walk' : 'stand' });
      ctx.save(); ctx.globalAlpha = eo(seg(lt, br - 0.4, br + 0.3)); rishi(780, 1540, { s: 0.72, t, pose: lt > rk - 0.2 ? 'curse' : 'stand', dir: -1 }); ctx.restore();
      slipAt(lt, br, 'एक ब्राह्मण', 760, 300, 58, 0.03);
      petals(t, 14, 37, ['#F2A23A', '#FFD8A0']); vignette(0.45);
    } });
    cue(cut_(8) + br, 'bell', { gain: 0.4 }); cue(cut_(8) + rk, 'thud', { gain: 0.7 }); }

  // 9 · pierce all the leaves of this peepal with one arrow
  { const pp = W_('पीपल', 9), bd = W_('भेदो', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 860], zoom: 0.12, note: 'peepal green-gold: huge peepal tree, leaves swaying; brahmin points; slip पीपल के सारे पत्ते, ? on भेदो', draw(lt, d, t) {
      gradSky(PEEPAL); godRays(540, 300, 0, TAU, 26, 1500, '#FFF0C0', 0.12, t);
      ranges([{ y: 1250, h: 180, col: '#1E3A1A', seed: 41, haze: 0.4 }], lt * 20, '#F2D27A');
      peepal(540, 1520, 1.25, t); ground('#0E1E0C', 1530);
      rishi(900, 1540, { s: 0.5, t, pose: 'curse', dir: -1 }); barbarik(170, 1540, 480, t);
      slipAt(lt, pp, 'पीपल के सारे पत्ते', 540, 260, 56); qmark(lt, bd, 540, 760, 160);
      motes(t, 40, [0, 200, W, 1500], '#F2D27A', 0.6, 30, 41, 3); vignette(0.45);
    } });
    cue(cut_(9) + pp, 'sparkle', { gain: 0.5 }); cue(cut_(9) + bd, 'drum', { gain: 0.7 }); }

  // 10 · the brahmin secretly hides one leaf under his foot
  { const ch = W_('चुपके', 10), pt = W_('पत्ता', 10), ni = W_('नीचे', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 1150], zoom: 0.14, note: 'close: one heart leaf drifts down and the brahmin foot comes down over it; slip चुपके से', draw(lt, d, t) {
      gradSky(PEEPAL); glow(540, 1200, 600, '#F2D27A', 0.25);
      ctx.save(); ctx.globalAlpha = 0.4; peepal(540, 1100, 0.9, t); ctx.restore();
      cut(P_rr(-400, 1380, W + 800, H, 0), '#2A3A1A', { shadow: 0.3, edge: 2 });
      const k = eio(seg(lt, pt - 0.3, ni)); leaf(lerp(220, 590, k), lerp(700, 1500, k), 1.8, (1 - k) * 2, '#5A9A3A');
      brahminBig(t, eio(seg(lt, ni - 0.1, ni + 0.4)));
      slipAt(lt, ch, 'चुपके से...', 540, 300, 64); if (lt > ni) glow(590, 1510, 120, '#FFF2C0', 0.4 * seg(lt, ni, ni + 0.5));
      vignette(0.55);
    } });
    cue(cut_(10) + ch, 'slide', { gain: 0.5 }); cue(cut_(10) + ni, 'tock', { gain: 0.6 }); }

  // 11 · WOW: the arrow flies, every leaf pierced
  { const bc = W_('चला', 11), ch = W_('छिदा', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 860], zoom: 0.16, note: 'the arrow loops through the peepal crown with a light trail; each leaf lights with a glowing hole; ribbon हर पत्ता छिदा', draw(lt, d, t) {
      gradSky(PEEPAL); godRays(540, 600, 0, TAU, 30, 1500, '#FFF0C0', 0.16, t * 2);
      const k = seg(lt, bc - 0.1, ch + 0.5); peepal(540, 1520, 1.25, t, { pierce: k, hide: 23 }); ground('#0E1E0C', 1530);
      const path = (u) => { const a = u * TAU * 1.6; return [540 + Math.cos(a) * 420 * (0.4 + 0.6 * u), 760 + Math.sin(a) * 300 * (0.5 + 0.5 * u)]; };
      ctx.save(); ctx.strokeStyle = rgba('#FFF2C0', 0.6); ctx.lineWidth = 8; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const [x, y] = path(i / 60 * k); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      const [ax, ay] = path(k), [bx, by] = path(Math.max(0, k - 0.01)); baan(ax, ay, 260, Math.atan2(ay - by, ax - bx + 1e-6), 1);
      ribbonAt(lt, ch, 'हर पत्ता छिदा', 540, 300, 96);
      motes(t, 60, [0, 200, W, 1500], '#FFF2C0', 0.8, 60, 45, 4); vignette(0.4);
    } });
    cue(cut_(11) + bc, 'whoosh', { gain: 0.8 }); cue(cut_(11) + ch, 'sparkle', { gain: 0.7 }); }

  // 12 · and then it stopped at the brahmin's foot!
  { const pr = W_('पैर', 12), rk = W_('रुक', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 1150], zoom: 0.14, note: 'the arrow spirals down and hovers, quivering, at the brahmin foot; ring + flash on रुक; slip पैर पर!', draw(lt, d, t) {
      gradSky(PEEPAL); glow(540, 1300, 500, '#FFF2C0', 0.3);
      ctx.save(); ctx.globalAlpha = 0.35; peepal(540, 1100, 0.9, t, { pierce: 1, hide: 23 }); ctx.restore();
      cut(P_rr(-400, 1380, W + 800, H, 0), '#2A3A1A', { shadow: 0.3, edge: 2 }); brahminBig(t, 1);
      const k = eio(seg(lt, 0, rk)); const a = (1 - k) * TAU * 1.2; const ax = 470 + Math.cos(a) * 300 * (1 - k), ay = 1490 + Math.sin(a) * 260 * (1 - k) - 300 * (1 - k);
      const q = lt > rk ? Math.sin(t * 50) * 4 * (1 - seg(lt, rk, rk + 1)) : 0; baan(ax + q, ay, 300, 0.05 * (1 - k) + (1 - k) * 0.8, 1);
      slipAt(lt, pr, 'पैर पर!', 540, 300, 72); ring(lt, rk, 520, 1500, '#FFF2C0', 0.9, 500); flash(lt, rk, '#FFF6D8', 0.5, 0.5);
      vignette(0.5);
    } });
    cue(cut_(12) + pr, 'whoosh', { gain: 0.5 }); cue(cut_(12) + rk, 'slam', { gain: 0.9 }); }

  // 13 · WOW: that brahmin was Shri Krishna himself
  { const sw = W_('स्वयं', 13), sk = W_('श्रीकृष्ण', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 880], zoom: 0.16, note: 'blue-gold blaze: the brahmin dissolves into light and Krishna stands in his place, Sudarshan behind; ribbon श्रीकृष्ण', draw(lt, d, t) {
      gradSky(BLAZE); godRays(540, 700, 0, TAU, 40, 1600, '#FFFFFF', 0.12 + 0.12 * seg(lt, sk - 0.2, sk + 0.4), t * 2);
      ranges([{ y: 1280, h: 200, col: '#1E3A6A', seed: 51, haze: 0.4 }], lt * 20, '#FFF2C8'); ground('#0A1430', 1540);
      const k = seg(lt, sw - 0.2, sk + 0.2);
      ctx.save(); ctx.globalAlpha = 1 - k; rishi(540, 1550, { s: 0.82, t, pose: 'stand' }); ctx.restore();
      if (k > 0) { ctx.save(); ctx.globalAlpha = k; sudarshan(540, 520, 110 * eo(k), t, 1); krishna(540, 1550, { s: 0.85, t, pose: 'flute', aura: 1 }); ctx.restore(); }
      ribbonAt(lt, sk, 'श्रीकृष्ण', 540, 1290, 120); ring(lt, sk, 540, 900, '#FFFFFF', 1, 900); flash(lt, sk, '#FFFFFF', 0.7, 0.7);
      motes(t, 70, [0, 200, W, 1500], '#FFF2C8', 0.9, 80, 51, 4); vignette(0.35);
    } });
    cue(cut_(13) + sw, 'swell', { dur: 1.2, gain: 0.6 }); cue(cut_(13) + sk, 'drum', { gain: 1 }); cue(cut_(13) + sk + 0.05, 'conch', { dur: 2, gain: 0.6 }); }

  // 14 · whichever side lost, Barbarik would go there
  { const hr = W_('हारता', 14), ud = W_('उधर', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 950], zoom: 0.1, note: 'war slate: two armies; a glowing blue spark (Barbarik) leaps between them while both sides fade', draw(lt, d, t) {
      gradSky(SLATE); clouds(t, ['#1E2234', '#3A4058', '#0E1018'], lt * 100, 0.8);
      const shrink = 1 - 0.55 * seg(lt, 0.3, d);
      army(-1, t, '#0A0E18', '#C8401A', 6, 1500, 1, 0.5 + 0.5 * shrink); army(1, t, '#0A0E18', '#E0A93A', 6, 1500, 1, 0.5 + 0.5 * shrink);
      const u = seg(lt, hr - 0.4, d); const x = 540 + Math.sin(u * Math.PI * 3) * 330, y = 1000 - Math.abs(Math.cos(u * Math.PI * 3)) * 220;
      glow(x, y, 110, '#9FC4FF', 0.8); circle(x, y, 22, '#EAF2FF');
      ground('#05070E', 1540); slipAt(lt, hr, 'जो हारे...', 260, 300, 56, -0.04); slipAt(lt, ud, '...उधर बर्बरीक', 760, 420, 54, 0.04);
      vignette(0.55);
    } });
    cue(cut_(14) + hr, 'zip', { gain: 0.5 }); cue(cut_(14) + ud, 'zip', { gain: 0.6 }); }

  // 15 · in the end only he would remain
  { const ai = W_('ऐसे', 15), vh = W_('वही', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 950], zoom: 0.12, note: 'blood sun over an empty plain: fallen banners, one lone warrior silhouette under a giant red sun; ribbon बस वही बचता', draw(lt, d, t) {
      gradSky(BLOOD); glow(540, 900, 500, '#FF6A3A', 0.4); cut(P_circ(540, 900, 260), '#E2502A', { shadow: 0, edge: 0 });
      ranges([{ y: 1300, h: 160, col: '#2A0608', seed: 55, haze: 0.4 }], lt * 20, '#D2502A');
      mist(1250, 260, '#6A1A14', 0.5, t);
      for (let i = 0; i < 6; i++) { const x = 80 + i * 180; if (x > 420 && x < 660) continue; ctx.save(); ctx.translate(x, 1520); ctx.rotate(-0.6 + rnd(i) * 1.2); ctx.strokeStyle = '#1A0406'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -220); ctx.stroke(); cut(P_poly([[0, -220], [70, -200], [0, -170]]), '#3A0A0E', { shadow: 0.3, edge: 2 }); ctx.restore(); }
      ground('#0A0203', 1530);
      warrior(540, 1530, 560 + 40 * seg(lt, vh - 0.3, vh + 0.4), '#0A0204', '#FF6A3A', t, 3);
      ribbonAt(lt, vh, 'बस वही बचता', 540, 330, 96); embers(t, 40, 55);
      vignette(0.6);
    } });
    cue(cut_(15) + ai, 'heartbeat', { gain: 0.6 }); cue(cut_(15) + vh, 'thud', { gain: 0.8 }); }

  // 16 · then Krishna asked for his head as daan
  { const dn = W_('दान', 16), ss = W_('शीश', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 900], zoom: 0.1, note: 'twilight blue: Krishna (right), Barbarik (left) facing him, a lotus of light opens between them; ribbon शीश दान', draw(lt, d, t) {
      gradSky(COSMIC); stars(t, 120, -200, 900, 57, 0.7); glow(540, 1100, 500, '#9FC4FF', 0.3);
      ranges([{ y: 1250, h: 220, col: '#141C3A', seed: 57, haze: 0.3 }], lt * 20, '#6A8AD0'); ground('#080A1C', 1540);
      krishna(790, 1550, { s: 0.72, t, pose: 'flute', aura: 0.6 }); barbarik(290, 1550, 720, t, { bow: false });
      const k = seg(lt, ss - 0.4, ss + 0.4); lotus(540, 1180, 1.4, k); glow(540, 1150, 160 * k, '#FFF2C0', 0.7);
      slipAt(lt, dn, 'दान', 540, 280, 66); ribbonAt(lt, ss, 'शीश दान', 540, 460, 110);
      motes(t, 40, [0, 200, W, 1500], '#DCE8FF', 0.6, 30, 57, 3); vignette(0.55);
    } });
    cue(cut_(16) + dn, 'bell', { gain: 0.5 }); cue(cut_(16) + ss, 'drum', { gain: 0.9 }); cue(cut_(16) + ss + 0.05, 'heartbeat', { gain: 0.6 }); }

  // 17 · WOW: Barbarik, smiling, gave it (symbolic: he dissolves into light, a crowned head of light rises)
  { const mk = W_('मुस्कुराकर', 17), dn = W_('दान', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 880], zoom: 0.14, note: 'white-gold: Barbarik in tapas dissolves into rising petals of light and a serene crowned head of light rises; flash + ring on दान (symbolic)', draw(lt, d, t) {
      gradSky(TEJ); godRays(540, 700, 0, TAU, 40, 1600, '#FFFFFF', 0.2, t * 2);
      clouds(t, ['#E8B860', '#FFF2C8', '#B07A22'], lt * 30, 0.5); ground('#5A3410', 1540);
      const dz = seg(lt, dn - 0.4, dn + 0.6);
      ctx.save(); ctx.globalAlpha = 1 - dz; raja({ x: 540, y: 1550, h: 760, t, pose: 'tapas', robe: BARB.robe, sash: BARB.sash, eyes: 0 }); ctx.restore();
      if (dz > 0) { for (let i = 0; i < 30; i++) { const k = dz + rnd(i) * 0.4; ctx.save(); ctx.translate(540 + (rnd(i + 3) - 0.5) * 500 * k, 1400 - 800 * k * rnd(i + 5)); ctx.rotate(t + i); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 16, 8, 0, 0, TAU); }, i % 2 ? '#FFF2C0' : '#F2A23A', { shadow: 0, edge: 0 }); ctx.restore(); }
        ctx.save(); ctx.globalAlpha = dz; sheesh(540, lerp(1000, 640, eo(dz)), 120, t, { aura: dz }); ctx.restore(); }
      slipAt(lt, mk, 'मुस्कुराकर...', 540, 280, 60);
      ring(lt, dn, 540, 800, '#FFFFFF', 1, 900); flash(lt, dn, '#FFFFFF', 0.8, 0.8);
      motes(t, 70, [0, 200, W, 1500], '#FFF6D8', 0.9, 80, 59, 4); vignette(0.35);
    } });
    cue(cut_(17) + mk, 'swell', { dur: 1.4, gain: 0.5 }); cue(cut_(17) + dn, 'drum', { gain: 1 }); cue(cut_(17) + dn + 0.05, 'bell', { gain: 0.8 }); }

  // 18 · Krishna: in Kali Yuga you will be worshipped by my name
  { const kl = W_('कलियुग', 18), nm = W_('नाम', 18), pj = W_('पूजे', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 900], zoom: 0.12, note: 'cosmic: Krishna (right) blesses; the head of light on a hilltop (left); the name श्याम forms in gold; slip कलियुग', draw(lt, d, t) {
      gradSky(COSMIC); stars(t, 200, -200, 1200, 61, 0.8); godRays(760, 700, 0, TAU, 28, 1400, '#BFD8FF', 0.12, t);
      cut(P_poly([[-100, 1540], [120, 1080], [260, 1000], [420, 1100], [620, 1540]]), '#1A1A3A', { shadow: 0.7, edge: 3 });
      sheesh(260, 900, 90, t, { aura: 0.8 });
      ground('#080A1C', 1540); krishna(800, 1550, { s: 0.72, t, pose: 'flute', aura: 1 });
      slipAt(lt, kl, 'कलियुग', 760, 280, 62, 0.03);
      if (lt > nm - 0.1) { ctx.save(); ctx.globalAlpha = eo(seg(lt, nm - 0.1, nm + 0.4)); ctx.shadowColor = rgba('#E0A93A', 0.9); ctx.shadowBlur = 40; bigText('श्याम', 540, 520, 170, '#FFE6A0'); ctx.restore(); }
      ring(lt, pj, 260, 900, '#FFE6A0', 0.9, 400); motes(t, 50, [0, 200, W, 1500], '#DCE8FF', 0.7, 40, 61, 3); vignette(0.5);
    } });
    cue(cut_(18) + kl, 'conch', { dur: 1.6, gain: 0.5 }); cue(cut_(18) + nm, 'bell', { gain: 0.7 }); cue(cut_(18) + pj, 'sparkle', { gain: 0.6 }); }

  // 19 · today at Khatu: Shyam Baba
  { const kh = W_('खाटू', 19), ss = W_('शीश', 19), sy = W_('श्याम', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 900], zoom: 0.1, note: 'Khatu saffron night: temple shikhara, the garlanded Shyam sheesh glowing in the sanctum arch, diyas, devotees with nishan flags; slip खाटू धाम, ribbon श्याम बाबा', draw(lt, d, t) {
      gradSky(SAFF); stars(t, 80, -200, 700, 63, 0.5); glow(540, 900, 600, '#FFB060', 0.3);
      ranges([{ y: 1200, h: 160, col: '#3A1424', seed: 63, haze: 0.3 }], lt * 15, '#FFB060');
      temple(540, 1470, 0.95);
      cut(() => { ctx.beginPath(); ctx.moveTo(380, 1470); ctx.lineTo(380, 1290); ctx.arc(540, 1290, 160, Math.PI, 0); ctx.lineTo(700, 1470); ctx.closePath(); }, '#2A0E0A', { shadow: 0.3, edge: 2 });
      sheesh(540, 1300, 92, t, { aura: 0.6 + 0.4 * seg(lt, ss - 0.2, ss + 0.4), open: true, garland: true });
      ground('#1A0810', 1500); for (let i = 0; i < 9; i++) diya(70 + i * 118, 1500, 0.5, t, i + 4);
      for (let i = 0; i < 7; i++) { const x = 70 + i * 160; if (x > 340 && x < 740) continue; warrior(x, 1540, 150, '#12060A', '#FFB060', t, i + 60); nishan(x + 40, 1520, 300 + rnd(i) * 80, t, i % 2 ? '#F2702A' : '#F2C14E'); }
      slipAt(lt, kh, 'खाटू धाम', 540, 260, 64); ribbonAt(lt, sy, 'श्याम बाबा', 540, 420, 100);
      petals(t, 20, 63); vignette(0.45);
    } });
    cue(cut_(19), 'bell', { gain: 0.6 }); cue(cut_(19) + ss, 'sparkle', { gain: 0.5 }); cue(cut_(19) + sy, 'conch', { dur: 1.8, gain: 0.5 }); }

  // 20 · loop: Haare ka Sahara
  { const hr = W_('हारे', 20), vh = W_('वही', 20), sh = W_('सहारा', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 920], zoom: 0.14, note: 'hook echo: ember dusk, Shyam sheesh blazing above the ridge, three arrows fanned, armies faint below; ribbon हारे का सहारा', draw(lt, d, t) {
      gradSky(EMBER); stars(t, 80, -200, 700, 65, 0.5); godRays(540, 700, 0, TAU, 32, 1500, '#FFE6A0', 0.16, t);
      ranges([{ y: 1230, h: 240, col: '#3A1420', seed: 65, haze: 0.4 }], lt * 20, '#F08A3A');
      army(-1, t, '#14060C', '#F08A3A', 6, 1500, 1, 0.5); army(1, t, '#14060C', '#F08A3A', 6, 1500, 1, 0.5);
      for (let i = -1; i <= 1; i++) { const a = -Math.PI / 2 + i * 0.5, r = 520; baan(540 + Math.cos(a) * r, 1060 + Math.sin(a) * r * 0.6, 280, a, 0.8); }
      sheesh(540, 820, 140, t, { aura: 0.6 + 0.5 * seg(lt, vh - 0.2, vh + 0.4), open: true, garland: true });
      ground('#12060E', 1530); slipAt(lt, hr, 'हारे का साथ', 300, 340, 54, -0.04);
      ribbonAt(lt, sh, 'हारे का सहारा', 540, 1290, 100); ring(lt, sh, 540, 800, '#FFE6A0', 0.9, 700); flash(lt, sh, '#FFF6D8', 0.4, 0.6);
      embers(t, 50, 65); vignette(0.5);
    } });
    cue(cut_(20) + hr, 'heartbeat', { gain: 0.5 }); cue(cut_(20) + sh, 'drum', { gain: 0.8 }); cue(cut_(20) + sh + 0.05, 'bell', { gain: 0.7 }); }

  // 21-22 · end card
  { const st = cut_(21), f = Wd('फ़ॉलो', 22) - st;
    add({ id: 'S22', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: saffron night, Khatu temple silhouette with diyas, Untold Stories in gold', draw(lt, d, t) {
      gradSky(SAFF); stars(t, 120, -200, 900, 67, 0.6);
      ctx.save(); ctx.globalAlpha = 0.6; temple(540, 1500, 0.6, '#5A2A2A', '#3A1A1A'); ctx.restore();
      for (let i = 0; i < 8; i++) diya(90 + i * 130, 1500, 0.55, t, i + 3);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 560, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 710, 80, '#FFE6C8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 860, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
