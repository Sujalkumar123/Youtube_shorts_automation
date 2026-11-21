// शिव का त्रिशूल सूर्य के टुकड़े से क्यों बना? Sanjna, Chhaya and the Sun's sacrifice — cinematic cut paper.
// Palette: blinding gold (Surya's court) → indigo night (the decision) → forest green (the mare) → forge orange (the lathe).
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky } from './atmos.js';
import { raja, devi, rishi, horse, sudarshan } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const SANJNA = { sari: '#C8553D', border: '#F2C14E', pallu: '#A8402E' };
const CHHAYA = { sari: '#3A3550', border: '#8A82B0', pallu: '#2A2640', hair: '#0E0C16' };
const COURT = [[0, '#7A2A10'], [0.45, '#D8681E'], [0.8, '#F6B544'], [1, '#FFE29A']];
const NIGHT = [[0, '#050716'], [0.55, '#14183A'], [1, '#262A54']];
const FOREST = [[0, '#081410'], [0.5, '#123024'], [1, '#2A5038']];
const FORGE = [[0, '#160806'], [0.55, '#3A140A'], [1, '#6A2A10']];

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function qmark(lt, w, x, y, size = 220) { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, '#FCE7B0'); ctx.restore(); } }

/** Surya Dev: a crowned golden king standing in front of a blazing disc. blaze 0..1 = how unbearable */
function surya(x, y, h, t, blaze = 1, o = {}) {
  const cy = y - h * 0.68, R = h * 0.5;
  glow(x, cy, R * (1.6 + 0.6 * blaze), '#FFB040', 0.45 + 0.4 * blaze);
  godRays(x, cy, 0, TAU, 28, R * (1.8 + blaze), '#FFE6A0', 0.18 + 0.25 * blaze, t);
  cut(P_circ(x, cy, R), '#FFC84A', { shadow: 0, edge: 0 }); glow(x, cy, R * 0.9, '#FFF4C8', 0.5 + 0.3 * blaze);
  raja({ x, y, h, t, pose: o.pose || 'stand', eyes: 0, dir: o.dir || 1, robe: '#F6D27A', sash: '#C8401E' });
  if (blaze > 0.6) glow(x, cy, R * 1.1, '#FFFFFF', (blaze - 0.6) * 0.9);
}
/** Shiva's trident in cut paper, base of the shaft at (x, y). g = glow */
function trishul(x, y, s, g = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(0, -400);
  if (g) glow(0, -420, 300, '#9FD8FF', 0.45 * g);
  cut(P_rr(-12, -360, 24, 760, 10), '#C9CED8', { shadow: 0.6, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(0, -560); ctx.lineTo(22, -420); ctx.lineTo(22, -340); ctx.lineTo(-22, -340); ctx.lineTo(-22, -420); ctx.closePath(); }, '#E6EAF2', { shadow: 0.6, edge: 3 });
  for (const d of [-1, 1]) cut(() => { ctx.beginPath(); ctx.moveTo(d * 20, -340); ctx.quadraticCurveTo(d * 150, -360, d * 130, -520); ctx.lineTo(d * 105, -420); ctx.quadraticCurveTo(d * 100, -380, d * 20, -380); ctx.closePath(); }, '#E6EAF2', { shadow: 0.6, edge: 3 });
  cut(P_rr(-40, -345, 80, 26, 8), '#D9A83C', { shadow: 0.3, edge: 2 });
  ctx.save(); ctx.translate(34, -290); cut(() => { ctx.beginPath(); ctx.moveTo(-22, -26); ctx.lineTo(22, -26); ctx.lineTo(0, 0); ctx.lineTo(22, 26); ctx.lineTo(-22, 26); ctx.lineTo(0, 0); ctx.closePath(); }, '#9A5A30', { shadow: 0.3, edge: 2 }); ctx.restore();
  ctx.restore();
}
/** Kartikeya's shakti (vel), base of the shaft at (x, y) */
function shakti(x, y, s, g = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.translate(0, -410);
  if (g) glow(0, -440, 260, '#FFB070', 0.45 * g);
  cut(P_rr(-11, -330, 22, 740, 10), '#8A5A34', { shadow: 0.6, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(0, -620); ctx.bezierCurveTo(90, -520, 80, -400, 0, -330); ctx.bezierCurveTo(-80, -400, -90, -520, 0, -620); ctx.closePath(); }, '#F0C860', { shadow: 0.6, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.moveTo(0, -580); ctx.bezierCurveTo(40, -510, 36, -420, 0, -370); ctx.bezierCurveTo(-36, -420, -40, -510, 0, -580); ctx.closePath(); }, '#FFE6A0', { shadow: 0, edge: 0 });
  ctx.restore();
}
/** Vishwakarma's lathe: a big stone grinding wheel on a frame; sparks of sunlight when grinding */
function lathe(x, y, r, t, sparks = 0) {
  cut(P_rr(x - r - 40, y + r - 10, 2 * r + 80, 60, 10), '#3A2418', { shadow: 0.8, edge: 4 });
  for (const d of [-1, 1]) cut(P_rr(x + d * (r + 10) - 18, y - 30, 36, r + 40, 8), '#4A2E1E', { shadow: 0.6, edge: 3 });
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 6);
  cut(P_circ(0, 0, r), '#6A5A50', { shadow: 0.7, edge: 4 }); cut(P_circ(0, 0, r * 0.78), '#7E6E62', { shadow: 0, edge: 0 });
  ctx.strokeStyle = 'rgba(30,20,14,0.6)'; ctx.lineWidth = 6; for (let i = 0; i < 8; i++) { const a = i / 8 * TAU; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.2, Math.sin(a) * r * 0.2); ctx.lineTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75); ctx.stroke(); }
  cut(P_circ(0, 0, r * 0.18), '#C9A040', { shadow: 0.3, edge: 2 });
  ctx.restore();
  if (sparks > 0) for (let i = 0; i < 46; i++) { const ph = ((t * 1.7 + i * 0.137) % 1), a = -0.3 - rnd(i) * 1.3; const px = x + r * 0.7 + Math.cos(a) * ph * 520, py = y - r * 0.6 + Math.sin(a) * ph * 520 + ph * ph * 260; circle(px, py, 6 * (1 - ph) + 2, rgba(i % 3 ? '#FFD070' : '#FFF4C8', sparks * (1 - ph))); }
}
function forest(t, px = 0) {
  gradSky(FOREST); stars(t, 40, -200, 700, 4, 0.4); glow(540, 700, 500, '#9FE0B0', 0.12);
  for (let i = 0; i < 9; i++) { const x = ((i * 150 + px) % 1400 + 1400) % 1400 - 150, h = 700 + (i * 97 % 300); cut(P_poly([[x - 70, 1500], [x, 1500 - h], [x + 70, 1500]]), i % 2 ? '#0E2A1E' : '#143626', { shadow: 0.4, edge: 2 }); }
  ground('#0C2018', 1480); mist(1380, 180, '#7FC8A0', 0.15, t, 3);
}
function court(t) { gradSky(COURT); paperGrain(0.05, 5); for (let i = 0; i < 3; i++) cut(P_rr(80 + i * 360, 300, 200, 1200, 20), rgba('#FFF0C0', 0.12), { shadow: 0, edge: 0 }); ground('#6A2E12', 1460); }
const NIGHTROOM = (t) => { gradSky(NIGHT); stars(t, 60, -200, 800, 9, 0.6); ground('#0E1028', 1460); };

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · Shiva's trishul rises over night Kailash
  { const tw = W_('त्रिशूल', 0);
    add({ id: 'S01', at: 0, cam: [540, 1000], zoom: 0.14, note: 'night Kailash, trishul rises into frame and flashes on त्रिशूल', draw(lt, d, t) {
      gradSky(NIGHT); stars(t, 120, -200, 1100, 2, 0.9);
      ranges([{ y: 1150, h: 380, col: '#2A3460', seed: 4, haze: 0.2 }, { y: 1350, h: 260, col: '#181E40', seed: 8 }], 0, '#8FA8E0');
      const r = eob(seg(lt, 0, tw + 0.3)); trishul(540, lerp(2000, 1500, r), 1.25, r);
      if (lt > tw) glow(540, 700, 700, '#CFE8FF', 0.55 * (1 - seg(lt, tw, tw + 0.5)));
      mist(1350, 200, '#6A80C0', 0.2, t, 1); vignette(0.55);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'swell', { dur: 1.6, gain: 0.5 }); cue(tw, 'damru', { gain: 0.8 }); }

  // 1 · made from a piece of the Sun
  { const tk = W_('टुकड़े', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 900], zoom: 0.1, note: 'a huge sun; a glowing shard breaks off on टुकड़े and flies to the trident', draw(lt, d, t) {
      gradSky([[0, '#2A0E06'], [0.5, '#8A2E10'], [1, '#E07A2A']]);
      glow(540, 560, 700, '#FFB040', 0.6); godRays(540, 560, 0, TAU, 30, 1200, '#FFE6A0', 0.25, t); cut(P_circ(540, 560, 300), '#FFC84A', { shadow: 0, edge: 0 }); glow(540, 560, 260, '#FFF4C8', 0.6);
      const k = eo(seg(lt, tk - 0.2, tk + 0.8)); if (lt > tk - 0.2) { const sx = lerp(720, 540, k), sy = lerp(760, 1000, k); glow(sx, sy, 120, '#FFFFFF', 0.8); cut(P_poly([[sx, sy - 50], [sx + 30, sy], [sx, sy + 50], [sx - 30, sy]]), '#FFF4C8', { shadow: 0, edge: 0 }); }
      trishul(540, 1530, 0.8, 0.3 + k); vignette(0.5);
    } });
    cue(cut_(1), 'whoosh'); cue(cut_(1) + tk, 'slam', { gain: 0.6 }); cue(cut_(1) + tk + 0.6, 'sparkle', { dur: 1.2, gain: 0.5 }); }

  // 2 · and the reason was a wife's pain
  { const dr = W_('दर्द', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 1050], zoom: 0.1, note: 'Sanjna alone in the glare, head bowed; heartbeat on दर्द', draw(lt, d, t) {
      gradSky([[0, '#3A1008'], [0.6, '#B04A18'], [1, '#F2A04A']]); glow(540, 400, 900, '#FFD080', 0.5); godRays(540, 300, 0.2, Math.PI - 0.2, 18, 1600, '#FFE6A0', 0.25, t);
      ground('#4A1E0E', 1460);
      devi({ x: 540, y: 1500, h: 960, t, ...SANJNA, eyes: 0, pose: 'bow', dir: -1, crown: true });
      if (lt > dr) glow(540, 900, 400, '#FF4A2A', 0.25 * eo(seg(lt, dr, dr + 0.5)));
      slipAt(lt, dr, 'एक पत्नी का दर्द', 540, 420, 58); vignette(0.6);
    } });
    cue(cut_(2), 'heartbeat', { gain: 0.6 }); cue(cut_(2) + dr, 'heartbeat', { gain: 0.8 }); }

  // 3 · Vishwakarma's daughter Sanjna married Surya
  { const vk = W_('विश्वकर्मा', 3), sj = W_('संज्ञा', 3), by = W_('ब्याही', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 1000], zoom: 0.06, note: 'golden court: Vishwakarma left, Sanjna centre-left, Surya radiant right; petals on ब्याही', draw(lt, d, t) {
      court(t);
      surya(800, 1480, 820, t, 0.35);
      devi({ x: 450, y: 1480, h: 820, t, ...SANJNA, eyes: 0, pose: 'namaste', dir: 1, crown: true, glowA: lt > sj ? 1 : 0 });
      rishi(170, 1480, { s: 0.95, t, pose: 'namaste', dir: 1 });
      if (lt > by) for (let i = 0; i < 26; i++) { const ph = (lt - by) * 0.5 + rnd(i + 3); circle(200 + rnd(i) * 700, ((ph * 600) % 1300) + 150, 9, rgba(i % 2 ? '#F2C14E' : '#E8586A', 0.85)); }
      slipAt(lt, vk, 'विश्वकर्मा', 200, 380, 48, -0.04); slipAt(lt, sj, 'संज्ञा', 460, 300, 58, 0.03); slipAt(lt, by + 0.2, 'सूर्य देव', 820, 380, 54, -0.03);
      vignette(0.45);
    } });
    cue(cut_(3), 'conch', { dur: 1.8, gain: 0.5 }); cue(cut_(3) + sj, 'bell', { gain: 0.6 }); cue(cut_(3) + by, 'sparkle', { dur: 1.2, gain: 0.4 }); }

  // 4 · Surya's radiance was so fierce
  { const pr = W_('प्रचंड', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 900], zoom: 0.16, note: 'Surya alone, the blaze grows until the frame whitens on प्रचंड', draw(lt, d, t) {
      gradSky([[0, '#5A1A08'], [0.5, '#D8601A'], [1, '#FFC060']]); const b = 0.4 + 0.6 * eio(seg(lt, 0, pr + 0.3));
      surya(540, 1500, 980, t, b);
      if (lt > pr) { ctx.fillStyle = rgba('#FFF8E0', 0.5 * (1 - seg(lt, pr + 0.2, d))); ctx.fillRect(0, 0, W, H); }
      vignette(0.4);
    } });
    cue(cut_(4), 'swell', { dur: 2.2, gain: 0.6 }); cue(cut_(4) + pr, 'drum', { gain: 0.9 }); }

  // 5 · Sanjna could not even look at her husband
  { const dk = W_('देख', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 1050], zoom: 0.08, note: 'Surya blazing on the left edge, Sanjna on the right turns her face away and bows on देख', draw(lt, d, t) {
      court(t); glow(0, 900, 900, '#FFF0B0', 0.6);
      surya(180, 1480, 820, t, 0.9);
      devi({ x: 780, y: 1480, h: 900, t, ...SANJNA, eyes: 0, pose: lt > dk ? 'bow' : 'stand', dir: 1, crown: true });
      godRays(180, 920, -0.5, 0.5, 12, 1200, '#FFF4C8', 0.3, t);
      vignette(0.5);
    } });
    cue(cut_(5) + dk, 'tock', { gain: 0.7 }); }

  // 6 · children: Yama and Yamuna
  { const ym = W_('यम', 6), yu = W_('यमुना', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 1100], zoom: 0.08, note: 'Sanjna with two children, dusk palace; names on their words', draw(lt, d, t) {
      gradSky([[0, '#2A1430'], [0.5, '#7A3A3A'], [1, '#D8803A']]); paperGrain(0.05, 7); ground('#3A1A1A', 1470);
      devi({ x: 540, y: 1500, h: 900, t, ...SANJNA, eyes: 0, pose: 'namaste', dir: 1, crown: true });
      raja({ x: 280, y: 1500, h: 520, t, pose: 'stand', eyes: 0, dir: 1, robe: '#E8D6A8', sash: '#3A7AA0' }); devi({ x: 800, y: 1500, h: 470, t, sari: '#3A7AA0', border: '#F2C14E', eyes: 0, pose: 'namaste', dir: -1 });
      slipAt(lt, ym, 'यम', 280, 820, 60, -0.04); slipAt(lt, yu, 'यमुना', 800, 900, 60, 0.04);
      motes(t, 24, [0, 400, W, 1400], A.paleGold, 0.5, 20, 2, 3); vignette(0.5);
    } });
    cue(cut_(6) + ym, 'bell', { gain: 0.4 }); cue(cut_(6) + yu, 'bell', { gain: 0.4 }); }

  // 7 · one night Sanjna made a decision
  { const fs = W_('फ़ैसला', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 1050], zoom: 0.1, note: 'indigo night, big moon in an arched window; Sanjna stands in silhouette, red glow on फ़ैसला', draw(lt, d, t) {
      gradSky(NIGHT); stars(t, 90, -200, 900, 6, 0.8);
      cut(P_rr(260, 260, 560, 900, 280), '#1E2450', { shadow: 0.6, edge: 4 }); glow(540, 620, 260, '#DDE6FF', 0.4); cut(P_circ(540, 620, 150), '#E6ECFF', { shadow: 0, edge: 0 });
      ground('#0E1028', 1460);
      devi({ x: 540, y: 1500, h: 900, t, ...SANJNA, eyes: lt > fs ? 1 : 0, pose: 'stand', dir: -1, crown: true });
      if (lt > fs) glow(540, 900, 380, '#FF8A5A', 0.25 * eo(seg(lt, fs, fs + 0.4)));
      vignette(0.6);
    } });
    cue(cut_(7), 'heartbeat', { gain: 0.5 }); cue(cut_(7) + fs, 'drum', { gain: 0.8 }); }

  // 8 · from her own shadow she made a woman: Chhaya
  { const pc = W_('परछाईं', 8), ch = W_('छाया', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 1100], zoom: 0.08, note: 'her shadow stretches on the floor, then rises as Chhaya (indigo twin) on छाया', draw(lt, d, t) {
      NIGHTROOM(t); glow(200, 500, 500, '#DDE6FF', 0.25);
      devi({ x: 300, y: 1500, h: 900, t, ...SANJNA, eyes: 0, pose: 'namaste', dir: 1, crown: true });
      const sh = eo(seg(lt, pc - 0.3, pc + 0.6)); ctx.save(); ctx.globalAlpha = 0.6 * sh; ctx.fillStyle = '#05040C'; ctx.beginPath(); ctx.ellipse(600, 1492, 300 * sh + 1, 40, 0, 0, TAU); ctx.fill(); ctx.restore();
      const r = eob(seg(lt, ch - 0.6, ch + 0.3));
      if (r > 0) { ctx.save(); ctx.globalAlpha = clamp(r); ctx.translate(760, 1500); ctx.scale(1, Math.max(0.01, r)); devi({ x: 0, y: 0, h: 900, t, ...CHHAYA, eyes: 0, pose: 'stand', dir: -1, crown: true }); ctx.restore(); glow(760, 1000, 380, '#8A82B0', 0.3 * clamp(r)); }
      slipAt(lt, ch, 'छाया', 760, 380, 70, 0.04); vignette(0.6);
    } });
    cue(cut_(8) + pc, 'whoosh', { gain: 0.7 }); cue(cut_(8) + ch - 0.4, 'swell', { dur: 0.6, gain: 0.5 }); cue(cut_(8) + ch, 'damru', { gain: 0.6 }); }

  // 9 · stay in my place
  { const jg = W_('जगह', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 1050], zoom: 0.1, note: 'two women face to face, Chhaya bows; the crown passes to her on जगह', draw(lt, d, t) {
      NIGHTROOM(t);
      devi({ x: 360, y: 1500, h: 900, t, ...SANJNA, eyes: 0, pose: 'namaste', dir: 1, crown: lt < jg });
      devi({ x: 740, y: 1500, h: 880, t, ...CHHAYA, eyes: 0, pose: 'bow', dir: -1, crown: lt > jg, glowA: lt > jg ? 0.6 : 0 });
      slipAt(lt, jg, 'मेरी जगह रहना', 540, 420, 58); vignette(0.6);
    } });
    cue(cut_(9) + jg, 'bell', { gain: 0.5 }); }

  // 10 · Sanjna became a mare and went into the forest for tapas
  { const gh = W_('घोड़ी', 10), tp = W_('तप', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 1150], zoom: 0.08, note: 'Sanjna dissolves into light and a white mare stands in a moonlit forest; gold glow of tapas', draw(lt, d, t) {
      forest(t, -lt * 20); const m = eo(seg(lt, gh - 0.4, gh + 0.4));
      if (m < 1) { ctx.save(); ctx.globalAlpha = 1 - m; devi({ x: 540, y: 1500, h: 860, t, ...SANJNA, eyes: 0, pose: 'namaste', dir: 1, crown: true }); ctx.restore(); }
      if (m > 0) { ctx.save(); ctx.globalAlpha = m; horse(560, 1480, 1.35, 0, -1); ctx.restore(); }
      if (lt > gh) glow(540, 1100, 360, '#FFFFFF', 0.4 * (1 - seg(lt, gh, gh + 0.6)));
      if (lt > tp) { glow(540, 1150, 420, '#F2C14E', 0.3); motes(t, 30, [300, 800, 780, 1450], A.paleGold, 0.7, 40, 3, 4); }
      vignette(0.55);
    } });
    cue(cut_(10) + gh - 0.3, 'whoosh'); cue(cut_(10) + gh, 'sparkle', { dur: 1.2, gain: 0.5 }); cue(cut_(10) + tp, 'conch', { dur: 1.6, gain: 0.35 }); }

  // 11 · but the real twist was still to come
  { const md = W_('मोड़', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 1100], zoom: 0.18, note: 'darkness, Chhaya in the doorway, one lamp; red flush on मोड़', draw(lt, d, t) {
      gradSky([[0, '#030308'], [1, '#14102A']]); ground('#08060F', 1460);
      cut(P_rr(330, 520, 420, 960, 200), '#2A2650', { shadow: 0.5, edge: 3 }); glow(540, 900, 320, '#8A82B0', 0.35);
      devi({ x: 540, y: 1480, h: 860, t, ...CHHAYA, eyes: 1, pose: 'stand', dir: 1, crown: true });
      glow(220, 1400, 90 + 12 * Math.sin(t * 9), '#FFB040', 0.8); cut(P_circ(220, 1420, 20), '#FFD070', { shadow: 0, edge: 0 });
      if (lt > md) glow(540, 900, 600, '#FF2A2A', 0.12);
      vignette(0.7);
    } });
    cue(cut_(11), 'heartbeat', { gain: 0.8 }); cue(cut_(11) + md, 'drum', { gain: 0.9 }); cue(cut_(11) + md + 0.5, 'heartbeat', { gain: 0.8 }); }

  // 12 · Chhaya did not love Sanjna's children
  { const pr = W_('प्यार', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 1100], zoom: 0.06, note: 'Chhaya in warm light turns away; Yama and Yamuna alone in cold blue light; a dashed red divide on प्यार', draw(lt, d, t) {
      gradSky([[0, '#100C24'], [0.6, '#2A2450'], [1, '#4A3A6A']]); ground('#120E24', 1460);
      glow(300, 1100, 420, '#FFB070', 0.3); devi({ x: 330, y: 1500, h: 900, t, ...CHHAYA, eyes: 0, pose: 'hold', dir: -1, crown: true });
      glow(800, 1200, 360, '#6A9AE0', 0.2); raja({ x: 720, y: 1500, h: 520, t, pose: 'stand', eyes: 0, dir: -1, robe: '#E8D6A8', sash: '#3A7AA0' }); devi({ x: 900, y: 1500, h: 470, t, sari: '#3A7AA0', border: '#F2C14E', eyes: 0, pose: 'bow', dir: -1 });
      if (lt > pr) { ctx.strokeStyle = rgba('#E85A5A', 0.8 * eo(seg(lt, pr, pr + 0.3))); ctx.lineWidth = 10; ctx.setLineDash([24, 22]); ctx.beginPath(); ctx.moveTo(580, 500); ctx.lineTo(580, 1480); ctx.stroke(); ctx.setLineDash([]); }
      vignette(0.55);
    } });
    cue(cut_(12) + pr, 'tock', { gain: 0.8 }); }

  // 13 · Yama asked: mother, why?
  { const mm = W_('माँ', 13), ky = W_('क्यों', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 1150], zoom: 0.12, note: 'Yama looks up at the towering indigo Chhaya; big ? on क्यों', draw(lt, d, t) {
      gradSky([[0, '#100C24'], [1, '#3A2E5A']]); ground('#120E24', 1460);
      devi({ x: 800, y: 1500, h: 1250, t, ...CHHAYA, eyes: 1, pose: 'stand', dir: -1, crown: true });
      raja({ x: 320, y: 1500, h: 700, t, pose: lt > mm ? 'decree' : 'stand', eyes: 1, dir: 1, robe: '#E8D6A8', sash: '#3A7AA0' });
      qmark(lt, ky, 320, 560); vignette(0.55);
    } });
    cue(cut_(13) + mm, 'heartbeat', { gain: 0.6 }); cue(cut_(13) + ky, 'tock', { gain: 0.9 }); }

  // 14 · Surya understood: this is not Sanjna
  { const sm = W_('समझ', 14), nh = W_('नहीं', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 1000], zoom: 0.08, note: 'Surya (left) light falls on "Sanjna" (right) who turns into indigo Chhaya; slip on नहीं', draw(lt, d, t) {
      court(t); surya(250, 1480, 860, t, 0.6 + 0.4 * eo(seg(lt, sm, sm + 0.5)));
      const k = eo(seg(lt, sm, nh + 0.3));
      ctx.save(); ctx.globalAlpha = 1 - k; devi({ x: 790, y: 1500, h: 880, t, ...SANJNA, eyes: 0, pose: 'stand', dir: -1, crown: true }); ctx.restore();
      ctx.save(); ctx.globalAlpha = k; devi({ x: 790, y: 1500, h: 880, t, ...CHHAYA, eyes: 1, pose: 'bow', dir: -1, crown: false }); ctx.restore();
      godRays(250, 900, -0.4, 0.4, 10, 1200, '#FFF4C8', 0.35 * k, t);
      slipAt(lt, nh, 'ये संज्ञा नहीं है!', 640, 300, 56, 0.03); vignette(0.45);
    } });
    cue(cut_(14) + sm, 'swell', { dur: 1.2, gain: 0.5 }); cue(cut_(14) + nh, 'slam', { gain: 0.8 }); }

  // 15 · Surya found Sanjna. But how would she return?
  { const dh = W_('ढूँढ', 15), ks = W_('कैसे', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 1150], zoom: 0.08, note: 'golden light enters the dark forest and finds the white mare; she turns from the glare; ? on कैसे', draw(lt, d, t) {
      forest(t); const k = eo(seg(lt, 0, dh + 0.4));
      glow(lerp(-200, 200, k), 900, 600, '#FFC060', 0.5 * k); godRays(lerp(-200, 200, k), 900, -0.4, 0.5, 12, 1400, '#FFE6A0', 0.3 * k, t);
      horse(680, 1480, 1.25, 0, lt > dh ? 1 : -1);
      qmark(lt, ks, 780, 560, 200); vignette(0.55);
    } });
    cue(cut_(15), 'whoosh'); cue(cut_(15) + dh, 'bell', { gain: 0.5 }); cue(cut_(15) + ks, 'tock'); }

  // 16 · for his wife, Surya had his own radiance cut (the emotional peak)
  { const pt = W_('पत्नी', 16), kt = W_('कटवाया', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 1000], zoom: 0.12, note: 'Surya bows into tapas; his blaze drops on कटवाया', draw(lt, d, t) {
      gradSky([[0, '#2A0E06'], [0.6, '#7A2E10'], [1, '#C8601E']]); ground('#3A1608', 1460);
      const b = lt < kt ? 1 : 1 - 0.65 * eo(seg(lt, kt, kt + 0.8));
      surya(540, 1500, 900, t, b, { pose: lt > pt ? 'tapas' : 'stand' });
      motes(t, 30, [100, 300, 980, 1400], '#FFD070', 0.6, 40, 5, 4);
      slipAt(lt, pt, 'पत्नी के लिए', 540, 300, 60); vignette(0.55);
    } });
    cue(cut_(16), 'conch', { dur: 2.0, gain: 0.5 }); cue(cut_(16) + kt, 'drum', { gain: 1.0 }); cue(cut_(16) + kt + 0.1, 'swell', { dur: 1.4, gain: 0.4 }); }

  // 17 · Vishwakarma ground off an eighth of the radiance
  { const av = W_('आठवाँ', 17), ut = W_('उतार', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 1050], zoom: 0.08, note: 'forge: Vishwakarma at the great wheel, sparks of sunlight fly; a 1/8 slice lifts off a sun disc on आठवाँ', draw(lt, d, t) {
      gradSky(FORGE); glow(540, 1100, 700, '#FF7A2A', 0.35); ground('#1E0A06', 1460);
      lathe(620, 1180, 200, t, 1);
      rishi(250, 1480, { s: 1.0, t, pose: 'strain', dir: 1 });
      const k = eo(seg(lt, av - 0.2, av + 0.5)); ctx.save(); ctx.translate(760, 480);
      glow(0, 0, 260, '#FFB040', 0.5); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 160, -Math.PI / 4 + 0.03, 1.5 * Math.PI - 0.03); ctx.closePath(); }, '#FFC84A', { shadow: 0.3, edge: 2 });
      ctx.translate(Math.cos(-Math.PI * 3 / 8) * 90 * k, Math.sin(-Math.PI * 3 / 8) * 90 * k); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 160, -Math.PI / 2, -Math.PI / 4); ctx.closePath(); }, '#FFF4C8', { shadow: 0.4, edge: 2 }); ctx.restore();
      slipAt(lt, av, 'आठवाँ भाग', 760, 730, 54, 0.03);
      vignette(0.5);
    } });
    cue(cut_(17), 'damru', { gain: 0.7 }); cue(cut_(17) + 0.3, 'sizzle', { gain: 0.5 }); cue(cut_(17) + av, 'slam', { gain: 0.7 }); cue(cut_(17) + ut, 'sparkle', { dur: 1.4, gain: 0.5 }); }

  // 18 · from that dust: Shiva's trishul, Vishnu's chakra
  { const tr = W_('त्रिशूल', 18), ck = W_('चक्र', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 950], zoom: 0.06, note: 'gold dust swirls; trishul forms left on त्रिशूल, Sudarshan chakra right on चक्र', draw(lt, d, t) {
      gradSky([[0, '#0A0616'], [0.6, '#2A1440'], [1, '#5A2A30']]); stars(t, 80, -200, 1200, 3, 0.6);
      glow(540, 950, 520, '#FFB040', 0.35); godRays(540, 950, 0, TAU, 20, 900, '#FFE6A0', 0.15, t); for (let i = 0; i < 90; i++) { const a = i * 2.39996 + t * (0.6 + rnd(i) * 0.6), rr = 60 + (i * 7 % 420); circle(540 + Math.cos(a) * rr, 950 + Math.sin(a) * rr * 0.8, 3 + rnd(i + 9) * 6, rgba(i % 3 ? '#FFD070' : '#FFF4C8', 0.8)); }
      const a = eob(seg(lt, tr - 0.3, tr + 0.3)), b = eob(seg(lt, ck - 0.3, ck + 0.3));
      if (a > 0) { ctx.save(); ctx.globalAlpha = clamp(a); trishul(320, 1480, 0.95 * Math.max(0.01, a), 1); ctx.restore(); }
      if (b > 0) { ctx.save(); ctx.globalAlpha = clamp(b); sudarshan(770, 900, 190 * Math.max(0.01, b), t, 1); ctx.restore(); }
      slipAt(lt, tr, 'त्रिशूल', 320, 320, 56, -0.04); slipAt(lt, ck, 'चक्र', 770, 620, 56, 0.04);
      vignette(0.5);
    } });
    cue(cut_(18), 'whoosh'); cue(cut_(18) + tr, 'damru', { gain: 0.8 }); cue(cut_(18) + ck, 'conch', { dur: 1.4, gain: 0.5 }); }

  // 19 · and Kartikeya's shakti
  { const sk = W_('शक्ति', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 950], zoom: 0.08, note: 'all three weapons: trishul left, shakti centre rises on शक्ति, chakra right', draw(lt, d, t) {
      gradSky([[0, '#0A0616'], [0.6, '#2A1440'], [1, '#5A2A30']]); stars(t, 80, -200, 1200, 3, 0.6); motes(t, 50, [100, 300, 980, 1450], '#FFD070', 0.6, 60, 8, 4);
      trishul(220, 1480, 0.85, 0.8, -0.08); sudarshan(850, 900, 150, t, 1);
      const c = eob(seg(lt, sk - 0.3, sk + 0.3)); if (c > 0) { ctx.save(); ctx.globalAlpha = clamp(c); shakti(540, lerp(1700, 1480, c), 1.0, 1); ctx.restore(); }
      slipAt(lt, sk, 'शक्ति', 540, 300, 64); vignette(0.5);
    } });
    cue(cut_(19) + sk, 'drum', { gain: 0.9 }); cue(cut_(19) + sk + 0.05, 'bell', { gain: 0.8 }); }

  // 20 · the gods' weapons, born of a husband's love
  { const pm = W_('प्रेम', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 1000], zoom: 0.1, note: 'soft dawn, gentle Surya and Sanjna face each other; three weapons glow faintly above; ribbon प्रेम', draw(lt, d, t) {
      dawnSky(t, 1); ranges([{ y: 1280, h: 220, col: '#5A2E4A', seed: 3, haze: 0.25 }, { y: 1420, h: 160, col: '#2A1430', seed: 9 }], 0, '#F2964A');
      ctx.save(); ctx.globalAlpha = 0.35; trishul(260, 900, 0.4, 0.6); shakti(540, 760, 0.4, 0.6); sudarshan(820, 560, 70, t, 1); ctx.restore();
      surya(360, 1500, 780, t, 0.25); devi({ x: 760, y: 1500, h: 820, t, ...SANJNA, eyes: 0, pose: 'namaste', dir: -1, crown: true });
      if (lt > pm - 0.15) K.ribbon('प्रेम', 540, 330, eob(seg(lt, pm - 0.15, pm + 0.2)), 110);
      vignette(0.45);
    } });
    cue(cut_(20), 'swell', { dur: 2.0, gain: 0.5 }); cue(cut_(20) + pm, 'bell', { gain: 1.0 }); cue(cut_(20) + pm, 'drum', { gain: 0.6 }); }

  // 21-22 · end card
  { const st = cut_(21), f = Wd('फ़ॉलो', 22) - st;
    add({ id: 'S22', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: blazing sun with the trishul in front; Untold Stories in gold', draw(lt, d, t) {
      gradSky([[0, '#2A0E06'], [0.6, '#8A2E10'], [1, '#E07A2A']]); glow(540, 1150, 600, '#FFB040', 0.5); cut(P_circ(540, 1150, 260), '#FFC84A', { shadow: 0, edge: 0 }); godRays(540, 1150, 0, TAU, 24, 1100, '#FFE6A0', 0.2, t);
      trishul(540, 1560, 0.75, 0.6);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 440, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 590, 80, '#FFD2B8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 740, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
