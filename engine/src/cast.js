// The cast, in cut paper with real character: Shiva, a raja (Sagara / Bhagiratha), Kapila, the princes, the horse.
import { ctx, TAU, clamp, lerp, rnd, circle, ell, eob } from './core/lib.js';
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

// ═════════ DEVI (Kadru, Vinata, any queen / goddess) — added for "aruna" ═════════
/** standing woman in a sari, base at (x, y). o = { h, t, sari, border, pallu, pose: 'stand'|'boon'|'hold'|'namaste'|'bow'|'serve', eyes 0..1, dir, crown, glowA, hair } */
export function devi(o) {
  const s = (o.h || 900) / 1150, t = o.t || 0, pose = o.pose || 'stand', sari = o.sari || '#B8475A', border = o.border || GOLD, pallu = o.pallu || sari;
  const bow = pose === 'bow' ? 1 : pose === 'serve' ? 0.6 : 0;
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(s * (o.dir || 1), s);
  if (o.glowA) glow(0, -700, 520, A.paleGold, 0.3 * o.glowA);
  // long hair behind (braid down the back)
  cut(() => { ctx.beginPath(); ctx.moveTo(-74, -930); ctx.quadraticCurveTo(-120, -760, -70, -560); ctx.quadraticCurveTo(-30, -520, -10, -600); ctx.lineTo(70, -840); ctx.quadraticCurveTo(80, -930, -74, -930); ctx.closePath(); }, o.hair || INK, { shadow: 0.4, edge: 3 });
  ctx.save(); ctx.translate(0, -780); ctx.rotate(-0.12 * bow); ctx.translate(0, 780);
  // back arm
  const back = { stand: [-12, -4], boon: [-150, -170], hold: [-30, 60], namaste: [-30, 70], bow: [-30, 70], serve: [-40, 40] }[pose] || [-12, -4];
  limb(-92, -730, back[0], 165, back[1], 145, 56, 40, SKIN_D);
  ctx.restore();
  // skirt of the sari: flared, with pleats and a gold border
  cut(() => { ctx.beginPath(); ctx.moveTo(-100, -520); ctx.lineTo(100, -520); ctx.quadraticCurveTo(150, -260, 175, -10); ctx.quadraticCurveTo(0, 14, -175, -10); ctx.quadraticCurveTo(-150, -260, -100, -520); ctx.closePath(); }, sari);
  ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = 5; for (const x of [-20, 20, 60]) { ctx.beginPath(); ctx.moveTo(x * 0.6, -500); ctx.lineTo(x * 1.6, -12); ctx.stroke(); }
  cut(() => { ctx.beginPath(); ctx.moveTo(-178, -40); ctx.quadraticCurveTo(0, -18, 178, -40); ctx.lineTo(176, -8); ctx.quadraticCurveTo(0, 16, -176, -8); ctx.closePath(); }, border, { shadow: 0.2, edge: 2 });
  for (const k of [-1, 1]) cut(() => { ctx.beginPath(); ctx.ellipse(k * 50, -4, 40, 15, 0, 0, TAU); }, SKIN_D, { shadow: 0.3, edge: 2 });
  ctx.save(); ctx.translate(0, -520); ctx.rotate(-0.12 * bow); ctx.translate(0, 520);
  // torso (blouse) + bare midriff
  cut(() => { ctx.beginPath(); ctx.moveTo(-96, -770); ctx.quadraticCurveTo(-112, -640, -82, -520); ctx.lineTo(82, -520); ctx.quadraticCurveTo(112, -640, 96, -770); ctx.quadraticCurveTo(0, -795, -96, -770); ctx.closePath(); }, SKIN);
  cut(() => { ctx.beginPath(); ctx.moveTo(-98, -770); ctx.quadraticCurveTo(-104, -680, -92, -640); ctx.lineTo(92, -640); ctx.quadraticCurveTo(104, -680, 98, -770); ctx.quadraticCurveTo(0, -792, -98, -770); ctx.closePath(); }, border === GOLD ? '#7A2E3A' : border, { shadow: 0.3, edge: 2 });
  // pallu over the left shoulder, falling behind
  cut(P_poly([[-100, -780], [-40, -790], [96, -540], [100, -480], [40, -470]]), pallu, { shadow: 0.4, edge: 3 });
  cut(P_poly([[-100, -780], [-86, -788], [104, -500], [96, -486]]), border, { shadow: 0, edge: 0 });
  // jewellery
  for (const [r, w, c] of [[60, 8, GOLD], [80, 6, GOLD]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, -805, r, 0.22 * Math.PI, 0.78 * Math.PI); ctx.stroke(); }
  cut(P_poly([[0, -712], [-12, -735], [0, -752], [12, -735]]), CRIMSON, { shadow: 0.2, edge: 2 });
  // neck + head
  cut(P_rr(-26, -840, 52, 70, 18), SKIN_D, { shadow: 0.2, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -900, 62, 76, 0, 0, TAU); }, SKIN);
  // hair parted, covering the top of the head
  cut(() => { ctx.beginPath(); ctx.moveTo(-66, -880); ctx.quadraticCurveTo(-74, -985, 0, -988); ctx.quadraticCurveTo(74, -985, 66, -880); ctx.quadraticCurveTo(56, -950, 0, -952); ctx.quadraticCurveTo(-56, -950, -66, -880); ctx.closePath(); }, o.hair || INK, { shadow: 0.2, edge: 2 });
  ctx.strokeStyle = CRIMSON; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, -985); ctx.lineTo(0, -955); ctx.stroke();
  if (o.crown) { cut(() => { ctx.beginPath(); ctx.moveTo(-60, -960); ctx.lineTo(-66, -1010); ctx.lineTo(-34, -992); ctx.lineTo(0, -1040); ctx.lineTo(34, -992); ctx.lineTo(66, -1010); ctx.lineTo(60, -960); ctx.quadraticCurveTo(0, -975, -60, -960); ctx.closePath(); }, GOLD, { shadow: 0.3, edge: 2 }); circle(0, -1000, 8, CRIMSON); }
  for (const k of [-1, 1]) { circle(k * 64, -885, 10, SKIN_D); circle(k * 66, -858, 10, GOLD); }
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 12, -936); ctx.quadraticCurveTo(k * 28, -946, k * 44, -937); ctx.stroke(); }
  eyes(-912, o.eyes ?? 0, 25, INK, 0.9);
  circle(0, -942, 7, CRIMSON);
  ctx.strokeStyle = '#8E3A34'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-14, -864); ctx.quadraticCurveTo(0, -858 + (o.sad ? -8 : 4), 14, -864); ctx.stroke();
  circle(14, -878, 4, GOLD);
  // front arm
  const front = { stand: [12, 4], boon: [150, 170], hold: [40, -70], namaste: [40, -78], bow: [40, -78], serve: [60, -40] }[pose] || [12, 4];
  const hand = limb(92, -730, front[0], 165, front[1], 145, 56, 40, SKIN);
  for (const [hx, hy] of [hand]) { ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(hx, hy - 6, 20, 0, TAU); ctx.stroke(); }
  if (pose === 'namaste' || pose === 'bow') cut(() => { ctx.beginPath(); ctx.ellipse(hand[0] - 6, hand[1] - 14, 18, 34, 0.2, 0, TAU); }, SKIN, { shadow: 0.3, edge: 2 });
  ctx.restore();
  ctx.restore();
  return hand;
}

