// श्रीकृष्ण को भी एक श्राप मिला था — Gandhari's curse. Pattachitra-inspired cut paper.
// Mahabharata, Stri Parva 25; Mausala Parva.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, motes, vignette } from './atmos.js';
import { raja, devi, lightning, krishna, shivling, rain, rishi } from './cast.js';
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

// ---------- Ayodhya kit ----------
const AY = { stone: '#D9C49A', stoneD: '#B59A6E', gold: '#E2B24A', night: '#141B3A' };
function pillar(x, y, h, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-46, -h, 92, h, 6), col || AY.stone, { shadow: 0.35, edge: 4 }); cut(P_rr(-62, -h - 34, 124, 34, 6), AY.stoneD, { shadow: 0.2, edge: 3 }); cut(P_rr(-62, -24, 124, 24, 6), AY.stoneD, { shadow: 0.2, edge: 3 }); ctx.restore(); }
function hall(t, o = {}) { patta(o.bg || '#4A2A2E', t, { ground: o.ground || '#2A1812', trees: false, hills: false, gy: o.gy ?? 1260 });
  for (const x of [60, 1020]) pillar(x, 1270, 760, 1, o.col); if (o.mid !== false) { pillar(260, 1240, 640, 0.8, o.col); pillar(820, 1240, 640, 0.8, o.col); }
  cut(P_rr(-20, 380, 1120, 40, 8), AY.stoneD, { shadow: 0.2, edge: 3 }); vignette(o.vig ?? 0.55); }
// a tall arched doorway, closed or open; base at (x,y)
function doorway(x, y, s, open = 0, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-200, 0); ctx.lineTo(-200, -420); ctx.quadraticCurveTo(0, -620, 200, -420); ctx.lineTo(200, 0); ctx.closePath(); }, AY.stoneD, { shadow: 0.4, edge: 5 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-160, 0); ctx.lineTo(-160, -400); ctx.quadraticCurveTo(0, -570, 160, -400); ctx.lineTo(160, 0); ctx.closePath(); }, o.inner || '#140A08', { shadow: 0, edge: 3 });
  if (open < 0.99) for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 160, 0); ctx.scale(1 - open, 1); ctx.translate(-k * 160, 0); cut(() => { ctx.beginPath(); ctx.moveTo(k * 2, 0); ctx.lineTo(k * 2, -400); ctx.quadraticCurveTo(k * 90, -500, k * 160, -400); ctx.lineTo(k * 160, 0); ctx.closePath(); }, '#6A3A1E', { shadow: 0.2, edge: 3 }); circle(k * 90, -210, 16, AY.gold); ctx.restore(); }
  if (open > 0.05) glow(0, -260, 320 * open, o.light || '#FF8A3A', 0.5 * open);
  ctx.restore(); }
function ram(x, y, h, t, o = {}) { raja({ x, y, h, t, pose: o.pose || 'stand', robe: '#EDE6D6', sash: '#2E5AA8', eyes: o.eyes ?? 1, dir: o.dir || 1 }); if (o.aura) glow(x, y - h * 0.58, h * 0.62, '#FFF2C0', 0.28 * o.aura); }
function lakshman(x, y, h, t, o = {}) { raja({ x, y, h, t, pose: o.pose || 'stand', robe: '#F2EEE6', sash: '#C8963E', eyes: o.eyes ?? 1, dir: o.dir || 1, crown: false, wrap: '#E2B24A' }); if (o.aura) glow(x, y - h * 0.58, h * 0.55, '#FFE6A0', 0.26 * o.aura); }
// Kaal: a hooded ascetic, face in shadow, two red eye points
function kaal(x, y, h, t, o = {}) { const s = h / 1150; ctx.save();
  cut(() => { ctx.beginPath(); ctx.moveTo(x - 300 * s, y); ctx.quadraticCurveTo(x - 250 * s, y - 900 * s, x, y - 1080 * s); ctx.quadraticCurveTo(x + 250 * s, y - 900 * s, x + 300 * s, y); ctx.closePath(); }, o.col || '#120A14', { shadow: 0.45, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(x, y - 980 * s, 150 * s, 175 * s, 0, 0, TAU); }, '#1C1020', { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(x, y - 960 * s, 110 * s, 140 * s, 0, 0, TAU); }, '#05030A', { shadow: 0, edge: 0 });
  const f = 0.75 + 0.25 * Math.sin(t * 3); for (const k of [-1, 1]) { circle(x + k * 46 * s, y - 980 * s, 13 * s, rgba('#FF2A10', f)); glow(x + k * 46 * s, y - 980 * s, 70 * s, '#FF2A10', 0.55 * f); }
  ctx.restore(); }
