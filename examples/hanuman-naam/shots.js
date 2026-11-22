// हनुमान जी अपनी शक्ति क्यों भूल गए? How Hanuman got his name — cinematic cut paper.
// Palette: cosmic indigo + blazing sun (hook) → rose dawn Anjaneri hills (childhood) → fire gold (the sun) → storm slate + vajra blue
// (the strike) → ash grey (breathless world) → Brahma gold (revival) → night indigo (the curse) → ocean dawn (the leap).
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle, ell } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky, water, palm, cloud, birds } from './atmos.js';
import { raja, devi, rishi, hanuman, vajra, jamvant, wind, lightning, lotus } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const COSMIC = [[0, '#04030E'], [0.5, '#1A0E36'], [1, '#4A1A3A']];
const DAWN = [[0, '#1E1A40'], [0.4, '#6A3A62'], [0.65, '#E07A5A'], [0.8, '#F6B47A'], [1, '#3A2440']];
const FIRE = [[0, '#3A0A06'], [0.45, '#B8380E'], [0.8, '#F6A030'], [1, '#FFE29A']];
const STORM = [[0, '#05070E'], [0.5, '#141C2E'], [1, '#2A3448']];
const ASH = [[0, '#2A2A30'], [0.6, '#4A4A52'], [1, '#6A6A70']];
const GOLDEN = [[0, '#2A1206'], [0.5, '#8A4A12'], [1, '#F6C860']];
const NIGHT = [[0, '#050716'], [0.55, '#14183A'], [1, '#262A54']];
const CAVE = [[0, '#0A0806'], [0.6, '#1E1610'], [1, '#2E2218']];
const INDRA = { robe: '#E8EEF8', sash: '#3A6AC8' }, VAYU = { robe: '#BFD8F0', sash: '#5A8AB8' };

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function qmark(lt, w, x, y, size = 220) { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, '#FCE7B0'); ctx.restore(); } }
function ribbonAt(lt, w, text, x, y, size = 110) { if (lt > w - 0.15) K.ribbon(text, x, y, eob(seg(lt, w - 0.15, w + 0.2)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }
function sun(x, y, R, t, blaze = 1, col = '#FF5A2A') {
  glow(x, y, R * (2 + blaze), '#FF8A30', 0.4 + 0.3 * blaze); godRays(x, y, 0, TAU, 30, R * (2.4 + blaze), '#FFD890', 0.14 + 0.2 * blaze, t);
  cut(P_circ(x, y, R), col, { shadow: 0, edge: 0 }); glow(x, y, R * 0.95, '#FFE6A0', 0.35 + 0.35 * blaze);
}
function suryaDev(x, y, h, t, blaze = 1) {
  const cy = y - h * 0.68, R = h * 0.5; sun(x, cy, R * 1.05, t, blaze, '#FFB038');
  raja({ x, y, h, t, pose: 'stand', eyes: 0, dir: 1, robe: '#F6D27A', sash: '#C8401E' });
  if (blaze > 0.6) glow(x, cy, R * 1.1, '#FFFFFF', (blaze - 0.6) * 0.7);
}
function hills(t, px = 0, c = ['#5A2E4A', '#2A1430', '#170A1C']) {
  ranges([{ y: 1100, h: 320, col: c[0], seed: 4, haze: 0.3 }, { y: 1260, h: 240, col: c[1], seed: 9 }], px * 0.3, '#F2A07A');
  palm(80 + px * 0.7, 1380, 520, c[2], 0.12, t); palm(1010 + px * 0.7, 1400, 470, c[2], -0.15, t); ground(c[2], 1460);
}
function clouds(t, cols, px = 0, a = 0.85) { for (const [cx, cy, s] of [[180, 420, 1.2], [880, 300, 1.0], [600, 1250, 1.4], [120, 1100, 0.9], [1000, 980, 1.1]]) cloud(((cx - px) % 1500 + 1500) % 1500 - 200, cy, s, cols[0], cols[1], cols[2], a); }
function speedLines(t, a = 1, col = '#FFF2D0') { ctx.save(); ctx.strokeStyle = rgba(col, 0.35 * a); ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { const y = rnd(i) * H, x = W - ((t * 2600 + rnd(i + 7) * 3000) % 3000) + 600, l = 160 + 260 * rnd(i + 3); ctx.lineWidth = 3 + 6 * rnd(i + 1); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y + l * 0.35); ctx.stroke(); } ctx.restore(); }
function ring(lt, w, x, y, col = '#FFE6A0', len = 0.9, R = 900) { if (lt > w && lt < w + len) { const k = seg(lt, w, w + len); ctx.save(); ctx.strokeStyle = rgba(col, 0.8 * (1 - k)); ctx.lineWidth = 30 * (1 - k) + 4; ctx.beginPath(); ctx.ellipse(x, y, R * eo(k), R * 0.4 * eo(k), 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
function devas(n, t, a, y0 = 300) { for (let i = 0; i < n; i++) { const x = 110 + (i * 157) % 880, y = y0 + (i % 3) * 120 + Math.sin(t + i) * 14; ctx.save(); ctx.globalAlpha = a; glow(x, y, 90, A.paleGold, 0.6); raja({ x, y: y + 90, h: 160, pose: 'stand', t, robe: '#F0E2C4', sash: '#E8B13E', eyes: 0 }); ctx.restore(); } }
function ashram(t, px = 0) {
  gradSky([[0, '#2A4A3A'], [0.5, '#6A9A6A'], [1, '#D8E8B0']]); glow(800, 420, 400, '#FFF0C0', 0.4);
  ranges([{ y: 1000, h: 300, col: '#3A6A4A', seed: 2, haze: 0.3 }, { y: 1180, h: 220, col: '#24402E', seed: 6 }], px * 0.3, '#E8F0C0');
  for (const [x, hh] of [[120, 700], [960, 620]]) { cut(P_rr(x - 22, 1460 - hh, 44, hh, 10), '#3A2616', { shadow: 0.4, edge: 2 }); for (let i = 0; i < 4; i++) cut(P_circ(x + (i - 1.5) * 90, 1460 - hh - 40 + (i % 2) * 60, 150), ['#2E5A36', '#3E7A44', '#24482A', '#4A8A50'][i], { shadow: 0.4, edge: 3 }); }
  cut(P_poly([[620, 1460], [760, 1260], [900, 1460]]), '#8A6A3A', { shadow: 0.5, edge: 3 }); ground('#4A3A1E', 1460);
}
function shore(t, k = 1) {
  dawnSky(t, k, 1180, 4); glow(540, 1180, 700, '#FFB040', 0.4);
  cut(() => { ctx.beginPath(); ctx.moveTo(760, 1180); ctx.lineTo(820, 1130); ctx.lineTo(860, 1150); ctx.lineTo(900, 1100); ctx.lineTo(950, 1160); ctx.lineTo(1000, 1180); ctx.closePath(); }, '#5A2A3A', { shadow: 0, edge: 0 });
  water(t, 1180, ['#E89A6A', '#8A4A5A'], '#FFE6A0', 0.6);
  cut(() => { ctx.beginPath(); ctx.moveTo(-200, 1420); ctx.quadraticCurveTo(400, 1340, 1300, 1400); ctx.lineTo(1300, H + 200); ctx.lineTo(-200, H + 200); ctx.closePath(); }, '#C89A6A', { shadow: 0.4, edge: 3 });
  for (let i = 0; i < 6; i++) cut(P_circ(80 + i * 190, 1470 + (i % 2) * 30, 50 + 20 * rnd(i)), '#6A5A4A', { shadow: 0.4, edge: 2 });
}

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK: a tiny vanara child flies at a gigantic blazing sun; ? on क्यों (thumbnail)
  { const ky = W_('क्यों', 0);
    add({ id: 'S01', at: 0, cam: [540, 950], zoom: 0.14, note: 'cosmic indigo, giant red sun, tiny Hanuman flying toward it with arm out, speed lines; ? on क्यों', draw(lt, d, t) {
      gradSky(COSMIC); stars(t, 140, -200, 1900, 3, 0.9); paperGrain(0.04, 3);
      sun(700, 620, 330 + lt * 14, t, 0.9);
      clouds(t, ['#3A1A44', '#5A2A5A', '#24102E'], lt * 120, 0.8);
      hanuman(lerp(220, 330, eio(seg(lt, 0, d))), 1260, { s: 0.75, t, pose: 'fly', rot: 1.0, eyes: 1, aura: 0.8 });
      speedLines(t, 0.8); qmark(lt, ky, 540, 1180, 200);
      motes(t, 50, [0, 100, W, 1500], '#FFD890', 0.7, 40, 3, 4); vignette(0.55);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'whoosh', { gain: 0.7 }); cue(0.1, 'swell', { dur: 2.2, gain: 0.6 }); cue(ky, 'damru', { gain: 0.7 }); }

  // 1 · the answer is hidden in his name
  { const nm = W_('नाम', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 950], zoom: 0.1, note: 'temple night: diyas, carved arch silhouette; golden letters हनुमान rise from glow on नाम', draw(lt, d, t) {
      gradSky(NIGHT); stars(t, 100, -200, 900, 5, 0.7); glow(540, 900, 600, '#FF9A40', 0.3);
      cut(() => { ctx.beginPath(); ctx.moveTo(140, 1460); ctx.lineTo(140, 760); ctx.quadraticCurveTo(140, 420, 540, 340); ctx.quadraticCurveTo(940, 420, 940, 760); ctx.lineTo(940, 1460); ctx.lineTo(820, 1460); ctx.lineTo(820, 780); ctx.quadraticCurveTo(820, 520, 540, 470); ctx.quadraticCurveTo(260, 520, 260, 780); ctx.lineTo(260, 1460); ctx.closePath(); }, '#2A1410', { shadow: 0.6, edge: 4 });
      ground('#1A0C0A', 1460); for (let i = 0; i < 7; i++) K && (glow(180 + i * 120, 1440, 60, '#FFB040', 0.5 + 0.2 * Math.sin(t * 6 + i)), cut(P_circ(180 + i * 120, 1430, 10 + 3 * Math.sin(t * 8 + i)), '#FFD27A', { shadow: 0, edge: 0 }));
      if (lt > nm - 0.3) { const k = eob(seg(lt, nm - 0.3, nm + 0.3)); ctx.save(); ctx.translate(540, 900 + (1 - k) * 80); ctx.scale(k, k); glow(0, 0, 360, '#FFD27A', 0.6); ctx.shadowColor = rgba(A.gold, 0.9); ctx.shadowBlur = 40; bigText('हनुमान', 0, 0, 170, '#FFE6A0'); ctx.restore(); }
      motes(t, 40, [140, 400, 940, 1450], '#FFD890', 0.7, 50, 2, 4); vignette(0.55);
    } });
    cue(cut_(1), 'bell', { gain: 0.6 }); cue(cut_(1) + nm, 'conch', { dur: 1.6, gain: 0.55 }); }

  // 2 · mother Anjana and her little son
  { const an = W_('अंजना', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 1000], zoom: 0.07, note: 'rose dawn Anjaneri hills, Anjana (devi) beside the little vanara child; slip माँ अंजना', draw(lt, d, t) {
      gradSky(DAWN); glow(540, 1100, 600, '#FFC88A', 0.45); hills(t, -lt * 30); birds(t, 600 + lt * 30, 560, 4, '#2A1A38', 0.9);
      devi({ x: 420, y: 1500, h: 860, t, pose: 'namaste', sari: '#C8553D', border: '#F2C14E', pallu: '#A8402E', glowA: 0.6 });
      hanuman(700, 1500, { s: 0.85, t, pose: 'stand', eyes: 1 });
      mist(1380, 140, '#F2B0A0', 0.25, t, 2); slipAt(lt, an, 'माँ अंजना', 540, 330, 58); motes(t, 30, [0, 400, W, 1400], '#FFE6B0', 0.5, 30, 4, 3); vignette(0.45);
    } });
    cue(cut_(2), 'sparkle', { dur: 2.5, gain: 0.5 }); }

  // 3 · one morning, a huge hunger
  { const bk = W_('भूख', 3);
    add({ id: 'S04', at: cut_(3), cam: [560, 1050], zoom: 0.16, note: 'pre-dawn close: the child rubs his belly, an empty leaf plate; slip भूख! with a bounce', draw(lt, d, t) {
      gradSky([[0, '#14183A'], [0.6, '#5A3A6A'], [1, '#E08A6A']]); glow(540, 1200, 600, '#FF9A60', 0.35); hills(t, lt * 20, ['#3A2440', '#20142A', '#120A18']);
      hanuman(540, 1500, { s: 1.2, t, pose: 'sit', eyes: lt > bk ? 1 : 0.2 });
      cut(() => { ctx.beginPath(); ctx.ellipse(860, 1470, 130, 30, 0, 0, TAU); }, '#4A8A50', { shadow: 0.4, edge: 2 });
      slipAt(lt, bk, 'भूख!', 540, 380, 80, 0.05); vignette(0.5);
    } });
    cue(cut_(3) + bk, 'thud', { gain: 0.4 }); }

  // 4 · he looks up: a red ripe fruit in the sky
  { const ph = W_('फल', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 900], zoom: 0.1, note: 'dawn: a huge red sun rises over the hills, child silhouette points up; on फल a leaf appears on the sun (fruit)', draw(lt, d, t) {
      gradSky(DAWN); const sy = lerp(1150, 900, eo(seg(lt, 0, d))); sun(540, sy, 220, t, 0.5, '#E8341E');
      if (lt > ph - 0.2) { const k = eob(seg(lt, ph - 0.2, ph + 0.3)); ctx.save(); ctx.translate(540, sy - 210); ctx.rotate(0.4); ctx.scale(k, k); cut(() => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(70, -60, 150, -20); ctx.quadraticCurveTo(70, 30, 0, 0); ctx.closePath(); }, '#3E8A3A', { shadow: 0.4, edge: 3 }); cut(P_rr(-6, -40, 12, 50, 4), '#5A3A1E', { shadow: 0.2, edge: 2 }); ctx.restore(); }
      hills(t, 0, ['#4A2440', '#24102A', '#0E0612']);
      hanuman(380, 1490, { s: 0.9, t, pose: 'reach', eyes: 1 });
      slipAt(lt, ph, 'फल?', 760, 480, 70); vignette(0.5);
    } });
    cue(cut_(4), 'swell', { dur: 2.2, gain: 0.5 }); cue(cut_(4) + ph, 'sparkle', { dur: 1, gain: 0.5 }); }

  // 5 · it was no fruit... it was Surya dev! (WOW)
  { const sd = W_('सूर्य', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 900], zoom: 0.12, note: 'fire gold: on सूर्य the red fruit flares into Surya dev in a blazing disc; flash + rays; name slip', draw(lt, d, t) {
      gradSky(FIRE); const b = seg(lt, sd - 0.2, sd + 0.5);
      if (lt < sd) sun(540, 760, 260, t, 0.6, '#E8341E'); else suryaDev(540, 1420, 1000, t, eo(b));
      clouds(t, ['#F6A050', '#FFD890', '#C8602A'], lt * 60, 0.6);
      flash(lt, sd, '#FFF6D8', 0.9); slipAt(lt, sd + 0.3, 'सूर्य देव', 540, 300, 62); motes(t, 60, [0, 100, W, 1500], '#FFE6A0', 0.8, 60, 6, 4); vignette(0.4, '#3A0A06');
    } });
    cue(cut_(5) + sd, 'drum', { gain: 0.9 }); cue(cut_(5) + sd, 'conch', { dur: 1.8, gain: 0.6 }); }

  // 6 · the child flies toward the sun (WOW)
  { add({ id: 'S07', at: cut_(6), cam: [540, 950], zoom: 0.08, note: 'the child flies up through clouds toward the sun, clouds whip past, speed lines, sun grows', draw(lt, d, t) {
      gradSky([[0, '#F6A030'], [0.5, '#FF7A3A'], [1, '#6A2A5A']]); sun(780, lerp(500, 380, seg(lt, 0, d)), 200 + lt * 50, t, 0.8, '#FF6A2A');
      clouds(t, ['#F6C8A0', '#FFF0D8', '#C8806A'], lt * 900, 0.9);
      hanuman(lerp(260, 520, eio(seg(lt, 0, d))), lerp(1350, 1100, eio(seg(lt, 0, d))), { s: 0.9, t, pose: 'fly', rot: 0.8, eyes: 1, aura: 0.6 });
      speedLines(t, 1); vignette(0.4);
    } });
    cue(cut_(6), 'whoosh', { gain: 0.8 }); cue(cut_(6) + 0.6, 'whoosh', { gain: 0.4 }); }

  // 7 · Surya did not burn him... but Indra feared
  { const id = W_('इंद्र', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 950], zoom: 0.08, note: 'the child floats safely in the sun\'s glow (gentle light); on इंद्र a storm cloud slides in from the right with Indra holding the vajra', draw(lt, d, t) {
      gradSky(FIRE); sun(380, 700, 300, t, 0.6, '#FF9A38'); glow(380, 700, 360, '#FFF6D8', 0.3);
      hanuman(380, 900, { s: 0.6, t, pose: 'stand', eyes: 1, aura: 1 });
      if (lt > id - 0.3) { const k = eo(seg(lt, id - 0.3, id + 0.5)); ctx.save(); ctx.translate((1 - k) * 600, 0); ctx.fillStyle = rgba('#141C2E', 0.5 * k); ctx.fillRect(560, -300, 900, H + 600);
        cloud(860, 1320, 1.8, '#3A4458', '#5A6680', '#1E2636', 1); raja({ x: 860, y: 1300, h: 760, t, pose: 'stand', eyes: 1, dir: -1, ...INDRA }); vajra(980, 760, 0.6, 0.3, 0.8, t); cloud(880, 1400, 1.5, '#2A3448', '#4A5670', '#141C2E', 1); ctx.restore(); }
      slipAt(lt, id + 0.2, 'इंद्र', 860, 300, 60); vignette(0.45);
    } });
    cue(cut_(7), 'sparkle', { dur: 1.2, gain: 0.4 }); cue(cut_(7) + id, 'slam', { gain: 0.6 }); }

  // 8 · open loop: the real twist was still ahead
  { add({ id: 'S09', at: cut_(8), cam: [540, 950], zoom: 0.12, note: 'storm clouds swallow the golden sky, lightning flickers inside; slip असली मोड़...', draw(lt, d, t) {
      gradSky(STORM); glow(540, 700, 500, '#FF8A30', 0.4 * (1 - seg(lt, 0, d)));
      clouds(t, ['#2A3448', '#4A5670', '#141C2E'], lt * 60, 1); lightning(300 + 400 * rnd(Math.floor(t * 3)), -100, 900, t, (Math.sin(t * 17) > 0.7 ? 0.7 : 0), Math.floor(t * 3));
      ring(lt, 0.2, 540, 900, '#9FC0FF', 1.0, 700); slipAt(lt, 0.4, 'असली मोड़...', 540, 960, 70); motes(t, 40, [0, 0, W, H], '#9FC0FF', 0.4, 60, 9, 3); vignette(0.6);
    } });
    cue(cut_(8), 'slam', { gain: 0.7 }); cue(cut_(8) + 0.3, 'swell', { dur: 2, gain: 0.5 }); }

  // 9 · Indra's vajra struck his chin (symbolic: lightning + flash)
  { const tu = W_('ठुड्डी', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 950], zoom: 0.1, note: 'vajra flies as a blue-white bolt from the storm toward a small glowing child silhouette; white flash + shake on ठुड्डी (no injury shown)', draw(lt, d, t) {
      gradSky(STORM); clouds(t, ['#2A3448', '#4A5670', '#141C2E'], lt * 40, 1); sun(260, 520, 160, t, 0.3, '#C85A2A');
      const k = eio(seg(lt, 0.1, tu)); const vx = lerp(1000, 420, k), vy = lerp(300, 820, k);
      ctx.save(); ctx.strokeStyle = rgba('#DDE8FF', 0.4); ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1100, 200); ctx.lineTo(vx, vy); ctx.stroke(); ctx.restore();
      if (lt < tu + 0.1) vajra(vx, vy, 0.55, -0.9 + lt, 1, t);
      ctx.save(); ctx.globalAlpha = 0.9; hanuman(400, 1060, { s: 0.55, t, pose: 'fly', rot: 0.8, eyes: 1 }); ctx.restore();
      if (lt > tu) lightning(420, 200, 900, t, 1 - seg(lt, tu, tu + 0.6), 7);
      flash(lt, tu, '#EAF2FF', 0.95, 0.9); vignette(0.6);
    } });
    cue(cut_(9) + 0.1, 'whoosh', { gain: 0.8 }); cue(cut_(9) + tu, 'slam', { gain: 0.9 }); cue(cut_(9) + tu, 'slam', { gain: 0.8 }); }

  // 10 · he fell to the earth
  { const gr = W_('गिरा', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 1000], zoom: 0.1, note: 'the child falls like a dim star with a trail of light toward a mountain; dust ring on गिरा', draw(lt, d, t) {
      gradSky([[0, '#0E1220'], [0.6, '#2A2A40'], [1, '#5A4A5A']]); stars(t, 60, -200, 800, 8, 0.5);
      ranges([{ y: 1100, h: 360, col: '#3A3450', seed: 5, haze: 0.3 }, { y: 1300, h: 220, col: '#1E1A2E', seed: 1 }], 0, '#8A8AA0'); ground('#141020', 1460);
      const k = eo(seg(lt, 0, gr)); const fx = lerp(760, 540, k), fy = lerp(200, 1260, k);
      luminousTrail(fx, fy, t, 1 - seg(lt, gr, gr + 0.4));
      if (lt < gr) { ctx.save(); ctx.globalAlpha = 0.95; hanuman(fx, fy, { s: 0.35, t, pose: 'limp', rot: lt * 2.5, eyes: 0 }); ctx.restore(); }
      else hanuman(540, 1300, { s: 0.35, t, pose: 'limp', rot: -1.5, eyes: 0 });
      ring(lt, gr, 540, 1300, '#D8C8B8', 1.0, 600); vignette(0.6);
    } });
    cue(cut_(10) + gr, 'thud', { gain: 0.8 }); cue(cut_(10) + gr, 'drum', { gain: 0.6 }); }

  // 11 · Pavan dev, seeing his son so, grew angry
  { const pv = W_('पवन', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 950], zoom: 0.1, note: 'storm blue: Vayu (pale blue robe) rises with swirling wind ribbons, leaves torn around; slip पवन देव', draw(lt, d, t) {
      gradSky([[0, '#0A1428'], [0.5, '#1E3A5A'], [1, '#5A7A9A']]); clouds(t, ['#2A4A6A', '#4A6A8A', '#1A2A40'], lt * 300, 0.9);
      ranges([{ y: 1250, h: 260, col: '#1A2A3A', seed: 3 }], lt * 40, '#7A9AB8'); ground('#0E1622', 1460);
      wind(540, 900, 520, t, 0.9); raja({ x: 540, y: 1480 - 40 * eo(seg(lt, 0, 1)), h: 960, t, pose: 'stand', eyes: lt > pv ? 1 : 0, dir: 1, ...VAYU }); wind(540, 1100, 420, t + 3, 0.7);
      for (let i = 0; i < 24; i++) { const ph = (t * 0.8 + rnd(i)) % 1; ctx.save(); ctx.translate(ph * 1400 - 150, 300 + rnd(i + 3) * 1200 + Math.sin(t * 3 + i) * 60); ctx.rotate(t * 4 + i); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 18, 8, 0, 0, TAU); }, i % 2 ? '#4A8A50' : '#8AA040', { shadow: 0.2, edge: 0 }); ctx.restore(); }
      slipAt(lt, pv, 'पवन देव', 540, 300, 60); vignette(0.5);
    } });
    cue(cut_(11), 'whoosh', { gain: 0.7 }); cue(cut_(11) + pv, 'drum', { gain: 0.6 }); }

  // 12 · he took him in his lap into a cave
  { const gu = W_('गुफा', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 1050], zoom: 0.12, note: 'cave mouth from inside: dark rock arch, Vayu walks in carrying the limp child in his arms, light behind fades', draw(lt, d, t) {
      gradSky([[0, '#5A7A9A'], [1, '#B8C8D8']]); glow(540, 900, 600, '#DDEBFF', 0.4 * (1 - seg(lt, gu, d)));
      const x = lerp(760, 540, eo(seg(lt, 0, d))); raja({ x, y: 1500, h: 900, t, pose: 'walk', eyes: 0, dir: -1, ...VAYU }); hanuman(x + 10, 980, { s: 0.42, t, pose: 'limp', rot: -1.45, eyes: 0 });
      cut(() => { ctx.beginPath(); ctx.moveTo(-300, -300); ctx.lineTo(W + 300, -300); ctx.lineTo(W + 300, H + 300); ctx.lineTo(-300, H + 300); ctx.closePath(); ctx.moveTo(940, 1500); ctx.quadraticCurveTo(980, 600, 540, 420); ctx.quadraticCurveTo(100, 600, 140, 1500); ctx.closePath(); }, '#1E1610', { shadow: 0.6, edge: 5 });
      for (let i = 0; i < 6; i++) cut(P_poly([[180 + i * 140, 400], [220 + i * 140, 520 + 60 * rnd(i)], [260 + i * 140, 400]]), '#140E0A', { shadow: 0.3, edge: 2 });
      ctx.fillStyle = rgba('#000000', 0.5 * seg(lt, gu, d)); ctx.fillRect(-300, -300, W + 600, H + 600); slipAt(lt, gu, 'गुफा', 540, 300, 58); wind(540, 1000, 300, t, 0.3 * (1 - seg(lt, gu, d))); vignette(0.6);
    } });
    cue(cut_(12) + gu, 'whoosh', { gain: 0.5 }); }

  // 13 · and the whole world's breath stopped (darkest moment)
  { const tm = W_('थम', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 1000], zoom: 0.06, note: 'ash grey world: still trees, a diya flame shrinks and goes out, birds stop mid-air, people kneel; desaturated', draw(lt, d, t) {
      const fr = lt > tm ? tm : lt; gradSky(ASH); paperGrain(0.06, 4);
      ranges([{ y: 1150, h: 300, col: '#3A3A42', seed: 2, haze: 0.2 }, { y: 1300, h: 200, col: '#2A2A30', seed: 8 }], 0, '#8A8A90');
      palm(150, 1460, 520, '#1E1E24', 0.12, fr); palm(950, 1460, 480, '#1E1E24', -0.12, fr); ground('#1A1A1E', 1460); birds(fr, 380, 600, 5, '#1A1A1E', 1);
      for (let i = 0; i < 5; i++) { const px = 260 + i * 140; cut(() => { ctx.beginPath(); ctx.ellipse(px, 1340, 20, 22, 0, 0, TAU); ctx.moveTo(px - 40, 1460); ctx.quadraticCurveTo(px - 30, 1370, px + 10, 1365); ctx.quadraticCurveTo(px + 40, 1390, px + 40, 1460); ctx.closePath(); }, '#141418', { shadow: 0.3, edge: 0 }); }
      const fk = 1 - seg(lt, tm - 0.2, tm + 0.4); if (fk > 0) { glow(540, 1210, 80 * fk, '#FFB040', 0.6 * fk); cut(P_circ(540, 1215, 14 * fk), '#FFD27A', { shadow: 0, edge: 0 }); } cut(P_rr(515, 1225, 50, 20, 8), '#6A4A2A', { shadow: 0.3, edge: 2 });
      vignette(0.7, '#000000');
    } });
    cue(cut_(13), 'whoosh', { gain: 0.5 }); cue(cut_(13) + tm, 'heartbeat', { gain: 0.6 }); }

  // 14 · Brahma came and gave the child life (WOW)
  { const jv = W_('जीवन', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 950], zoom: 0.12, note: 'Brahma descends on his lotus in a golden blaze; on जीवन a beam touches the child, who glows and opens his eyes', draw(lt, d, t) {
      gradSky(GOLDEN); godRays(540, 400, 0, TAU, 26, 1600, '#FFE6A0', 0.2, t); glow(540, 500, 700, '#FFD27A', 0.5);
      brahma(540, lerp(700, 860, eo(seg(lt, 0, 1.2))), 0.9, t);
      ground('#3A1E0A', 1460); const on = seg(lt, jv - 0.2, jv + 0.6);
      if (on > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#FFE6A0', 0.35 * on); ctx.beginPath(); ctx.moveTo(500, 860); ctx.lineTo(580, 860); ctx.lineTo(700, 1440); ctx.lineTo(380, 1440); ctx.closePath(); ctx.fill(); ctx.restore(); }
      hanuman(540, 1450, { s: 0.55, t, pose: on > 0.5 ? 'sit' : 'limp', rot: on > 0.5 ? 0 : -1.5, eyes: on > 0.6 ? 1 : 0, aura: on });
      flash(lt, jv, '#FFF6D8', 0.6); slipAt(lt, 0.3, 'ब्रह्मा जी', 540, 260, 58); motes(t, 60, [0, 100, W, 1500], '#FFE6A0', 0.8, 50, 7, 4); vignette(0.45, '#2A1206');
    } });
    cue(cut_(14), 'conch', { dur: 2, gain: 0.6 }); cue(cut_(14) + jv, 'bell', { gain: 0.8 }); cue(cut_(14) + jv, 'swell', { dur: 1.6, gain: 0.5 }); }

  // 15 · every god gave a boon, and Indra gave a name
  { const vd = W_('वरदान', 15), nm = W_('नाम', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 950], zoom: 0.08, note: 'devas in glowing rows on clouds bless the child; ribbon वरदान; Indra steps forward (vajra calm) on नाम', draw(lt, d, t) {
      gradSky([[0, '#1A1238'], [0.5, '#5A3A7A'], [1, '#F6B47A']]); stars(t, 60, -200, 700, 4, 0.6); clouds(t, ['#C8A0C8', '#F6E0F0', '#8A6A9A'], lt * 30, 0.8);
      devas(7, t, eo(seg(lt, 0, 0.8)), 280);
      hanuman(540, 1450, { s: 0.6, t, pose: 'stand', eyes: 1, aura: 0.8 });
      if (lt > nm - 0.4) { const k = eo(seg(lt, nm - 0.4, nm + 0.2)); ctx.save(); ctx.globalAlpha = k; raja({ x: 860, y: 1470, h: 680, t, pose: 'stand', eyes: 0, dir: -1, ...INDRA }); vajra(950, 1060, 0.35, 0, 0.4, t); ctx.restore(); }
      ribbonAt(lt, vd, 'वरदान', 540, 900, 90); vignette(0.45);
    } });
    cue(cut_(15) + vd, 'sparkle', { dur: 1.2, gain: 0.6 }); cue(cut_(15) + nm, 'bell', { gain: 0.7 }); }

  // 16 · Hanu means chin... Hanuman! (WOW)
  { const hm = W_('हनुमान', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 950], zoom: 0.14, note: 'close-up of the child\'s smiling face, chin glows gold; slip हनु = ठुड्डी, then flash + ribbon हनुमान with gold rays', draw(lt, d, t) {
      gradSky([[0, '#3A1206'], [0.5, '#B8581E'], [1, '#F6C860']]); godRays(540, 900, 0, TAU, 28, 1300, '#FFE6A0', 0.15 + 0.2 * seg(lt, hm, hm + 0.5), t);
      hanuman(540, 1780, { s: 1.9, t, pose: 'stand', eyes: 1, chinGlow: 0.6 + 0.4 * Math.sin(t * 4) * 0.5 });
      slipAt(lt, 0.2, 'हनु = ठुड्डी', 540, 300, 64);
      flash(lt, hm, '#FFF6D8', 0.8); ribbonAt(lt, hm, 'हनुमान', 540, 520, 120); motes(t, 50, [0, 100, W, 1500], '#FFE6A0', 0.8, 50, 8, 4); vignette(0.4, '#3A1206');
    } });
    cue(cut_(16) + 0.2, 'damru', { gain: 0.6 }); cue(cut_(16) + hm, 'drum', { gain: 0.9 }); cue(cut_(16) + hm, 'bell', { gain: 0.8 }); }

  // 17 · but the naughty child started teasing the sages
  { const st = W_('सताने', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 1000], zoom: 0.08, note: 'green ashram: a rishi meditates; the child swings down from a tree, a kamandal tips and splashes on सताने', draw(lt, d, t) {
      ashram(t, lt * 20); rishi(380, 1500, { s: 0.9, t, pose: 'stand' });
      const sw = Math.sin(t * 3); ctx.save(); ctx.strokeStyle = '#3A2616'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(900, 760); ctx.lineTo(900 + sw * 120, 1100); ctx.stroke(); ctx.restore();
      hanuman(900 + sw * 120, 1360, { s: 0.6, t, pose: 'reach', rot: -sw * 0.3, eyes: 1, dir: -1 });
      const k = seg(lt, st - 0.2, st + 0.4); ctx.save(); ctx.translate(620, 1440); ctx.rotate(k * 1.4); cut(() => { ctx.beginPath(); ctx.ellipse(0, -40, 46, 52, 0, 0, TAU); }, '#7A4A2A', { shadow: 0.5, edge: 3 }); ctx.restore();
      if (k > 0) for (let i = 0; i < 12; i++) circle(660 + i * 14 * k, 1430 - Math.sin(i) * 40 * k, 8, rgba('#BFE8F2', 0.8 * (1 - seg(lt, st + 0.3, st + 1))));
      slipAt(lt, 0.3, 'नटखट', 760, 320, 60); vignette(0.4);
    } });
    cue(cut_(17), 'sparkle', { dur: 2, gain: 0.4 }); cue(cut_(17) + st, 'plop', { gain: 0.6 }); }

  // 18 · the sages said: you will forget your power, until someone reminds you
  { const bh = W_('भूल', 18), yd = W_('याद', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 980], zoom: 0.1, note: 'night indigo: two rishis raise hands (curse pose) with soft light; the child\'s golden aura drains into a tiny spark on भूल; slip याद on याद', draw(lt, d, t) {
      gradSky(NIGHT); stars(t, 120, -200, 1000, 6, 0.8); ranges([{ y: 1200, h: 260, col: '#1A1E3A', seed: 7 }], 0, '#4A4A7A'); ground('#0C0E1E', 1460);
      rishi(220, 1500, { s: 0.85, t, pose: 'curse', aura: 0.6 }); rishi(860, 1500, { s: 0.85, t, pose: 'curse', dir: -1, aura: 0.6 });
      const dr = seg(lt, bh - 0.2, bh + 1.0); hanuman(540, 1480, { s: 0.6, t, pose: 'stand', eyes: lt > bh ? 0 : 1, aura: 1 - dr });
      if (dr > 0 && dr < 1) for (let i = 0; i < 30; i++) { const p = (dr + rnd(i) * 0.5) % 1; circle(lerp(540 + (rnd(i + 3) - 0.5) * 400, 540, p), lerp(1100 + (rnd(i + 5) - 0.5) * 500, 1180, p), 5, rgba('#FFE6A0', 0.8 * (1 - p))); }
      glow(540, 1180, 40 + 30 * dr, '#FFE6A0', 0.6 * dr);
      slipAt(lt, bh, 'शक्ति भूल जाओगे', 540, 320, 56); slipAt(lt, yd, 'जब तक कोई याद ना दिलाए', 540, 460, 46, 0.02); vignette(0.55);
    } });
    cue(cut_(18), 'swell', { dur: 3, gain: 0.5 }); cue(cut_(18) + bh, 'bell', { gain: 0.6 }); }

  // 19 · years later, on the seashore, Jamvant reminded him
  { const jm = W_('जामवंत', 19);
    add({ id: 'S20', at: cut_(19), cam: [560, 1050], zoom: 0.08, note: 'ocean dawn shore: adult Hanuman sits head bowed; Jamvant the old bear-king speaks with his staff; on जामवंत slip', draw(lt, d, t) {
      shore(t); hanuman(680, 1520, { s: 1.0, t, pose: 'sit', age: 1, eyes: 0 });
      jamvant(260, 1530, { s: 0.85, t, eyes: 1 });
      slipAt(lt, jm, 'जामवंत', 300, 320, 60); motes(t, 30, [0, 600, W, 1400], '#FFE6A0', 0.5, 30, 11, 3); vignette(0.45);
    } });
    cue(cut_(19), 'swell', { dur: 3, gain: 0.5 }); cue(cut_(19) + jm, 'bell', { gain: 0.6 }); }

  // 20 · and Hanuman crossed the ocean in one leap (WOW)
  { const ch = W_('छलांग', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 950], zoom: 0.14, note: 'giant golden Hanuman with gada leaps across a dawn ocean, shockwave ring from the shore, Lanka on the horizon; flash on छलांग', draw(lt, d, t) {
      dawnSky(t, 1, 1250, 6); sun(540, 1180, 160, t, 0.6, '#FFB040');
      cut(() => { ctx.beginPath(); ctx.moveTo(820, 1250); ctx.lineTo(860, 1200); ctx.lineTo(900, 1220); ctx.lineTo(940, 1170); ctx.lineTo(990, 1230); ctx.lineTo(1060, 1250); ctx.closePath(); }, '#5A2A3A', { shadow: 0, edge: 0 });
      water(t, 1250, ['#E89A6A', '#6A3A5A'], '#FFE6A0', 0.6);
      const k = eio(seg(lt, ch - 0.5, d)); hanuman(lerp(200, 760, k), lerp(1300, 820, Math.sin(Math.min(1, k + 0.3) * Math.PI * 0.8)), { s: 1.05, t, pose: 'leap', rot: 0.9, age: 1, eyes: 1, aura: 1, gada: 1 });
      ring(lt, ch - 0.2, 200, 1400, '#FFE6A0', 1.0, 800); flash(lt, ch, '#FFF6D8', 0.7); speedLines(t, seg(lt, ch, ch + 0.3));
      motes(t, 50, [0, 100, W, 1500], '#FFE6A0', 0.8, 50, 12, 4); vignette(0.4);
    } });
    cue(cut_(20) + ch - 0.2, 'whoosh', { gain: 0.9 }); cue(cut_(20) + ch, 'drum', { gain: 0.9 }); cue(cut_(20) + ch, 'conch', { dur: 2, gain: 0.6 }); }

  // 21 · LOOP: and that mark on his chin became his name
  { const nm = W_('नाम', 21);
    add({ id: 'S22', at: cut_(21), cam: [540, 950], zoom: 0.12, note: 'temple night again: adult Hanuman (smiling, eyes closed) in a golden glow, chin mark glows; ribbon हनुमान on नाम', draw(lt, d, t) {
      gradSky(NIGHT); stars(t, 100, -200, 900, 5, 0.7); glow(540, 900, 600, '#FF9A40', 0.35); godRays(540, 900, 0, TAU, 22, 1200, '#FFE6A0', 0.14, t);
      for (let i = 0; i < 7; i++) { glow(180 + i * 120, 1460, 60, '#FFB040', 0.5 + 0.2 * Math.sin(t * 6 + i)); cut(P_circ(180 + i * 120, 1450, 10 + 3 * Math.sin(t * 8 + i)), '#FFD27A', { shadow: 0, edge: 0 }); }
      hanuman(540, 1480, { s: 1.1, t, pose: 'stand', age: 1, eyes: 0, aura: 0.8, chinGlow: 0.8 });
      ribbonAt(lt, nm, 'हनुमान', 540, 300, 110); motes(t, 40, [0, 200, W, 1450], '#FFD890', 0.7, 40, 2, 4); vignette(0.5);
    } });
    cue(cut_(21), 'bell', { gain: 0.6 }); cue(cut_(21) + nm, 'conch', { dur: 2, gain: 0.6 }); }

  // 22-23 · end card
  { const st = cut_(22), f = Wd('फ़ॉलो', 23) - st;
    add({ id: 'S23', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: dawn sky, tiny Hanuman silhouette flying to the sun, Untold Stories in gold', draw(lt, d, t) {
      dawnSky(t, 1, 1250, 7); sun(540, 1000, 200, t, 0.6, '#FF8A30');
      hanuman(lerp(200, 380, seg(lt, 0, d)), 1300, { s: 0.45, t, pose: 'fly', rot: 1.0, eyes: 1, aura: 0.6 });
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 440, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 590, 80, '#FFD2B8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 740, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}

function luminousTrail(x, y, t, a) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const k = i / 14; glow(x + k * 220, y - k * 900, 60 * (1 - k) + 10, '#FFE6A0', 0.35 * a * (1 - k)); } ctx.restore(); }
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