// ═════════ ARUNA, the charioteer of the dawn (upper body; below the waist only light) ═════════
const AR = '#D9653F', AR_D = '#B44A2E', AR_L = '#F08A5A';
/** o = { s, t, aura 0..1, mood: 'calm'|'angry', eyes 0..1, reins: [x, y] (in local units) | null, age: 0 baby .. 1 youth, mist 0..1 } */
export function aruna(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0, aura = o.aura ?? 1, angry = o.mood === 'angry', age = o.age ?? 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sc = lerp(0.62, 1, age); ctx.scale(sc, sc);
  if (aura > 0) { glow(0, -330, 560, angry ? '#FF4A2A' : '#FF9A5A', 0.45 * aura); glow(0, -360, 260, '#FFE2B0', 0.3 * aura);
    ctx.save(); ctx.globalAlpha = aura; ctx.strokeStyle = rgba(angry ? '#FF6A4A' : A.gold, 0.85); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -420, 150, 0, TAU); ctx.stroke(); ctx.restore(); }
  // below the waist: no legs — a swirl of dawn light
  const m = o.mist ?? 1;
  if (m > 0) { ctx.save(); ctx.globalAlpha = m; for (let i = 0; i < 6; i++) { const yy = -10 + i * 34, r = 150 - i * 18 + Math.sin(t * 2 + i) * 10; cut(() => { ctx.beginPath(); ctx.ellipse(Math.sin(t * 1.3 + i) * 16, yy, r, 34, 0, 0, TAU); }, i % 2 ? '#FFB37A' : '#FFD39A', { shadow: 0.2, edge: 0 }); }
    glow(0, 40, 260, '#FFC27A', 0.7); ctx.restore(); }
  // back arm
  const rein = o.reins;
  limb(-86, -300, rein ? 60 : -14, 120, rein ? 100 : -6, 108, 48, 36, AR_D, GOLD);
  // torso (bare, glowing red-gold) with a gold sash and belt
  cut(() => { ctx.beginPath(); ctx.moveTo(-100, -320); ctx.quadraticCurveTo(-112, -170, -86, -30); ctx.lineTo(86, -30); ctx.quadraticCurveTo(112, -170, 100, -320); ctx.quadraticCurveTo(0, -345, -100, -320); ctx.closePath(); }, AR);
  const g = ctx.createLinearGradient(-110, 0, 110, 0); g.addColorStop(0, 'rgba(0,0,0,0.16)'); g.addColorStop(0.5, 'rgba(255,230,180,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.1)'); ctx.fillStyle = g; ctx.fill();
  cut(P_rr(-92, -60, 184, 40, 12), '#7A2E3A', { shadow: 0.3, edge: 3 }); cut(P_rr(-92, -52, 184, 9, 4), GOLD, { shadow: 0, edge: 0 });
  cut(P_poly([[-100, -320], [-60, -330], [92, -64], [52, -56]]), GOLD, { shadow: 0.3, edge: 2 });
  for (const [r, w] of [[56, 8], [76, 6]]) { ctx.strokeStyle = GOLD; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, -350, r, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
  // head
  cut(P_rr(-24, -390, 48, 60, 16), AR_D, { shadow: 0.2, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -440, 58, 68, 0, 0, TAU); }, AR_L);
  for (const k of [-1, 1]) { circle(k * 60, -430, 10, AR_D); circle(k * 62, -404, 10, GOLD); }
  ctx.strokeStyle = '#3A160E'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (const k of [-1, 1]) { ctx.beginPath(); if (angry) { ctx.moveTo(k * 10, -474); ctx.lineTo(k * 44, -486); } else { ctx.moveTo(k * 10, -478); ctx.quadraticCurveTo(k * 26, -488, k * 42, -480); } ctx.stroke(); }
  eyes(-456, o.eyes ?? 0, 23, '#3A160E', 0.85);
  ctx.strokeStyle = '#7A2A1A'; ctx.lineWidth = 5; ctx.beginPath(); if (angry) { ctx.moveTo(-14, -410); ctx.lineTo(14, -410); } else { ctx.moveTo(-13, -414); ctx.quadraticCurveTo(0, -405, 13, -414); } ctx.stroke();
  ctx.fillStyle = CRIMSON; ctx.fillRect(-3, -500, 6, 22);
  // crown with a small sun
  cut(P_rr(-64, -520, 128, 24, 8), GOLD, { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-62, -516); ctx.lineTo(-56, -560); ctx.lineTo(-28, -546); ctx.lineTo(0, -600); ctx.lineTo(28, -546); ctx.lineTo(56, -560); ctx.lineTo(62, -516); ctx.closePath(); }, GOLD, { shadow: 0.3, edge: 2 });
  glow(0, -566, 50, '#FFE2A0', 0.8); circle(0, -566, 14, '#FFF3C4');
  // front arm (holding the reins, or resting)
  const hand = limb(86, -300, rein ? 70 : 14, 120, rein ? 110 : 6, 108, 48, 36, AR, GOLD);
  if (rein) { ctx.strokeStyle = '#E8B13E'; ctx.lineWidth = 6; for (const dy of [0, 14]) { ctx.beginPath(); ctx.moveTo(hand[0], hand[1] + dy); ctx.quadraticCurveTo((hand[0] + rein[0]) / 2, Math.max(hand[1], rein[1]) + 60, rein[0], rein[1] + dy); ctx.stroke(); } }
  ctx.restore();
  return hand;
}

