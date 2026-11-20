// Atmosphere kit: the cinematic layer on top of cut paper. Deep skies, stars, glow, god rays, mist, parallax ranges,
// lit clouds, motes and embers, water, diyas. Every solid shape still goes through K.cut (paper edge + shadow).
import { ctx, W, H, TAU, clamp, lerp, rnd } from './core/lib.js';
import * as K from './core/kit.js';
const { cut, P_poly, P_circ, P_rr } = K;

export const A = {
  night: '#0E1430', indigo: '#1A2350', violet: '#3B2F63', dusk: '#7A3E62', rose: '#C0596A', ember: '#E0782E', saffron: '#E89A45',
  gold: '#F2C14E', paleGold: '#FCE7B0', mist: '#E9E4F2', ice: '#CFE3F2', glowWater: '#9FE3F0', water: '#4E8FB0', waterDeep: '#2C5E86',
};

/** vertical gradient fill of the whole frame. stops = [[0, col], [0.6, col], [1, col]] */
export function gradSky(stops, y0 = -300, y1 = H + 300) {
  const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach(([p, c]) => g.addColorStop(p, c));
  ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800);
}
/** a paper-texture pass over a dark sky so it still reads as paper */
export function paperGrain(a = 0.06, seed = 0) {
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 2;
  for (let i = 0; i < 140; i++) { const x = rnd(i * 2 + seed) * W, y = rnd(i * 3 + seed) * H; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 30 + rnd(i) * 60, y + (rnd(i + 1) - 0.5) * 10); ctx.stroke(); }
  ctx.restore();
}
export function stars(t, n = 120, y0 = -200, y1 = 1100, seed = 1, a = 1) {
  ctx.save();
  for (let i = 0; i < n; i++) {
    const x = rnd(i + seed) * (W + 400) - 200, y = y0 + rnd(i * 7 + seed) * (y1 - y0), r = 1.2 + rnd(i * 3 + seed) * 2.6;
    const tw = 0.55 + 0.45 * Math.sin(t * (1.5 + rnd(i) * 3) + i);
    ctx.globalAlpha = a * tw * (0.5 + 0.5 * rnd(i * 5)); ctx.fillStyle = i % 9 ? '#FFF6E0' : '#CFE3FF';
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    if (r > 3.2) { ctx.globalAlpha *= 0.5; ctx.fillRect(x - r * 3, y - 0.8, r * 6, 1.6); ctx.fillRect(x - 0.8, y - r * 3, 1.6, r * 6); }
  }
  ctx.restore();
}
/** additive soft light */
export function glow(x, y, r, col, a = 1, mode = 'lighter') {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalCompositeOperation = mode; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(col, a)); g.addColorStop(0.35, rgba(col, a * 0.45)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore();
}
export function rgba(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
/** god rays from (x, y), fanning between angles a0..a1 (radians, 0 = right, PI/2 = down) */
export function godRays(x, y, a0, a1, n, len, col, a, t = 0) {
  if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const k = (i + 0.5) / n, ang = lerp(a0, a1, k) + Math.sin(t * 0.4 + i) * 0.015, w = 0.025 + rnd(i + 3) * 0.045, al = a * (0.35 + 0.65 * rnd(i + 9)) * (0.7 + 0.3 * Math.sin(t * 0.8 + i * 2));
    const g = ctx.createLinearGradient(x, y, x + Math.cos(ang) * len, y + Math.sin(ang) * len); g.addColorStop(0, rgba(col, al)); g.addColorStop(1, rgba(col, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang - w) * len, y + Math.sin(ang - w) * len); ctx.lineTo(x + Math.cos(ang + w) * len, y + Math.sin(ang + w) * len); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}
/** drifting mist band */
export function mist(y, h, col, a, t, seed = 0, speed = 12) {
  if (a <= 0) return; ctx.save();
  for (let i = 0; i < 7; i++) {
    const x = ((rnd(i + seed) * (W + 800) + t * speed * (0.6 + rnd(i) * 0.8)) % (W + 800)) - 400, yy = y + (rnd(i * 3 + seed) - 0.5) * h * 0.6, rx = 260 + rnd(i * 5 + seed) * 300, ry = h * (0.35 + rnd(i * 2) * 0.3);
    ctx.save(); ctx.translate(x, yy); ctx.scale(rx / ry, 1); const g = ctx.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, ry, 0, TAU); ctx.fill(); ctx.restore();
  }
  ctx.restore();
}
/** a mountain ridge polygon: base y, peak height, roughness, seed; returns points */
export function ridge(y, hgt, seed, rough = 1, step = 30) {
  const pts = [[-500, H + 400], [-500, y]];
  for (let x = -500; x <= W + 500; x += step) {
    const v = Math.sin(x * 0.004 + seed) * 0.5 + Math.sin(x * 0.011 + seed * 2.3) * 0.3 * rough + Math.sin(x * 0.027 + seed * 4.1) * 0.12 * rough + Math.abs(Math.sin(x * 0.0065 + seed * 1.7)) * 0.45;
    pts.push([x, y - (Math.log(1 + Math.exp(v * 5)) / 5) * hgt]);
  }
  pts.push([W + 500, y], [W + 500, H + 400]); return pts;
}
/** layered ranges, far to near. layers = [{ y, h, col, seed, snow, haze }] ; px = parallax shift (near layers move more) */
export function ranges(layers, px = 0, hazeCol = '#C9D3E6') {
  layers.forEach((L, i) => {
    const k = (i + 1) / layers.length; ctx.save(); ctx.translate(px * k, 0);
    const pts = ridge(L.y, L.h, L.seed, L.rough ?? 1);
    cut(P_poly(pts), L.col, { shadow: 0.4 + k * 0.6, edge: i === layers.length - 1 ? 5 : 3 });
    if (L.snow) { ctx.save(); P_poly(pts)(); ctx.clip(); const g = ctx.createLinearGradient(0, L.y - L.h, 0, L.y - L.h * 0.45); g.addColorStop(0, rgba('#F7F3EA', L.snow)); g.addColorStop(1, rgba('#F7F3EA', 0)); ctx.fillStyle = g; ctx.fillRect(-500, L.y - L.h - 10, W + 1000, L.h * 0.6); ctx.restore(); }
    ctx.restore();
    if (L.haze) { const g = ctx.createLinearGradient(0, L.y - L.h * 0.2, 0, L.y + 60); g.addColorStop(0, rgba(hazeCol, 0)); g.addColorStop(1, rgba(hazeCol, L.haze)); ctx.fillStyle = g; ctx.fillRect(-400, L.y - L.h * 0.2, W + 800, L.h * 0.2 + 80); }
  });
}
/** a lit paper cloud: body colour + a lighter top + a tinted underside */
export function cloud(x, y, s, body = '#E9DDF0', top = '#FFF6E6', under = '#B9A2C8', a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  const blobs = [[-120, 14, 72], [-48, -28, 92], [44, -22, 84], [120, 16, 64], [0, 30, 86], [-80, 38, 60], [80, 40, 60]];
  const path = () => { ctx.beginPath(); for (const [dx, dy, r] of blobs) { ctx.moveTo(dx + r, dy); ctx.arc(dx, dy, r, 0, TAU); } };
  cut(path, body, { shadow: 0.7, edge: 0 });
  ctx.save(); path(); ctx.clip(); const g = ctx.createLinearGradient(0, -120, 0, 110); g.addColorStop(0, top); g.addColorStop(0.45, rgba(top, 0)); g.addColorStop(0.7, rgba(under, 0)); g.addColorStop(1, under); ctx.fillStyle = g; ctx.fillRect(-220, -140, 440, 260); ctx.restore();
  ctx.restore();
}
/** floating motes / embers rising */
export function motes(t, n, box, col, a = 1, rise = 40, seed = 0, rmax = 5) {
  const [x0, y0, x1, y1] = box; ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const h = y1 - y0, y = y1 - ((rnd(i + seed) * h + t * rise * (0.5 + rnd(i * 3))) % h), x = x0 + rnd(i * 7 + seed) * (x1 - x0) + Math.sin(t * 0.9 + i) * 18;
    const r = 1.5 + rnd(i * 5 + seed) * rmax, al = a * (0.4 + 0.6 * Math.sin(t * 2 + i) ** 2) * Math.min(1, (y - y0) / (h * 0.25));
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3); g.addColorStop(0, rgba(col, al)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  }
  ctx.restore();
}
/** layered water from y down, with glints */
export function water(t, y, cols = [A.water, A.waterDeep], glint = '#FCE7B0', ga = 0.5) {
  cols.forEach((c, i) => { const yy = y + i * 60; cut(() => { ctx.beginPath(); ctx.moveTo(-400, H + 400); ctx.lineTo(-400, yy); for (let x = -400; x <= W + 400; x += 40) ctx.lineTo(x, yy + Math.sin(x * 0.011 + t * 1.3 + i * 2) * 12); ctx.lineTo(W + 400, H + 400); ctx.closePath(); }, c, { shadow: 0.5, edge: 4 }); });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(glint, ga); ctx.lineCap = 'round';
  for (let i = 0; i < 26; i++) { const x = rnd(i + 2) * W, yy = y + 30 + rnd(i * 3) * 300, w = 20 + rnd(i) * 60, sh = Math.sin(t * 2 + i); ctx.lineWidth = 3 + rnd(i) * 3; ctx.globalAlpha = 0.4 + 0.6 * sh * sh; ctx.beginPath(); ctx.moveTo(x - w / 2 + sh * 8, yy); ctx.lineTo(x + w / 2 + sh * 8, yy); ctx.stroke(); }
  ctx.restore();
}
/** a clay diya with a living flame */
export function diya(x, y, s, t, seed = 0, a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  glow(0, -40, 120, A.gold, 0.55 + 0.1 * Math.sin(t * 9 + seed));
  cut(() => { ctx.beginPath(); ctx.moveTo(-60, -20); ctx.quadraticCurveTo(0, 40, 60, -20); ctx.quadraticCurveTo(75, -28, 62, -30); ctx.lineTo(-62, -30); ctx.closePath(); }, '#A0522D', { shadow: 0.5, edge: 3 });
  const fl = 1 + 0.12 * Math.sin(t * 11 + seed);
  cut(() => { ctx.beginPath(); ctx.moveTo(-12, -32); ctx.quadraticCurveTo(-16, -60 * fl, 0, -90 * fl); ctx.quadraticCurveTo(16, -60 * fl, 12, -32); ctx.closePath(); }, A.gold, { shadow: 0, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-6, -34); ctx.quadraticCurveTo(-7, -52, 0, -66 * fl); ctx.quadraticCurveTo(7, -52, 6, -34); ctx.closePath(); }, '#FFF3C4', { shadow: 0, edge: 0 });
  ctx.restore();
}
/** palace / temple skyline silhouette at y (base), in col */
export function skyline(y, col, s = 1, x0 = 540) {
  ctx.save(); ctx.translate(x0, y); ctx.scale(s, s);
  const shik = (x, w, h) => { ctx.moveTo(x - w / 2, 0); ctx.lineTo(x - w / 2, -h * 0.35); ctx.quadraticCurveTo(x - w * 0.42, -h * 0.85, x, -h); ctx.quadraticCurveTo(x + w * 0.42, -h * 0.85, x + w / 2, -h * 0.35); ctx.lineTo(x + w / 2, 0); };
  cut(() => { ctx.beginPath(); ctx.moveTo(-700, 0); ctx.lineTo(-700, -120); ctx.lineTo(-420, -120); shik(-330, 150, 330); ctx.lineTo(-250, -150); shik(-120, 170, 420); shik(0, 230, 560); shik(120, 170, 420); ctx.lineTo(250, -150); shik(330, 150, 330); ctx.lineTo(420, -120); ctx.lineTo(700, -120); ctx.lineTo(700, 0); ctx.closePath(); }, col, { shadow: 0.6, edge: 3 });
  for (const [x, h] of [[0, 560], [-120, 420], [120, 420]]) { ctx.fillStyle = A.gold; ctx.beginPath(); ctx.arc(x, -h - 10, 10, 0, TAU); ctx.fill(); ctx.fillRect(x - 2, -h - 60, 4, 50); ctx.beginPath(); ctx.moveTo(x + 2, -h - 60); ctx.lineTo(x + 46, -h - 48); ctx.lineTo(x + 2, -h - 36); ctx.fillStyle = '#B33A2E'; ctx.fill(); }
  ctx.restore();
}
/** palm silhouette */
export function palm(x, y, h, col, lean = 0.15, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineWidth = h * 0.05;
  const tx = Math.sin(lean) * h, ty = -h; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(tx * 0.2, -h * 0.6, tx, ty); ctx.stroke();
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.45 + Math.sin(t + i) * 0.04, l = h * 0.42; cut(() => { ctx.beginPath(); ctx.moveTo(tx, ty); ctx.quadraticCurveTo(tx + Math.cos(a - 0.3) * l * 0.6, ty + Math.sin(a - 0.3) * l * 0.6 - 30, tx + Math.cos(a) * l, ty + Math.sin(a) * l + l * 0.35); ctx.quadraticCurveTo(tx + Math.cos(a + 0.2) * l * 0.5, ty + Math.sin(a + 0.2) * l * 0.5 - 10, tx, ty); ctx.closePath(); }, col, { shadow: 0.3, edge: 0 }); }
  ctx.restore();
}
/** a flight of birds (simple paper ticks) */
export function birds(t, x, y, n, col, s = 1) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 4 * s; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const bx = x + i * 50 * s + t * 30, by = y + Math.sin(i * 1.7) * 30 * s, f = Math.sin(t * 8 + i) * 10 * s; ctx.beginPath(); ctx.moveTo(bx - 16 * s, by - f); ctx.quadraticCurveTo(bx - 6 * s, by - 6 * s, bx, by); ctx.quadraticCurveTo(bx + 6 * s, by - 6 * s, bx + 16 * s, by - f); ctx.stroke(); } ctx.restore(); }
/** luminous band along pts: outer glow, paper edge, body, flowing light. Returns head point. */
export function luminous(pts, w, t, o = {}) {
  const col = o.col || A.water, hi = o.hi || A.glowWater, glowA = o.glowA ?? 0.8;
  if (pts.length < 2) return null; const path = () => smooth(pts);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (glowA > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = rgba(hi, glowA); ctx.shadowBlur = w * 0.9; path(); ctx.strokeStyle = rgba(hi, 0.25 * glowA); ctx.lineWidth = w * 1.5; ctx.stroke(); ctx.shadowBlur = 0; ctx.globalCompositeOperation = 'source-over'; }
  path(); ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = w + 8; ctx.stroke();
  path(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
  path(); ctx.strokeStyle = rgba(hi, 0.55); ctx.lineWidth = w * 0.45; ctx.stroke();
  ctx.setLineDash([w * 1.2, w * 2.4]); ctx.lineDashOffset = -t * w * (o.speed || 6); path(); ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = Math.max(3, w * 0.16); ctx.stroke(); ctx.setLineDash([]);
  ctx.restore();
  return pts[pts.length - 1];
}
export function smooth(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]); }
export function polyLens(pts) { const out = [0]; for (let i = 1; i < pts.length; i++) out.push(out[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return out; }
export function partial(pts, p) {
  const Ls = polyLens(pts), tot = Ls[Ls.length - 1], want = tot * clamp(p), out = [pts[0]];
  for (let i = 1; i < pts.length; i++) { if (Ls[i] <= want) { out.push(pts[i]); continue; } const k = (want - Ls[i - 1]) / (Ls[i] - Ls[i - 1] || 1); out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); break; }
  return out;
}
/** dark vignette over the frame (shot-level, before captions) */
export function vignette(a = 0.55, col = '#0A0D1F') { const g = ctx.createRadialGradient(540, 900, 420, 540, 960, 1250); g.addColorStop(0, rgba(col, 0)); g.addColorStop(1, rgba(col, a)); ctx.fillStyle = g; ctx.fillRect(-400, -400, W + 800, H + 800); }
