// श्रीकृष्ण को भी एक श्राप मिला था — Gandhari's curse. Pattachitra-inspired cut paper.
// Mahabharata, Stri Parva 25; Mausala Parva.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, motes, vignette } from './atmos.js';
import { raja, devi, lightning, krishna, shivling, rain, rishi, warrior } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;
const RAV = { robe: '#4A0E1E', sash: '#D9A83C' };
// Pattachitra palette
const PT = { ver: '#B5321F', verD: '#8E2414', cream: '#EFE0BC', ochre: '#D9A12E', ind: '#26346B', indD: '#18214A', grn: '#3F6B3A', grnD: '#2A4A28', ink: '#1C120B', sky: '#E8C98A' };
function head(x, y, sc, o = {}) {
  const eyes = o.eyes ?? 1, skin = o.skin || '#D49A68', glowEye = o.glowEye || 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(sc, sc);
  cut(() => { ctx.beginPath(); ctx.moveTo(-60, -10); ctx.quadraticCurveTo(-80, 80, -40, 120); ctx.lineTo(40, 120); ctx.quadraticCurveTo(80, 80, 60, -10); ctx.closePath(); }, '#1A0C10', { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 64, 76, 0, 0, TAU); }, skin);
  ctx.strokeStyle = '#1A0C10'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 10, -24); ctx.lineTo(k * 44, -34); ctx.stroke(); }
  for (const k of [-1, 1]) { if (eyes > 0.5) { cut(() => { ctx.beginPath(); ctx.ellipse(k * 24, -10, 13, 8, 0, 0, TAU); }, '#F7EFDC', { shadow: 0, edge: 0 }); circle(k * 24, -10, 5, '#2A0A0A'); if (glowEye) glow(k * 24, -10, 26, '#FF3A1A', glowEye); } else { ctx.strokeStyle = '#1A0C10'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(k * 24, -14, 11, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); } }
  cut(() => { ctx.beginPath(); ctx.moveTo(-44, 26); ctx.quadraticCurveTo(-20, 8, 0, 22); ctx.quadraticCurveTo(20, 8, 44, 26); ctx.quadraticCurveTo(20, 20, 0, 32); ctx.quadraticCurveTo(-20, 20, -44, 26); ctx.closePath(); }, '#1A0C10', { shadow: 0, edge: 0 });
  if (o.laugh) cut(() => { ctx.beginPath(); ctx.ellipse(0, 46, 20, 8 + 10 * o.laugh, 0, 0, TAU); }, '#5A0A10', { shadow: 0, edge: 0 });
  circle(0, -46, 6, '#C0392B');
  cut(() => { ctx.beginPath(); ctx.moveTo(-62, -52); ctx.lineTo(-72, -120); ctx.lineTo(-38, -98); ctx.lineTo(-20, -150); ctx.lineTo(0, -110); ctx.lineTo(20, -150); ctx.lineTo(38, -98); ctx.lineTo(72, -120); ctx.lineTo(62, -52); ctx.closePath(); }, '#E2B24A', { shadow: 0.4, edge: 3 });
  cut(P_rr(-64, -66, 128, 18, 6), '#B8862A', { shadow: 0.2, edge: 2 }); circle(0, -86, 8, '#C0392B');
  ctx.restore();
}
// Ravana: ten crowned heads (4 left + centre + 5 right), dark robe; poses stand | lift (twenty arms raised) | pray | strain
export function ravana(x, y, o = {}) {
  const h = o.h || 900, s = h / 1150, t = o.t || 0, pose = o.pose || 'stand', laugh = o.laugh || 0, n = o.heads ?? 10, dir = o.dir || 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  if (o.aura) glow(0, -900, 700, '#FF3A1A', 0.3 * o.aura);
  if (pose === 'lift' || pose === 'strain') {
    ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) for (const k of [-1, 1]) {
      const a = k * (0.12 + i * 0.11), sx = k * 96, sy = -720, L1 = pose === 'lift' ? 270 : 230, L2 = pose === 'lift' ? 270 : 160 + Math.sin(t * 3 + i) * 6;
      const ex = sx + Math.sin(a) * L1, ey = sy - Math.cos(a) * L1, hx = ex + Math.sin(a * 0.6) * L2, hy = ey - Math.cos(a * 0.6) * L2;
      ctx.strokeStyle = i % 2 ? '#A8744A' : '#C08658'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = '#E2B24A'; ctx.lineWidth = 50; ctx.beginPath(); ctx.moveTo(lerp(ex, hx, 0.2), lerp(ey, hy, 0.2)); ctx.lineTo(lerp(ex, hx, 0.26), lerp(ey, hy, 0.26)); ctx.stroke();
      circle(hx, hy, 28, '#C08658');
    }
  }
  const order = [-4, 5, -3, 4, -2, 3, -1, 2, 1].slice(0, Math.max(0, n - 1));
  for (const k of order) { const bob = laugh ? Math.sin(t * 14 + k) * 8 * laugh : 0; head(k * 112, -896 + Math.abs(k) * 14 + bob, 0.86, { eyes: o.eyes ?? 1, laugh, glowEye: o.glowEye || 0, rot: k * 0.03 }); }
  raja({ x: 0, y: 0, h: 1150, t, pose: pose === 'pray' ? 'tapas' : 'stand', robe: o.robe || RAV.robe, sash: o.sash || RAV.sash, eyes: o.eyes ?? 1 });
  head(0, -900, 1.08, { eyes: o.eyes ?? 1, laugh, glowEye: o.glowEye || 0 });
  ctx.restore();
}
// Pushpaka vimana: golden flying temple-chariot on a cloud
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