// ═════════ GARUDA: eagle-headed, golden body, great red-gold wings ═════════
/** wing 0..1 spread; o = { s, t, aura, kalash (carry the amrita pot) } */
export function garuda(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0, wing = o.wing ?? 1, flap = Math.sin(t * 5) * 0.12 * wing;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  glow(0, -300, 700, '#FFB040', 0.4 * (o.aura ?? 1)); glow(0, -300, 300, '#FFF0C0', 0.3 * (o.aura ?? 1));
  // wings: layered feathers, each layer a fan
  for (const k of [-1, 1]) {
    ctx.save(); ctx.translate(k * 70, -330); ctx.rotate(k * (-0.25 + flap) * wing); ctx.scale(k * lerp(0.25, 1, wing), lerp(0.4, 1, wing));
    const rows = [['#8E2A1E', 560, 22], ['#C8452A', 470, 18], ['#E98A2E', 360, 14], ['#F2C14E', 240, 10]];
    rows.forEach(([col, len, n]) => { for (let i = 0; i < n; i++) { const a = -0.9 + (i / (n - 1)) * 1.5, l = len * (0.75 + 0.25 * Math.sin((i / (n - 1)) * Math.PI)); cut(() => { ctx.beginPath(); ctx.save(); ctx.rotate(a); ctx.moveTo(0, -12); ctx.quadraticCurveTo(l * 0.6, -34, l, 0); ctx.quadraticCurveTo(l * 0.6, 34, 0, 12); ctx.restore(); ctx.closePath(); }, col, { shadow: 0.35, edge: 2 }); } });
    ctx.restore();
  }
  // tail feathers
  for (let i = -3; i <= 3; i++) cut(() => { ctx.beginPath(); ctx.save(); ctx.rotate(i * 0.16); ctx.moveTo(-18, -60); ctx.quadraticCurveTo(-30, 80, 0, 180); ctx.quadraticCurveTo(30, 80, 18, -60); ctx.restore(); ctx.closePath(); }, i % 2 ? '#C8452A' : '#E98A2E', { shadow: 0.3, edge: 2 });
  // body: golden human torso with a dhoti
  cut(() => { ctx.beginPath(); ctx.moveTo(-90, -40); ctx.lineTo(90, -40); ctx.lineTo(70, 60); ctx.lineTo(-70, 60); ctx.closePath(); }, '#7A2E3A', { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-100, -380); ctx.quadraticCurveTo(-115, -200, -88, -40); ctx.lineTo(88, -40); ctx.quadraticCurveTo(115, -200, 100, -380); ctx.quadraticCurveTo(0, -405, -100, -380); ctx.closePath(); }, '#E0A93A');
  for (let i = 0; i < 4; i++) { ctx.strokeStyle = 'rgba(150,90,20,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -330 + i * 60, 60, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  for (const [r, w] of [[60, 9], [82, 6]]) { ctx.strokeStyle = '#FFE7A0'; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, -410, r, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
  // arms folded forward, holding the kalash
  for (const k of [-1, 1]) limb(k * 92, -360, k * 30, 120, -k * 70, 100, 46, 36, '#D89A2E', '#FFE7A0');
  if (o.kalash) { glow(0, -250, 160, '#FFF6D0', 0.8); cut(() => { ctx.beginPath(); ctx.ellipse(0, -230, 52, 48, 0, 0, TAU); }, '#E8B13E', { shadow: 0.5, edge: 3 }); cut(P_rr(-26, -296, 52, 30, 8), '#B07A22', { shadow: 0.3, edge: 2 }); for (let i = 0; i < 5; i++) cut(() => { ctx.beginPath(); ctx.ellipse(-28 + i * 14, -306, 8, 22, (i - 2) * 0.3, 0, TAU); }, '#6E9A4A', { shadow: 0.2, edge: 1 }); }
  // eagle head: white-gold feathers, hooked beak, crown
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -490, 70, 84, 0, 0, TAU); }, '#F4EEE2');
  cut(() => { ctx.beginPath(); ctx.moveTo(-70, -470); ctx.quadraticCurveTo(-60, -400, 0, -400); ctx.quadraticCurveTo(60, -400, 70, -470); ctx.quadraticCurveTo(0, -440, -70, -470); ctx.closePath(); }, '#E0A93A', { shadow: 0.2, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-20, -488); ctx.quadraticCurveTo(20, -500, 34, -470); ctx.quadraticCurveTo(40, -440, 20, -420); ctx.quadraticCurveTo(22, -446, 0, -456); ctx.closePath(); }, '#F2C14E', { shadow: 0.3, edge: 2 });
  for (const k of [-1, 1]) { ctx.fillStyle = '#2A1C14'; ctx.beginPath(); ctx.ellipse(k * 32, -506, 10, 8, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#2A1C14'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(k * 16, -524); ctx.lineTo(k * 50, -520); ctx.stroke(); }
  cut(P_rr(-70, -585, 140, 26, 8), GOLD, { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-68, -580); ctx.lineTo(-60, -630); ctx.lineTo(-30, -612); ctx.lineTo(0, -670); ctx.lineTo(30, -612); ctx.lineTo(60, -630); ctx.lineTo(68, -580); ctx.closePath(); }, GOLD, { shadow: 0.3, edge: 2 }); circle(0, -625, 10, CRIMSON);
  ctx.restore();
}

// ═════════ NAGA: a cobra rising, hood spread ═════════
/** rise 0..1; col body colour; dir 1/-1 */
export function naga(x, y, s, t = 0, rise = 1, col = '#3E6E5A', dir = 1) {
  if (rise <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s * rise);
  const sw = Math.sin(t * 2.2 + x) * 10;
  // coil on the ground
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -14, 70, 22, 0, 0, TAU); }, col, { shadow: 0.4, edge: 3 });
  // body S-curve
  const pts = [[30, -20], [50 + sw * 0.3, -70], [10 + sw, -120], [-10 + sw, -170], [0 + sw, -220]];
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; smoothPts(pts); ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 42; ctx.stroke(); smoothPts(pts); ctx.strokeStyle = col; ctx.lineWidth = 34; ctx.stroke(); smoothPts(pts); ctx.strokeStyle = 'rgba(255,240,200,0.35)'; ctx.lineWidth = 12; ctx.stroke(); ctx.restore();
  // hood
  ctx.save(); ctx.translate(sw, -240);
  cut(() => { ctx.beginPath(); ctx.moveTo(0, 40); ctx.quadraticCurveTo(-70, 10, -54, -40); ctx.quadraticCurveTo(-30, -84, 0, -86); ctx.quadraticCurveTo(30, -84, 54, -40); ctx.quadraticCurveTo(70, 10, 0, 40); ctx.closePath(); }, col, { shadow: 0.5, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -14, 26, 34, 0, 0, TAU); }, '#D8C890', { shadow: 0, edge: 0 });
  ctx.strokeStyle = 'rgba(40,30,20,0.6)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-12, -30, 9, 0, TAU); ctx.moveTo(21, -30); ctx.arc(12, -30, 9, 0, TAU); ctx.stroke();
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -80, 22, 18, 0, 0, TAU); }, col, { shadow: 0.2, edge: 2 });
  for (const k of [-1, 1]) circle(k * 10, -84, 4, '#F2C14E');
  ctx.restore(); ctx.restore();
}

