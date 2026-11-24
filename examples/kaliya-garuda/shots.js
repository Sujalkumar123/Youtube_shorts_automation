// कालिया नाग यमुना में ही क्यों छिपा था? Kaliya, Garuda and Saubhari's curse — cinematic cut paper.
// Bhagavata Purana 10.16-17.
// Palette: poison-green night (hook) → ember dusk (Garuda barred) → ocean teal (Ramanaka) → full-moon violet (offering) →
// venom green → crimson (theft) → fire orange (the wing) → slate (open loop) → rose dawn Yamuna → kund forest dusk →
// cosmic ? → underwater teal (Saubhari) → noon gold (the fish) → grief blue → curse crimson → seal storm →
// black poison → Krishna blue blaze → bowed indigo → footprint gold → dawn sea → Vrindavan ghat night → end card.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, stars, glow, rgba, godRays, mist, ranges, motes, vignette, cloud, diya, water, birds } from './atmos.js';
import { rishi, krishna, garuda, lightning } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function qmark(lt, w, x, y, size = 220, col = '#FCE7B0') { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, col); ctx.restore(); } }
function ribbonAt(lt, w, text, x, y, size = 110) { if (lt > w - 0.15) K.ribbon(text, x, y, eob(seg(lt, w - 0.15, w + 0.2)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }
function ring(lt, w, x, y, col = '#FFE6A0', len = 0.9, R = 900) { if (lt > w && lt < w + len) { const k = seg(lt, w, w + len); ctx.save(); ctx.strokeStyle = rgba(col, 0.8 * (1 - k)); ctx.lineWidth = 30 * (1 - k) + 4; ctx.beginPath(); ctx.ellipse(x, y, R * eo(k), R * 0.4 * eo(k), 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
function river(t, y, c1, c2, glint = '#FCE7B0', ga = 0.5) { water(t, y, [c1, c2], glint, ga); }
function bubbles(t, n, seed, box = [0, 300, W, 1500], col = '#BFF6E8') { for (let i = 0; i < n; i++) { const k = (t * 0.12 + rnd(i + seed)) % 1; const x = box[0] + rnd(i * 7 + seed) * box[2] + Math.sin(t * 2 + i) * 14, y = box[1] + box[3] * (1 - k); ctx.strokeStyle = rgba(col, 0.6 * (1 - k * 0.6)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 6 + rnd(i + seed * 3) * 12, 0, TAU); ctx.stroke(); } }

// ---------- new kit ----------
const HOOD = () => { ctx.beginPath(); ctx.moveTo(0, 90); ctx.quadraticCurveTo(-150, 20, -120, -90); ctx.quadraticCurveTo(-70, -185, 0, -190); ctx.quadraticCurveTo(70, -185, 120, -90); ctx.quadraticCurveTo(150, 20, 0, 90); ctx.closePath(); };
// a footprint of light (sole + 5 toes); (x, y) = centre, s scale, rot
export function footprint(x, y, s, rot = 0, col = '#FFE08A', a = 1) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha *= a;
  glow(0, 0, 110, col, 0.55);
  cut(() => { ctx.beginPath(); ctx.moveTo(0, -60); ctx.bezierCurveTo(34, -62, 40, -10, 28, 30); ctx.bezierCurveTo(22, 62, -22, 66, -26, 34); ctx.bezierCurveTo(-34, 0, -36, -58, 0, -60); ctx.closePath(); }, col, { shadow: 0.2, edge: 2 });
  for (let i = 0; i < 5; i++) circle(-24 + i * 12, -76 + Math.abs(i - 1) * 4 - (i === 0 ? 6 : 0), i === 0 ? 10 : 7, col);
  ctx.restore();
}
// Kaliya: a giant five-hooded serpent rising from coils. o = { rise 0..1, glow (poison aura), eyes 0..1, bow 0..1 (hoods lowered), feet 0..1 (footprints of light), dir, col }
// returns [x, y] of the top of the centre hood (where Krishna stands)
export function kaliya(x, y, s, t, o = {}) {
  const rise = o.rise ?? 1, bow = o.bow || 0, col = o.col || '#1E3A2A', col2 = o.col2 || '#2E5A3A', dir = o.dir || 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  if (o.glow) { glow(0, -500, 700, '#3AE070', 0.35 * o.glow); glow(0, -500, 320, '#B8FF8A', 0.2 * o.glow); }
  for (let i = 0; i < 3; i++) cut(() => { const cx = (i - 1) * 260 + Math.sin(t * 1.5 + i) * 20, cy = 40 - i * 10; ctx.beginPath(); ctx.ellipse(cx, cy, 230 - i * 20, 70, 0, Math.PI, TAU); ctx.ellipse(cx, cy, 160 - i * 20, 30, 0, TAU, Math.PI, true); ctx.closePath(); }, i % 2 ? col2 : col, { shadow: 0.5, edge: 3 });
  const top = -620 * rise + bow * 260, sw = Math.sin(t * 1.8) * 24;
  ctx.save(); ctx.lineCap = 'round';
  const neck = () => { ctx.beginPath(); ctx.moveTo(0, 20); ctx.bezierCurveTo(120, -150, -120 + sw, top * 0.6, sw, top); };
  neck(); ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 168; ctx.stroke(); neck(); ctx.strokeStyle = col2; ctx.lineWidth = 156; ctx.stroke();
  neck(); ctx.strokeStyle = 'rgba(220,240,160,0.3)'; ctx.lineWidth = 60; ctx.stroke();
  ctx.restore();
  ctx.save(); ctx.translate(sw, top);
  for (const i of [-2, 2, -1, 1, 0]) {
    const a = i * (0.3 - bow * 0.1); ctx.save(); ctx.translate(i * (130 - bow * 30), Math.abs(i) * 50); ctx.rotate(a); ctx.translate(0, -60 - (2 - Math.abs(i)) * 30 + Math.sin(t * 2 + i) * 6); const sc = 1.25 - Math.abs(i) * 0.08; ctx.scale(sc, sc);
    cut(HOOD, i === 0 ? col2 : col, { shadow: 0.55, edge: 4 });
    cut(() => { ctx.beginPath(); ctx.ellipse(0, -30, 54, 76, 0, 0, TAU); }, '#B8B880', { shadow: 0, edge: 0 });
    ctx.strokeStyle = 'rgba(30,30,10,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(-24, -64, 16, 0, TAU); ctx.moveTo(40, -64); ctx.arc(24, -64, 16, 0, TAU); ctx.stroke();
    cut(() => { ctx.beginPath(); ctx.ellipse(0, -178, 48, 40, 0, 0, TAU); }, col, { shadow: 0.3, edge: 3 });
    const e = o.eyes ?? 1; if (e > 0) for (const k of [-1, 1]) { glow(k * 20, -186, 26, '#FF3A2A', 0.6 * e); circle(k * 20, -186, 7, '#FF5A3A'); }
    if (i === 0 && !bow && Math.sin(t * 9) > 0.3) { ctx.strokeStyle = '#E8304A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(0, -218); ctx.lineTo(0, -260); ctx.lineTo(-12, -278); ctx.moveTo(0, -260); ctx.lineTo(12, -278); ctx.stroke(); }
    if (o.feet) footprint(0, -40, 0.75, i * 0.2, '#FFE08A', o.feet);
    ctx.restore();
  }
  ctx.restore(); ctx.restore();
  return [x + sw * s * dir, y + (top - 260) * s];
}
// a small fish; dir 1 = facing right
export function fish(x, y, s, t, col = '#E8A83A', dir = 1, a = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); ctx.globalAlpha *= a; const w = Math.sin(t * 8 + x) * 0.25;
  ctx.save(); ctx.translate(-60, 0); ctx.rotate(w); cut(P_poly([[0, 0], [-50, -34], [-40, 0], [-50, 34]]), col, { shadow: 0.3, edge: 2 }); ctx.restore();
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 70, 32, 0, 0, TAU); }, col, { shadow: 0.4, edge: 2 });
  circle(40, -6, 6, '#1A1410'); ctx.restore();
}
// kadamba tree with round orange flower balls; base (x, y); wither 0..1
export function kadamba(x, y, s, t, leaf = '#1E3A22', leaf2 = '#2E5A2E', flower = '#F2A23A', wither = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-40, 0); ctx.quadraticCurveTo(-30, -300, -10, -520); ctx.lineTo(30, -520); ctx.quadraticCurveTo(30, -300, 50, 0); ctx.closePath(); }, '#3A2416', { shadow: 0.5, edge: 3 });
  ctx.strokeStyle = '#3A2416'; ctx.lineWidth = 22; ctx.beginPath(); ctx.moveTo(0, -380); ctx.lineTo(220, -560); ctx.moveTo(0, -430); ctx.lineTo(-200, -600); ctx.stroke();
  const L1 = wither > 0.5 ? '#4A4A2A' : leaf, L2 = wither > 0.5 ? '#5A5232' : leaf2;
  for (const [cx, cy, r] of [[-200, -650, 170], [220, -620, 180], [0, -760, 220], [-90, -560, 150], [120, -520, 140]]) cut(P_circ(cx + Math.sin(t + cx) * 6, cy, r * (1 - wither * 0.25)), cy < -700 ? L2 : L1, { shadow: 0.5, edge: 3 });
  if (wither < 0.5) for (let i = 0; i < 14; i++) { const fx = -300 + rnd(i + 3) * 600, fy = -880 + rnd(i * 5 + 1) * 420; circle(fx, fy, 18, flower); circle(fx, fy, 9, '#FFE0A0'); }
  ctx.restore();
}
// a dome of faint light over a pool (the curse boundary); k 0..1 strength
export function dome(cx, cy, r, t, k, col = '#B8FFE0') { if (k <= 0) return; ctx.save(); ctx.globalAlpha *= k; ctx.strokeStyle = rgba(col, 0.55); ctx.lineWidth = 6; ctx.setLineDash([22, 18]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.9, 0, Math.PI, TAU); ctx.stroke(); ctx.setLineDash([]); const g = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, 0.18)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.9, 0, Math.PI, TAU); ctx.fill(); ctx.restore(); }
function plate(x, y, s, t, g = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -30, 140, '#FFE6A0', 0.5 * g); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 120, 34, 0, 0, TAU); }, '#E0A93A', { shadow: 0.5, edge: 3 }); for (let i = 0; i < 6; i++) circle(-60 + i * 24, -20 - (i % 2) * 14, 18, i % 2 ? '#F2702A' : '#F6D98A'); diya(70, -26, 0.5, t, 3); ctx.restore(); }
function island(cx, cy, s, col = '#1E3A3A', col2 = '#2E5A4A') { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-500, 0); ctx.quadraticCurveTo(-380, -220, -150, -260); ctx.quadraticCurveTo(0, -380, 160, -270); ctx.quadraticCurveTo(400, -220, 520, 0); ctx.closePath(); }, col, { shadow: 0.6, edge: 3 }); cut(() => { ctx.beginPath(); ctx.moveTo(-300, -180); ctx.quadraticCurveTo(-100, -330, 120, -250); ctx.quadraticCurveTo(250, -200, 300, -150); ctx.closePath(); }, col2, { shadow: 0.3, edge: 2 }); ctx.restore(); }
export function smallNaga(x, y, s, t, col = '#0E2A22', i = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const sw = Math.sin(t * 2 + i) * 10; ctx.strokeStyle = col; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(40, -80, sw, -160); ctx.stroke(); ctx.translate(sw, -180); ctx.scale(0.5, 0.5); cut(HOOD, col, { shadow: 0.2, edge: 1 }); ctx.restore(); }

