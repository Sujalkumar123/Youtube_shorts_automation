// Jungle kit: cute cut-paper cartoon animals + jungle scenery for the moral-stories channel.
// Every animal: f({ x, y, s, t, dir, talk, mood, walk, look }) with (x, y) = ground point under the feet.
//   s = scale (1 ≈ 520 px tall lion), dir = 1 faces right / -1 left, talk 0..1 opens the mouth (pass a flap),
//   mood: 'happy' | 'angry' | 'scared' | 'sly' | 'sad', walk: true to swing the legs, look: pupil offset -1..1.
import { ctx, W, H, TAU, clamp, lerp, rnd, circle } from './core/lib.js';
import { cut, P_rr, P_poly, P_circ } from './core/kit.js';
import { glow, rgba } from './atmos.js';

const INK = '#2A1C14';
const E = (x, y, rx, ry, rot = 0) => () => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); };
const paper = (path, col, sh = 0.5) => cut(path, col, { shadow: sh, edge: 3 });

/** mouth flap for a talking line: lt within [s, e] → 0..1 bouncing */
export const flap = (lt, s = 0, e = 99, rate = 11) => (lt > s && lt < e ? Math.abs(Math.sin((lt - s) * rate)) : 0);
const blink = (t, seed) => { const p = (t + rnd(seed) * 4) % 3.7; return p < 0.12 ? 0.1 : 1; };

function eyes(x, y, r, o, seed, gap = 2.3) {
  const bl = blink(o.t || 0, seed), lk = (o.look || 0) * r * 0.3;
  for (const d of [-1, 1]) {
    const ex = x + d * r * gap / 2;
    paper(E(ex, y, r, r * bl), '#FFFFFF', 0.2);
    if (bl > 0.5) { circle(ex + lk + r * 0.1, y + r * 0.1, r * 0.55, INK); circle(ex + lk - r * 0.08, y - r * 0.12, r * 0.18, '#FFFFFF'); }
    ctx.strokeStyle = INK; ctx.lineWidth = r * 0.22; ctx.lineCap = 'round'; ctx.beginPath();
    if (o.mood === 'angry') { ctx.moveTo(ex + d * r * 1.0, y - r * 1.55); ctx.lineTo(ex - d * r * 0.7, y - r * 0.9); }
    else if (o.mood === 'scared' || o.mood === 'sad') { ctx.moveTo(ex + d * r * 0.9, y - r * 1.05); ctx.lineTo(ex - d * r * 0.7, y - r * 1.5); }
    else if (o.mood === 'sly') { ctx.moveTo(ex - r, y - r * 0.55); ctx.lineTo(ex + r, y - r * 0.75); }
    else { ctx.moveTo(ex - r * 0.8, y - r * 1.45); ctx.quadraticCurveTo(ex, y - r * 1.75, ex + r * 0.8, y - r * 1.45); }
    ctx.stroke();
    if (o.mood === 'sly') { ctx.fillStyle = rgba('#C46A3A', 1); ctx.fillRect(ex - r * 1.05, y - r * 1.05, r * 2.1, r * 0.75); }
  }
}
function mouth(x, y, w, o, tongue = '#E06A6A') {
  const m = clamp(o.talk || 0), angry = o.mood === 'angry';
  if (m > 0.08) { paper(E(x, y + w * 0.25 * m, w * (angry ? 0.75 : 0.55), w * 0.45 * m + 4), '#5A1E1E', 0.1); paper(E(x, y + w * 0.45 * m, w * 0.3, w * 0.16 * m + 2), tongue, 0);
    if (angry) { ctx.fillStyle = '#FFFFFF'; for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x + d * w * 0.4, y); ctx.lineTo(x + d * w * 0.3, y + w * 0.3 * m); ctx.lineTo(x + d * w * 0.2, y); ctx.fill(); } } }
  else { ctx.strokeStyle = INK; ctx.lineWidth = w * 0.09; ctx.lineCap = 'round'; ctx.beginPath();
    if (o.mood === 'sad' || o.mood === 'scared') { ctx.moveTo(x - w * 0.35, y + w * 0.15); ctx.quadraticCurveTo(x, y - w * 0.1, x + w * 0.35, y + w * 0.15); }
    else { ctx.moveTo(x - w * 0.4, y); ctx.quadraticCurveTo(x, y + w * (o.mood === 'angry' ? 0.05 : 0.3), x + w * 0.4, y); }
    ctx.stroke(); }
}
function legs(xs, y0, len, w, col, o, dark) {
  const sw = o.walk ? Math.sin((o.t || 0) * 9) : 0;
  xs.forEach((lx, i) => { const a = sw * (i % 2 ? 1 : -1) * 0.35; ctx.save(); ctx.translate(lx, y0); ctx.rotate(a); paper(P_rr(-w / 2, 0, w, len, w / 2), i < 2 ? dark : col, 0.4); ctx.restore(); });
}
function begin(o) { const s = o.s ?? 1, bob = o.walk ? Math.abs(Math.sin((o.t || 0) * 9)) * 10 : Math.sin((o.t || 0) * 2.2) * 3; ctx.save(); ctx.translate(o.x, o.y - bob * s); ctx.scale((o.dir ?? 1) * s, s); if (o.mood === 'scared') ctx.translate(Math.sin((o.t || 0) * 50) * 3, 0); return s; }

