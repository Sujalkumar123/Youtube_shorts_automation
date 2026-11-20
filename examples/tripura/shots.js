// एक बाण, तीन शहर: Tripurari and Dev Deepawali, in cinematic cut paper.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, rr, circle, ell, line } from './core/lib.js';
import { L, Le, Wd, T } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, cloud, motes, water, diya, skyline, palm, birds, luminous, partial, vignette } from './atmos.js';
import { raja, warrior, kapila, shiva, horse } from './cast.js';
const { P, cut, P_rr, P_poly, P_circ } = K;

const METAL = { gold: ['#E8B13E', '#B0801E', '#FFE7A0'], silver: ['#C9CED8', '#8E95A3', '#FFFFFF'], iron: ['#5F6575', '#3A3F4C', '#9FB3D8'] };
const COSMIC = [[0, '#05071A'], [0.4, '#121B4A'], [0.75, '#2B2A66'], [1, '#463470']];
const DARK = [[0, '#0A0610'], [0.5, '#2A0E1E'], [1, '#5A1E24']];
const NIGHT = [[0, '#070A1C'], [0.45, '#141C46'], [0.8, '#2C2A5E'], [1, '#4A3466']];

function cosmos(t, seed = 3) { gradSky(COSMIC); glow(260, 420, 600, '#7B5BD6', 0.22); glow(860, 900, 700, '#3E7BD6', 0.18); glow(540, 1400, 800, '#D67B9E', 0.12); stars(t, 170, -200, 1700, seed); paperGrain(0.05, seed); }
function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }

/** a flying city: an inverted rock island with walls, towers and domes in one metal. s = scale, glowA = aura */
function city(x, y, s, metal, t = 0, o = {}) {
  const [c, d, h] = METAL[metal]; const bob = Math.sin(t * 1.3 + x * 0.01) * 10;
  ctx.save(); ctx.translate(x, y + bob); ctx.scale(s, s);
  if (o.glow !== 0) glow(0, -40, 260, h, 0.25 * (o.glow ?? 1));
  if (o.shield) { ctx.save(); ctx.globalAlpha = o.shield; ctx.strokeStyle = rgba(h, 0.8); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, -60, 230, 170, 0, Math.PI, TAU); ctx.stroke(); glow(0, -60, 230, h, 0.18 * o.shield); ctx.restore(); }
  // rock underside
  cut(() => { ctx.beginPath(); ctx.moveTo(-180, 0); ctx.lineTo(180, 0); ctx.lineTo(120, 60); ctx.lineTo(70, 150); ctx.lineTo(20, 120); ctx.lineTo(0, 210); ctx.lineTo(-30, 130); ctx.lineTo(-90, 160); ctx.lineTo(-130, 60); ctx.closePath(); }, '#4A3A44', { shadow: 0.8, edge: 4 });
  // walls with crenellations
  cut(() => { ctx.beginPath(); ctx.moveTo(-170, 0); ctx.lineTo(-170, -70); for (let i = 0; i <= 14; i++) { const xx = -170 + i * 340 / 14; ctx.lineTo(xx, i % 2 ? -70 : -86); } ctx.lineTo(170, -70); ctx.lineTo(170, 0); ctx.closePath(); }, c, { shadow: 0.5, edge: 4 });
  // towers + domes
  for (const [tx, th, tw] of [[-120, 120, 46], [-50, 170, 56], [30, 210, 66], [110, 140, 50]]) {
    cut(P_rr(tx - tw / 2, -70 - th, tw, th, 4), c, { shadow: 0.4, edge: 3 });
    cut(() => { ctx.beginPath(); ctx.moveTo(tx - tw / 2 - 6, -70 - th); ctx.quadraticCurveTo(tx - tw / 2, -70 - th - tw * 0.9, tx, -70 - th - tw * 1.2); ctx.quadraticCurveTo(tx + tw / 2, -70 - th - tw * 0.9, tx + tw / 2 + 6, -70 - th); ctx.closePath(); }, d, { shadow: 0.3, edge: 3 });
    for (let k = 0; k < 2; k++) { ctx.fillStyle = rgba('#FFD07A', 0.85); ctx.fillRect(tx - 6, -70 - th + 24 + k * 40, 12, 18); }
  }
  ctx.strokeStyle = rgba(d, 0.8); ctx.lineWidth = 3; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(-160 + i * 60, -30); ctx.lineTo(-140 + i * 60, -30); ctx.stroke(); }
  ctx.restore();
}
/** Brahma: three visible faces, white beards, crowns, red-gold robe, seated on a lotus */
function brahma(x, y, s, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  glow(0, -560, 520, A.paleGold, 0.35);
  ctx.strokeStyle = rgba(A.gold, 0.8); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -590, 230, 0, TAU); ctx.stroke();
  // lotus
  for (let i = 0; i < 9; i++) { const a = Math.PI + (i + 0.5) / 9 * Math.PI; cut(() => { ctx.beginPath(); ctx.ellipse(Math.cos(a) * 170, -10 + Math.sin(a) * 40, 70, 30, a + Math.PI / 2, 0, TAU); }, i % 2 ? '#E99AAE' : '#F2B8C6', { shadow: 0.4, edge: 3 }); }
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 230, 46, 0, 0, TAU); }, '#D97A94', { shadow: 0.6, edge: 4 });
  // body
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -60, 190, 60, 0, 0, TAU); }, '#C0392B');
  cut(() => { ctx.beginPath(); ctx.moveTo(-110, -380); ctx.quadraticCurveTo(-160, -220, -130, -80); ctx.lineTo(130, -80); ctx.quadraticCurveTo(160, -220, 110, -380); ctx.closePath(); }, '#D2552E');
  cut(P_poly([[-110, -380], [-50, -390], [100, -100], [40, -90]]), '#E8B13E', { shadow: 0.3, edge: 3 });
  // four arms: book, kamandalu, rosary, lotus (two raised behind)
  const arm = (sx, a1, a2, item) => { const ex = sx + Math.sin(a1) * 120, ey = -350 + Math.cos(a1) * 120, hx = ex + Math.sin(a2) * 110, hy = ey + Math.cos(a2) * 110; ctx.strokeStyle = '#E3A574'; ctx.lineCap = 'round'; ctx.lineWidth = 44; ctx.beginPath(); ctx.moveTo(sx, -350); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke(); ctx.strokeStyle = '#E8B13E'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(lerp(sx, ex, 0.35) - 0.1, lerp(-350, ey, 0.35)); ctx.lineTo(lerp(sx, ex, 0.38), lerp(-350, ey, 0.38)); ctx.stroke(); item(hx, hy); };
  arm(-110, -2.4, -3.0, (hx, hy) => cut(P_rr(hx - 34, hy - 50, 68, 44, 6), '#F7EFDC', { shadow: 0.3, edge: 3 }));
  arm(110, 2.4, 3.0, (hx, hy) => { for (let i = 0; i < 6; i++) cut(() => { ctx.beginPath(); ctx.ellipse(hx + Math.cos(i) * 24, hy - 30 + Math.sin(i) * 24, 22, 10, i, 0, TAU); }, '#F2B8C6', { shadow: 0.2, edge: 2 }); });
  arm(-110, -0.5, 0.6, (hx, hy) => cut(() => { ctx.beginPath(); ctx.ellipse(hx, hy + 10, 30, 34, 0, 0, TAU); }, '#B07A22', { shadow: 0.3, edge: 3 }));
  arm(110, 0.5, -0.6, (hx, hy) => { for (let i = 0; i < 8; i++) circle(hx + Math.cos(i / 8 * TAU) * 22, hy + 10 + Math.sin(i / 8 * TAU) * 22, 6, '#7A3E22'); });
  // three faces
  for (const [fx, fs, side] of [[-120, 0.82, -1], [120, 0.82, 1], [0, 1, 0]]) {
    ctx.save(); ctx.translate(fx, -470 + (side ? 30 : 0)); ctx.scale(fs, fs);
    cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 62, 74, 0, 0, TAU); }, '#E3A574');
    cut(() => { ctx.beginPath(); ctx.moveTo(-54, 10); ctx.quadraticCurveTo(-60, 110, 0, 150); ctx.quadraticCurveTo(60, 110, 54, 10); ctx.quadraticCurveTo(0, 40, -54, 10); ctx.closePath(); }, '#F2EEE6', { shadow: 0.3, edge: 3 });
    ctx.strokeStyle = '#2A1C14'; ctx.lineWidth = 5; for (const k of [-1, 1]) { ctx.beginPath(); ctx.arc(k * 22, -10, 11, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    ctx.fillStyle = '#C0392B'; ctx.fillRect(-3, -48, 6, 22);
    cut(() => { ctx.beginPath(); ctx.moveTo(-60, -50); ctx.lineTo(-70, -120); ctx.lineTo(-30, -100); ctx.lineTo(0, -160); ctx.lineTo(30, -100); ctx.lineTo(70, -120); ctx.lineTo(60, -50); ctx.closePath(); }, '#E8B13E', { shadow: 0.4, edge: 3 });
    ctx.restore();
  }
  ctx.restore();
}
/** Maya the asura architect: a raja in violet with small horns and a glowing blueprint */
function maya(x, y, h, t) {
  raja({ x, y, h, pose: 'decree', t, robe: '#4A3466', sash: '#7A2E3A', eyes: 1 });
  const s = h / 1150; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 1]) cut(() => { ctx.beginPath(); ctx.moveTo(k * 70, -1000); ctx.quadraticCurveTo(k * 130, -1060, k * 120, -1130); ctx.quadraticCurveTo(k * 100, -1060, k * 50, -1010); ctx.closePath(); }, '#2A1C14', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** blueprint of the three cities: glowing cyan lines */
function blueprint(x, y, s, p, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, 0, 340, '#7FD8FF', 0.3 * p);
  ctx.globalAlpha = p; ctx.strokeStyle = '#9FE3F0'; ctx.lineWidth = 4; ctx.setLineDash([12, 10]);
  for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(0, 0, 90 + i * 70, 40 + i * 30, 0, 0, TAU); ctx.stroke(); }
  ctx.setLineDash([]); for (let i = 0; i < 3; i++) { const a = t * (0.6 + i * 0.3) + i * 2; const cx = Math.cos(a) * (90 + i * 70), cy = Math.sin(a) * (40 + i * 30); ctx.strokeRect(cx - 22, cy - 22, 44, 44); ctx.beginPath(); ctx.moveTo(cx - 22, cy - 22); ctx.lineTo(cx, cy - 44); ctx.lineTo(cx + 22, cy - 22); ctx.stroke(); }
  ctx.restore();
}
/** the arrow that is Vishnu: luminous shaft, Agni flame tip, Vayu feathers, chakra + conch emblem */
function vishnuArrow(x, y, len, ang, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(ang);
  glow(0, 0, len * 0.7, '#7FB2FF', 0.5);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = '#9FD0FF'; ctx.shadowBlur = 40; ctx.strokeStyle = 'rgba(160,210,255,0.7)'; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(-len / 2, 0); ctx.lineTo(len / 2, 0); ctx.stroke(); ctx.restore();
  cut(P_rr(-len / 2, -9, len, 18, 9), '#3D5AA8', { shadow: 0.5, edge: 4 });
  for (const k of [-1, 1]) cut(P_poly([[-len / 2, 0], [-len / 2 - 70, k * 50], [-len / 2 - 40, 0]]), '#E9E4F2', { shadow: 0.3, edge: 3 });
  cut(P_poly([[len / 2 - 10, -34], [len / 2 + 80, 0], [len / 2 - 10, 34]]), '#E0782E', { shadow: 0.4, edge: 3 });
  glow(len / 2 + 40, 0, 120, '#FF8A3D', 0.7 + 0.2 * Math.sin(t * 12));
  // sudarshan chakra emblem
  ctx.save(); ctx.translate(-len * 0.05, 0); ctx.rotate(t * 3); cut(P_circ(0, 0, 40), '#E8B13E', { shadow: 0.3, edge: 3 }); ctx.strokeStyle = '#B07A22'; ctx.lineWidth = 4; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i / 8 * TAU) * 36, Math.sin(i / 8 * TAU) * 36); ctx.stroke(); } circle(0, 0, 10, '#B07A22'); ctx.restore();
  ctx.restore();
}
/** Mount Meru as a bow, Vasuki as the string. drawn: 0..1 pulls the string */
function meruBow(x, y, s, drawn, t, vasuki = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const bow = () => { ctx.beginPath(); ctx.moveTo(-40, -520); ctx.quadraticCurveTo(-330, 0, -40, 520); ctx.lineTo(10, 500); ctx.quadraticCurveTo(-250, 0, 10, -500); ctx.closePath(); };
  cut(bow, '#8E93B5', { shadow: 0.8, edge: 5 });
  ctx.save(); bow(); ctx.clip(); for (let i = 0; i < 9; i++) cut(P_poly([[-300 + i * 30, -470 + i * 110], [-220 + i * 30, -540 + i * 110], [-140 + i * 30, -470 + i * 110]]), '#F7F3EA', { shadow: 0, edge: 0 }); ctx.restore();
  const px = -15 + drawn * 230;
  if (vasuki > 0) { ctx.save(); ctx.globalAlpha = vasuki; ctx.strokeStyle = '#4F7A3A'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-15, -510); ctx.quadraticCurveTo(px + 20 * Math.sin(t * 3), -250, px, 0); ctx.quadraticCurveTo(px + 20 * Math.sin(t * 3 + 1), 250, -15, 510); ctx.stroke(); ctx.strokeStyle = '#7FA65A'; ctx.lineWidth = 6; ctx.setLineDash([14, 18]); ctx.stroke(); ctx.setLineDash([]);
    cut(() => { ctx.beginPath(); ctx.ellipse(-20, -540, 40, 30, -0.4, 0, TAU); }, '#4F7A3A', { shadow: 0.3, edge: 3 }); circle(-30, -548, 5, '#F2C14E'); ctx.restore(); }
  ctx.restore();
}
/** the cosmic chariot: Earth as body, Sun and Moon as wheels. parts: body, wheels, driver */
function chariot(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const b = o.body ?? 1, w = o.wheels ?? 1;
  if (b > 0) { ctx.save(); ctx.globalAlpha = b; ctx.translate(0, (1 - b) * 200);
    cut(() => { ctx.beginPath(); ctx.arc(0, -40, 300, Math.PI * 0.05, Math.PI * 0.95); ctx.closePath(); }, '#3E7BB8', { shadow: 0.9, edge: 6 });
    ctx.save(); ctx.beginPath(); ctx.arc(0, -40, 300, Math.PI * 0.05, Math.PI * 0.95); ctx.closePath(); ctx.clip();
    for (const [cx, cy, rx, ry] of [[-120, 60, 90, 50], [60, 120, 110, 60], [170, 20, 60, 70], [-40, 200, 70, 40]]) cut(() => { ctx.beginPath(); ctx.ellipse(cx + Math.sin(t * 0.3) * 20, cy, rx, ry, 0.3, 0, TAU); }, '#6E9A4A', { shadow: 0.2, edge: 2 });
    ctx.restore();
    cut(P_rr(-320, -60, 640, 34, 14), '#E8B13E', { shadow: 0.4, edge: 3 });
    ctx.restore(); }
  if (w > 0) { for (const [k, sun] of [[-1, true], [1, false]]) { const wx = k * 250, wy = 210, r = 120 * eob(clamp(w)); if (r <= 0) continue; ctx.save(); ctx.translate(wx, wy); ctx.rotate(t * 1.5);
      if (sun) { glow(0, 0, r * 2.2, '#FFB45A', 0.6); cut(P_circ(0, 0, r), '#F2C14E', { shadow: 0.5, edge: 5 }); ctx.strokeStyle = '#E0782E'; ctx.lineWidth = 8; for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(Math.cos(i / 12 * TAU) * r * 0.3, Math.sin(i / 12 * TAU) * r * 0.3); ctx.lineTo(Math.cos(i / 12 * TAU) * r * 0.9, Math.sin(i / 12 * TAU) * r * 0.9); ctx.stroke(); } }
      else { glow(0, 0, r * 2, '#DDE8FF', 0.5); cut(P_circ(0, 0, r), '#E9EEF6', { shadow: 0.5, edge: 5 }); for (const [cx, cy, cr] of [[-30, -20, 22], [35, 25, 16], [10, -50, 10]]) circle(cx, cy, cr, '#C9D3E2'); ctx.strokeStyle = '#B9C4D6'; ctx.lineWidth = 6; for (let i = 0; i < 8; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i / 8 * TAU) * r * 0.85, Math.sin(i / 8 * TAU) * r * 0.85); ctx.stroke(); } }
      ctx.restore(); } }
  ctx.restore();
}
function kashi(t, moon = 1) {
  gradSky(NIGHT); stars(t, 120, -200, 900, 5);
  if (moon > 0) { glow(780, 380, 400, '#FFF4D6', 0.45 * moon); cut(P_circ(780, 380, 110 * moon), '#FFF6E0', { shadow: 0, edge: 0 }); }
  skyline(1040, '#221A3A', 0.8, 540);
  for (let i = 0; i < 6; i++) cut(P_rr(-300, 1040 + i * 34, W + 600, 36, 0), i % 2 ? '#3A2E4E' : '#43365A', { shadow: 0.3, edge: 2 });
  water(t, 1250, ['#2C3E6E', '#1E2C54'], '#FFE7B0', 0.5);
}
function devas(n, t, a, y0 = 300) { for (let i = 0; i < n; i++) { const x = 100 + (i * 157) % 900, y = y0 + (i % 3) * 120 + Math.sin(t + i) * 14; ctx.save(); ctx.globalAlpha = a; glow(x, y, 80, A.paleGold, 0.6); raja({ x, y: y + 90, h: 150, pose: 'stand', t, robe: '#F0E2C4', sash: '#E8B13E', eyes: 0 }); ctx.restore(); } }
function align3(t, p, o = {}) { // three cities move from scattered to a vertical line at x=760
  const pos = [[760, 260, 'gold'], [760, 640, 'silver'], [760, 1020, 'iron']], from = [[300, 300], [880, 700], [380, 1080]];
  pos.forEach(([x, y, m], i) => city(lerp(from[i][0], x, eio(p)), lerp(from[i][1], y, eio(p)), 0.75, m, t, { glow: o.glow ?? 1 }));
  if (p > 0.98) { ctx.save(); ctx.strokeStyle = rgba('#A8322D', 0.8); ctx.lineWidth = 6; ctx.setLineDash([20, 16]); ctx.beginPath(); ctx.moveTo(760, 60); ctx.lineTo(760, 1240); ctx.stroke(); ctx.restore(); }
}

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · three cities flew in the sky
  add({ id: 'S01', at: 0, cam: [540, 860], zoom: 0.12, note: 'cosmic sky: three flying cities rise into view', draw(lt, d, t) {
    cosmos(t); godRays(540, -200, Math.PI * 0.3, Math.PI * 0.7, 9, 1900, A.paleGold, 0.14, t);
    const p = eo(seg(lt, 0, 1.6));
    city(300, lerp(1500, 420, p), 0.8, 'gold', t); city(780, lerp(1700, 760, eo(seg(lt, 0.3, 1.9))), 0.8, 'silver', t); city(360, lerp(1900, 1130, eo(seg(lt, 0.6, 2.2))), 0.8, 'iron', t);
    motes(t, 40, [0, 0, W, 1500], '#DFF6FF', 0.6, 30, 2, 3); vignette(0.6);
  } });
  cue(0, 'bell', { gain: 0.8 }); cue(0.1, 'swell', { dur: 2.2, gain: 0.5 });

  // 1 · gold, silver, iron
  { const st = cut_(1), g = W_('सोने', 1), s = W_('चाँदी', 1), l = W_('लोहे', 1);
    add({ id: 'S02', at: st, cam: [540, 860], zoom: 0.06, note: 'each city glows in turn with its slip: सोना / चाँदी / लोहा', draw(lt, d, t) {
      cosmos(t, 4);
      const on = (k) => eo(seg(lt, k, k + 0.3));
      city(300, 420, 0.8, 'gold', t, { glow: 0.4 + on(g) * 1.6 }); city(780, 760, 0.8, 'silver', t, { glow: 0.4 + on(s) * 1.6 }); city(360, 1130, 0.8, 'iron', t, { glow: 0.4 + on(l) * 1.6 });
      if (lt > g) K.slip('सोना', 300, 160, eob(seg(lt, g, g + 0.3)), -0.03, 56); if (lt > s) K.slip('चाँदी', 780, 500, eob(seg(lt, s, s + 0.3)), 0.03, 56); if (lt > l) K.slip('लोहा', 360, 880, eob(seg(lt, l, l + 0.3)), -0.03, 56);
      vignette(0.55);
    } });
    cue(st + g, 'bell', { gain: 0.4 }); cue(st + s, 'bell', { gain: 0.35 }); cue(st + l, 'drum', { gain: 0.5 }); }

  // 2 · Maya the architect
  { const st = cut_(2), m = W_('मय', 2);
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'Maya, the asura architect, raises a glowing blueprint', draw(lt, d, t) {
      gradSky([[0, '#120E24'], [0.6, '#2A1E4A'], [1, '#4A3466']]); stars(t, 60, -200, 800, 7); paperGrain(0.05, 7);
      blueprint(700, 560, 1.3, eo(seg(lt, 0.1, 0.7)), t);
      cut(P_rr(-300, 1480, W + 600, 600, 0), '#1E1730', { shadow: 0, edge: 0 });
      maya(330, 1530, 1000, t);
      if (lt > m - 0.1) K.slip('मय दानव', 330, 300, eob(seg(lt, m - 0.1, m + 0.2)), -0.03, 56);
      motes(t, 30, [400, 200, W, 1000], '#9FE3F0', 0.7, 20, 4, 3); vignette(0.55);
    } });
    cue(st, 'whoosh'); cue(st + 0.2, 'sparkle', { dur: 1.2, gain: 0.5 }); }

  // 3 · Tarakasura's three sons
  { const st = cut_(3);
    add({ id: 'S04', at: st, cam: [540, 950], zoom: 0.08, note: 'three asura brothers in silhouette under their cities', draw(lt, d, t) {
      gradSky(DARK); stars(t, 60, -200, 700, 9);
      [['gold', 220], ['silver', 540], ['iron', 860]].forEach(([m, x], i) => { const p = eob(seg(lt, 0.1 + i * 0.25, 0.5 + i * 0.25)); if (p <= 0) return; city(x, 380, 0.42, m, t); glow(x, 1100, 300, METAL[m][2], 0.25 * p); warrior(x, 1480, 700 * p, '#120A14', METAL[m][0], t, i); });
      ['तारकाक्ष', 'कमलाक्ष', 'विद्युन्माली'].forEach((n, i) => { const p = eob(seg(lt, 0.3 + i * 0.25, 0.6 + i * 0.25)); if (p > 0) K.slip(n, [220, 540, 860][i], 640, p * 0.8, i % 2 ? 0.03 : -0.03, 40); });
      vignette(0.6);
    } });
    cue(st, 'drum', { gain: 0.6 }); cue(st + 0.35, 'drum', { gain: 0.4 }); cue(st + 0.6, 'drum', { gain: 0.4 }); }

  // 4 · Brahma's strange boon
  { const st = cut_(4), v = W_('वरदान', 4);
    add({ id: 'S05', at: st, cam: [540, 900], zoom: 0.08, note: 'Brahma on his lotus; a glowing boon scroll unrolls', draw(lt, d, t) {
      cosmos(t, 11); godRays(540, 300, 0, TAU, 20, 1200, A.paleGold, 0.18, t);
      brahma(540, 1480, 1.25, t);
      if (lt > v - 0.2) { const p = eo(seg(lt, v - 0.2, v + 0.4)); ctx.save(); ctx.translate(540, 300); glow(0, 0, 300, A.gold, 0.4 * p); cut(P_rr(-260 * p, -60, 520 * p, 120, 10), '#F3E9D2', { shadow: 0.6, edge: 0 }); if (p > 0.8) bigText('वरदान', 0, 6, 70, '#7A2E3A'); ctx.restore(); }
      vignette(0.5);
    } });
    cue(st, 'conch', { dur: 1.8, gain: 0.6 }); cue(st + v, 'bell', { gain: 0.7 }); }

  // 5 · these cities can only be destroyed...
  { const st = cut_(5);
    add({ id: 'S06', at: st, cam: [540, 820], zoom: 0.06, note: 'the cities under shimmering shields: untouchable', draw(lt, d, t) {
      cosmos(t, 12);
      const sh = 0.6 + 0.4 * Math.sin(t * 4);
      city(300, 420, 0.8, 'gold', t, { shield: sh }); city(780, 760, 0.8, 'silver', t, { shield: sh }); city(360, 1130, 0.8, 'iron', t, { shield: sh });
      vignette(0.55);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); }

  // 6 · once in a thousand years, aligned
  { const st = cut_(6), e = W_('एक', 6), sd = W_('सीध', 6);
    add({ id: 'S07', at: st, cam: [540, 760], zoom: 0.05, note: 'orbit diagram: 1000-year cycle, the cities line up on सीध', draw(lt, d, t) {
      K.parchment(13); ctx.fillStyle = 'rgba(20,14,40,0.55)'; ctx.fillRect(-400, -400, W + 800, H + 800);
      ctx.strokeStyle = rgba('#E8DCC0', 0.6); ctx.lineWidth = 3; ctx.setLineDash([10, 10]); for (const r of [180, 330, 480]) { ctx.beginPath(); ctx.arc(540, 760, r, 0, TAU); ctx.stroke(); } ctx.setLineDash([]);
      circle(540, 760, 30, '#E8B13E');
      const al = eio(seg(lt, sd - 0.6, sd + 0.2));
      [[180, 'iron', 2.2], [330, 'silver', 4.1], [480, 'gold', 0.9]].forEach(([r, m, a0]) => { const a = lerp(a0 + t * 0.5 * (600 / r), -Math.PI / 2, al); city(540 + Math.cos(a) * r, 760 + Math.sin(a) * r + 40, 0.28, m, t); });
      if (al > 0.95) { ctx.save(); ctx.strokeStyle = '#A8322D'; ctx.lineWidth = 8; ctx.setLineDash([22, 16]); ctx.beginPath(); ctx.moveTo(540, 760); ctx.lineTo(540, 160); ctx.stroke(); ctx.restore(); }
      if (lt > e - 0.1) K.ribbon('1000 वर्ष', 540, 1330, eob(seg(lt, e - 0.1, e + 0.3)), 80);
    } });
    cue(st, 'tock', { gain: 0.4 }); cue(st + 0.5, 'tock', { gain: 0.4 }); cue(st + sd, 'slam', { gain: 0.5 }); }

  // 7 · with a single arrow
  { const st = cut_(7), b = W_('बाण', 7);
    add({ id: 'S08', at: st, cam: [540, 760], zoom: 0.08, note: 'aligned cities; a single arrow streaks through the line', draw(lt, d, t) {
      cosmos(t, 14); align3(t, 1, { glow: 0.6 });
      const p = eio(seg(lt, b - 0.3, b + 0.5)); if (p > 0) { const x = lerp(-300, 1500, p), y = lerp(1300, 200, p); vishnuArrow(x, y, 300, Math.atan2(-1100, 1800), t, 0.9); }
      K.slip('एक ही बाण', 300, 1380, eob(seg(lt, 0.1, 0.4)), -0.03, 56);
      vignette(0.55);
    } });
    cue(st + b - 0.2, 'whoosh', { gain: 0.8 }); }

  // 8 · tyranny grew
  { const st = cut_(8);
    add({ id: 'S09', at: st, cam: [540, 900], zoom: 0.08, note: 'blood-red sky; the cities cast dark shadows; village lamps go out', draw(lt, d, t) {
      gradSky(DARK); glow(540, 400, 700, '#A8322D', 0.3);
      city(270, 330, 0.6, 'gold', t, { glow: 0.3 }); city(800, 520, 0.6, 'silver', t, { glow: 0.3 }); city(400, 760, 0.6, 'iron', t, { glow: 0.3 });
      ranges([{ y: 1300, h: 220, col: '#2A1420', seed: 3.3 }, { y: 1480, h: 140, col: '#1E0E16', seed: 6.6 }], 0, '#5A1E24');
      for (let i = 0; i < 12; i++) { const off = seg(lt, 0.2 + i * 0.1, 0.4 + i * 0.1); glow(80 + i * 85, 1400 - (i % 3) * 30, 40, '#FFB45A', 0.7 * (1 - off)); }
      motes(t, 40, [0, 300, W, 1500], '#FF7A2E', 0.5, 80, 6, 3); vignette(0.65);
    } });
    cue(st, 'swell', { dur: 1.6, gain: 0.5 }); cue(st + 0.2, 'drum', { gain: 0.6 }); }

  // 9 · the gods go to Mahadev
  { const st = cut_(9), m = W_('महादेव', 9);
    add({ id: 'S10', at: st, cam: [540, 1000], zoom: 0.07, note: 'gods approach Shiva on Kailash at night', draw(lt, d, t) {
      gradSky(NIGHT); stars(t, 120, -200, 1000, 6); glow(540, 400, 700, '#8FB4FF', 0.2);
      ranges([{ y: 1120, h: 560, col: '#3A4470', seed: 2.2, snow: 0.9, rough: 0.7 }, { y: 1330, h: 380, col: '#2A3258', seed: 4.4, snow: 0.6, haze: 0.25 }, { y: 1490, h: 200, col: '#1C2244', seed: 6.6, haze: 0.2 }], -lt * 20, '#8FA0D0');
      shiva(700, 1500, { s: 0.8, t, aura: eo(seg(lt, m - 0.3, m + 0.4)) });
      for (let i = 0; i < 4; i++) { const x = lerp(-100, 120 + i * 85, eo(seg(lt, 0, 1.2))); glow(x, 1330, 70, A.paleGold, 0.5); raja({ x, y: 1500, h: 300, pose: 'stand', t, robe: '#F0E2C4', sash: '#E8B13E', eyes: 0 }); }
      vignette(0.55);
    } });
    cue(st, 'whoosh'); cue(st + m, 'conch', { dur: 1.6, gain: 0.6 }); cue(st + m, 'damru', { dur: 0.8, gain: 0.4 }); }

  // 10 · such a chariot as never was
  { const st = cut_(10);
    add({ id: 'S11', at: st, cam: [540, 900], zoom: 0.1, note: 'god rays burst; a chariot silhouette forms in light', draw(lt, d, t) {
      cosmos(t, 15); godRays(540, 760, 0, TAU, 28, 1400, A.gold, 0.35 * eo(seg(lt, 0, 0.8)), t);
      ctx.save(); ctx.globalAlpha = 0.5 + 0.3 * Math.sin(t * 3); chariot(540, 900, 1.1, t, { body: eo(seg(lt, 0.2, 1.2)), wheels: eo(seg(lt, 0.8, 1.8)) }); ctx.restore();
      motes(t, 50, [0, 300, W, 1400], A.gold, 0.7, 60, 8, 4); vignette(0.5);
    } });
    cue(st, 'swell', { dur: 1.5, gain: 0.7 }); cue(st + 1.4, 'bell', { gain: 0.6 }); }

  // 11 · Earth became the chariot
  { const st = cut_(11);
    add({ id: 'S12', at: st, cam: [540, 900], zoom: 0.08, note: 'Earth itself rises to form the chariot body', draw(lt, d, t) {
      cosmos(t, 16); chariot(540, 960, 1.25, t, { body: eob(seg(lt, 0.05, 0.6)), wheels: 0 });
      K.slip('पृथ्वी', 540, 420, eob(seg(lt, 0.2, 0.5)), -0.03, 60); vignette(0.5);
    } });
    cue(st, 'thud', { gain: 0.7 }); }

  // 12 · Sun and Moon its wheels
  { const st = cut_(12), su = W_('सूरज', 12), ch = W_('चाँद', 12);
    add({ id: 'S13', at: st, cam: [540, 980], zoom: 0.08, note: 'the Sun and Moon roll in as wheels', draw(lt, d, t) {
      cosmos(t, 17); chariot(540, 960, 1.25, t, { body: 1, wheels: eob(seg(lt, su, su + 0.5)) });
      if (lt > su) K.slip('सूर्य', 230, 1450, eob(seg(lt, su, su + 0.3)), -0.03, 52); if (lt > ch) K.slip('चंद्र', 850, 1450, eob(seg(lt, ch, ch + 0.3)), 0.03, 52);
      vignette(0.5);
    } });
    cue(st + su, 'bell', { gain: 0.5 }); cue(st + ch, 'sparkle', { dur: 1, gain: 0.5 }); }

  // 13 · Brahma the charioteer
  { const st = cut_(13);
    add({ id: 'S14', at: st, cam: [540, 900], zoom: 0.1, note: 'Brahma takes the reins on the cosmic chariot', draw(lt, d, t) {
      cosmos(t, 18); chariot(540, 1150, 1.0, t);
      brahma(330, 900, 0.62, t);
      ctx.strokeStyle = '#E8B13E'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(400, 700); ctx.quadraticCurveTo(250, 660, 60, 760 + Math.sin(t * 4) * 10); ctx.stroke();
      K.slip('सारथी ब्रह्मा', 640, 330, eob(seg(lt, 0.2, 0.5)), 0.03, 52); vignette(0.5);
    } });
    cue(st, 'whoosh', { gain: 0.6 }); }

  // 14 · Meru the bow, Vasuki the string
  { const st = cut_(14), v = W_('वासुकि', 14);
    add({ id: 'S15', at: st, cam: [540, 900], zoom: 0.08, note: 'Mount Meru bends into a bow; Vasuki becomes its string', draw(lt, d, t) {
      cosmos(t, 19); meruBow(620, 880, 1.2, 0, t, eo(seg(lt, v - 0.2, v + 0.4)));
      K.slip('मेरु पर्वत', 260, 340, eob(seg(lt, 0.1, 0.4)), -0.03, 52); if (lt > v) K.slip('वासुकि नाग', 840, 1420, eob(seg(lt, v, v + 0.3)), 0.03, 52);
      vignette(0.5);
    } });
    cue(st, 'thud'); cue(st + v, 'slide', { dur: 0.8, gain: 0.5 }); }

  // 15 · and the arrow: Vishnu himself
  { const st = cut_(15), vi = W_('विष्णु', 15);
    add({ id: 'S16', at: st, cam: [540, 860], zoom: 0.12, note: 'the arrow appears, glowing blue: Vishnu, chakra on the shaft, Agni at the tip', draw(lt, d, t) {
      cosmos(t, 20); glow(540, 860, 700, '#4E7BD6', 0.25 + 0.25 * eo(seg(lt, vi - 0.3, vi + 0.3)));
      vishnuArrow(540, 860, 700, -0.08, t, eo(seg(lt, 0.1, 0.6)));
      if (lt > vi - 0.1) K.slip('भगवान विष्णु', 540, 520, eob(seg(lt, vi - 0.1, vi + 0.2)), -0.03, 60);
      K.slip('अग्नि', 960, 1040, eob(seg(lt, 0.6, 0.9)), 0.03, 44);
      motes(t, 40, [0, 400, W, 1300], '#9FD0FF', 0.6, 40, 9, 4); vignette(0.5);
    } });
    cue(st + vi, 'bell', { gain: 0.9 }); cue(st + vi, 'conch', { dur: 1.6, gain: 0.5 }); }

  // 16 · as the three cities came into line
  { const st = cut_(16);
    add({ id: 'S17', at: st, cam: [600, 760], zoom: 0.06, note: 'the three cities glide into one line; Pushya star shines', draw(lt, d, t) {
      cosmos(t, 21); align3(t, eio(seg(lt, 0.1, d - 0.2)));
      if (lt > d - 0.4) { glow(760, 60, 120, '#FFFFFF', 0.8); }
      vignette(0.55);
    } });
    cue(st, 'slide', { dur: 1.8, gain: 0.5 }); cue(st + 2.4, 'slam', { gain: 0.5 }); }

  // 17 · Mahadev loosed a single arrow
  { const st = cut_(17), b = W_('बाण', 17);
    add({ id: 'S18', at: st, cam: [540, 900], zoom: 0.06, note: 'Shiva draws the Meru bow on the chariot and looses the arrow', draw(lt, d, t) {
      cosmos(t, 22); align3(t, 1, { glow: 0.6 });
      shiva(230, 1440, { s: 0.5, t, aura: 1 });
      const drawn = lt < b ? eo(seg(lt, 0, b)) : Math.max(0, 1 - (lt - b) * 6);
      meruBow(400, 960, 0.58, drawn, t, 1);
      if (lt < b) vishnuArrow(400 + (-15 + drawn * 230) * 0.58 + 120, 960, 240, 0, t, 0.9);
      if (lt > b - 0.1) { const p = eio(seg(lt, b - 0.1, b + 0.5)); const x0 = 440, y0 = 960, x1 = 1000, y1 = 300; const x = lerp(x0, x1, p), y = lerp(y0, y1, p); vishnuArrow(x, y, 260, Math.atan2(y1 - y0, x1 - x0), t); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(160,210,255,0.6)'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); ctx.restore(); }
      vignette(0.5);
    } });
    cue(st + b - 0.2, 'swell', { dur: 0.6, gain: 0.6 }); cue(st + b, 'whoosh', { gain: 1 }); cue(st + b + 0.4, 'slam'); }

  // 18 · all three turned to ash at once
  { const st = cut_(18), bh = W_('भस्म', 18);
    add({ id: 'S19', at: st, cam: [700, 700], zoom: 0.06, note: 'a white flash: the three cities dissolve into light and sparks', draw(lt, d, t) {
      cosmos(t, 23); const f = eo(seg(lt, 0, 0.4)), dis = eo(seg(lt, 0.2, 1.4));
      ctx.save(); ctx.globalAlpha = 1 - dis; align3(t, 1); ctx.restore();
      glow(760, 640, 900 * f, '#FFF4D6', 0.9 * (1 - dis * 0.6)); glow(760, 640, 400, '#FFB45A', 0.6 * (1 - dis));
      motes(t, 90, [500, 0, 1080, 1300], '#FFD07A', 1 - dis * 0.5, 200, 3, 6);
      ctx.fillStyle = `rgba(255,248,230,${0.5 * (1 - seg(lt, 0, 0.5))})`; ctx.fillRect(-400, -400, W + 800, H + 800);
      if (lt > bh) K.slip('त्रिपुरारी', 540, 1350, eob(seg(lt, bh, bh + 0.3)), -0.03, 64);
    } });
    cue(st, 'slam'); cue(st + 0.05, 'drum'); cue(st + 0.2, 'sizzle', { dur: 1.4, gain: 0.5 }); cue(st + 0.6, 'bell', { gain: 0.8 }); }

  // 19 · that day was Kartik Purnima
  { const st = cut_(19);
    add({ id: 'S20', at: st, cam: [540, 900], zoom: 0.08, note: 'the full moon rises over Kashi’s ghats; ribbon कार्तिक पूर्णिमा', draw(lt, d, t) {
      kashi(t, eo(seg(lt, 0, 1)));
      K.ribbon('कार्तिक पूर्णिमा', 540, 230, eob(seg(lt, 0.2, 0.6)), 80); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.6 }); cue(st + 0.2, 'swell', { dur: 1.5, gain: 0.4 }); }

  // 20 · the gods lit lamps and celebrated
  { const st = cut_(20), dp = W_('दीप', 20);
    add({ id: 'S21', at: st, cam: [540, 1000], zoom: 0.08, note: 'devas descend glowing; diyas light up row by row along the ghats', draw(lt, d, t) {
      kashi(t, 1);
      devas(6, t, eo(seg(lt, 0, 0.8)), 420);
      for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) { const on = eo(seg(lt, dp - 0.2 + (r * 9 + i) * 0.03, dp + (r * 9 + i) * 0.03)); if (on > 0) diya(70 + i * 118 + (r % 2) * 50, 1090 + r * 40, 0.32, t, r * 9 + i, on); }
      for (let i = 0; i < 9; i++) if (lt > dp) glow(70 + i * 118, 1330 + Math.sin(t + i) * 8, 50, A.gold, 0.4 * eo(seg(lt, dp, dp + 1)));
      vignette(0.45);
    } });
    cue(st + dp, 'sparkle', { dur: 2, gain: 0.6 }); for (let i = 0; i < 4; i++) cue(st + 0.1 + i * 0.6, 'bell', { gain: 0.2 }); }

  // 21 · that's why it's called Dev Deepawali
  { const st = cut_(21), dd = W_('देव', 21);
    add({ id: 'S22', at: st, cam: [540, 820], zoom: 0.1, note: 'ghats glowing with lamps; ribbon देव दीपावली with radiance', draw(lt, d, t) {
      kashi(t, 1); for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) diya(70 + i * 118 + (r % 2) * 50, 1090 + r * 40, 0.32, t, r * 9 + i, 1);
      if (lt > dd - 0.2) { const p = eob(seg(lt, dd - 0.2, dd + 0.2)); godRays(540, 600, 0, TAU, 24, 900, A.gold, 0.35 * p, t); glow(540, 600, 500, A.gold, 0.35 * p); K.ribbon('देव दीपावली', 540, 600, p * 1.1, 104); }
      motes(t, 40, [0, 200, W, 1300], A.paleGold, 0.6, 50, 13, 3); vignette(0.45);
    } });
    cue(st + dd, 'drum'); cue(st + dd, 'bell', { gain: 1 }); }

  // 22 · this year, 24 November
  { const st = cut_(22), dt = W_('चौबीस', 22);
    add({ id: 'S23', at: st, cam: [540, 820], zoom: 0.06, note: 'a calendar seal: 24 नवंबर 2026', draw(lt, d, t) {
      kashi(t, 1); ctx.fillStyle = 'rgba(10,8,24,0.45)'; ctx.fillRect(-400, -400, W + 800, H + 800);
      const p = eob(seg(lt, dt - 0.2, dt + 0.2));
      if (p > 0) { ctx.save(); ctx.translate(540, 700); ctx.scale(p, p); cut(P_rr(-260, -240, 520, 480, 24), '#F3E9D2', { shadow: 1, edge: 0 }); cut(P_rr(-260, -240, 520, 110, 24), '#A8322D', { shadow: 0, edge: 0 }); bigText('नवंबर 2026', 0, -182, 56, '#F6D98A'); bigText('24', 0, 30, 220, '#2A1C14'); bigText('मंगलवार', 0, 180, 48, '#7A2E3A'); ctx.restore(); }
      for (let i = 0; i < 7; i++) diya(110 + i * 145, 1300, 0.4, t, i, 1);
    } });
    cue(st + dt, 'slam', { gain: 0.5 }); cue(st + dt, 'bell', { gain: 0.5 }); }

  // 23-24 · end card
  { const st = cut_(23), f = Wd('फ़ॉलो', 24) - st;
    add({ id: 'S24', at: st, cam: [540, 800], zoom: 0.05, note: 'end card: Untold Stories in gold over the cosmos', draw(lt, d, t) {
      cosmos(t, 24); const pts = []; for (let x = -400; x <= W + 400; x += 40) pts.push([x, 1330 + Math.sin(x * 0.005 + lt * 0.3) * 40]); luminous(pts, 80, t, { glowA: 0.9 });
      glow(540, 700, 600, A.gold, 0.18); K.seal(540, 400, eob(seg(lt, 0.1, 0.4)) * 1.2, 'अ');
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.3, 0.7)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 690, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 860, 84, '#E8A0A0'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 1070, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1500], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.4, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