// ═════════ EGG + the warm clay vessel ═════════
/** o = { crack 0..1, open 0..1 (top shell lifts away), glow 0..1, col, spots } */
export function egg(x, y, r, t = 0, o = {}) {
  const crack = o.crack || 0, open = o.open || 0, col = o.col || '#F3E9D2';
  ctx.save(); ctx.translate(x, y);
  if (o.glow) glow(0, 0, r * 3, o.glowCol || '#FFE0A0', 0.55 * o.glow);
  const shape = (y0, y1) => () => { ctx.beginPath(); ctx.save(); ctx.beginPath(); ctx.restore(); ctx.ellipse(0, 0, r * 0.78, r, 0, 0, TAU); };
  if (open <= 0) {
    cut(shape(), col, { shadow: 0.6, edge: 3 });
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, r * 0.78, r, 0, 0, TAU); ctx.clip(); const g = ctx.createRadialGradient(-r * 0.3, -r * 0.4, 0, 0, 0, r * 1.2); g.addColorStop(0, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(0,0,0,0.18)'); ctx.fillStyle = g; ctx.fillRect(-r, -r, r * 2, r * 2);
    if (o.spots) for (let i = 0; i < 9; i++) circle((rnd(i + 3) - 0.5) * r * 1.2, (rnd(i * 5) - 0.5) * r * 1.6, r * 0.06 + rnd(i) * r * 0.05, o.spots);
    ctx.restore();
    if (crack > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#FFE7A0', 0.95); ctx.lineWidth = Math.max(3, r * 0.05); ctx.shadowColor = '#FFD070'; ctx.shadowBlur = 20; ctx.beginPath(); const n = 7; for (let i = 0; i <= n * crack; i++) { const xx = -r * 0.7 + (i / n) * r * 1.4, yy = -r * 0.05 + (i % 2 ? -1 : 1) * r * 0.12; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
  } else {
    // bottom half stays, top half lifts and tilts away
    const zig = (k) => { for (let i = 0; i <= 7; i++) { const xx = (k > 0 ? -1 : 1) * (-r * 0.78 + (i / 7) * r * 1.56), yy = (i % 2 ? -1 : 1) * r * 0.12; ctx.lineTo(xx, yy); } };
    cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, r * 0.78, r, 0, 0, Math.PI); zig(1); ctx.closePath(); }, col, { shadow: 0.6, edge: 3 });
    ctx.save(); ctx.translate(r * 0.9 * open, -r * 1.3 * open); ctx.rotate(0.9 * open); ctx.globalAlpha = clamp(1.4 - open);
    cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, r * 0.78, r, 0, Math.PI, TAU); zig(-1); ctx.closePath(); }, col, { shadow: 0.6, edge: 3 });
    ctx.restore();
  }
  ctx.restore();
}
/** a wide clay vessel (the warm pots the eggs were kept in) */
export function vessel(x, y, s, col = '#9C5A32') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(() => { ctx.beginPath(); ctx.moveTo(-200, -120); ctx.quadraticCurveTo(-240, 40, -120, 90); ctx.lineTo(120, 90); ctx.quadraticCurveTo(240, 40, 200, -120); ctx.closePath(); }, col, { shadow: 0.7, edge: 4 });
  cut(P_rr(-215, -140, 430, 34, 14), '#B87442', { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = 'rgba(242,193,78,0.7)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-205, -60); ctx.quadraticCurveTo(0, -30, 205, -60); ctx.stroke();
  for (let i = 0; i < 7; i++) circle(-150 + i * 50, -20, 7, '#F2C14E');
  ctx.restore();
}

// ═════════ the Sun's chariot: one great wheel, seven horses, the sun behind ═════════
/** o = { sunR, horses 0..1 (how many appear), driver (draw Aruna), run (gallop) } */
export function suryaRath(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const R = o.sunR ?? 330;
  glow(-120, -420, R * 2.6, '#FF9A3A', 0.5); glow(-120, -420, R * 1.3, '#FFE6A0', 0.55);
  cut(P_circ(-120, -420, R), '#F6C04A', { shadow: 0, edge: 0 });
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 24; i++) { const a = i / 24 * TAU + t * 0.1; ctx.strokeStyle = rgba('#FFE6A0', 0.35); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(-120 + Math.cos(a) * R * 1.05, -420 + Math.sin(a) * R * 1.05); ctx.lineTo(-120 + Math.cos(a) * R * 1.3, -420 + Math.sin(a) * R * 1.3); ctx.stroke(); } ctx.restore();
  // horses (7), staggered in depth, galloping to the right
  const n = Math.round(7 * (o.horses ?? 1));
  for (let i = n - 1; i >= 0; i--) { const hx = 260 + (i % 2) * 40 - Math.floor(i / 2) * 6 + i * 22, hy = -40 - i * 26; ctx.save(); ctx.globalAlpha = 1 - i * 0.06; horse(hx, hy, 0.62 - i * 0.015, t * 11 + i * 0.7, 1); ctx.restore(); if (i === 0) glow(hx + 120, hy - 200, 200, '#FFE6A0', 0.25); }
  // chariot body + wheel
  cut(() => { ctx.beginPath(); ctx.moveTo(-260, -300); ctx.lineTo(60, -300); ctx.quadraticCurveTo(110, -240, 90, -130); ctx.lineTo(-250, -130); ctx.quadraticCurveTo(-290, -220, -260, -300); ctx.closePath(); }, '#B07A22', { shadow: 0.8, edge: 4 });
  cut(P_rr(-270, -320, 350, 28, 12), '#F2C14E', { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = '#7A4A1A'; ctx.lineWidth = 5; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-230 + i * 70, -290); ctx.lineTo(-230 + i * 70, -140); ctx.stroke(); }
  // pole to the horses
  ctx.strokeStyle = '#7A4A1A'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(80, -170); ctx.lineTo(330, -170); ctx.stroke();
  ctx.save(); ctx.translate(-100, -110); ctx.rotate(t * 3); const wr = 130;
  cut(P_circ(0, 0, wr), '#8A5A1E', { shadow: 0.6, edge: 4 }); cut(P_circ(0, 0, wr - 22), '#3A2A1A', { shadow: 0, edge: 0 });
  ctx.strokeStyle = '#E8B13E'; ctx.lineWidth = 10; for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 20, Math.sin(a) * 20); ctx.lineTo(Math.cos(a) * (wr - 22), Math.sin(a) * (wr - 22)); ctx.stroke(); }
  cut(P_circ(0, 0, 30), '#F2C14E', { shadow: 0.3, edge: 3 }); ctx.restore();
  // Aruna at the front, holding the reins
  if (o.driver !== 0) aruna(30, -270, { s: 0.62, t, aura: o.driverAura ?? 0.8, eyes: 0, reins: [620, 20], mist: 1 });
  ctx.restore();
}

