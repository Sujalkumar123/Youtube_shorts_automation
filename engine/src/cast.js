// The cast, in cut paper with real character: Shiva, a raja (Sagara / Bhagiratha), Kapila, the princes, the horse.
import { ctx, TAU, clamp, lerp, rnd, circle, ell } from './core/lib.js';
import * as K from './core/kit.js';
import { A, glow, rgba } from './atmos.js';
const { cut, P_poly, P_circ, P_rr } = K;
const SKIN = '#B97A4E', SKIN_D = '#9C6340', INK = '#2A1C14', GOLD = '#E0A93A', GOLD_D = '#B07A22', CRIMSON = '#A8322D', CREAM = '#EFE3C8';
const rad = (d) => d * Math.PI / 180;

/** a tapered limb from (x, y): upper segment angle a1 (deg, 0 = straight down, + = toward +x), length l1; forearm a2, l2; widths w1, w2 */
function limb(x, y, a1, l1, a2, l2, w1, w2, col, band) {
  const d1 = [Math.sin(rad(a1)), Math.cos(rad(a1))], ex = x + d1[0] * l1, ey = y + d1[1] * l1;
  const d2 = [Math.sin(rad(a2)), Math.cos(rad(a2))], hx = ex + d2[0] * l2, hy = ey + d2[1] * l2;
  const seg = (ax, ay, bx, by, wa, wb) => { const nx = -(by - ay), ny = bx - ax, L = Math.hypot(nx, ny) || 1; const ux = nx / L, uy = ny / L;
    cut(() => { ctx.beginPath(); ctx.moveTo(ax + ux * wa / 2, ay + uy * wa / 2); ctx.lineTo(bx + ux * wb / 2, by + uy * wb / 2); ctx.arc(bx, by, wb / 2, Math.atan2(uy, ux), Math.atan2(uy, ux) + Math.PI); ctx.lineTo(ax - ux * wa / 2, ay - uy * wa / 2); ctx.arc(ax, ay, wa / 2, Math.atan2(-uy, -ux), Math.atan2(-uy, -ux) + Math.PI); ctx.closePath(); }, col, { shadow: 0.45, edge: 3 }); };
  seg(x, y, ex, ey, w1, (w1 + w2) / 2); seg(ex, ey, hx, hy, (w1 + w2) / 2, w2);
  cut(P_circ(ex, ey, (w1 + w2) / 4 + 1), col, { shadow: 0, edge: 0 }); cut(P_circ(x, y, w1 / 2), col, { shadow: 0, edge: 0 }); cut(P_circ(hx, hy, w2 / 2), col, { shadow: 0, edge: 0 });
  if (band) { const bx = lerp(x, ex, 0.35), by = lerp(y, ey, 0.35); ctx.save(); ctx.translate(bx, by); ctx.rotate(-rad(a1)); cut(P_rr(-w1 * 0.55, -7, w1 * 1.1, 14, 6), band, { shadow: 0.2, edge: 2 }); ctx.restore(); }
  return [hx, hy, ex, ey];
}
function eyes(y, open, sep = 26, col = INK, s = 1) {
  for (const k of [-1, 1]) {
    if (open < 0.5) { ctx.strokeStyle = col; ctx.lineWidth = 5 * s; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(k * sep, y - 4, 13 * s, 0.12 * Math.PI, 0.88 * Math.PI); ctx.stroke(); }
    else { ctx.fillStyle = '#F7EFDC'; ctx.beginPath(); ctx.ellipse(k * sep, y, 15 * s, 9 * s * open, 0, 0, TAU); ctx.fill(); circle(k * sep, y, 6.5 * s * open, col); }
  }
}