// ---------- Pattachitra kit ----------
function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }
function ring(lt, w, x, y, col = '#FFE6A0', len = 0.9, R = 900) { if (lt > w && lt < w + len) { const k = seg(lt, w, w + len); ctx.save(); ctx.strokeStyle = rgba(col, 0.8 * (1 - k)); ctx.lineWidth = 30 * (1 - k) + 4; ctx.beginPath(); ctx.ellipse(x, y, R * eo(k), R * 0.4 * eo(k), 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
// flat patta background: a coloured field, a far band of stylised hills, a ground band with a dotted flower rule
function patta(bg, t, o = {}) {
  ctx.fillStyle = bg; ctx.fillRect(-300, -300, W + 600, H + 600); paperGrain(0.05, o.seed || 1);
  const px = o.px || 0, gy = o.gy ?? 1280;
  if (o.hills !== false) { const hc = o.hill || rgba('#000000', 0.12); ctx.save(); ctx.translate(-px * 0.3, 0); for (let i = -2; i < 9; i++) cut(() => { ctx.beginPath(); ctx.moveTo(i * 180 - 40, gy); ctx.quadraticCurveTo(i * 180 + 90, gy - 220 - 60 * rnd(i + 3), i * 180 + 220, gy); ctx.closePath(); }, hc, { shadow: 0, edge: 2 }); ctx.restore(); }
  if (o.trees !== false) { ctx.save(); ctx.translate(-px * 0.6, 0); for (const [x, s] of [[60, 0.9], [1010, 1], [-260, 0.8], [1330, 0.85]]) tree(x, gy, s, t, o.leaf || PT.grn); ctx.restore(); }
  cut(P_rr(-400, gy, W + 800, H, 0), o.ground || PT.ochre, { shadow: 0, edge: 4 });
  for (let x = -20 - (px % 60); x < W + 60; x += 60) { circle(x, gy + 26, 7, PT.ver); circle(x + 30, gy + 26, 4, PT.ink); }
  cut(P_rr(-400, gy + 48, W + 800, 6, 0), PT.ink, { shadow: 0, edge: 0 });
}
// stylised Pattachitra tree: trunk + stacked leaf lobes, outlined
function tree(x, y, s, t, col = PT.grn) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 0.8 + x) * 0.015);
  cut(P_poly([[-22, 0], [22, 0], [12, -300], [-12, -300]]), '#6A3A1E', { shadow: 0.2, edge: 3 });
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, r = 120; cut(() => { ctx.beginPath(); ctx.ellipse(Math.cos(a) * r * 0.9, -420 + Math.sin(a) * r * 0.8, 70, 46, a, 0, TAU); }, i % 2 ? col : PT.grnD, { shadow: 0.2, edge: 3 }); }
  cut(P_circ(0, -420, 90), col, { shadow: 0.2, edge: 3 });
  for (let i = 0; i < 6; i++) circle(Math.cos(i) * 50, -420 + Math.sin(i * 1.7) * 50, 9, PT.ver);
  ctx.restore();
}
function sunDisc(x, y, r, t, col = '#E8732A') { ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.2); for (let i = 0; i < 16; i++) { ctx.rotate(TAU / 16); cut(P_poly([[-14, -r - 4], [14, -r - 4], [0, -r - 48]]), PT.ochre, { shadow: 0, edge: 2 }); } ctx.restore(); cut(P_circ(x, y, r), col, { shadow: 0.3, edge: 4 }); cut(P_circ(x, y, r * 0.55), PT.ochre, { shadow: 0, edge: 2 }); }
function moonDisc(x, y, r) { glow(x, y, r * 3, '#F6EED0', 0.35); cut(() => { ctx.beginPath(); ctx.arc(x, y, r, 0.3, TAU - 0.3); ctx.arc(x + r * 0.45, y - r * 0.1, r * 0.8, TAU - 0.5, 0.5, true); ctx.closePath(); }, '#F6EED0', { shadow: 0.2, edge: 3 }); }
function flames(x, y, s, t, n = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -80, 200, '#FF8A3A', 0.5); for (let i = 0; i < 3; i++) { const h = (160 - i * 45) * (1 + 0.12 * Math.sin(t * 9 + i + x)); cut(() => { ctx.beginPath(); ctx.moveTo(-60 + i * 18, 0); ctx.quadraticCurveTo(-70 + i * 20, -h * 0.6, Math.sin(t * 6 + i) * 10, -h); ctx.quadraticCurveTo(70 - i * 20, -h * 0.6, 60 - i * 18, 0); ctx.closePath(); }, ['#C8321A', '#E8732A', '#F2C14E'][i], { shadow: 0, edge: 3 }); } ctx.restore(); }
function waves(y, t, col = '#2F5A9A', a = 1) { ctx.save(); ctx.globalAlpha = a; for (let k = 0; k < 4; k++) { const yy = y + k * 60; cut(() => { ctx.beginPath(); ctx.moveTo(-200, H + 300); ctx.lineTo(-200, yy); for (let x = -200; x <= W + 200; x += 60) ctx.quadraticCurveTo(x + 30, yy - 34 + 8 * Math.sin(t * 2 + k), x + 60, yy); ctx.lineTo(W + 200, H + 300); ctx.closePath(); }, k % 2 ? col : '#3D6FB0', { shadow: 0, edge: 3 }); } ctx.restore(); }
// Kumbhakarna: a giant in green-black with ochre sash (one crowned head)
function kumbha(x, y, o = {}) { ravana(x, y, { heads: 1, robe: '#24402E', sash: PT.ochre, ...o }); }
// lying asleep: feet at (x, y), head to the left; s = length / 1150
function sleeper(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-Math.PI / 2 + (o.rise || 0) * Math.PI / 2);
  const br = 1 + 0.015 * Math.sin(t * 1.6); ctx.scale(br, 1);
  kumbha(0, 0, { h: 1150 * s, t, eyes: o.eyes ?? 0, aura: o.aura || 0, glowEye: o.glowEye || 0 });
  ctx.restore();
  if (!o.rise) for (let i = 0; i < 3; i++) { const k = ((t * 0.5 + i / 3) % 1); ctx.strokeStyle = rgba('#F6EED0', 0.7 * (1 - k)); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x - 1040 * s - 20 + k * 30, y - 120 * s - k * 220, 16 + k * 40, 0, TAU); ctx.stroke(); }
}
// golden simhasana (Indra's throne) with a chhatra; a 0..1 visibility, crack 0..1
function throne(x, y, s, t, a = 1, crack = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  glow(0, -300, 520, '#FFE08A', 0.5); godRays(0, -300, 0, TAU, 18, 600, '#FFE6A0', 0.12, t);
  cut(P_rr(-6, -900, 12, 500, 4), PT.ink, { shadow: 0, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-220, -820); ctx.quadraticCurveTo(0, -1000, 220, -820); ctx.closePath(); }, PT.ver, { shadow: 0.3, edge: 4 }); for (let i = -4; i <= 4; i++) cut(P_poly([[i * 50 - 12, -820], [i * 50 + 12, -820], [i * 50, -780]]), PT.ochre, { shadow: 0, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-200, -120); ctx.lineTo(-200, -520); ctx.quadraticCurveTo(0, -720, 200, -520); ctx.lineTo(200, -120); ctx.closePath(); }, '#E2B24A', { shadow: 0.5, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-140, -160); ctx.lineTo(-140, -480); ctx.quadraticCurveTo(0, -620, 140, -480); ctx.lineTo(140, -160); ctx.closePath(); }, PT.ver, { shadow: 0, edge: 3 });
  cut(P_rr(-260, -180, 520, 70, 12), '#E2B24A', { shadow: 0.4, edge: 4 }); for (const k of [-1, 1]) { cut(P_rr(k * 210 - 30, -110, 60, 110, 10), '#B8862A', { shadow: 0.3, edge: 4 }); cut(P_circ(k * 240, -230, 46), '#E2B24A', { shadow: 0.3, edge: 4 }); circle(k * 250, -240, 7, PT.ink); }
  for (let i = -3; i <= 3; i++) circle(i * 70, -145, 10, i % 2 ? PT.ver : '#FFF6E6');
  if (crack > 0) { ctx.strokeStyle = PT.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -620); ctx.lineTo(-30, -480); ctx.lineTo(40, -360); ctx.lineTo(-20, -240); ctx.lineTo(30, -120); ctx.stroke(); }
  ctx.restore();
}
// a deva (small crowned god in gold), worried look = eyes open
function deva(x, y, h, t, i = 0) { raja({ x, y: y + Math.sin(t * 2 + i) * 8, h, t, pose: 'stand', robe: ['#E2B24A', '#F2EEE6', '#C8662E'][i % 3], sash: PT.ver, eyes: 1 }); }
function cloudBand(y, t, col = '#F6EED0') { for (let i = -1; i < 8; i++) { const x = ((i * 170 + t * 20) % 1400) - 150; cut(() => { ctx.beginPath(); ctx.arc(x, y, 70, Math.PI, 0); ctx.arc(x + 90, y, 50, Math.PI, 0); ctx.closePath(); }, col, { shadow: 0.2, edge: 3 }); } }
// Saraswati: white sari, ochre border, held veena suggested by a gourd + staff
function saraswati(x, y, h, t, o = {}) {
  glow(x, y - h * 0.6, h * 0.7, '#FFFFFF', 0.35 * (o.aura ?? 1));
  devi({ x, y, h, t, sari: '#F7F3EA', border: PT.ochre, pallu: '#F2E6C8', pose: o.pose || 'namaste', eyes: 0, glowA: 1, dir: o.dir || 1 });
  const s = h / 1150; ctx.save(); ctx.translate(x + (o.dir || 1) * 190 * s, y); ctx.scale(s, s);
  cut(P_rr(-8, -1000, 16, 820, 6), '#6A3A1E', { shadow: 0.3, edge: 3 }); cut(P_circ(0, -200, 70), '#B8862A', { shadow: 0.3, edge: 4 }); cut(P_circ(0, -960, 40), '#B8862A', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
// glowing stream of light (speech / Saraswati entering), p 0..1 drawn amount
function stream(x0, y0, x1, y1, t, p = 1, col = '#FFF2C0') { const n = 40; for (let i = 0; i < n * p; i++) { const k = i / n, x = lerp(x0, x1, k) + Math.sin(k * 9 + t * 4) * 40 * (1 - k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 160; glow(x, y, 30, col, 0.5); circle(x, y, 6 + 4 * Math.sin(t * 6 + i), col); } }
function bigHead(x, y, sc, t, o = {}) { glow(x, y, 300 * sc, o.glowCol || '#FFE6A0', o.aura || 0); head(x, y, sc, { eyes: o.eyes ?? 1, laugh: o.mouth || 0, glowEye: o.glowEye || 0, skin: '#B97A4E' }); }
function petals(t, a = 1) { for (let i = 0; i < 26; i++) { const x = (rnd(i) * W + t * 30 * (rnd(i + 2) - 0.3)) % W, y = (rnd(i + 5) * H + t * (60 + 40 * rnd(i))) % H; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(t + i); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, TAU); }, i % 3 ? PT.ver : PT.ochre, { shadow: 0, edge: 2 }); ctx.restore(); } }