/** LION — golden body, big spiky mane */
export function lion(o) {
  begin(o);
  const body = '#E3A43A', dark = '#C98A26', mane = o.mood === 'angry' ? '#A8461E' : '#B8642A';
  ctx.save(); ctx.translate(-190, -230); ctx.rotate(Math.sin((o.t || 0) * 3) * 0.2 - 0.5); ctx.strokeStyle = dark; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-80, -40, -90, -150); ctx.stroke(); paper(E(-92, -165, 26, 34), mane); ctx.restore();
  legs([-120, 90, -80, 130], -170, 170, 58, body, o, dark);
  paper(E(-10, -230, 210, 120), body, 0.7);
  // mane: spiky ring
  const hx = 150, hy = -380;
  paper(() => { ctx.beginPath(); for (let i = 0; i <= 28; i++) { const a = i / 28 * TAU, r = i % 2 ? 150 : 190 + (o.mood === 'angry' ? 12 * Math.sin((o.t || 0) * 30 + i) : 0); ctx.lineTo(hx + Math.cos(a) * r, hy + Math.sin(a) * r * 0.95); } ctx.closePath(); }, mane, 0.7);
  for (const d of [-1, 1]) { paper(P_circ(hx + d * 85, hy - 95, 36), body); paper(P_circ(hx + d * 85, hy - 95, 18), '#F2C27A', 0); }
  paper(P_circ(hx, hy, 122), body, 0.3);
  paper(E(hx + 8, hy + 52, 72, 52), '#F6D9A0', 0.1);
  eyes(hx + 5, hy - 28, 20, o, 1);
  paper(() => { ctx.beginPath(); ctx.moveTo(hx - 22, hy + 22); ctx.lineTo(hx + 26, hy + 22); ctx.lineTo(hx + 2, hy + 48); ctx.closePath(); }, '#5A2E1E', 0);
  mouth(hx + 2, hy + 72, 60, o);
  ctx.restore();
}

/** RABBIT — small, white, long ears, buck teeth */
export function rabbit(o) {
  begin(o);
  const fur = '#F4EEE6', shade = '#D9CFC4', pink = '#F2A6B4';
  const earA = o.mood === 'scared' ? 0.5 : Math.sin((o.t || 0) * 2.5) * 0.08;
  for (const d of [-1, 1]) { ctx.save(); ctx.translate(20 + d * 30, -250); ctx.rotate(d * 0.18 + earA * d); paper(E(0, -95, 30, 100), fur); paper(E(0, -90, 15, 75), pink, 0); ctx.restore(); }
  legs([-40, 40], -60, 60, 40, fur, o, shade);
  paper(E(0, -110, 80, 90), fur, 0.6); paper(E(5, -95, 50, 55), '#FFFFFF', 0); paper(P_circ(-80, -100, 26), '#FFFFFF');
  const hx = 25, hy = -215;
  paper(P_circ(hx, hy, 78), fur, 0.4);
  for (const d of [-1, 1]) paper(P_circ(hx + d * 48, hy + 30, 16), rgba('#F2A6B4', 0.7), 0);
  eyes(hx + 2, hy - 12, 17, o, 2, 2.6);
  circle(hx + 4, hy + 18, 9, '#E07A8A');
  if ((o.talk || 0) < 0.08) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(hx - 8, hy + 30, 16, 18); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(hx - 8, hy + 30, 16, 18); }
  mouth(hx + 4, hy + 34, 36, o, '#F28A9A');
  ctx.restore();
}