// ═════════ RAJA (Sagara, Bhagiratha) ═════════
/** o = { x, y, h (total height), pose: 'stand'|'tapas'|'walk'|'decree', t, eyes 0..1, dir, robe, sash } */
export function raja(o) {
  const s = (o.h || 900) / 1150, t = o.t || 0, pose = o.pose || 'stand', robe = o.robe || CREAM, sash = o.sash || CRIMSON, wk = pose === 'walk' ? Math.sin(t * 7) : 0;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s * (o.dir || 1), s);
  // hair behind
  cut(() => { ctx.beginPath(); ctx.moveTo(-80, -900); ctx.quadraticCurveTo(-120, -780, -95, -700); ctx.lineTo(95, -700); ctx.quadraticCurveTo(120, -780, 80, -900); ctx.closePath(); }, INK, { shadow: 0.4, edge: 3 });
  // back arm
  const armsBack = { stand: [-14, -6], tapas: [-172, 150.6], walk: [-22 * wk, -34 * wk], decree: [-14, -6] }[pose];
  limb(-100, -730, armsBack[0], 170, armsBack[1], pose === 'tapas' ? 232 : 150, 66, 48, SKIN_D, GOLD);
  // legs + dhoti
  for (const k of [-1, 1]) { const sw = k * wk * 40; cut(P_rr(k * 48 - 26 + sw * 0.5, -260, 52, 250, 22), SKIN_D, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(k * 52 + sw * 0.6 + k * 12, -8, 44, 18, 0, 0, TAU); }, SKIN_D, { shadow: 0.3, edge: 3 }); }
  cut(() => { ctx.beginPath(); ctx.moveTo(-108, -490); ctx.lineTo(108, -490); ctx.quadraticCurveTo(150, -330, 128 + wk * 20, -170); ctx.lineTo(16, -200); ctx.lineTo(0, -150); ctx.lineTo(-16, -200); ctx.lineTo(-128 + wk * 20, -170); ctx.quadraticCurveTo(-150, -330, -108, -490); ctx.closePath(); }, robe);
  ctx.strokeStyle = 'rgba(120,90,50,0.35)'; ctx.lineWidth = 4; for (const x of [-50, 0, 50]) { ctx.beginPath(); ctx.moveTo(x * 0.8, -470); ctx.lineTo(x * 1.4, -200); ctx.stroke(); }
  ctx.strokeStyle = GOLD; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(-128 + wk * 20, -176); ctx.lineTo(-16, -206); ctx.moveTo(16, -206); ctx.lineTo(128 + wk * 20, -176); ctx.stroke();
  // torso
  cut(() => { ctx.beginPath(); ctx.moveTo(-118, -770); ctx.quadraticCurveTo(-130, -620, -96, -480); ctx.lineTo(96, -480); ctx.quadraticCurveTo(130, -620, 118, -770); ctx.quadraticCurveTo(0, -800, -118, -770); ctx.closePath(); }, SKIN);
  const g = ctx.createLinearGradient(-120, 0, 120, 0); g.addColorStop(0, 'rgba(0,0,0,0.18)'); g.addColorStop(0.5, 'rgba(255,255,255,0.06)'); g.addColorStop(1, 'rgba(0,0,0,0.12)'); ctx.fillStyle = g; ctx.fill();
  // waist band + sash
  cut(P_rr(-112, -510, 224, 44, 12), sash, { shadow: 0.3, edge: 3 }); cut(P_rr(-112, -500, 224, 10, 4), GOLD, { shadow: 0, edge: 0 });
  cut(P_poly([[-118, -770], [-70, -780], [110, -505], [60, -495]]), sash, { shadow: 0.4, edge: 3 });
  cut(P_poly([[-118, -770], [-100, -778], [92, -510], [80, -500]]), GOLD, { shadow: 0, edge: 0 });
  // necklaces
  for (const [r, w, c] of [[70, 9, GOLD], [96, 7, GOLD], [118, 5, '#F7EFDC']]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, -800, r, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
  cut(P_poly([[0, -660], [-16, -690], [0, -712], [16, -690]]), CRIMSON, { shadow: 0.2, edge: 2 });
  // neck + head
  cut(P_rr(-30, -840, 60, 70, 20), SKIN_D, { shadow: 0.2, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -900, 70, 82, 0, 0, TAU); }, SKIN);
  for (const k of [-1, 1]) { circle(k * 72, -885, 12, SKIN_D); circle(k * 74, -858, 11, GOLD); }
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 12, -940); ctx.quadraticCurveTo(k * 30, -952, k * 48, -942); ctx.stroke(); }
  eyes(-915, o.eyes ?? 1, 28);
  cut(() => { ctx.beginPath(); ctx.moveTo(-34, -862); ctx.quadraticCurveTo(-16, -878, 0, -866); ctx.quadraticCurveTo(16, -878, 34, -862); ctx.quadraticCurveTo(16, -868, 0, -858); ctx.quadraticCurveTo(-16, -868, -34, -862); ctx.closePath(); }, INK, { shadow: 0, edge: 0 });
  ctx.fillStyle = CRIMSON; ctx.fillRect(-3, -965, 6, 26);
  // crown (mukut)
  cut(P_rr(-82, -985, 164, 30, 8), GOLD, { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-84, -982); ctx.lineTo(-96, -1040); ctx.lineTo(-62, -1022); ctx.lineTo(-44, -1075); ctx.lineTo(-20, -1040); ctx.lineTo(0, -1100); ctx.lineTo(20, -1040); ctx.lineTo(44, -1075); ctx.lineTo(62, -1022); ctx.lineTo(96, -1040); ctx.lineTo(84, -982); ctx.closePath(); }, GOLD, { shadow: 0.5, edge: 3 });
  cut(P_rr(-88, -1000, 176, 22, 8), GOLD_D, { shadow: 0.2, edge: 2 }); for (let i = -3; i <= 3; i++) circle(i * 24, -989, 5, i % 2 ? '#F7EFDC' : CRIMSON);
  cut(P_poly([[0, -1030], [-15, -1052], [0, -1076], [15, -1052]]), CRIMSON, { shadow: 0.2, edge: 2 }); circle(0, -1106, 9, '#F7EFDC'); for (const k of [-1, 1]) circle(k * 44, -1080, 7, '#F7EFDC');
  // front arm
  const armsF = { stand: [14, 6], tapas: [172, -150.6], walk: [22 * wk, 34 * wk], decree: [118, 150] }[pose];
  const hand = limb(100, -730, armsF[0], 170, armsF[1], pose === 'tapas' ? 232 : 150, 66, 48, SKIN, GOLD);
  if (pose === 'tapas') { glow(0, hand[1] - 30, 160, A.paleGold, 0.45 + 0.15 * Math.sin(t * 3)); cut(() => { ctx.beginPath(); ctx.moveTo(-26, hand[1] + 14); ctx.quadraticCurveTo(-24, hand[1] - 70, 0, hand[1] - 100); ctx.quadraticCurveTo(24, hand[1] - 70, 26, hand[1] + 14); ctx.closePath(); }, SKIN, { shadow: 0.3, edge: 3 }); }
  ctx.restore();
  return hand;
}