// ═════════ VISHNU (seated, four arms), SHIVLING, LOTUS, SUDARSHAN (added 2026-11-21, hari-netra) ═════════
const VB = '#3E6FB4', VB_D = '#2C5590', VB_L = '#5E8FD0', PITA = '#F2C14E', PITA_D = '#D69A2A';
/** a pink lotus at (x, y) (base of the bloom). s scale, open 0..1, col petal colour */
export function lotus(x, y, s = 1, open = 1, col = '#E8899A', tip = '#FBD3DA', a = 1) {
  if (s <= 0 || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  const petal = (ang, len, wid, c) => { ctx.save(); ctx.rotate(ang); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-wid, -len * 0.55, 0, -len); ctx.quadraticCurveTo(wid, -len * 0.55, 0, 0); ctx.closePath(); }, c, { shadow: 0.3, edge: 2 }); ctx.restore(); };
  const sp = 0.25 + 0.75 * open;
  for (const k of [-3, 3, -2, 2]) petal(k * 0.32 * sp, 64, 26, col);
  for (const k of [-1, 1]) petal(k * 0.28 * sp, 74, 26, col);
  petal(0, 80, 28, tip);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 40, 10, 0, 0, TAU); }, '#4F7A3A', { shadow: 0.2, edge: 2 });
  ctx.restore();
}
/** Shivling on its pitha. o = { s, flowers (0..1 heap of lotuses on top), glowA } */
export function shivling(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.glowA) { glow(0, -260, 420, A.paleGold, 0.4 * o.glowA); }
  cut(P_rr(-200, -70, 400, 70, 16), '#4A4E66', { shadow: 0.8, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -90, 230, 56, 0, 0, TAU); }, '#5A5F7A', { shadow: 0.6, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.moveTo(200, -110); ctx.lineTo(330, -100); ctx.quadraticCurveTo(350, -84, 330, -70); ctx.lineTo(200, -66); ctx.closePath(); }, '#5A5F7A', { shadow: 0.5, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-110, -100); ctx.lineTo(-110, -300); ctx.quadraticCurveTo(-110, -420, 0, -420); ctx.quadraticCurveTo(110, -420, 110, -300); ctx.lineTo(110, -100); ctx.closePath(); }, '#363A52', { shadow: 0.7, edge: 4 });
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(-60, -110); ctx.lineTo(-60, -330); ctx.stroke();
  ctx.strokeStyle = '#EDE6DA'; ctx.lineWidth = 9; ctx.lineCap = 'round'; for (const dy of [-330, -305, -280]) { ctx.beginPath(); ctx.moveTo(-70, dy); ctx.quadraticCurveTo(0, dy + 12, 70, dy); ctx.stroke(); }
  circle(0, -305, 11, CRIMSON);
  ctx.strokeStyle = GOLD; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, -90, 230, 56, 0, 0, TAU); ctx.stroke();
  const fl = o.flowers || 0; if (fl > 0) { const n = Math.floor(14 * fl); for (let i = 0; i < n; i++) { const ax = (rnd(i * 3 + 1) - 0.5) * 300, ay = -110 - rnd(i * 5 + 2) * 30 - (i > 7 ? 26 : 0); lotus(ax, ay, 0.55, 1, i % 3 ? '#E8899A' : '#F2A7B4'); } }
  ctx.restore();
}
/** the Sudarshana chakra: spinning gold discus with flames. r radius */
export function sudarshan(x, y, r, t, a = 1) {
  if (a <= 0 || r <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  glow(0, 0, r * 2.6, '#FFB45A', 0.55); glow(0, 0, r * 1.2, '#FFF2C0', 0.5);
  ctx.save(); ctx.rotate(t * 4);
  cut(() => { ctx.beginPath(); for (let i = 0; i <= 48; i++) { const an = i / 48 * TAU, rr = i % 2 ? r * 1.12 : r; ctx.lineTo(Math.cos(an) * rr, Math.sin(an) * rr); } ctx.closePath(); }, '#F2C14E', { shadow: 0.5, edge: 3 });
  cut(P_circ(0, 0, r * 0.82), '#E0782E', { shadow: 0, edge: 2 }); cut(P_circ(0, 0, r * 0.7), '#F6D98A', { shadow: 0, edge: 0 });
  ctx.strokeStyle = '#B07A22'; ctx.lineWidth = Math.max(3, r * 0.06); for (let i = 0; i < 12; i++) { const an = i / 12 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(an) * r * 0.18, Math.sin(an) * r * 0.18); ctx.lineTo(Math.cos(an) * r * 0.68, Math.sin(an) * r * 0.68); ctx.stroke(); }
  cut(P_circ(0, 0, r * 0.2), '#B07A22', { shadow: 0, edge: 2 }); circle(0, 0, r * 0.09, '#FFF2C0');
  ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const an = i / 16 * TAU - t * 6; const fx = Math.cos(an) * r * 1.15, fy = Math.sin(an) * r * 1.15; glow(fx, fy, r * 0.25, '#FF8A3D', 0.35 + 0.15 * Math.sin(t * 9 + i)); } ctx.restore();
  ctx.restore();
}
/** Vishnu seated in padmasana, base (bottom of crossed legs) at (x, y). o = { s, t, aura, pose: 'dhyana'|'namaste'|'offer'|'raise'|'bless', chakra 0..1 (on the upper right finger), shankha, eyeGlow 0..1 } */
export function vishnu(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0, pose = o.pose || 'dhyana', aura = o.aura ?? 0.8;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (aura > 0) { glow(0, -620, 560, '#9FC4FF', 0.28 * aura); glow(0, -680, 260, '#FFF2C0', 0.25 * aura);
    ctx.save(); ctx.globalAlpha *= aura; ctx.strokeStyle = rgba(A.gold, 0.85); ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -690, 190, 0, TAU); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, -690, 212, 0, TAU); ctx.stroke();
      for (let i = 0; i < 20; i++) { const an = i / 20 * TAU + t * 0.12; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 220, -690 + Math.sin(an) * 220); ctx.lineTo(Math.cos(an) * 242, -690 + Math.sin(an) * 242); ctx.stroke(); } ctx.restore(); }
  // upper (back) arms: raised, holding conch (left) and chakra (right)
  const ul = limb(-112, -520, -140, 130, -176, 120, 54, 42, VB_D, GOLD), ur = limb(112, -520, 140, 130, 176, 120, 54, 42, VB_D, GOLD);
  if (o.shankha ?? 1) { ctx.save(); ctx.translate(ul[0], ul[1] - 30); ctx.rotate(-0.4); cut(() => { ctx.beginPath(); ctx.moveTo(-22, 40); ctx.quadraticCurveTo(-46, -10, -8, -58); ctx.quadraticCurveTo(30, -40, 26, 10); ctx.quadraticCurveTo(20, 40, -22, 40); ctx.closePath(); }, '#F7F3EA', { shadow: 0.4, edge: 3 }); ctx.strokeStyle = '#C9B8A0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(-4, -6, 16, 0, 5); ctx.stroke(); ctx.restore(); }
  cut(P_circ(ul[0], ul[1], 26), VB_D, { shadow: 0.2, edge: 2 }); cut(P_circ(ur[0], ur[1], 26), VB_D, { shadow: 0.2, edge: 2 });
  // crossed legs under the pitambar
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -70, 290, 86, 0, 0, TAU); }, PITA);
  cut(() => { ctx.beginPath(); ctx.ellipse(-120, -78, 120, 40, 0.12, 0, TAU); }, PITA_D, { shadow: 0.3, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(130, -72, 110, 38, -0.12, 0, TAU); }, PITA_D, { shadow: 0.3, edge: 3 });
  for (const k of [-1, 1]) cut(() => { ctx.beginPath(); ctx.ellipse(k * 70, -110, 48, 20, k * 0.3, 0, TAU); }, VB, { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = CRIMSON; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, -70, 288, 84, 0, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
  // torso
  const torso = () => { ctx.beginPath(); ctx.moveTo(-130, -560); ctx.quadraticCurveTo(-150, -380, -110, -170); ctx.lineTo(110, -170); ctx.quadraticCurveTo(150, -380, 130, -560); ctx.quadraticCurveTo(0, -590, -130, -560); ctx.closePath(); };
  cut(torso, VB); ctx.save(); torso(); ctx.clip(); const g = ctx.createLinearGradient(-150, 0, 150, 0); g.addColorStop(0, rgba(VB_D, 0.9)); g.addColorStop(0.45, rgba(VB_L, 0.55)); g.addColorStop(1, rgba(VB_D, 0.7)); ctx.fillStyle = g; ctx.fillRect(-200, -620, 400, 480); ctx.restore();
  cut(P_rr(-118, -210, 236, 40, 12), PITA_D, { shadow: 0.3, edge: 3 }); cut(P_rr(-118, -200, 236, 10, 4), CRIMSON, { shadow: 0, edge: 0 });
  // sacred thread + vanamala + kaustubha
  ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-110, -555); ctx.quadraticCurveTo(10, -380, 100, -200); ctx.stroke();
  for (let i = 0; i <= 18; i++) { const k = i / 18, an = Math.PI * (0.08 + 0.84 * k), px = Math.cos(an) * 120, py = -560 + Math.sin(an) * 300; circle(px, py, 13, i % 2 ? '#E8899A' : '#F2C14E'); circle(px, py + 2, 6, i % 2 ? '#F6C0CA' : '#4F7A3A'); }
  for (const [r, w, c] of [[60, 9, GOLD], [84, 6, GOLD]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, -590, r, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
  cut(P_poly([[0, -470], [-18, -500], [0, -526], [18, -500]]), '#C8323D', { shadow: 0.2, edge: 2 }); glow(0, -498, 40, '#FF7A8A', 0.5);
  // front arms by pose
  const FA = { dhyana: [[-30, 50], [30, -50]], namaste: [[-12, 100], [12, -100]], offer: [[-12, 100], [12, -100]], raise: [[-30, 50], [40, -170]], bless: [[-30, 50], [40, 172]] }[pose] || [[-30, 50], [30, -50]];
  const hl = limb(-120, -540, FA[0][0], 160, FA[0][1], 140, 60, 44, VB, GOLD);
  const hr = limb(120, -540, FA[1][0], 160, FA[1][1], pose === 'raise' ? 150 : 140, 60, 44, VB, GOLD);
  if (pose === 'namaste' || pose === 'offer') { const mx = (hl[0] + hr[0]) / 2, my = (hl[1] + hr[1]) / 2; cut(() => { ctx.beginPath(); ctx.moveTo(mx - 26, my + 16); ctx.quadraticCurveTo(mx - 24, my - 70, mx, my - 96); ctx.quadraticCurveTo(mx + 24, my - 70, mx + 26, my + 16); ctx.closePath(); }, VB, { shadow: 0.3, edge: 3 }); if (pose === 'offer') lotus(mx, my - 40, 0.9, 1); }
  else { cut(P_circ(hl[0], hl[1], 26), VB, { shadow: 0.2, edge: 2 }); cut(P_circ(hr[0], hr[1], 26), VB, { shadow: 0.2, edge: 2 }); }
  if (pose === 'bless') { ctx.save(); ctx.translate(hr[0], hr[1]); cut(() => { ctx.beginPath(); ctx.roundRect(-26, -70, 52, 78, 22); }, VB, { shadow: 0.3, edge: 3 }); for (let i = 0; i < 4; i++) cut(P_rr(-24 + i * 13, -108 + Math.abs(i - 1.5) * 6, 11, 44, 5), VB, { shadow: 0.2, edge: 2 }); ctx.restore(); }
  // neck + head
  cut(P_rr(-30, -640, 60, 70, 20), VB_D, { shadow: 0.2, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -700, 72, 86, 0, 0, TAU); }, VB);
  for (const k of [-1, 1]) { cut(() => { ctx.beginPath(); ctx.ellipse(k * 78, -680, 14, 30, 0, 0, TAU); }, GOLD, { shadow: 0.2, edge: 2 }); }
  ctx.strokeStyle = '#1C2A44'; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 12, -740); ctx.quadraticCurveTo(k * 30, -752, k * 50, -742); ctx.stroke(); }
  eyes(-716, 0, 30, '#1C2A44', 1.15);
  if (o.eyeGlow > 0) { glow(30, -716, 120, '#FFF2C0', 0.7 * o.eyeGlow); glow(30, -716, 50, '#FFFFFF', 0.6 * o.eyeGlow); }
  ctx.strokeStyle = '#1C2A44'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-18, -660); ctx.quadraticCurveTo(0, -650, 18, -660); ctx.stroke();
  // tilak (urdhva pundra)
  ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-10, -752); ctx.lineTo(-14, -790); ctx.moveTo(10, -752); ctx.lineTo(14, -790); ctx.stroke(); ctx.fillStyle = CRIMSON; ctx.fillRect(-3, -790, 6, 36);
  // kirita mukut (tall crown)
  cut(() => { ctx.beginPath(); ctx.moveTo(-80, -770); ctx.lineTo(-62, -940); ctx.quadraticCurveTo(0, -990, 62, -940); ctx.lineTo(80, -770); ctx.quadraticCurveTo(0, -790, -80, -770); ctx.closePath(); }, GOLD, { shadow: 0.5, edge: 3 });
  cut(P_poly([[-62, -940], [0, -1030], [62, -940]]), GOLD, { shadow: 0.4, edge: 3 }); circle(0, -1036, 12, '#F7EFDC');
  cut(P_rr(-84, -800, 168, 24, 8), GOLD_D, { shadow: 0.2, edge: 2 }); for (let i = -3; i <= 3; i++) circle(i * 23, -788, 5, i % 2 ? '#F7EFDC' : CRIMSON);
  cut(P_poly([[0, -870], [-20, -900], [0, -930], [20, -900]]), CRIMSON, { shadow: 0.2, edge: 2 }); for (const k of [-1, 1]) cut(P_poly([[k * 40, -860], [k * 30, -880], [k * 40, -900], [k * 50, -880]]), '#3E7A5A', { shadow: 0.2, edge: 2 });
  // chakra on the upper right finger
  if (o.chakra > 0) sudarshan(ur[0], ur[1] - 90, 70 * eob(clamp(o.chakra)), t, clamp(o.chakra * 2));
  ctx.restore();
  return { hl, hr, ul, ur };
}