// ---------- Ashwatthama kit ----------
const NIGHT = { bg: '#141B3A', bg2: '#0C1128', ground: '#0A0E20', leaf: '#16233A', red: '#C8321E' };
// Ashwatthama: tall warrior, indigo-black robe, vermilion sash; gem (0..1) or wound (0..1) on the forehead
function ashw(x, y, o = {}) {
  const h = o.h || 900, t = o.t || 0;
  raja({ x, y, h, t, pose: o.pose || 'stand', robe: o.robe || '#1E2448', sash: o.sash || PT.ver, eyes: o.eyes ?? 1, dir: o.dir || 1 });
  const s = h / 1150, fx = x, fy = y - 948 * s;
  if (o.gem) { glow(fx, fy, 120 * s * 3, '#7FE0FF', 0.5 * o.gem); circle(fx, fy, 11 * s * 2, "#BFF3FF"); }
  if (o.wound) { glow(fx, fy, 90 * s * 3, '#FF2A10', 0.45 * o.wound * (0.8 + 0.2 * Math.sin(t * 5))); circle(fx, fy, 10 * s * 2, "#7A0A06"); }
}
// close-up head with gem / wound on the forehead
function aHead(x, y, sc, t, o = {}) {
  head(x, y, sc, { eyes: o.eyes ?? 1, skin: '#9C6A48', glowEye: o.glowEye || 0 });
  const gx = x, gy = y - 46 * sc;
  if (o.gem) { glow(gx, gy, 140 * sc, '#7FE0FF', 0.7 * o.gem); circle(gx, gy, 14 * sc, '#DFFBFF'); circle(gx, gy, 8 * sc, '#7FE0FF'); }
  if (o.wound) { glow(gx, gy, 110 * sc, '#FF2A10', 0.55 * o.wound * (0.75 + 0.25 * Math.sin(t * 5))); circle(gx, gy, 12 * sc, '#6A0804'); ctx.strokeStyle = rgba('#8A0A06', 0.9 * o.wound); ctx.lineWidth = 4 * sc; ctx.beginPath(); ctx.moveTo(gx, gy + 10 * sc); ctx.quadraticCurveTo(gx + 6 * sc, gy + 40 * sc, gx + 2 * sc, gy + 70 * sc * o.wound); ctx.stroke(); }
}
function nightField(t, o = {}) { patta(o.bg || NIGHT.bg, t, { ground: o.ground || NIGHT.ground, leaf: NIGHT.leaf, hill: rgba('#000000', 0.3), trees: o.trees, hills: o.hills, gy: o.gy, px: o.px }); if (o.stars !== false) stars(t, 90, -200, 1050, o.seed || 3, 0.7); }
function bareTree(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#05070F'; ctx.lineCap = 'round';
  const br = (x0, y0, a, len, w, d) => { if (d > 5) return; const x1 = x0 + Math.sin(a) * len, y1 = y0 - Math.cos(a) * len; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); br(x1, y1, a - 0.45 + Math.sin(t * 0.7 + d) * 0.02, len * 0.72, w * 0.68, d + 1); br(x1, y1, a + 0.4, len * 0.68, w * 0.66, d + 1); };
  br(0, 0, -0.05, 360, 46, 0); ctx.restore(); }