// ═════════ the princes: warriors in silhouette with a rim light ═════════
export function warrior(x, y, h, col, rim, t = 0, seed = 0) {
  const s = h / 300; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sway = Math.sin(t * 2 + seed) * 2;
  ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(42, 10); ctx.lineTo(48 + sway, -330); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(48 + sway, -360); ctx.lineTo(56 + sway, -326); ctx.lineTo(40 + sway, -326); ctx.closePath(); ctx.fill();
  const body = () => { ctx.beginPath(); ctx.moveTo(-34, 0); ctx.lineTo(-28, -120); ctx.lineTo(-44, -210); ctx.quadraticCurveTo(0, -232, 44, -210); ctx.lineTo(28, -120); ctx.lineTo(34, 0); ctx.closePath(); ctx.moveTo(26, -258); ctx.arc(0, -258, 26, 0, TAU); ctx.moveTo(-30, -262); ctx.quadraticCurveTo(0, -310, 30, -262); ctx.closePath(); };
  ctx.save(); ctx.translate(5, -2); body(); ctx.fillStyle = rim; ctx.fill(); ctx.restore();
  body(); ctx.fillStyle = col; ctx.fill();
  ctx.save(); ctx.translate(4, -2); ctx.beginPath(); ctx.arc(-40, -150, 40, 0, TAU); ctx.fillStyle = rim; ctx.fill(); ctx.restore(); circle(-40, -150, 40, col);
  ctx.restore();
}

