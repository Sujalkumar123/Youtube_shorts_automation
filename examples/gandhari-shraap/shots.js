// श्रीकृष्ण को भी एक श्राप मिला था — Gandhari's curse. Pattachitra-inspired cut paper.
// Mahabharata, Stri Parva 25; Mausala Parva.
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

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);
  const shot = (i, note, draw, o = {}) => add({ id: 'S' + String(i + 1).padStart(2, '0'), at: cut_(i), cam: o.cam || [540, 900], zoom: o.zoom ?? 0.08, capY: o.capY ?? 1470, note, draw });
  const GY = 1280;
  // 0 HOOK: Krishna under a red sky, a curse ring of red light closing around him
  shot(0, 'HOOK: Krishna stands calm while a ring of red curse-light closes around him, blood-red sky', (lt, d, t) => {
    patta('#5A0E18', t, { ground: '#1A0608', trees: false, hill: rgba('#000000', 0.35) }); glow(540, 700, 600, '#FF3A1A', 0.25);
    krishna(540, GY + 10, { s: 1.0, t, pose: 'flute', aura: 1 }); const k = eo(seg(lt, 0.2, d));
    ctx.save(); ctx.strokeStyle = rgba('#FF4A2A', 0.8); ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(540, 900, 520 - 260 * k, 640 - 300 * k, 0, 0, TAU); ctx.stroke(); ctx.restore(); vignette(0.6);
  }, { zoom: 0.14, cam: [540, 820] });
  cue(0.15, 'swell', { dur: 2.4, gain: 0.55 }); cue(2.6, 'heartbeat', { gain: 0.7 });
  // 1 the one who cursed... was a mother (silhouette only, hidden)
  shot(1, 'a woman in white seen only from behind as a dark silhouette, cloth band trailing in the wind', (lt, d, t) => {
    patta('#1A1426', t, { trees: false, hills: false, ground: '#0A0812' }); moonDisc(540, 420, 140);
    ctx.save(); ctx.globalAlpha = 0.95; devi({ x: 540, y: GY + 40, h: 1050, t, sari: '#0A0812', border: '#0A0812', pose: 'stand', eyes: 0 }); ctx.restore(); fog(t, 1250, 0.4); vignette(0.65);
  }, { zoom: 0.12, cam: [540, 860] });
  cue(cut_(1), 'bell', { gain: 0.4 });
  // 2 the war is over, her hundred sons dead
  shot(2, 'Kurukshetra at sunset after the war: fallen spears and flags, a hundred small white lamps on the ground', (lt, d, t) => {
    battlefield(t); for (let i = 0; i < 40; i++) { const x = 60 + (i * 97) % 960, y = 1380 + ((i * 53) % 160); ctx.save(); ctx.globalAlpha = eo(seg(lt, i * 0.04, i * 0.04 + 0.6)); diyaOut(x, y, 0.35, t, 1); ctx.restore(); }
  }, { zoom: 0.06 });
  cue(cut_(2), 'drum', { gain: 0.4 });
  // 3 "you could have stopped this war"
  shot(3, 'Gandhari (white sari, cloth over her eyes) faces Krishna, her hand pointing at him, tears', (lt, d, t) => {
    battlefield(t); gandhari(300, GY + 20, 900, t, { tears: 1 }); krishna(780, GY + 10, { s: 0.85, t, pose: 'flute', aura: 0.6 }); vignette(0.5);
  }, { zoom: 0.08 });
  // 4 the curse: in 36 years your clan will destroy itself
  { const sw = W_('छत्तीस', 4);
    shot(4, 'close: Gandhari raises her hand, red light bursts from it toward Krishna; the number 36 is NOT written', (lt, d, t) => {
      patta('#3A0A10', t, { ground: '#120406', trees: false }); gandhari(380, GY + 20, 1050, t, { tears: 1, sari: '#F2EEE6' }); flash(lt, sw, '#FFD0C0', 0.6);
      if (lt > sw) { glow(700, 640, 260 + 120 * Math.sin(t * 6), '#FF3A1A', 0.6); for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + t; circle(700 + Math.cos(a) * 160, 640 + Math.sin(a) * 160, 10, rgba('#FFB090', 0.8)); } }
      vignette(0.6);
    }, { zoom: 0.12, cam: [480, 820] });
    cue(cut_(4) + sw, 'slam', { gain: 0.9 }); cue(cut_(4) + sw + 0.1, 'drum', { gain: 0.6 }); }
  // 5 you will die alone in a forest
  shot(5, 'a dark lonely forest at night, one empty path, a single falling leaf', (lt, d, t) => {
    nightField(t, { seed: 5, trees: true }); moonDisc(780, 300, 60); for (let i = 0; i < 3; i++) bareTree(150 + i * 380, GY + 20, 1.3, t); fog(t, 1180, 0.5); vignette(0.7);
  }, { zoom: 0.1 });
  cue(cut_(5), 'tock', { gain: 0.4 });
  // 6 Krishna smiled and accepted
  shot(6, 'close-up: Krishna calmly smiles, blue light around him, palm raised in blessing', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); godRays(540, 500, 0, TAU, 20, 1300, '#9FC4FF', 0.12, t); krishna(540, GY + 300, { s: 1.35, t, pose: 'lift', aura: 1 });
  }, { zoom: 0.12, cam: [540, 760], capY: 1560 });
  cue(cut_(6), 'conch', { gain: 0.45 });
  // 7 the real pain was still to come
  shot(7, 'black screen, a thin crack of red light splits it', (lt, d, t) => {
    patta('#05060E', t, { trees: false, hills: false, ground: '#05060E' }); const k = eo(seg(lt, 0.2, d)); ctx.strokeStyle = rgba('#FF4A2A', 0.9); ctx.lineWidth = 6 + 10 * k; ctx.beginPath(); ctx.moveTo(540, 300); ctx.lineTo(500, 600); ctx.lineTo(580, 900); ctx.lineTo(520, 1200 * k + 300 * (1 - k)); ctx.stroke(); glow(540, 800, 300 * k, '#FF3A1A', 0.4 * k);
  }, { zoom: 0.2, cam: [540, 820] });
  cue(cut_(7), 'swell', { dur: 1.6, gain: 0.45 });
  // 8 36 years later: Yadavas fight, grass becomes iron clubs
  { const gw = W_('घास', 8);
    shot(8, 'Dwarka seashore at dusk: dark silhouettes of men fighting; reeds on the shore turn into grey iron clubs', (lt, d, t) => {
      patta('#4A2A3A', t, { ground: '#1E1420', trees: false }); waves(1200, t, '#2F3F7A', 0.7);
      for (let i = 0; i < 5; i++) { ctx.save(); ctx.translate(150 + i * 200, GY + 20); ctx.rotate((i % 2 ? 1 : -1) * (0.12 + 0.05 * Math.sin(t * 6 + i))); raja({ x: 0, y: 0, h: 620, t, pose: 'walk', robe: '#100C14', sash: '#2A0A0A', eyes: 0, dir: i % 2 ? -1 : 1, crown: false, wrap: '#1A1418' }); ctx.restore(); }
      ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(40,20,50,0.55)'; ctx.fillRect(0, 700, 1080, 700); ctx.restore();
      const k = eo(seg(lt, gw - 0.2, gw + 1)); for (let i = 0; i < 10; i++) club(60 + i * 105, 1450, 0.8, -0.2 + (i % 3) * 0.2, k);
    }, { zoom: 0.08 });
    cue(cut_(8) + 0.4, 'thud', { gain: 0.5 }); cue(cut_(8) + gw + 0.4, 'slam', { gain: 0.7 }); }
  // 9 a hunter's arrow at Krishna's foot (no blood)
  { const tw = W_('तीर', 9);
    shot(9, 'Krishna resting under a tree, only his foot glows like a deer in the grass; a hunter in the bushes draws a bow; arrow flies (cut before impact)', (lt, d, t) => {
      nightField(t, { seed: 9, trees: false }); bareTree(700, GY + 20, 1.6, t); krishna(700, GY + 10, { s: 0.8, t, pose: 'flute', aura: 0.3 }); glow(760, GY - 20, 90, '#FFD27A', 0.6);
      raja({ x: 140, y: GY + 30, h: 640, t, pose: 'stand', robe: '#3A3A20', sash: '#1A1A10', eyes: 1, crown: false, wrap: '#4A3A20' });
      if (lt > tw) { const p = clamp((lt - tw) / 0.6); ctx.strokeStyle = '#2A1A10'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(lerp(240, 720, p), lerp(GY - 300, GY - 30, p)); ctx.lineTo(lerp(240, 720, p) - 60, lerp(GY - 300, GY - 30, p) - 30); ctx.stroke(); }
      fog(t, 1250, 0.35); vignette(0.6);
    }, { zoom: 0.08 });
    cue(cut_(9) + tw, 'whoosh', { gain: 0.8 }); cue(cut_(9) + tw + 0.6, 'thud', { gain: 0.6 }); }
  // 10 the sea swallowed Dwarka
  shot(10, 'golden Dwarka sinks as a huge wave rises over it', (lt, d, t) => {
    patta('#2A3A6A', t, { ground: '#1A2448', trees: false }); const k = eio(seg(lt, 0.1, d)); dwarka(540, 1150, 1.0, t, k * 0.9);
    cut(() => { ctx.beginPath(); ctx.moveTo(0, 1920); ctx.lineTo(0, 1250 - 450 * k); for (let x = 0; x <= 1080; x += 60) ctx.lineTo(x, 1250 - 450 * k + Math.sin(x * 0.02 + t * 3) * 30); ctx.lineTo(1080, 1920); ctx.closePath(); }, '#2F4F9A', { shadow: 0.3, edge: 4 });
  }, { zoom: 0.08 });
  cue(cut_(10), 'swell', { dur: 2, gain: 0.6 });
  // 11 REVEAL: Gandhari
  { const nw = W_('गांधारी', 11);
    shot(11, 'REVEAL: Gandhari full figure in white with her eye-cloth, against a huge pale moon; name lands', (lt, d, t) => {
      patta('#1A1426', t, { trees: false, ground: '#0A0812' }); cut(P_circ(540, 600, 300), '#E8E2D2', { shadow: 0.2, edge: 4 }); glow(540, 600, 500, '#BFD0FF', 0.25);
      gandhari(540, GY + 30, 1060, t, { tears: 1 }); flash(lt, nw, '#FFFFFF', 0.6); ring(lt, nw, 540, 600, '#FFE6D0');
    }, { zoom: 0.12, cam: [540, 820] });
    cue(cut_(11) + nw, 'slam', { gain: 1 }); cue(cut_(11) + nw, 'conch', { gain: 0.5 }); }
  // 12 a mother's tears spare no one, not even God
  shot(12, 'close-up: tears falling from under Gandhari\'s eye-cloth, each tear reflects a tiny golden Dwarka', (lt, d, t) => {
    patta('#1A1426', t, { trees: false, hills: false, ground: '#0A0812', gy: 1500 }); gandhari(540, 2300, 2000, t, { tears: 1 });
    for (let i = 0; i < 3; i++) { const p = (t * 0.5 + i / 3) % 1; circle(470 + i * 70, 760 + p * 500, 18, rgba('#BFE4FF', 0.9 * (1 - p))); }
    vignette(0.6);
  }, { zoom: 0.1, cam: [540, 760], capY: 1560 });
  cue(cut_(12), 'bell', { gain: 0.4 });
  // 13 end card
  shot(13, 'end card', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 100, -200, 1000, 33, 0.6);
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.1, 0.5)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 620, 120, '#F6D98A'); ctx.restore();
  }, { zoom: 0.05 });
  cue(cut_(13), 'bell', { gain: 0.5 });
  return { shots: S, cues: CUES };
}
