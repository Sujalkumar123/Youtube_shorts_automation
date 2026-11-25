// कुम्भकर्ण ने नींद कभी माँगी ही नहीं थी — Kumbhakarna's slip of the tongue. Pattachitra-inspired cut paper.
// Valmiki Ramayana, Uttara Kanda 10; Yuddha Kanda 60-63.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Le, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, motes, vignette } from './atmos.js';
import { raja, devi, lightning } from './cast.js';
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

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);
  const shot = (i, note, draw, o = {}) => add({ id: 'S' + String(i + 1).padStart(2, '0'), at: cut_(i), cam: o.cam || [540, 900], zoom: o.zoom ?? 0.08, capY: o.capY ?? 1470, note, draw });
  const GY = 1280;

  // 0 · HOOK: the sleeping giant, the golden throne he wanted dissolving above him
  shot(0, 'HOOK: giant Kumbhakarna asleep across the frame, Indra-throne ghost cracking above, vermilion field', (lt, d, t) => {
    patta(PT.ver, t, { ground: PT.verD, leaf: PT.grnD, hill: rgba(PT.ink, 0.18) }); moonDisc(880, 260, 70);
    throne(540, 760, 0.62, t, 0.9 - 0.4 * seg(lt, 1.2, 2.6), seg(lt, 0.9, 1.4));
    sleeper(1000, GY - 60, 0.82, t); motes(t, 40, [0, 200, W, 1250], '#FFE6A0', 0.7, 30, 3, 4);
  }, { zoom: 0.12, cam: [540, 1000] });
  cue(0.2, 'swell', { dur: 2.2, gain: 0.5 });
  // 1 · the tongue slipped: light at his lips
  shot(1, 'close-up: Kumbhakarna face, a stream of white light at his lips (Saraswati)', (lt, d, t) => {
    patta(PT.cream, t, { trees: false, hills: false, ground: PT.ochre, gy: 1400 }); sunDisc(540, 640, 330, t * 0.3, '#E8C060');
    bigHead(540, 700, 3.2, t, { eyes: 0.2, mouth: 0.6, aura: 0.3 }); stream(1200, 200, 540, 840, t, eo(seg(lt, 0.1, 1.2)));
  }, { zoom: 0.14, cam: [540, 760], capY: 1560 });
  cue(cut_(1) + 0.1, 'whoosh', { gain: 0.5 });
  // 2 · one word took his whole life: sun and moon racing over the sleeping giant
  shot(2, 'sleeping giant, sun and moon racing across the sky (years pass), indigo', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD, hill: rgba('#000000', 0.25) }); stars(t, 80, -200, 1100, 5, 0.7);
    const a = lt * 2.2; sunDisc(540 + Math.cos(a) * 520, 900 - Math.abs(Math.sin(a)) * 640, 70, t); moonDisc(540 - Math.cos(a) * 520, 900 - Math.abs(Math.sin(a + 1)) * 600, 50);
    sleeper(1000, GY - 60, 0.82, t);
  }, { zoom: 0.1 });
  cue(cut_(2), 'bell', { gain: 0.5 });
  // 3 · source: Valmiki writing on palm leaf
  shot(3, 'Valmiki at his ashram writing the palm-leaf Ramayana, cream field', (lt, d, t) => {
    patta(PT.cream, t, { ground: PT.ochre }); sunDisc(820, 380, 90, t);
    raja({ x: 380, y: GY + 20, h: 760, t, pose: 'tapas', robe: '#D9822F', sash: PT.ver, eyes: 0 });
    ctx.save(); ctx.translate(720, 1100); ctx.rotate(-0.08); for (let i = 0; i < 4; i++) cut(P_rr(-200, -40 + i * 34 - seg(lt, 0, 1.5) * i * 6, 400, 28, 10), '#E8C98A', { shadow: 0.3, edge: 3 }); for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) circle(-170 + j * 46, -26 + i * 34, 3, PT.ink); ctx.restore();
  });
  cue(cut_(3), 'tock', { gain: 0.4 });
  // 4 · three brothers
  { const kw = W_('कुम्भकर्ण', 4), vb = W_('विभीषण', 4);
    shot(4, 'three brothers slide in: Ravana (centre), Kumbhakarna giant (left), Vibhishana (right)', (lt, d, t) => {
      patta(PT.sky, t, { ground: PT.ochre });
      kumbha(lerp(-300, 170, eo(seg(lt, kw - 0.2, kw + 0.4))), GY + 20, { h: 1080, t, eyes: 1 });
      raja({ x: lerp(1400, 850, eo(seg(lt, vb - 0.2, vb + 0.4))), y: GY + 20, h: 700, t, robe: '#F2EEE6', sash: PT.ind, eyes: 1, dir: -1 });
      ravana(600, GY + 20, { h: 780, t, aura: 0.4 });
    }, { zoom: 0.05 });
    cue(cut_(4) + kw, 'thud', { gain: 0.6 }); cue(cut_(4) + vb, 'pop', { gain: 0.4 }); }
  // 5 · tapas for Brahma
  shot(5, 'three brothers in tapas in the forest, Brahma glow above', (lt, d, t) => {
    patta(PT.grn, t, { ground: PT.ochre, leaf: PT.grnD, hill: rgba('#000000', 0.15) }); glow(540, 300, 400, '#FFE08A', 0.6 * eo(seg(lt, 0.3, 2))); godRays(540, 260, 0, TAU, 20, 900, '#FFE6A0', 0.14, t);
    raja({ x: 230, y: GY + 20, h: 760, t, pose: 'tapas', robe: '#24402E', sash: PT.ochre, eyes: 0 });
    raja({ x: 540, y: GY + 20, h: 700, t, pose: 'tapas', robe: RAV.robe, sash: RAV.sash, eyes: 0 });
    raja({ x: 850, y: GY + 20, h: 640, t, pose: 'tapas', robe: '#F2EEE6', sash: PT.ind, eyes: 0 });
  });
  cue(cut_(5), 'conch', { dur: 1.6, gain: 0.35 });
  // 6 · his tapas was the fiercest
  shot(6, 'Kumbhakarna alone in tapas, ring of fire, vermilion', (lt, d, t) => {
    patta(PT.ver, t, { ground: PT.verD, trees: false, hill: rgba(PT.ink, 0.2) }); sunDisc(540, 380, 140, t, '#F2C14E');
    for (let i = 0; i < 5; i++) flames(140 + i * 200, GY + 10, 0.9, t);
    raja({ x: 540, y: GY + 20, h: 980, t, pose: 'tapas', robe: '#24402E', sash: PT.ochre, eyes: 0 });
  }, { zoom: 0.12 });
  cue(cut_(6), 'drum', { gain: 0.6 });
  // 7 · fire in summer, water in winter
  { const sw = W_('सर्दी', 7);
    shot(7, 'split: fires in summer -> indigo winter water up to his chest', (lt, d, t) => {
      const w = lt > sw;
      patta(w ? PT.ind : PT.ver, t, { ground: w ? PT.indD : PT.verD, trees: false });
      if (!w) { sunDisc(540, 380, 150, t, '#F2C14E'); for (let i = 0; i < 5; i++) flames(140 + i * 200, GY + 10, 1, t); } else { moonDisc(820, 320, 70); stars(t, 60, -200, 900, 9, 0.6); }
      raja({ x: 540, y: GY + 20, h: 900, t, pose: 'tapas', robe: '#24402E', sash: PT.ochre, eyes: 0 });
      if (w) waves(lerp(GY, 1000, eo(seg(lt, sw, sw + 0.8))), t);
    }, { capY: 1500 });
    cue(cut_(7) + sw, 'whoosh', { gain: 0.5 }); }
  // 8 · ten thousand years
  shot(8, 'cosmic indigo, stars wheel, small meditating giant, sun/moon trail rings', (lt, d, t) => {
    patta(PT.indD, t, { ground: PT.ind, trees: false, hills: false }); stars(t, 160, -200, 1250, 11, 1);
    ctx.save(); ctx.translate(540, 700); for (let k = 0; k < 5; k++) { ctx.strokeStyle = rgba(k % 2 ? '#F2C14E' : '#F6EED0', 0.5); ctx.lineWidth = 5; ctx.setLineDash([20, 18]); ctx.lineDashOffset = -t * 60 * (k + 1); ctx.beginPath(); ctx.arc(0, 0, 160 + k * 90, 0, TAU); ctx.stroke(); } ctx.setLineDash([]); ctx.restore();
    raja({ x: 540, y: 1000, h: 500, t, pose: 'tapas', robe: '#24402E', sash: PT.ochre, eyes: 0 });
  }, { zoom: 0.16, cam: [540, 760] });
  cue(cut_(8), 'swell', { dur: 1.8, gain: 0.5 });
  // 9 · the gods were afraid
  shot(9, 'devas in a cloud band above, looking down, cream sky', (lt, d, t) => {
    patta(PT.cream, t, { ground: PT.ochre, hill: rgba(PT.ind, 0.15) }); cloudBand(900, t);
    for (let i = 0; i < 3; i++) deva(250 + i * 290, 880, 560, t, i);
    cloudBand(960, t * 1.3, '#FFFFFF');
  });
  cue(cut_(9), 'heartbeat', { gain: 0.5 });
  // 10 · even without a boon he is terrible
  shot(10, 'giant Kumbhakarna towering, tiny devas on clouds at his shoulder', (lt, d, t) => {
    patta(PT.sky, t, { ground: PT.ochre }); kumbha(420, GY + 20, { h: 1100, t, eyes: 1, glowEye: 0.4, aura: 0.6 });
    for (let i = 0; i < 3; i++) deva(760 + i * 110, 900, 260, t, i); cloudBand(910, t);
  }, { zoom: 0.1 });
  cue(cut_(10), 'thud', { gain: 0.7 });
  // 11 · the three worlds would not survive
  shot(11, 'three stacked panels (heaven / earth / underworld) cracking with lightning', (lt, d, t) => {
    patta(PT.ink, t, { trees: false, hills: false, ground: PT.verD });
    const bands = [['#F2C14E', 150], [PT.grn, 520], [PT.ind, 890]]; bands.forEach(([c, y], i) => { cut(P_rr(80, y, 920, 330, 18), c, { shadow: 0.4, edge: 5 }); if (i === 0) sunDisc(540, y + 165, 70, t); if (i === 1) { tree(300, y + 320, 0.45, t); tree(780, y + 320, 0.45, t); } if (i === 2) stars(t, 30, y, y + 330, 7, 0.8); });
    if (lt > 0.8) lightning(540, 100, 1240, t, 0.9, 5); flash(lt, 0.8, '#FFF6E6', 0.5, 0.4);
  });
  cue(cut_(11) + 0.8, 'slam', { gain: 0.7 });
  // 12 · Brahma calls Saraswati
  shot(12, 'Brahma on his lotus (left), Saraswati appears in white with veena (right)', (lt, d, t) => {
    patta(PT.cream, t, { ground: PT.ochre }); cloudBand(1180, t);
    brahma(330, 1180, 0.95, t); ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.6, 1.4)); saraswati(780, GY + 20, 820, t); ctx.restore();
  });
  cue(cut_(12) + 0.6, 'sparkle', { gain: 0.5 });
  // 13 · become the speech of this rakshasa
  shot(13, 'Saraswati dissolves into a stream of light flying to the right', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 60, -200, 900, 13, 0.6);
    const k = seg(lt, 0.6, 2); ctx.save(); ctx.globalAlpha = 1 - k; saraswati(440, GY + 20, 820, t); ctx.restore();
    stream(440, 700, 1300, 500, t, k);
  });
  cue(cut_(13) + 0.6, 'whoosh', { gain: 0.6 });
  // 14 · Brahma appears: ask a boon
  shot(14, 'WOW: Brahma appears in a blaze above the meditating giant', (lt, d, t) => {
    patta(PT.ver, t, { ground: PT.verD, hill: rgba(PT.ink, 0.2) }); godRays(540, 500, 0, TAU, 28, 1300, '#FFE6A0', 0.2, t);
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 0, 0.6)); brahma(540, 900 - 60 * eo(seg(lt, 0, 1)), 0.9, t); ctx.restore();
    raja({ x: 540, y: GY + 60, h: 520, t, pose: 'tapas', robe: '#24402E', sash: PT.ochre, eyes: 0 }); ring(lt, 0.1, 540, 600);
  }, { zoom: 0.1 });
  cue(cut_(14), 'bell', { gain: 0.7 });
  // 15 · the one speaking was not Kumbhakarna
  shot(15, 'close-up: Kumbhakarna face lit white from inside, light in his mouth', (lt, d, t) => {
    patta(PT.indD, t, { trees: false, hills: false, ground: PT.ind, gy: 1400 }); stars(t, 60, -200, 1300, 15, 0.5);
    bigHead(540, 720, 3.2, t, { eyes: 1, glowEye: 0.0, mouth: 0.7, aura: 0.6, glowCol: '#FFFFFF' }); glow(540, 900, 160, '#FFFFFF', 0.6 + 0.2 * Math.sin(t * 5));
  }, { zoom: 0.12, cam: [540, 780], capY: 1560 });
  cue(cut_(15), 'heartbeat', { gain: 0.6 });
  // 16 · he wanted Indrasana (folk)
  shot(16, 'WOW: Indra throne blazing gold with chhatra, cream field, petals', (lt, d, t) => {
    patta(PT.cream, t, { ground: PT.ochre }); throne(540, GY - 20, 1.05, t, eo(seg(lt, 0, 0.5))); petals(t, 0.8);
  }, { zoom: 0.1 });
  cue(cut_(16) + 0.2, 'sparkle', { gain: 0.6 });
  // 17 · but out came: Nidrasana
  { const nw = W_('निद्रासन', 17);
    shot(17, 'throne cracks and fades; moon rises; a sleeping couch appears; flash on निद्रासन', (lt, d, t) => {
      const k = seg(lt, nw - 0.1, nw + 0.6);
      patta(k > 0.5 ? PT.ind : PT.cream, t, { ground: k > 0.5 ? PT.indD : PT.ochre });
      if (k > 0.5) { stars(t, 80, -200, 1000, 17, 0.8); moonDisc(540, 400, 110); sleeper(1000, GY - 60, 0.82, t); }
      throne(540, GY - 20, 1.05, t, 1 - k, seg(lt, nw - 0.6, nw)); flash(lt, nw, '#FFFFFF', 0.7, 0.5);
    }, { zoom: 0.08 });
    cue(cut_(17) + nw, 'drum', { gain: 0.9 }); }
  // 18 · Valmiki: he asked for years of sleep
  shot(18, 'sleeping giant under a cycling moon, palm-leaf scroll edge, indigo', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 100, -200, 1100, 19, 0.8); moonDisc(300 + lt * 120, 380, 80);
    sleeper(1000, GY - 60, 0.82, t);
  }, { zoom: 0.06 });
  // 19 · Tathastu
  shot(19, 'Brahma raises his hand: tathastu, a golden ring bursts', (lt, d, t) => {
    patta(PT.ver, t, { ground: PT.verD }); godRays(540, 700, 0, TAU, 24, 1200, '#FFE6A0', 0.18, t); brahma(540, 1200, 1.15, t); ring(lt, 1.0, 540, 700, '#FFE6A0', 1.0, 1000);
  }, { zoom: 0.08 });
  cue(cut_(19) + 1.0, 'bell', { gain: 0.8 });
  // 20 · Saraswati leaves; he comes to his senses
  { const hw = W_('होश', 20);
    shot(20, 'light leaves Kumbhakarna (stream upward), his eyes open', (lt, d, t) => {
      patta(PT.sky, t, { ground: PT.ochre }); stream(540, 520, 700, -200, t, 1 - seg(lt, 0, 1.4));
      kumbha(540, GY + 20, { h: 1080, t, eyes: lt > hw ? 1 : 0 });
    }, { zoom: 0.1, cam: [540, 600] });
    cue(cut_(20) + hw, 'thud', { gain: 0.5 }); }
  // 21 · what came out of my mouth?
  shot(21, 'close-up: Kumbhakarna face, shocked, camera shake', (lt, d, t) => {
    patta(PT.cream, t, { trees: false, hills: false, ground: PT.ochre, gy: 1400 }); sunDisc(540, 640, 330, t * 0.3, '#E8A050');
    bigHead(540 + Math.sin(t * 30) * 4, 720, 3.2, t, { eyes: 1, mouth: 0.9 });
  }, { zoom: 0.16, cam: [540, 760], capY: 1560 });
  cue(cut_(21), 'slam', { gain: 0.6 });
  // 22 · the gods deluded me
  shot(22, 'devas in clouds above, spiral delusion rings swirling around his head', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); cloudBand(330, t); for (let i = 0; i < 3; i++) deva(300 + i * 240, 320, 260, t, i);
    kumbha(540, GY + 20, { h: 860, t, eyes: 1 });
    ctx.save(); ctx.translate(540, 640); ctx.rotate(t * 1.5); ctx.strokeStyle = rgba('#F2C14E', 0.8); ctx.lineWidth = 6; ctx.beginPath(); for (let a = 0; a < 6 * TAU; a += 0.1) { const r = 20 + a * 9; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.4); } ctx.stroke(); ctx.restore();
  });
  cue(cut_(22), 'swell', { dur: 1.5, gain: 0.4 });
  // 23 · the real twist was still to come
  shot(23, 'dark indigo, the sleeping giant silhouette, one ember of light pulsing at his heart', (lt, d, t) => {
    patta(PT.indD, t, { ground: '#0E1430', leaf: '#101A2E', hill: rgba('#000000', 0.3) }); stars(t, 80, -200, 1100, 23, 0.6);
    sleeper(1000, GY - 60, 0.82, t); vignette(0.6); glow(560, GY - 160, 120, '#FFB060', 0.5 + 0.3 * Math.sin(t * 4));
  }, { zoom: 0.18 });
  cue(cut_(23), 'heartbeat', { gain: 0.7 });
  // 24 · Ravana pleads with Brahma
  shot(24, 'Ravana with palms joined before Brahma on his lotus', (lt, d, t) => {
    patta(PT.cream, t, { ground: PT.ochre }); cloudBand(760, t); brahma(830, 720, 0.6, t);
    ravana(300, GY + 20, { h: 760, t, pose: 'pray', eyes: 0 });
  });
  // 25 · six months asleep, one day awake
  { const ew = W_('एक', 25);
    shot(25, 'a wheel of six moons lights one by one, then one sun blazes', (lt, d, t) => {
      patta(PT.ind, t, { ground: PT.indD, trees: false }); stars(t, 80, -200, 1100, 25, 0.6);
      for (let i = 0; i < 6; i++) { const a = -Math.PI + i / 5 * Math.PI, x = 540 + Math.cos(a) * 380, y = 800 + Math.sin(a) * 380; ctx.save(); ctx.globalAlpha = 0.25 + 0.75 * seg(lt, 0.3 + i * 0.3, 0.6 + i * 0.3); moonDisc(x, y, 46); ctx.restore(); }
      if (lt > ew) { ctx.save(); const k = eob(seg(lt, ew, ew + 0.5)); ctx.translate(540, 900); ctx.scale(k, k); sunDisc(0, 0, 110, t); ctx.restore(); }
      sleeper(1000, GY - 60, 0.6, t);
    });
    for (let i = 0; i < 6; i++) cue(cut_(25) + 0.3 + i * 0.3, 'tock', { gain: 0.35 }); cue(cut_(25) + ew, 'bell', { gain: 0.7 }); }
  // 26 · war came; Ravana woke him mid-sleep
  { const jw = W_('जगा', 26);
    shot(26, 'WOW: war banners on the horizon, drums; the giant rises from lying to standing', (lt, d, t) => {
      patta(PT.ver, t, { ground: PT.verD, hill: rgba(PT.ink, 0.25), trees: false });
      for (let i = 0; i < 9; i++) { const x = 60 + i * 120; cut(P_rr(x, 980, 8, 300, 2), PT.ink, { shadow: 0, edge: 0 }); cut(() => { ctx.beginPath(); ctx.moveTo(x + 8, 980); ctx.quadraticCurveTo(x + 60, 990 + Math.sin(t * 5 + i) * 12, x + 90, 1010); ctx.lineTo(x + 8, 1040); ctx.closePath(); }, i % 2 ? PT.ochre : PT.ink, { shadow: 0, edge: 2 }); }
      sunDisc(820, 420, 100, t, '#F2C14E'); const r = eio(seg(lt, Math.min(jw - 1.4, d - 1.6), Math.min(jw, d - 0.3))); sleeper(lerp(1000, 540, r), GY - lerp(60, -20, r), lerp(0.82, 0.9, r), t, { rise: r, eyes: r > 0.6 ? 1 : 0 });
    }, { zoom: 0.08, cam: [540, 800] });
    cue(cut_(26) + 0.1, 'drum', { gain: 0.8 }); cue(cut_(26) + 0.7, 'drum', { gain: 0.6 }); cue(cut_(26) + jw, 'slam', { gain: 0.8 }); }
  // 27 · he told Ravana plainly
  shot(27, 'Kumbhakarna (right, giant) faces Ravana (left, smaller), Lanka court arches', (lt, d, t) => {
    patta(PT.sky, t, { ground: PT.ochre, trees: false }); for (let i = 0; i < 4; i++) cut(() => { ctx.beginPath(); const x = 40 + i * 270; ctx.moveTo(x, GY); ctx.lineTo(x, 600); ctx.quadraticCurveTo(x + 115, 440, x + 230, 600); ctx.lineTo(x + 230, GY); ctx.closePath(); }, rgba(PT.ver, 0.35), { shadow: 0, edge: 3 });
    ravana(330, GY + 20, { h: 720, t, eyes: 1 }); kumbha(780, GY + 20, { h: 1100, t, eyes: 1, dir: -1 });
  });
  // 28 · Brother, you did wrong
  shot(28, 'close-up: Kumbhakarna face, stern, Ravana heads small below', (lt, d, t) => {
    patta(PT.verD, t, { trees: false, hills: false, ground: PT.ink, gy: 1400 });
    for (let k = -4; k <= 5; k++) head(540 + k * 70, 1260, 0.5, { eyes: 0 });
    bigHead(540, 640, 3.0, t, { eyes: 1, aura: 0.25 });
  }, { zoom: 0.1, cam: [540, 700], capY: 1560 });
  cue(cut_(28), 'thud', { gain: 0.6 });
  // 29 · still he went to fight for his brother
  shot(29, 'Kumbhakarna walks toward the battlefield banners, dawn saffron', (lt, d, t) => {
    patta('#E8732A', t, { ground: PT.verD, px: lt * 120, hill: rgba(PT.ink, 0.3) }); sunDisc(820, 520, 110, t, '#F2C14E');
    kumbha(lerp(380, 520, lt / d), GY + 20, { h: 1000, t, eyes: 1, aura: 0.3 });
  }, { zoom: 0.06 });
  cue(cut_(29), 'drum', { gain: 0.5 });
  // 30 · and never came back
  shot(30, 'sunset: his silhouette fades into petals, empty field', (lt, d, t) => {
    patta('#C8501E', t, { ground: PT.verD, hill: rgba(PT.ink, 0.3) }); sunDisc(540, 900, 160 - lt * 20, t, '#F2C14E');
    ctx.save(); ctx.globalAlpha = 1 - seg(lt, 0.3, d - 0.2); kumbha(540, GY + 20, { h: 900, t, eyes: 0 }); ctx.restore(); petals(t, seg(lt, 0.3, 1));
  });
  // 31 · everyone remembers the one who slept six months
  shot(31, 'callback: the sleeping giant on vermilion (hook image), moon', (lt, d, t) => {
    patta(PT.ver, t, { ground: PT.verD, leaf: PT.grnD, hill: rgba(PT.ink, 0.18) }); moonDisc(880, 260, 70); sleeper(1000, GY - 60, 0.82, t);
  }, { zoom: 0.06 });
  // 32 · who remembers that he spoke the truth
  shot(32, 'WOW: Kumbhakarna standing, eyes open, golden aura of truth, god rays', (lt, d, t) => {
    patta(PT.cream, t, { ground: PT.ochre }); godRays(540, 500, 0, TAU, 26, 1300, '#F2C14E', 0.2, t); glow(540, 600, 600, '#FFE08A', 0.5 * eo(seg(lt, 0.3, 2)));
    kumbha(540, GY + 20, { h: 1150, t, eyes: 1, aura: 0.4 }); petals(t, 0.6);
  }, { zoom: 0.12, cam: [540, 700] });
  cue(cut_(32), 'swell', { dur: 2.5, gain: 0.5 });
  // 33 · end card
  shot(33, 'end card: Untold Stories in gold on a Pattachitra cream field with lotus row', (lt, d, t) => {
    patta(PT.ind, t, { ground: PT.indD, leaf: PT.grnD }); stars(t, 100, -200, 1000, 33, 0.6);
    ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 620, 120, '#F6D98A'); ctx.restore();
    for (let i = 0; i < 7; i++) { const x = 120 + i * 140; for (let j = 0; j < 6; j++) cut(() => { ctx.beginPath(); ctx.ellipse(x + Math.cos(Math.PI + j / 5 * Math.PI) * 30, 1240 + Math.sin(Math.PI + j / 5 * Math.PI) * 30, 26, 12, j / 5 * Math.PI + Math.PI / 2, 0, TAU); }, j % 2 ? PT.ver : '#F2B8C6', { shadow: 0, edge: 2 }); }
  }, { zoom: 0.05 });
  cue(cut_(33), 'bell', { gain: 0.6 });

  return { shots: S, cues: CUES };
}
