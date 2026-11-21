// गोवर्धन पर्वत को श्राप किसने दिया? Pulastya's curse on Govardhan — cinematic cut paper: Braj amber dusk, Shalmali teal ocean, indigo flight, curse red, monsoon slate, parikrama night, sunrise.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, cloud, motes, water, diya, skyline, birds, vignette, dawnSky } from './atmos.js';
import { rishi, giri, krishna, cow } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const BRAJ = [[0, '#2A1838'], [0.4, '#6A2E4A'], [0.7, '#C8603A'], [0.85, '#F0A050'], [1, '#F6C878']];
const OCEAN = [[0, '#06202A'], [0.45, '#0E4A56'], [0.8, '#2A7A78'], [1, '#7AB8A0']];
const NIGHT = [[0, '#060820'], [0.5, '#151A48'], [0.85, '#2E2A64'], [1, '#4A3870']];
const CURSE = [[0, '#12040A'], [0.5, '#4A0E18'], [0.85, '#9A2A1A'], [1, '#D4602A']];
const STORM = [[0, '#0E141E'], [0.5, '#24344A'], [0.85, '#3E5268'], [1, '#5A6E80']];
const KASHI = [[0, '#1A1A40'], [0.45, '#5A3A6A'], [0.75, '#D88A5A'], [1, '#F6D0A0']];
const GOV = ['#3E5A2E', '#557A3A', '#7FA052'];
const DRONA = ['#2E4A44', '#3E6256', '#5A806A'];

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function ribbonAt(lt, w, text, x, y, size = 100) { if (lt > w - 0.12) K.ribbon(text, x, y, eob(seg(lt, w - 0.12, w + 0.22)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.45)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
/** Braj at golden dusk: low sun, soft fields, the Yamuna */
function braj(t, px = 0, sun = 1) {
  gradSky(BRAJ); paperGrain(0.05, 3);
  if (sun) { glow(760, 1080, 520, '#FFB860', 0.5); cut(P_circ(760, 1080, 110), '#FFD890', { shadow: 0, edge: 0 }); }
  birds(t, 120, 520, 5, '#3A1A2A', 0.9);
  ranges([{ y: 1240, h: 90, col: '#7A4A3A', seed: 4, haze: 0.25 }], px * 0.3, '#F0A060');
  ground('#5A6A2E', 1330);
  cut(() => { ctx.beginPath(); ctx.moveTo(-100, 1500); ctx.quadraticCurveTo(400, 1440, 700, 1480); ctx.quadraticCurveTo(950, 1520, 1200, 1470); ctx.lineTo(1200, 1530); ctx.quadraticCurveTo(900, 1580, 640, 1540); ctx.quadraticCurveTo(380, 1500, -100, 1560); ctx.closePath(); }, '#4A7AA0', { shadow: 0.3, edge: 2 });
}
/** a single sesame seed (til) */
function til(x, y, s, a = 1, rot = 0.4) { ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); glow(0, 0, 50, '#FFF2C0', 0.5); cut(() => { ctx.beginPath(); ctx.moveTo(0, -26); ctx.quadraticCurveTo(16, -4, 0, 22); ctx.quadraticCurveTo(-16, -4, 0, -26); ctx.closePath(); }, '#F2E6C8', { shadow: 0.4, edge: 2 }); ctx.restore(); }
function ocean(t) {
  gradSky(OCEAN); stars(t, 60, -200, 500, 7, 0.6); paperGrain(0.05, 8);
  glow(300, 520, 300, '#E6FFF0', 0.3); cut(P_circ(300, 520, 70), '#EAF8F0', { shadow: 0, edge: 0 });
  water(t, 1330, ['#1E5A66', '#0E3A46'], '#CFF4E6', 0.5);
}
function night(t, px = 0) { gradSky(NIGHT); stars(t, 160, -200, 1200, 5); paperGrain(0.05, 9); glow(860, 360, 300, '#F4F0FF', 0.35); cut(P_circ(860, 360, 70), '#F6F4FF', { shadow: 0, edge: 0 }); for (const [cx, cy, s] of [[200 - px, 900, 1.2], [700 - px * 1.4, 1400, 1.5], [1100 - px, 700, 1]]) cloud(cx, cy, s, '#3A3A70', '#5A5A90', '#24244E', 0.8); }
function people(x, y, n, col, s = 1) { for (let i = 0; i < n; i++) { const px = x + i * 60 * s, h = (90 + rnd(i * 7) * 30) * s; cut(() => { ctx.beginPath(); ctx.ellipse(px, y - h, 14 * s, 16 * s, 0, 0, TAU); ctx.moveTo(px - 22 * s, y); ctx.quadraticCurveTo(px - 20 * s, y - h + 20 * s, px, y - h + 18 * s); ctx.quadraticCurveTo(px + 20 * s, y - h + 20 * s, px + 22 * s, y); ctx.closePath(); }, col, { shadow: 0.3, edge: 0 }); } }
function rain(t, a = 1) { ctx.save(); ctx.strokeStyle = `rgba(200,220,240,${0.45 * a})`; ctx.lineWidth = 3; for (let i = 0; i < 140; i++) { const x = (rnd(i) * 1300 + t * 120) % 1300 - 100, y = (rnd(i + 50) * 2100 + t * 1400) % 2100 - 100; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 14, y + 46); ctx.stroke(); } ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · every day a whole mountain shrinks by a sesame seed
  { const tl = W_('तिल', 0), ch = W_('छोटा', 0);
    add({ id: 'S01', at: 0, cam: [540, 1100], zoom: 0.12, note: 'Govardhan at Braj dusk; a glowing sesame seed drifts down on तिल and the hill sinks a little on छोटा; ribbon तिल भर', draw(lt, d, t) {
      braj(t, lt * 6); const sh = eio(seg(lt, ch - 0.1, ch + 0.8));
      giri(540, 1360, { s: 1.15 - 0.08 * sh, t, col: GOV, seed: 3 });
      if (lt > tl - 0.4) til(540 + Math.sin(lt * 2) * 40, lerp(300, 820, eo(seg(lt, tl - 0.4, tl + 0.8))), 1.4, 1 - 0.7 * sh);
      ribbonAt(lt, tl, 'तिल भर', 540, 300, 96);
      mist(1340, 120, '#F0B080', 0.2, t, 1); vignette(0.5);
    } });
    cue(0, 'swell', { dur: 3, gain: 0.45 }); cue(tl, 'bell', { gain: 0.6 }); cue(ch, 'thud', { gain: 0.5 }); }

  // 1 · not an earthquake... a curse
  { const st = cut_(1), bk = W_('भूकंप', 1), sr = W_('श्राप', 1);
    add({ id: 'S02', at: st, cam: [540, 1000], zoom: 0.1, note: 'the hill trembles on भूकंप then stills; the sky turns curse-red with a glowing ring on श्राप', draw(lt, d, t) {
      const r = eo(seg(lt, sr - 0.3, sr + 0.4));
      gradSky(BRAJ); ctx.save(); ctx.globalAlpha = r; gradSky(CURSE); ctx.restore(); paperGrain(0.05, 4);
      ground('#4A4A26', 1330);
      const shake = lt > bk - 0.1 && lt < sr - 0.3 ? 1 - seg(lt, bk, sr - 0.3) : 0;
      giri(540, 1360, { s: 1.1, t, col: GOV, seed: 3, shake });
      if (r > 0) { ctx.save(); ctx.globalAlpha = r; ctx.strokeStyle = '#FFB070'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(540, 820, 260 + 20 * Math.sin(t * 3), 0, TAU); ctx.stroke(); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(540, 820, 300, 0, TAU); ctx.stroke(); glow(540, 820, 400, '#FF6A3A', 0.35); ctx.restore(); }
      slipAt(lt, sr, 'श्राप', 540, 420, 70); vignette(0.6);
    } });
    cue(st + bk, 'thud', { gain: 0.7 }); cue(st + sr, 'slam', { gain: 0.5 }); }

  // 2 · this is Govardhan, which Krishna lifted
  { const st = cut_(2), gv = W_('गोवर्धन', 2), kr = W_('कृष्ण', 2);
    add({ id: 'S03', at: st, cam: [540, 1000], zoom: 0.08, note: 'name card गोवर्धन over the hill; on कृष्ण the hill rises onto the finger of a glowing Krishna', draw(lt, d, t) {
      braj(t, 0); const k = eo(seg(lt, kr - 0.2, kr + 0.6));
      let tip = [540, 900]; if (k > 0) { ctx.save(); ctx.globalAlpha = k; tip = krishna(540, 1500, { s: 0.6, t, pose: 'lift', aura: 0.8 }); ctx.restore(); }
      giri(lerp(540, tip[0], k), lerp(1360, tip[1] + 14, k), { s: 1.0 - 0.45 * k, t, col: GOV, seed: 3, glowA: k * 0.6 });
      ribbonAt(lt, gv, 'गोवर्धन', 540, 300, 104); vignette(0.5);
    } });
    cue(st + gv, 'bell', { gain: 0.7 }); cue(st + kr, 'conch', { dur: 1.6, gain: 0.4 }); }

  // 3 · but this mountain was not from Braj at all
  { const st = cut_(3), bj = W_('ब्रज', 3), nh = W_('नहीं', 3);
    add({ id: 'S04', at: st, cam: [540, 1050], zoom: 0.08, note: 'empty Braj plain; a dashed outline where the hill stands; slip ब्रज, then a big ? on नहीं', draw(lt, d, t) {
      braj(t, 0);
      ctx.save(); ctx.setLineDash([22, 16]); ctx.strokeStyle = '#FCE7B0'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(140, 1360); ctx.quadraticCurveTo(540, 700, 940, 1360); ctx.stroke(); ctx.restore();
      cow(260, 1420, 0.8, 1); cow(840, 1440, 0.7, -1);
      slipAt(lt, bj, 'ब्रज', 540, 560, 64);
      if (lt > nh - 0.1) { const p = eob(seg(lt, nh - 0.1, nh + 0.25)); ctx.save(); ctx.translate(540, 1050); ctx.scale(p, p); glow(0, 0, 200, '#FF6A3A', 0.4); bigText('?', 0, 10, 260, '#FCE7B0'); ctx.restore(); }
      vignette(0.5);
    } });
    cue(st + nh, 'tock', { gain: 0.8 }); }

  // 4 · he was the son of Drona, far away on Shalmali island
  { const st = cut_(4), dr = W_('द्रोण', 4), sm = W_('शाल्मली', 4);
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.1, note: 'teal ocean night: a huge mountain Drona with waterfalls, little Govardhan beside him; slips द्रोण and शाल्मली द्वीप', draw(lt, d, t) {
      ocean(t);
      cut(() => { ctx.beginPath(); ctx.ellipse(540, 1350, 640, 120, 0, Math.PI, 0); ctx.closePath(); }, '#2E4A3A', { shadow: 0.6, edge: 3 });
      giri(400, 1330, { s: 1.6, t, col: DRONA, seed: 9, falls: 1 });
      giri(860, 1340, { s: 0.6, t, col: GOV, seed: 3, glowA: 0.5 });
      slipAt(lt, dr, 'द्रोण', 400, 360, 64, -0.04); slipAt(lt, sm, 'शाल्मली द्वीप', 720, 560, 54, 0.03);
      mist(1300, 120, '#9FE0D0', 0.2, t, 3); vignette(0.5);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + dr, 'drum', { gain: 0.5 }); }

  // 5 · one day the sage Pulastya came
  { const st = cut_(5), pl = W_('पुलस्त्य', 5);
    add({ id: 'S06', at: st, cam: [540, 1050], zoom: 0.07, note: 'the sage walks in from the left along the shore; his halo glows on पुलस्त्य; the two mountains behind', draw(lt, d, t) {
      ocean(t);
      cut(() => { ctx.beginPath(); ctx.ellipse(540, 1450, 760, 150, 0, Math.PI, 0); ctx.closePath(); }, '#2E4A3A', { shadow: 0.6, edge: 3 });
      giri(800, 1380, { s: 1.2, t, col: DRONA, seed: 9, falls: 1 }); giri(1000, 1400, { s: 0.42, t, col: GOV, seed: 3 });
      const a = eo(seg(lt, pl - 0.2, pl + 0.5));
      rishi(lerp(-120, 330, eo(seg(lt, 0, 1.6))), 1500, { s: 0.85, t, pose: lt < 1.6 ? 'walk' : 'stand', aura: a });
      slipAt(lt, pl, 'महर्षि पुलस्त्य', 540, 380, 58); vignette(0.5);
    } });
    cue(st + pl, 'conch', { dur: 1.6, gain: 0.4 }); }

  // 6 · he wanted this very mountain for tapas in Kashi
  { const st = cut_(6), ks = W_('काशी', 6), pv = W_('पर्वत', 6);
    add({ id: 'S07', at: st, cam: [540, 950], zoom: 0.08, note: 'Kashi ghats at dawn; on पर्वत the hill appears as a vision beside the temples; ribbon काशी', draw(lt, d, t) {
      gradSky(KASHI); paperGrain(0.05, 12); glow(540, 900, 520, '#FFD8A0', 0.35);
      const p = eob(seg(lt, pv - 0.1, pv + 0.4)); if (p > 0) { ctx.save(); ctx.globalAlpha = clamp(p); giri(860, 1210, { s: 0.6 * p, t, col: GOV, seed: 3, glowA: 0.8 }); ctx.restore(); }
      skyline(1200, '#3A2440', 0.9, 480);
      for (let i = 0; i < 5; i++) cut(P_rr(-300, 1200 + i * 34, W + 600, 36, 0), i % 2 ? '#5A3A4E' : '#6A4A5A', { shadow: 0.3, edge: 2 });
      water(t, 1370, ['#6A5A8A', '#4A3A6A'], '#FFE2B0', 0.5);
      ribbonAt(lt, ks, 'काशी', 540, 360, 110);
      motes(t, 30, [0, 300, W, 1300], '#FFE2B0', 0.5, 25, 4, 3); vignette(0.5);
    } });
    cue(st + ks, 'bell', { gain: 0.8 }); }

  // 7 · father Drona wept... but who refuses a sage?
  { const st = cut_(7), ro = W_('रो', 7), mn = W_('मना', 7);
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.1, note: 'Drona the great mountain: his waterfalls swell like tears on रो; the small sage stands before him, palms joined; a ? on मना', draw(lt, d, t) {
      ocean(t); const tr = eo(seg(lt, ro - 0.2, ro + 0.6));
      giri(440, 1380, { s: 1.9, t, col: DRONA, seed: 9, falls: 0.4 + 0.6 * tr });
      for (let i = 0; i < 6; i++) { const y = 800 + ((t * 260 + i * 120) % 560); circle(360 + (i % 2) * 160, y, 10 * tr, `rgba(220,240,255,${0.8 * tr})`); }
      rishi(860, 1500, { s: 0.6, t, pose: 'namaste', aura: 0.5, dir: -1 });
      if (lt > mn - 0.1) { const p = eob(seg(lt, mn - 0.1, mn + 0.25)); ctx.save(); ctx.translate(860, 680); ctx.scale(p, p); glow(0, 0, 140, A.gold, 0.4); bigText('?', 0, 10, 180, '#FCE7B0'); ctx.restore(); }
      vignette(0.6);
    } });
    cue(st + ro, 'heartbeat', { gain: 0.4 }); cue(st + mn, 'tock'); }

  // 8 · Govardhan's condition: where you set me down, there I stay
  { const st = cut_(8), sh = W_('शर्त', 8), wh = W_('वहीं', 8);
    add({ id: 'S09', at: st, cam: [540, 1000], zoom: 0.08, note: 'close on little Govardhan glowing; slip शर्त; on वहीं a golden ring stamps the ground under him + slip वहीं रहूँगा', draw(lt, d, t) {
      ocean(t); ground('#2E4A3A', 1400);
      giri(540, 1420, { s: 1.15, t, col: GOV, seed: 3, glowA: 0.4 + 0.3 * Math.sin(t * 2) });
      slipAt(lt, sh, 'शर्त', 540, 400, 70);
      if (lt > wh - 0.1) { const p = eob(seg(lt, wh - 0.1, wh + 0.3)); ctx.save(); ctx.translate(540, 1440); ctx.scale(p, p * 0.2); ctx.strokeStyle = '#FCE7B0'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 480, 0, TAU); ctx.stroke(); ctx.restore(); glow(540, 1430, 400, '#FFE2A0', 0.4 * p); slipAt(lt, wh, 'वहीं रहूँगा', 540, 600, 54, 0.03); }
      vignette(0.5);
    } });
    cue(st + sh, 'tock'); cue(st + wh, 'thud', { gain: 0.7 }); }

  // 9 · the sage agreed and lifted the mountain on his palm
  { const st = cut_(9), ht = W_('हथेली', 9);
    add({ id: 'S10', at: st, cam: [540, 1000], zoom: 0.08, note: 'the sage raises his right palm; the hill lifts off the ground and settles on his palm on हथेली', draw(lt, d, t) {
      ocean(t); ground('#2E4A3A', 1460);
      const up = eio(seg(lt, ht - 0.8, ht + 0.2));
      const hand = rishi(380, 1540, { s: 0.85, t, pose: 'carry', aura: 0.6 });
      giri(lerp(800, hand[0], up), lerp(1470, hand[1] - 6, up), { s: lerp(0.7, 0.42, up), t, col: GOV, seed: 3, glowA: 0.3 + 0.5 * up });
      if (up > 0.95) glow(hand[0], hand[1] - 60, 200, '#FFE2A0', 0.4);
      slipAt(lt, ht, 'हथेली पर', 780, 420, 58); vignette(0.5);
    } });
    cue(st + ht - 0.6, 'swell', { dur: 0.8, gain: 0.4 }); cue(st + ht, 'bell', { gain: 0.6 }); }

  // 10 · but the real twist was still to come
  { const st = cut_(10), md = W_('मोड़', 10);
    add({ id: 'S11', at: st, cam: [540, 1000], zoom: 0.12, note: 'night flight: the sage glides across a starry sky carrying the hill; clouds slide; slip असली मोड़...', draw(lt, d, t) {
      night(t, lt * 60);
      const x = lerp(260, 760, lt / Math.max(1, d));
      ctx.save(); ctx.translate(x, 1330 + Math.sin(lt * 2) * 20);
      const hand = rishi(0, 0, { s: 0.6, t, pose: 'carry', aura: 0.5 }); giri(hand[0], hand[1] - 4, { s: 0.3, t, col: GOV, seed: 3, glowA: 0.5 }); ctx.restore();
      slipAt(lt, md, 'असली मोड़...', 540, 480, 62); vignette(0.6);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + md, 'heartbeat', { gain: 0.45 }); }

  // 11 · over Braj, Govardhan remembered: Krishna will come here
  { const st = cut_(11), bj = W_('ब्रज', 11), kr = W_('कृष्ण', 11);
    add({ id: 'S12', at: st, cam: [540, 1050], zoom: 0.08, note: 'Braj at dusk: the Yamuna, cows; the carried hill above glows; on कृष्ण a flute-playing Krishna appears as a gentle vision; slip ब्रज', draw(lt, d, t) {
      braj(t, 0); cow(180, 1450, 0.7, 1); cow(900, 1460, 0.65, -1);
      const k = eo(seg(lt, kr - 0.3, kr + 0.6));
      if (k > 0) { ctx.save(); ctx.globalAlpha = 0.9 * k; krishna(540, 1440, { s: 0.6, t, pose: 'flute', aura: 1 }); ctx.restore(); }
      { const fx = lerp(120, 380, lt / Math.max(1, d)); const hd = rishi(fx, 900, { s: 0.42, t, pose: 'carry', aura: 0.4 }); giri(hd[0], hd[1] - 3, { s: 0.22, t, col: GOV, seed: 3, glowA: 0.5 + 0.5 * k }); }
      slipAt(lt, bj, 'ब्रज', 220, 360, 62, -0.04);
      motes(t, 30, [0, 300, W, 1400], '#FFE2B0', 0.5 * k, 25, 6, 3); vignette(0.5);
    } });
    cue(st + bj, 'tock'); cue(st + kr, 'conch', { dur: 1.8, gain: 0.4 }); }

  // 12 · and the mountain... began to grow heavy
  { const st = cut_(12), bh = W_('भारी', 12);
    add({ id: 'S13', at: st, cam: [540, 1000], zoom: 0.1, note: 'the hill swells and glows gold on भारी; the sage strains, sinking lower; pressure rings', draw(lt, d, t) {
      braj(t, 0, 0); const h = eio(seg(lt, bh - 0.3, bh + 0.8));
      const hand = rishi(420, 1500 + 30 * h, { s: 0.8, t, pose: h > 0.4 ? 'strain' : 'carry', aura: 0.3 });
      giri(hand[0], hand[1] - 6, { s: 0.4 + 0.16 * h, t, col: GOV, seed: 3, glowA: 0.5 + h });
      for (let i = 0; i < 3; i++) { const r = ((lt * 0.8 + i / 3) % 1); ctx.strokeStyle = `rgba(255,226,160,${0.5 * h * (1 - r)})`; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(hand[0], hand[1] - 120, 160 + r * 260, 0, TAU); ctx.stroke(); }
      slipAt(lt, bh, 'भारी', 860, 360, 70, 0.04); vignette(0.55);
    } });
    cue(st + bh, 'drum', { gain: 0.6 }); }

  // 13 · the sage set it down for a moment
  { const st = cut_(13), nc = W_('नीचे', 13);
    add({ id: 'S14', at: st, cam: [540, 1050], zoom: 0.07, note: 'the hill descends from the sage\'s palm and settles on the Braj plain with a dust puff on नीचे', draw(lt, d, t) {
      braj(t, 0); const dn = eio(seg(lt, nc - 0.8, nc + 0.1));
      const hand = rishi(260, 1520, { s: 0.75, t, pose: dn < 0.5 ? 'carry' : 'stand', aura: 0.3 });
      giri(lerp(hand[0], 720, dn), lerp(hand[1] - 6, 1400, dn), { s: lerp(0.38, 0.8, dn), t, col: GOV, seed: 3, glowA: 0.4 });
      if (lt > nc) { const p = seg(lt, nc, nc + 0.8); ctx.save(); ctx.globalAlpha = 1 - p; for (let i = 0; i < 8; i++) circle(720 + (i - 3.5) * 90 * (0.5 + p), 1400 - p * 60 - rnd(i) * 40, 30 + p * 40, '#C8A878'); ctx.restore(); }
      vignette(0.5);
    } });
    cue(st + nc, 'thud', { gain: 0.8 }); }

  // 14 · lifted again... it did not even budge
  { const st = cut_(14), ut = W_('उठाया', 14), hl = W_('हिला', 14);
    add({ id: 'S15', at: st, cam: [540, 1050], zoom: 0.06, note: 'the sage pulls at the rooted hill, leaning; the hill stays still with roots of light; slip हिला तक नहीं', draw(lt, d, t) {
      braj(t, 0, 0);
      giri(660, 1420, { s: 0.95, t, col: GOV, seed: 3, glowA: 0.3 });
      for (let i = 0; i < 7; i++) { ctx.strokeStyle = 'rgba(255,226,160,0.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(360 + i * 100, 1420); ctx.quadraticCurveTo(340 + i * 104, 1460, 320 + i * 110, 1500); ctx.stroke(); }
      const pull = lt > ut - 0.1 ? Math.sin((lt - ut) * 7) * 0.5 + 0.5 : 0;
      rishi(230 - pull * 12, 1520, { s: 0.75, t, pose: 'pull', aura: 0.2 });
      slipAt(lt, hl, 'हिला तक नहीं', 620, 420, 60); vignette(0.55);
    } });
    cue(st + ut, 'whoosh', { gain: 0.4 }); cue(st + hl, 'tock', { gain: 0.8 }); }

  // 15 · the angry sage: you will shrink by a sesame seed every day!
  { const st = cut_(15), bl = W_('बोले', 15), tl = W_('तिल', 15);
    add({ id: 'S16', at: st, cam: [540, 1000], zoom: 0.1, note: 'curse-red sky: the sage raises his hand in anger, a red-gold flare; on तिल a sesame seed glows above the hill; ribbon तिल भर घटोगे', draw(lt, d, t) {
      gradSky(CURSE); paperGrain(0.05, 14); ground('#3A1A14', 1440);
      giri(780, 1460, { s: 0.75, t, col: ['#2E3A22', '#3E4E2A', '#56683A'], seed: 3 });
      const f = eo(seg(lt, bl - 0.2, bl + 0.5));
      glow(300, 900, 500 * f + 1, '#FF6A3A', 0.5 * f);
      rishi(300, 1540, { s: 0.85, t, pose: 'curse', mood: 'angry', aura: 0 });
      if (lt > tl - 0.2) til(780, 960, 2.2 * eob(seg(lt, tl - 0.2, tl + 0.3)), 1);
      ribbonAt(lt, tl, 'तिल भर घटोगे', 540, 340, 84); vignette(0.6, '#1A0408');
    } });
    cue(st + bl, 'slam', { gain: 0.5 }); cue(st + tl, 'bell', { gain: 0.6 }); }

  // 16 · Govardhan bore the curse, but did not leave Braj
  { const st = cut_(16), bj = W_('ब्रज', 16);
    add({ id: 'S17', at: st, cam: [540, 1100], zoom: 0.08, note: 'red sky fades to calm Braj dusk; the hill stays, cows graze at its foot; slip ब्रज नहीं छोड़ा', draw(lt, d, t) {
      braj(t, 0); ctx.save(); ctx.globalAlpha = 1 - eo(seg(lt, 0, 1.4)); gradSky(CURSE); ctx.restore();
      giri(540, 1360, { s: 1.05, t, col: GOV, seed: 3, glowA: 0.3 });
      cow(200, 1460, 0.7, 1); cow(880, 1470, 0.7, -1); people(420, 1460, 3, '#2A1A1A', 0.8);
      slipAt(lt, bj, 'ब्रज नहीं छोड़ा', 540, 420, 58); vignette(0.5);
    } });
    cue(st + bj, 'bell', { gain: 0.6 }); }

  // 17 · then that same Krishna lifted him on a finger and saved Braj
  { const st = cut_(17), un = W_('उँगली', 17), bc = W_('बचाया', 17);
    add({ id: 'S18', at: st, cam: [540, 1000], zoom: 0.07, note: 'monsoon slate sky and rain; Krishna lifts the hill on one finger on उँगली; cows and villagers shelter beneath; warm glow on बचाया', draw(lt, d, t) {
      gradSky(STORM); paperGrain(0.05, 15); ground('#2A3A2A', 1460);
      const up = eio(seg(lt, un - 0.6, un + 0.2)), sv = eo(seg(lt, bc - 0.2, bc + 0.6));
      rain(t, 1 - 0.5 * sv);
      glow(540, 1350, 500 * sv + 1, '#FFE2A0', 0.3 * sv);
      const tip = krishna(540, 1540, { s: 0.62, t, pose: 'lift', aura: 0.6 + 0.4 * sv });
      giri(tip[0], lerp(1460, tip[1] + 20, up), { s: 0.95, t, col: GOV, seed: 3, glowA: 0.2 + 0.4 * sv });
      cow(200, 1500, 0.55, 1); cow(880, 1510, 0.55, -1); people(290, 1500, 3, '#1A2230', 0.7); people(680, 1500, 3, '#1A2230', 0.7);
      slipAt(lt, bc, 'ब्रज बच गया', 540, 240, 56); vignette(0.55);
    } });
    cue(st, 'drum', { gain: 0.5 }); cue(st + un, 'conch', { dur: 1.8, gain: 0.45 }); cue(st + bc, 'bell', { gain: 0.8 }); }

  // 18 · even today devotees walk its parikrama
  { const st = cut_(18), pr = W_('परिक्रमा', 18);
    add({ id: 'S19', at: st, cam: [540, 1050], zoom: 0.08, note: 'night: a ring of diyas circles the hill; tiny devotees walk the path; ribbon परिक्रमा', draw(lt, d, t) {
      gradSky(NIGHT); stars(t, 120, -200, 900, 6); paperGrain(0.05, 16); ground('#1E2420', 1380);
      giri(540, 1320, { s: 0.85, t, col: ['#24361E', '#30462A', '#425C34'], seed: 3, glowA: 0.3 });
      const n = Math.floor(18 * eo(seg(lt, 0, d * 0.7)));
      for (let i = 0; i < n; i++) { const a = i / 18 * TAU + lt * 0.15, x = 540 + Math.cos(a) * 430, y = 1400 + Math.sin(a) * 90; if (Math.sin(a) > -0.3) diya(x, y, 0.45, t, i); }
      for (let i = 0; i < 5; i++) { const a = lt * 0.25 + i * 0.6; people(540 + Math.cos(a) * 380, 1420 + Math.sin(a) * 70, 1, '#0E1210', 0.8); }
      ribbonAt(lt, pr, 'परिक्रमा', 540, 380, 100); vignette(0.5);
    } });
    cue(st, 'swell', { dur: 2, gain: 0.35 }); cue(st + pr, 'bell', { gain: 0.8 }); }

  // 19 · a little smaller each day... but in devotion, the greatest
  { const st = cut_(19), ch = W_('छोटा', 19), bd = W_('बड़ा', 19);
    add({ id: 'S20', at: st, cam: [540, 1050], zoom: 0.1, note: 'sunrise over the hill; it shrinks a hair on छोटा, then a golden halo blooms behind it on बड़ा', draw(lt, d, t) {
      dawnSky(t, eo(seg(lt, 0, d)), 1200, 4); ground('#3A3A20', 1360);
      const sh = eio(seg(lt, ch - 0.1, ch + 0.6)), b = eo(seg(lt, bd - 0.3, bd + 0.6));
      if (b > 0) { godRays(540, 1100, -Math.PI, 0, 22, 1200, A.paleGold, 0.3 * b, t); glow(540, 1050, 700 * b + 1, '#FFE2A0', 0.4 * b); }
      giri(540, 1380, { s: 1.1 - 0.06 * sh, t, col: GOV, seed: 3, glowA: 0.3 + 0.7 * b });
      slipAt(lt, bd, 'भक्ति में सबसे बड़ा', 540, 380, 56); vignette(0.45);
    } });
    cue(st + ch, 'tock', { gain: 0.6 }); cue(st + bd, 'bell', { gain: 0.9 }); }

  // 20-21 · end card
  { const st = cut_(20), f = Wd('फ़ॉलो', 21) - st;
    add({ id: 'S21', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: the hill under a golden dawn with a single sesame seed of light; Untold Stories in gold', draw(lt, d, t) {
      dawnSky(t, 0.8, 1250, 5); ground('#3A3A20', 1400);
      giri(540, 1420, { s: 0.9, t, col: GOV, seed: 3, glowA: 0.5 });
      til(540, 960, 1.3, 0.9);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 400, 108, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 550, 80, '#FCE7B0'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 720, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.45 }); cue(st + f, 'drum', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