// ═════════ KAPILA, seated ═════════
/** eyes 0..1 open; fire 0..1 the blaze of his gaze */
export function kapila(x, y, s, o = {}) {
  const t = o.t || 0, open = o.eyes || 0, fire = o.fire || 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  glow(0, -360, 420, A.paleGold, 0.28 + 0.06 * Math.sin(t * 1.5));
  if (fire > 0) { glow(0, -380, 900 * fire, A.gold, 0.7 * fire); glow(0, -380, 500 * fire, '#FF8A3D', 0.6 * fire);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 18; i++) { const a = i / 18 * TAU + t * 0.3, r0 = 130, r1 = 260 + 160 * fire + 40 * Math.sin(t * 7 + i); const gg = ctx.createLinearGradient(Math.cos(a) * r0, -380 + Math.sin(a) * r0, Math.cos(a) * r1, -380 + Math.sin(a) * r1); gg.addColorStop(0, rgba(A.gold, 0.8 * fire)); gg.addColorStop(1, rgba(A.gold, 0)); ctx.strokeStyle = gg; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r0, -380 + Math.sin(a) * r0); ctx.lineTo(Math.cos(a) * r1, -380 + Math.sin(a) * r1); ctx.stroke(); } ctx.restore(); }
  // halo ring
  ctx.strokeStyle = rgba(A.gold, 0.7); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -390, 150, 0, TAU); ctx.stroke();
  // seat (deer skin) + crossed legs
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -10, 230, 46, 0, 0, TAU); }, '#8A6A48', { shadow: 0.6, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -60, 185, 60, 0, 0, TAU); }, A.saffron);
  cut(() => { ctx.beginPath(); ctx.ellipse(-60, -70, 90, 34, 0.2, 0, TAU); }, '#D4842F', { shadow: 0.3, edge: 3 });
  // body + shawl folds
  cut(() => { ctx.beginPath(); ctx.moveTo(-98, -310); ctx.quadraticCurveTo(-150, -180, -130, -80); ctx.lineTo(130, -80); ctx.quadraticCurveTo(150, -180, 98, -310); ctx.quadraticCurveTo(0, -330, -98, -310); ctx.closePath(); }, A.saffron);
  cut(P_poly([[-98, -310], [-40, -322], [90, -90], [30, -84]]), '#C46A28', { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = 'rgba(120,50,20,0.35)'; ctx.lineWidth = 4; for (const k of [-60, 60]) { ctx.beginPath(); ctx.moveTo(k, -250); ctx.quadraticCurveTo(k * 1.3, -170, k * 1.1, -100); ctx.stroke(); }
  // arms resting, hands in dhyana mudra
  for (const k of [-1, 1]) limb(k * 100, -290, k * 18, 120, -k * 60, 105, 46, 36, A.saffron);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -112, 46, 20, 0, 0, TAU); }, SKIN, { shadow: 0.3, edge: 3 });
  // rudraksha
  for (let i = 0; i < 13; i++) { const a = Math.PI * (0.12 + i * 0.06); circle(Math.cos(a) * 66, -320 + Math.sin(a) * 120, 8, '#6E3B22'); }
  // head
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -390, 62, 72, 0, 0, TAU); }, SKIN);
  ctx.strokeStyle = '#F7F3EA'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-34, -432 + i * 9); ctx.lineTo(34, -432 + i * 9); ctx.stroke(); } circle(0, -436, 6, CRIMSON);
  ctx.strokeStyle = '#E8E2D4'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 10, -414); ctx.quadraticCurveTo(k * 28, -424, k * 46, -414); ctx.stroke(); }
  if (open > 0.5) { for (const k of [-1, 1]) { glow(k * 24, -398, 40 + 40 * fire, A.gold, 0.9); ctx.fillStyle = '#FFF6D8'; ctx.beginPath(); ctx.ellipse(k * 24, -398, 15, 9 * open, 0, 0, TAU); ctx.fill(); circle(k * 24, -398, 6 * open, fire > 0.3 ? '#FF8A3D' : INK); } }
  else eyes(-398, 0, 24);
  // beard: long, layered
  cut(() => { ctx.beginPath(); ctx.moveTo(-58, -380); ctx.quadraticCurveTo(-70, -300, -30, -200); ctx.quadraticCurveTo(0, -150, 30, -200); ctx.quadraticCurveTo(70, -300, 58, -380); ctx.quadraticCurveTo(30, -350, 0, -352); ctx.quadraticCurveTo(-30, -350, -58, -380); ctx.closePath(); }, '#F2EEE6', { shadow: 0.4, edge: 3 });
  ctx.strokeStyle = 'rgba(160,150,135,0.5)'; ctx.lineWidth = 3; for (const k of [-24, 0, 24]) { ctx.beginPath(); ctx.moveTo(k, -340); ctx.quadraticCurveTo(k * 0.7, -270, k * 0.3, -200); ctx.stroke(); }
  cut(() => { ctx.beginPath(); ctx.moveTo(-30, -362); ctx.quadraticCurveTo(0, -378, 30, -362); ctx.quadraticCurveTo(0, -368, -30, -362); }, '#F2EEE6', { shadow: 0, edge: 2 });
  // jata bun
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -480, 46, 40, 0, 0, TAU); }, '#D8D0C0', { shadow: 0.4, edge: 3 });
  ctx.strokeStyle = 'rgba(120,110,95,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(0, -480, 30, 24, 0, 0, TAU); ctx.stroke();
  // kamandalu
  cut(() => { ctx.beginPath(); ctx.ellipse(230, -50, 46, 52, 0, 0, TAU); }, '#7A4A2A', { shadow: 0.5, edge: 3 }); ctx.strokeStyle = '#7A4A2A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(230, -110, 34, Math.PI, TAU); ctx.stroke();
  ctx.restore();
}