/** DEER — tan with white spots and small antlers */
export function deer(o) {
  begin(o); const c = '#C98A52', d2 = '#A86E3E';
  legs([-80, 70, -50, 100], -150, 170, 30, c, o, d2);
  paper(E(0, -200, 140, 70), c, 0.6); for (let i = 0; i < 6; i++) circle(-70 + i * 26, -215 + (i % 2) * 22, 8, '#F4E6CC');
  paper(() => { ctx.beginPath(); ctx.moveTo(80, -230); ctx.lineTo(150, -360); ctx.lineTo(190, -340); ctx.lineTo(130, -210); ctx.closePath(); }, c);
  const hx = 175, hy = -370; ctx.strokeStyle = '#7A4E2A'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + d * 20, hy - 45); ctx.lineTo(hx + d * 40, hy - 110); ctx.moveTo(hx + d * 32, hy - 85); ctx.lineTo(hx + d * 60, hy - 100); ctx.stroke(); paper(E(hx + d * 55, hy - 30, 32, 14, d * 0.4), c); }
  paper(E(hx, hy, 55, 62), c, 0.3); paper(E(hx + 20, hy + 30, 30, 22), '#F4E6CC', 0);
  eyes(hx, hy - 10, 13, o, 3); circle(hx + 30, hy + 22, 9, INK); mouth(hx + 18, hy + 42, 26, o);
  ctx.restore();
}

/** MONKEY — brown, round face, big ears, curly tail */
export function monkey(o) {
  begin(o); const c = '#8A5A34', face = '#E8C39A';
  ctx.strokeStyle = c; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-60, -90); ctx.bezierCurveTo(-170, -80, -170, -220, -110, -220); ctx.stroke();
  legs([-35, 35], -70, 70, 34, c, o, '#6E4626');
  paper(E(0, -130, 70, 80), c, 0.6); paper(E(0, -120, 40, 50), face, 0);
  const hx = 0, hy = -255; for (const d of [-1, 1]) { paper(P_circ(hx + d * 70, hy, 30), c); paper(P_circ(hx + d * 70, hy, 16), face, 0); }
  paper(P_circ(hx, hy, 72), c, 0.3); paper(E(hx, hy + 12, 52, 50), face, 0);
  eyes(hx, hy - 5, 14, o, 4, 2.4); mouth(hx, hy + 34, 34, o);
  ctx.restore();
}

/** ELEPHANT — grey, big ears, swinging trunk */
export function elephant(o) {
  begin(o); const c = '#9AA3B0', d2 = '#7E8794';
  legs([-110, 80, -70, 120], -170, 170, 70, c, o, d2);
  paper(E(0, -270, 200, 140), c, 0.7);
  const hx = 190, hy = -330; paper(E(hx - 40, hy, 95, 120, -0.2), d2, 0.4); paper(E(hx - 40, hy, 70, 95, -0.2), '#E6B8C0', 0);
  paper(P_circ(hx + 40, hy - 10, 95), c, 0.3);
  ctx.strokeStyle = c; ctx.lineWidth = 46; ctx.lineCap = 'round'; ctx.beginPath(); const sw = Math.sin((o.t || 0) * 2) * 30;
  ctx.moveTo(hx + 95, hy + 20); ctx.quadraticCurveTo(hx + 150 + sw, hy + 120, hx + 120 + sw, hy + 210); ctx.stroke();
  paper(() => { ctx.beginPath(); ctx.moveTo(hx + 70, hy + 60); ctx.lineTo(hx + 120, hy + 75); ctx.lineTo(hx + 75, hy + 85); ctx.closePath(); }, '#FFF8EC', 0);
  eyes(hx + 50, hy - 30, 14, o, 5, 2.2); mouth(hx + 40, hy + 50, 26, o);
  ctx.restore();
}

/** a stone well; reflection(fn) draws something inside the water (already clipped) */
export function well(x, y, s, t, reflection) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  paper(E(0, -120, 260, 70), '#6A6258', 0.6);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -120, 215, 52, 0, 0, TAU); ctx.clip();
  const g = ctx.createLinearGradient(0, -170, 0, -70); g.addColorStop(0, '#1E3A4A'); g.addColorStop(1, '#0A1820'); ctx.fillStyle = g; ctx.fillRect(-220, -180, 440, 120);
  if (reflection) reflection(t); ctx.strokeStyle = 'rgba(200,230,255,0.25)'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(0, -120, 40 + ((t * 40 + i * 50) % 200), 10 + ((t * 10 + i * 12) % 48), 0, 0, TAU); ctx.stroke(); }
  ctx.restore();
  paper(() => { ctx.beginPath(); ctx.ellipse(0, -120, 260, 70, 0, 0, Math.PI); ctx.lineTo(260, 60); ctx.ellipse(0, 60, 260, 70, 0, 0, Math.PI); ctx.lineTo(-260, -120); ctx.closePath(); }, '#8A8070', 0.7);
  ctx.strokeStyle = 'rgba(40,30,20,0.35)'; ctx.lineWidth = 4; for (let r = 0; r < 3; r++) for (let i = 0; i < 6; i++) { const bx = -230 + i * 90 + (r % 2) * 45, by = -50 + r * 50; ctx.strokeRect(bx, by, 80, 42); }
  for (const d of [-1, 1]) paper(P_rr(d * 230 - 14, -330, 28, 230, 6), '#7A5634', 0.5);
  paper(P_rr(-250, -345, 500, 28, 10), '#8A6440', 0.5);
  ctx.restore();
}