// ═════════ RISHI (standing sage: Pulastya) ═════════
/** o = { s, t, pose: 'stand'|'walk'|'carry'|'strain'|'pull'|'curse'|'namaste', dir, mood: 'calm'|'angry', aura } -> returns the raised hand [x, y] in world coords */
export function rishi(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0, pose = o.pose || 'stand', dir = o.dir || 1, wk = pose === 'walk' ? Math.sin(t * 6) : 0;
  const ROBE = '#D9822F', ROBE_D = '#B8641F', BEARD = '#EFEBE2';
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  if (o.aura) glow(0, -600, 520, A.paleGold, 0.3 * o.aura);
  // back arm
  const BA = { stand: [-14, -6], walk: [-14 - wk * 12, -10], carry: [-20, -10], strain: [-40, 30], pull: [40, 70], curse: [-20, -10], namaste: [-30, 70] }[pose] || [-14, -6];
  limb(-86, -700, BA[0], 160, BA[1], 140, 50, 38, SKIN_D);
  // legs
  for (const k of [-1, 1]) { const a = pose === 'walk' ? k * wk * 14 : (pose === 'strain' || pose === 'pull') ? k * 10 : 0; limb(k * 40, -330, a, 170, a, 150, 52, 40, SKIN_D); }
  // robe (dhoti + uttariya)
  cut(() => { ctx.beginPath(); ctx.moveTo(-96, -520); ctx.lineTo(96, -520); ctx.quadraticCurveTo(130, -360, 120, -150); ctx.lineTo(-120, -150); ctx.quadraticCurveTo(-130, -360, -96, -520); ctx.closePath(); }, ROBE);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'; ctx.lineWidth = 5; for (const xx of [-40, 10, 50]) { ctx.beginPath(); ctx.moveTo(xx * 0.7, -500); ctx.lineTo(xx * 1.2, -160); ctx.stroke(); }
  // torso
  cut(() => { ctx.beginPath(); ctx.moveTo(-100, -760); ctx.quadraticCurveTo(-116, -640, -92, -510); ctx.lineTo(92, -510); ctx.quadraticCurveTo(116, -640, 100, -760); ctx.quadraticCurveTo(0, -785, -100, -760); ctx.closePath(); }, SKIN);
  cut(P_poly([[-100, -770], [-50, -778], [96, -530], [56, -512]]), ROBE_D, { shadow: 0.3, edge: 3 });
  // rudraksha mala
  for (let i = 0; i <= 14; i++) { const an = Math.PI * (0.1 + 0.8 * i / 14); circle(Math.cos(an) * 70, -790 + Math.sin(an) * 150, 9, '#6A3A22'); }
  // head
  cut(P_rr(-24, -840, 48, 60, 16), SKIN_D, { shadow: 0.2, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -900, 62, 74, 0, 0, TAU); }, SKIN);
  // jata bun
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -1000, 50, 44, 0, 0, TAU); }, '#D8D0C0', { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-64, -900); ctx.quadraticCurveTo(-70, -975, 0, -975); ctx.quadraticCurveTo(70, -975, 64, -900); ctx.quadraticCurveTo(50, -950, 0, -950); ctx.quadraticCurveTo(-50, -950, -64, -900); ctx.closePath(); }, '#D8D0C0', { shadow: 0.2, edge: 2 });
  // tripundra
  ctx.strokeStyle = '#F7F3EA'; ctx.lineWidth = 4; for (const yy of [-930, -922, -914]) { ctx.beginPath(); ctx.moveTo(-30, yy); ctx.lineTo(30, yy); ctx.stroke(); } circle(0, -922, 4, CRIMSON);
  // brows + eyes
  const ang = o.mood === 'angry';
  ctx.strokeStyle = '#E8E2D6'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 10, ang ? -894 : -900); ctx.lineTo(k * 44, ang ? -910 : -904); ctx.stroke(); }
  eyes(-886, o.eyes ?? (ang ? 1 : 0), 24, INK, 0.9);
  // beard
  cut(() => { ctx.beginPath(); ctx.moveTo(-58, -880); ctx.quadraticCurveTo(-66, -800, -26, -720); ctx.quadraticCurveTo(0, -680, 26, -720); ctx.quadraticCurveTo(66, -800, 58, -880); ctx.quadraticCurveTo(30, -846, 0, -848); ctx.quadraticCurveTo(-30, -846, -58, -880); ctx.closePath(); }, BEARD, { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-28, -862); ctx.quadraticCurveTo(0, -876, 28, -862); ctx.quadraticCurveTo(0, -866, -28, -862); }, BEARD, { shadow: 0, edge: 2 });
  if (ang) { ctx.strokeStyle = '#5A2A1A'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, -840); ctx.lineTo(14, -840); ctx.stroke(); }
  // front arm
  const FA = { stand: [14, 6], walk: [14 + wk * 12, 10], carry: [150, 176], strain: [120, 150], pull: [-40, -70], curse: [120, 150], namaste: [30, -78] }[pose] || [14, 6];
  const h = limb(86, -700, FA[0], 160, FA[1], 140, 50, 38, SKIN);
  if (pose === 'carry' || pose === 'strain') cut(() => { ctx.beginPath(); ctx.ellipse(h[0], h[1] - 8, 40, 14, 0, 0, TAU); }, SKIN, { shadow: 0.3, edge: 2 });
  else if (pose === 'curse') { ctx.save(); ctx.translate(h[0], h[1]); cut(P_rr(-20, -60, 40, 64, 16), SKIN, { shadow: 0.3, edge: 2 }); cut(P_rr(-6, -110, 14, 56, 6), SKIN, { shadow: 0.2, edge: 2 }); ctx.restore(); }
  else cut(P_circ(h[0], h[1], 22), SKIN, { shadow: 0.2, edge: 2 });
  ctx.restore();
  return [x + dir * h[0] * s, y + h[1] * s];
}

