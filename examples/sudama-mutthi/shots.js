// रुक्मिणी ने कृष्ण का हाथ क्यों पकड़ा? Krishna & Sudama, the handful of flattened rice — cinematic cut paper.
// Bhagavata Purana 10.80-81.
// Palette: Dwarka night gold (hook) → rice-light violet → village dawn rose → hut lamp amber → wife's dusk →
// neighbours' grey-blue → potli amber → long road sunset → Dwarka sea gold → embrace white-gold → palace turquoise →
// hidden-potli crimson → doubt slate → Krishna blue blaze → eating gold → grip crimson-gold → cosmic worlds →
// dawn road → golden-palace reveal → friendship sunset → hook echo → end card.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky, cloud, diya, water, skyline, birds } from './atmos.js';
import { raja, devi, rishi, krishna, warrior, lotus, sudarshan, vessel } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

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
// golden scales (taraazu); base (x, y), tilt rad (+ = right pan down)
export function scales(x, y, s, tilt) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-12, -520, 24, 520, 8), '#B07A22', { shadow: 0.5, edge: 2 }); cut(P_rr(-120, -20, 240, 30, 10), '#8A5A1A', { shadow: 0.5, edge: 2 });
  ctx.save(); ctx.translate(0, -520); ctx.rotate(tilt); cut(P_rr(-360, -12, 720, 24, 10), '#E0A93A', { shadow: 0.5, edge: 2 });
  for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 340, 0); ctx.rotate(-tilt); ctx.strokeStyle = '#E0A93A'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-90, 220); ctx.moveTo(0, 0); ctx.lineTo(90, 220); ctx.stroke(); cut(() => { ctx.beginPath(); ctx.ellipse(0, 230, 110, 30, 0, 0, Math.PI); }, '#B07A22', { shadow: 0.4, edge: 2 }); ctx.restore(); }
  ctx.restore(); circle(0, -520, 22, '#F6D98A'); ctx.restore();
}

const NIGHTG = [[0, '#06040E'], [0.45, '#1E1238'], [0.8, '#6A3A2A'], [1, '#F2A23A']];
const VIOLET = [[0, '#05030F'], [0.5, '#1E1040'], [0.85, '#4A2A7A'], [1, '#8A5AB0']];
const ROSE = [[0, '#1A1030'], [0.45, '#5A2E5A'], [0.8, '#C0596A'], [1, '#F6B27A']];
const AMBER = [[0, '#0E0604'], [0.5, '#3A1E0E'], [1, '#B8682A']];
const DUSK = [[0, '#120A22'], [0.5, '#3A1E4A'], [0.85, '#9A4A5A'], [1, '#E8905A']];
const GREYB = [[0, '#0A0E18'], [0.5, '#22304A'], [1, '#6A7A94']];
const SUNSET = [[0, '#1A0A1E'], [0.4, '#5A1E2E'], [0.75, '#D2602A'], [1, '#FFC060']];
const SEAG = [[0, '#06121E'], [0.45, '#123A5A'], [0.8, '#C89A4A'], [1, '#FFE0A0']];
const TEJ = [[0, '#2A1A06'], [0.5, '#A86A1A'], [0.85, '#F6D080'], [1, '#FFF6D8']];
const TURQ = [[0, '#04141A'], [0.5, '#0E3A42'], [0.85, '#2A7A7A'], [1, '#E8C07A']];
const CRIMSON = [[0, '#100206'], [0.5, '#4A0E18'], [1, '#B83A2A']];
const SLATE = [[0, '#05070E'], [0.5, '#161C2E'], [1, '#3A465E']];
const BLAZE = [[0, '#0A1430'], [0.45, '#2A4A8A'], [0.8, '#8AB0E8'], [1, '#FFF2C8']];
const GOLDN = [[0, '#2A1206'], [0.5, '#8A4A12'], [1, '#F6C860']];
const COSMIC = [[0, '#05030F'], [0.45, '#1E0E3A'], [0.8, '#3A2A7A'], [1, '#6A8AD0']];
const KB = '#3A5FA8', KB_D = '#2A4A88', SKIN = '#B97A4E', RUK = '#C88A5E';