function durvasa(x, y, h, t, o = {}) { rishi(x, y, { s: h / 1150, t, pose: o.pose || 'curse', mood: 'angry', dir: o.dir || 1, aura: 0.8 }); glow(x, y - h * 0.6, h * 0.55, '#FF6A20', 0.4); }
function river(t, y, o = {}) { cut(P_rr(-40, y, 1160, 1920 - y, 0), o.col || '#1E3A5A', { shadow: 0, edge: 0 });
  ctx.strokeStyle = rgba(o.line || '#8FC4E8', 0.5); ctx.lineWidth = 5;
  for (let i = 0; i < 9; i++) { const yy = y + 40 + i * 62; ctx.beginPath(); ctx.moveTo(-40, yy); for (let x = -40; x <= 1120; x += 90) ctx.quadraticCurveTo(x + 45, yy + 16 * Math.sin(t * 1.1 + i + x / 160), x + 90, yy); ctx.stroke(); } }
function skylineAy(t, y, col) { for (let i = 0; i < 7; i++) { const x = 20 + i * 165, h = 150 + ((i * 53) % 110); cut(P_rr(x, y - h, 120, h, 4), col || '#3A2A28', { shadow: 0.2, edge: 3 });
    cut(() => { ctx.beginPath(); ctx.moveTo(x - 10, y - h); ctx.lineTo(x + 60, y - h - 90); ctx.lineTo(x + 130, y - h); ctx.closePath(); }, col || '#3A2A28', { shadow: 0.2, edge: 3 }); } }