// ═════════ GIRI (a living mountain: Govardhan / Drona) ═════════
/** a rounded cut-paper mountain whose base centre is (x, y); o = { s, t, col: [base, mid, top], glowA, trees, falls, seed, shake } */
export function giri(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0, seed = o.seed || 3, [c0, c1, c2] = o.col || ['#3E5A2E', '#557A3A', '#7FA052'];
  ctx.save(); ctx.translate(x + (o.shake ? Math.sin(t * 60) * o.shake * 8 : 0), y); ctx.scale(s, s);
  if (o.glowA) { glow(0, -260, 560, '#FFE2A0', 0.4 * o.glowA); }
  const body = (w, h, sd) => () => { ctx.beginPath(); ctx.moveTo(-w, 0); for (let i = 0; i <= 40; i++) { const k = i / 40, xx = -w + 2 * w * k; const yy = -h * Math.pow(Math.sin(Math.PI * k), 0.8) * (1 + 0.12 * Math.sin(k * 17 + sd) + 0.06 * Math.sin(k * 41 + sd * 2)); ctx.lineTo(xx, yy); } ctx.closePath(); };
  cut(body(420, 420, seed), c0, { shadow: 0.9, edge: 4 });
  cut(body(320, 360, seed + 2), c1, { shadow: 0.5, edge: 3 });
  cut(body(190, 300, seed + 5), c2, { shadow: 0.4, edge: 3 });
  // rocks (shilas)
  for (let i = 0; i < 9; i++) { const rx = -330 + rnd(seed * 7 + i) * 660, ry = -20 - rnd(seed * 3 + i) * 120; cut(() => { ctx.beginPath(); ctx.ellipse(rx, ry, 22 + rnd(i) * 18, 11 + rnd(i + 3) * 7, 0, 0, TAU); }, '#8A7A62', { shadow: 0.3, edge: 2 }); }
  // little trees
  if (o.trees ?? 1) for (let i = 0; i < 14; i++) { const k = rnd(seed * 11 + i), xx = -300 + k * 600, hh = 340 * Math.pow(Math.sin(Math.PI * (xx + 420) / 840), 0.8) * (0.25 + rnd(i * 5) * 0.55); const th = 34 + rnd(i * 2) * 22; cut(P_poly([[xx - th * 0.45, -hh], [xx, -hh - th * 1.5], [xx + th * 0.45, -hh]]), i % 2 ? '#2E4A24' : '#3A5E2C', { shadow: 0.35, edge: 2 }); }
  // waterfalls
  if (o.falls) { ctx.save(); ctx.globalAlpha = o.falls; for (const [fx, top] of [[-90, -300], [110, -270]]) { const g = ctx.createLinearGradient(0, top, 0, 0); g.addColorStop(0, 'rgba(220,235,255,0.9)'); g.addColorStop(1, 'rgba(220,235,255,0.2)'); ctx.fillStyle = g; ctx.fillRect(fx - 8, top, 16, -top); for (let i = 0; i < 4; i++) circle(fx, top + ((t * 300 + i * 80) % -top), 6, 'rgba(255,255,255,0.8)'); } ctx.restore(); }
  // peacock-blue sacred glow line at the peak (Giriraj)
  if (o.crown) { glow(0, -400, 120, '#FFE9B0', 0.6 * o.crown); }
  ctx.restore();
}

