// एक छोटी मछली ने पूरी दुनिया कैसे बचाई? Matsya, Vishnu's first avatar — cinematic cut paper.
// Palette: ocean-night teal (hook) → river dawn rose (Satyavrata) → noon river blue (growing) → deep indigo + divine gold (reveal)
// → storm slate + lightning (pralaya) → golden dawn (Manu).
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle, ell } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky, water, palm, cloud, luminous, birds } from './atmos.js';
import { raja, vishnu, lotus, vessel, cow, matsya, naav, cuppedHands, lightning, rain } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const OCEAN = [[0, '#020812'], [0.5, '#06203A'], [1, '#0C3A5A']];
const RIVERDAWN = [[0, '#1A1838'], [0.4, '#6A3A62'], [0.62, '#E07A5A'], [0.75, '#F6B47A'], [1, '#3A2440']];
const NOON = [[0, '#2A6A9A'], [0.6, '#7AB4D8'], [1, '#D8EEF2']];
const DEEP = [[0, '#030616'], [0.55, '#0C1440'], [1, '#1A2A6A']];
const STORM = [[0, '#05070C'], [0.5, '#141A26'], [1, '#2A3440']];
const SEA = ['#0E4A6A', '#08304A'], SEA_N = ['#0A2A44', '#051A2E'], SEA_S = ['#1A2A36', '#0C161E'], SEA_D = ['#E89A6A', '#B0604A'];
const ROPE = { col: '#5AC88A', hi: '#9FF0B0' };
const KING = { robe: '#F2E2C0', sash: '#C8401E' };

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function qmark(lt, w, x, y, size = 220) { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, '#FCE7B0'); ctx.restore(); } }
function ribbonAt(lt, w, text, x, y, size = 110) { if (lt > w - 0.15) K.ribbon(text, x, y, eob(seg(lt, w - 0.15, w + 0.2)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function riverBank(t, px = 0) {
  ranges([{ y: 1050, h: 300, col: '#4A2A50', seed: 3, haze: 0.3 }, { y: 1160, h: 200, col: '#2A1A38', seed: 7 }], px * 0.3, '#F2A07A');
  palm(90 + px * 0.6, 1220, 520, '#1A1026', 0.12, t); palm(1000 + px * 0.6, 1240, 460, '#1A1026', -0.15, t);
}
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK: tiny boat on a black ocean, a giant golden fish arcs over it (thumbnail)
  { const bc = W_('बचा', 0);
    add({ id: 'S01', at: 0, cam: [540, 950], zoom: 0.12, note: 'night ocean, tiny boat, giant glowing golden fish arcs above it; flash on बचा', draw(lt, d, t) {
      gradSky(OCEAN); stars(t, 120, -200, 900, 2, 0.8); glow(540, 700, 700, '#FFC860', 0.3 + 0.2 * seg(lt, 0, 1));
      cloud(200, 380, 1.2, '#1A2A44', '#2E4466', '#0E1A2E', 0.8); cloud(880, 300, 1.0, '#1A2A44', '#2E4466', '#0E1A2E', 0.7);
      godRays(540, 800, 0, TAU, 24, 1000, '#FFE6A0', 0.15, t);
      const a = lerp(-0.5, 0.25, eio(seg(lt, 0, d)));
      matsya(540 + Math.sin(a) * 260, 820 - Math.cos(a) * 120, 1.35, t, { rot: a * 0.8, glow: 1, horn: 1 });
      water(t, 1250, SEA_N, '#FFD890', 0.6);
      naav(560, 1300 + Math.sin(t * 2) * 8, 0.55, t, { rot: Math.sin(t * 1.4) * 0.04, lamp: 1, sages: 3 });
      if (lt > bc) glow(540, 820, 800, '#FFF2C0', 0.5 * (1 - seg(lt, bc, bc + 0.6)));
      motes(t, 50, [0, 200, W, 1300], '#FFD890', 0.7, 40, 3, 4); vignette(0.55);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'swell', { dur: 2.0, gain: 0.6 }); cue(bc, 'bell', { gain: 0.8 }); }

  // 1 · but who was that fish?
  { const kn = W_('कौन', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 950], zoom: 0.1, note: 'underwater: a dark fish silhouette glides past, light shafts, bubbles; big ? on कौन', draw(lt, d, t) {
      gradSky([[0, '#0E4A6A'], [0.5, '#06263E'], [1, '#020A16']]); godRays(540, -200, 1.2, 1.95, 10, 2400, '#9FE0F0', 0.2, t);
      for (let i = 0; i < 4; i++) cut(() => { ctx.beginPath(); const y = 1500 + i * 80; ctx.moveTo(-100, H + 200); ctx.lineTo(-100, y); for (let x = -100; x <= W + 100; x += 60) ctx.lineTo(x, y - 60 * Math.abs(Math.sin(x * 0.006 + i * 2))); ctx.lineTo(W + 100, H + 200); ctx.closePath(); }, ['#0A2A2E', '#08201E', '#061814', '#040E0C'][i], { shadow: 0.4, edge: 2 });
      matsya(lerp(-250, 1300, seg(lt, 0, d + 0.3)), 1000, 1.6, t, { silhouette: 1 });
      for (let i = 0; i < 40; i++) { const ph = (t * 0.25 + rnd(i)) % 1; circle(rnd(i + 5) * W, 1600 - ph * 1500, 4 + rnd(i) * 8, rgba('#BFF0FF', 0.35 * (1 - ph))); }
      qmark(lt, kn, 540, 560, 260); vignette(0.6);
    } });
    cue(cut_(1), 'bubbles', { gain: 0.5 }); cue(cut_(1) + kn, 'damru', { gain: 0.7 }); }

  // 2 · King Satyavrata offering arghya in the river at dawn
  { const sv = W_('सत्यव्रत', 2), ar = W_('अर्घ्य', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 1000], zoom: 0.07, note: 'rose dawn river, palms and hills, the king in the river; arghya stream of glinting water', draw(lt, d, t) {
      gradSky(RIVERDAWN); glow(540, 1080, 600, '#FFC88A', 0.45); cut(P_circ(540, 1060, 120), '#FFD8A0', { shadow: 0, edge: 0 });
      riverBank(t, -lt * 20); birds(t, 650 + lt * 30, 520, 4, '#2A1A38', 0.9);
      raja({ x: 480, y: 1560, h: 900, t, pose: 'stand', eyes: 0, dir: 1, ...KING });
      water(t, 1320, ['#B0587A', '#6A3A62'], '#FFE0B0', 0.7);
      if (lt > ar - 0.4) { const k = seg(lt, ar - 0.4, ar); ctx.save(); ctx.translate(700, 760); ctx.rotate(0.5); vessel(0, 0, 0.35); ctx.restore(); for (let i = 0; i < 18; i++) { const ph = (t * 1.4 + i / 18) % 1; circle(740 + ph * 20, 800 + ph * 540, 7 * (1 - ph * 0.5), rgba('#FFF0D0', 0.8 * k)); } }
      mist(1300, 160, '#F2B0A0', 0.25, t, 2); slipAt(lt, sv, 'राजा सत्यव्रत', 540, 330, 58); vignette(0.45);
    } });
    cue(cut_(2), 'conch', { dur: 1.8, gain: 0.5 }); cue(cut_(2) + ar, 'plop', { gain: 0.5 }); }

  // 3 · a tiny fish in his joined palms
  { const mc = W_('मछली', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 1000], zoom: 0.16, note: 'close-up cupped hands holding water; a tiny golden fish appears with a sparkle on मछली', draw(lt, d, t) {
      gradSky(RIVERDAWN); glow(540, 900, 700, '#FFC88A', 0.5); water(t, 1150, ['#B0587A', '#6A3A62'], '#FFE0B0', 0.7);
      cuppedHands(540, 1060, 1.2, t, '#C88A5A'); ell(540, 1050, 210, 50, rgba('#BFE8F2', 0.7));
      if (lt > mc - 0.2) { const k = eob(seg(lt, mc - 0.2, mc + 0.3)); matsya(540 + Math.sin(t * 3) * 30, 1040, 0.32 * Math.max(0.01, k), t, { glow: 0.6, dir: Math.cos(t * 3) > 0 ? 1 : -1 }); glow(540, 1040, 200, '#FFE6A0', 0.4 * k); }
      motes(t, 30, [200, 500, 880, 1300], '#FFE6B0', 0.6, 30, 5, 4); vignette(0.5);
    } });
    cue(cut_(3), 'plop', { gain: 0.5 }); cue(cut_(3) + mc, 'sparkle', { dur: 1.0, gain: 0.6 }); }

  // 4 · the fish said: save me
  { const bc = W_('बचा', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 950], zoom: 0.2, note: 'macro: the little fish in the palm, ripple rings; slip मुझे बचा लो, heartbeat', draw(lt, d, t) {
      gradSky([[0, '#3A2040'], [0.6, '#A85A6A'], [1, '#F2B08A']]); glow(540, 950, 600, '#FFD8A0', 0.4);
      cuppedHands(540, 1180, 2.0, t, '#C88A5A'); ell(540, 1170, 360, 84, rgba('#BFE8F2', 0.7));
      for (let r = 0; r < 3; r++) { const ph = (t * 0.7 + r / 3) % 1; ctx.strokeStyle = rgba('#FFFFFF', 0.6 * (1 - ph)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(560, 1160, 60 + ph * 260, 18 + ph * 60, 0, 0, TAU); ctx.stroke(); }
      matsya(560, 1130 + Math.sin(t * 4) * 8, 0.75, t, { glow: 0.5, rot: -0.25 });
      slipAt(lt, bc, 'मुझे बचा लो', 540, 520, 64); vignette(0.55);
    } });
    cue(cut_(4), 'heartbeat', { gain: 0.6 }); cue(cut_(4) + bc, 'heartbeat', { gain: 0.8 }); }

  // 5 · the kind king put it in his kamandal
  { const km = W_('कमंडल', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 1000], zoom: 0.07, note: 'king on the bank, the fish arcs from his hand into the kamandal on कमंडल, splash', draw(lt, d, t) {
      gradSky(RIVERDAWN); glow(540, 1080, 600, '#FFC88A', 0.4); riverBank(t, lt * 15); ground('#3A2232', 1460);
      raja({ x: 330, y: 1500, h: 860, t, pose: 'stand', eyes: 0, dir: 1, ...KING });
      vessel(740, 1440, 0.9, '#9C5A32'); glow(740, 1320, 160, '#FFE6A0', 0.3 * seg(lt, km, km + 0.4));
      const k = eio(seg(lt, km - 0.8, km)); if (lt < km + 0.05) { const fx = lerp(470, 740, k), fy = lerp(1000, 1310, k) - Math.sin(k * Math.PI) * 240; matsya(fx, fy, 0.3, t, { glow: 0.6, rot: lerp(-0.6, 0.9, k) }); }
      if (lt > km) for (let i = 0; i < 12; i++) { const ph = seg(lt, km, km + 0.7); circle(740 + Math.cos(i) * ph * 120, 1310 - Math.abs(Math.sin(i * 1.7)) * ph * 160 + ph * ph * 120, 6, rgba('#BFE8F2', 1 - ph)); }
      slipAt(lt, km, 'कमंडल', 740, 1060, 52, 0.04); vignette(0.45);
    } });
    cue(cut_(5) + km, 'plop', { gain: 0.7 }); }

  // 6 · by morning it had outgrown the kamandal
  { const bd = W_('बड़ी', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 1150], zoom: 0.12, note: 'night turns to morning; the kamandal shakes; the fish bursts out, too big, on बड़ी', draw(lt, d, t) {
      const k = seg(lt, 0, 1.2); dawnSky(t, k, 1200); ranges([{ y: 1200, h: 220, col: '#3A2A50', seed: 5, haze: 0.2 }], 0, '#F2964A'); ground('#2A1A2A', 1460);
      const sh = lt > bd - 0.6 ? Math.sin(t * 40) * 6 * (1 - seg(lt, bd, bd + 0.2)) : 0;
      ctx.save(); ctx.translate(sh, 0); vessel(540, 1450, 1.3, '#9C5A32'); ctx.restore();
      if (lt > bd) { const p = eob(seg(lt, bd, bd + 0.35)); ctx.save(); ctx.translate(540, 1200); ctx.rotate(-0.35 + Math.sin(t * 5) * 0.08); ctx.scale(p, p); matsya(60, 0, 1.0, t, { glow: 0.4 }); ctx.restore(); for (let i = 0; i < 20; i++) { const ph = seg(lt, bd, bd + 0.8); circle(540 + Math.cos(i * 2.1) * ph * 300, 1240 - Math.abs(Math.sin(i * 1.3)) * ph * 300 + ph * ph * 200, 8, rgba('#BFE8F2', 1 - ph)); } }
      vignette(0.5);
    } });
    cue(cut_(6) + bd - 0.5, 'tock', { gain: 0.5 }); cue(cut_(6) + bd, 'slam', { gain: 0.7 }); }

  // 7 · pot, pond, Ganga... it kept growing
  { const gh = W_('घड़ा', 7), tl = W_('तालाब', 7), gg = W_('गंगा', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 960], zoom: 0.08, trans: 'whip', note: 'three quick stages: pot → pond → Ganga; the fish bigger each time; slips', draw(lt, d, t) {
      const st = lt < tl - 0.1 ? 0 : lt < gg - 0.1 ? 1 : 2;
      gradSky(NOON); glow(800, 300, 400, '#FFF6D0', 0.5); cut(P_circ(800, 300, 90), '#FFF2C0', { shadow: 0, edge: 0 });
      ranges([{ y: 1100, h: 260, col: '#5A8A9A', seed: 2, haze: 0.3 }, { y: 1220, h: 180, col: '#3A6A5A', seed: 6 }], -lt * 30, '#D8EEF2');
      if (st === 0) { ground('#6A5A3A', 1440); vessel(540, 1440, 1.6, '#A0603A'); matsya(540, 1110 + Math.sin(t * 4) * 10, 0.75, t, { rot: -0.2, glow: 0.3 }); slipAt(lt, gh, 'घड़ा', 540, 420, 64); }
      if (st === 1) { ground('#4A6A3A', 1300); cut(() => { ctx.beginPath(); ctx.ellipse(540, 1430, 470, 140, 0, 0, TAU); }, '#3A8AAA', { shadow: 0.5, edge: 4 }); matsya(540 + Math.sin(t * 2) * 60, 1410, 1.0, t, { rot: 0.05, glow: 0.3 }); slipAt(lt, tl, 'तालाब', 540, 420, 64); }
      if (st === 2) { water(t, 1150, ['#3A8AAA', '#2A6A8A'], '#FFF6D0', 0.6); matsya(lerp(300, 760, seg(lt, gg, d)), 1260, 1.6, t, { rot: -0.05, glow: 0.4 }); slipAt(lt, gg, 'गंगा', 540, 420, 64); }
      vignette(0.35);
    } });
    cue(cut_(7) + gh, 'whoosh'); cue(cut_(7) + tl, 'whoosh'); cue(cut_(7) + gg, 'whoosh'); cue(cut_(7) + gg + 0.1, 'thud', { gain: 0.6 }); }

  // 8 · in the end even the ocean was too small
  { const sm = W_('समुद्र', 8), ch = W_('छोटा', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 1100], zoom: 0.1, note: 'WOW: wide ocean, tiny king on a rock; a colossal fish rises to fill the horizon on छोटा', draw(lt, d, t) {
      gradSky([[0, '#1A3A6A'], [0.6, '#5A8AB0'], [1, '#C8DCE8']]); glow(540, 1050, 700, '#FFF0C8', 0.35);
      cloud(180, 500, 1.3, '#E8EEF4', '#FFFFFF', '#A8B8CC', 0.85); cloud(900, 420, 1.0, '#E8EEF4', '#FFFFFF', '#A8B8CC', 0.8);
      const r = eio(seg(lt, ch - 1.4, ch + 0.4)); matsya(600, lerp(1500, 1000, r), 3.4, t, { glow: 0.4 * r, horn: r });
      water(t, 1130, SEA, '#FFFFFF', 0.5);
      cut(P_poly([[40, 1720], [110, 1520], [270, 1490], [360, 1720]]), '#2A2A30', { shadow: 0.6, edge: 3 }); raja({ x: 200, y: 1510, h: 320, t, pose: 'stand', eyes: 0, dir: 1, ...KING });
      slipAt(lt, sm, 'समुद्र भी छोटा', 540, 360, 60); vignette(0.4);
    } });
    cue(cut_(8), 'swell', { dur: 2.4, gain: 0.6 }); cue(cut_(8) + ch, 'drum', { gain: 0.9 }); }

  // 9 · but the real secret was still to come
  { const rh = W_('रहस्य', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 950], zoom: 0.14, note: 'dark deep water, the fish head huge in close-up, closed eye glowing; ribbon रहस्य', draw(lt, d, t) {
      gradSky(DEEP); stars(t, 60, -200, 800, 9, 0.5); glow(640, 1000, 500, '#FFC860', 0.25 + 0.15 * Math.sin(t * 3));
      matsya(300, 1050, 3.0, t, { glow: 0.6, horn: 1 });
      mist(1350, 220, '#4A6AB0', 0.3, t, 4); ribbonAt(lt, rh, 'रहस्य', 540, 360, 100); vignette(0.65);
    } });
    cue(cut_(9), 'heartbeat', { gain: 0.6 }); cue(cut_(9) + rh, 'bell', { gain: 0.6 }); }

  // 10 · the king folded his hands: who are you?
  { const kn = W_('कौन', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 1000], zoom: 0.06, note: 'king on the shore faces the enormous fish rising from the night sea; ? on कौन', draw(lt, d, t) {
      gradSky([[0, '#0A1430'], [0.6, '#2A3A6A'], [1, '#6A7AA0']]); stars(t, 60, -200, 700, 4, 0.5); glow(760, 950, 500, '#FFD890', 0.3);
      matsya(720, 1000, 1.5, t, { glow: 0.6, rot: 0.15, dir: -1, horn: 1 });
      water(t, 1220, SEA_N, '#FFD890', 0.5); ground('#1A1A2A', 1450);
      raja({ x: 230, y: 1510, h: 820, t, pose: 'stand', eyes: 0, dir: 1, ...KING });
      qmark(lt, kn, 560, 440, 220); vignette(0.5);
    } });
    cue(cut_(10) + kn, 'tock', { gain: 0.7 }); }

  // 11 · a divine light burst from within the fish
  { const pk = W_('प्रकाश', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 950], zoom: 0.18, note: 'the fish glows from inside, god rays explode, white flash on प्रकाश', draw(lt, d, t) {
      gradSky(DEEP); const k = eio(seg(lt, 0, pk + 0.2));
      glow(540, 950, 400 + 700 * k, '#FFE6A0', 0.3 + 0.6 * k); godRays(540, 950, 0, TAU, 36, 600 + 1400 * k, '#FFF4C8', 0.15 + 0.35 * k, t);
      matsya(540, 950, 1.9, t, { glow: 0.4 + k, horn: 1 });
      flash(lt, pk, '#FFFBEA', 0.85, 0.9);
      water(t, 1350, SEA_N, '#FFF0C0', 0.7); motes(t, 60, [0, 300, W, 1500], '#FFF0C0', 0.8, 80, 6, 5); vignette(0.45);
    } });
    cue(cut_(11), 'swell', { dur: 2.2, gain: 0.6 }); cue(cut_(11) + pk, 'drum', { gain: 1.0 }); cue(cut_(11) + pk, 'conch', { dur: 1.6, gain: 0.6 }); }

  // 12 · it was Lord Vishnu himself
  { const vs = W_('विष्णु', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 950], zoom: 0.08, note: 'WOW: Vishnu seated on a giant lotus rising over the glowing ocean, chakra; ribbon भगवान विष्णु', draw(lt, d, t) {
      gradSky([[0, '#0A0A2A'], [0.5, '#2A1A5A'], [1, '#6A4A8A']]); stars(t, 100, -200, 900, 3, 0.7); godRays(540, 800, 0, TAU, 30, 1400, '#FFE6A0', 0.2, t);
      const r = eo(seg(lt, 0, 1.0)); water(t, 1380, ['#2A2A6A', '#14143A'], '#FFE6A0', 0.8);
      lotus(540, 1470 + (1 - r) * 200, 2.4, 1, '#E8899A', '#FBD3DA'); vishnu(540, 1440 + (1 - r) * 200, { s: 0.92, t, pose: 'bless', aura: r, chakra: 1, shankha: 1 });
      ribbonAt(lt, vs, 'भगवान विष्णु', 540, 290, 96); motes(t, 50, [0, 200, W, 1400], '#FFE6A0', 0.7, 50, 8, 4); vignette(0.45);
    } });
    cue(cut_(12), 'bell', { gain: 0.9 }); cue(cut_(12) + vs, 'conch', { dur: 2.0, gain: 0.7 }); cue(cut_(12) + vs, 'drum', { gain: 0.6 }); }

  // 13 · in seven days the pralaya will come
  { const st = W_('सात', 13), pr = W_('प्रलय', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 950], zoom: 0.1, note: 'Vishnu glowing up high; storm clouds roll in fast; ribbon 7 दिन; red pulse on प्रलय', draw(lt, d, t) {
      const k = seg(lt, 0, d); gradSky([[0, '#0A0A16'], [0.6, '#2A2236'], [1, '#4A3A4A']]);
      glow(540, 560, 400, '#FFE6A0', 0.35 * (1 - k * 0.6)); ctx.save(); ctx.globalAlpha = 1 - k * 0.5; vishnu(540, 860, { s: 0.45, t, pose: 'raise', aura: 1, chakra: 1 }); ctx.restore();
      for (let i = 0; i < 6; i++) cloud(lerp(-300, 180, k) + (i % 3) * 360, 300 + (i > 2 ? 260 : 0) + lerp(-200, 0, k), 1.3, '#2A2E3A', '#4A4E5A', '#14161E', 0.6 + 0.3 * k);
      water(t * 1.6, 1250, SEA_S, '#A8B8CC', 0.4);
      ribbonAt(lt, st, '7 दिन', 540, 1080, 120);
      if (lt > pr) glow(540, 900, 900, '#C8302A', 0.3 * Math.abs(Math.sin((lt - pr) * 4)));
      vignette(0.6);
    } });
    cue(cut_(13) + st, 'tock', { gain: 0.8 }); cue(cut_(13) + pr, 'drum', { gain: 0.9 }); }

  // 14 · a boat will come: the seven sages, seeds and creatures
  { const nv = W_('नाव', 14), sr = W_('सप्तऋषि', 14), jv = W_('जीव', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 1000], zoom: 0.06, note: 'dusky shore: a wooden boat glides in; sages appear (slip सप्तऋषि), seed sparkles, a cow on जीव', draw(lt, d, t) {
      gradSky([[0, '#1A1A30'], [0.55, '#5A3A4A'], [1, '#B06A4A']]); glow(540, 1150, 600, '#F2964A', 0.3);
      ranges([{ y: 1150, h: 240, col: '#3A2A3A', seed: 4, haze: 0.2 }], -lt * 20, '#C87A5A');
      water(t, 1260, ['#5A3A4A', '#2A1A2A'], '#FFC88A', 0.5);
      naav(lerp(1350, 560, eo(seg(lt, 0, nv + 0.8))), 1380 + Math.sin(t * 2) * 6, 1.2, t, { rot: Math.sin(t * 1.3) * 0.02, sages: lt > sr ? Math.min(7, 1 + Math.floor((lt - sr) * 8)) : 0, lamp: 1 });
      if (lt > jv - 0.1) { const k = eo(seg(lt, jv - 0.1, jv + 0.6)); cow(lerp(-150, 170, k), 1560, 0.6, 1); }
      if (lt > sr + 0.6) for (let i = 0; i < 24; i++) { const ph = (t * 0.6 + rnd(i)) % 1; circle(380 + rnd(i + 2) * 360, 1300 - ph * 300, 5, rgba('#FFE6A0', 0.8 * (1 - ph))); }
      slipAt(lt, sr, 'सप्तऋषि', 540, 380, 60); slipAt(lt, jv, 'बीज और जीव', 540, 520, 50, 0.03); vignette(0.5);
    } });
    cue(cut_(14) + nv, 'whoosh'); cue(cut_(14) + sr, 'bell', { gain: 0.6 }); cue(cut_(14) + jv, 'pop', { gain: 0.5 }); }

  // 15 · on the seventh day the sky burst
  { const as = W_('आसमान', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 950], zoom: 0.12, note: 'WOW: black storm, lightning splits the sky on आसमान, rain sheets, the sea rises', draw(lt, d, t) {
      gradSky(STORM); for (let i = 0; i < 5; i++) cloud(i * 260 - 60 + Math.sin(t * 0.5 + i) * 30, 260 + (i % 2) * 120, 1.5, '#1E2430', '#3A4250', '#0C0E14', 0.9);
      if (lt < as - 0.1) { const fk = Math.max(0, Math.sin(lt * 5.3) - 0.6) * 2.5; lightning(820, 150, 700, t, 0.5 * fk, 11); lightning(220, 200, 600, t, 0.4 * Math.max(0, Math.sin(lt * 3.7 + 2) - 0.7) * 3, 5); glow(540, 400, 700, '#8FA8E0', 0.15 + 0.2 * fk); }
      if (lt > as - 0.05) { const fl = 1 - seg(lt, as, as + 0.5); lightning(540, 200, 1300, t, fl, 7); lightning(250, 300, 900, t, fl * 0.6, 3); flash(lt, as, '#DDE8FF', 0.5, 0.5); }
      rain(t, 0.4 + 0.6 * seg(lt, as - 0.3, as + 0.5));
      water(t * 2.2, lerp(1350, 1150, seg(lt, as, d)), SEA_S, '#A8B8CC', 0.5); vignette(0.6);
    } });
    cue(cut_(15), 'swell', { dur: 1.6, gain: 0.6 }); cue(cut_(15) + as, 'slam', { gain: 1.0 }); cue(cut_(15) + as + 0.05, 'drum', { gain: 1.0 }); }

  // 16 · only water and darkness everywhere
  { const ad = W_('अँधेरा', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 1100], zoom: 0.08, note: 'endless black sea, tiny lamp-lit boat tossing in rain; the lamp flickers on अँधेरा', draw(lt, d, t) {
      gradSky([[0, '#020306'], [0.6, '#0A0E16'], [1, '#141C26']]); lightning(900, 100, 600, t, 0.25 * Math.max(0, Math.sin(t * 1.3) - 0.8) * 5, 9); rain(t, 0.7);
      water(t * 2, 1050, ['#141C26', '#0A0E16'], '#5A6A80', 0.3);
      naav(540, 1190 + Math.sin(t * 2.4) * 30, 0.5, t, { rot: Math.sin(t * 2.4) * 0.12, lamp: lt > ad ? 0.4 + 0.3 * Math.sin(t * 20) : 1, sages: 7 });
      water(t * 2.4, 1300, ['#0E141C', '#06080C'], '#3A4A60', 0.2); vignette(0.75);
    } });
    cue(cut_(16), 'whoosh', { gain: 0.5 }); cue(cut_(16) + ad, 'heartbeat', { gain: 0.8 }); }

  // 17 · then from the waves rose a golden horned Matsya
  { const mt = W_('मत्स्य', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 950], zoom: 0.1, note: 'WOW: huge golden one-horned fish leaps out of the dark waves, blaze and spray; ribbon मत्स्य अवतार', draw(lt, d, t) {
      gradSky(STORM); rain(t, 0.4); const r = eob(seg(lt, 0.2, mt + 0.2));
      glow(540, 900, 300 + 700 * r, '#FFC860', 0.5 * r); godRays(540, 900, 0, TAU, 28, 1500 * r + 1, '#FFE6A0', 0.25 * r, t);
      matsya(540, lerp(1600, 900, r), 2.3, t, { glow: 1, horn: 1, rot: lerp(-0.6, -0.15, r) });
      for (let i = 0; i < 40; i++) { const ph = seg(lt, 0.4, 1.6); const a = -Math.PI / 2 + (rnd(i) - 0.5) * 2.2; circle(540 + Math.cos(a) * ph * 520, 1250 + Math.sin(a) * ph * 420 + ph * ph * 400, 8 * (1 - ph) + 2, rgba('#DDF0FF', 1 - ph)); }
      water(t * 2, 1250, SEA_S, '#FFD890', 0.6); ribbonAt(lt, mt, 'मत्स्य अवतार', 540, 300, 96); vignette(0.5);
    } });
    cue(cut_(17), 'whoosh'); cue(cut_(17) + 0.5, 'slam', { gain: 0.8 }); cue(cut_(17) + mt, 'conch', { dur: 2.0, gain: 0.7 }); cue(cut_(17) + mt, 'bell', { gain: 0.8 }); }

  // 18 · with Vasuki as the rope the boat was tied to the horn
  { const rs = W_('रस्सी', 18), sg = W_('सींग', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 950], zoom: 0.06, note: 'the serpent Vasuki stretches as a glowing green rope from the boat to the golden horn; knot sparkles on सींग', draw(lt, d, t) {
      gradSky(STORM); rain(t, 0.3); glow(780, 760, 500, '#FFC860', 0.35);
      const fx = 760, fy = 900, fs = 1.5, fr = -0.2; matsya(fx, fy, fs, t, { glow: 0.8, horn: 1, rot: fr });
      const hx = fx + (250 * Math.cos(fr) + 210 * Math.sin(fr)) * fs, hy = fy + (250 * Math.sin(fr) - 210 * Math.cos(fr)) * fs;
      water(t * 2, 1250, SEA_S, '#FFD890', 0.5);
      naav(290, 1290 + Math.sin(t * 2) * 10, 0.7, t, { rot: Math.sin(t * 1.6) * 0.05, sages: 7, lamp: 1 });
      const p = eio(seg(lt, 0, sg)); const pts = []; for (let i = 0; i <= 30; i++) { const u = i / 30; pts.push([lerp(420, hx, u), lerp(1250, hy, u) - Math.sin(u * Math.PI) * 160 + Math.sin(u * 18 - t * 6) * 10]); }
      const n = Math.max(2, Math.round(p * 31)); luminous(pts.slice(0, n), 16, t, ROPE);
      const e = pts[n - 1]; circle(e[0], e[1], 20, '#3E8E5A'); circle(e[0] + 7, e[1] - 5, 4, '#0A1A10');
      if (lt > sg) glow(hx, hy, 160, '#FFF4C8', 0.8 * (1 - seg(lt, sg, sg + 0.8)));
      slipAt(lt, Math.min(rs, 0.4), 'वासुकि नाग', 300, 420, 54); vignette(0.5);
    } });
    cue(cut_(18) + 0.2, 'sizzle', { gain: 0.4 }); cue(cut_(18) + sg, 'thud', { gain: 0.8 }); cue(cut_(18) + sg + 0.05, 'sparkle', { dur: 1.0, gain: 0.5 }); }

  // 19 · Matsya carried creation across the pralaya
  { const pr = W_('पार', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 950], zoom: 0.08, note: 'the fish tows the boat across the storm (parallax clouds); clouds part to gold on पार', draw(lt, d, t) {
      const k = seg(lt, pr - 0.6, d); gradSky([[0, '#05070C'], [0.5, '#1A1E2A'], [1, '#3A3440']]); glow(540, 1000, 800 * k + 1, '#FFB060', 0.6 * k);
      for (let i = 0; i < 5; i++) cloud(((i * 300 - lt * 140) % 1500 + 1500) % 1500 - 200, 300 + (i % 2) * 140 - k * 200, 1.3, '#1E2430', '#3A4250', '#0C0E14', 0.9 * (1 - k * 0.6));
      water(t * 1.4 - lt, 1200, k > 0.5 ? ['#5A3A40', '#2A1A24'] : SEA_S, '#FFD890', 0.5);
      const fx = 720, fy = 1120, fs = 1.3, fr = -0.05; matsya(fx, fy, fs, t, { glow: 0.8, horn: 1, rot: fr });
      const hx = fx + (250 * Math.cos(fr) + 210 * Math.sin(fr)) * fs, hy = fy + (250 * Math.sin(fr) - 210 * Math.cos(fr)) * fs;
      luminous([[440, 1250], [560, 1180], [hx - 80, hy + 20], [hx, hy]], 10, t, ROPE);
      naav(320, 1290 + Math.sin(t * 2) * 8, 0.6, t, { rot: Math.sin(t * 1.4) * 0.03, sages: 7, lamp: 1 });
      for (let i = 0; i < 30; i++) { const ph = (t * 1.2 + rnd(i)) % 1; circle(1000 - ph * 1100, 1220 + rnd(i) * 80, 4, rgba('#DDF0FF', 0.6 * (1 - ph))); }
      ribbonAt(lt, pr, 'प्रलय के पार', 540, 340, 90); vignette(0.5);
    } });
    cue(cut_(19), 'whoosh'); cue(cut_(19) + pr, 'swell', { dur: 1.8, gain: 0.6 }); cue(cut_(19) + pr + 0.5, 'bell', { gain: 0.7 }); }

  // 20 · that king became Manu... and from him, us: manushya
  { const mn = W_('मनु', 20), ms = W_('मनुष्य', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 1000], zoom: 0.08, note: 'golden dawn on a new land; Manu stands, ribbon मनु; people silhouettes rise behind him on मनुष्य', draw(lt, d, t) {
      dawnSky(t, 1, 1150, 5); godRays(540, 1150, Math.PI, TAU, 18, 1300, '#FFE6A0', 0.22, t);
      ranges([{ y: 1250, h: 240, col: '#5A2E4A', seed: 8, haze: 0.25 }, { y: 1400, h: 160, col: '#2A1430', seed: 2 }], 0, '#F2964A');
      if (lt > ms - 0.1) { const k = eo(seg(lt, ms - 0.1, ms + 0.8)); for (let i = 0; i < 8; i++) { const x = 90 + i * 130; if (Math.abs(x - 540) < 170) continue; const hh = 60 * rnd(i); ctx.save(); ctx.globalAlpha = k * (0.6 + 0.4 * rnd(i)); cut(P_circ(x, 1250 - hh + (1 - k) * 80, 30), '#2A1430', { shadow: 0, edge: 0 }); cut(P_poly([[x - 45, 1520], [x, 1280 - hh + (1 - k) * 80], [x + 45, 1520]]), '#2A1430', { shadow: 0, edge: 0 }); ctx.restore(); } }
      ground('#2A1430', 1500);
      glow(540, 950, 360, '#FFE6A0', 0.3); raja({ x: 540, y: 1530, h: 900, t, pose: 'stand', eyes: 0, dir: 1, robe: '#F6E6C8', sash: '#D8A030' });
      ribbonAt(lt, mn, 'मनु', 540, 330, 110); ribbonAt(lt, ms, 'मनुष्य', 540, 500, 100); vignette(0.45);
    } });
    cue(cut_(20) + mn, 'bell', { gain: 0.8 }); cue(cut_(20) + ms, 'drum', { gain: 0.7 }); cue(cut_(20) + ms, 'conch', { dur: 1.6, gain: 0.5 }); }

  // 21 · LOOP: we were all saved by that tiny fish
  { const bc = W_('बचाए', 21);
    add({ id: 'S22', at: cut_(21), cam: [540, 1000], zoom: 0.16, note: 'loop: cupped hands at sunrise again, the tiny golden fish glows; slip हम सब', draw(lt, d, t) {
      gradSky(RIVERDAWN); glow(540, 900, 700, '#FFC88A', 0.55); water(t, 1150, ['#B0587A', '#6A3A62'], '#FFE0B0', 0.7);
      cuppedHands(540, 1060, 1.2, t, '#C88A5A'); ell(540, 1050, 210, 50, rgba('#BFE8F2', 0.7));
      matsya(540 + Math.sin(t * 3) * 30, 1040, 0.32, t, { glow: 1, dir: Math.cos(t * 3) > 0 ? 1 : -1 }); glow(540, 1040, 240, '#FFE6A0', 0.4 + 0.3 * seg(lt, bc, bc + 0.5));
      slipAt(lt, 0.3, 'हम सब', 540, 420, 64); motes(t, 40, [100, 300, 980, 1350], '#FFE6B0', 0.7, 30, 5, 4); vignette(0.5);
    } });
    cue(cut_(21), 'sparkle', { dur: 1.2, gain: 0.5 }); cue(cut_(21) + bc, 'bell', { gain: 0.7 }); }

  // 22-23 · end card
  { const st = cut_(22), f = Wd('फ़ॉलो', 23) - st;
    add({ id: 'S23', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: dawn ocean, golden fish arcs, Untold Stories in gold', draw(lt, d, t) {
      dawnSky(t, 1, 1250, 7); glow(540, 1250, 600, '#FFB040', 0.4);
      const a = lerp(-0.4, 0.4, seg(lt, 0, d)); matsya(540 + Math.sin(a) * 260, 1120 - Math.cos(a) * 140, 1.1, t, { rot: a * 0.8, glow: 0.8, horn: 1 });
      water(t, 1280, SEA_D, '#FFE6A0', 0.6);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 440, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 590, 80, '#FFD2B8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 740, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
