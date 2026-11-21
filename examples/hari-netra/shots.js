// भगवान विष्णु ने अपनी आँख क्यों चढ़ा दी? Hari offers his eye to Hara — cinematic cut paper, moonlit Kailash blue + lotus pink + gold.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, cloud, motes, water, diya, skyline, vignette } from './atmos.js';
import { shiva, warrior, raja, vishnu, shivling, lotus, sudarshan } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const MOON = [[0, '#060A1E'], [0.45, '#13204A'], [0.8, '#2A3C72'], [1, '#4A5E92']];
const TEMPLE = [[0, '#0A0816'], [0.5, '#1E1530'], [1, '#3A2440']];
const DAITYA = [[0, '#0A0408'], [0.5, '#3A0E14'], [1, '#7A2418']];
const NIGHT = [[0, '#070A1C'], [0.45, '#141C46'], [0.8, '#2C2A5E'], [1, '#4A3466']];

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.45)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
/** moonlit Kailash: stars, moon, the snow peak, blue ranges */
function kailash(t, px = 0, moon = 1) {
  gradSky(MOON); stars(t, 140, -200, 1000, 4); paperGrain(0.05, 4);
  if (moon) { glow(830, 330, 380, '#EAF0FF', 0.4); cut(P_circ(830, 330, 90), '#F4F6FF', { shadow: 0, edge: 0 }); }
  ctx.save(); ctx.translate(px, 0);
  cut(P_poly([[60, 1250], [380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [1020, 1250]]), '#6A7CAE', { shadow: 0.8, edge: 4 });
  cut(P_poly([[380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [640, 740], [590, 790], [540, 730], [490, 790], [440, 740]]), '#F2F5FF', { shadow: 0.3, edge: 3 });
  glow(540, 620, 220, '#DCE6FF', 0.35);
  ctx.restore();
  ranges([{ y: 1200, h: 200, col: '#3A4A7E', seed: 5, haze: 0.2 }, { y: 1320, h: 160, col: '#28345E', seed: 9, haze: 0.15 }], px * 0.5, '#8FA4D8');
}
/** a temple sanctum at night: dark stone pillars, a hanging bell, warm lamp glow */
function sanctum(t, warm = 1) {
  gradSky(TEMPLE); paperGrain(0.05, 7);
  for (const x of [80, 1000]) { cut(P_rr(x - 60, 200, 120, 1300, 6), '#2A2236', { shadow: 0.8, edge: 3 }); cut(P_rr(x - 76, 180, 152, 40, 6), '#3A3048', { shadow: 0.4, edge: 3 }); }
  cut(P_poly([[0, 120], [540, 40], [1080, 120], [1080, 200], [0, 200]]), '#221A2E', { shadow: 0.6, edge: 3 });
  glow(540, 1150, 700, '#FFB060', 0.28 * warm);
  ground('#1E1626', 1440);
}
function lamp(x, y, s, t, a = 1) { diya(x, y, s, t, 3, a); }
function kashiNight(t) {
  gradSky(NIGHT); stars(t, 120, -200, 900, 5);
  glow(780, 380, 400, '#FFF4D6', 0.45); cut(P_circ(780, 380, 110), '#FFF6E0', { shadow: 0, edge: 0 });
  skyline(1040, '#221A3A', 0.8, 540);
  for (let i = 0; i < 6; i++) cut(P_rr(-300, 1040 + i * 34, W + 600, 36, 0), i % 2 ? '#3A2E4E' : '#43365A', { shadow: 0.3, edge: 2 });
  water(t, 1250, ['#2C3E6E', '#1E2C54'], '#FFE7B0', 0.5);
}
/** a woven basket of lotuses; fill 0..1 */
function basket(x, y, s, fill, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const n = Math.round(9 * clamp(fill));
  for (let i = 0; i < n; i++) lotus(-110 + (i % 5) * 55 + (i > 4 ? 27 : 0), -96 - (i > 4 ? 34 : 0), 0.6, 1, i % 2 ? '#E8899A' : '#F2A7B4');
  cut(() => { ctx.beginPath(); ctx.moveTo(-170, -110); ctx.lineTo(170, -110); ctx.lineTo(130, 0); ctx.lineTo(-130, 0); ctx.closePath(); }, '#9C6A3A', { shadow: 0.6, edge: 3 });
  ctx.strokeStyle = 'rgba(60,35,15,0.45)'; ctx.lineWidth = 4; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(i * 26, -110); ctx.lineTo(i * 20, 0); ctx.stroke(); } for (const yy of [-80, -45, -15]) { ctx.beginPath(); ctx.moveTo(-160, yy); ctx.lineTo(160, yy); ctx.stroke(); }
  cut(P_rr(-180, -124, 360, 22, 10), '#B4824A', { shadow: 0.3, edge: 3 });
  ctx.restore();
}
/** an almond eye outline that blooms into a lotus (k 0..1) */
function eyeLotus(x, y, s, k, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  glow(0, 0, 300, '#FFE2A0', 0.35 + 0.3 * k);
  ctx.save(); ctx.globalAlpha = 1 - eo(seg(k, 0.4, 1)); ctx.strokeStyle = '#FCE7B0'; ctx.lineWidth = 12; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-220, 0); ctx.quadraticCurveTo(0, -170, 220, 0); ctx.quadraticCurveTo(0, 170, -220, 0); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, 70, 0, TAU); ctx.stroke(); ctx.restore();
  if (k > 0.2) lotus(0, 90, 2.6 * eob(seg(k, 0.2, 0.8)), 1, '#E8899A', '#FBD3DA', clamp((k - 0.2) * 3));
  ctx.restore();
}
/** floating gold names */
const NAMES = ['शंकर', 'रुद्र', 'महेश', 'नीलकंठ', 'पशुपति', 'शम्भु', 'भोलेनाथ', 'त्रिलोचन'];
function names(lt, x, y, a = 1) { ctx.font = '700 46px Martel'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; NAMES.forEach((n, i) => { const ph = ((lt * 0.45 + i / NAMES.length) % 1); ctx.globalAlpha = a * Math.sin(ph * Math.PI); ctx.fillStyle = '#F6D98A'; ctx.fillText(n, x + Math.sin(i * 2.3) * 300, y - ph * 700); }); ctx.globalAlpha = 1; }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · imagine... Lord Vishnu himself
  { const v = W_('विष्णु', 0);
    add({ id: 'S01', at: 0, cam: [540, 1000], zoom: 0.12, note: 'moonlit Kailash; Vishnu seated in meditation fades up; his halo lights on विष्णु', draw(lt, d, t) {
      kailash(t, -lt * 6); const k = eo(seg(lt, 0, 1.0)), h = eo(seg(lt, v - 0.2, v + 0.5));
      ctx.save(); ctx.globalAlpha = k; vishnu(540, 1440, { s: 1.0, t, aura: 0.3 + 0.7 * h, pose: 'dhyana' }); ctx.restore();
      mist(1380, 140, '#9FB4E8', 0.18, t, 1); motes(t, 30, [0, 300, W, 1400], '#DCE6FF', 0.5, 25, 1, 3); vignette(0.5);
    } });
    cue(0, 'swell', { dur: 3, gain: 0.45 }); cue(v, 'bell', { gain: 0.6 }); }

  // 1 · offered his own eye
  { const st = cut_(1), ak = W_('आँख', 1), ch = W_('चढ़ा', 1);
    add({ id: 'S02', at: st, cam: [540, 900], zoom: 0.1, note: 'a glowing eye-shape blooms into a lotus and drifts down onto the Shivling on चढ़ा', draw(lt, d, t) {
      sanctum(t); const b = eo(seg(lt, ak - 0.2, ak + 0.8)), dn = eio(seg(lt, ch - 0.4, ch + 0.4));
      shivling(540, 1440, { s: 1.15, t, glowA: dn });
      eyeLotus(540, lerp(640, 1000, dn), lerp(0.8, 0.35, dn), b, t);
      if (dn > 0.8) godRays(540, 1000, -Math.PI, 0, 16, 900, A.paleGold, 0.3 * (dn - 0.8) * 5, t);
      vignette(0.55);
    } });
    cue(st + ak, 'heartbeat', { gain: 0.4 }); cue(st + ch, 'bell', { gain: 0.8 }); }

  // 2 · but to whom? and why?
  { const st = cut_(2), k1 = W_('किसे', 2), k2 = W_('क्यों', 2);
    add({ id: 'S03', at: st, cam: [540, 1100], zoom: 0.12, note: 'the dark sanctum, the Shivling in a single shaft of light; two question marks pop on किसे / क्यों', draw(lt, d, t) {
      sanctum(t, 0.4); godRays(540, 0, Math.PI * 0.42, Math.PI * 0.58, 6, 1500, '#DCE6FF', 0.25, t);
      shivling(540, 1440, { s: 1.1, t, glowA: 0.3 });
      for (const [w, x] of [[k1, 260], [k2, 820]]) if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, 560); ctx.scale(p, p); glow(0, 0, 160, A.gold, 0.4); bigText('?', 0, 10, 200, '#FCE7B0'); ctx.restore(); }
      vignette(0.6);
    } });
    cue(st + k1, 'tock'); cue(st + k2, 'tock', { gain: 0.8 }); }

  // 3 · once the Daityas had defeated the devas
  { const st = cut_(3), dt = W_('दैत्यों', 3), hr = W_('हरा', 3);
    add({ id: 'S04', at: st, cam: [540, 1000], zoom: 0.08, note: 'blood-red sky: a dark Daitya horde with horned silhouettes looms; small golden devas kneel and dim on हरा', draw(lt, d, t) {
      gradSky(DAITYA); paperGrain(0.05, 11); glow(540, 1200, 800, '#FF5A2A', 0.18);
      const rise = eo(seg(lt, dt - 0.5, dt + 0.6));
      for (let i = 0; i < 9; i++) { const x = 60 + i * 120, h = 520 + rnd(i * 3) * 220; ctx.save(); ctx.translate(0, (1 - rise) * 400); warrior(x, 1180, h, '#140608', '#5A1A14', t, i);
        for (const k of [-1, 1]) { ctx.fillStyle = '#140608'; ctx.beginPath(); ctx.moveTo(x + k * 14 * h / 300, 1180 - 280 * h / 300); ctx.lineTo(x + k * 40 * h / 300, 1180 - 330 * h / 300); ctx.lineTo(x + k * 26 * h / 300, 1180 - 270 * h / 300); ctx.fill(); }
        glow(x - 8 * h / 300, 1180 - 262 * h / 300, 14, '#FF3A2A', 0.9); ctx.restore(); }
      ground('#1E0A0C', 1260);
      const dim = 1 - 0.6 * eo(seg(lt, hr - 0.2, hr + 0.4));
      for (let i = 0; i < 5; i++) { ctx.save(); ctx.globalAlpha = dim; glow(200 + i * 170, 1330, 90, A.paleGold, 0.5); raja({ x: 200 + i * 170, y: 1440, h: 230, pose: 'stand', t, robe: '#F0E2C4', sash: '#E8B13E', eyes: 0 }); ctx.restore(); }
      vignette(0.6);
    } });
    cue(st, 'drum', { gain: 0.6 }); cue(st + dt, 'swell', { dur: 1.5, gain: 0.4 }); cue(st + hr, 'slam', { gain: 0.5 }); }

  // 4 · then Vishnu went to Mahadev for refuge
  { const st = cut_(4), md = W_('महादेव', 4);
    add({ id: 'S05', at: st, cam: [540, 950], zoom: 0.07, note: 'Vishnu glides in from the left to the foot of Kailash, hands in namaste; the peak glows and slip महादेव', draw(lt, d, t) {
      kailash(t, 0); const m = eo(seg(lt, md - 0.2, md + 0.6));
      glow(540, 600, 360, '#FFF2C0', 0.35 * m); if (m > 0) godRays(540, 600, 0, TAU, 18, 900, '#EAF0FF', 0.18 * m, t);
      vishnu(lerp(-100, 380, eo(seg(lt, 0, 1.2))), 1460, { s: 0.75, t, aura: 0.6, pose: 'namaste' });
      slipAt(lt, md, 'महादेव', 780, 900, 60, 0.03);
      mist(1380, 140, '#9FB4E8', 0.2, t, 2); vignette(0.5);
    } });
    cue(st, 'whoosh', { gain: 0.5 }); cue(st + md, 'conch', { dur: 1.6, gain: 0.45 }); }

  // 5 · he took a vow
  { const st = cut_(5), sk = W_('संकल्प', 5);
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.1, note: 'sanctum: Vishnu seated before the Shivling (side view composition); a lamp lights on संकल्प; ribbon', draw(lt, d, t) {
      sanctum(t); shivling(800, 1430, { s: 0.75, t, glowA: 0.4 });
      vishnu(330, 1450, { s: 0.85, t, aura: 0.7, pose: 'namaste' });
      const l = eo(seg(lt, sk - 0.2, sk + 0.3)); lamp(620, 1430, 1.3, t, l);
      if (lt > sk - 0.1) K.ribbon('संकल्प', 540, 420, eob(seg(lt, sk - 0.1, sk + 0.25)), 100);
      vignette(0.55);
    } });
    cue(st + sk, 'bell', { gain: 0.7 }); }

  // 6 · I will offer a thousand lotuses
  { const st = cut_(6), hz = W_('हज़ार', 6);
    add({ id: 'S07', at: st, cam: [540, 1050], zoom: 0.1, note: 'a lotus pond at night: lotuses bloom across the water and a gold 1000 appears on हज़ार', draw(lt, d, t) {
      gradSky(MOON); stars(t, 100, -200, 800, 6); paperGrain(0.05, 6); glow(830, 330, 300, '#EAF0FF', 0.35);
      water(t, 1000, ['#203466', '#16244A'], '#DCE6FF', 0.4);
      const b = eo(seg(lt, hz - 0.4, hz + 1.2));
      for (let i = 0; i < 26; i++) { const x = 60 + rnd(i * 3) * 960, y = 1080 + rnd(i * 7) * 420, s = 0.45 + (y - 1080) / 420 * 0.5; cut(() => { ctx.beginPath(); ctx.ellipse(x, y + 8, 70 * s, 18 * s, 0, 0, TAU); }, '#2E5A3A', { shadow: 0.2, edge: 2 }); lotus(x, y, s * eob(seg(b, i / 30, i / 30 + 0.2)), 1); }
      if (lt > hz) { const p = eob(seg(lt, hz, hz + 0.3)); ctx.save(); ctx.translate(540, 560); ctx.scale(p, p); glow(0, 0, 220, A.gold, 0.4); bigText('1000', 0, 0, 170, '#F6D98A'); ctx.restore(); }
      vignette(0.5);
    } });
    cue(st + hz, 'sparkle', { dur: 1.4, gain: 0.45 }); cue(st + hz, 'drum', { gain: 0.4 }); }

  // 7 · and with each lotus, one name of Shiva
  { const st = cut_(7), km = W_('कमल', 7), nm = W_('नाम', 7);
    add({ id: 'S08', at: st, cam: [540, 1000], zoom: 0.07, note: 'Vishnu offers a lotus (hands together); the Shivling heap grows; gold names of Shiva float up', draw(lt, d, t) {
      sanctum(t); shivling(780, 1430, { s: 0.8, t, glowA: 0.5, flowers: 0.3 + 0.4 * eo(seg(lt, 0, d)) });
      vishnu(320, 1450, { s: 0.85, t, aura: 0.7, pose: 'offer' });
      const fl = (lt * 0.9) % 1; lotus(lerp(330, 760, eio(fl)), lerp(1000, 1310, eio(fl)) - Math.sin(fl * Math.PI) * 140, 0.6, 1, '#F2A7B4');
      names(lt, 540, 1200, eo(seg(lt, km - 0.3, nm)));
      vignette(0.5);
    } });
    cue(st + km, 'bell', { gain: 0.35 }); cue(st + nm, 'bell', { gain: 0.45 }); }

  // 8 · but one day Mahadev set a test
  { const st = cut_(8), pr = W_('परीक्षा', 8);
    add({ id: 'S09', at: st, cam: [540, 800], zoom: 0.08, note: 'above Kailash a vast faint Shiva in the clouds, eyes closed, watching; the moon glints on परीक्षा', draw(lt, d, t) {
      kailash(t, 0, 0); const a = eo(seg(lt, 0, 1.0));
      ctx.save(); ctx.globalAlpha = 0.55 * a; shiva(540, 1700, { s: 1.0, t, aura: 0.6, eyes: 0 }); ctx.restore();
      for (let i = 0; i < 3; i++) cloud(150 + i * 380 + Math.sin(t * 0.3 + i) * 20, 1050 + (i % 2) * 60, 0.9, '#8A9AC8', '#C9D4F0', '#5A6A9A', 0.85);
      if (lt > pr) glow(540, 600, 260, '#FFF2C0', 0.4 * eo(seg(lt, pr, pr + 0.4)));
      slipAt(lt, pr, 'परीक्षा', 540, 360, 60);
      vignette(0.5);
    } });
    cue(st, 'damru', { dur: 1, gain: 0.35 }); cue(st + pr, 'bell', { gain: 0.5 }); }

  // 9 · secretly he hid one lotus
  { const st = cut_(9), ch = W_('चुपके', 9), km = W_('कमल', 9);
    add({ id: 'S10', at: st, cam: [540, 1150], zoom: 0.12, note: 'close on the lotus basket; one lotus glows, lifts and vanishes in sparkles on छिपा', draw(lt, d, t) {
      sanctum(t, 0.8); basket(540, 1400, 1.5, 1, t);
      const up = eio(seg(lt, km - 0.2, km + 0.9)), gone = seg(lt, km + 0.6, km + 1.0);
      glow(540, 1250 - up * 500, 140, '#FFF2C0', 0.6 * (1 - gone));
      lotus(540, 1250 - up * 500, 1.1 * (1 - gone), 1, '#F2A7B4', '#FFFFFF');
      if (gone > 0) motes(t, 30, [380, 600, 700, 900], '#FFF2C0', 1 - gone * 0.5, 60, 9, 4);
      vignette(0.55);
    } });
    cue(st + ch, 'whoosh', { gain: 0.3 }); cue(st + km + 0.6, 'sparkle', { dur: 1, gain: 0.4 }); }

  // 10 · nine hundred ninety-nine lotuses offered
  { const st = cut_(10), n = W_('नौ', 10);
    add({ id: 'S11', at: st, cam: [540, 1000], zoom: 0.08, note: 'the heap on the Shivling grows while a counter climbs to 999', draw(lt, d, t) {
      sanctum(t); const p = eio(seg(lt, n, d - 0.2));
      shivling(540, 1440, { s: 1.05, t, glowA: 0.4 + 0.4 * p, flowers: 0.5 + 0.5 * p });
      const cnt = Math.round(lerp(900, 999, p)); ctx.save(); glow(540, 520, 220, A.gold, 0.35); bigText(String(cnt), 540, 520, 170, '#F6D98A'); ctx.restore();
      vignette(0.55);
    } });
    cue(st + n, 'tock', { gain: 0.5 }); cue(L(11) - 0.4, 'tock', { gain: 0.7 }); }

  // 11 · and the last lotus? it wasn't there
  { const st = cut_(11), ak = W_('आख़िरी', 11), nh = W_('नहीं', 11);
    add({ id: 'S12', at: st, cam: [540, 1300], zoom: 0.14, note: 'Vishnu\'s hand reaches into the basket: empty; the light drains on नहीं', draw(lt, d, t) {
      sanctum(t, 0.7); const dr = 1 - 0.6 * eo(seg(lt, nh - 0.2, nh + 0.5));
      basket(540, 1430, 1.6, 0, t);
      const rch = eio(seg(lt, ak - 0.4, ak + 0.5));
      { const hx = lerp(980, 620, rch), hy = lerp(1080, 1270, rch), bx = 1260, by = 1380, ang = Math.atan2(hy - by, hx - bx), nx = -Math.sin(ang), ny = Math.cos(ang);
        cut(() => { ctx.beginPath(); ctx.moveTo(bx + nx * 70, by + ny * 70); ctx.lineTo(hx + nx * 40, hy + ny * 40); ctx.lineTo(hx - nx * 40, hy - ny * 40); ctx.lineTo(bx - nx * 70, by - ny * 70); ctx.closePath(); }, '#3E6FB4', { shadow: 0.5, edge: 3 });
        const wx = lerp(hx, bx, 0.18), wy = lerp(hy, by, 0.18); ctx.save(); ctx.translate(wx, wy); ctx.rotate(ang); cut(P_rr(-14, -46, 28, 92, 10), '#E0A93A', { shadow: 0.3, edge: 2 }); ctx.restore();
        ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang + Math.PI); cut(() => { ctx.beginPath(); ctx.ellipse(10, 0, 62, 46, 0, 0, TAU); }, '#3E6FB4', { shadow: 0.4, edge: 3 }); for (let i = 0; i < 4; i++) cut(P_rr(50, -36 + i * 20, 56 - Math.abs(i - 1.5) * 8, 17, 8), '#3E6FB4', { shadow: 0.2, edge: 2 }); ctx.restore(); }
      ctx.fillStyle = rgba('#05040A', 0.6 * (1 - dr)); ctx.fillRect(-400, -400, W + 800, H + 800);
      if (lt > nh) { const p = eob(seg(lt, nh, nh + 0.25)); ctx.save(); ctx.translate(540, 620); ctx.scale(p, p); bigText('?', 0, 0, 220, '#FCE7B0'); ctx.restore(); }
      vignette(0.6);
    } });
    cue(st + ak, 'heartbeat', { gain: 0.45 }); cue(st + nh, 'slam', { gain: 0.45 }); }

  // 12 · the vow was about to break
  { const st = cut_(12), tt = W_('टूटने', 12);
    add({ id: 'S13', at: st, cam: [540, 1150], zoom: 0.16, note: 'close: the vow lamp flickers and shrinks in the dark; the ribbon संकल्प cracks', draw(lt, d, t) {
      gradSky(TEMPLE); paperGrain(0.05, 13); const f = eo(seg(lt, tt - 0.2, tt + 0.6));
      const fl = (1 - 0.7 * f) * (0.8 + 0.2 * Math.sin(t * 23) * Math.sin(t * 7));
      glow(540, 1200, 500 * fl, '#FFB060', 0.4 * fl);
      lamp(540, 1300, 3.2, t, fl);
      ground('#140E1A', 1380);
      K.ribbon('संकल्प', 540, 520, 1, 90);
      if (f > 0) { ctx.save(); ctx.strokeStyle = '#140E1A'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(520, 430); ctx.lineTo(560, 490); ctx.lineTo(515, 540); ctx.lineTo(565, 610); ctx.globalAlpha = f; ctx.stroke(); ctx.restore(); }
      vignette(0.7);
    } });
    cue(st + tt, 'swell', { dur: 1.4, gain: 0.3 }); }

  // 13 · then Vishnu remembered
  { const st = cut_(13), yd = W_('याद', 13);
    add({ id: 'S14', at: st, cam: [540, 800], zoom: 0.08, note: 'close-up of serene Vishnu, eyes closed; a soft gold memory-glow rises on याद', draw(lt, d, t) {
      sanctum(t, 0.6); const y = eo(seg(lt, yd - 0.3, yd + 0.6));
      vishnu(540, 1530, { s: 1.4, t, aura: 0.5 + 0.5 * y, pose: 'dhyana' });
      motes(t, 30 , [200, 200, 880, 900], '#FFF2C0', 0.7 * y, 40, 4, 4);
      vignette(0.55);
    } });
    cue(st + yd, 'sparkle', { dur: 1.2, gain: 0.35 }); }

  // 14 · people call his eyes lotuses
  { const st = cut_(14), ak = W_('आँखों', 14), km = W_('कमल', 14);
    add({ id: 'S15', at: st, cam: [540, 900], zoom: 0.08, note: 'a gold almond eye drawn in light blooms into a lotus on कमल; slip कमलनयन', draw(lt, d, t) {
      gradSky(MOON); stars(t, 80, -200, 1200, 8); paperGrain(0.05, 14);
      const k = eio(seg(lt, km - 0.5, km + 0.4)), drawIn = eo(seg(lt, ak - 0.4, ak + 0.3));
      ctx.save(); ctx.globalAlpha = drawIn; eyeLotus(540, 900, 1.3, k, t); ctx.restore();
      slipAt(lt, km + 0.3, 'कमलनयन', 540, 1390, 62);
      vignette(0.5);
    } });
    cue(st + ak, 'bell', { gain: 0.4 }); cue(st + km, 'sparkle', { dur: 1.2, gain: 0.5 }); }

  // 15 · without hesitating, one of his own eyes
  { const st = cut_(15), ek = W_('एक', 15);
    add({ id: 'S16', at: st, cam: [540, 900], zoom: 0.1, note: 'Vishnu raises his front right hand, which fills with a lotus-shaped light; serene closed eyes, no gore', draw(lt, d, t) {
      sanctum(t); const r = eo(seg(lt, 0.1, 0.9)), l = eo(seg(lt, ek - 0.3, ek + 0.5));
      const hh = vishnu(540, 1470, { s: 1.05, t, aura: 0.7, pose: r > 0.5 ? 'raise' : 'dhyana', eyeGlow: l * 0.6 });
      if (r > 0.5) { const hx = 540 + hh.hr[0] * 1.05, hy = 1470 + hh.hr[1] * 1.05; glow(hx, hy - 50, 160, '#FFF2C0', 0.8 * l); lotus(hx, hy - 20, 0.8 * l, 1, '#FFE2A0', '#FFFFFF', l); }
      vignette(0.55);
    } });
    cue(st + 0.1, 'heartbeat', { gain: 0.45 }); cue(st + ek, 'swell', { dur: 1.2, gain: 0.35 }); }

  // 16 · in place of the lotus, offered on the Shivling
  { const st = cut_(16), jg = W_('जगह', 16), ch = W_('चढ़ा', 16);
    add({ id: 'S17', at: st, cam: [540, 1150], zoom: 0.1, note: 'the light-lotus floats down to the one empty place in the heap; the Shivling blazes on चढ़ा; counter 1000', draw(lt, d, t) {
      sanctum(t); const dn = eio(seg(lt, jg - 0.3, ch + 0.1)), bl = eo(seg(lt, ch, ch + 0.6));
      shivling(540, 1440, { s: 1.1, t, glowA: 0.4 + 0.8 * bl, flowers: 1 });
      glow(540, lerp(700, 1300, dn), 160, '#FFF2C0', 0.8); lotus(540, lerp(700, 1300, dn), 0.8, 1, '#FFE2A0', '#FFFFFF');
      if (bl > 0) godRays(540, 1100, -Math.PI, 0, 18, 1200, A.paleGold, 0.35 * bl, t);
      ctx.save(); glow(540, 480, 200, A.gold, 0.3); bigText(bl > 0.1 ? '1000' : '999', 540, 480, 150, '#F6D98A'); ctx.restore();
      vignette(0.5);
    } });
    cue(st + jg, 'whoosh', { gain: 0.3 }); cue(st + ch, 'bell', { gain: 0.9 }); cue(st + ch, 'drum', { gain: 0.5 }); }

  // 17 · that very moment Mahadev appeared
  { const st = cut_(17), pk = W_('प्रकट', 17);
    add({ id: 'S18', at: st, cam: [540, 950], zoom: 0.07, note: 'the Shivling bursts into light; Shiva rises out of the glow, halo blazing on प्रकट', draw(lt, d, t) {
      gradSky([[0, '#0A0C26'], [0.5, '#2A2A5E'], [1, '#5A4A7A']]); paperGrain(0.05, 18);
      const r = eo(seg(lt, pk - 0.6, pk + 0.4));
      godRays(540, 1150, 0, TAU, 24, 1400, '#EAF0FF', 0.15 + 0.25 * r, t);
      ctx.save(); ctx.globalAlpha = r; shiva(540, lerp(1700, 1500, r), { s: 1.0, t, aura: r, eyes: 0 }); ctx.restore();
      shivling(540, 1500, { s: 0.7, t, glowA: 1, flowers: 1 });
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 18, 3); vignette(0.45);
    } });
    cue(st + pk - 0.5, 'whoosh'); cue(st + pk, 'conch', { dur: 1.8, gain: 0.6 }); cue(st + pk, 'damru', { dur: 1, gain: 0.4 }); }

  // 18 · he gave Vishnu his eye back
  { const st = cut_(18), lt_ = W_('लौटा', 18);
    add({ id: 'S19', at: st, cam: [540, 1000], zoom: 0.07, note: 'Shiva (right, blessing) and Vishnu (left, namaste); a stream of gold light flows from Shiva\'s hand to Vishnu\'s eyes on लौटा', draw(lt, d, t) {
      kailash(t, 0); shiva(800, 1520, { s: 0.72, t, aura: 0.9, eyes: 0 });
      vishnu(300, 1470, { s: 0.7, t, aura: 0.7, pose: 'namaste', eyeGlow: 0.5 * eo(seg(lt, lt_ - 0.1, lt_ + 0.4)) });
      const f = eio(seg(lt, lt_ - 0.6, lt_ + 0.1));
      if (f > 0 && f < 1) { const x = lerp(930, 321, f), y = lerp(1000, 970, f) - Math.sin(f * Math.PI) * 160; glow(x, y, 90, '#FFF2C0', 0.9); }
      vignette(0.5);
    } });
    cue(st + lt_ - 0.6, 'sparkle', { dur: 1, gain: 0.4 }); cue(st + lt_, 'bell', { gain: 0.6 }); }

  // 19 · and gave him the Sudarshana chakra!
  { const st = cut_(19), sd = W_('सुदर्शन', 19);
    add({ id: 'S20', at: st, cam: [540, 850], zoom: 0.1, note: 'the blazing Sudarshana chakra spins into being in the sky; ribbon सुदर्शन चक्र', draw(lt, d, t) {
      gradSky([[0, '#0A0C26'], [0.5, '#3A2A5E'], [1, '#8A4A4A']]); paperGrain(0.05, 19); stars(t, 80, -200, 900, 19);
      const c = eob(seg(lt, sd - 0.4, sd + 0.2));
      godRays(540, 820, 0, TAU, 26, 1300, '#FFD08A', 0.25 * clamp(c), t);
      sudarshan(540, 820, 230 * clamp(c, 0, 1.2), t, 1);
      if (lt > sd + 0.2) K.ribbon('सुदर्शन चक्र', 540, 1300, eob(seg(lt, sd + 0.2, sd + 0.5)), 90);
      vignette(0.45);
    } });
    cue(st + sd - 0.4, 'whoosh'); cue(st + sd, 'drum', { gain: 0.7 }); cue(st + sd, 'conch', { dur: 1.6, gain: 0.5 }); }

  // 20 · Hari gave Hara an eye; Hara gave Hari the chakra
  { const st = cut_(20), ak = W_('आँख', 20), cr = W_('चक्र', 20);
    add({ id: 'S21', at: st, cam: [540, 1000], zoom: 0.06, note: 'Hari (left) and Hara (right) under one moon; a light-lotus crosses right on आँख, the chakra settles on Vishnu\'s finger on चक्र; slips हरि / हर', draw(lt, d, t) {
      kailash(t, 0); const a = eio(seg(lt, ak - 0.5, ak + 0.2)), c = eio(seg(lt, cr - 0.6, cr + 0.1));
      shiva(800, 1520, { s: 0.72, t, aura: 0.9, eyes: 0 });
      vishnu(300, 1470, { s: 0.7, t, aura: 0.7, pose: 'dhyana', chakra: c >= 1 ? 1 : 0 });
      if (a > 0 && a < 1) { const x = lerp(330, 800, a), y = 1000 - Math.sin(a * Math.PI) * 200; glow(x, y, 100, '#FFF2C0', 0.8); lotus(x, y + 20, 0.6, 1, '#FFE2A0', '#FFFFFF'); }
      if (c > 0 && c < 1) sudarshan(lerp(820, 300 + 112 * 0.7 + 30, c), lerp(800, 1470 - 0.7 * 860, c) - Math.sin(c * Math.PI) * 200, 60, t, 1);
      slipAt(lt, 0.1, 'हरि', 300, 420, 70, -0.04); slipAt(lt, 0.5, 'हर', 800, 420, 70, 0.04);
      vignette(0.5);
    } });
    cue(st + ak, 'bell', { gain: 0.5 }); cue(st + cr, 'bell', { gain: 0.7 }); }

  // 21 · in memory of this devotion: Vaikuntha Chaturdashi
  { const st = cut_(21), vk = W_('वैकुण्ठ', 21);
    add({ id: 'S22', at: st, cam: [540, 1100], zoom: 0.08, note: 'Kashi ghats at night, diyas float on the river; ribbon वैकुण्ठ चतुर्दशी and slip 23 नवंबर', draw(lt, d, t) {
      kashiNight(t);
      for (let i = 0; i < 12; i++) { const x = ((i * 97 + lt * 30) % 1200) - 60, y = 1300 + (i % 4) * 55; diya(x, y, 0.6 + (i % 4) * 0.15, t, i); }
      for (let i = 0; i < 7; i++) diya(80 + i * 155, 1050 + (i % 2) * 20, 0.7, t, i + 20);
      if (lt > vk - 0.15) K.ribbon('वैकुण्ठ चतुर्दशी', 540, 560, eob(seg(lt, vk - 0.15, vk + 0.2)), 80);
      slipAt(lt, vk + 0.5, '23 नवंबर', 540, 780, 54);
      vignette(0.45);
    } });
    cue(st, 'swell', { dur: 2, gain: 0.35 }); cue(st + vk, 'bell', { gain: 0.9 }); }

  // 22-23 · end card
  { const st = cut_(22), f = Wd('फ़ॉलो', 23) - st;
    add({ id: 'S23', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: a lotus and a small chakra over moonlit Kailash; Untold Stories in gold', draw(lt, d, t) {
      kailash(t, 0, 0);
      lotus(540, 1330, 1.6, 1); sudarshan(540, 1000, 90, t, 0.9);
      glow(540, 560, 600, A.gold, 0.15);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 400, 108, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 550, 80, '#DCE6FF'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 720, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.45 }); cue(st + f, 'drum', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