/** jungle background: sky, 3 parallax tree layers, bushes, grass; px = camera pan */
export function jungle(t, o = {}) {
  const sky = o.sky || [[0, '#7EC8E3'], [0.6, '#BFE6C8'], [1, '#E8F4C8']], px = o.px || 0;
  const g = ctx.createLinearGradient(0, -300, 0, H); sky.forEach(([k, c]) => g.addColorStop(k, c)); ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  if (o.sun !== false) { glow(o.sunX ?? 820, o.sunY ?? 360, 260, o.sunCol || '#FFF2B0', 0.7); circle(o.sunX ?? 820, o.sunY ?? 360, 90, o.sunCol || '#FFF2B0'); }
  for (let i = 0; i < 4; i++) { const cx = ((i * 380 + t * 14) % 1600) - 300, cy = 220 + (i % 2) * 120; for (const [dx, r] of [[-60, 50], [0, 72], [70, 55]]) circle(cx + dx, cy, r, 'rgba(255,255,255,0.85)'); }
  const layers = [[1050, '#5E9E6A', 0.2, 0], [1220, '#3F7E50', 0.5, 7], [1420, '#2C6040', 0.9, 13]];
  if (o.dark) layers.forEach((l) => (l[1] = o.dark[layers.indexOf(l)]));
  for (const [base, col, par, seed] of layers) {
    for (let i = -2; i < 9; i++) { const x = i * 170 + ((px * par) % 170) + rnd(i + seed) * 60, h = 260 + rnd(i * 3 + seed) * 220, r = 110 + rnd(i + 9 + seed) * 50;
      paper(P_rr(x - 16, base - h * 0.4, 32, h * 0.4 + 40, 8), '#5A3E26', 0.2); paper(P_circ(x, base - h * 0.5, r), col, 0.35); paper(P_circ(x - r * 0.6, base - h * 0.35, r * 0.7), col, 0.3); paper(P_circ(x + r * 0.6, base - h * 0.38, r * 0.7), col, 0.3); }
  }
  paper(P_rr(-300, 1450, W + 600, H, 0), o.ground || '#7BB05A', 0);
  ctx.fillStyle = rgba('#5E9446', 0.8); for (let i = 0; i < 70; i++) { const x = rnd(i) * W * 1.2 - 60, y = 1460 + rnd(i + 3) * 420; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 6, y - 26 - 8 * Math.sin(t * 2 + i)); ctx.lineTo(x + 12, y); ctx.fill(); }
  for (let i = 0; i < 9; i++) { const x = rnd(i + 40) * W, y = 1480 + rnd(i + 41) * 300; circle(x, y, 9, ['#FFD84A', '#F28AB0', '#FFFFFF'][i % 3]); circle(x, y, 4, '#E0A020'); }
}

/** speech bubble with text (Devanagari OK) */
export function bubble(text, x, y, sc = 1, tailX = 0, size = 50, col = '#FFFFFF') {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.font = `700 ${size}px Martel`; const w = ctx.measureText(text).width + 70, h = size * 1.9;
  paper(() => { ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, h / 2); ctx.moveTo(tailX - 20, h / 2 - 4); ctx.lineTo(tailX + 30, h / 2 + 50); ctx.lineTo(tailX + 30, h / 2 - 4); }, col, 0.5);
  ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 6); ctx.restore();
}
/** comic burst word: "छपाक!", "ग्र्र्र!" */
export function burst(text, x, y, sc = 1, col = '#FFD84A', size = 110) {
  if (sc <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-0.08);
  paper(() => { ctx.beginPath(); for (let i = 0; i <= 24; i++) { const a = i / 24 * TAU, r = i % 2 ? 150 : 230; ctx.lineTo(Math.cos(a) * r * 1.3, Math.sin(a) * r * 0.8); } ctx.closePath(); }, col, 0.6);
  ctx.font = `800 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 12; ctx.strokeStyle = '#FFFFFF'; ctx.strokeText(text, 0, 8); ctx.fillStyle = '#C8302A'; ctx.fillText(text, 0, 8); ctx.restore();
}