function owl(x, y, s, t, eye = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 60, 84, 0, 0, TAU); }, '#3A2C22', { shadow: 0.4, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-50, -60); ctx.lineTo(-62, -110); ctx.lineTo(-20, -74); ctx.lineTo(20, -74); ctx.lineTo(62, -110); ctx.lineTo(50, -60); ctx.closePath(); }, '#3A2C22', { shadow: 0, edge: 3 });
  for (const k of [-1, 1]) { circle(k * 24, -44, 22, '#E9D9A8'); circle(k * 24, -44, 11, '#120A06'); glow(k * 24, -44, 60, '#FFB020', 0.55 * eye); circle(k * 24, -44, 5, rgba('#FFD060', eye)); }
  cut(P_poly([[-8, -24], [8, -24], [0, -6]]), PT.ochre, { shadow: 0, edge: 2 }); for (let i = 0; i < 5; i++) circle(-30 + i * 15, 20 + (i % 2) * 14, 5, '#1C140E'); ctx.restore(); }
function crow(x, y, s, sleep = 1, fallen = 0) { ctx.save(); ctx.translate(x, y + fallen * 30); ctx.rotate(fallen * 1.4); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 40, 26, -0.15, 0, TAU); }, '#0B0B10', { shadow: 0.2, edge: 2 }); cut(P_circ(30, -18, 17), '#0B0B10', { shadow: 0, edge: 2 }); cut(P_poly([[44, -20], [66, -14], [44, -10]]), '#2A2A30', { shadow: 0, edge: 1 });
  if (!sleep) circle(34, -22, 3, '#EEE'); else { ctx.strokeStyle = '#444'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(34, -22, 4, 0.2, Math.PI - 0.2); ctx.stroke(); } ctx.restore(); }
function tent(x, y, s, col, lit = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_poly([[-170, 0], [170, 0], [0, -260]]), col, { shadow: 0.4, edge: 4 }); cut(P_poly([[-40, 0], [40, 0], [0, -150]]), lit ? rgba('#FFB060', lit) : '#05070F', { shadow: 0, edge: 2 });
  cut(P_rr(-3, -320, 6, 70, 2), PT.ink, { shadow: 0, edge: 0 }); cut(P_poly([[3, -320], [60, -305], [3, -290]]), PT.ver, { shadow: 0, edge: 1 }); ctx.restore(); }
function diyaOut(x, y, s, t, flame = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 44, 16, 0, 0, Math.PI); ctx.closePath(); }, '#9C5A32', { shadow: 0.2, edge: 3 });
  if (flame > 0.02) { glow(0, -30, 90, '#FFB040', 0.6 * flame); cut(() => { ctx.beginPath(); ctx.moveTo(-10, -4); ctx.quadraticCurveTo(0, -60 * flame, 10, -4); ctx.closePath(); }, '#FFC24A', { shadow: 0, edge: 0 }); }
  else for (let i = 0; i < 3; i++) { const k = (t * 0.6 + i / 3) % 1; ctx.strokeStyle = rgba('#AAB0C0', 0.5 * (1 - k)); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -6 - k * 120); ctx.quadraticCurveTo(14, -30 - k * 120, 0, -54 - k * 120); ctx.stroke(); }
  ctx.restore(); }
function sleeperFig(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 160, 34, 0, 0, TAU); }, col, { shadow: 0.3, edge: 3 }); cut(P_circ(-170, -10, 34), '#B98258', { shadow: 0.2, edge: 3 }); ctx.restore(); }
function astraBeam(x0, y0, x1, y1, p, t, col = '#FFD27A') { if (p <= 0) return; const x = lerp(x0, x1, p), y = lerp(y0, y1, p);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (const [w, a] of [[60, 0.15], [24, 0.4], [8, 0.95]]) { ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke(); } ctx.restore();
  glow(x, y, 220, '#FFE6A0', 0.8); flames(x, y + 60, 0.7, t); }
