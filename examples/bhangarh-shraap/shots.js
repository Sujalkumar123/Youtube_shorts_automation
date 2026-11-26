// भानगढ़ में सूरज ढलने के बाद जाना मना है — Bhangarh fort. Pattachitra-inspired cut paper, dusk/night palette.
// ASI notice; Raja Bhagwant Das; Singhia/Ratnavati legend.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, motes, vignette } from './atmos.js';
import { raja, devi, lightning, krishna, shivling, rain } from './cast.js';
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

// ---------- Bhangarh kit ----------
function fortRuin(x, y, s, t, o = {}) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const col = o.col || '#6E4A36', dk = o.dk || '#4A3022';
  cut(() => { ctx.beginPath(); ctx.moveTo(-620, 0); ctx.lineTo(-520, -180); ctx.lineTo(-300, -260); ctx.lineTo(0, -300); ctx.lineTo(320, -250); ctx.lineTo(560, -170); ctx.lineTo(640, 0); ctx.closePath(); }, '#3A2A22', { shadow: 0.3, edge: 4 });
  const blocks = [[-430, -250, 160, 140], [-250, -330, 220, 200], [10, -400, 180, 260], [220, -330, 170, 170], [400, -250, 130, 110]];
  for (const [bx, by, bw, bh] of blocks) { cut(P_rr(bx, by, bw, bh, 4), col, { shadow: 0.4, edge: 4 }); for (let i = 0; i < Math.floor(bw / 30); i++) cut(P_rr(bx + 6 + i * 30, by - 22, 18, 24, 2), col, { shadow: 0, edge: 2 }); cut(P_rr(bx + bw / 2 - 18, by + bh - 70, 36, 70, 14), dk, { shadow: 0, edge: 2 }); }
  cut(() => { ctx.beginPath(); ctx.moveTo(70, -400); ctx.quadraticCurveTo(100, -520, 130, -400); ctx.closePath(); }, col, { shadow: 0.2, edge: 3 });
  ctx.restore(); }
function bats(t, n = 9, a = 1) { ctx.save(); ctx.fillStyle = rgba('#05070F', a); for (let i = 0; i < n; i++) { const k = (t * 0.12 + i / n) % 1, x = 120 + ((i * 197) % 840) + Math.sin(t * 2 + i) * 40, y = 260 + ((i * 131) % 380) - k * 120, w = 26 + (i % 3) * 8, f = Math.sin(t * 14 + i) * 0.6;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x - w * 0.5, y - w * f, x - w, y + 4); ctx.quadraticCurveTo(x - w * 0.5, y + 2, x, y + 8); ctx.quadraticCurveTo(x + w * 0.5, y + 2, x + w, y + 4); ctx.quadraticCurveTo(x + w * 0.5, y - w * f, x, y); ctx.fill(); } ctx.restore(); }
function dusk(t, o = {}) { patta(o.bg || '#7A2E22', t, { ground: o.ground || '#2A1410', leaf: '#3A1E18', hill: rgba('#000000', 0.3), trees: o.trees ?? false, hills: o.hills, px: o.px }); }
function board(x, y, s, t, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-12, -40, 24, 380, 4), '#3A2A1E', { shadow: 0.3, edge: 3 }); cut(P_rr(-230, -300, 460, 290, 10), '#E8DCC2', { shadow: 0.4, edge: 6 }); cut(P_rr(-230, -300, 460, 60, 10), PT.ver, { shadow: 0, edge: 3 });
  for (let i = 0; i < 5; i++) cut(P_rr(-190, -210 + i * 36, 280 - (i % 2) * 60, 12, 6), '#5A4A3A', { shadow: 0, edge: 0 });
  circle(150, -130, 52, PT.ver); circle(150, -130, 40, '#E8DCC2'); ctx.strokeStyle = PT.ver; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(122, -158); ctx.lineTo(178, -102); ctx.stroke(); ctx.restore(); }