// ═════════ SHIVA ═════════
const SH = '#5F86B5', SH_L = '#7FA4CF', SH_D = '#486C98', JATA = '#22160F';
/** standing Shiva, base at (x, y). o = { s, t, lockWater 0..1, stream 0..1, aura 0..1, eyes 0..1 } */
export function shiva(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0, aura = o.aura ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // aura + halo
  if (aura > 0) { glow(0, -940, 520, A.paleGold, 0.35 * aura); glow(0, -940, 260, '#FFFFFF', 0.25 * aura);
    ctx.save(); ctx.globalAlpha = aura; ctx.strokeStyle = rgba(A.gold, 0.85); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -950, 210, 0, TAU); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -950, 232, 0, TAU); ctx.stroke();
      for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + t * 0.15; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 240, -950 + Math.sin(a) * 240); ctx.lineTo(Math.cos(a) * 262, -950 + Math.sin(a) * 262); ctx.stroke(); } ctx.restore(); }
  // flowing locks behind
  for (let i = 0; i < 7; i++) { const k = i - 3, sw = Math.sin(t * 1.4 + i) * 10;
    cut(() => { ctx.beginPath(); ctx.moveTo(k * 22, -1000); ctx.bezierCurveTo(k * 40 - 20, -880, k * 52 + sw - 30, -760, k * 46 + sw, -600 + Math.abs(k) * 20); ctx.lineTo(k * 46 + sw + 22, -610 + Math.abs(k) * 20); ctx.bezierCurveTo(k * 52 + sw - 6, -760, k * 40, -880, k * 22 + 24, -1000); ctx.closePath(); }, JATA, { shadow: 0.4, edge: 2 }); }
  // trident (behind the back hand)
  ctx.save(); ctx.translate(-250, 0);
  cut(P_rr(-8, -1240, 16, 1250, 6), '#3A2A1E', { shadow: 0.6, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-90, -1240); ctx.quadraticCurveTo(-86, -1120, 0, -1100); ctx.quadraticCurveTo(86, -1120, 90, -1240); ctx.lineTo(108, -1250); ctx.lineTo(70, -1238); ctx.quadraticCurveTo(64, -1150, 0, -1136); ctx.quadraticCurveTo(-64, -1150, -70, -1238); ctx.lineTo(-108, -1250); ctx.closePath(); ctx.moveTo(-12, -1120); ctx.lineTo(0, -1340); ctx.lineTo(12, -1120); }, '#C9CCD3', { shadow: 0.5, edge: 3 });
  // damru tied on the shaft
  const dm = Math.sin(t * 6) * 0.15; ctx.save(); ctx.translate(30, -1050); ctx.rotate(dm);
  cut(() => { ctx.beginPath(); ctx.moveTo(-30, -36); ctx.lineTo(30, -36); ctx.lineTo(6, 0); ctx.lineTo(30, 36); ctx.lineTo(-30, 36); ctx.lineTo(-6, 0); ctx.closePath(); }, '#8A5A32', { shadow: 0.4, edge: 3 }); ctx.restore();
  ctx.strokeStyle = CRIMSON; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(8, -1080); ctx.quadraticCurveTo(40, -1040 + Math.sin(t * 3) * 10, 30, -990); ctx.stroke();
  ctx.restore();
  // back arm holding trident
  limb(-120, -790, -40, 190, -10, 160, 74, 56, SH_D, GOLD);
  // legs
  for (const k of [-1, 1]) { cut(P_rr(k * 58 - 32, -300, 64, 290, 26), SH_D, { shadow: 0.4, edge: 3 }); cut(() => { ctx.beginPath(); ctx.ellipse(k * 66, -10, 52, 20, 0, 0, TAU); }, SH_D, { shadow: 0.3, edge: 3 }); for (let j = 0; j < 3; j++) circle(k * 62, -60 + j * 0, 0, GOLD); ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(k * 58 - 30, -46); ctx.lineTo(k * 58 + 30, -46); ctx.stroke(); }
  // tiger-skin wrap
  cut(() => { ctx.beginPath(); ctx.moveTo(-130, -560); ctx.lineTo(130, -560); ctx.quadraticCurveTo(170, -420, 150, -280); for (let i = 0; i <= 8; i++) ctx.lineTo(150 - i * 37.5, -280 + (i % 2 ? 26 : 0)); ctx.quadraticCurveTo(-170, -420, -130, -560); ctx.closePath(); }, '#D98B3A');
  ctx.save(); ctx.clip(); ctx.strokeStyle = '#3A2414'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (let i = 0; i < 9; i++) { const xx = -130 + i * 34, yy = -520 + (i % 3) * 70; ctx.beginPath(); ctx.moveTo(xx, yy); ctx.quadraticCurveTo(xx + 18, yy + 30, xx + 6, yy + 60); ctx.stroke(); } ctx.restore();
  cut(P_rr(-134, -580, 268, 34, 12), '#E3D6B6', { shadow: 0.3, edge: 3 });
  // torso: broad, shaded
  const torso = () => { ctx.beginPath(); ctx.moveTo(-150, -860); ctx.quadraticCurveTo(-176, -760, -132, -560); ctx.lineTo(132, -560); ctx.quadraticCurveTo(176, -760, 150, -860); ctx.quadraticCurveTo(0, -900, -150, -860); ctx.closePath(); };
  cut(torso, SH); ctx.save(); torso(); ctx.clip(); const g = ctx.createLinearGradient(-170, 0, 170, 0); g.addColorStop(0, rgba(SH_D, 0.9)); g.addColorStop(0.45, rgba(SH_L, 0.6)); g.addColorStop(1, rgba(SH_D, 0.7)); ctx.fillStyle = g; ctx.fillRect(-200, -920, 400, 380);
  ctx.strokeStyle = rgba(SH_D, 0.8); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-60, -790); ctx.quadraticCurveTo(0, -760, 60, -790); ctx.moveTo(0, -760); ctx.lineTo(0, -600); ctx.stroke(); ctx.restore();
  // sacred thread
  ctx.strokeStyle = '#F7F3EA'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-120, -860); ctx.quadraticCurveTo(20, -720, 120, -575); ctx.stroke();
  // rudraksha malas
  for (const [r, n] of [[96, 15], [130, 19]]) for (let i = 0; i < n; i++) { const a = Math.PI * (0.1 + i * 0.8 / (n - 1)); circle(Math.cos(a) * r * 0.95, -880 + Math.sin(a) * r, 10, '#5A2E1A'); }
  // neck (neelkanth) + snake
  cut(P_rr(-38, -940, 76, 90, 26), '#3E6190', { shadow: 0.3, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -868, 92, 30, 0, 0, Math.PI); ctx.ellipse(0, -868, 72, 18, 0, Math.PI, 0, true); ctx.closePath(); }, '#4F7A3A', { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(84, -880); ctx.quadraticCurveTo(140, -930, 120, -1000); ctx.quadraticCurveTo(160, -1040, 140, -1080); ctx.quadraticCurveTo(100, -1100, 92, -1050); ctx.quadraticCurveTo(84, -1000, 100, -960); ctx.quadraticCurveTo(100, -920, 70, -888); ctx.closePath(); }, '#4F7A3A', { shadow: 0.4, edge: 3 });
  circle(108, -1060, 5, '#F2C14E'); circle(128, -1062, 5, '#F2C14E');
  // head
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -1010, 84, 100, 0, 0, TAU); }, SH);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -1010, 84, 100, 0, 0, TAU); ctx.clip(); const hg = ctx.createRadialGradient(-20, -1030, 10, 0, -1010, 110); hg.addColorStop(0, rgba(SH_L, 0.7)); hg.addColorStop(1, rgba(SH_D, 0.6)); ctx.fillStyle = hg; ctx.fillRect(-100, -1120, 200, 220); ctx.restore();
  for (const k of [-1, 1]) { circle(k * 86, -990, 15, SH_D); cut(() => { ctx.beginPath(); ctx.ellipse(k * 90, -945, 16, 30, 0, 0, TAU); }, GOLD, { shadow: 0.3, edge: 2 }); }
  ctx.strokeStyle = '#1C2A44'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 14, -1050); ctx.quadraticCurveTo(k * 36, -1064, k * 60, -1050); ctx.stroke(); }
  eyes(-1024, o.eyes || 0, 32, '#1C2A44', 1.2);
  ctx.strokeStyle = '#F7F3EA'; ctx.lineWidth = 5; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(-44, -1096 + i * 11); ctx.quadraticCurveTo(0, -1104 + i * 11, 44, -1096 + i * 11); ctx.stroke(); }
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -1072, 7, 16, 0, 0, TAU); }, CRIMSON, { shadow: 0, edge: 2 }); glow(0, -1072, 26, '#FF8A3D', 0.5);
  ctx.strokeStyle = '#2E3F63'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-20, -960); ctx.quadraticCurveTo(0, -950, 20, -960); ctx.stroke();
  // jata: coiled tower of matted hair
  cut(() => { ctx.beginPath(); ctx.moveTo(-96, -1060); ctx.quadraticCurveTo(-110, -1140, -70, -1180); ctx.lineTo(70, -1180); ctx.quadraticCurveTo(110, -1140, 96, -1060); ctx.quadraticCurveTo(0, -1110, -96, -1060); ctx.closePath(); }, JATA, { shadow: 0.4, edge: 3 });
  for (let i = 0; i < 4; i++) cut(() => { ctx.beginPath(); ctx.ellipse(0, -1180 - i * 46, 76 - i * 12, 34, 0, 0, TAU); }, i % 2 ? '#2E2016' : JATA, { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = 'rgba(120,90,60,0.5)'; ctx.lineWidth = 3; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(0, -1180 - i * 46, 56 - i * 10, 20, 0, 0.2, Math.PI - 0.2); ctx.stroke(); }
  cut(P_rr(-80, -1100, 160, 22, 10), GOLD, { shadow: 0.3, edge: 2 });
  // crescent moon
  cut(() => { ctx.beginPath(); ctx.arc(70, -1250, 44, -0.65 * Math.PI, 0.65 * Math.PI); ctx.arc(88, -1250, 34, 0.6 * Math.PI, -0.6 * Math.PI, true); ctx.closePath(); }, '#F7F3EA', { shadow: 0.3, edge: 2 }); glow(80, -1250, 70, '#FFFFFF', 0.35);
  // Ganga coiled in the jata
  if (o.lockWater > 0) { ctx.save(); ctx.globalAlpha = clamp(o.lockWater * 1.4); glow(0, -1220, 220, A.glowWater, 0.45 * o.lockWater);
    ctx.lineCap = 'round'; for (let k = 0; k < 4; k++) { const a0 = t * 2.4 + k * 1.6; ctx.strokeStyle = k % 2 ? A.glowWater : '#5FA8CC'; ctx.lineWidth = 16 - k * 2; ctx.beginPath(); ctx.ellipse(0, -1170 - k * 40, 104 - k * 8, 34 + k * 3, -0.18 + k * 0.12, a0, a0 + TAU * 0.78 * o.lockWater); ctx.stroke(); }
    ctx.restore(); }
  // front arm: abhaya mudra
  const hand = limb(130, -790, 52, 170, 172, 150, 74, 56, SH, GOLD);
  ctx.save(); ctx.translate(hand[0], hand[1]); cut(() => { ctx.beginPath(); ctx.roundRect(-30, -78, 60, 86, 24); }, SH, { shadow: 0.3, edge: 3 }); for (let i = 0; i < 4; i++) cut(P_rr(-28 + i * 15, -118 + Math.abs(i - 1.5) * 7, 13, 50, 6), SH, { shadow: 0.2, edge: 2 }); ctx.restore();
  // a thin stream from one lock
  if (o.stream > 0) { const pts = [[60, -1160], [170, -1120], [240, -1000], [280, -780], [330, -520], [420, -280], [560, -120], [760, -30], [1000, 20]]; const part = partialPts(pts, o.stream); if (part.length > 1) { ctx.save(); ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = A.glowWater; ctx.shadowBlur = 30; ctx.strokeStyle = rgba(A.glowWater, 0.5); ctx.lineWidth = 30; smoothPts(part); ctx.stroke(); ctx.restore(); ctx.save(); ctx.lineCap = 'round'; smoothPts(part); ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 22; ctx.stroke(); smoothPts(part); ctx.strokeStyle = '#5FA8CC'; ctx.lineWidth = 15; ctx.stroke(); ctx.setLineDash([20, 30]); ctx.lineDashOffset = -t * 120; smoothPts(part); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); } }
  ctx.restore();
}
function smoothPts(pts) { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length - 1; i++) { const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2; ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my); } const l = pts[pts.length - 1]; ctx.lineTo(l[0], l[1]); }
function partialPts(pts, p) { const L = [0]; for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const want = L[L.length - 1] * clamp(p), out = [pts[0]]; for (let i = 1; i < pts.length; i++) { if (L[i] <= want) { out.push(pts[i]); continue; } const k = (want - L[i - 1]) / (L[i] - L[i - 1]); out.push([lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]); break; } return out; }