function womb(x, y, r, t, a = 1, safe = 0) { ctx.save(); ctx.globalAlpha = a; glow(x, y, r * 2.4, safe ? '#9FC4FF' : '#FFD9C0', 0.5); cut(P_circ(x, y, r), safe ? '#2E4A8A' : '#5A2A3A', { shadow: 0.3, edge: 5 });
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t) * 0.05); cut(() => { ctx.beginPath(); ctx.ellipse(-10, 10, r * 0.42, r * 0.32, 0.6, 0, TAU); }, '#E8A88A', { shadow: 0, edge: 3 }); cut(P_circ(r * 0.22, -r * 0.18, r * 0.26), '#E8A88A', { shadow: 0, edge: 3 }); ctx.restore(); ctx.restore(); }
function temple(x, y, s, t, door = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-260, 0); ctx.lineTo(-260, -360); ctx.quadraticCurveTo(-200, -820, 0, -900); ctx.quadraticCurveTo(200, -820, 260, -360); ctx.lineTo(260, 0); ctx.closePath(); }, '#8E6A4A', { shadow: 0.5, edge: 5 });
  for (let i = 1; i < 8; i++) cut(P_rr(-250 + i * 6, -360 - i * 70, 500 - i * 12, 10, 3), '#6A4A32', { shadow: 0, edge: 0 });
  cut(P_rr(-20, -980, 40, 90, 8), PT.ochre, { shadow: 0.2, edge: 3 }); cut(P_poly([[20, -980], [110, -955], [20, -930]]), PT.ver, { shadow: 0, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(-110, -230); ctx.quadraticCurveTo(0, -330, 110, -230); ctx.lineTo(110, 0); ctx.closePath(); }, '#2A1A10', { shadow: 0, edge: 4 });
  if (door < 1) { const w = 110 * (1 - door); cut(P_rr(-110, -240, w, 240, 2), '#5A3A22', { shadow: 0, edge: 3 }); cut(P_rr(110 - w, -240, w, 240, 2), '#5A3A22', { shadow: 0, edge: 3 }); circle(-14, -120, 8, PT.ochre); circle(14, -120, 8, PT.ochre); }
  ctx.restore(); }
function fog(t, y = 1150, a = 0.5) { mist(y, 380, '#9AA6C8', a, t, 4, 18); mist(y + 120, 300, '#7E89AE', a * 0.8, t, 9, 10); }

// ---------- Gandhari kit ----------
function gandhari(x, y, h, t, o = {}) { devi({ x, y, h, t, sari: o.sari || '#F2EEE6', border: o.border || '#9A8A6A', pose: o.pose || 'stand', eyes: 0, dir: o.dir || 1 });
  const s = h / 1150, ey = y - (o.eyeY ?? 905) * s; cut(P_rr(x - 78 * s, ey - 16 * s, 156 * s, 34 * s, 10 * s), '#E8E2D2', { shadow: 0.2, edge: 2 }); ctx.strokeStyle = '#9A8A6A'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(x - 78 * s, ey); ctx.lineTo(x + 78 * s, ey); ctx.stroke();
  if (o.tears) for (const k of [-1, 1]) { const p = (t * 0.7 + (k > 0 ? 0.5 : 0)) % 1; circle(x + k * 42 * s, ey + 30 * s + p * 120 * s, 7 * s, rgba('#BFE4FF', 0.9 * (1 - p))); } }
function battlefield(t, k = 1) { patta('#7A3A2A', t, { ground: '#3A2018', trees: false, hill: rgba('#000000', 0.3) }); sunDisc(160, 330, 80, t);
  for (let i = 0; i < 9; i++) { ctx.save(); ctx.translate(80 + i * 120, 1330 + (i % 3) * 20); ctx.rotate(-0.6 + (i % 4) * 0.35); cut(P_rr(-5, -140, 10, 180, 3), '#4A3A30', { shadow: 0.2, edge: 2 }); cut(P_poly([[-40, -140], [40, -140], [0, -200]]), '#5A2A20', { shadow: 0, edge: 2 }); ctx.restore(); }
  mist(1250, 400, '#8A6A5A', 0.45, t, 5, 20); }
function club(x, y, s, rot, iron = 1) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_rr(-8, -160, 16, 170, 4), iron > 0.5 ? '#6A6E78' : '#7A9A4A', { shadow: 0.2, edge: 2 }); cut(P_circ(0, -170, 38 * iron + 6), iron > 0.5 ? '#5A5E68' : '#7A9A4A', { shadow: 0.2, edge: 3 }); ctx.restore(); }
function dwarka(x, y, s, t, sink = 0) { ctx.save(); ctx.translate(x, y + sink * 600); ctx.scale(s, s);
  for (let i = -3; i <= 3; i++) { const hh = 260 + (3 - Math.abs(i)) * 90; cut(P_rr(i * 150 - 60, -hh, 120, hh, 6), i % 2 ? '#E8C890' : '#F2D8A0', { shadow: 0.3, edge: 3 }); cut(() => { ctx.beginPath(); ctx.moveTo(i * 150 - 66, -hh); ctx.quadraticCurveTo(i * 150, -hh - 120, i * 150 + 66, -hh); ctx.closePath(); }, PT.ochre, { shadow: 0, edge: 3 }); cut(P_rr(i * 150 - 3, -hh - 170, 6, 60, 2), PT.ink, { shadow: 0, edge: 0 }); cut(P_poly([[i * 150 + 3, -hh - 170], [i * 150 + 40, -hh - 160], [i * 150 + 3, -hh - 150]]), PT.ver, { shadow: 0, edge: 1 }); }
  ctx.restore(); }

// ---------- Yudhishthira kit ----------
// war chariot, side view, base (wheel bottom) at (x, y); float = gap above ground in px (glow under the wheel)
function chariot(x, y, s, t, o = {}) { const fl = o.float || 0; ctx.save(); ctx.translate(x, y - fl); ctx.scale(s * (o.dir || 1), s);
  if (fl > 2) { glow(0, fl / s, 260, '#FFF2C0', 0.5 * (o.glowA ?? 1)); }
  cut(P_rr(-260, -330, 520, 150, 14), o.body || '#B5321F', { shadow: 0.4, edge: 5 }); for (let i = 0; i < 6; i++) circle(-210 + i * 84, -255, 12, PT.ochre);
  cut(P_rr(-280, -200, 560, 26, 8), PT.ochre, { shadow: 0.2, edge: 3 }); cut(P_rr(250, -230, 260, 18, 8), '#6A3A1E', { shadow: 0.2, edge: 2 });
  cut(P_rr(-240, -720, 12, 400, 4), PT.ink, { shadow: 0, edge: 0 }); cut(P_poly([[-228, -720], [-80, -690], [-228, -640]]), o.flag || PT.ochre, { shadow: 0.2, edge: 2 });
  const sp = t * (o.spin ?? 1.2); ctx.save(); ctx.translate(0, -170); ctx.rotate(sp); cut(P_circ(0, 0, 170), '#6A3A1E', { shadow: 0.4, edge: 6 }); cut(P_circ(0, 0, 130), o.bg || '#3A2018', { shadow: 0, edge: 2 });
  for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); cut(P_rr(-8, 0, 16, 132, 4), '#8A5A2E', { shadow: 0, edge: 1 }); } cut(P_circ(0, 0, 34), PT.ochre, { shadow: 0.2, edge: 3 }); ctx.restore();
  ctx.restore(); }