function house(x, y, s, roof = 1, lit = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(P_rr(-90, -150, 180, 150, 3), '#8A6248', { shadow: 0.35, edge: 3 });
  if (roof > 0.01) { ctx.save(); ctx.globalAlpha = roof; cut(P_poly([[-110, -150], [110, -150], [0, -230]]), '#6A3A28', { shadow: 0.2, edge: 3 }); ctx.restore(); }
  cut(P_rr(-26, -80, 52, 80, 20), lit ? rgba('#FFB050', lit) : '#2A1A12', { shadow: 0, edge: 2 }); ctx.restore(); }
function bottle(x, y, s, t, glowA = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -40, 220, '#B05AFF', 0.5 * glowA);
  cut(() => { ctx.beginPath(); ctx.moveTo(-20, -150); ctx.lineTo(20, -150); ctx.lineTo(22, -110); ctx.quadraticCurveTo(70, -90, 70, -30); ctx.quadraticCurveTo(70, 20, 0, 20); ctx.quadraticCurveTo(-70, 20, -70, -30); ctx.quadraticCurveTo(-70, -90, -22, -110); ctx.closePath(); }, '#7A3FB0', { shadow: 0.3, edge: 4 });
  cut(P_rr(-26, -180, 52, 34, 8), PT.ochre, { shadow: 0, edge: 3 });
  for (let i = 0; i < 6; i++) { const a = t * 1.5 + i * 1.05, r = 110 + 20 * Math.sin(t * 2 + i); circle(Math.cos(a) * r, -40 + Math.sin(a) * r * 0.6, 7, rgba('#E9C8FF', 0.8 * glowA)); } ctx.restore(); }
function rock(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); cut(() => { ctx.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, rr = r * (0.82 + 0.18 * Math.sin(i * 2.3)); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); }, '#5E5248', { shadow: 0.4, edge: 5 });
  for (let i = 0; i < 4; i++) circle(Math.cos(i * 1.7) * r * 0.45, Math.sin(i * 1.7) * r * 0.45, r * 0.08, '#4A4038'); ctx.restore(); }