const POISON = [[0, '#020A08'], [0.5, '#0A2A22'], [0.85, '#1E5A3A'], [1, '#6AE08A']];
const EMBER = [[0, '#120614'], [0.45, '#4A1A2A'], [0.8, '#C8562A'], [1, '#FFC060']];
const OCEAN = [[0, '#03141E'], [0.5, '#0E3A4A'], [0.85, '#2A7A7A'], [1, '#C8E0C0']];
const MOONV = [[0, '#06041A'], [0.5, '#1E1448'], [0.85, '#4A3A8A'], [1, '#B0A0E0']];
const VENOM = [[0, '#04100A'], [0.5, '#123A1E'], [1, '#4AA04A']];
const CRIMSON = [[0, '#100206'], [0.5, '#4A0E18'], [1, '#B83A2A']];
const FIRE = [[0, '#1A0604'], [0.4, '#6A1A0A'], [0.75, '#E2602A'], [1, '#FFD070']];
const SLATE = [[0, '#05070E'], [0.5, '#161C2E'], [1, '#3A465E']];
const ROSE = [[0, '#141A3A'], [0.45, '#4A3A6A'], [0.8, '#C0697A'], [1, '#F6C08A']];
const KUND = [[0, '#06100E'], [0.45, '#1A2E2A'], [0.8, '#6A5A3A'], [1, '#E8A05A']];
const COSMIC = [[0, '#05030F'], [0.45, '#1E0E3A'], [0.8, '#3A2A7A'], [1, '#6A8AD0']];
const UNDER = [[0, '#02121A'], [0.5, '#063A48'], [0.85, '#1A7A80'], [1, '#8AE0D0']];
const NOON = [[0, '#1A3A6A'], [0.5, '#4A8AC0'], [0.85, '#E8D08A'], [1, '#FFF2C8']];
const GRIEF = [[0, '#02060E'], [0.5, '#0E1E34'], [1, '#2A4A6A']];
const STORM = [[0, '#06040C'], [0.5, '#1E1430'], [1, '#5A3A6A']];
const BLACKP = [[0, '#010402'], [0.5, '#0A160E'], [0.85, '#1E3A1A'], [1, '#5A7A2A']];
const BLAZE = [[0, '#0A1430'], [0.45, '#2A4A8A'], [0.8, '#8AB0E8'], [1, '#FFF2C8']];
const INDIGO = [[0, '#04040E'], [0.5, '#141A3E'], [1, '#3A4A8A']];
const FGOLD = [[0, '#2A1206'], [0.5, '#8A4A12'], [1, '#F6C860']];
const DAWNSEA = [[0, '#1A1A3A'], [0.4, '#5A4A6A'], [0.75, '#E8906A'], [1, '#FFE0A0']];
const GHAT = [[0, '#06040E'], [0.5, '#1E1238'], [0.85, '#5A2A3A'], [1, '#D2702A']];

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK: Kaliya rising from the poisoned pool (thumbnail)
  { const kl = W_('कालिया', 0), ky = W_('क्यों', 0);
    add({ id: 'S01', at: 0, cam: [540, 900], zoom: 0.12, note: 'HOOK: poison-green night, giant five-hooded Kaliya rises from swirling dark water, red eyes; ribbon कालिया; ? on क्यों', draw(lt, d, t) {
      gradSky(POISON); stars(t, 90, -200, 700, 3, 0.5); glow(540, 1300, 600, '#3AE070', 0.3);
      ranges([{ y: 1200, h: 220, col: '#0A2018', seed: 4, haze: 0.4 }], lt * 20, '#6AE08A');
      kadamba(110, 1330, 0.6, t, '#06140E', '#0A2018'); kadamba(980, 1300, 0.55, t, '#06140E', '#0A2018');
      river(t, 1280, '#0E3A2A', '#041A12', '#B8FF8A', 0.5);
      kaliya(540, 1400, 0.95, t, { rise: 0.4 + 0.6 * eob(seg(lt, 0, 0.6)), glow: 1, eyes: 1 });
      mist(1350, 240, '#3A8A5A', 0.4, t);
      ribbonAt(lt, kl, 'कालिया', 540, 300, 120); qmark(lt, ky, 900, 520, 200, '#D8FFC0');
      motes(t, 40, [0, 300, W, 1300], '#B8FF8A', 0.7, 40, 5, 4); vignette(0.5);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'swell', { dur: 2.2, gain: 0.5 }); cue(kl, 'slam', { gain: 0.6 }); cue(ky, 'bell', { gain: 0.5 }); }

  // 1 · where even Garuda could not come
  { const gr = W_('गरुड़', 1), nh = W_('नहीं', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 860], zoom: 0.12, note: 'ember dusk: Garuda dives toward a forest pool, stops dead at a dashed dome of light; red X + flash on नहीं', draw(lt, d, t) {
      gradSky(EMBER); glow(540, 1150, 420, '#FFC060', 0.5);
      ranges([{ y: 1150, h: 240, col: '#4A1A2A', seed: 11, haze: 0.3 }, { y: 1300, h: 180, col: '#2A0A1A', seed: 12 }], lt * 26, '#FFC060');
      kadamba(140, 1460, 0.7, t, '#1A0A12', '#2A0E1A'); kadamba(940, 1460, 0.75, t, '#1A0A12', '#2A0E1A');
      ground('#1A0610', 1450); cut(() => { ctx.beginPath(); ctx.ellipse(540, 1470, 360, 70, 0, 0, TAU); }, '#0E2A2A', { shadow: 0.3, edge: 2 });
      dome(540, 1470, 420, t, 0.4 + 0.6 * seg(lt, nh - 0.2, nh + 0.2), '#FFB0A0');
      const dv = eo(seg(lt, 0, nh)), gy = lerp(200, 640, dv) + (lt > nh ? -60 * eo(seg(lt, nh, nh + 0.5)) : 0);
      garuda(540, gy + 300, { s: 0.42, t, aura: 0.8 });
      if (lt > nh) { ctx.save(); ctx.globalAlpha = 1 - seg(lt, nh + 0.4, nh + 1.2); ctx.strokeStyle = '#FF4A3A'; ctx.lineWidth = 24; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(420, 1080); ctx.lineTo(660, 1320); ctx.moveTo(660, 1080); ctx.lineTo(420, 1320); ctx.stroke(); ctx.restore(); }
      slipAt(lt, gr, 'गरुड़ जी भी?', 820, 300, 56, 0.04); flash(lt, nh, '#FF8A6A', 0.35, 0.5);
      birds(t, 140, 480, 4, '#2A0A1A', 1); motes(t, 30, [0, 300, W, 1300], '#FFD090', 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(cut_(1) + gr, 'whoosh', { gain: 0.6 }); cue(cut_(1) + nh, 'slam', { gain: 0.8 }); }

  // 2 · Ramanaka island in the ocean, home of the nagas
  { const rm = W_('रमणक', 2), ng = W_('नागों', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 1000], zoom: 0.1, note: 'ocean teal: Ramanaka island in the sea, waves, many small naga silhouettes rise on the shore on नागों; ribbon रमणक द्वीप', draw(lt, d, t) {
      gradSky(OCEAN); cloud(220 - lt * 10, 400, 1.1, '#5A9A9A', '#C8E0C0', '#2A6A6A', 0.6); cloud(900 - lt * 14, 300, 0.9, '#5A9A9A', '#C8E0C0', '#2A6A6A', 0.6);
      glow(540, 1050, 500, '#C8E0C0', 0.3); island(540, 1240, 1.0);
      for (let i = 0; i < 9; i++) { const r = seg(lt, ng - 0.3 + i * 0.06, ng + 0.3 + i * 0.06); if (r > 0) smallNaga(200 + i * 85, 1150 - (4 - Math.abs(i - 4)) * 22, 0.55 * eob(r), t, '#06201A', i); }
      river(t, 1240, '#1E5A6A', '#0A2A3A', '#E8FFF0', 0.5);
      ribbonAt(lt, rm, 'रमणक द्वीप', 540, 330, 100); birds(t, 160, 600, 5, '#0A2A3A', 1.1);
      motes(t, 30, [0, 300, W, 1300], '#E8FFF0', 0.6, 30, 21, 3); vignette(0.45);
    } });
    cue(cut_(2), 'whoosh', { gain: 0.4 }); cue(cut_(2) + rm, 'bell', { gain: 0.5 }); cue(cut_(2) + ng, 'sparkle', { gain: 0.5 }); }

  // 3 · every month the nagas offered Garuda a gift
  { const mh = W_('महीने', 3), bh = W_('भेंट', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 960], zoom: 0.12, note: 'full-moon violet: nagas around a rock altar with a golden plate of offerings; Garuda glows in front of the moon; slip हर महीने', draw(lt, d, t) {
      gradSky(MOONV); stars(t, 130, -200, 900, 31, 0.7);
      glow(540, 420, 260, '#E8E0FF', 0.5); circle(540, 420, 120, '#F0ECFF');
      garuda(540, 760, { s: 0.33, t, aura: 0.6 });
      ranges([{ y: 1250, h: 200, col: '#2A2050', seed: 32, haze: 0.3 }], lt * 22, '#B0A0E0'); ground('#120E2A', 1440);
      cut(P_poly([[380, 1460], [400, 1320], [680, 1310], [700, 1460]]), '#3A3060', { shadow: 0.5, edge: 3 });
      plate(540, 1310, 1.0, t, 0.5 + 0.5 * seg(lt, bh, bh + 0.4));
      for (let i = 0; i < 6; i++) { const x = i < 3 ? 120 + i * 90 : 780 + (i - 3) * 90; smallNaga(x, 1500, 0.8, t, '#0A0A20', i); }
      slipAt(lt, mh, 'हर महीने', 260, 560, 56, -0.04); ribbonAt(lt, bh, 'भेंट', 820, 1040, 90);
      motes(t, 30, [0, 300, W, 1300], '#E8E0FF', 0.6, 30, 33, 3); vignette(0.5);
    } });
    cue(cut_(3) + mh, 'bell', { gain: 0.4 }); cue(cut_(3) + bh, 'sparkle', { gain: 0.6 }); }

  // 4 · but Kaliya was proud of his poison
  { const zh = W_('ज़हर', 4), gm = W_('घमंड', 4);
    add({ id: 'S05', at: cut_(4), cam: [560, 760], zoom: 0.16, note: 'venom green close-up: Kaliya hoods fill the frame, venom drips glowing, tongue flicks; ribbon घमंड', draw(lt, d, t) {
      gradSky(VENOM); godRays(540, 300, 0, TAU, 24, 1400, '#B8FF8A', 0.08, t);
      ranges([{ y: 1300, h: 200, col: '#0A2A14', seed: 41 }], lt * 30, '#4AA04A'); river(t, 1460, '#123A1E', '#04100A', '#B8FF8A', 0.4);
      kaliya(540, 1640, 1.25, t, { glow: 0.6 + 0.6 * seg(lt, zh, zh + 0.5), eyes: 1 });
      for (let i = 0; i < 6; i++) { const k = (t * 0.7 + i / 6) % 1; ctx.save(); ctx.globalAlpha = 1 - k; cut(() => { ctx.beginPath(); ctx.ellipse(380 + i * 60, 700 + k * 600, 10, 18, 0, 0, TAU); }, '#8AFF6A', { shadow: 0, edge: 0 }); ctx.restore(); }
      slipAt(lt, zh, 'ज़हर', 220, 420, 64, -0.05); ribbonAt(lt, gm, 'घमंड', 540, 300, 120);
      motes(t, 40, [0, 300, W, 1300], '#B8FF8A', 0.7, 40, 43, 4); vignette(0.55);
    } });
    cue(cut_(4) + zh, 'sizzle', { gain: 0.5 }); cue(cut_(4) + gm, 'drum', { gain: 0.7 }); }

  // 5 · he ate Garuda's offering himself
  { const bg = W_('भोग', 5), kh = W_('ख़ुद', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 960], zoom: 0.14, note: 'crimson: Kaliya lunges, the golden plate vanishes; slam + ribbon ख़ुद खा लिया', draw(lt, d, t) {
      gradSky(CRIMSON); glow(540, 900, 500, '#E8905A', 0.25);
      ranges([{ y: 1280, h: 200, col: '#3A0A14', seed: 51, haze: 0.3 }], lt * 24, '#B83A2A'); ground('#1A0408', 1460);
      const lung = eo(seg(lt, kh - 0.3, kh + 0.1));
      if (lung < 0.95) plate(780, 1420, 1.1, t, 1 - lung);
      kaliya(360 + 140 * lung, 1520, 0.85, t, { glow: 0.5, eyes: 1, col: '#1A2A1A', col2: '#2A3A22' });
      slipAt(lt, bg, 'गरुड़ का भोग', 780, 560, 56, 0.04); ribbonAt(lt, kh, 'ख़ुद खा लिया!', 540, 300, 90); flash(lt, kh, '#FFB0A0', 0.4, 0.5);
      motes(t, 30, [0, 300, W, 1300], '#FFB060', 0.6, 30, 53, 3); vignette(0.55);
    } });
    cue(cut_(5) + bg, 'heartbeat', { gain: 0.5 }); cue(cut_(5) + kh, 'slam', { gain: 0.8 }); cue(cut_(5) + kh + 0.1, 'gulp', { gain: 0.5 }); }

  // 6 · Garuda came... one blow of his wing, Kaliya fell (WOW)
  { const ga = W_('आए', 6), pk = W_('पंख', 6), ch = W_('चोट', 6), gp = W_('गिर', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 900], zoom: 0.16, note: 'WOW fire orange: huge Garuda blazes in, shockwave ring on चोट; Kaliya topples into the sea on गिर', draw(lt, d, t) {
      gradSky(FIRE); godRays(540, 500, 0, TAU, 30, 1500, '#FFE0A0', 0.14, t); glow(540, 600, 500, '#FFD070', 0.5);
      ranges([{ y: 1300, h: 200, col: '#4A0E08', seed: 61 }], lt * 30, '#FFD070'); river(t, 1420, '#6A1A0A', '#2A0604', '#FFD070', 0.5);
      const fall = eio(seg(lt, gp - 0.3, gp + 0.6));
      ctx.save(); ctx.translate(840, 1520); ctx.rotate(fall * 0.7); kaliya(0, 0, 0.6, t, { glow: 0.3, eyes: 1 - fall * 0.5 }); ctx.restore();
      const gin = eob(seg(lt, 0, ga + 0.4)); garuda(lerp(-200, 340, gin), 1150, { s: 0.8, t, aura: 1, wing: 1 });
      ring(lt, ch, 640, 900, '#FFF2C8', 1, 900); flash(lt, ch, '#FFFBEA', 0.6, 0.6);
      slipAt(lt, pk, 'एक पंख', 820, 300, 60, 0.04);
      motes(t, 50, [0, 200, W, 1400], '#FFD070', 0.9, 60, 63, 5); vignette(0.45);
    } });
    cue(cut_(6) + ga, 'whoosh', { gain: 0.7 }); cue(cut_(6) + ch, 'drum', { gain: 0.9 }); cue(cut_(6) + ch + 0.03, 'slam', { gain: 0.6 }); cue(cut_(6) + gp, 'thud', { gain: 0.6 }); }

  // 7 · but the real mystery was still to come
  { const rh = W_('रहस्य', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 960], zoom: 0.18, note: 'slate night: a dark serpent trail slithers away through a river under the moon; big ? on रहस्य', draw(lt, d, t) {
      gradSky(SLATE); stars(t, 120, -200, 900, 71, 0.6); glow(800, 380, 160, '#DCE8FF', 0.4); circle(800, 380, 70, '#E8F0FF');
      ranges([{ y: 1200, h: 220, col: '#161C2E', seed: 72, haze: 0.3 }, { y: 1340, h: 160, col: '#0A0E1A', seed: 73 }], lt * 28, '#3A465E');
      river(t, 1360, '#1E2A44', '#0A0E1A', '#DCE8FF', 0.5);
      const k = seg(lt, 0, d); ctx.save(); ctx.strokeStyle = '#0E2A1E'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const x = 1100 - (i / 30) * 700 * (0.4 + k), y = 1480 + Math.sin(i * 0.7 + t * 4) * 30; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.restore();
      mist(1400, 220, '#4A5A7A', 0.4, t); qmark(lt, rh, 540, 700, 260);
      motes(t, 24, [0, 300, W, 1200], '#DCE8FF', 0.5, 20, 74, 3); vignette(0.6);
    } });
    cue(cut_(7), 'whoosh', { gain: 0.4 }); cue(cut_(7) + rh, 'drum', { gain: 0.8 }); }

  // 8 · he fled to the Yamuna of Vrindavan
  { const vr = W_('वृंदावन', 8), ym = W_('यमुना', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 1000], zoom: 0.1, note: 'rose dawn: the Yamuna through Vrindavan between kadamba trees; a dark wave swims upriver; ribbon वृंदावन', draw(lt, d, t) {
      gradSky(ROSE); glow(540, 1050, 420, '#F6C08A', 0.5); circle(540, 1080, 110, '#FFE0B0');
      ranges([{ y: 1100, h: 220, col: '#4A3A6A', seed: 81, haze: 0.4 }, { y: 1250, h: 160, col: '#2A2040', seed: 82 }], lt * 22, '#F6C08A');
      ground('#1E1A2E', 1300);
      cut(P_poly([[440, 1300], [640, 1300], [900, 1920], [100, 1920]]), '#4A6A9A', { shadow: 0.3, edge: 2 }); glow(540, 1500, 260, '#F6C08A', 0.2);
      const k = seg(lt, 0, d); ctx.save(); ctx.strokeStyle = '#0E1A14'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= 12; i++) { const yy = 1560 - k * 200 - i * 14, xx = 540 + Math.sin(i + t * 6) * 18; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore();
      kadamba(120, 1420, 0.75, t, '#1A2A22', '#2A4A2E'); kadamba(960, 1420, 0.8, t, '#1A2A22', '#2A4A2E');
      birds(t, 300, 500, 5, '#2A2040', 1); ribbonAt(lt, vr, 'वृंदावन', 540, 300, 110); slipAt(lt, ym, 'यमुना', 760, 640, 56, 0.04);
      motes(t, 30, [0, 300, W, 1300], '#FFE0C0', 0.6, 30, 83, 3); vignette(0.45);
    } });
    cue(cut_(8), 'whoosh', { gain: 0.5 }); cue(cut_(8) + vr, 'bell', { gain: 0.5 }); }

  // 9 · one single pool where Garuda never comes
  { const kd = W_('कुंड', 9), gr = W_('गरुड़', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 1100], zoom: 0.12, note: 'kund dusk: a deep round pool among kadambas under a faint dome; tiny Garuda far off turns away on गरुड़; slip एक ही कुंड', draw(lt, d, t) {
      gradSky(KUND); glow(540, 1000, 420, '#E8A05A', 0.4);
      ranges([{ y: 1100, h: 220, col: '#1A2E2A', seed: 91, haze: 0.3 }], lt * 22, '#E8A05A'); ground('#0A1410', 1300);
      kadamba(140, 1380, 0.8, t, '#0E1E1A', '#1A2E26'); kadamba(940, 1380, 0.85, t, '#0E1E1A', '#1A2E26');
      cut(() => { ctx.beginPath(); ctx.ellipse(540, 1380, 380, 110, 0, 0, TAU); }, '#2A1E14', { shadow: 0.5, edge: 3 });
      cut(() => { ctx.beginPath(); ctx.ellipse(540, 1390, 340, 90, 0, 0, TAU); }, '#0E2A2A', { shadow: 0.3, edge: 2 }); glow(540, 1390, 200, '#6AE0C0', 0.25 + 0.1 * Math.sin(t * 3));
      dome(540, 1390, 420, t, 0.5 + 0.5 * seg(lt, kd, kd + 0.5));
      if (lt > gr - 0.2) { const k = eo(seg(lt, gr - 0.2, gr + 0.8)); ctx.save(); ctx.translate(lerp(820, 1000, k), lerp(600, 480, k)); ctx.scale(-1, 1); garuda(0, 0, { s: 0.16, t, aura: 0.5 }); ctx.restore(); }
      slipAt(lt, kd, 'एक ही कुंड', 540, 360, 64);
      motes(t, 30, [0, 300, W, 1300], '#FFE0A0', 0.6, 30, 92, 3); vignette(0.5);
    } });
    cue(cut_(9) + kd, 'bubbles', { gain: 0.4 }); cue(cut_(9) + gr, 'whoosh', { gain: 0.4 }); }

  // 10 · why?
  add({ id: 'S11', at: cut_(10), cam: [540, 900], zoom: 0.2, note: 'cosmic violet: a giant ? over the pool reflected in water, stars swirl', draw(lt, d, t) {
    gradSky(COSMIC); stars(t, 180, -200, 1300, 101, 0.8); godRays(540, 760, 0, TAU, 24, 1300, '#B0C0FF', 0.1, t);
    river(t, 1350, '#1E1448', '#06041A', '#B0C0FF', 0.5); qmark(lt, 0.05, 540, 820, 380, '#E8E0FF');
    ctx.save(); ctx.globalAlpha = 0.3; ctx.translate(540, 1450); ctx.scale(1, -0.4); bigText('?', 0, 0, 380, '#E8E0FF'); ctx.restore();
    motes(t, 40, [0, 200, W, 1300], '#E8E0FF', 0.6, 40, 102, 4); vignette(0.5);
  } });
  cue(cut_(10), 'drum', { gain: 0.8 }); cue(cut_(10) + 0.05, 'bell', { gain: 0.5 });

  // 11 · sage Saubhari did tapas under the water there
  { const sb = W_('सौभरि', 11), tp = W_('तप', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 980], zoom: 0.12, note: 'underwater teal: sage Saubhari in namaste on the riverbed, bubbles rise, fish circle, light shafts; ribbon सौभरि ऋषि', draw(lt, d, t) {
      gradSky(UNDER); godRays(540, -100, Math.PI * 0.3, Math.PI * 0.7, 14, 1900, '#BFF6E8', 0.12, t);
      for (let i = 0; i < 6; i++) { const x = ((i * 220 + lt * 20) % 1400) - 150; ctx.strokeStyle = '#0A4A3A'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x, 1920); ctx.quadraticCurveTo(x + Math.sin(t + i) * 40, 1500, x + 20, 1200 + (i % 3) * 80); ctx.stroke(); }
      cut(P_rr(-300, 1520, W + 600, 500, 0), '#06241E', { shadow: 0, edge: 0 });
      rishi(540, 1540, { s: 0.95, t, pose: 'namaste', aura: 0.6 + 0.4 * seg(lt, tp, tp + 0.5) });
      for (let i = 0; i < 6; i++) { const a = t * 0.6 + i / 6 * TAU; fish(540 + Math.cos(a) * 400, 820 + Math.sin(a) * 160, 0.6, t, i % 2 ? '#E8A83A' : '#F2C86A', Math.sin(a) > 0 ? -1 : 1); }
      bubbles(t, 24, 111, [300, 300, 480, 1000]);
      ribbonAt(lt, sb, 'सौभरि ऋषि', 540, 300, 100); slipAt(lt, tp, 'जल में तप', 820, 520, 52, 0.04);
      motes(t, 30, [0, 200, W, 1300], '#BFF6E8', 0.5, 20, 112, 3); vignette(0.5);
    } });
    cue(cut_(11), 'bubbles', { gain: 0.5 }); cue(cut_(11) + sb, 'bell', { gain: 0.5 }); }

  // 12 · one day hungry Garuda caught a fish there
  { const bk = W_('भूखे', 12), mc = W_('मछली', 12), pk = W_('पकड़', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 900], zoom: 0.14, note: 'noon gold: Garuda swoops low over the river and rises with a golden fish; splash on पकड़', draw(lt, d, t) {
      gradSky(NOON); godRays(540, 200, 0, TAU, 26, 1400, '#FFF2C8', 0.1, t); cloud(200 - lt * 12, 380, 1.0, '#E8E0D0', '#FFFFFF', '#B0C0D0', 0.7);
      ranges([{ y: 1200, h: 200, col: '#4A7AA0', seed: 121, haze: 0.4 }, { y: 1330, h: 140, col: '#2A5A6A', seed: 122 }], lt * 26, '#FFF2C8');
      river(t, 1330, '#2A6A9A', '#0E3A5A', '#FFFFFF', 0.6); kadamba(1000, 1360, 0.6, t);
      const sw = eio(seg(lt, 0, d)), gx = lerp(150, 700, sw), gy = 1250 - 500 * Math.max(0, sw - 0.4) / 0.6;
      garuda(gx, gy, { s: 0.45, t, aura: 0.7 });
      if (lt > pk - 0.1) fish(gx, gy - 140, 0.6, t, '#F2C86A', 1);
      else if (lt > mc - 0.3) fish(620, 1330 - 40 * Math.abs(Math.sin(t * 5)), 0.6, t, '#F2C86A', -1);
      if (lt > pk - 0.1 && lt < pk + 0.8) { const k = seg(lt, pk - 0.1, pk + 0.8); for (let i = 0; i < 12; i++) circle(gx + Math.cos(i) * 160 * k, 1330 - Math.abs(Math.sin(i * 2)) * 220 * k + 300 * k * k, 10 * (1 - k), '#E8FFFF'); }
      slipAt(lt, bk, 'भूखे गरुड़', 300, 400, 56, -0.04);
      motes(t, 30, [0, 200, W, 1300], '#FFF2C8', 0.5, 30, 123, 3); vignette(0.4);
    } });
    cue(cut_(12), 'whoosh', { gain: 0.6 }); cue(cut_(12) + pk, 'plop', { gain: 0.7 }); }

  // 13 · the other fish writhed in grief
  { const mc = W_('मछलियाँ', 13), dk = W_('दुख', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 940], zoom: 0.14, note: 'grief blue underwater: a ring of grey fish huddles around an empty glowing gap; the sage dim below; ribbon दुख', draw(lt, d, t) {
      gradSky(GRIEF); godRays(540, -100, Math.PI * 0.35, Math.PI * 0.65, 10, 1900, '#8AB0E0', 0.08, t);
      cut(P_rr(-300, 1500, W + 600, 500, 0), '#040A14', { shadow: 0, edge: 0 });
      ctx.save(); ctx.globalAlpha = 0.55; rishi(540, 1540, { s: 0.8, t, pose: 'namaste', aura: 0.2 }); ctx.restore();
      glow(540, 760, 120, '#DCE8FF', 0.25);
      for (let i = 0; i < 9; i++) { const a = i / 9 * TAU + t * 0.25, r = 300 - 40 * seg(lt, dk, dk + 1); fish(540 + Math.cos(a) * r, 760 + Math.sin(a) * r * 0.6 + Math.sin(t * 3 + i) * 10, 0.55, t * 0.5, '#9AA8C0', Math.cos(a) > 0 ? -1 : 1); }
      bubbles(t, 12, 131, [200, 400, 680, 900], '#8AB0E0');
      slipAt(lt, mc, 'बाक़ी मछलियाँ', 540, 280, 56); ribbonAt(lt, dk, 'दुख', 540, 1150, 100);
      vignette(0.6);
    } });
    cue(cut_(13) + dk, 'heartbeat', { gain: 0.6 }); }

  // 14 · the sage cursed
  { const sr = W_('श्राप', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 900], zoom: 0.16, note: 'curse crimson: Saubhari rises from the water, hand raised in the curse pose, lightning behind; ribbon श्राप', draw(lt, d, t) {
      gradSky(CRIMSON); stars(t, 60, -200, 700, 141, 0.4);
      if (lt > sr - 0.1) { lightning(220, 0, 1100, t, 1 - seg(lt, sr, sr + 0.6), 3); lightning(880, 0, 1000, t, 1 - seg(lt, sr + 0.15, sr + 0.8), 7); }
      ranges([{ y: 1300, h: 180, col: '#3A0A14', seed: 142 }], lt * 20, '#B83A2A');
      const up = eo(seg(lt, 0, sr)); rishi(540, 1680 - 160 * up, { s: 1.0, t, pose: 'curse', aura: 0.8 });
      river(t, 1460, '#5A1A22', '#1A0408', '#FFB0A0', 0.5);
      ribbonAt(lt, sr, 'श्राप', 540, 300, 130); flash(lt, sr, '#FFE0D0', 0.5, 0.5);
      motes(t, 30, [0, 300, W, 1300], '#FFB060', 0.6, 40, 143, 4); vignette(0.5);
    } });
    cue(cut_(14) + sr, 'drum', { gain: 0.9 }); cue(cut_(14) + sr + 0.05, 'conch', { dur: 1.5, gain: 0.4 }); }

  // 15 · if Garuda comes here again, he dies that very moment (WOW)
  { const gr = W_('गरुड़', 15), mr = W_('मरेंगे', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 900], zoom: 0.14, note: 'WOW storm: a glowing seal-circle locks over the pool, star lines turn; Garuda silhouette recoils at the edge; flash on मरेंगे', draw(lt, d, t) {
      gradSky(STORM); stars(t, 80, -200, 800, 151, 0.5); lightning(180, 0, 900, t, 0.5 * (Math.sin(t * 3) > 0.7 ? 1 : 0), 11);
      ranges([{ y: 1250, h: 200, col: '#1E1430', seed: 152, haze: 0.3 }], lt * 24, '#5A3A6A'); ground('#0A0612', 1440);
      cut(() => { ctx.beginPath(); ctx.ellipse(540, 1460, 380, 90, 0, 0, TAU); }, '#0E2A2A', { shadow: 0.3, edge: 2 });
      const k = 0.3 + 0.7 * eo(seg(lt, 0, mr)); ctx.save(); ctx.translate(540, 1000); ctx.rotate(t * 0.4); ctx.globalAlpha = 0.4 + 0.6 * k; ctx.strokeStyle = '#FFB0E0'; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(0, 0, 340 * k, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 280 * k, 0, TAU); ctx.stroke();
      for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 280 * k, Math.sin(a) * 280 * k); ctx.lineTo(Math.cos(a + TAU / 3) * 280 * k, Math.sin(a + TAU / 3) * 280 * k); ctx.stroke(); }
      ctx.restore(); glow(540, 1000, 340, '#FF8AD0', 0.3 * k);
      const rec = eo(seg(lt, mr - 0.2, mr + 0.5)); ctx.save(); ctx.globalAlpha = 0.85; ctx.translate(880 + 120 * rec, 600 - 80 * rec); ctx.rotate(0.3 * rec); garuda(0, 0, { s: 0.3, t, aura: 0.3 }); ctx.restore();
      slipAt(lt, gr, 'फिर आए तो...', 300, 300, 56, -0.04); ring(lt, mr, 540, 1000, '#FFB0E0', 0.9, 800); flash(lt, mr, '#FFE0F0', 0.6, 0.6);
      motes(t, 40, [0, 200, W, 1300], '#FFB0E0', 0.7, 40, 153, 4); vignette(0.5);
    } });
    cue(cut_(15) + gr, 'swell', { dur: 1.5, gain: 0.5 }); cue(cut_(15) + mr, 'drum', { gain: 0.9 }); cue(cut_(15) + mr + 0.03, 'bell', { gain: 0.6 }); }

  // 16 · his poison turned the Yamuna black
  { const zh = W_('ज़हर', 16), kl = W_('काली', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 1100], zoom: 0.12, note: 'black poison: the river darkens from blue to black-green, poison bubbles boil, kadamba leaves wilt; ribbon यमुना काली', draw(lt, d, t) {
      gradSky(BLACKP); glow(540, 1200, 400, '#5A7A2A', 0.3);
      ranges([{ y: 1150, h: 200, col: '#0A160E', seed: 161, haze: 0.3 }], lt * 20, '#5A7A2A');
      const k = eo(seg(lt, 0, kl + 0.4));
      kadamba(150, 1360, 0.8, t, '#0E1E14', '#1A2E1A', '#F2A23A', k); kadamba(940, 1360, 0.8, t, '#0E1E14', '#1A2E1A', '#F2A23A', k);
      river(t, 1300, k > 0.5 ? '#0E1A0E' : '#2A5A8A', k > 0.5 ? '#020604' : '#0E2A4A', '#8AFF6A', 0.4);
      for (let i = 0; i < 18; i++) { const bx = 80 + rnd(i + 3) * 920, ph = (t * 1.3 + rnd(i * 5)) % 1; circle(bx, 1340 + rnd(i * 7) * 180 - ph * 40, 14 * (1 - ph) * k + 0.01, '#4AA04A'); }
      mist(1300, 300, '#3A6A2A', 0.5 * k, t);
      slipAt(lt, zh, 'ज़हर', 260, 420, 60, -0.04); ribbonAt(lt, kl, 'यमुना काली', 540, 300, 100);
      motes(t, 30, [0, 300, W, 1300], '#8AFF6A', 0.5, 30, 162, 3); vignette(0.6);
    } });
    cue(cut_(16) + zh, 'sizzle', { gain: 0.6 }); cue(cut_(16) + kl, 'heartbeat', { gain: 0.6 }); }

  // 17 · then Krishna leapt, and danced on the hoods (WOW)
  { const kr = W_('कृष्ण', 17), kd = W_('कूदे', 17), nc = W_('नाचने', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 860], zoom: 0.16, note: 'WOW Krishna blue blaze: Krishna leaps from the kadamba onto Kaliya\'s hoods and dances (bobbing, flute), rings of light on each step; ribbon नाचने लगे', draw(lt, d, t) {
      gradSky(BLAZE); godRays(540, 500, 0, TAU, 30, 1500, '#FFF2C8', 0.14, t);
      ranges([{ y: 1250, h: 200, col: '#1A2A5A', seed: 171, haze: 0.3 }], lt * 26, '#8AB0E8');
      kadamba(140, 1300, 0.85, t, '#0E1A3A', '#1A2A5A');
      river(t, 1360, '#1A3A6A', '#06102A', '#FFF2C8', 0.6);
      const hd = kaliya(620, 1560, 0.8, t, { glow: 0.2, eyes: 1, bow: 0.3 * seg(lt, nc, d) });
      const lp = eio(seg(lt, kd - 0.2, kd + 0.5)), land = lt > kd + 0.5;
      const bob = land ? Math.abs(Math.sin((lt - kd) * 6)) * 40 : 0;
      const kx = lerp(220, hd[0], lp), ky = lerp(820, hd[1], lp) - Math.sin(lp * Math.PI) * 300 - bob;
      glow(kx, ky - 200, 280, '#BFD8FF', 0.6);
      krishna(kx, ky, { s: 0.42, t, pose: 'flute', aura: 1 });
      if (land) { const ph = ((lt - kd) * 6 / Math.PI) % 1; ctx.save(); ctx.strokeStyle = rgba('#FFF2C8', 0.7 * (1 - ph)); ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(hd[0], hd[1], 80 + 200 * ph, 24 + 60 * ph, 0, 0, TAU); ctx.stroke(); ctx.restore(); }
      slipAt(lt, kr, 'कृष्ण', 860, 330, 70, 0.04); ribbonAt(lt, nc, 'नाचने लगे!', 540, 300, 96); flash(lt, kd + 0.5, '#FFFBEA', 0.4, 0.5);
      motes(t, 50, [0, 200, W, 1400], '#FFF2C8', 0.8, 50, 172, 4); vignette(0.4);
    } });
    cue(cut_(17) + kd, 'whoosh', { gain: 0.7 }); cue(cut_(17) + kd + 0.5, 'drum', { gain: 0.9 }); cue(cut_(17) + nc, 'damru', { gain: 0.6 }); cue(cut_(17) + nc + 0.6, 'bell', { gain: 0.5 }); }

  // 18 · Kaliya was defeated... but Krishna did not kill him
  { const hr = W_('हार', 18), mr = W_('मारा', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 960], zoom: 0.12, note: 'bowed indigo: Kaliya\'s hoods lowered, eyes dim; Krishna stands calm on them, soft blue light rains; ribbon मारा नहीं', draw(lt, d, t) {
      gradSky(INDIGO); stars(t, 120, -200, 900, 181, 0.6); glow(540, 700, 400, '#9FC4FF', 0.3);
      ranges([{ y: 1250, h: 200, col: '#141A3E', seed: 182, haze: 0.3 }], lt * 20, '#3A4A8A'); river(t, 1380, '#1A2A5A', '#04040E', '#DCE8FF', 0.5);
      const hd = kaliya(540, 1560, 0.8, t, { glow: 0, eyes: 0.2, bow: eo(seg(lt, 0, hr + 0.6)) });
      krishna(hd[0], hd[1], { s: 0.45, t, pose: 'flute', aura: 0.8 + 0.4 * seg(lt, mr, mr + 0.5) });
      slipAt(lt, hr, 'हार गया', 240, 380, 56, -0.04); ribbonAt(lt, mr, 'मारा नहीं', 600, 300, 100);
      if (lt > mr) for (let i = 0; i < 16; i++) { const k = (t * 0.2 + rnd(i + 9)) % 1; circle(rnd(i * 3) * W, 300 + k * 1100, 6, rgba('#BFD8FF', 0.6 * (1 - k))); }
      vignette(0.5);
    } });
    cue(cut_(18) + hr, 'thud', { gain: 0.5 }); cue(cut_(18) + mr, 'bell', { gain: 0.6 }); }

  // 19 · "my footprints are now on your hood" (the twist)
  { const cr = W_('चरणों', 19), ns = W_('निशान', 19), ph = W_('फन', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 760], zoom: 0.18, note: 'footprint gold close-up: Kaliya\'s hoods fill the frame; golden footprints of light stamp onto each hood on निशान, ring + flash; ribbon चरणों के निशान', draw(lt, d, t) {
      gradSky(FGOLD); godRays(540, 600, 0, TAU, 30, 1500, '#FFE6A0', 0.16, t);
      const f = eo(seg(lt, ns - 0.2, ph + 0.3));
      kaliya(540, 1880, 1.3, t, { glow: 0, eyes: 0.4, feet: f, bow: 0.15 });
      ring(lt, ns, 540, 900, '#FFF2C8', 1, 700); flash(lt, ns, '#FFF6D8', 0.45, 0.6);
      ribbonAt(lt, cr, 'चरणों के निशान', 540, 300, 90);
      motes(t, 50, [0, 200, W, 1300], '#FFE6A0', 0.8, 50, 191, 4); vignette(0.45);
    } });
    cue(cut_(19) + cr, 'swell', { dur: 1.5, gain: 0.5 }); cue(cut_(19) + ns, 'drum', { gain: 0.8 }); cue(cut_(19) + ns + 0.05, 'bell', { gain: 0.7 }); cue(cut_(19) + ns + 0.1, 'sparkle', { gain: 0.6 }); }

  // 20 · Garuda will never touch you now
  { const gr = W_('गरुड़', 20), ch = W_('छुएँगे', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 960], zoom: 0.1, note: 'dawn sea: Kaliya swims away toward the island with glowing hood marks; Garuda glides above and passes by; ribbon कभी नहीं छुएँगे', draw(lt, d, t) {
      gradSky(DAWNSEA); glow(540, 1050, 460, '#FFE0A0', 0.6); circle(540, 1080, 120, '#FFF0C8');
      island(860, 1240, 0.5, '#5A3A4A', '#7A4A5A'); river(t, 1240, '#5A6A9A', '#1A2A4A', '#FFE0A0', 0.6);
      const k = seg(lt, 0, d); kaliya(420 + 200 * k, 1520 - 160 * k, 0.4 - 0.1 * k, t, { glow: 0, eyes: 0.5, feet: 1, bow: 0.2 });
      garuda(300 + 300 * k, 700 - 60 * Math.sin(k * Math.PI), { s: 0.3, t, aura: 0.6 });
      slipAt(lt, gr, 'गरुड़ भी', 800, 400, 56, 0.04); ribbonAt(lt, ch, 'कभी नहीं छुएँगे', 540, 300, 86);
      birds(t, 100, 440, 4, '#3A2A4A', 1); motes(t, 30, [0, 300, W, 1300], '#FFE0A0', 0.6, 30, 201, 3); vignette(0.45);
    } });
    cue(cut_(20) + gr, 'whoosh', { gain: 0.5 }); cue(cut_(20) + ch, 'bell', { gain: 0.5 }); }

  // 21 · loop: they say even today the mark shows on a cobra's hood
  { const aj = W_('आज', 21), ns = W_('निशान', 21);
    add({ id: 'S22', at: cut_(21), cam: [540, 960], zoom: 0.14, note: 'Vrindavan ghat night: diyas on the ghat steps, a cobra rises by the water, the mark on its hood glows gold on निशान; ribbon आज भी', draw(lt, d, t) {
      gradSky(GHAT); stars(t, 100, -200, 800, 211, 0.6);
      ranges([{ y: 1150, h: 220, col: '#2A1238', seed: 212, haze: 0.3 }], lt * 18, '#D2702A');
      kadamba(170, 1250, 0.75, t, '#140A1A', '#1E1028'); kadamba(930, 1230, 0.7, t, '#140A1A', '#1E1028');
      for (let i = 0; i < 4; i++) cut(P_rr(-200, 1250 + i * 60, W + 400, 60, 2), i % 2 ? '#3A2030' : '#4A2A3A', { shadow: 0.4, edge: 2 });
      for (let i = 0; i < 8; i++) diya(80 + i * 135, 1300 + (i % 2) * 60, 0.55, t, i + 21);
      river(t, 1500, '#2A1A3A', '#0A0612', '#FFC060', 0.6);
      const rs = eo(seg(lt, 0, 0.8)); glow(540, 1200, 260, '#FFC060', 0.3); smallNaga(540, 1560, 2.6 * (0.6 + 0.4 * rs), t, '#2E4A2A', 0);
      footprint(540 + Math.sin(t * 2) * 10 * 2.6 * (0.6 + 0.4 * rs), 1560 - 180 * 2.6 * (0.6 + 0.4 * rs) - 10, 0.8, 0, '#FFE08A', eo(seg(lt, ns - 0.3, ns + 0.4)) * 1.0);
      ribbonAt(lt, aj, 'आज भी', 540, 300, 110);
      motes(t, 40, [0, 300, W, 1300], '#FFC060', 0.7, 40, 213, 4); vignette(0.5);
    } });
    cue(cut_(21) + aj, 'bell', { gain: 0.5 }); cue(cut_(21) + ns, 'sparkle', { gain: 0.7 }); }

  // 22-23 · end card
  { const st = cut_(22), f = Wd('फ़ॉलो', 23) - st;
    add({ id: 'S23', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: Yamuna at night with kadamba silhouettes and diyas, Untold Stories in gold', draw(lt, d, t) {
      gradSky(MOONV); stars(t, 120, -200, 900, 221, 0.6);
      kadamba(160, 1400, 0.8, t, '#0A0818', '#140E26'); kadamba(920, 1400, 0.8, t, '#0A0818', '#140E26');
      river(t, 1400, '#1E1448', '#06041A', '#FFE0A0', 0.6);
      for (let i = 0; i < 8; i++) diya(90 + i * 130, 1500, 0.55, t, i + 3);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 560, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 710, 80, '#FFE6C8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 860, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