// Pattachitra war elephant (no face cartoon), base at (x, y); fall 0..1 tips it over
function warElephant(x, y, s, t, fall = 0, dir = 1) { ctx.save(); ctx.translate(x, y + fall * 60 * s); ctx.scale(s * dir, s); ctx.rotate(fall * 0.38);
  const c = '#5E5A66', d = '#4A4652';
  for (const lx of [-200, -90, 80, 190]) cut(P_rr(lx - 44, -260, 88, 262, 30), lx % 2 ? d : c, { shadow: 0.3, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -400, 300, 200, 0, 0, TAU); }, c, { shadow: 0.4, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-180, -560); ctx.quadraticCurveTo(0, -620, 180, -560); ctx.lineTo(200, -330); ctx.quadraticCurveTo(0, -280, -200, -330); ctx.closePath(); }, PT.ver, { shadow: 0.2, edge: 4 });
  for (let i = 0; i < 7; i++) circle(-150 + i * 50, -320, 12, PT.ochre);
  cut(P_circ(300, -480, 150), c, { shadow: 0.3, edge: 5 }); cut(() => { ctx.beginPath(); ctx.ellipse(230, -470, 90, 130, -0.2, 0, TAU); }, d, { shadow: 0.2, edge: 4 });
  ctx.strokeStyle = c; ctx.lineWidth = 64; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(410, -420); ctx.quadraticCurveTo(470 + Math.sin(t * 2) * 20, -230, 420, -60); ctx.stroke();
  cut(P_poly([[370, -360], [470, -300], [380, -330]]), '#F7EFDC', { shadow: 0, edge: 2 }); circle(330, -520, 12, PT.ink);
  cut(P_rr(260, -640, 100, 40, 12), PT.ochre, { shadow: 0, edge: 2 }); ctx.restore(); }
function yudh(x, y, h, t, o = {}) { raja({ x, y, h, t, pose: o.pose || 'stand', robe: '#F2EEE6', sash: PT.ochre, eyes: o.eyes ?? 1, dir: o.dir || 1 }); if (o.aura) glow(x, y - h * 0.55, h * 0.6, '#FFF2C0', 0.3 * o.aura); }
function bhima(x, y, h, t, o = {}) { raja({ x, y, h, t, pose: o.pose || 'stand', robe: '#2E5A2E', sash: PT.ver, eyes: 1, dir: o.dir || 1 }); }
function mace(x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); cut(P_rr(-10, -300, 20, 320, 6), '#8A5A2E', { shadow: 0.2, edge: 3 }); cut(P_circ(0, -320, 70), '#E2B24A', { shadow: 0.4, edge: 4 }); for (let i = 0; i < 8; i++) circle(Math.cos(i) * 50, -320 + Math.sin(i) * 50, 9, '#B8862A'); ctx.restore(); }
function conch(x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, 0, 200, '#FFFFFF', 0.4);
  cut(() => { ctx.beginPath(); ctx.moveTo(-120, 0); ctx.quadraticCurveTo(-60, -110, 60, -70); ctx.quadraticCurveTo(140, -30, 130, 20); ctx.quadraticCurveTo(40, 70, -120, 0); ctx.closePath(); }, '#F7F1E4', { shadow: 0.3, edge: 4 });
  ctx.strokeStyle = '#C9B89A'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(70, -20, 20 + i * 18, 0.5, 2.6); ctx.stroke(); } ctx.restore(); }