function scalesTilt(x, y, s, tilt) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-12, -600, 24, 600, 6), AY.gold, { shadow: 0.3, edge: 3 }); cut(P_rr(-120, -20, 240, 30, 8), '#B8862A', { shadow: 0.2, edge: 3 });
  ctx.save(); ctx.translate(0, -580); ctx.rotate(tilt); cut(P_rr(-320, -10, 640, 20, 6), AY.gold, { shadow: 0.2, edge: 3 });
  for (const k of [-1, 1]) { ctx.save(); ctx.translate(k * 300, 0); ctx.rotate(-tilt); ctx.strokeStyle = AY.gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-70, 240); ctx.moveTo(0, 0); ctx.lineTo(70, 240); ctx.stroke();
    cut(() => { ctx.beginPath(); ctx.ellipse(0, 250, 100, 28, 0, 0, Math.PI); ctx.closePath(); }, '#E2B24A', { shadow: 0.3, edge: 3 }); if (k < 0) glow(0, 215, 85, '#FFF2C0', 0.7); else circle(0, 225, 30, '#1A0C10'); ctx.restore(); }
  ctx.restore(); ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);
  const shot = (i, note, draw, o = {}) => add({ id: 'S' + String(i + 1).padStart(2, '0'), at: cut_(i), cam: o.cam || [540, 900], zoom: o.zoom ?? 0.08, capY: o.capY ?? 1470, note, draw });
  const GY = 1280;

  // 0 HOOK: Rama on the throne, hand raised in judgment, a brother kneeling; blood sky, fast push-in
  { const mw = W_('मौत', 0);
    shot(0, 'HOOK: blood-red hall; Rama stands with his hand raised in judgment, a younger brother kneels; red flash on "मौत"', (lt, d, t) => {
      hall(t, { bg: '#5A1018', ground: '#2A0810', vig: 0.6 }); ram(400, GY + 20, 980, t, { pose: 'decree', aura: 1 });
      lakshman(840, GY + 110, 620, t, { dir: -1 }); if (lt > mw) flash(lt, mw, '#FF3A1A', 0.45); vignette(0.6);
    }, { zoom: 0.2, cam: [540, 840] });
    cue(0.08, 'swell', { dur: 2.0, gain: 0.55 }); cue(cut_(0) + mw, 'slam', { gain: 0.9 }); }
  // 1 the brother accepts without a word
  shot(1, 'close on the kneeling brother: head bowed, eyes closed, a single tear; dark hall behind', (lt, d, t) => {
    hall(t, { bg: '#3A1420', ground: '#1A0810', mid: false }); lakshman(540, 2150, 1800, t, { pose: 'stand', eyes: 0 }); fog(t, 1300, 0.25); vignette(0.6);
  }, { zoom: 0.08, cam: [540, 820], capY: 1560 });
  cue(cut_(1) + 0.3, 'heartbeat', { gain: 0.55 });
  // 2 Ayodhya calm, then an ascetic at the gate
  shot(2, 'golden Ayodhya skyline at dusk; a lone ascetic figure walks up to the palace gate', (lt, d, t) => {
    patta('#E0A860', t, { ground: '#8A5A2E', trees: false, hills: false, gy: 1180 }); sunDisc(860, 320, 90, t); skylineAy(t, 1180, '#7A4A36');
    doorway(540, GY + 20, 0.9, 0); const k = eo(seg(lt, 0.3, 1.5)); kaal(lerp(1180, 820, k), GY + 30, 760, t, { col: '#2A1A20' }); vignette(0.45);
  }, { zoom: 0.08 });
  cue(cut_(2) + 0.4, 'tock', { gain: 0.4 });
  // 3 "I must speak to Rama alone"
  shot(3, 'the hooded ascetic facing Rama across a dim hall, one diya between them', (lt, d, t) => {
    hall(t, { bg: '#2A1A2E', ground: '#140A10' }); diyaOut(540, GY - 40, 1.1, t, 1); glow(540, GY - 90, 260, '#FFB050', 0.3);
    ram(230, GY + 20, 820, t, { aura: 0.7 }); kaal(840, GY + 20, 840, t, { dir: -1 });
  }, { zoom: 0.08 });
  cue(cut_(3) + 0.2, 'tock', { gain: 0.35 });
  // 4 a condition
  shot(4, 'close on the hood: only the two red eye points burn in the dark', (lt, d, t) => {
    patta('#0E0810', t, { trees: false, ground: '#05030A', hills: false, gy: 1700 }); kaal(540, 2500, 2100, t); fog(t, 1300, 0.3); vignette(0.72);
  }, { zoom: 0.1, cam: [540, 820], capY: 1560 });
  cue(cut_(4) + 0.3, 'drone', { dur: 1.6, gain: 0.5 });
  // 5 whoever hears us dies
  { const mw = W_('मृत्युदंड', 5);
    shot(5, 'a dark sword shadow sweeps across the empty hall on "मृत्युदंड"', (lt, d, t) => {
      hall(t, { bg: '#2A0810', ground: '#120406', mid: false, vig: 0.65 });
      ctx.save(); ctx.globalAlpha = 0.55; ram(250, GY + 20, 840, t); ctx.restore();
      kaal(820, GY + 20, 880, t, { dir: -1 });
      if (lt > mw - 0.35) { const k = clamp((lt - mw + 0.35) / 0.35); ctx.save(); ctx.translate(lerp(1250, -250, k), 560); ctx.rotate(-0.55); ctx.fillStyle = rgba('#05030A', 0.9); ctx.fillRect(-26, -640, 52, 1280); ctx.restore(); }
      flash(lt, mw, '#FF3A1A', 0.4);
    }, { zoom: 0.06 });
    cue(cut_(5) + mw, 'slam', { gain: 0.95 }); }
  // 6 Rama gives his word
  shot(6, 'close on Rama: he raises his hand and gives his word, a gold ring of light closes around his wrist', (lt, d, t) => {
    hall(t, { bg: '#2A1A2E', ground: '#140A10', mid: false }); ram(540, 2200, 1850, t, { pose: 'decree', aura: 1 });
    const k = eo(seg(lt, 0.3, 1.1)); ctx.strokeStyle = rgba('#FFD86A', 0.9 * k); ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(690, 690, 120, 0, TAU * k); ctx.stroke(); glow(690, 690, 220, '#FFD86A', 0.4 * k);
  }, { zoom: 0.08, cam: [540, 820], capY: 1560 });
  cue(cut_(6) + 0.3, 'bell', { gain: 0.5 });
  // 7 the dearest brother set at the door
  shot(7, 'Lakshmana posted outside the closed door, spear upright, lamps low; Rama\'s silhouette vanishing inside', (lt, d, t) => {
    hall(t, { bg: '#241830', ground: '#120A14' }); doorway(540, GY + 20, 1.0, 0);
    lakshman(250, GY + 30, 820, t, { aura: 0.5 }); cut(P_rr(248, GY - 1180, 12, 1180, 4), '#4A3020', { shadow: 0.2, edge: 2 });
    diyaOut(880, GY - 30, 0.9, t, 1); vignette(0.6);
  }, { zoom: 0.08 });
  cue(cut_(7) + 0.4, 'thud', { gain: 0.5 });
  // 8 "I am Kaal"
  { const kw = W_('काल', 8);
    shot(8, 'inside: the hood falls back into pure shadow, the red eyes flare wide on "काल"', (lt, d, t) => {
      patta('#140A18', t, { trees: false, ground: '#07040C', hills: false, gy: 1600 }); kaal(540, 2300, 1950, t);
      if (lt > kw) { glow(540, 640, 600 * clamp((lt - kw) / 0.5), '#FF2A10', 0.4); } flash(lt, kw, '#FF5A3A', 0.4);
    }, { zoom: 0.11, cam: [540, 820], capY: 1560 });
    cue(cut_(8) + kw, 'drum', { gain: 0.8 }); }
  // 9 Time erases everyone
  shot(9, 'crowns, thrones and spears crumbling into drifting dust against a black field of stars', (lt, d, t) => {
    patta('#0A0812', t, { trees: false, ground: '#05030A', hills: false, gy: 1500 }); stars(t, 120, -200, 1100, 9, 0.7);
    const k = clamp(lt / Math.max(d, 0.1)); throne(540, 1180, 1.1, t, 1, eio(k));
    ctx.save(); ctx.globalAlpha = 0.85; mist(1200, 700, '#8A7A6A', 0.5 * k, t, 3, 60); ctx.restore(); vignette(0.6);
  }, { zoom: 0.08, cam: [540, 880] });
  cue(cut_(9) + 0.2, 'whoosh', { gain: 0.45 });
  // 10 but the real test was still to come
  shot(10, 'the closed door from inside, a thin blade of light under it; a shadow of feet arrives outside', (lt, d, t) => {
    hall(t, { bg: '#1A1020', ground: '#0A0610', mid: false, vig: 0.7 }); doorway(540, GY + 20, 1.15, 0, { inner: '#0A0508' });
    ctx.fillStyle = rgba('#FFB050', 0.85); ctx.fillRect(330, GY - 2, 420, 16); glow(540, GY + 6, 300, '#FFB050', 0.5);
    const k = eo(seg(lt, 0.25, 1.0)); ctx.save(); ctx.globalAlpha = k;
    for (const x of [450, 630]) cut(P_rr(x - 52, GY - 58, 104, 70, 14), '#05030A', { shadow: 0, edge: 0 });
    ctx.fillStyle = rgba('#05030A', 0.75 * k); ctx.fillRect(330, GY - 2, 420, 16); ctx.restore();
    ctx.save(); ctx.globalAlpha = 0.5; lakshman(150, GY + 30, 700, t, { eyes: 1 }); ctx.restore();
  }, { zoom: 0.12, cam: [540, 980] });
  cue(cut_(10) + 0.5, 'heartbeat', { gain: 0.6 });
  // 11 Durvasa arrives
  shot(11, 'Durvasa at the gate: white beard, saffron, fire in his eyes, embers rising around him', (lt, d, t) => {
    patta('#4A1410', t, { ground: '#1A0806', trees: false, hills: false, gy: 1260 }); doorway(820, GY + 20, 0.85, 0);
    durvasa(360, GY + 20, 900, t); for (let i = 0; i < 8; i++) { const k = (t * 0.6 + rnd(i)) % 1; circle(220 + rnd(i + 3) * 320, GY - k * 900, 7, rgba('#FF8A3A', 1 - k)); } vignette(0.55);
  }, { zoom: 0.1 });
  cue(cut_(11) + 0.2, 'drum', { gain: 0.6 });
  // 12 or I curse Ayodhya
  { const sw = W_('श्राप', 12);
    shot(12, 'Durvasa raises his hand over the Ayodhya skyline; on "श्राप" lightning hits and the city goes red', (lt, d, t) => {
      patta(lt > sw ? '#5A0A10' : '#3A1A18', t, { ground: '#120406', trees: false, hills: false, gy: 1200 }); skylineAy(t, 1200, lt > sw ? '#2A0A0A' : '#4A2A28');
      if (lt > sw) lightning(lt - sw, 620, 120, 980); durvasa(240, GY + 30, 940, t); flash(lt, sw, '#FFD0C0', 0.28); vignette(0.6);
    }, { zoom: 0.1 });
    cue(cut_(12) + sw, 'slam', { gain: 1 }); }
  // 13 two roads
  shot(13, 'Lakshmana alone at the door, the frame split: warm lamp light on one side, red fire glow on the other', (lt, d, t) => {
    hall(t, { bg: '#241424', ground: '#120A12', mid: false }); ctx.save(); ctx.globalAlpha = 0.4; ctx.fillStyle = '#FF3A1A'; ctx.fillRect(560, 0, 560, H); ctx.restore();
    doorway(300, GY + 20, 0.8, 0); lakshman(620, GY + 30, 860, t, { aura: 0.5 }); vignette(0.6);
  }, { zoom: 0.08 });
  cue(cut_(13) + 0.2, 'tock', { gain: 0.4 });
  // 14 open the door and die
  shot(14, 'his hand on the door ring; a faint sword shadow waits behind him', (lt, d, t) => {
    hall(t, { bg: '#1A1020', ground: '#0A0610', mid: false, vig: 0.7 }); doorway(540, GY + 20, 1.2, 0.04);
    ctx.save(); ctx.globalAlpha = 0.5; ctx.translate(820, 500); ctx.rotate(0.35); ctx.fillStyle = '#05030A'; ctx.fillRect(-18, -420, 36, 900); ctx.restore();
    lakshman(300, GY + 30, 760, t, { dir: 1 });
  }, { zoom: 0.1, cam: [540, 920] });
  cue(cut_(14) + 0.2, 'heartbeat', { gain: 0.6 });
  // 15 or the whole city burns
  shot(15, 'the Ayodhya skyline swallowed by fire, ash falling', (lt, d, t) => {
    patta('#5A1A08', t, { ground: '#1A0806', trees: false, hills: false, gy: 1220 }); skylineAy(t, 1220, '#2A1210');
    for (let i = 0; i < 6; i++) flames(90 + i * 190, 1230, 1.1, t + i); for (let i = 0; i < 20; i++) { const k = (t * 0.35 + rnd(i)) % 1; circle(rnd(i + 5) * 1080, k * 1920, 6, rgba('#6A6A6A', 0.6)); } vignette(0.62);
  }, { zoom: 0.08 });
  cue(cut_(15) + 0.2, 'whoosh', { gain: 0.6 });
  // 16 he opens the door
  { const dw = W_('दरवाज़ा', 16);
    shot(16, 'the door swings open on "दरवाज़ा", a blade of white light cuts across Lakshmana', (lt, d, t) => {
      hall(t, { bg: '#1A1020', ground: '#0A0610', mid: false, vig: 0.65 });
      const o = eob(clamp((lt - dw + 0.1) / 0.45)); doorway(600, GY + 20, 1.1, o, { light: '#FFE6B0' });
      lakshman(230, GY + 30, 820, t); if (lt > dw) flash(lt, dw, '#FFF2D8', 0.3);
    }, { zoom: 0.1, cam: [540, 900] });
    cue(cut_(16) + dw - 0.1, 'whoosh', { gain: 0.5 }); cue(cut_(16) + dw, 'slam', { gain: 0.85 }); }
  // 17 REVEAL: Lakshmana
  { const nw = W_('लक्ष्मण', 17);
    shot(17, 'REVEAL: Lakshmana full figure in white and gold under a huge pale moon, the open door behind him; name lands', (lt, d, t) => {
      patta('#141B3A', t, { trees: false, ground: '#0A0812' }); cut(P_circ(540, 520, 290), '#E8E2D2', { shadow: 0.2, edge: 4 }); glow(540, 520, 480, '#BFD0FF', 0.25);
      doorway(830, GY + 10, 0.7, 1, { light: '#FFC070' }); lakshman(450, GY + 30, 1060, t, { aura: 1 });
      flash(lt, nw, '#FFFFFF', 0.4); ring(lt, nw, 540, 1250, '#FFE6D0');
    }, { zoom: 0.12, cam: [540, 820] });
    cue(cut_(17) + nw, 'slam', { gain: 1 }); cue(cut_(17) + nw, 'conch', { gain: 0.5 }); }
  // 18 Rama bound by his own word
  shot(18, 'Rama on the throne, head bowed, the gold ring of his vow tightening around him like a chain', (lt, d, t) => {
    hall(t, { bg: '#2A1A2E', ground: '#140A10' }); throne(540, GY + 10, 1.0, t); ram(540, GY + 20, 900, t, { pose: 'stand', aura: 0.6 });
    const k = 0.6 + 0.4 * Math.sin(lt * 1.6); ctx.strokeStyle = rgba('#FFD86A', 0.85); ctx.lineWidth = 10; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(540, 760 + i * 150, 260 - i * 20, 56, 0, 0, TAU); ctx.stroke(); } glow(540, 860, 420, '#FFD86A', 0.18 * k); vignette(0.6);
  }, { zoom: 0.08 });
  cue(cut_(18) + 0.3, 'drone', { dur: 1.8, gain: 0.45 });
  // 19 the ministers: abandonment equals death
  shot(19, 'three ministers in a row before the throne, heads bowed; golden scales behind them tipping to the dark pan', (lt, d, t) => {
    hall(t, { bg: '#241830', ground: '#120A14' }); scalesTilt(820, GY - 20, 0.8, 0.22);
    for (let i = 0; i < 3; i++) raja({ x: 170 + i * 150, y: GY + 30, h: 620, t: t + i, pose: 'stand', robe: '#D8CCB0', sash: '#8A5A2E', eyes: 1, crown: false, wrap: '#C8A050' }); vignette(0.6);
  }, { zoom: 0.08 });
  cue(cut_(19) + 0.2, 'tock', { gain: 0.4 });
  // 20 Lakshmana: do not break your word
  shot(20, 'Lakshmana close, calm, looking straight at Rama, a steady gold glow; no fear', (lt, d, t) => {
    hall(t, { bg: '#1E1428', ground: '#0E0812', mid: false }); lakshman(540, 2150, 1800, t, { aura: 1 }); vignette(0.58);
  }, { zoom: 0.08, cam: [540, 820], capY: 1560 });
  cue(cut_(20) + 0.2, 'bell', { gain: 0.45 });
  // 21 he walks to the Sarayu
  shot(21, 'a small white figure walking away along the moonlit Sarayu, the city dark behind him', (lt, d, t) => {
    patta('#141B3A', t, { trees: false, ground: '#1A1420', hills: false, gy: 1100 }); stars(t, 110, -200, 900, 21, 0.7); moonDisc(840, 260, 70);
    skylineAy(t, 1100, '#1A1218'); river(t, 1180); lakshman(lerp(760, 540, clamp(lt / Math.max(d, 0.1))), 1210, 420, t, { pose: 'walk', dir: -1, aura: 0.5 }); fog(t, 1250, 0.3); vignette(0.55);
  }, { zoom: 0.1, cam: [540, 900] });
  cue(cut_(21) + 0.2, 'swell', { dur: 2.0, gain: 0.45 });
  // 22 he stops his breath (no gore: he dissolves into light on the water)
  shot(22, 'he stands still at the water; his figure softens into light that spreads out over the river', (lt, d, t) => {
    patta('#141B3A', t, { trees: false, ground: '#1A1420', hills: false, gy: 1100 }); stars(t, 110, -200, 900, 22, 0.7); moonDisc(840, 260, 70); river(t, 1180);
    const f = eo(seg(lt, 0.6, 2.2)); ctx.save(); ctx.globalAlpha = 1 - 0.55 * f; lakshman(540, 1210, 430, t, { aura: 1 }); ctx.restore();
    glow(540, 1050, 300 + 520 * f, '#CFE4FF', 0.5); ring(lt, 0.9, 540, 1080, '#CFE4FF'); ring(lt, 1.9, 540, 1080, '#CFE4FF');
    for (let i = 0; i < 14; i++) { const k = (lt * 0.3 + rnd(i)) % 1; circle(300 + rnd(i + 4) * 480, 1180 - k * 420, 6, rgba('#CFE4FF', (1 - k) * 0.8 * f)); }
    fog(t, 1250, 0.3); vignette(0.6);
  }, { zoom: 0.08, cam: [540, 900] });
  cue(cut_(22) + 0.4, 'bell', { gain: 0.5 });
  // 23 LOOP: was there another way?
  shot(23, 'LOOP: the golden scales again, one pan a crown, the other a brother\'s silhouette, tipping back and forth', (lt, d, t) => {
    patta('#141B3A', t, { trees: false, ground: '#0A0812' }); stars(t, 100, -200, 1000, 23, 0.6); scalesTilt(540, GY - 10, 1.0, 0.2 * Math.sin(lt * 1.3)); vignette(0.55);
  }, { zoom: 0.08, cam: [540, 860] });
  cue(cut_(23), 'bell', { gain: 0.4 });
  // 24 end card
  shot(24, 'end card', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 100, -200, 1000, 33, 0.6);
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.1, 0.5)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 620, 120, '#F6D98A'); ctx.restore();
  }, { zoom: 0.05 });
  cue(cut_(24), 'bell', { gain: 0.5 });
  return { shots: S, cues: CUES };
}