// ---------- new kit ----------
// flattened-rice grains (chivda): n flakes around (x, y) in radius r; glow g
export function grains(x, y, r, n, t, g = 1, seed = 1) {
  if (g) glow(x, y, r * 1.6, '#FFE6A0', 0.45 * g);
  for (let i = 0; i < n; i++) { const a = rnd(i + seed) * TAU, rr = r * Math.sqrt(rnd(i * 3 + seed)); ctx.save(); ctx.translate(x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.6 + Math.sin(t * 2 + i) * 3); ctx.rotate(i + t * 0.3);
    cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 9, 5, 0, 0, TAU); }, i % 3 ? '#F7EFDC' : '#E8D3A0', { shadow: 0, edge: 0 }); ctx.restore(); }
}
// a torn cloth bundle (potli) at (x, y) = base centre; open 0..1 shows the rice; g glow
export function potli(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.g) glow(0, -80, 220, '#FFE6A0', 0.5 * o.g);
  const op = o.open || 0;
  cut(() => { ctx.beginPath(); ctx.moveTo(-120, 0); ctx.quadraticCurveTo(-150, -110, -60, -150 + op * 40); ctx.lineTo(60, -150 + op * 40); ctx.quadraticCurveTo(150, -110, 120, 0); ctx.quadraticCurveTo(0, 22, -120, 0); ctx.closePath(); }, o.col || '#B8A27A', { shadow: 0.6, edge: 3 });
  ctx.strokeStyle = 'rgba(70,50,30,0.5)'; ctx.lineWidth = 3; for (const [a, b] of [[-70, -40], [30, -90], [-20, -110]]) { ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(a + 26, b + 18); ctx.moveTo(a + 4, b + 14); ctx.lineTo(a + 22, b - 2); ctx.stroke(); }
  cut(P_poly([[60, -40], [100, -20], [80, -60]]), '#7A6448', { shadow: 0.2, edge: 1 }); // a tear
  if (op < 0.5) { cut(P_rr(-40, -175, 80, 34, 14), '#8A7450', { shadow: 0.3, edge: 2 }); cut(P_poly([[-10, -170], [-60, -230 - Math.sin(t * 3) * 6], [-30, -175]]), '#9A845E', { shadow: 0.3, edge: 2 }); cut(P_poly([[10, -170], [60, -226 + Math.sin(t * 3) * 6], [30, -175]]), '#9A845E', { shadow: 0.3, edge: 2 }); }
  else grains(0, -120, 70, 26, t, o.g || 0.6, 7);
  ctx.restore();
}
// a thatched village hut; base centre (x, y)
export function jhopdi(x, y, s, col = '#6A4A2E', roof = '#A8844A', lamp = 0, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-220, -280, 440, 280, 6), col, { shadow: 0.6, edge: 3 });
  cut(P_rr(-60, -200, 120, 200, 50), '#1A0E08', { shadow: 0.2, edge: 2 });
  if (lamp) { glow(0, -60, 140, '#FFB050', 0.6 * lamp); diya(0, -20, 0.5, t, 3, lamp); }
  cut(P_poly([[-280, -260], [0, -500], [280, -260], [250, -240], [-250, -240]]), roof, { shadow: 0.6, edge: 3 });
  ctx.strokeStyle = 'rgba(70,50,20,0.45)'; ctx.lineWidth = 4; for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(i * 10, -490); ctx.lineTo(i * 50, -250); ctx.stroke(); }
  ctx.restore();
}
// a golden Dwarka palace: domes, arches, flags; base centre (cx, base)
export function mahal(cx, base, s, t, col = '#E8C07A', col2 = '#C8864A', lit = 1) {
  ctx.save(); ctx.translate(cx, base); ctx.scale(s, s);
  if (lit) glow(0, -500, 700, '#FFE6A0', 0.3 * lit);
  cut(P_rr(-520, -420, 1040, 420, 6), col2, { shadow: 0.7, edge: 3 });
  for (const [dx, w, h] of [[-380, 150, 560], [380, 150, 560], [-190, 170, 680], [190, 170, 680], [0, 260, 900]]) {
    cut(P_rr(dx - w / 2, -h * 0.62, w, h * 0.62 - 400 + 400, 4), col, { shadow: 0.6, edge: 3 });
    cut(() => { ctx.beginPath(); ctx.moveTo(dx - w * 0.6, -h * 0.62); ctx.quadraticCurveTo(dx - w * 0.7, -h * 0.9, dx, -h); ctx.quadraticCurveTo(dx + w * 0.7, -h * 0.9, dx + w * 0.6, -h * 0.62); ctx.closePath(); }, col, { shadow: 0.6, edge: 3 });
    circle(dx, -h - 14, 14, '#F2C14E'); ctx.strokeStyle = '#6A3A1A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(dx, -h - 20); ctx.lineTo(dx, -h - 120); ctx.stroke();
    const fl = Math.sin(t * 4 + dx) * 12; cut(P_poly([[dx, -h - 120], [dx + 80 + fl, -h - 100], [dx, -h - 76]]), '#F2702A', { shadow: 0.3, edge: 2 });
  }
  for (let i = 0; i < 7; i++) { const ax = -420 + i * 140; cut(() => { ctx.beginPath(); ctx.moveTo(ax - 40, 0); ctx.lineTo(ax - 40, -150); ctx.quadraticCurveTo(ax, -220, ax + 40, -150); ctx.lineTo(ax + 40, 0); ctx.closePath(); }, i === 3 ? '#2A1206' : '#5A2E14', { shadow: 0.3, edge: 2 }); if (lit && i !== 3) glow(ax, -100, 50, '#FFB050', 0.5 * lit); }
  ctx.restore();
}
// close-up: Krishna's blue fist full of rice (from bottom right), Rukmini's bangled hand closing on his wrist (from the left). grip 0..1
export function handGrip(t, grip, o = {}) {
  const fx = o.fx ?? 500, fy = o.fy ?? 760;
  // Krishna's forearm
  ctx.save(); ctx.translate(fx, fy); ctx.rotate(-0.62);
  cut(P_rr(-80, 40, 160, 1100, 70), KB, { shadow: 0.6, edge: 4 });
  cut(P_rr(-88, 150, 176, 40, 16), '#E0A93A', { shadow: 0.4, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 120, 110, 0, 0, TAU); }, KB, { shadow: 0.6, edge: 4 });
  ctx.strokeStyle = KB_D; ctx.lineWidth = 7; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-66 + i * 44, -70, 24, Math.PI, TAU); ctx.stroke(); }
  cut(() => { ctx.beginPath(); ctx.ellipse(96, 10, 34, 70, -0.3, 0, TAU); }, KB, { shadow: 0.4, edge: 3 });
  ctx.restore();
  grains(fx - 20, fy - 120, 90, 34, t, o.g ?? 1, 3);
  motes(t, 24, [fx - 160, fy - 300, 320, 360], '#FFF2C0', 0.8, -60, 9, 4);
  if (grip > 0) { // Rukmini's forearm + hand around the wrist
    const wx = fx + 170, wy = fy + 250, k = eo(grip);
    ctx.save(); ctx.translate(lerp(-200, wx, k), lerp(1100, wy, k)); ctx.rotate(0.95);
    cut(P_rr(-1100, -62, 1100, 124, 60), RUK, { shadow: 0.6, edge: 4 });
    for (let i = 0; i < 6; i++) cut(P_rr(-280 + i * 26, -70, 16, 140, 8), i % 2 ? '#C8323D' : '#E0A93A', { shadow: 0.3, edge: 1 });
    cut(() => { ctx.beginPath(); ctx.ellipse(10, 0, 90, 76, 0, 0, TAU); }, RUK, { shadow: 0.5, edge: 3 });
    for (let i = 0; i < 4; i++) { cut(P_rr(40 + i * 8, -110 + i * 40, 150, 36, 18), RUK, { shadow: 0.4, edge: 2 }); circle(160 + i * 8, -92 + i * 40, 6, '#C8323D'); }
    for (let i = 0; i < 5; i++) circle(-20 + (i % 3) * 22, -20 + Math.floor(i / 3) * 30, 5, '#8A3A1A');
    ctx.restore();
  }
}
// a soft orb-world (for "everything")
function world(x, y, r, col, t, a = 1) { ctx.save(); ctx.globalAlpha *= a; glow(x, y, r * 1.8, col, 0.4); cut(P_circ(x, y, r), col, { shadow: 0.4, edge: 2 }); ctx.strokeStyle = 'rgba(255,246,216,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(x, y, r * 1.6, r * 0.4, Math.sin(t + x) * 0.2, 0, TAU); ctx.stroke(); ctx.restore(); }
function sea(t, y, a = 1) { ctx.save(); ctx.globalAlpha *= a; water(t, y, ['#1E5A7A', '#0E2A44'], '#FFE0A0', 0.6); ctx.restore(); }
function sudama(x, y, s, t, pose = 'stand', dir = 1, aura = 0) { rishi(x, y, { s, t, pose, dir, aura }); }
function wife(x, y, h, t, pose = 'stand', dir = 1) { devi({ x, y, h, t, pose, dir, sari: '#7A5A3A', border: '#B89A5A', eyes: 0 }); }
function rukmini(x, y, h, t, pose = 'stand', dir = 1, glowA = 0) { devi({ x, y, h, t, pose, dir, sari: '#B8243A', border: '#E0A93A', crown: true, glowA }); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK: the grip (thumbnail)
  { const hth = W_('हाथ', 0), pk = W_('पकड़', 0);
    add({ id: 'S01', at: 0, cam: [540, 860], zoom: 0.16, note: 'Dwarka night gold: Krishna blue fist full of glowing rice, Rukmini bangled hand closes on his wrist on पकड़; palace domes behind; ring + ?', draw(lt, d, t) {
      gradSky(NIGHTG); stars(t, 90, -200, 800, 3, 0.6); godRays(540, 700, 0, TAU, 30, 1500, '#FFE6A0', 0.15, t);
      ctx.save(); ctx.globalAlpha = 0.55; mahal(540 - lt * 10, 1300, 0.9, t, '#3A2238', '#2A1628', 0.4); ctx.restore();
      mist(1250, 300, '#6A3A5A', 0.35, t);
      handGrip(t, Math.max(0.15, seg(lt, pk - 0.5, pk + 0.15)), { fx: 470, fy: 700 });
      ring(lt, pk, 640, 950, '#FFE6A0', 0.9, 700); flash(lt, pk, '#FFE6A0', 0.4, 0.5);
      slipAt(lt, hth, 'रुक्मिणी ने रोका?', 540, 260, 60); qmark(lt, pk + 0.3, 880, 480, 200);
      motes(t, 40, [0, 200, W, 1400], '#FFD890', 0.8, 50, 3, 4); vignette(0.5);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'bell', { gain: 0.6 }); cue(0.1, 'swell', { dur: 2.2, gain: 0.5 }); cue(pk, 'slam', { gain: 0.7 }); }

  // 1 · while eating rice?
  { const ch = W_('चावल', 1), rh = W_('रहे', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 900], zoom: 0.12, note: 'violet: flakes of rice swirl in a ring of light around an open potli; ? on रहे', draw(lt, d, t) {
      gradSky(VIOLET); stars(t, 150, -200, 1200, 5, 0.8);
      ranges([{ y: 1300, h: 200, col: '#1A0E34', seed: 8, haze: 0.4 }, { y: 1420, h: 140, col: '#0E0820', seed: 9 }], lt * 22, '#8A5AB0');
      const k = eo(seg(lt, 0, ch + 0.4));
      for (let i = 0; i < 40; i++) { const a = i / 40 * TAU + t * 0.8, r = 300 * k + 30 * Math.sin(i + t); grains(540 + Math.cos(a) * r, 860 + Math.sin(a) * r * 0.7, 10, 2, t, 0, i); }
      glow(540, 860, 240, '#FFE6A0', 0.5); potli(540, 1180, 1.3, t, { open: 1, g: 1 });
      ground('#0A0818', 1500); slipAt(lt, ch, 'चावल!', 540, 300, 70); qmark(lt, rh, 540, 560, 170);
      motes(t, 40, [0, 200, W, 1500], '#DCE8FF', 0.7, 30, 5, 3); vignette(0.5);
    } });
    cue(cut_(1), 'whoosh', { gain: 0.5 }); cue(cut_(1) + ch, 'sparkle', { gain: 0.6 }); cue(cut_(1) + rh, 'drum', { gain: 0.6 }); }

  // 2 · a poor brahmin, Sudama, Krishna's childhood friend
  { const sd = W_('सुदामा', 2), bc = W_('बचपन', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 920], zoom: 0.1, note: 'village dawn rose: Sudama by his hut, ribbon सुदामा; on बचपन a ghost of two boys at the ashram (child Krishna + child) fades in above', draw(lt, d, t) {
      gradSky(ROSE); glow(760, 1080, 380, '#F6B27A', 0.45);
      ranges([{ y: 1180, h: 240, col: '#5A2E4A', seed: 21, haze: 0.4 }, { y: 1340, h: 160, col: '#3A1A30', seed: 22 }], lt * 22, '#F6B27A');
      birds(t, 120, 380, 5, '#3A1A30', 1);
      jhopdi(820, 1520, 1.0, '#5A3A22', '#8A6A3A'); ground('#2A1222', 1520);
      sudama(380, 1540, 1.1, t, 'stand', 1);
      const g = seg(lt, bc - 0.3, bc + 0.5); if (g > 0) { ctx.save(); ctx.globalAlpha = 0.75 * g; glow(700, 640, 300, '#FFE6A0', 0.5); krishna(640, 860, { s: 0.42, t, pose: 'flute' }); raja({ x: 800, y: 860, h: 420, t, robe: '#F7EFDC', sash: '#E2552A', pose: 'stand' }); ctx.restore(); }
      ribbonAt(lt, sd, 'सुदामा', 380, 300, 110); slipAt(lt, bc, 'बचपन के दोस्त', 720, 1000, 50, 0.04);
      motes(t, 30, [0, 300, W, 1300], '#FFE0C0', 0.6, 30, 21, 3); vignette(0.5);
    } });
    cue(cut_(2) + sd, 'bell', { gain: 0.5 }); cue(cut_(2) + bc, 'sparkle', { gain: 0.5 }); }

  // 3 · no food even for the children
  { const bh = W_('बच्चों', 3), nh = W_('नहीं', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 1000], zoom: 0.1, note: 'hut lamp amber: two thin children sit by an empty pot, a dim diya flickers; slip on नहीं', draw(lt, d, t) {
      gradSky(AMBER); glow(540, 1200, 420, '#B8682A', 0.35 * (0.85 + 0.15 * Math.sin(t * 9)));
      cut(P_rr(-300, 200, W + 600, 1240, 0), '#2A160C', { shadow: 0, edge: 0 }); // back wall
      for (let i = 0; i < 9; i++) { ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(i * 140 - lt * 6, 200); ctx.lineTo(i * 140 - 40 - lt * 6, 1440); ctx.stroke(); }
      ground('#1A0C06', 1440);
      raja({ x: 330, y: 1500, h: 560, t, robe: '#D8C8A0', sash: '#7A5A3A', pose: 'stand' }); raja({ x: 520, y: 1500, h: 470, t, robe: '#D8C8A0', sash: '#7A5A3A', pose: 'stand' });
      vessel(800, 1440, 0.7, '#6A3A22'); diya(680, 1480, 0.8, t, 4, 0.6 + 0.2 * Math.sin(t * 7));
      slipAt(lt, bh, 'भूखे बच्चे', 420, 420, 56, -0.04); if (lt > nh) { ctx.save(); ctx.globalAlpha = eo(seg(lt, nh, nh + 0.3)); bigText('खाली', 800, 1180, 70, '#F6D8A0'); ctx.restore(); }
      mist(1350, 200, '#6A3A22', 0.3, t); motes(t, 20, [0, 900, W, 600], '#FFB050', 0.5, 20, 31, 3); vignette(0.65);
    } });
    cue(cut_(3), 'heartbeat', { gain: 0.5 }); cue(cut_(3) + nh, 'thud', { gain: 0.5 }); }

  // 4 · wife: go to Dwarka, your friend is a king
  { const dw = W_('द्वारका', 4), rj = W_('राजा', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 900], zoom: 0.12, note: 'dusk: wife points toward a glowing Dwarka on the far horizon by the sea; slip द्वारका, crown icon on राजा', draw(lt, d, t) {
      gradSky(DUSK); stars(t, 60, -200, 600, 41, 0.5);
      const g = seg(lt, dw - 0.3, dw + 0.6); glow(800, 1060, 300, '#FFD27A', 0.3 + 0.4 * g);
      ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * g; skyline(1120, '#C8864A', 0.45, 820 - lt * 8); ctx.restore(); sea(t, 1130, 0.9);
      ranges([{ y: 1380, h: 160, col: '#2A1222', seed: 42 }], lt * 26, '#E8905A'); ground('#1A0A16', 1500);
      wife(330, 1540, 860, t, 'boon', 1); sudama(130, 1560, 0.85, t, 'stand', 1);
      slipAt(lt, dw, 'द्वारका', 820, 820, 64); if (lt > rj) { const p = eob(seg(lt, rj, rj + 0.3)); ctx.save(); ctx.translate(820, 640); ctx.scale(p, p); cut(P_poly([[-80, 40], [-90, -40], [-45, 0], [0, -70], [45, 0], [90, -40], [80, 40]]), '#F2C14E', { shadow: 0.4, edge: 3 }); ctx.restore(); }
      motes(t, 30, [0, 300, W, 1200], '#FFE0C0', 0.6, 30, 43, 3); vignette(0.5);
    } });
    cue(cut_(4) + dw, 'swell', { dur: 1.5, gain: 0.4 }); cue(cut_(4) + rj, 'bell', { gain: 0.5 }); }

  // 5 · she begged a handful of chivda from the neighbours
  { const pd = W_('पड़ोस', 5), cv = W_('चिवड़ा', 5), bd = W_('बाँध', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 980], zoom: 0.1, note: 'grey-blue evening lane of huts: neighbours\' hands pour a little rice into the wife\'s cloth; it gets tied', draw(lt, d, t) {
      gradSky(GREYB); stars(t, 40, -200, 500, 51, 0.4);
      for (let i = 0; i < 4; i++) { ctx.save(); ctx.globalAlpha = 0.5 + i * 0.12; jhopdi(((i * 330 - lt * (10 + i * 6)) % 1500 + 1500) % 1500 - 200, 1180 + i * 60, 0.45 + i * 0.1, '#2A3448', '#3E4A62', i === 2 ? 0.6 : 0, t); ctx.restore(); }
      mist(1200, 260, '#8A9AB4', 0.35, t); ground('#141A28', 1480);
      wife(380, 1540, 900, t, 'hold', 1);
      const k = seg(lt, pd, cv + 0.6); ctx.save(); ctx.translate(760, 860); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 90, 50, -0.4, 0, TAU); }, SKIN, { shadow: 0.4, edge: 3 }); ctx.restore();
      for (let i = 0; i < 14 * k; i++) { const fy = (t * 260 + i * 37) % 260; grains(700 - fy * 0.35, 900 + fy, 8, 1, t, 0, i); }
      potli(600, 1150, 0.9, t, { open: bd > lt ? 1 : 0, g: 0.6 });
      slipAt(lt, cv, 'मुट्ठी भर चिवड़ा', 560, 380, 56);
      motes(t, 24, [0, 300, W, 1200], '#DCE8FF', 0.5, 20, 52, 3); vignette(0.55);
    } });
    cue(cut_(5) + cv, 'sparkle', { gain: 0.5 }); cue(cut_(5) + bd, 'tock', { gain: 0.5 }); }

  // 6 · a tiny bundle in torn cloth
  { const ph = W_('फटे', 6), pt = W_('पोटली', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 1000], zoom: 0.2, note: 'amber close-up: the patched potli on a wooden floor, lamp glow, knot sways; slip पोटली', draw(lt, d, t) {
      gradSky(AMBER); glow(540, 1000, 500, '#FFB050', 0.3);
      for (let i = 0; i < 7; i++) cut(P_rr(-200, 1200 + i * 110, W + 400, 100, 4), i % 2 ? '#3A2010' : '#4A2A16', { shadow: 0.3, edge: 2 });
      cut(P_rr(-300, 200, W + 600, 1000, 0), '#24140A', { shadow: 0, edge: 0 }); diya(220, 1220, 1.0, t, 6); diya(880, 1220, 0.8, t, 7);
      potli(540, 1300, 2.2, t, { g: 0.4 + 0.3 * seg(lt, pt - 0.2, pt + 0.4) });
      slipAt(lt, ph, 'फटा कपड़ा', 300, 520, 54, -0.05); ribbonAt(lt, pt, 'पोटली', 540, 380, 110);
      motes(t, 30, [0, 400, W, 1000], '#FFB050', 0.6, 30, 61, 3); vignette(0.6);
    } });
    cue(cut_(6) + pt, 'bell', { gain: 0.4 }); }

  // 7 · the real turn was still to come
  { const md = W_('मोड़', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 980], zoom: 0.18, note: 'sunset: Sudama a small figure walking a long winding road toward the sea, potli in hand; big ? on मोड़', draw(lt, d, t) {
      gradSky(SUNSET); glow(540, 1100, 360, '#FFC060', 0.6); circle(540, 1100, 140, '#FFD890');
      sea(t, 1150, 0.8); ranges([{ y: 1300, h: 200, col: '#5A1E2E', seed: 71, haze: 0.3 }, { y: 1420, h: 140, col: '#3A0E1E', seed: 72 }], lt * 30, '#FFC060');
      ground('#2A0A16', 1460); cut(P_poly([[420, 1920], [520, 1460], [560, 1460], [760, 1920]]), '#6A2A2A', { shadow: 0.3, edge: 2 });
      const k = seg(lt, 0, d); sudama(560 - 30 * k, 1660 - 120 * k, 0.55 - 0.15 * k, t, 'walk', -1);
      birds(t, 200, 600, 6, '#3A0E1E', 1.2); qmark(lt, md, 540, 600, 230);
      motes(t, 30, [0, 300, W, 1300], '#FFD890', 0.6, 30, 73, 3); vignette(0.5);
    } });
    cue(cut_(7), 'whoosh', { gain: 0.4 }); cue(cut_(7) + md, 'drum', { gain: 0.7 }); }

  // 8 · the palace of Dwarka... and a ragged brahmin at the gate
  { const mh = W_('महल', 8), dz = W_('दरवाज़े', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 1100], zoom: 0.08, note: 'WOW scale: Dwarka sea-gold, the huge golden palace with flags fills the frame; tiny Sudama at the gate; ribbon द्वारका', draw(lt, d, t) {
      gradSky(SEAG); godRays(540, 500, 0, TAU, 30, 1500, '#FFF0C0', 0.14, t); glow(540, 700, 600, '#FFE0A0', 0.4);
      ctx.save(); ctx.globalAlpha = 0.5; skyline(1100, '#C8864A', 0.6, 200 - lt * 6); skyline(1100, '#C8864A', 0.6, 900 - lt * 6); ctx.restore();
      sea(t, 1380, 0.8);
      const r = eo(seg(lt, 0, mh + 0.4)); mahal(540, 1460 + 120 * (1 - r), 0.95, t, '#F2D08A', '#D2944A', 1);
      ground('#5A3A1A', 1460); sudama(540, 1500, 0.32, t, 'stand', 1);
      ribbonAt(lt, mh, 'द्वारका', 540, 280, 120); if (lt > dz) { ctx.save(); ctx.globalAlpha = 0.6 * eo(seg(lt, dz, dz + 0.4)); glow(540, 1400, 120, '#FFFFFF', 0.6); ctx.restore(); }
      motes(t, 40, [0, 200, W, 1300], '#FFF2C0', 0.7, 40, 81, 4); vignette(0.45);
    } });
    cue(cut_(8), 'conch', { dur: 2, gain: 0.5 }); cue(cut_(8) + mh, 'bell', { gain: 0.6 }); cue(cut_(8) + dz, 'thud', { gain: 0.5 }); }

  // 9 · Krishna saw him and ran to embrace him
  { const dk = W_('देखा', 9), dd = W_('दौड़कर', 9), gl = W_('गले', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 920], zoom: 0.14, note: 'WOW: palace hall white-gold; Krishna runs in from the right and embraces Sudama on गले: blaze, ring, petals', draw(lt, d, t) {
      gradSky(TEJ); godRays(540, 600, 0, TAU, 32, 1500, '#FFFFFF', 0.12, t);
      for (let i = 0; i < 6; i++) { const px = ((i * 240 - lt * 40) % 1440 + 1440) % 1440 - 180; cut(P_rr(px - 40, 200, 80, 1300, 10), '#C8864A', { shadow: 0.5, edge: 3 }); cut(P_rr(px - 60, 200, 120, 40, 6), '#E8C07A', { shadow: 0.3, edge: 2 }); }
      ground('#8A5A2A', 1480);
      const run = eio(seg(lt, 0.1, gl - 0.05)); const kx = lerp(1000, 650, run);
      sudama(420, 1540, 1.0, t, 'stand', 1);
      if (lt > gl - 0.05) glow(530, 900, 460, '#FFFFFF', 0.55 * (1 - 0.5 * seg(lt, gl, gl + 1)));
      krishna(kx, 1540, { s: 1.0, t, pose: 'flute', aura: 0.6 + seg(lt, gl, gl + 0.4) });
      ring(lt, gl, 540, 900, '#FFF6D8', 1, 800); flash(lt, gl, '#FFFBEA', 0.5, 0.6);
      slipAt(lt, dk, 'कृष्ण ने देखा', 760, 300, 56, 0.04); ribbonAt(lt, gl, 'गले लगा लिया', 540, 260, 92);
      if (lt > gl) petals(t, 24, 91);
      motes(t, 30, [0, 200, W, 1300], '#FFF2C0', 0.6, 30, 92, 3); vignette(0.4);
    } });
    cue(cut_(9) + dd, 'whoosh', { gain: 0.6 }); cue(cut_(9) + gl, 'drum', { gain: 0.8 }); cue(cut_(9) + gl + 0.05, 'bell', { gain: 0.7 }); }

  // 10 · washed Sudama's feet with his own hands
  { const ht = W_('हाथों', 10), pr = W_('पैर', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 1100], zoom: 0.14, note: 'palace turquoise close-up: blue hands pour water from a golden kalash into a basin; splashes sparkle, lotus petals float', draw(lt, d, t) {
      gradSky(TURQ); glow(540, 1000, 500, '#E8C07A', 0.3);
      for (let i = 0; i < 5; i++) { const px = ((i * 300 + lt * 30) % 1500) - 200; cut(P_rr(px - 30, 300, 60, 1200, 8), '#1E5A5A', { shadow: 0.4, edge: 2 }); }
      cut(P_rr(-300, 1400, W + 600, 600, 0), '#0E2A2A', { shadow: 0, edge: 0 });
      vessel(540, 1380, 1.1, '#C8864A'); cut(() => { ctx.beginPath(); ctx.ellipse(540, 1236, 225, 30, 0, 0, TAU); }, '#4E9FB0', { shadow: 0.2, edge: 2 }); glow(540, 1236, 160, '#E8FFFF', 0.3);
      for (const fx of [460, 610]) { cut(() => { ctx.beginPath(); ctx.ellipse(fx, 1190, 46, 80, 0, 0, TAU); }, SKIN, { shadow: 0.4, edge: 3 }); for (let j = 0; j < 4; j++) circle(fx - 24 + j * 16, 1116 + Math.abs(j - 1.5) * 4, 10, '#A86A42'); } // feet in the basin
      const tilt = 0.4 + 0.25 * seg(lt, ht, pr);
      ctx.save(); ctx.translate(700, 760); ctx.rotate(tilt); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 90, 110, 0, 0, TAU); }, '#E0A93A', { shadow: 0.5, edge: 3 }); cut(P_rr(-30, -150, 60, 50, 10), '#E0A93A', { shadow: 0.4, edge: 2 }); cut(P_rr(70, -30, 110, 30, 12), '#E0A93A', { shadow: 0.4, edge: 2 }); ctx.restore();
      for (const [x0, y0, r] of [[810, 850, -0.64]]) { ctx.save(); ctx.translate(x0, y0); ctx.rotate(r); cut(P_rr(-55, 0, 110, 520, 50), KB, { shadow: 0.5, edge: 3 }); cut(P_rr(-60, 40, 120, 30, 12), '#E0A93A', { shadow: 0.3, edge: 2 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 70, 60, 0, 0, TAU); }, KB, { shadow: 0.4, edge: 3 }); ctx.restore(); }
      ctx.save(); ctx.strokeStyle = 'rgba(200,240,255,0.85)'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(840, 830); ctx.quadraticCurveTo(700 + Math.sin(t * 10) * 6, 1000, 560, 1220); ctx.stroke(); ctx.restore();
      motes(t, 40, [400, 1100, 300, 200], '#E8FFFF', 0.9, 80, 101, 5);
      for (let i = 0; i < 5; i++) lotus(380 + i * 70, 1250 + Math.sin(t * 2 + i) * 4, 0.25, 1);
      slipAt(lt, ht, 'अपने हाथों से', 540, 300, 60); slipAt(lt, pr, 'पैर धोए', 300, 460, 54, -0.05);
      vignette(0.5);
    } });
    cue(cut_(10), 'bubbles', { gain: 0.4 }); cue(cut_(10) + pr, 'bell', { gain: 0.5 }); }

  // 11 · but Sudama kept the bundle hidden
  { const pt = W_('पोटली', 11);
    add({ id: 'S12', at: cut_(11), cam: [600, 1000], zoom: 0.12, note: 'crimson palace hall: Sudama stands shy, the potli glows behind his back; silks and lamps around', draw(lt, d, t) {
      gradSky(CRIMSON); glow(540, 900, 500, '#E8905A', 0.25);
      for (let i = 0; i < 4; i++) { const px = 100 + i * 300 - lt * 14; cut(P_poly([[px - 70, 200], [px + 70, 200], [px + 40 + Math.sin(t + i) * 10, 1300], [px - 40 + Math.sin(t + i) * 10, 1300]]), i % 2 ? '#7A1E2A' : '#A8322D', { shadow: 0.5, edge: 3 }); }
      ground('#2A0A10', 1480); for (let i = 0; i < 5; i++) diya(120 + i * 210, 1480, 0.6, t, i + 11);
      potli(700, 1080, 0.6, t, { g: 0.5 + 0.5 * seg(lt, pt, pt + 0.4) });
      sudama(560, 1540, 1.1, t, 'namaste', 1);
      slipAt(lt, pt, 'पोटली छिपाई', 760, 360, 56, 0.04);
      motes(t, 24, [0, 300, W, 1200], '#FFB060', 0.6, 30, 111, 3); vignette(0.55);
    } });
    cue(cut_(11) + pt, 'heartbeat', { gain: 0.5 }); }

  // 12 · how to give chivda to a king?
  { const rj = W_('राजा', 12), ks = W_('कैसे', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 900], zoom: 0.1, note: 'slate doubt: golden scales, a crown on one pan, the tiny potli on the other; ? on कैसे', draw(lt, d, t) {
      gradSky(SLATE); stars(t, 80, -200, 900, 121, 0.5); mist(1300, 300, '#4A5A7A', 0.35, t);
      ranges([{ y: 1340, h: 180, col: '#0E1424', seed: 122 }], lt * 24, '#3A465E'); ground('#080C16', 1500);
      const tilt = -0.18 + 0.03 * Math.sin(t * 2); scales(540, 1440, 1.0, tilt);
      const ly = -520 - Math.sin(tilt) * 340 + 230, ry = -520 + Math.sin(tilt) * 340 + 230;
      ctx.save(); ctx.translate(540 - 340, 1440 + ly - 40); cut(P_poly([[-80, 40], [-90, -40], [-45, 0], [0, -70], [45, 0], [90, -40], [80, 40]]), '#F2C14E', { shadow: 0.4, edge: 3 }); glow(0, 0, 120, '#FFE6A0', 0.3); ctx.restore();
      potli(540 + 340, 1440 + ry - 10, 0.45, t, {});
      slipAt(lt, rj, 'राजा', 200, 520, 60, -0.04); qmark(lt, ks, 540, 420, 200);
      motes(t, 24, [0, 300, W, 1200], '#DCE8FF', 0.5, 20, 123, 3); vignette(0.55);
    } });
    cue(cut_(12) + ks, 'drum', { gain: 0.6 }); }

  // 13 · Krishna smiled and snatched the bundle
  { const mk = W_('मुस्कुराए', 13), ch = W_('छीन', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 860], zoom: 0.14, note: 'Krishna blue blaze: Krishna raises the snatched potli high, it bursts open in light on छीन', draw(lt, d, t) {
      gradSky(BLAZE); godRays(540, 500, 0, TAU, 28, 1500, '#FFF2C8', 0.14, t);
      ctx.save(); ctx.globalAlpha = 0.4; mahal(540 + lt * 10, 1380, 0.7, t, '#4A6AA0', '#2A4A80', 0); ctx.restore();
      mist(1300, 260, '#8AB0E8', 0.35, t); ground('#0A1430', 1500);
      const tip = krishna(560, 1540, { s: 1.15, t, pose: 'lift', aura: 0.5 + 0.5 * seg(lt, mk, mk + 0.5) });
      if (lt > ch - 0.2) { const p = eob(seg(lt, ch - 0.2, ch + 0.2)); potli(tip[0], tip[1] + 40, 0.55 * p, t, { open: lt > ch ? 1 : 0, g: 1 }); }
      ring(lt, ch, tip[0], tip[1], '#FFF2C8', 0.8, 500); slipAt(lt, mk, 'मुस्कान', 820, 640, 54, 0.04);
      motes(t, 40, [0, 200, W, 1300], '#FFF2C0', 0.7, 40, 131, 4); vignette(0.45);
    } });
    cue(cut_(13) + mk, 'sparkle', { gain: 0.5 }); cue(cut_(13) + ch, 'whoosh', { gain: 0.7 }); cue(cut_(13) + ch + 0.1, 'pop', { gain: 0.5 }); }

  // 14 · ate one handful... was lifting the second, when...
  { const mt = W_('मुट्ठी', 14), ds = W_('दूसरी', 14), ki = W_('कि', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 820], zoom: 0.18, note: 'gold: close-up of Krishna\'s fist of glowing rice rising; counter "1" then "2"; freeze + ? on कि', draw(lt, d, t) {
      gradSky(GOLDN); godRays(540, 700, 0, TAU, 26, 1400, '#FFE6A0', 0.14, t);
      ctx.save(); ctx.globalAlpha = 0.45; mahal(540, 1500, 0.8, t, '#8A4A12', '#6A3A0E', 0.3); ctx.restore();
      const rise = lt > ds ? eo(seg(lt, ds, ds + 0.8)) : 0;
      handGrip(t, 0, { fx: 500, fy: 860 - 160 * rise, g: 1 });
      if (lt > mt) { ctx.save(); ctx.globalAlpha = eo(seg(lt, mt, mt + 0.3)); bigText(lt > ds ? '2' : '1', 840, 420, 200, '#FFF2C8'); ctx.restore(); }
      qmark(lt, ki, 260, 420, 200);
      motes(t, 40, [0, 200, W, 1300], '#FFD890', 0.8, 40, 141, 4); vignette(0.5);
    } });
    cue(cut_(14) + mt, 'tock', { gain: 0.6 }); cue(cut_(14) + ds, 'tock', { gain: 0.6 }); cue(cut_(14) + ki, 'heartbeat', { gain: 0.7 }); }

  // 15 · Rukmini held his hand
  { const rk = W_('रुक्मिणी', 15), th = W_('थाम', 15);
    add({ id: 'S16', at: cut_(15), cam: [560, 860], zoom: 0.16, trans: 'flash', note: 'WOW: crimson-gold blaze, Rukmini\'s bangled hand closes on Krishna\'s wrist on थाम; shockwave ring; ribbon रुक्मिणी', draw(lt, d, t) {
      gradSky(CRIMSON); godRays(560, 860, 0, TAU, 36, 1600, '#FFD890', 0.18, t); glow(560, 860, 500, '#F2A23A', 0.4);
      ctx.save(); ctx.globalAlpha = 0.35; mahal(540, 1500, 0.8, t, '#6A1E2A', '#4A0E18', 0); ctx.restore();
      handGrip(t, Math.max(0.3, seg(lt, 0, th + 0.1)), { fx: 470, fy: 700 });
      ring(lt, th, 640, 950, '#FFE6A0', 1, 900); flash(lt, th, '#FFF6D8', 0.5, 0.6);
      ribbonAt(lt, rk, 'रुक्मिणी', 540, 260, 110);
      motes(t, 50, [0, 200, W, 1400], '#FFD890', 0.8, 50, 151, 4); vignette(0.5);
    } });
    cue(cut_(15), 'drum', { gain: 0.9 }); cue(cut_(15) + th, 'slam', { gain: 0.8 }); cue(cut_(15) + th + 0.05, 'bell', { gain: 0.7 }); }

  // 16 · one handful has already given everything
  { const mt = W_('मुट्ठी', 16), sb = W_('सब', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 860], zoom: 0.22, note: 'cosmic: Rukmini speaks (left), from one glowing handful in the centre golden worlds bloom outward; slip सब कुछ', draw(lt, d, t) {
      gradSky(COSMIC); stars(t, 220, -200, 1500, 161, 1);
      const k = eo(seg(lt, mt, sb + 0.8));
      grains(560, 860, 60, 26, t, 1, 4); godRays(560, 860, 0, TAU, 24, 900 * k, '#FFF2C0', 0.16, t);
      for (let i = 0; i < 7; i++) { const a = i / 7 * TAU + t * 0.25, r = 120 + 300 * k; world(560 + Math.cos(a) * r, 860 + Math.sin(a) * r * 0.75, 30 + 18 * (i % 3), ['#F2C14E', '#E8905A', '#6AC0B0', '#B88AE0'][i % 4], t, k); }
      rukmini(180, 1560, 900, t, 'namaste', 1, 0.6);
      slipAt(lt, sb, 'सब कुछ', 720, 1320, 70, 0.03);
      motes(t, 40, [0, 200, W, 1400], '#FFF2C0', 0.7, 40, 162, 4); vignette(0.45);
    } });
    cue(cut_(16) + mt, 'sparkle', { gain: 0.6 }); cue(cut_(16) + sb, 'swell', { dur: 1.8, gain: 0.5 }); }

  // 17 · Sudama came home without asking for anything
  { const mg = W_('माँगे', 17), lt_ = W_('लौट', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 980], zoom: 0.1, note: 'rose dawn road: Sudama walks home, empty open palms, peaceful; fields + birds; slip कुछ नहीं माँगा', draw(lt, d, t) {
      gradSky(ROSE); glow(300, 1050, 340, '#F6B27A', 0.5); circle(300, 1060, 110, '#FFD8A0');
      ranges([{ y: 1160, h: 240, col: '#7A3E5A', seed: 171, haze: 0.4 }, { y: 1320, h: 170, col: '#4A1E3A', seed: 172 }], lt * 28, '#F6B27A');
      birds(t, 520, 420, 6, '#4A1E3A', 1); ground('#2A1222', 1480);
      cut(P_poly([[-100, 1920], [400, 1480], [600, 1480], [1180, 1920]]), '#7A4A4A', { shadow: 0.3, edge: 2 });
      sudama(560 - lt * 30, 1600, 1.0, t, 'walk', -1);
      slipAt(lt, mg, 'कुछ नहीं माँगा', 680, 340, 58, 0.04);
      motes(t, 30, [0, 300, W, 1300], '#FFE0C0', 0.6, 30, 173, 3); vignette(0.5);
    } });
    cue(cut_(17), 'whoosh', { gain: 0.4 }); cue(cut_(17) + mg, 'bell', { gain: 0.4 }); }

  // 18 · and saw: where the hut stood, a palace of gold!
  { const dk = W_('देखा', 18), jh = W_('झोपड़ी', 18), sn = W_('सोने', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 1050], zoom: 0.14, note: 'WOW: the hut dissolves into sparks and a golden palace rises in its place on सोने; flash + ring; Sudama small in front', draw(lt, d, t) {
      const k = eo(seg(lt, sn - 0.4, sn + 0.6));
      gradSky(k > 0.5 ? TEJ : ROSE); godRays(540, 900, 0, TAU, 32, 1500, '#FFF2C0', 0.16 * k, t);
      ranges([{ y: 1200, h: 220, col: k > 0.5 ? '#C8864A' : '#5A2E4A', seed: 181, haze: 0.4 }], lt * 20, '#FFE0A0'); ground(k > 0.5 ? '#8A5A2A' : '#2A1222', 1480);
      if (k < 1) { ctx.save(); ctx.globalAlpha = 1 - k; jhopdi(540, 1480, 1.2, '#5A3A22', '#8A6A3A'); ctx.restore(); }
      if (k > 0) { ctx.save(); ctx.globalAlpha = k; mahal(540, 1480 + 200 * (1 - k), 0.9, t, '#F6D88A', '#E0A04A', 1); ctx.restore(); motes(t, 60 * (1 - k) + 20, [200, 700, 700, 800], '#FFE6A0', 0.9, 120, 182, 6); }
      sudama(540, 1560, 0.55, t, 'stand', 1);
      slipAt(lt, jh, 'झोपड़ी?', 260, 420, 56, -0.04); ribbonAt(lt, sn, 'सोने का महल', 540, 300, 100);
      ring(lt, sn, 540, 1100, '#FFF2C8', 1, 800); flash(lt, sn, '#FFFBEA', 0.5, 0.6);
      vignette(0.45);
    } });
    cue(cut_(18) + dk, 'heartbeat', { gain: 0.4 }); cue(cut_(18) + sn, 'drum', { gain: 0.8 }); cue(cut_(18) + sn + 0.05, 'bell', { gain: 0.7 }); cue(cut_(18) + sn + 0.1, 'sparkle', { gain: 0.6 }); }

  // 19 · even today true friendship's name is Krishna-Sudama
  { const sc = W_('सच्ची', 19), ks = W_('कृष्ण-सुदामा', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 980], zoom: 0.1, note: 'friendship sunset: Krishna and Sudama side by side on a hill by the sea, big sun behind; ribbon कृष्ण-सुदामा', draw(lt, d, t) {
      gradSky(SUNSET); glow(540, 1000, 460, '#FFC060', 0.6); circle(540, 1020, 260, '#FFD890');
      sea(t, 1200, 0.85); birds(t, 160, 520, 5, '#3A0E1E', 1.1);
      ranges([{ y: 1360, h: 180, col: '#4A1424', seed: 191 }], lt * 22, '#FFC060');
      cut(P_poly([[-100, 1920], [-100, 1520], [300, 1440], [800, 1440], [1180, 1520], [1180, 1920]]), '#2A0A16', { shadow: 0.6, edge: 3 });
      sudama(420, 1540, 0.95, t, 'stand', 1); krishna(670, 1540, { s: 0.95, t, pose: 'flute', aura: 0.5 });
      slipAt(lt, sc, 'सच्ची दोस्ती', 540, 300, 60); ribbonAt(lt, ks, 'कृष्ण-सुदामा', 540, 470, 100);
      petals(t, 16, 192); vignette(0.45);
    } });
    cue(cut_(19) + sc, 'bell', { gain: 0.5 }); cue(cut_(19) + ks, 'conch', { dur: 1.8, gain: 0.5 }); }

  // 20 · loop: in one more handful, Krishna would have given away everything
  { const mt = W_('मुट्ठी', 20), sb = W_('सब', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 880], zoom: 0.14, note: 'hook echo: Dwarka night gold, Rukmini (left) and Krishna (right) with the raised handful blazing; ribbon सब कुछ', draw(lt, d, t) {
      gradSky(NIGHTG); stars(t, 90, -200, 800, 201, 0.6); godRays(540, 700, 0, TAU, 30, 1500, '#FFE6A0', 0.15, t);
      ctx.save(); ctx.globalAlpha = 0.5; mahal(540 - lt * 10, 1380, 0.8, t, '#3A2238', '#2A1628', 0.4); ctx.restore();
      mist(1300, 260, '#6A3A5A', 0.35, t); ground('#12060E', 1500);
      rukmini(300, 1540, 900, t, 'namaste', 1, 0.5);
      const tip = krishna(700, 1540, { s: 1.0, t, pose: 'lift', aura: 0.7 });
      grains(tip[0], tip[1] + 20, 50, 20, t, 1 + 0.5 * seg(lt, mt, mt + 0.4), 5);
      ribbonAt(lt, sb, 'सब कुछ', 540, 300, 110); ring(lt, sb, tip[0], tip[1], '#FFE6A0', 0.9, 700); flash(lt, sb, '#FFF6D8', 0.35, 0.5);
      motes(t, 40, [0, 200, W, 1400], '#FFD890', 0.8, 50, 202, 4); vignette(0.5);
    } });
    cue(cut_(20) + mt, 'sparkle', { gain: 0.5 }); cue(cut_(20) + sb, 'drum', { gain: 0.8 }); cue(cut_(20) + sb + 0.05, 'bell', { gain: 0.6 }); }

  // 21-22 · end card
  { const st = cut_(21), f = Wd('फ़ॉलो', 22) - st;
    add({ id: 'S22', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: Dwarka palace silhouette by the sea at night with diyas, Untold Stories in gold', draw(lt, d, t) {
      gradSky(SEAG); stars(t, 120, -200, 900, 211, 0.6);
      ctx.save(); ctx.globalAlpha = 0.6; mahal(540, 1400, 0.6, t, '#3A2A2A', '#2A1A1A', 0.3); ctx.restore(); sea(t, 1400, 0.8);
      for (let i = 0; i < 8; i++) diya(90 + i * 130, 1500, 0.55, t, i + 3);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 560, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 710, 80, '#FFE6C8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 860, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