function soundRings(x, y, t, a = 1, col = '#FFF2C0') { for (let i = 0; i < 4; i++) { const k = (t * 0.9 + i / 4) % 1; ctx.strokeStyle = rgba(col, a * 0.8 * (1 - k)); ctx.lineWidth = 14 * (1 - k) + 3; ctx.beginPath(); ctx.arc(x, y, 60 + k * 700, -0.9, 0.9); ctx.stroke(); } }
function arrowRain(t, n = 14, col = '#2A1A10') { ctx.strokeStyle = col; ctx.lineWidth = 6; for (let i = 0; i < n; i++) { const k = (t * 0.9 + rnd(i) ) % 1, x = rnd(i + 7) * 1300 - 100 + k * 300, y = -100 + k * 1300; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 70, y - 90); ctx.stroke(); } }
function scale(x, y, s, t, tilt = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-12, -600, 24, 600, 6), PT.ochre, { shadow: 0.3, edge: 3 }); cut(P_rr(-120, -20, 240, 30, 8), '#B8862A', { shadow: 0.2, edge: 3 });
  ctx.save(); ctx.translate(0, -580); ctx.rotate(tilt); cut(P_rr(-340, -10, 680, 20, 6), PT.ochre, { shadow: 0.2, edge: 3 });
  for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 320, 0); ctx.rotate(-tilt); ctx.strokeStyle = PT.ochre; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-80, 260); ctx.moveTo(0, 0); ctx.lineTo(80, 260); ctx.stroke(); cut(() => { ctx.beginPath(); ctx.ellipse(0, 270, 110, 30, 0, 0, Math.PI); ctx.closePath(); }, '#E2B24A', { shadow: 0.3, edge: 3 });
    if (k < 0) glow(0, 230, 90, '#FFF2C0', 0.7); else circle(0, 240, 34, '#1A0C10'); ctx.restore(); }
  ctx.restore(); ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);
  const shot = (i, note, draw, o = {}) => add({ id: 'S' + String(i + 1).padStart(2, '0'), at: cut_(i), cam: o.cam || [540, 900], zoom: o.zoom ?? 0.08, capY: o.capY ?? 1470, note, draw });
  const GY = 1280;
  // 0 HOOK: a white-robed king on a floating chariot (face small, name hidden); a guru's bow falls in front at 'जान'
  { const jw = W_('जान', 0);
    shot(0, 'HOOK: blood-red sky; a glowing white king stands on a chariot floating above the ground; in front a guru\'s bow drops at "जान"', (lt, d, t) => {
      battlefield(t); ctx.save(); ctx.globalAlpha = 0.5; ctx.fillStyle = '#3A0410'; ctx.fillRect(0, 0, W, H); ctx.restore();
      chariot(600, GY - 10, 0.95, t, { float: 40, spin: 0 }); yudh(560, GY - 330, 620, t, { aura: 1 });
      const f = clamp((lt - jw + 0.5) / 0.6); if (f > 0) { ctx.save(); ctx.translate(250, lerp(-150, 1150, eio(f))); ctx.rotate(lerp(-0.2, 1.3, f)); ctx.strokeStyle = '#E2B24A'; ctx.lineWidth = 22; ctx.beginPath(); ctx.arc(0, 0, 240, -1.1, 1.1); ctx.stroke(); ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(Math.cos(-1.1) * 240, Math.sin(-1.1) * 240); ctx.lineTo(Math.cos(1.1) * 240, Math.sin(1.1) * 240); ctx.stroke(); ctx.restore(); glow(250, 1150, 200, '#FFB050', 0.4 * f); }
      if (lt > jw) { flash(lt, jw, '#FF5A3A', 0.35); } vignette(0.6);
    }, { zoom: 0.12, cam: [540, 840] });
    cue(0.1, 'swell', { dur: 2.4, gain: 0.55 }); cue(cut_(0) + jw, 'slam', { gain: 0.8 }); }
  // 1 the wheel floats four fingers above the ground
  shot(1, 'close-up: the chariot wheel turning in the air, a thin line of light between the wheel and the earth', (lt, d, t) => {
    patta('#2A1E3A', t, { ground: '#3A2018', trees: false, hills: false, gy: 1150 }); chariot(700, 1150, 2.2, t, { float: 60, bg: '#2A1E3A' });
    ctx.fillStyle = rgba('#FFF2C0', 0.9); ctx.fillRect(0, 1146, W, 4); vignette(0.5);
  }, { zoom: 0.08, cam: [540, 860] });
  cue(cut_(1) + 0.3, 'sparkle', { gain: 0.5 });
  // 2 Drona unstoppable
  shot(2, 'Guru Drona (white beard, saffron) on the battlefield, arrows raining from his side, warriors fall back', (lt, d, t) => {
    battlefield(t); arrowRain(t, 16); rishi(540, GY + 10, { s: 1.0, t, pose: 'stand', mood: 'angry', aura: 0.6 });
    for (let i = 0; i < 3; i++) warrior(140 + i * 120 - eo(seg(lt, 0, d)) * 60, GY + 20, 320, '#3A2A2A', PT.ver, t, i); vignette(0.5);
  }, { zoom: 0.08 });
  cue(cut_(2) + 0.2, 'drum', { gain: 0.6 }); cue(cut_(2) + 0.6, 'whoosh', { gain: 0.5 });
  // 3 Krishna made a plan
  shot(3, 'Krishna close, calm half-smile, a small golden spark of an idea above his hand, indigo night', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD, trees: false }); stars(t, 80, -200, 1000, 5, 0.6); krishna(540, GY + 380, { s: 1.4, t, pose: 'flute', aura: 1 });
    const k = eo(seg(lt, 0.4, 1.2)); glow(780, 640, 140, '#FFE6A0', 0.8 * k); circle(780, 640, 14 * k, '#FFF6D0');
  }, { zoom: 0.1, cam: [540, 820] });
  cue(cut_(3) + 0.4, 'bell', { gain: 0.45 });
  // 4 Bhima kills the elephant and shouts
  { const mw = W_('मारा', 4), cw = W_('चिल्लाया', 4);
    shot(4, 'Bhima (green, mace) swings at a war elephant named Ashvatthama; it falls on "मारा"; then shout rings on "चिल्लाया"', (lt, d, t) => {
      battlefield(t); const sw = clamp((lt - mw + 0.4) / 0.4), fall = eio(clamp((lt - mw) / 0.8));
      warElephant(760, GY + 10, 0.72, t, fall, -1); bhima(230, GY + 20, 820, t); mace(330, GY - 540, 1, lerp(-1.6, 1.1, eob(sw)));
      if (lt > mw) mist(1250, 400, '#9A7A5A', 0.6 * (1 - clamp((lt - mw) / 1.5)), t, 3, 50);
      if (lt > cw) soundRings(320, GY - 980, lt, 0.8, '#FFE6A0');
    }, { zoom: 0.08 });
    cue(cut_(4) + mw - 0.1, 'whoosh', { gain: 0.6 }); cue(cut_(4) + mw, 'slam', { gain: 1 }); cue(cut_(4) + cw, 'drum', { gain: 0.6 }); }
  // 5 Drona asks the one who never lies
  shot(5, 'Drona (left) turns to a glowing white-robed king on his floating chariot (right); a soft white light around the king', (lt, d, t) => {
    battlefield(t); ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = '#0C1128'; ctx.fillRect(0, 0, W, H); ctx.restore();
    chariot(800, GY - 10, 0.7, t, { float: 30, spin: 0, dir: -1 }); yudh(780, GY - 240, 480, t, { aura: 1, dir: -1 }); rishi(260, GY + 10, { s: 0.85, t, pose: 'namaste', dir: 1 }); vignette(0.5);
  }, { zoom: 0.08 });
  cue(cut_(5) + 0.3, 'tock', { gain: 0.4 });
  // 6 the half-truth: loud then soft
  { const dw = W_('धीरे', 6);
    shot(6, 'close on the white king: a bright stream of words leaves him, then shrinks to a faint trickle on "धीरे"', (lt, d, t) => {
      patta('#1A1426', t, { trees: false, ground: '#0A0812', hills: false, gy: 1500 }); yudh(380, 2250, 1900, t, { aura: 0.5 });
      const p = lt < dw ? 1 : 1 - 0.8 * clamp((lt - dw) / 0.6); ctx.save(); ctx.globalAlpha = p; stream(470, 640, 1000, 760, t, 1, '#FFF2C0'); ctx.restore(); vignette(0.55);
    }, { zoom: 0.1, cam: [540, 820], capY: 1560 });
    cue(cut_(6) + dw, 'tock', { gain: 0.3 }); }
  // 7 Krishna's conch drowns the last word
  { const sw = W_('शंख', 7);
    shot(7, 'Krishna raises a white conch; huge golden sound rings sweep across and swallow the faint stream', (lt, d, t) => {
      patta(PT.ind, t, { ground: PT.indD, trees: false }); krishna(360, GY + 10, { s: 0.95, t, pose: 'flute', aura: 0.8 });
      const k = eob(seg(lt, sw - 0.3, sw + 0.2)); conch(560, 640, 1.1 * k, t); if (lt > sw) soundRings(620, 640, lt - sw, 1);
    }, { zoom: 0.1 });
    cue(cut_(7) + sw, 'conch', { dur: 2.2, gain: 0.8 }); }
  // 8 Drona lays down his weapons; the end (no gore: fade to red-black)
  { const rw = W_('रख', 8), vw = W_('वध', 8);
    shot(8, 'Drona sits, bow slips from his hands on "रख"; on "वध" a dark sword shadow sweeps and the frame drops to red-black (no gore)', (lt, d, t) => {
      battlefield(t); rishi(540, GY + 10, { s: 1.0, t, pose: 'namaste', aura: 0.3 });
      const f = clamp((lt - rw) / 0.6); ctx.save(); ctx.translate(720, lerp(900, 1240, eio(f))); ctx.rotate(lerp(0, 1.5, f)); ctx.strokeStyle = '#6A3A1E'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 200, -1.1, 1.1); ctx.stroke(); ctx.restore();
      if (lt > vw - 0.3) { const k = clamp((lt - vw + 0.3) / 0.3); ctx.save(); ctx.translate(lerp(1200, -200, k), 500); ctx.rotate(-0.6); ctx.fillStyle = rgba('#05030A', 0.85); ctx.fillRect(-20, -600, 40, 1200); ctx.restore(); }
      if (lt > vw) { ctx.fillStyle = rgba('#2A0206', 0.9 * clamp((lt - vw) / 0.4)); ctx.fillRect(0, 0, W, H); }
    }, { zoom: 0.08 });
    cue(cut_(8) + rw, 'thud', { gain: 0.5 }); cue(cut_(8) + vw, 'slam', { gain: 1 }); }
  // 9 the chariot crashes to the ground
  { const zw = W_('ज़मीन', 9);
    shot(9, 'the floating chariot with the white king; on "ज़मीन" it drops and hits the earth, dust bursts, the light under it dies', (lt, d, t) => {
      battlefield(t); ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = '#1A0610'; ctx.fillRect(0, 0, W, H); ctx.restore();
      const dr = eob(clamp((lt - zw + 0.15) / 0.3)), fl = lerp(70, 0, dr); chariot(560, GY - 10, 1.0, t, { float: fl, spin: 0, glowA: 1 - dr }); yudh(520, GY - 340 - fl, 640, t, { aura: 1 - dr });
      if (lt > zw) { mist(1260, 420, '#B89A7A', 0.8 * (1 - clamp((lt - zw) / 1.6)), t, 2, 70); } vignette(0.55);
    }, { zoom: 0.1 });
    cue(cut_(9) + zw, 'slam', { gain: 1 }); cue(cut_(9) + zw + 0.05, 'thud', { gain: 0.7 }); }
  // 10 a moment of hell
  { const nw = W_('नरक', 10);
    shot(10, 'a small white figure walks alone down a dark red path lined with fire; on "नरक" the fires flare', (lt, d, t) => {
      patta('#2A0408', t, { ground: '#120204', trees: false, hill: rgba('#000000', 0.4) }); const f = lt > nw ? 1.3 : 1;
      for (let i = 0; i < 6; i++) { flames(90 + i * 180, GY - 40 + (i % 2) * 40, 0.9 * f, t + i); }
      yudh(540, GY + 20, 520, t, { pose: 'walk', aura: 0.6 }); fog(t, 1200, 0.3); vignette(0.7);
    }, { zoom: 0.1, cam: [540, 880] });
    cue(cut_(10) + nw, 'drum', { gain: 0.7 }); cue(cut_(10) + 0.2, 'heartbeat', { gain: 0.5 }); }
  // 11 REVEAL
  { const nw = W_('युधिष्ठिर', 11);
    shot(11, 'REVEAL: Yudhishthira, full figure in white and gold, chariot behind him on the ground, big pale moon; name lands', (lt, d, t) => {
      patta('#1A1426', t, { trees: false, ground: '#0A0812' }); cut(P_circ(540, 560, 300), '#E8E2D2', { shadow: 0.2, edge: 4 }); glow(540, 560, 500, '#FFF2C0', 0.25);
      chariot(780, GY, 0.6, t, { spin: 0, bg: '#1A1426' }); yudh(480, GY + 30, 1060, t, { aura: 1 }); flash(lt, nw, '#FFFFFF', 0.6); ring(lt, nw, 540, 560, '#FFE6D0');
    }, { zoom: 0.12, cam: [540, 820] });
    cue(cut_(11) + nw, 'slam', { gain: 1 }); cue(cut_(11) + nw, 'conch', { gain: 0.5 }); }
  // 12 is half a truth a lie? scales
  shot(12, 'LOOP: golden scales slowly tilting, one pan holding light, the other a black stone', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, trees: false }); stars(t, 80, -200, 1000, 12, 0.6); scale(540, GY - 20, 1.0, t, 0.18 * Math.sin(lt * 1.4)); vignette(0.5);
  }, { zoom: 0.08, cam: [540, 860] });
  cue(cut_(12), 'bell', { gain: 0.4 });
  // 13 end card
  shot(13, 'end card', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 100, -200, 1000, 33, 0.6);
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.1, 0.5)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 620, 120, '#F6D98A'); ctx.restore();
  }, { zoom: 0.05 });
  cue(cut_(13), 'bell', { gain: 0.5 });
  return { shots: S, cues: CUES };
}