// ═════════ KRISHNA (standing; flute or lifting Govardhan on the little finger) ═════════
const KB = '#3A5FA8', KB_D = '#2A4A88';
/** o = { s, t, pose: 'flute'|'lift', aura } -> returns fingertip [x, y] in world coords for 'lift' */
export function krishna(x, y, o = {}) {
  const s = o.s || 1, t = o.t || 0, pose = o.pose || 'flute';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (o.aura) glow(0, -600, 600, '#9FC4FF', 0.3 * o.aura);
  // legs (one crossed, tribhanga hint)
  limb(-36, -330, 6, 170, 4, 150, 52, 40, KB_D); limb(36, -330, -14, 170, -8, 150, 52, 40, KB_D);
  // pitambar dhoti
  cut(() => { ctx.beginPath(); ctx.moveTo(-96, -520); ctx.lineTo(96, -520); ctx.quadraticCurveTo(130, -380, 110, -170); ctx.lineTo(-110, -170); ctx.quadraticCurveTo(-130, -380, -96, -520); ctx.closePath(); }, PITA);
  ctx.strokeStyle = CRIMSON; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-110, -180); ctx.lineTo(110, -180); ctx.stroke();
  // back arm (left): lift = straight up, flute = across to the mouth
  const back = pose === 'lift' ? limb(-86, -720, -172, 170, -178, 150, 50, 38, KB) : limb(-86, -720, 40, 150, 150, 120, 50, 38, KB_D);
  // torso
  cut(() => { ctx.beginPath(); ctx.moveTo(-100, -770); ctx.quadraticCurveTo(-116, -640, -92, -510); ctx.lineTo(92, -510); ctx.quadraticCurveTo(116, -640, 100, -770); ctx.quadraticCurveTo(0, -795, -100, -770); ctx.closePath(); }, KB);
  for (let i = 0; i <= 16; i++) { const an = Math.PI * (0.1 + 0.8 * i / 16); circle(Math.cos(an) * 90, -790 + Math.sin(an) * 230, 11, i % 2 ? '#E8899A' : '#F2C14E'); }
  for (const r of [56, 76]) { ctx.strokeStyle = GOLD; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -805, r, 0.22 * Math.PI, 0.78 * Math.PI); ctx.stroke(); }
  // head
  cut(P_rr(-24, -840, 48, 60, 16), KB_D, { shadow: 0.2, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -900, 62, 74, 0, 0, TAU); }, KB);
  cut(() => { ctx.beginPath(); ctx.moveTo(-66, -880); ctx.quadraticCurveTo(-90, -960, -30, -985); ctx.quadraticCurveTo(0, -995, 30, -985); ctx.quadraticCurveTo(90, -960, 66, -880); ctx.quadraticCurveTo(56, -950, 0, -952); ctx.quadraticCurveTo(-56, -950, -66, -880); ctx.closePath(); }, INK, { shadow: 0.2, edge: 2 });
  cut(P_rr(-62, -968, 124, 22, 8), GOLD, { shadow: 0.3, edge: 2 });
  // peacock feather
  ctx.save(); ctx.translate(30, -975); ctx.rotate(0.35); ctx.strokeStyle = '#4F7A3A'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -120); ctx.stroke();
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -110, 30, 52, 0, 0, TAU); }, '#2E8A6A', { shadow: 0.3, edge: 2 }); cut(() => { ctx.beginPath(); ctx.ellipse(0, -104, 18, 28, 0, 0, TAU); }, '#1E4FA0', { shadow: 0, edge: 0 }); circle(0, -100, 9, '#F2C14E'); ctx.restore();
  for (const k of [-1, 1]) circle(k * 64, -870, 9, GOLD);
  ctx.strokeStyle = '#1C2A44'; ctx.lineWidth = 5; ctx.lineCap = 'round'; for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 10, -930); ctx.quadraticCurveTo(k * 26, -940, k * 44, -932); ctx.stroke(); }
  eyes(-908, 0, 24, '#1C2A44', 0.95);
  ctx.strokeStyle = '#C8323D'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-14, -864); ctx.quadraticCurveTo(0, -854, 14, -864); ctx.stroke();
  ctx.strokeStyle = '#F7EFDC'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-6, -930); ctx.lineTo(-8, -960); ctx.moveTo(6, -930); ctx.lineTo(8, -960); ctx.stroke();
  // front arm
  let tip = null;
  if (pose === 'lift') { const h = back; cut(P_circ(h[0], h[1], 20), KB, { shadow: 0.2, edge: 2 }); cut(P_rr(h[0] - 5, h[1] - 54, 10, 40, 5), KB, { shadow: 0.2, edge: 2 }); tip = [h[0], h[1] - 54];
    const f = limb(86, -720, 30, 160, 10, 140, 50, 38, KB); cut(P_circ(f[0], f[1], 22), KB, { shadow: 0.2, edge: 2 }); }
  else { const f = limb(86, -720, -40, 150, -150, 120, 50, 38, KB); cut(P_circ(f[0], f[1], 20), KB, { shadow: 0.2, edge: 2 });
    ctx.save(); ctx.translate(-40, -858); ctx.rotate(0.12); cut(P_rr(-150, -9, 300, 18, 8), '#B07A22', { shadow: 0.3, edge: 2 }); for (let i = 0; i < 5; i++) circle(-90 + i * 40, 0, 4, '#5A3A12'); ctx.restore(); }
  ctx.restore();
  return tip ? [x + tip[0] * s, y + tip[1] * s] : null;
}

/** a simple cut-paper cow (Braj) */
export function cow(x, y, s = 1, dir = 1, col = '#EFE3C8') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  for (const lx of [-70, -40, 50, 80]) cut(P_rr(lx - 9, -70, 18, 72, 6), '#C9B89A', { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -100, 110, 50, 0, 0, TAU); }, col, { shadow: 0.5, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(-20, -110, 34, 20, 0.3, 0, TAU); }, '#8A6A48', { shadow: 0, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.ellipse(120, -130, 34, 26, 0.4, 0, TAU); }, col, { shadow: 0.4, edge: 2 });
  ctx.strokeStyle = '#C9B89A'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(116, -152); ctx.quadraticCurveTo(110, -186, 96, -186); ctx.moveTo(132, -150); ctx.quadraticCurveTo(140, -184, 154, -182); ctx.stroke();
  ctx.strokeStyle = col; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-108, -110); ctx.quadraticCurveTo(-130, -70, -122, -40); ctx.stroke();
  circle(118, -112, 6, '#A8322D');
  ctx.restore();
}