// ═════════ the sacrificial horse ═════════
export function horse(x, y, s = 1, walk = 0, dir = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s); const lg = (i) => Math.sin(walk + i * Math.PI) * 0.4;
  const WHITE = '#F4EEE2', SHADE = '#D8CDB8';
  for (const [lx, i, c] of [[-95, 0, SHADE], [70, 1, SHADE]]) leg(lx, i, c);
  cut(() => { ctx.beginPath(); ctx.moveTo(-150, -230); ctx.bezierCurveTo(-215, -200, -220, -120, -190, -70); ctx.lineTo(-170, -78); ctx.bezierCurveTo(-185, -140, -170, -190, -135, -212); ctx.closePath(); }, '#E8E0D2', { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-160, -200); ctx.bezierCurveTo(-170, -280, -60, -275, 0, -270); ctx.bezierCurveTo(80, -275, 140, -270, 160, -210); ctx.bezierCurveTo(165, -150, 110, -128, 0, -132); ctx.bezierCurveTo(-110, -128, -160, -140, -160, -200); ctx.closePath(); }, WHITE);
  cut(() => { ctx.beginPath(); ctx.moveTo(100, -250); ctx.bezierCurveTo(130, -320, 160, -370, 200, -390); ctx.lineTo(250, -360); ctx.bezierCurveTo(210, -320, 190, -260, 160, -180); ctx.closePath(); }, WHITE);
  cut(() => { ctx.beginPath(); ctx.moveTo(196, -392); ctx.bezierCurveTo(240, -400, 285, -360, 292, -330); ctx.bezierCurveTo(294, -310, 270, -305, 250, -318); ctx.lineTo(228, -340); ctx.closePath(); }, WHITE);
  cut(P_poly([[196, -392], [206, -432], [222, -394]]), WHITE, { shadow: 0.2, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(110, -260); ctx.bezierCurveTo(130, -330, 160, -380, 200, -398); ctx.lineTo(196, -376); ctx.bezierCurveTo(170, -350, 140, -300, 128, -246); ctx.closePath(); }, '#CFC6B4', { shadow: 0.2, edge: 2 });
  circle(250, -360, 6, '#2A1C14');
  ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(206, -394); ctx.lineTo(270, -330); ctx.moveTo(226, -350); ctx.lineTo(246, -380); ctx.stroke();
  cut(P_poly([[206, -430], [196, -480], [214, -470], [218, -425]]), CRIMSON, { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-80, -268); ctx.lineTo(70, -270); ctx.lineTo(80, -168); ctx.quadraticCurveTo(0, -150, -90, -166); ctx.closePath(); }, CRIMSON, { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = GOLD; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-90, -172); ctx.quadraticCurveTo(0, -156, 80, -174); ctx.stroke(); for (let i = 0; i < 5; i++) circle(-70 + i * 35, -160, 7, GOLD);
  for (let i = 0; i < 5; i++) circle(120 + i * 18, -250 - i * 22, 8, GOLD);
  for (const [lx, i] of [[-60, 1], [105, 0]]) leg(lx, i, WHITE);
  ctx.restore();
  function leg(lx, i, c) { cut(() => { ctx.beginPath(); ctx.save(); ctx.translate(lx, -150); ctx.rotate(lg(i)); ctx.moveTo(-18, 0); ctx.lineTo(18, 0); ctx.lineTo(12, 140); ctx.lineTo(-12, 140); ctx.closePath(); ctx.restore(); }, c, { shadow: 0.4, edge: 3 }); ctx.save(); ctx.translate(lx, -150); ctx.rotate(lg(i)); ctx.fillStyle = '#5A4632'; ctx.fillRect(-14, 132, 28, 16); ctx.restore(); }
}