function tantrik(x, y, h, t, o = {}) { raja({ x, y, h, t, pose: o.pose || 'stand', robe: '#151018', sash: '#5A0A0A', eyes: o.eyes ?? 1, dir: o.dir || 1, crown: false, bun: true, wrap: '#120A08' }); const s = h / 1150; glow(x, y - 900 * s, 90 * s * 3, '#FF2A10', 0.25 * (o.glowE ?? 1)); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);
  const shot = (i, note, draw, o = {}) => add({ id: 'S' + String(i + 1).padStart(2, '0'), at: cut_(i), cam: o.cam || [540, 900], zoom: o.zoom ?? 0.08, capY: o.capY ?? 1470, note, draw });
  const GY = 1280;
  // 0 HOOK: ruined fort at sunset, sun sinks, bats rise
  shot(0, 'HOOK: Bhangarh ruins on a hill, huge red sun sinking behind, bats rising, sky darkening', (lt, d, t) => {
    const k = eio(seg(lt, 0, d)); dusk(t, { bg: '#8A3A22' }); ctx.save(); ctx.globalAlpha = 0.6 * k; ctx.fillStyle = '#0C1128'; ctx.fillRect(0, 0, W, H); ctx.restore();
    sunDisc(540, 560 + 380 * k, 150, t); fortRuin(540, 1060, 0.85, t); bats(t, 10, k); fog(t, 1180, 0.35); vignette(0.55);
  }, { zoom: 0.12, cam: [540, 820] });
  cue(0.1, 'swell', { dur: 2.4, gain: 0.55 }); cue(3.4, 'heartbeat', { gain: 0.6 });
  // 1 ASI board at the gate
  shot(1, 'the ASI warning board at the stone gate (no readable text), red stop sign, dusk', (lt, d, t) => {
    dusk(t, { bg: '#5A2A2E' }); cut(P_rr(620, 520, 340, 760, 10), '#6E4A36', { shadow: 0.4, edge: 5 }); cut(() => { ctx.beginPath(); ctx.moveTo(680, 1280); ctx.lineTo(680, 760); ctx.quadraticCurveTo(790, 620, 900, 760); ctx.lineTo(900, 1280); ctx.closePath(); }, '#1A0E0A', { shadow: 0, edge: 3 });
    board(330, 1180, 1.0 + 0.04 * eo(seg(lt, 0, d)), t); vignette(0.5);
  }, { zoom: 0.1, cam: [480, 900] });
  cue(cut_(1) + 0.3, 'thud', { gain: 0.5 });
  // 2 Raja Bhagwant Das builds the city for his son
  shot(2, 'golden afternoon: the king with his young son, the fort-city alive behind them, flags', (lt, d, t) => {
    patta(PT.sky, t, { ground: PT.grnD, leaf: PT.grn }); fortRuin(540, 1000, 0.7, t, { col: '#C88A5A', dk: '#8A5A3A' });
    raja({ x: 380, y: GY + 20, h: 900, t, pose: 'stand', robe: PT.ver, sash: PT.ochre, eyes: 1 }); raja({ x: 640, y: GY + 20, h: 560, t, pose: 'stand', robe: PT.ochre, sash: PT.ver, eyes: 1 });
  }, { zoom: 0.08 });
  cue(cut_(2), 'conch', { gain: 0.4 });
  // 3 one day everything emptied
  shot(3, 'the same houses: lamps go out one by one and the roofs fade, dust blows', (lt, d, t) => {
    patta('#6A5A50', t, { ground: '#3A3028', trees: false }); const k = eo(seg(lt, 0.2, d));
    for (let i = 0; i < 5; i++) house(160 + i * 190, GY - 20 - (i % 2) * 30, 0.95, 1 - clamp(k * 1.4 - i * 0.15), 1 - clamp(k * 2 - i * 0.3)); mist(1150, 300, '#B8A890', 0.4, t, 6, 30);
  }, { zoom: 0.08 });
  cue(cut_(3) + 0.3, 'whoosh', { gain: 0.5 });
  // 4 the tantrik and princess Ratnavati
  shot(4, 'night: princess Ratnavati on a lit balcony; below in shadow a tantrik in black watches, red glow', (lt, d, t) => {
    nightField(t, { seed: 4, trees: false }); moonDisc(860, 260, 60); cut(P_rr(420, 520, 560, 760, 8), '#5A3A2E', { shadow: 0.4, edge: 5 }); cut(P_rr(470, 700, 460, 30, 4), PT.ochre, { shadow: 0, edge: 2 }); glow(700, 600, 300, '#FFB050', 0.35);
    devi({ x: 700, y: 720, h: 560, t, sari: '#B0306A', border: PT.ochre, pose: 'stand', eyes: 1 }); tantrik(220, GY + 30, 900, t, { eyes: 1 }); fog(t, 1200, 0.4); vignette(0.6);
  }, { zoom: 0.08, cam: [540, 860] });
  cue(cut_(4) + 0.4, 'tock', { gain: 0.4 });
  // 5 the perfume bottle, spell blown into it
  shot(5, 'close-up: a purple perfume bottle glowing, spell sparks spinning around it, the tantrik hand above', (lt, d, t) => {
    patta('#14081E', t, { trees: false, hills: false, ground: '#0A0612' }); bottle(540, 980, 2.2, t, eo(seg(lt, 0.2, 1.2)));
    ctx.save(); ctx.globalAlpha = 0.9; cut(() => { ctx.beginPath(); ctx.ellipse(560, 420, 120, 70, -0.3, 0, TAU); }, '#3A2A24', { shadow: 0.2, edge: 4 }); ctx.restore();
  }, { zoom: 0.14, cam: [540, 820] });
  cue(cut_(5) + 0.4, 'swell', { dur: 1.6, gain: 0.45 });
  // 6 she understood and threw it at a rock
  { const tw = W_('फेंक', 6);
    shot(6, 'the princess flings the bottle; it arcs toward a huge rock on the hill', (lt, d, t) => {
      nightField(t, { seed: 6, trees: false }); moonDisc(200, 280, 60); rock(820, 1080, 190, 0);
      devi({ x: 260, y: GY + 20, h: 820, t, sari: '#B0306A', border: PT.ochre, pose: 'stand', eyes: 1 });
      const p = clamp((lt - (tw - 0.4)) / 0.9); if (p > 0) { const bx = lerp(360, 760, p), by = 760 - Math.sin(p * Math.PI) * 300 + p * 220; bottle(bx, by, 0.6, t, 1); } else bottle(340, 820, 0.6, t, 1);
      if (lt > tw + 0.5) glow(780, 1000, 300, '#B05AFF', 0.6 * (1 - clamp(lt - tw - 0.5)));
    }, { zoom: 0.08 });
    cue(cut_(6) + tw, 'whoosh', { gain: 0.7 }); cue(cut_(6) + tw + 0.5, 'slam', { gain: 0.5 }); }
  // 7 the rock rolled and crushed the tantrik (silhouette, no gore)
  { const kw = W_('कुचल', 7);
    shot(7, 'the giant rock rolls down the slope toward the black-robed tantrik; dust, cut on impact (no gore)', (lt, d, t) => {
      dusk(t, { bg: '#2A1A2E' }); cut(() => { ctx.beginPath(); ctx.moveTo(0, 600); ctx.lineTo(1080, 1250); ctx.lineTo(1080, 1920); ctx.lineTo(0, 1920); ctx.closePath(); }, '#2A1E18', { shadow: 0.2, edge: 4 });
      const p = eio(clamp(lt / Math.max(kw, 0.5))); const rx = lerp(120, 800, p), ry = lerp(560, 1010, p) - 160;
      if (lt < kw) tantrik(860, GY + 20, 760, t, { eyes: 1, dir: -1 }); rock(rx, ry, 170, p * 8); if (lt > kw) { mist(1100, 400, '#8A7A6A', 0.7 * (1 - clamp((lt - kw) / 1.5)), t, 3, 60); flash(lt, kw, '#FFFFFF', 0.4); }
    }, { zoom: 0.06 });
    cue(cut_(7) + 0.2, 'drum', { gain: 0.6 }); cue(cut_(7) + kw, 'slam', { gain: 1 }); }
  // 8 the curse
  { const sw = W_('श्राप', 8);
    shot(8, 'dying tantrik raises a hand to the sky, blood-red sky, lightning over the city', (lt, d, t) => {
      patta('#4A0A12', t, { ground: '#120406', trees: false }); fortRuin(540, 1040, 0.75, t, { col: '#3A2026', dk: '#1A0A0E' });
      if (lt > sw) lightning(lt - sw, 700, 200, 900); flash(lt, sw, '#FFD0C0', 0.6);
      ctx.save(); ctx.globalAlpha = 0.95; cut(() => { ctx.beginPath(); ctx.moveTo(480, 1920); ctx.lineTo(520, 1300); ctx.lineTo(560, 1180); ctx.lineTo(600, 1300); ctx.lineTo(640, 1920); ctx.closePath(); }, '#05030A', { shadow: 0, edge: 2 }); ctx.restore(); vignette(0.65);
    }, { zoom: 0.12, cam: [540, 900] });
    cue(cut_(8) + sw, 'slam', { gain: 0.9 }); cue(cut_(8) + sw + 0.2, 'drum', { gain: 0.6 }); }
  // 9 history: famine and wars
  shot(9, 'history: cracked dry earth under a white sun, broken swords and an empty pot by the ruins', (lt, d, t) => {
    patta('#C8A070', t, { ground: '#8A6A44', trees: false, hill: rgba('#000000', 0.15) }); sunDisc(820, 300, 90, t);
    ctx.strokeStyle = '#5A3E24'; ctx.lineWidth = 4; for (let i = 0; i < 14; i++) { ctx.beginPath(); const x = (i * 83) % 1080; ctx.moveTo(x, 1320); ctx.lineTo(x + 40, 1400); ctx.lineTo(x + 10, 1520); ctx.stroke(); }
    fortRuin(540, 1160, 0.6, t, { col: '#9A7050', dk: '#6A4A30' }); for (let i = 0; i < 2; i++) { ctx.save(); ctx.translate(300 + i * 420, 1340); ctx.rotate(-0.5 + i); cut(P_rr(-6, -120, 12, 160, 3), '#8A8A90', { shadow: 0.2, edge: 2 }); ctx.restore(); }
  }, { zoom: 0.06 });
  cue(cut_(9), 'tock', { gain: 0.35 });
  // 10 the houses have no roofs
  { const rw = W_('छतें', 10);
    shot(10, 'moonlit street of roofless houses; camera rises to show every house open to the sky', (lt, d, t) => {
      nightField(t, { seed: 10, trees: false }); moonDisc(540, 260, 80);
      for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) house(110 + i * 175 + r * 80, GY - 160 + r * 190, 0.8 + r * 0.15, lt < rw - 0.3 ? 1 : 0, 0);
      ring(lt, rw, 540, 900, '#BFD0FF'); fog(t, 1250, 0.35);
    }, { zoom: 0.12, cam: [540, 960] });
    cue(cut_(10) + rw, 'thud', { gain: 0.6 }); }
  // 11 guards push everyone out at sunset
  shot(11, 'dusk at the gate: a guard with a lathi blows a whistle, small figures hurry out, the sun is gone', (lt, d, t) => {
    dusk(t, { bg: '#3A1E2E' }); cut(P_rr(300, 400, 480, 900, 10), '#4A3026', { shadow: 0.4, edge: 5 }); cut(() => { ctx.beginPath(); ctx.moveTo(400, 1300); ctx.lineTo(400, 760); ctx.quadraticCurveTo(540, 600, 680, 760); ctx.lineTo(680, 1300); ctx.closePath(); }, '#0A0608', { shadow: 0, edge: 3 });
    raja({ x: 820, y: GY + 20, h: 780, t, pose: 'stand', robe: '#5A5A3A', sash: '#2A2A1A', eyes: 1, dir: -1, crown: false, wrap: '#C8A040' }); for (let i = 0; i < 4; i++) { const x = lerp(520 + i * 30, -60 - i * 60, eo(seg(lt, i * 0.3, d))); raja({ x, y: GY + 40, h: 420, t, pose: 'walk', robe: '#2A2A38', sash: '#1A1A28', eyes: 0, dir: -1, crown: false, wrap: '#E8DCC2' }); }
    bats(t, 6, 0.8); vignette(0.55);
  }, { zoom: 0.08 });
  cue(cut_(11) + 0.4, 'bell', { gain: 0.3 });
  // 12 would you stay? the dark gate, two red eyes
  shot(12, 'LOOP: the dark gate at night, fog pouring out, two faint red eyes appear in the doorway', (lt, d, t) => {
    nightField(t, { seed: 12, trees: false }); cut(P_rr(280, 360, 520, 980, 10), '#2A1E1A', { shadow: 0.4, edge: 5 }); cut(() => { ctx.beginPath(); ctx.moveTo(380, 1340); ctx.lineTo(380, 760); ctx.quadraticCurveTo(540, 580, 700, 760); ctx.lineTo(700, 1340); ctx.closePath(); }, '#020204', { shadow: 0, edge: 3 });
    const e = eo(seg(lt, 0.4, 1.2)); for (const k of [-1, 1]) { } fog(t, 1200, 0.5); vignette(0.7); for (const k of [-1, 1]) { glow(540 + k * 34, 880, 90, '#FF2A10', 0.9 * e); circle(540 + k * 34, 880, 11, rgba('#FF6040', e)); }
  }, { zoom: 0.18, cam: [540, 900] });
  cue(cut_(12), 'heartbeat', { gain: 0.9 });
  // 13 end card
  shot(13, 'end card: Untold Stories in gold on indigo', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 100, -200, 1000, 33, 0.6);
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.1, 0.5)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 620, 120, '#F6D98A'); ctx.restore(); bats(t, 5, 0.6);
  }, { zoom: 0.05 });
  cue(cut_(13), 'bell', { gain: 0.5 });
  return { shots: S, cues: CUES };
}
