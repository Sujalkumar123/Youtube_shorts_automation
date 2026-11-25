// श्रीकृष्ण ने एक योद्धा को मरने नहीं दिया — Ashwatthama's curse. Pattachitra-inspired cut paper, night palette.
// Mahabharata, Sauptika Parva; Asirgarh belief.
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

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);
  const shot = (i, note, draw, o = {}) => add({ id: 'S' + String(i + 1).padStart(2, '0'), at: cut_(i), cam: o.cam || [540, 900], zoom: o.zoom ?? 0.08, capY: o.capY ?? 1470, note, draw });
  const GY = 1280;

  // 0 HOOK: Krishna, hand raised; a dark warrior kneels, red wound glowing; mist
  shot(0, 'HOOK: Krishna with raised hand above a kneeling dark warrior whose forehead wound glows red, night mist', (lt, d, t) => {
    nightField(t, { seed: 1 }); moonDisc(860, 300, 80); glow(330, 520, 520, '#6F9BFF', 0.35);
    krishna(330, GY + 10, { s: 0.92, t, pose: 'lift', aura: 1 });
    ashw(760, GY + 20, { h: 760, t, eyes: 0, wound: eo(seg(lt, 0.4, 1.6)), dir: -1 }); fog(t, 1120, 0.45); vignette(0.6);
  }, { zoom: 0.14, cam: [560, 900] });
  cue(0.15, 'swell', { dur: 2.4, gain: 0.55 }); cue(1.6, 'heartbeat', { gain: 0.7 });
  // 1 death was too small a punishment
  shot(1, 'close-up: the warrior face, forehead wound pulsing, red eyes in darkness', (lt, d, t) => {
    patta(NIGHT.bg2, t, { trees: false, hills: false, ground: '#06081A', gy: 1420 }); aHead(540, 720, 3.1, t, { eyes: 1, wound: 1, glowEye: 0.5 * eo(seg(lt, 0.6, 1.6)) }); vignette(0.7);
  }, { zoom: 0.18, cam: [540, 720], capY: 1560 });
  cue(cut_(1) + 0.1, 'slam', { gain: 0.6 });
  // 2 last night of the war, he saw an owl
  shot(2, 'night forest: bare black tree, an owl with glowing eyes on a branch, warrior silhouette below looking up', (lt, d, t) => {
    nightField(t, { seed: 2, trees: false }); moonDisc(300, 300, 70); bareTree(720, GY, 1.6, t); owl(820, 640, 1.1, t, eo(seg(lt, 0.3, 1)));
    ashw(260, GY + 20, { h: 700, t, eyes: 1 }); fog(t, 1180, 0.35);
  }, { zoom: 0.1, cam: [640, 760] });
  cue(cut_(2) + 0.4, 'tock', { gain: 0.4 });
  // 3 the owl killing sleeping crows one by one
  shot(3, 'branch close-up: row of sleeping crows; the owl moves along, crows drop one by one (silhouette)', (lt, d, t) => {
    nightField(t, { seed: 3, trees: false, hills: false }); moonDisc(880, 260, 60);
    cut(() => { ctx.beginPath(); ctx.moveTo(-100, 760); ctx.quadraticCurveTo(540, 700, 1200, 800); ctx.lineTo(1200, 830); ctx.quadraticCurveTo(540, 735, -100, 790); ctx.closePath(); }, '#05070F', { shadow: 0, edge: 2 });
    const n = 5, k = lt / d * (n + 0.6);
    for (let i = 0; i < n; i++) { const x = 220 + i * 160, f = clamp(k - i - 0.6); if (f < 1) crow(x, 722, 1.6, 1, eio(f)); }
    owl(lerp(140, 980, clamp(k / n)), 640, 1.1, t, 1);
  }, { zoom: 0.06 });
  for (let i = 0; i < 5; i++) cue(cut_(3) + 0.6 + i * 0.62, 'thud', { gain: 0.35 });
  // 4 that night he entered the Pandava camp
  shot(4, 'camp of tents at midnight, a tall shadow walks in from the left, sword low', (lt, d, t) => {
    nightField(t, { seed: 4, trees: false }); moonDisc(880, 280, 60);
    for (let i = 0; i < 4; i++) tent(180 + i * 250, GY + 10, 0.9 + (i % 2) * 0.1, i % 2 ? '#3A2A4A' : '#2C2440');
    ashw(lerp(-120, 300, eo(seg(lt, 0, d))), GY + 30, { h: 980, t, pose: 'walk', eyes: 1, robe: '#05070F', sash: '#2A0A0A' }); fog(t, 1200, 0.4); vignette(0.55);
  }, { zoom: 0.08, cam: [520, 950] });
  cue(cut_(4), 'heartbeat', { gain: 0.8 }); cue(cut_(4) + 0.9, 'heartbeat', { gain: 0.8 });
  // 5 morning: Draupadi's five sons never woke
  shot(5, 'grey dawn: five sleeping figures under white cloth, Draupadi kneeling, a diya gone out', (lt, d, t) => {
    patta('#5A6078', t, { ground: '#2E3246', leaf: '#3A4458', hill: rgba('#000000', 0.2), trees: false });
    for (let i = 0; i < 5; i++) sleeperFig(200 + i * 170, GY - 40 - (i % 2) * 18, 0.45, '#E8E2D2');
    devi({ x: 860, y: GY + 20, h: 700, t, sari: '#8E2414', border: PT.ochre, pose: 'bow', eyes: 0, dir: -1 }); diyaOut(120, GY - 10, 1.2, t, 0); vignette(0.5);
  }, { zoom: 0.06 });
  cue(cut_(5), 'bell', { gain: 0.35 });
  // 6 the real sin was still to come
  shot(6, 'black screen, a single red ember slowly grows into a burning arrow-tip', (lt, d, t) => {
    patta('#05060E', t, { trees: false, hills: false, ground: '#05060E' }); const k = eo(seg(lt, 0.2, d));
    glow(540, 820, 120 + 380 * k, '#FF5A1A', 0.25 + 0.5 * k); flames(540, 900, 0.3 + 0.8 * k, t);
  }, { zoom: 0.2, cam: [540, 860] });
  cue(cut_(6), 'swell', { dur: 1.8, gain: 0.5 });
  // 7 he turned the brahmastra toward a mother's womb
  { const gw = W_('गर्भ', 7);
    shot(7, 'riverbank at dawn, warrior on the left releases a blazing beam that bends toward a glowing womb (no gore)', (lt, d, t) => {
      patta('#3A2A4A', t, { ground: '#1E1830', leaf: NIGHT.leaf, hill: rgba('#000000', 0.25), trees: false }); waves(1200, t, '#2F3F7A', 0.7);
      ashw(200, GY + 20, { h: 820, t, eyes: 1, gem: 1 }); const p = eio(seg(lt, 0.3, Math.max(gw, 1)));
      womb(860, 620, 110, t, eo(seg(lt, gw - 0.6, gw)), 0); astraBeam(300, 600, 820, 640, p, t);
    }, { zoom: 0.08, cam: [540, 820] });
    cue(cut_(7) + 0.3, 'whoosh', { gain: 0.8 }); cue(cut_(7) + gw, 'slam', { gain: 0.6 }); }
  // 8 Krishna saved the child... then cursed
  { const sw = W_('श्राप', 8);
    shot(8, 'Krishna steps between; blue light shields the womb; then he turns, hand raised, curse light', (lt, d, t) => {
      patta(NIGHT.bg, t, { ground: NIGHT.ground, leaf: NIGHT.leaf, hill: rgba('#000000', 0.3) }); godRays(540, 400, 0, TAU, 20, 1300, '#9FC4FF', 0.12, t);
      womb(840, 560, 100, t, 1, 1); krishna(480, GY + 10, { s: 1.0, t, pose: lt > sw - 0.2 ? 'lift' : 'flute', aura: 1 });
      flash(lt, sw, '#DDEBFF', 0.7);
    }, { zoom: 0.1, cam: [540, 860] });
    cue(cut_(8), 'conch', { gain: 0.6 }); cue(cut_(8) + sw, 'slam', { gain: 0.9 }); }
  // 9 3000 years, alone, wounds never heal
  shot(9, 'the curse: a lone figure walking through endless dark mist, suns and moons spinning past above (years)', (lt, d, t) => {
    nightField(t, { seed: 9, trees: false, px: lt * 90 }); const a = lt * 2.6;
    sunDisc(540 + Math.cos(a) * 480, 700 - Math.abs(Math.sin(a)) * 420, 56, t); moonDisc(540 - Math.cos(a) * 480, 700 - Math.abs(Math.sin(a + 1)) * 400, 40);
    ashw(540, GY + 30, { h: 820, t, pose: 'walk', eyes: 0, robe: '#2A2A38', sash: '#4A1A14', wound: 1 }); fog(t, 1100, 0.6); vignette(0.6);
  }, { zoom: 0.06 });
  cue(cut_(9) + 0.2, 'drum', { gain: 0.5 }); cue(cut_(9) + 2.4, 'drum', { gain: 0.4 });
  // 10 the gem torn away, only a wound
  { const gw = W_('छीन', 10);
    shot(10, 'close-up: the forehead gem glowing, it lifts away and dims; a red wound remains', (lt, d, t) => {
      patta(NIGHT.bg2, t, { trees: false, hills: false, ground: '#06081A', gy: 1420 }); const k = eio(seg(lt, gw - 0.2, gw + 0.6));
      aHead(540, 760, 3.0, t, { eyes: 0, gem: 1 - k, wound: k });
      if (k > 0) { glow(540, 620 - 400 * k, 160, '#7FE0FF', 0.7 * (1 - k)); circle(540, 620 - 400 * k, 22, rgba('#DFFBFF', 1 - k)); }
    }, { zoom: 0.16, cam: [540, 740], capY: 1560 });
    cue(cut_(10) + gw, 'zip', { gain: 0.5 }); }
  // 11 his name was... Ashwatthama
  { const nw = W_('अश्वत्थामा', 11);
    shot(11, 'REVEAL: full warrior on a cliff against a huge red moon, wound glowing; name lands', (lt, d, t) => {
      patta('#2A0E14', t, { ground: '#0C0408', trees: false, hill: rgba('#000000', 0.4) }); glow(540, 560, 600, '#FF3A1A', 0.25);
      cut(P_circ(540, 560, 300), '#B5321F', { shadow: 0.2, edge: 4 }); ashw(540, GY + 20, { h: 1040, t, eyes: 1, robe: '#05070F', sash: '#3A0A0A', wound: 1 });
      flash(lt, nw, '#FFE6D0', 0.6); ring(lt, nw, 540, 560, '#FFB090');
    }, { zoom: 0.12, cam: [540, 820] });
    cue(cut_(11) + nw, 'slam', { gain: 1 }); cue(cut_(11) + nw, 'conch', { gain: 0.5 }); }
  // 12 Asirgarh: fresh flowers every morning
  shot(12, 'Asirgarh: an old fort on a hill at pre-dawn, a small Shiva temple, fresh flowers on the linga glow', (lt, d, t) => {
    patta('#2A3458', t, { ground: '#1A2038', leaf: NIGHT.leaf, hill: rgba('#000000', 0.25), trees: false }); stars(t, 60, -200, 700, 12, 0.5);
    for (let i = 0; i < 7; i++) cut(P_rr(60 + i * 140, 700 - (i % 2) * 40, 110, 220, 4), '#3A3A4E', { shadow: 0.2, edge: 3 });
    temple(540, GY + 10, 1.0, t, 0.55); shivling(540, GY - 20, { s: 0.45, t }); for (let i = 0; i < 7; i++) circle(470 + i * 22, GY - 110 - (i % 2) * 10, 11, i % 2 ? '#F2B8C6' : '#FFF6E6'); glow(540, GY - 110, 140, '#FFE0A0', 0.5);
  }, { zoom: 0.1, cam: [540, 960] });
  cue(cut_(12), 'bell', { gain: 0.5 });
  // 13 before the door opens
  shot(13, 'the temple door shut, mist, wet footprints leading away into the dark', (lt, d, t) => {
    patta('#1E2644', t, { ground: '#121830', trees: false }); temple(540, GY + 10, 1.05, t, 0);
    for (let i = 0; i < 7; i++) { ctx.save(); ctx.globalAlpha = 0.7 * eo(seg(lt, i * 0.15, i * 0.15 + 0.3)); cut(() => { ctx.beginPath(); ctx.ellipse(560 + i * 70 + (i % 2) * 20, GY + 60 + i * 30, 18, 30, 0.4, 0, TAU); }, '#0A0C18', { shadow: 0, edge: 0 }); ctx.restore(); }
    fog(t, 1150, 0.55); vignette(0.6);
  }, { zoom: 0.1, cam: [600, 1000] });
  cue(cut_(13) + 0.2, 'tock', { gain: 0.4 }); cue(cut_(13) + 0.6, 'tock', { gain: 0.35 });
  // 14 3000 years are not over yet: tall shadow in the fog, red wound in the dark
  shot(14, 'LOOP: a tall shadow in the fog at the forest edge, only the red forehead glow visible, it turns toward us', (lt, d, t) => {
    nightField(t, { seed: 14 }); moonDisc(840, 300, 60); fog(t, 1000, 0.5);
    ctx.save(); ctx.globalAlpha = 0.85; ashw(540, GY + 30, { h: 1100, t, eyes: 0, robe: '#05070F', sash: '#05070F', wound: 1 }); ctx.restore(); fog(t, 1150, 0.55); vignette(0.75);
  }, { zoom: 0.16, cam: [540, 760] });
  cue(cut_(14), 'heartbeat', { gain: 0.9 }); cue(cut_(14) + 1.0, 'heartbeat', { gain: 0.9 });
  // 15 follow card
  shot(15, 'end card: Untold Stories in gold on indigo with a red ember', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 100, -200, 1000, 33, 0.6);
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.1, 0.5)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 620, 120, '#F6D98A'); ctx.restore();
    glow(540, 860, 120, '#FF3A1A', 0.5 + 0.2 * Math.sin(t * 5));
  }, { zoom: 0.05 });
  cue(cut_(15), 'bell', { gain: 0.5 });
  return { shots: S, cues: CUES };
}
