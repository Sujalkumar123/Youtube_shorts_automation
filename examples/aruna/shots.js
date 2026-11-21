// सूर्य के सारथी के पैर क्यों नहीं? Aruna, the unfinished son — cinematic cut paper, a red-dawn palette.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, cloud, motes, birds, vignette, dawnSky } from './atmos.js';
import { kapila, devi, aruna, garuda, naga, egg, vessel, suryaRath } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const KADRU = { sari: '#2E6A5E', border: '#C9B458', pallu: '#245448' };
const VINATA = { sari: '#C8553D', border: '#F2C14E', pallu: '#A8402E' };
const ASHRAM = [[0, '#2A1E3A'], [0.45, '#6A3A4E'], [0.75, '#C4704A'], [1, '#E8A060']];
const NAGALOKA = [[0, '#06140F'], [0.5, '#12302A'], [1, '#1E4A3A']];
const NIGHTHUT = [[0, '#0A0C22'], [0.55, '#1C1E44'], [1, '#2E2448']];

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
/** dawn hills (three paper ranges in plum/rose) */
function hills(px = 0, k = 1) { ranges([{ y: 1240, h: 260, col: '#5A2E4A', seed: 3, haze: 0.25 }, { y: 1360, h: 220, col: '#3E2140', seed: 7, haze: 0.2 }, { y: 1520, h: 180, col: '#24142A', seed: 11 }], px, '#F2964A'); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.45)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
/** an ashram: two thatched huts and a tree, warm dusk */
function ashram(t) {
  gradSky(ASHRAM); glow(540, 1050, 800, '#FFB070', 0.35); paperGrain(0.05, 4);
  ranges([{ y: 1150, h: 200, col: '#7A4456', seed: 5, haze: 0.2 }, { y: 1260, h: 140, col: '#56304A', seed: 9 }], 0, '#E8A060');
  for (const [x, s] of [[150, 1], [930, 0.85]]) { ctx.save(); ctx.translate(x, 1300); ctx.scale(s, s); cut(P_rr(-110, -160, 220, 160, 6), '#8A5A3A', { shadow: 0.6, edge: 3 }); cut(P_poly([[-150, -150], [0, -300], [150, -150]]), '#C49A5A', { shadow: 0.6, edge: 3 }); cut(P_rr(-30, -100, 60, 100, 6), '#2A1C14', { shadow: 0, edge: 0 }); ctx.restore(); }
  ground('#4A2E30', 1300);
}
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · every morning, before the sun, a red glow
  { const lw = W_('लाली', 0);
    add({ id: 'S01', at: 0, cam: [540, 1100], zoom: 0.12, note: 'night turns to red dawn over plum hills; the glow swells on लाली', draw(lt, d, t) {
      const k = eo(seg(lt, 0, lw + 0.6)); dawnSky(t, k); hills(-lt * 8); birds(lt, 300, 760, 5, rgba('#1A0E1A', k), 1);
      mist(1300, 160, '#F2964A', 0.18 * k, t, 1); vignette(0.5);
    } });
    cue(0, 'swell', { dur: 3, gain: 0.5 }); cue(lw, 'bell', { gain: 0.6 }); }

  // 1 · he is a god with no legs
  { const p = W_('पैर', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 950], zoom: 0.1, note: 'a radiant figure rises out of the glow on the horizon; below the waist only light', draw(lt, d, t) {
      dawnSky(t, 1); const r = eo(seg(lt, 0, 1.2));
      aruna(540, lerp(1500, 1180, r), { s: 1.35, t, aura: r, eyes: 0, mist: 1 });
      hills(0); if (lt > p) glow(540, 1180, 300, '#FFE2A0', 0.5 * eo(seg(lt, p, p + 0.4)));
      motes(t, 30, [0, 400, W, 1400], A.paleGold, 0.6, 30, 2, 3); vignette(0.5);
    } });
    cue(cut_(1), 'whoosh'); cue(cut_(1) + 0.1, 'sparkle', { dur: 1.4, gain: 0.4 }); }

  // 2 · the Sun's charioteer: Aruna
  { const st = cut_(2), a = W_('अरुण', 2);
    add({ id: 'S03', at: st, cam: [540, 900], zoom: 0.07, note: 'the Sun chariot with seven horses; Aruna holds the reins; slip अरुण', draw(lt, d, t) {
      gradSky([[0, '#2A1A4A'], [0.5, '#C2503A'], [1, '#F2A04A']]); paperGrain(0.05, 6);
      for (let i = 0; i < 4; i++) cloud(((i * 330 - lt * 120) % 1500 + 1500) % 1500 - 200, 1240 + (i % 2) * 90, 0.8, '#F6C3A0', '#FFF0D8', '#C27A6A', 0.9);
      suryaRath(470, 1180, 1.05, t, { sunR: 300 });
      slipAt(lt, a, 'अरुण', 720, 520, 70, 0.03); vignette(0.45);
    } });
    cue(st, 'drum', { gain: 0.5 }); cue(st + a, 'bell', { gain: 0.8 }); }

  // 3 · but why were his legs never formed?
  { const st = cut_(3), q = W_('क्यों', 3);
    add({ id: 'S04', at: st, cam: [540, 1150], zoom: 0.1, note: 'camera on the light where his legs should be; a question slip', draw(lt, d, t) {
      dawnSky(t, 1, 1300); aruna(540, 1250, { s: 1.9, t, aura: 0.8, eyes: 0, mist: 1 });
      if (lt > q - 0.1) { const p = eob(seg(lt, q - 0.1, q + 0.25)); ctx.save(); ctx.translate(870, 520); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, 220, '#FCE7B0'); ctx.restore(); }
      vignette(0.55);
    } });
    cue(st + q, 'tock'); }

  // 4 · sage Kashyapa's wives, Kadru and Vinata
  { const st = cut_(4), kd = W_('कद्रू', 4), vn = W_('विनता', 4);
    add({ id: 'S05', at: st, cam: [540, 1000], zoom: 0.06, note: 'ashram: Kashyapa seated centre; Kadru (green) left, Vinata (saffron) right, named on their words', draw(lt, d, t) {
      ashram(t);
      kapila(540, 1360, 1.15, { t, eyes: 0 });
      devi({ x: 210, y: 1440, h: 860, t, ...KADRU, eyes: 1, pose: 'stand', dir: 1, crown: true, glowA: lt > kd ? 1 : 0 });
      devi({ x: 870, y: 1440, h: 860, t, ...VINATA, eyes: 0, pose: 'namaste', dir: -1, crown: true, glowA: lt > vn ? 1 : 0 });
      slipAt(lt, W_('कश्यप', 4), 'ऋषि कश्यप', 540, 520, 54); slipAt(lt, kd, 'कद्रू', 210, 380, 56, -0.04); slipAt(lt, vn, 'विनता', 870, 380, 56, 0.04);
      vignette(0.45);
    } });
    cue(st, 'conch', { dur: 1.6, gain: 0.4 }); cue(st + kd, 'bell', { gain: 0.35 }); cue(st + vn, 'bell', { gain: 0.35 }); }

  // 5 · Kadru asked for a thousand Naga sons
  { const st = cut_(5), hz = W_('हज़ार', 5);
    add({ id: 'S06', at: st, cam: [540, 1000], zoom: 0.08, note: 'Kadru raises her hands; a thousand serpent hoods rise behind her in green light', draw(lt, d, t) {
      gradSky(NAGALOKA); paperGrain(0.05, 8); glow(540, 900, 700, '#5AE0A0', 0.18);
      const n = Math.floor(80 * eo(seg(lt, hz - 0.3, hz + 1.2)));
      for (let i = 0; i < n; i++) { const x = 40 + rnd(i * 3) * 1000, y = 700 + rnd(i * 7) * 600, s = 0.35 + rnd(i) * 0.35; ctx.save(); ctx.globalAlpha = 0.5 + 0.5 * rnd(i * 2); naga(x, y, s, t, eob(seg(lt, hz - 0.3 + i * 0.012, hz + i * 0.012)), i % 3 ? '#2E5A4A' : '#3E7A5A', i % 2 ? 1 : -1); ctx.restore(); }
      ground('#0E2620', 1440);
      devi({ x: 540, y: 1460, h: 980, t, ...KADRU, eyes: 1, pose: 'boon', crown: true, glowA: 0.6 });
      if (lt > hz) { const p = eob(seg(lt, hz, hz + 0.3)); ctx.save(); ctx.translate(820, 420); ctx.scale(p, p); glow(0, 0, 200, '#9AF0C0', 0.4); bigText('1000', 0, 0, 120, '#DFF6E8'); ctx.restore(); }
      vignette(0.55);
    } });
    cue(st, 'damru', { dur: 1, gain: 0.4 }); cue(st + hz, 'swell', { dur: 1.6, gain: 0.5 }); }

  // 6 · Vinata asked for only two, but mightier
  { const st = cut_(6), dw = W_('दो', 6), sk = W_('शक्तिशाली', 6);
    add({ id: 'S07', at: st, cam: [540, 1000], zoom: 0.08, note: 'Vinata in prayer; two golden suns appear above her and blaze on शक्तिशाली', draw(lt, d, t) {
      gradSky([[0, '#2A1440'], [0.5, '#7A2E4A'], [1, '#C8603A']]); paperGrain(0.05, 9);
      const two = eob(seg(lt, dw - 0.1, dw + 0.3)), big = eo(seg(lt, sk - 0.1, sk + 0.6));
      for (const k of [-1, 1]) { if (two <= 0) continue; const x = 540 + k * 200, y = 520; glow(x, y, 160 + 260 * big, '#FFC060', 0.6); cut(P_circ(x, y, 70 * two * (1 + 0.4 * big)), '#FFE6A0', { shadow: 0, edge: 0 }); }
      if (big > 0) godRays(540, 520, 0, TAU, 22, 1100, A.paleGold, 0.25 * big, t);
      ground('#3A1A2A', 1440);
      devi({ x: 540, y: 1460, h: 980, t, ...VINATA, eyes: 0, pose: 'namaste', crown: true, glowA: 0.5 + big });
      motes(t, 30, [0, 300, W, 1400], A.paleGold, 0.6, 30, 3, 3); vignette(0.5);
    } });
    cue(st + dw, 'bell', { gain: 0.4 }); cue(st + sk, 'swell', { dur: 1.5, gain: 0.5 }); }

  // 7 · after five hundred years, Kadru's Nagas hatched
  { const st = cut_(7), py = W_('पाँच', 7), ng = W_('नाग', 7);
    add({ id: 'S08', at: st, cam: [540, 1100], zoom: 0.08, note: 'ribbon ५०० वर्ष; a vessel of eggs cracks open and little cobras rise out', draw(lt, d, t) {
      gradSky(NAGALOKA); paperGrain(0.05, 10); glow(540, 1100, 600, '#5AE0A0', 0.2);
      ground('#0E2620', 1380); vessel(540, 1330, 1.4, '#7A4A2A');
      for (let i = 0; i < 9; i++) { const x = 300 + (i % 5) * 120 + (i > 4 ? 60 : 0), y = 1150 - (i > 4 ? 60 : 0); const h = seg(lt, ng - 0.3 + i * 0.08, ng + i * 0.08); if (h < 0.5) egg(x, y, 58, t, { col: '#D8D8B8', spots: '#8AA080', crack: h * 2 }); else { egg(x, y + 20, 58, t, { col: '#D8D8B8', open: 1 }); naga(x, y + 40, 0.55, t, eob((h - 0.5) * 2), '#3E7A5A', i % 2 ? 1 : -1); } }
      K.ribbon('500 वर्ष', 540, 470, eob(seg(lt, py - 0.15, py + 0.2)), 100);
      vignette(0.55);
    } });
    cue(st + py, 'drum', { gain: 0.5 }); cue(st + ng, 'sizzle', { dur: 0.8, gain: 0.25 }); }

  // 8 · but Vinata's eggs... stayed silent
  { const st = cut_(8), ch = W_('चुप', 8);
    add({ id: 'S09', at: st, cam: [540, 1200], zoom: 0.1, note: 'night: Vinata waits beside her two still eggs; nothing stirs', draw(lt, d, t) {
      gradSky(NIGHTHUT); stars(t, 100, -200, 900, 12); glow(820, 380, 300, '#FFF4D6', 0.35); cut(P_circ(820, 380, 80), '#FFF6E0', { shadow: 0, edge: 0 }); paperGrain(0.05, 12);
      ground('#1E1A30', 1380); vessel(640, 1340, 1.1, '#7A4A2A');
      egg(580, 1180, 64, t, { col: '#F3E2C0', glow: 0.25 }); egg(700, 1180, 64, t, { col: '#F3E2C0', glow: 0.25 });
      devi({ x: 290, y: 1440, h: 900, t, ...VINATA, eyes: 0, pose: 'hold', dir: 1, sad: true });
      if (lt > ch) mist(1300, 120, '#8A90C0', 0.2, t, 3);
      vignette(0.6);
    } });
    cue(st, 'swell', { dur: 2, gain: 0.25 }); }

  // 9 · restless, Vinata broke one egg too soon
  { const st = cut_(9), an = W_('अंडा', 9), td = W_('तोड़', 9);
    add({ id: 'S10', at: st, cam: [540, 900], zoom: 0.14, note: 'close: Vinata lifts one egg in both hands; it cracks with light on तोड़', draw(lt, d, t) {
      gradSky(NIGHTHUT); stars(t, 60, -200, 700, 14); paperGrain(0.05, 14);
      const lift = eo(seg(lt, an - 0.6, an + 0.2)), y = lerp(1250, 980, lift), cr = eo(seg(lt, td - 0.1, td + 0.3));
            for (const k of [-1, 1]) { const hx = 540 + k * 118, hy = y + 40, bx = 540 + k * 420, by = 1950;
        cut(() => { ctx.beginPath(); ctx.moveTo(bx - 120, by); ctx.lineTo(bx + 120, by); ctx.lineTo(hx + k * 40, hy + 40); ctx.lineTo(hx - k * 10, hy + 10); ctx.closePath(); }, k < 0 ? '#9C6340' : '#B97A4E', { shadow: 0.5, edge: 3 });
        cut(() => { ctx.beginPath(); ctx.moveTo(bx - 250, by + 40); ctx.lineTo(bx + 250, by + 40); ctx.lineTo(lerp(bx, hx, 0.45) + 80, lerp(by, hy, 0.45)); ctx.lineTo(lerp(bx, hx, 0.45) - 80, lerp(by, hy, 0.45)); ctx.closePath(); }, VINATA.sari, { shadow: 0.5, edge: 3 });
        ctx.save(); ctx.translate(lerp(bx, hx, 0.55), lerp(by, hy, 0.55)); ctx.rotate(Math.atan2(hy - by, hx - bx)); ctx.strokeStyle = '#E0A93A'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, -46); ctx.lineTo(0, 46); ctx.stroke(); ctx.restore();
        cut(() => { ctx.beginPath(); ctx.ellipse(hx + k * 6, hy, 44, 70, k * 0.35, 0, TAU); }, '#B97A4E', { shadow: 0.4, edge: 3 }); }
      egg(540, y, 150, t, { col: '#F3E2C0', glow: 0.3 + cr * 1.2, crack: cr });
      if (cr > 0) godRays(540, y, -Math.PI, 0, 14, 900, '#FFE7A0', 0.5 * cr, t);
      vignette(0.55);
    } });
    cue(st + an, 'heartbeat', { gain: 0.4 }); cue(st + td, 'slam', { gain: 0.5 }); }

  // 10 · and out came... an unfinished child
  { const st = cut_(10), ad = W_('अधूरा', 10);
    add({ id: 'S11', at: st, cam: [540, 1100], zoom: 0.1, note: 'the shell opens; a small radiant child rises from the light, eyes closed', draw(lt, d, t) {
      gradSky(NIGHTHUT); paperGrain(0.05, 15); glow(540, 1150, 700, '#FFB070', 0.45);
      const op = eo(seg(lt, 0, 0.8)), r = eo(seg(lt, 0.4, 1.6));
      aruna(540, lerp(1350, 1180, r), { s: 1.1, t, age: 0, aura: r, eyes: 0, mist: 0.9 });
      egg(540, 1300, 190, t, { col: '#F3E2C0', open: op, glow: 0.4 });
      if (lt > ad) glow(540, 1300, 300, '#FFE2A0', 0.3);
      motes(t, 30, [200, 700, 880, 1400], A.paleGold, 0.8, 40, 5, 3); vignette(0.55);
    } });
    cue(st, 'sparkle', { dur: 1.6, gain: 0.5 }); cue(st + ad, 'bell', { gain: 0.5 }); }

  // 11 · a radiant upper body, but no legs
  { const st = cut_(11), tj = W_('तेजस्वी', 11), pr = W_('पैर', 11);
    add({ id: 'S12', at: st, cam: [540, 1250], zoom: 0.1, note: 'tilt down: glowing torso, then the half shell with only light where the legs would be', draw(lt, d, t) {
      gradSky(NIGHTHUT); paperGrain(0.05, 16); glow(540, 1100, 700, '#FFB070', 0.45);
      const dy = lerp(0, -300, eio(seg(lt, pr - 0.6, pr + 0.2)));
      ctx.save(); ctx.translate(0, dy);
      aruna(540, 1250, { s: 1.6, t, age: 0.3, aura: 0.8 + (lt > tj ? 0.4 : 0), eyes: 0, mist: 1 });
      egg(540, 1420, 250, t, { col: '#F3E2C0', open: 1, glow: 0.4 });
      ctx.restore();
      vignette(0.55);
    } });
    cue(st + tj, 'sparkle', { dur: 1, gain: 0.3 }); cue(st + pr, 'tock', { gain: 0.6 }); }

  // 12 · in pain, Aruna cursed his own mother
  { const st = cut_(12), sh = W_('श्राप', 12);
    add({ id: 'S13', at: st, cam: [540, 1000], zoom: 0.08, note: 'Aruna, now a youth, flares red; Vinata kneels with folded hands', draw(lt, d, t) {
      const f = eo(seg(lt, sh - 0.2, sh + 0.3));
      gradSky([[0, '#1A0A1A'], [0.5, lerp(0, 1, f) > 0.5 ? '#5A1420' : '#2A1430'], [1, '#3A1A20']]); paperGrain(0.05, 17);
      glow(700, 700, 800, '#FF3A2A', 0.35 * f);
      aruna(720, 1150, { s: 1.25, t, mood: 'angry', aura: 0.6 + 0.6 * f, eyes: 1, mist: 1 });
      ground('#24121A', 1440);
      devi({ x: 270, y: 1470, h: 820, t, ...VINATA, eyes: 0, pose: 'bow', dir: 1, sad: true });
      if (f > 0) godRays(720, 700, -Math.PI, Math.PI, 16, 900, '#FF6A4A', 0.3 * f, t);
      vignette(0.6);
    } });
    cue(st + sh, 'slam', { gain: 0.6 }); cue(st + sh, 'drum', { gain: 0.6 }); }

  // 13 · five hundred years you'll serve your rival
  { const st = cut_(13), ps = W_('पाँच', 13), ds = W_('दासी', 13);
    add({ id: 'S14', at: st, cam: [540, 1050], zoom: 0.08, note: 'the curse comes true: Kadru seated among Nagas, Vinata carrying a water pot; ribbon ५०० वर्ष', draw(lt, d, t) {
      gradSky(NAGALOKA); paperGrain(0.05, 18);
      for (let i = 0; i < 7; i++) naga(80 + i * 150, 1100 + (i % 2) * 40, 0.6, t, 1, '#2E5A4A', i % 2 ? 1 : -1);
      ground('#0E2620', 1400);
      cut(P_rr(560, 1220, 360, 180, 20), '#6A5A3A', { shadow: 0.7, edge: 4 }); cut(P_rr(540, 1200, 400, 40, 14), '#C9B458', { shadow: 0.3, edge: 3 });
      devi({ x: 740, y: 1400, h: 820, t, ...KADRU, eyes: 1, pose: 'stand', dir: -1, crown: true });
      const k = eo(seg(lt, ds - 0.4, ds + 0.3));
      devi({ x: lerp(160, 320, k), y: 1460, h: 760, t, ...VINATA, eyes: 0, pose: 'serve', dir: 1, sad: true });
      const hx = lerp(160, 320, k) + 95; cut(() => { ctx.beginPath(); ctx.ellipse(hx, 1460 - 470, 52, 46, 0, 0, TAU); }, '#9C5A32', { shadow: 0.5, edge: 3 });
      K.ribbon('500 वर्ष', 540, 470, eob(seg(lt, ps - 0.15, ps + 0.2)), 90);
      vignette(0.55);
    } });
    cue(st + ps, 'drum', { gain: 0.5 }); cue(st + ds, 'damru', { dur: 1, gain: 0.3 }); }

  // 14 · then he said: don't break the second egg
  { const st = cut_(14), mt = W_('मत', 14);
    add({ id: 'S15', at: st, cam: [540, 1000], zoom: 0.08, note: 'Aruna softens to gold and points at the second egg, which begins to glow', draw(lt, d, t) {
      gradSky([[0, '#1A1030'], [0.6, '#3A2450'], [1, '#6A3A4A']]); paperGrain(0.05, 19);
      aruna(330, 1130, { s: 1.1, t, aura: 1, eyes: 0, mist: 1 });
      ground('#24182A', 1420); vessel(760, 1400, 0.9, '#7A4A2A');
      const g = eo(seg(lt, mt - 0.2, mt + 0.5));
      egg(760, 1250, 90, t, { col: '#F3E2C0', glow: 0.3 + g });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba('#FFE7A0', 0.5 * g); ctx.lineWidth = 6; ctx.setLineDash([14, 14]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(430, 850); ctx.quadraticCurveTo(620, 900, 740, 1150); ctx.stroke(); ctx.restore();
      vignette(0.55);
    } });
    cue(st + mt, 'bell', { gain: 0.5 }); }

  // 15 · his son will free you
  { const st = cut_(15), mk = W_('मुक्त', 15);
    add({ id: 'S16', at: st, cam: [540, 950], zoom: 0.12, note: 'the second egg alone, huge and golden, pulsing; rays burst on मुक्त', draw(lt, d, t) {
      gradSky([[0, '#140C24'], [0.6, '#3A2040'], [1, '#5A2E3A']]); stars(t, 60, -200, 800, 20); paperGrain(0.05, 20);
      const m = eo(seg(lt, mk - 0.2, mk + 0.5)), pulse = 1 + 0.03 * Math.sin(t * 6);
      egg(540, 950, 230 * pulse, t, { col: '#F6E2B0', glow: 0.8 + m, glowCol: '#FFC060' });
      if (m > 0) godRays(540, 950, 0, TAU, 20, 1000, A.gold, 0.3 * m, t);
      motes(t, 40, [0, 300, W, 1500], A.paleGold, 0.6, 30, 6, 3); vignette(0.55);
    } });
    cue(st, 'heartbeat', { gain: 0.3 }); cue(st + mk, 'swell', { dur: 1.4, gain: 0.5 }); }

  // 16 · that second son was... Garuda himself!
  { const st = cut_(16), gr = W_('गरुड़', 16);
    add({ id: 'S17', at: st, cam: [540, 950], zoom: 0.08, note: 'the egg bursts; Garuda rises with wings unfolding; ribbon गरुड़', draw(lt, d, t) {
      gradSky([[0, '#2A0E1A'], [0.5, '#8A3A2A'], [1, '#E0782E']]); paperGrain(0.05, 21);
      const b = eo(seg(lt, gr - 0.9, gr - 0.2)), wg = eo(seg(lt, gr - 0.4, gr + 0.4));
      godRays(540, 1000, 0, TAU, 24, 1300, A.paleGold, 0.2 + 0.25 * b, t);
      if (b < 1) egg(540, 1150, 200, t, { col: '#F6E2B0', glow: 1, crack: b * 3, open: b > 0.4 ? (b - 0.4) / 0.6 : 0 });
      if (b > 0.3) garuda(540, lerp(1650, 1470, b), { s: 1.0, t, wing: wg, aura: b });
      if (lt > gr - 0.1) K.ribbon('गरुड़', 540, 360, eob(seg(lt, gr - 0.1, gr + 0.25)), 110);
      vignette(0.45);
    } });
    cue(st + gr - 0.9, 'whoosh'); cue(st + gr, 'conch', { dur: 1.8, gain: 0.6 }); cue(st + gr, 'drum', { gain: 0.6 }); }

  // 17 · who brought the amrita and freed his mother
  { const st = cut_(17), am = W_('अमृत', 17), cd = W_('छुड़ा', 17);
    add({ id: 'S18', at: st, cam: [540, 900], zoom: 0.08, note: 'Garuda flies in with the glowing amrita pot; Vinata below looks up, her hands lifted free', draw(lt, d, t) {
      gradSky([[0, '#3A1A3A'], [0.55, '#C2603A'], [1, '#F2A04A']]); paperGrain(0.05, 22);
      for (let i = 0; i < 3; i++) cloud(200 + i * 350 - lt * 30, 760 + i * 60, 0.7, '#F6C3A0', '#FFF0D8', '#C27A6A', 0.85);
      const f = eo(seg(lt, 0, 1.2));
      garuda(lerp(1100, 720, f), lerp(300, 760, f), { s: 0.62, t, wing: 1, kalash: true });
      ground('#4A2A2A', 1440);
      const free = eo(seg(lt, cd - 0.2, cd + 0.4));
      devi({ x: 300, y: 1460, h: 820, t, ...VINATA, eyes: free > 0.5 ? 1 : 0, pose: free > 0.5 ? 'boon' : 'bow', dir: 1, crown: true, glowA: free });
      if (free > 0) godRays(300, 900, -Math.PI, 0, 12, 700, A.gold, 0.3 * free, t);
      slipAt(lt, am, 'अमृत', 720, 1010, 56, 0.03);
      vignette(0.45);
    } });
    cue(st, 'whoosh'); cue(st + am, 'sparkle', { dur: 1.2, gain: 0.5 }); cue(st + cd, 'bell', { gain: 0.7 }); }

  // 18 · and Aruna?
  { const st = cut_(18);
    add({ id: 'S19', at: st, cam: [540, 1100], zoom: 0.12, note: 'empty pre-dawn horizon, one point of red light waiting', draw(lt, d, t) {
      dawnSky(t, 0.35); hills(0); glow(540, 1180, 120 + 40 * Math.sin(t * 3), '#FF8A5A', 0.8); vignette(0.55);
    } });
    cue(st, 'swell', { dur: 1.2, gain: 0.3 }); }

  // 19 · he rose into the sky and became the Sun's charioteer
  { const st = cut_(19), ak = W_('आकाश', 19), sr = W_('सारथी', 19);
    add({ id: 'S20', at: st, cam: [540, 950], zoom: 0.08, note: 'Aruna rises from the horizon into the sky; the Sun chariot sweeps in and he takes the reins on सारथी', draw(lt, d, t) {
      const k = eo(seg(lt, 0, d)); dawnSky(t, 0.4 + 0.6 * k);
      const rath = eo(seg(lt, sr - 0.8, sr + 0.1));
      if (rath < 1) { ctx.save(); ctx.globalAlpha = 1 - rath; aruna(540, lerp(1400, 900, eo(seg(lt, ak - 0.3, sr))), { s: 1.0, t, aura: 1, eyes: 0, mist: 1 }); ctx.restore(); }
      if (rath > 0) { ctx.save(); ctx.globalAlpha = rath; suryaRath(lerp(-200, 470, rath), 1150, 0.95, t, { sunR: 280 }); ctx.restore(); }
      hills(-lt * 10);
      slipAt(lt, sr, 'सूर्य के सारथी', 640, 420, 54, 0.03); vignette(0.45);
    } });
    cue(st + ak, 'whoosh'); cue(st + sr, 'conch', { dur: 1.8, gain: 0.5 }); }

  // 20 · that is why the dawn's red is called Arunodaya
  { const st = cut_(20), ao = W_('अरुणोदय', 20);
    add({ id: 'S21', at: st, cam: [540, 1000], zoom: 0.1, note: 'the loop: same dawn hills, now the sun rising; ribbon अरुणोदय', draw(lt, d, t) {
      dawnSky(t, 1); const sr = eo(seg(lt, 0, d));
      glow(540, lerp(1300, 1150, sr), 500, '#FFD08A', 0.6); cut(P_circ(540, lerp(1330, 1180, sr), 150), '#FFD87A', { shadow: 0, edge: 0 });
      hills(-lt * 6); birds(lt, 260, 820, 6, '#2A1020', 1.1); godRays(540, 1180, -Math.PI, 0, 16, 1300, A.paleGold, 0.22, t);
      if (lt > ao - 0.15) K.ribbon('अरुणोदय', 540, 520, eob(seg(lt, ao - 0.15, ao + 0.2)), 110);
      mist(1320, 160, '#F2964A', 0.2, t, 1); vignette(0.45);
    } });
    cue(st + ao, 'bell', { gain: 0.9 }); cue(st + ao, 'drum', { gain: 0.4 }); }

  // 21-22 · end card
  { const st = cut_(21), f = Wd('फ़ॉलो', 22) - st;
    add({ id: 'S22', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: the Sun chariot small in a red dawn; Untold Stories in gold', draw(lt, d, t) {
      dawnSky(t, 1); hills(0);
      suryaRath(500, 1240, 0.55, t, { sunR: 260 });
      glow(540, 640, 600, A.gold, 0.15);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 440, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 590, 80, '#FFD2B8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 740, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.45 }); cue(st + f, 'drum', { gain: 0.5 }); }

  return { shots: S, cues: CUES };
}
