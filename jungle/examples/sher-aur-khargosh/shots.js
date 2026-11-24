// शेर एक खरगोश से कैसे हार गया? Panchatantra: Bhasuraka the lion and the clever rabbit. Bright cut-paper cartoon jungle.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { glow, rgba, motes, vignette } from './atmos.js';
import { lion, rabbit, deer, monkey, elephant, well, jungle, bubble, burst, flap } from './animals.js';
const { cut, P_rr } = K;

const DUSK = { sky: [[0, '#3A2A5A'], [0.55, '#C8605A'], [1, '#F2B46A']], sunCol: '#FFB070', sunY: 900 };
const ANGRYSKY = { sky: [[0, '#5A1E1E'], [0.6, '#B8502A'], [1, '#E8904A']], sun: false, dark: ['#6A5A2A', '#4A4A26', '#2E3A1E'], ground: '#7A8A3A' };
const SUNNY = { sky: [[0, '#7EC8E3'], [0.6, '#FFE6A0'], [1, '#FFD07A']], sunY: 500 };
function bigText(text, x, y, size, col, stroke = '#FFFFFF') { ctx.font = `800 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 14; ctx.strokeStyle = stroke; ctx.strokeText(text, x, y); ctx.fillStyle = col; ctx.fillText(text, x, y); }
const pop = (lt, w, d = 0.3) => eob(seg(lt, w - 0.05, w - 0.05 + d));
function crown(x, y, s, cross = false) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); cut(() => { ctx.beginPath(); ctx.moveTo(-90, 45); ctx.lineTo(-90, -35); ctx.lineTo(-45, 10); ctx.lineTo(0, -55); ctx.lineTo(45, 10); ctx.lineTo(90, -35); ctx.lineTo(90, 45); ctx.closePath(); }, '#FFD84A', { shadow: 0.5, edge: 3 }); if (cross) { ctx.strokeStyle = '#C8302A'; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(-110, -70); ctx.lineTo(110, 70); ctx.stroke(); } ctx.restore(); }
const BRAND = () => (window.OP && window.OP.script && window.OP.script.brand) || 'Jungle Ki Kahaniyan';

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · hook: huge lion vs tiny rabbit, KO stars on हार
  { const hr = W_('हार', 0);
    add({ id: 'S01', at: 0, cam: [540, 1100], zoom: 0.12, note: 'face-off: huge lion left, tiny sly rabbit right, dizzy stars over the lion on हार', draw(lt, d, t) {
      jungle(t, ANGRYSKY);
      lion({ x: 330, y: 1560, s: 1.25, t, dir: 1, mood: lt > hr ? 'scared' : 'angry', talk: lt < 0.8 ? flap(lt, 0, 0.8) : 0 });
      rabbit({ x: 820, y: 1560, s: 1.0, t, dir: -1, mood: 'sly' });
      if (lt > hr) { for (let i = 0; i < 5; i++) { const a = t * 4 + i * TAU / 5; bigText('★', 420 + Math.cos(a) * 120, 650 + Math.sin(a) * 40, 60, '#FFD84A', '#8A5A00'); } K.slip('हार गया!', 540, 380, pop(lt, hr), -0.05, 70); }
      vignette(0.35);
    } });
    cue(0, 'drum', { gain: 0.8 }); cue(0.3, 'boing'); cue(hr, 'slam', { gain: 0.7 }); }

  // 1 · but how? storybook title card
  { const ks = W_('कैसे', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 950], zoom: 0.08, note: 'storybook page over the jungle, big ? then the title', draw(lt, d, t) {
      jungle(t, { px: -lt * 30 });
      ctx.save(); ctx.translate(540, 900); ctx.rotate(-0.03); cut(P_rr(-420, -330, 840, 660, 30), '#FFF6E0', { shadow: 1, edge: 6 }); ctx.restore();
      if (lt > ks - 0.1) { ctx.save(); ctx.translate(540, 760); const p = pop(lt, ks); ctx.scale(p, p); bigText('?', 0, 0, 260, '#C8302A'); ctx.restore(); }
      bigText('शेर और चतुर खरगोश', 540, 1010, 66, '#3A6A2A');
      rabbit({ x: 780, y: 1240, s: 0.45, t, dir: -1, mood: 'happy' }); lion({ x: 320, y: 1240, s: 0.4, t, dir: 1, mood: 'happy' });
    } });
    cue(cut_(1), 'whoosh'); cue(cut_(1) + ks, 'pop'); }

  // 2 · in a dense jungle lived Bhasuraka
  { const sh = W_('शेर', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 1100], zoom: 0.1, note: 'pan through the jungle; the lion walks in proudly, name slip', draw(lt, d, t) {
      jungle(t, { px: -lt * 60 });
      const k = eo(seg(lt, 0, 2)); lion({ x: lerp(-200, 470, k), y: 1580, s: 1.15, t, dir: 1, mood: 'happy', walk: k < 1 });
      K.slip('भासुरक', 540, 420, pop(lt, sh), -0.04, 64);
      motes(t, 14, [0, 600, W, 1400], '#FFF6C8', 0.5, 20, 2, 4);
    } });
    cue(cut_(2), 'whoosh'); cue(cut_(2) + sh, 'drum', { gain: 0.5 }); }

  // 3 · very proud, hunted many animals every day
  { const gh = W_('घमंडी', 3), sk = W_('शिकार', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 1100], zoom: 0.1, note: 'lion puffs up, a crown pops on; on शिकार animals flee across the frame', draw(lt, d, t) {
      jungle(t, ANGRYSKY);
      lion({ x: 540, y: 1600, s: 1.3, t, dir: 1, mood: lt > sk ? 'angry' : 'happy', talk: lt > sk ? flap(lt, sk, sk + 0.8) : 0 });
      if (lt > gh) { const p = pop(lt, gh); crown(730, lerp(400, 640, p), p); }
      if (lt > sk) { const r = seg(lt, sk, d); deer({ x: lerp(1300, -300, r), y: 1700, s: 0.55, t, dir: -1, mood: 'scared', walk: true }); monkey({ x: lerp(1500, -200, r), y: 1750, s: 0.6, t, dir: -1, mood: 'scared', walk: true }); }
      if (lt > gh) K.slip('घमंडी', 300, 420, pop(lt, gh), -0.05, 60);
    } });
    cue(cut_(3) + gh, 'sparkle', { dur: 0.8, gain: 0.5 }); cue(cut_(3) + sk, 'slam', { gain: 0.6 }); cue(cut_(3) + sk + 0.2, 'slide'); }

  // 4 · frightened animals called a meeting
  { const sb = W_('सभा', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 1150], zoom: 0.08, note: 'dusk meeting: elephant, deer, monkey, rabbit, worried', draw(lt, d, t) {
      jungle(t, DUSK);
      elephant({ x: 230, y: 1560, s: 0.75, t, dir: 1, mood: 'sad' }); deer({ x: 860, y: 1580, s: 0.7, t, dir: -1, mood: 'scared' });
      monkey({ x: 520, y: 1600, s: 0.75, t, dir: 1, mood: 'scared', talk: flap(lt, sb - 0.6, sb + 0.4) }); rabbit({ x: 700, y: 1640, s: 0.6, t, dir: -1, mood: 'sad' });
      if (lt > sb) K.slip('सभा', 540, 420, pop(lt, sb), 0.03, 64);
    } });
    cue(cut_(4), 'tock'); cue(cut_(4) + sb, 'bell', { gain: 0.4 }); }

  // 5 · "Maharaj, we'll send one animal every day"
  { const mh = W_('महाराज', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 1100], zoom: 0.06, note: 'the elephant speaks up to the lion on his rock; speech bubble', draw(lt, d, t) {
      jungle(t, { px: 40 });
      cut(P_rr(560, 1280, 520, 300, 80), '#8A8070', { shadow: 0.8, edge: 4 });
      lion({ x: 820, y: 1300, s: 1.0, t, dir: -1, mood: 'happy' });
      elephant({ x: 260, y: 1680, s: 0.8, t, dir: 1, mood: 'scared', talk: flap(lt, mh - 0.2, d - 0.3) }); deer({ x: 130, y: 1720, s: 0.5, t, dir: 1, mood: 'scared' });
      if (lt > mh + 0.75) bubble('रोज़ एक जानवर!', 360, 760, pop(lt, mh + 0.8), -40, 52);
    } });
    cue(cut_(5) + mh, 'pop'); }

  // 6 · the lion agreed — but food on time!
  { const mg = W_('मान', 6), wq = W_('वक़्त', 6);
    add({ id: 'S07', at: cut_(6), cam: [600, 900], zoom: 0.16, note: 'close on the lion: nods, then a ticking clock on वक़्त', draw(lt, d, t) {
      jungle(t, { px: 40 });
      lion({ x: 520, y: 1650, s: 1.55, t, dir: 1, mood: lt > wq ? 'angry' : 'happy', talk: flap(lt, wq - 0.6, d - 0.2) });
      if (lt > wq) { const p = pop(lt, wq); ctx.save(); ctx.translate(820, 520); ctx.scale(p, p); circle(0, 0, 110, '#FFFFFF'); ctx.strokeStyle = '#2A1C14'; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 110, 0, TAU); ctx.stroke(); const a = t * 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 80, Math.sin(a) * 80); ctx.moveTo(0, 0); ctx.lineTo(0, -55); ctx.stroke(); ctx.restore(); }
      if (lt > mg) K.slip('ठीक है!', 300, 400, pop(lt, mg), -0.05, 58);
    } });
    cue(cut_(6) + mg, 'boing', { gain: 0.6 }); cue(cut_(6) + wq, 'alarm', { gain: 0.5 }); }

  // 7 · one day it was the little rabbit's turn
  { const br = W_('बारी', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 1200], zoom: 0.1, note: 'a spotlight falls on the tiny rabbit on बारी', draw(lt, d, t) {
      jungle(t, DUSK);
      monkey({ x: 200, y: 1600, s: 0.7, t, dir: 1, mood: 'sad' }); deer({ x: 900, y: 1600, s: 0.65, t, dir: -1, mood: 'sad' });
      if (lt > br) { ctx.save(); ctx.globalAlpha = 0.5 * eo(seg(lt, br, br + 0.3)); const g = ctx.createLinearGradient(540, 0, 540, 1650); g.addColorStop(0, 'rgba(255,250,210,0)'); g.addColorStop(1, 'rgba(255,250,210,0.9)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(440, -100); ctx.lineTo(640, -100); ctx.lineTo(760, 1680); ctx.lineTo(320, 1680); ctx.fill(); ctx.restore(); }
      rabbit({ x: 540, y: 1660, s: 0.85, t, dir: 1, mood: 'scared' });
      if (lt > br) K.slip('खरगोश की बारी', 540, 420, pop(lt, br), 0.03, 58);
    } });
    cue(cut_(7) + br, 'tock', { gain: 0.9 }); cue(cut_(7) + br + 0.1, 'heartbeat', { gain: 0.6 }); }

  // 8 · he thought — and found a trick (lightbulb)
  { const sc = W_('सोचा', 8), tk = W_('तरकीब', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 1100], zoom: 0.14, note: 'thought dots, then a glowing lightbulb on तरकीब; sly grin', draw(lt, d, t) {
      jungle(t, { px: -20 });
      rabbit({ x: 540, y: 1650, s: 1.35, t, dir: 1, mood: lt > tk ? 'sly' : 'happy' });
      if (lt > sc) for (let i = 0; i < 3; i++) if (lt > sc + i * 0.2) circle(640 + i * 50, 950 - i * 60, 14 + i * 6, '#FFFFFF');
      if (lt > tk) { const p = pop(lt, tk); ctx.save(); ctx.translate(820, 700); ctx.scale(p, p); glow(0, 0, 220, '#FFF2A0', 0.9); circle(0, 0, 80, '#FFE66A'); cut(P_rr(-36, 70, 72, 50, 10), '#9A9A9A', { shadow: 0.3, edge: 2 }); ctx.restore(); K.slip('तरकीब!', 300, 420, pop(lt, tk), -0.05, 64); }
    } });
    cue(cut_(8) + sc, 'pop', { gain: 0.5 }); cue(cut_(8) + tk, 'sparkle', { dur: 1, gain: 0.6 }); cue(cut_(8) + tk, 'bell', { gain: 0.5 }); }

  // 9 · he arrived very late on purpose — sun races across the sky
  { const dr = W_('देर', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 1100], zoom: 0.08, note: 'rabbit strolls lazily, sun races down the sky (time passing), zzz', draw(lt, d, t) {
      const k = seg(lt, 0, d); jungle(t, { sky: [[0, '#7EC8E3'], [0.6, '#F2C48A'], [1, '#F2A06A']], sunX: lerp(200, 900, k), sunY: lerp(300, 900, k), px: -lt * 40 });
      rabbit({ x: lerp(200, 700, k), y: 1650, s: 0.9, t, dir: 1, mood: 'sly', walk: true });
      if (lt > dr) K.slip('बहुत देर से...', 540, 420, pop(lt, dr), 0.03, 58);
      for (let i = 0; i < 3; i++) bigText('z', 760 + i * 40 + Math.sin(t * 3 + i) * 10, 1000 - i * 60, 50 + i * 12, '#3A6A8A');
    } });
    cue(cut_(9), 'slide'); cue(cut_(9) + dr, 'tock'); }

  // 10 · lion roars: why so late? such small food?
  { const dh = W_('दहाड़ा', 10), ch = W_('छोटा', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 1000], zoom: 0.2, note: 'huge roaring lion, wind lines at the rabbit; "ग्र्र्र!" burst', draw(lt, d, t) {
      jungle(t, ANGRYSKY);
      lion({ x: 380, y: 1650, s: 1.6, t, dir: 1, mood: 'angry', talk: lt > dh - 0.1 ? 0.6 + 0.4 * flap(lt, dh, d, 16) : 0 });
      rabbit({ x: 880, y: 1660, s: 0.7, t, dir: -1, mood: 'scared' });
      if (lt > dh) { ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 8; for (let i = 0; i < 6; i++) { const y = 900 + i * 90, x0 = 620 + ((t * 900 + i * 80) % 300); ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 160, y); ctx.stroke(); } burst('ग्र्र्र!', 760, 520, pop(lt, dh) * 0.75); }
      if (lt > ch) bubble('इतना छोटा?!', 330, 340, pop(lt, ch), 20, 52);
    } });
    cue(cut_(10) + dh, 'drum', { gain: 1.0 }); cue(cut_(10) + dh, 'whoosh', { gain: 0.8 }); cue(cut_(10) + ch, 'boing'); }

  // 11 · rabbit: we met ANOTHER lion on the way
  { const ds = W_('दूसरा', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 1150], zoom: 0.1, note: 'rabbit talks; thought cloud shows a second lion on दूसरा', draw(lt, d, t) {
      jungle(t, DUSK);
      lion({ x: 260, y: 1620, s: 1.0, t, dir: 1, mood: 'angry' });
      rabbit({ x: 760, y: 1650, s: 1.0, t, dir: -1, mood: 'sly', talk: flap(lt, 0.3, d - 0.2) });
      if (lt > ds) { const p = pop(lt, ds); ctx.save(); ctx.translate(700, 650); ctx.scale(p, p); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 260, 190, 0, 0, TAU); }, '#FFFFFF', { shadow: 0.5, edge: 3 }); lion({ x: -20, y: 160, s: 0.55, t, dir: -1, mood: 'angry' }); ctx.restore(); bigText('दूसरा शेर?!', 700, 380, 56, '#C8302A'); }
    } });
    cue(cut_(11) + ds, 'pop'); cue(cut_(11) + ds + 0.1, 'swell', { dur: 0.8, gain: 0.4 }); }

  // 12 · he says HE is the real king
  { const as = W_('असली', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 1000], zoom: 0.1, note: 'our lion\'s jaw drops; a crossed-out crown', draw(lt, d, t) {
      jungle(t, ANGRYSKY);
      lion({ x: 540, y: 1620, s: 1.35, t, dir: 1, mood: lt > as ? 'scared' : 'angry', talk: lt > as ? 0.9 : 0 });
      if (lt > as) { K.slip('असली राजा?!', 540, 420, pop(lt, as), -0.04, 64); crown(540, 640, pop(lt, as), true); }
    } });
    cue(cut_(12) + as, 'slam', { gain: 0.6 }); }

  // 13 · the lion's anger hits the sky
  { const gs = W_('गुस्सा', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 900], zoom: 0.18, note: 'lion turns red, steam from the ears', draw(lt, d, t) {
      jungle(t, ANGRYSKY); const k = eo(seg(lt, gs - 0.3, gs + 0.6));
      lion({ x: 540, y: 1640, s: 1.5, t, dir: 1, mood: 'angry', talk: 0.5 });
      if (k > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35 * k; ctx.fillStyle = '#FF3A2A'; ctx.fillRect(0, 0, W, H); ctx.restore();
        for (const dx of [-1, 1]) for (let i = 0; i < 5; i++) { const ph = (t * 1.5 + i * 0.2) % 1; circle(540 + 140 + dx * 160 + dx * ph * 120, 640 - ph * 420, 30 + ph * 50, `rgba(255,255,255,${0.8 * (1 - ph) * k})`); }
        K.slip('गुस्सा!', 540, 360, pop(lt, gs), 0.04, 70); }
    } });
    cue(cut_(13) + gs, 'sizzle', { gain: 0.8 }); cue(cut_(13) + gs, 'drum', { gain: 0.6 }); }

  // 14 · "come on, show me that lion!"
  { const dk = W_('दिखाओ', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 1100], zoom: 0.06, note: 'lion stomps forward, rabbit hops ahead', draw(lt, d, t) {
      jungle(t, { ...DUSK, px: -lt * 120 });
      lion({ x: 380, y: 1620, s: 1.05, t, dir: 1, mood: 'angry', walk: true, talk: flap(lt, 0, d) });
      rabbit({ x: 820, y: 1650 - Math.abs(Math.sin(t * 6)) * 60, s: 0.75, t, dir: 1, mood: 'sly' });
      if (lt > dk) bubble('दिखाओ उसे!', 360, 640, pop(lt, dk), 0, 54);
    } });
    cue(cut_(14), 'whoosh'); cue(cut_(14) + 0.2, 'thud', { gain: 0.5 }); cue(cut_(14) + 0.7, 'thud', { gain: 0.5 }); }

  // 15 · to a deep well
  { const kw = W_('कुएँ', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 1150], zoom: 0.1, note: 'clearing with an old stone well, rabbit points at it', draw(lt, d, t) {
      jungle(t, DUSK);
      well(560, 1500, 1.15, t);
      rabbit({ x: 900, y: 1660, s: 0.75, t, dir: -1, mood: 'sly' }); lion({ x: 170, y: 1640, s: 0.85, t, dir: 1, mood: 'angry' });
      if (lt > kw) K.slip('गहरा कुआँ', 560, 420, pop(lt, kw), 0.03, 60);
    } });
    cue(cut_(15) + kw, 'bubbles', { gain: 0.7 }); }

  // 16 · "he hides inside this fortress"
  { const kl = W_('किले', 16);
    add({ id: 'S17', at: cut_(16), cam: [700, 1000], zoom: 0.12, note: 'rabbit on the well rim whispering', draw(lt, d, t) {
      jungle(t, DUSK);
      well(500, 1650, 1.25, t);
      rabbit({ x: 810, y: 1240, s: 0.85, t, dir: -1, mood: 'sly', talk: flap(lt, 0.1, d - 0.3) });
      if (lt > kl) bubble('वो अंदर छिपा है...', 600, 640, pop(lt, kl), 140, 50);
    } });
    cue(cut_(16) + 0.1, 'pop', { gain: 0.5 }); cue(cut_(16) + kl, 'heartbeat', { gain: 0.5 }); }

  // 17 · the lion peeks in — another angry lion in the water
  { const jk = W_('झाँका', 17), gw = W_('गुस्से', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 900], zoom: 0.18, note: 'top-down into the well: a lion face appears in the rippling water and snarls', draw(lt, d, t) {
      ctx.fillStyle = '#4A4238'; ctx.fillRect(0, 0, W, H);
      ctx.save(); ctx.translate(540, 1000); for (let r = 6; r >= 0; r--) { ctx.fillStyle = r % 2 ? '#7A7060' : '#6A6050'; ctx.beginPath(); ctx.arc(0, 0, 420 + r * 40, 0, TAU); ctx.fill(); } ctx.restore();
      ctx.save(); ctx.beginPath(); ctx.arc(540, 1000, 400, 0, TAU); ctx.clip();
      const g = ctx.createRadialGradient(540, 1000, 50, 540, 1000, 400); g.addColorStop(0, '#2A5A6A'); g.addColorStop(1, '#081820'); ctx.fillStyle = g; ctx.fillRect(0, 500, W, 1000);
      if (lt > jk - 0.2) { ctx.save(); ctx.globalAlpha = 0.85 * eo(seg(lt, jk - 0.2, jk + 0.6)); ctx.translate(540 + Math.sin(t * 3) * 8, 1000); lion({ x: -150, y: 520, s: 1.0, t, dir: 1, mood: lt > gw ? 'angry' : 'happy', talk: lt > gw ? 0.8 : 0 }); ctx.restore(); }
      ctx.strokeStyle = 'rgba(200,230,255,0.3)'; ctx.lineWidth = 4; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(540, 1000, (t * 120 + i * 100) % 400, 0, TAU); ctx.stroke(); }
      ctx.restore();
      if (lt > gw) burst('एक और शेर!', 540, 420, pop(lt, gw) * 0.7, '#FFD84A', 90);
    } });
    cue(cut_(17) + jk, 'bubbles', { gain: 0.6 }); cue(cut_(17) + gw, 'slam', { gain: 0.8 }); }

  // 18 · it was his own reflection!
  { const pc = W_('परछाईं', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 1000], zoom: 0.1, note: 'real lion above, mirrored reflection below the water line; rabbit giggles', draw(lt, d, t) {
      jungle(t, DUSK);
      lion({ x: 400, y: 1000, s: 0.95, t, dir: 1, mood: 'angry' });
      ctx.fillStyle = 'rgba(20,60,80,0.85)'; ctx.fillRect(0, 1010, W, 900);
      ctx.save(); ctx.translate(0, 2020); ctx.scale(1, -1); ctx.globalAlpha = 0.6; lion({ x: 400, y: 1000, s: 0.95, t, dir: 1, mood: 'angry' }); ctx.restore();
      ctx.strokeStyle = 'rgba(200,230,255,0.4)'; ctx.lineWidth = 4; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(0, 1060 + i * 90 + Math.sin(t * 3 + i) * 8); ctx.lineTo(W, 1060 + i * 90 + Math.cos(t * 3 + i) * 8); ctx.stroke(); }
      rabbit({ x: 860, y: 1000, s: 0.6, t, dir: -1, mood: 'happy', talk: flap(lt, pc, d) });
      if (lt > pc) bigText('अपनी परछाईं!', 540, 380, 80, '#C8302A');
    } });
    cue(cut_(18) + pc, 'sparkle', { dur: 1, gain: 0.6 }); cue(cut_(18) + pc, 'bell', { gain: 0.6 }); }

  // 19 · he roared and jumped in
  { const kd = W_('कूद', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 1100], zoom: 0.08, note: 'lion leaps in an arc into the well on कूद', draw(lt, d, t) {
      jungle(t, ANGRYSKY);
      well(540, 1700, 1.3, t);
      const k = eio(seg(lt, kd - 0.7, kd + 0.25)); if (k < 1) { ctx.save(); const x = lerp(120, 540, k), y = lerp(1500, 1450, k) - Math.sin(k * Math.PI) * 600; ctx.translate(x, y); ctx.rotate(k * 1.6); lion({ x: 0, y: 0, s: 0.8 * (1 - 0.4 * k), t, dir: 1, mood: 'angry', talk: 0.8 }); ctx.restore(); }
      rabbit({ x: 930, y: 1660, s: 0.6, t, dir: -1, mood: 'scared' });
    } });
    cue(cut_(19), 'drum', { gain: 0.8 }); cue(cut_(19) + kd - 0.6, 'whoosh'); }

  // 20 · SPLASH! from that day all were free
  { const ch = W_('छपाक', 20), az = W_('आज़ाद', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 1000], zoom: 0.08, note: 'giant splash, then animals dance in the sunshine on आज़ाद', draw(lt, d, t) {
      if (lt < az - 0.2) { jungle(t, DUSK); well(540, 1650, 1.3, t); for (let i = 0; i < 26; i++) { const a = -Math.PI / 2 + (rnd(i) - 0.5) * 1.6, ph = seg(lt, ch - 0.1, ch + 1.2), r = ph * (300 + rnd(i + 5) * 400); circle(540 + Math.cos(a) * r, 1380 + Math.sin(a) * r + ph * ph * 400, 18 + rnd(i) * 20, rgba('#8AD0F0', 1 - ph * 0.6)); } if (lt > ch - 0.1) burst('छपाक!', 540, 600, pop(lt, ch), '#8AD0F0', 120); }
      else { jungle(t, SUNNY);
        const hop = (i) => Math.abs(Math.sin(t * 6 + i)) * 50;
        elephant({ x: 170, y: 1600 - hop(0), s: 0.6, t, dir: 1, mood: 'happy' }); deer({ x: 420, y: 1620 - hop(1), s: 0.55, t, dir: 1, mood: 'happy' }); monkey({ x: 650, y: 1640 - hop(2), s: 0.6, t, dir: -1, mood: 'happy' }); rabbit({ x: 870, y: 1650 - hop(3), s: 0.7, t, dir: -1, mood: 'happy' });
        for (let i = 0; i < 40; i++) { const ph = ((t * 0.5 + rnd(i)) % 1); circle(rnd(i + 2) * W, ph * 1500, 10, ['#F28AB0', '#FFD84A', '#8AD0F0', '#9AE06A'][i % 4]); }
        K.slip('सब आज़ाद!', 540, 400, pop(lt, az), 0.04, 66); }
    } });
    cue(cut_(20) + ch, 'plop', { gain: 1.0 }); cue(cut_(20) + ch, 'bubbles', { gain: 0.8 }); cue(cut_(20) + az, 'sparkle', { dur: 1.2, gain: 0.6 }); cue(cut_(20) + az, 'bell', { gain: 0.6 }); }

  // 21 · moral: wisdom is bigger than strength
  { const bd = W_('बुद्धि', 21);
    add({ id: 'S22', at: cut_(21), cam: [540, 950], zoom: 0.08, note: 'moral card: balance scale, rabbit side (बुद्धि) outweighs the lion side (ताक़त)', draw(lt, d, t) {
      jungle(t, SUNNY);
      K.ribbon('सीख', 540, 330, pop(lt, 0.1), 110);
      const tilt = 0.25 * eo(seg(lt, bd, bd + 0.6));
      ctx.save(); ctx.translate(540, 900); cut(P_rr(-14, 0, 28, 480, 8), '#8A6440', { shadow: 0.5, edge: 2 }); ctx.rotate(tilt); cut(P_rr(-380, -14, 760, 28, 10), '#A87A4A', { shadow: 0.5, edge: 2 }); ctx.restore();
      const ly = 900 - Math.sin(tilt) * 330, ry = 900 + Math.sin(tilt) * 330;
      lion({ x: 210, y: ly - 10, s: 0.42, t, dir: 1, mood: 'sad' }); rabbit({ x: 880, y: ry - 10, s: 0.5, t, dir: -1, mood: 'happy' });
      if (lt > bd) { bigText('बुद्धि', 880, ry - 330, 70, '#2A6A2A'); bigText('ताक़त', 210, ly - 300, 56, '#8A5A3A'); }
      bigText('बुद्धि > ताक़त', 540, 1460, 84, '#C8302A');
    } });
    cue(cut_(21), 'bell', { gain: 0.8 }); cue(cut_(21) + bd, 'boing'); }

  // 22-23 · comment ask + follow (end card)
  { const st = cut_(22), cm = Wd('कमेंट', 22) - st, fl = Wd('फ़ॉलो', 23) - st;
    add({ id: 'S23', at: st, cam: [540, 950], zoom: 0.05, note: 'end card: rabbit waving, channel name, "कमेंट में बताइए 👇", follow button', draw(lt, d, t) {
      jungle(t, {});
      rabbit({ x: 300, y: 1600, s: 1.0, t, dir: 1, mood: 'happy', talk: flap(lt, 0, d - 0.5) }); lion({ x: 800, y: 1580, s: 0.75, t, dir: -1, mood: 'happy' });
      bigText(BRAND(), 540, 430, 92, '#2A6A2A');
      if (lt > cm) K.slip('कमेंट में बताइए 👇', 540, 640, pop(lt, cm), -0.03, 58);
      if (lt > fl) { const p = pop(lt, fl); ctx.save(); ctx.translate(540, 820); ctx.scale(p, p); cut(P_rr(-230, -60, 460, 120, 60), '#E0302A', { shadow: 0.6, edge: 3 }); ctx.font = '800 56px Martel'; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('फ़ॉलो करें', 0, 6); ctx.restore(); }
    } });
    cue(st, 'pop'); cue(st + cm, 'pop'); cue(st + fl, 'bell', { gain: 0.7 }); }

  return { shots: S, cues: CUES };
}
