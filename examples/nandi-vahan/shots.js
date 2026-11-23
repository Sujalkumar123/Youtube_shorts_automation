// लोग नंदी के कान में क्या कहते हैं? The untold story of Nandi — cinematic cut paper.
// Shiva Purana, Shatarudra Samhita 6-7; Linga Purana 1.42-44.
// Palette: temple night amber (hook) → ashram forest dusk → boon gold → dawn field rose → prophecy slate →
// grief rain indigo → river night teal (tapas) → storm → Kailash divine gold → temple dusk saffron.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky, cloud, diya, water, palm } from './atmos.js';
import { raja, devi, shiva, rishi, shivling, lightning, rain } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const TEMPLE = [[0, '#0A0508'], [0.5, '#2A1208'], [0.85, '#6A3210'], [1, '#A8581A']];
const FOREST = [[0, '#06140E'], [0.5, '#163A26'], [0.85, '#4A6A3A'], [1, '#C89A5A']];
const BOON = [[0, '#2A1206'], [0.5, '#8A4A12'], [1, '#F6C860']];
const ROSE = [[0, '#2A1A3A'], [0.45, '#8A3A5A'], [0.8, '#F08A6A'], [1, '#FFD8A0']];
const SLATE = [[0, '#05070E'], [0.5, '#161C2E'], [1, '#34405A']];
const GRIEF = [[0, '#03050E'], [0.5, '#0E1430'], [1, '#22305A']];
const RIVER = [[0, '#020A10'], [0.5, '#0A2A34'], [1, '#1E5A60']];
const MOON = [[0, '#060A1E'], [0.45, '#13204A'], [0.8, '#2A3C72'], [1, '#4A5E92']];
const SAFFRON = [[0, '#1A0A10'], [0.45, '#5A1E2A'], [0.75, '#D2603A'], [1, '#FFB060']];
const COSMIC_GOLD = [[0, '#03020C'], [0.45, '#1A0E3A'], [0.8, '#5A2E4A'], [1, '#C8803A']];
const KID = { robe: '#F2EEE6', sash: '#E28A2A' };

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function qmark(lt, w, x, y, size = 220) { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, '#FCE7B0'); ctx.restore(); } }
function ribbonAt(lt, w, text, x, y, size = 110) { if (lt > w - 0.15) K.ribbon(text, x, y, eob(seg(lt, w - 0.15, w + 0.2)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }
function ring(lt, w, x, y, col = '#FFE6A0', len = 0.9, R = 900) { if (lt > w && lt < w + len) { const k = seg(lt, w, w + len); ctx.save(); ctx.strokeStyle = rgba(col, 0.8 * (1 - k)); ctx.lineWidth = 30 * (1 - k) + 4; ctx.beginPath(); ctx.ellipse(x, y, R * eo(k), R * 0.4 * eo(k), 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
function clouds(t, cols, px = 0, a = 0.85) { for (const [cx, cy, s] of [[180, 420, 1.2], [880, 300, 1.0], [600, 1250, 1.4], [120, 1100, 0.9], [1000, 980, 1.1]]) cloud(((cx - px) % 1500 + 1500) % 1500 - 200, cy, s, cols[0], cols[1], cols[2], a); }
function kailashPeak(px = 0, py = 0, rot = 0, col = '#6A7CAE', snow = '#F2F5FF') {
  ctx.save(); ctx.translate(540 + px, 1250 + py); ctx.rotate(rot); ctx.translate(-540, -1250);
  cut(P_poly([[60, 1250], [380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [1020, 1250]]), col, { shadow: 0.8, edge: 4 });
  cut(P_poly([[380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [640, 740], [590, 790], [540, 730], [490, 790], [440, 740]]), snow, { shadow: 0.3, edge: 3 });
  ctx.restore();
}
function om(x, y, size, a, col = '#FFE6A0') { ctx.save(); ctx.globalAlpha = a; glow(x, y, size, col, 0.4); bigText('ॐ', x, y, size, col); ctx.restore(); }
function sound(x, y, t, a = 1, dir = 1, col = '#FFE6A0') { ctx.save(); ctx.lineCap = 'round'; for (let i = 0; i < 4; i++) { const k = (t * 0.9 + i / 4) % 1; ctx.strokeStyle = rgba(col, a * (1 - k) * 0.9); ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(x, y, 30 + k * 150, dir > 0 ? -0.6 : Math.PI - 0.6, dir > 0 ? 0.6 : Math.PI + 0.6); ctx.stroke(); } ctx.restore(); }
function beam(x0, y0, x1, y1, a, t) { if (a <= 0) return; ctx.save(); const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, rgba('#FFE6A0', 0.7 * a)); g.addColorStop(1, rgba('#FFF6D8', 0.3 * a)); ctx.strokeStyle = g; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.setLineDash([2, 30]); ctx.lineDashOffset = -t * 120; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); ctx.restore(); }
function petals(t, n = 26, seed = 1, a = 0.9) { for (let i = 0; i < n; i++) { const k = (t * (0.12 + 0.08 * rnd(i + seed)) + rnd(i * 3 + seed)) % 1; const x = rnd(i + 11 + seed) * W + Math.sin(t * 2 + i) * 40, y = -100 + k * 1700; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(t * 2 + i); cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, TAU); }, i % 3 ? '#F2A23A' : '#E8566A', { shadow: 0, edge: 0 }); ctx.restore(); } }

// ---------- new kit ----------
// Nandi the bull, seated (folded legs), facing +x (dir -1 faces left). Base at (x, y), ~620 wide x 440 tall at s=1.
// o = { t, glowEar 0..1, aura 0..1, garland 1, eyes 0..1 (0 = serene closed), col, dir }
// local landmarks (s=1, dir 1): ear (206,-286), eye (284,-250), muzzle (310,-136).
export function nandiBull(x, y, s, o = {}) {
  const t = o.t || 0, col = o.col || '#EDE7DA', sh = '#C9C1B0', dark = '#3A2A22', dir = o.dir || 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  if (o.aura) glow(60, -220, 420, '#FFE6A0', 0.35 * o.aura);
  ctx.strokeStyle = sh; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-250, -140); ctx.quadraticCurveTo(-320, -60, -260, -16); ctx.stroke(); circle(-256, -14, 16, dark);
  cut(() => { ctx.beginPath(); ctx.ellipse(-20, -150, 260, 128, 0, 0, TAU); }, col, { shadow: 0.7, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(-150, -40, 110, 44, 0, 0, TAU); }, sh, { shadow: 0.4, edge: 3 });
  cut(() => { ctx.beginPath(); ctx.ellipse(120, -36, 120, 40, 0, 0, TAU); }, sh, { shadow: 0.4, edge: 3 });
  for (const hx of [-60, 220]) cut(P_rr(hx, -32, 70, 30, 12), dark, { shadow: 0.2, edge: 0 });
  cut(() => { ctx.beginPath(); ctx.moveTo(-150, -270); ctx.quadraticCurveTo(-30, -300, 80, -262); ctx.lineTo(60, -130); ctx.quadraticCurveTo(-40, -110, -140, -140); ctx.closePath(); }, '#A8322D', { shadow: 0.3, edge: 3 });
  ctx.strokeStyle = '#E2B24A'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-140, -150); ctx.quadraticCurveTo(-40, -122, 62, -142); ctx.stroke();
  for (let i = 0; i < 6; i++) circle(-120 + i * 34, -136 + Math.sin(i) * 3, 7, '#E2B24A');
  cut(() => { ctx.beginPath(); ctx.moveTo(90, -250); ctx.quadraticCurveTo(110, -360, 190, -330); ctx.quadraticCurveTo(250, -300, 260, -200); ctx.lineTo(150, -120); ctx.closePath(); }, col, { shadow: 0.5, edge: 4 });
  const hb = Math.sin(t * 1.6) * 6;
  ctx.save(); ctx.translate(0, hb);
  cut(() => { ctx.beginPath(); ctx.moveTo(220, -330); ctx.quadraticCurveTo(300, -340, 330, -250); ctx.quadraticCurveTo(350, -180, 330, -130); ctx.quadraticCurveTo(300, -110, 270, -130); ctx.quadraticCurveTo(230, -200, 220, -330); ctx.closePath(); }, col, { shadow: 0.5, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(310, -136, 40, 28, 0.2, 0, TAU); }, '#D8B8A8', { shadow: 0.2, edge: 2 });
  circle(296, -134, 5, dark); circle(324, -128, 5, dark);
  ctx.strokeStyle = '#B8A888'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(240, -320); ctx.quadraticCurveTo(220, -400, 250, -430); ctx.moveTo(296, -318); ctx.quadraticCurveTo(310, -400, 290, -440); ctx.stroke();
  circle(250, -432, 10, '#E2B24A'); circle(290, -442, 10, '#E2B24A');
  if (o.glowEar) glow(206, -286, 120, '#FFE6A0', 0.7 * o.glowEar);
  cut(() => { ctx.beginPath(); ctx.moveTo(232, -296); ctx.quadraticCurveTo(170, -320, 150, -276); ctx.quadraticCurveTo(190, -262, 232, -276); ctx.closePath(); }, '#E2D6C2', { shadow: 0.3, edge: 3 });
  if ((o.eyes ?? 0) > 0.5) { circle(284, -250, 9, dark); } else { ctx.strokeStyle = dark; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(282, -252, 10, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  cut(P_rr(300, -310, 10, 30, 5), '#C0392B', { shadow: 0, edge: 0 });
  ctx.restore();
  if (o.garland ?? 1) { for (let i = 0; i < 13; i++) { const a = i / 12; const gx = lerp(170, 300, a), gy = -170 + Math.sin(a * Math.PI) * 70 + hb * 0.5; circle(gx, gy, 15, i % 2 ? '#F2A23A' : '#E8762A'); }
    cut(P_circ(236, -80 + hb * 0.5, 22), '#E2B24A', { shadow: 0.3, edge: 2 }); circle(236, -66 + hb * 0.5, 6, '#7A5A1A'); }
  ctx.restore();
}
// temple sanctum: wall with an arched doorway (hole, opposite winding), glowing Shivling inside. Base centre (cx, cy).
export function sanctum(cx, cy, s, t, wall = '#3A1E12', glowA = 1) {
  ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
  glow(0, -220, 420, '#FFD27A', 0.5 * glowA); godRays(0, -300, Math.PI * 0.2, Math.PI * 0.8, 12, 600, '#FFE6A0', 0.12 * glowA, t);
  shivling(0, 0, { s: 0.9, t, glowA: glowA });
  for (let i = 0; i < 2; i++) diya(-170 + i * 340, -10, 0.7, t, i + 4);
  cut(() => { ctx.beginPath(); ctx.moveTo(-1500, -1700); ctx.lineTo(1500, -1700); ctx.lineTo(1500, 60); ctx.lineTo(-1500, 60); ctx.closePath();
    ctx.moveTo(-250, 60); ctx.lineTo(250, 60); ctx.lineTo(250, -380); ctx.quadraticCurveTo(250, -560, 0, -620); ctx.quadraticCurveTo(-250, -560, -250, -380); ctx.closePath(); }, wall, { shadow: 0.6, edge: 5 });
  ctx.strokeStyle = '#B8862A'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(-250, 60); ctx.lineTo(-250, -380); ctx.quadraticCurveTo(-250, -560, 0, -620); ctx.quadraticCurveTo(250, -560, 250, -380); ctx.lineTo(250, 60); ctx.stroke();
  for (let i = 0; i < 9; i++) circle(-200 + i * 50, -600 + Math.abs(i - 4) * 14, 8, '#F2C860');
  ctx.restore();
}
function hut(x, y, s, col = '#6A4A2A', roof = '#A8803A') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  cut(P_rr(-160, -200, 320, 200, 6), col, { shadow: 0.5, edge: 3 }); cut(P_rr(-40, -130, 80, 130, 30), '#1A0C06', { shadow: 0, edge: 2 });
  cut(P_poly([[-230, -190], [0, -380], [230, -190]]), roof, { shadow: 0.6, edge: 4 }); ctx.restore(); }
function furrows(y0, t, col = '#5A2E1A', px = 0) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 10; for (let i = 0; i < 9; i++) { const y = y0 + i * i * 9 + i * 20; ctx.beginPath(); ctx.moveTo(-200, y); for (let x = -200; x < W + 200; x += 60) ctx.lineTo(x, y + Math.sin((x + px) * 0.01 + i) * 4); ctx.stroke(); } ctx.restore(); }
function plough(x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#4A2A12'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-160, -200); ctx.lineTo(60, -10); ctx.lineTo(140, 10); ctx.stroke(); cut(P_poly([[100, -10], [180, 10], [100, 30]]), '#8A8A8A', { shadow: 0.2, edge: 2 }); ctx.restore(); }
function kid(x, y, h, t, o = {}) { raja({ x, y, h, t, pose: o.pose || 'stand', robe: KID.robe, sash: KID.sash, eyes: o.eyes ?? 0, dir: o.dir || 1 }); }
function hourglass(x, y, s, k, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, 0, 220, '#BFD8FF', 0.3);
  cut(P_rr(-110, -190, 220, 24, 8), '#B8862A', { shadow: 0.4, edge: 2 }); cut(P_rr(-110, 166, 220, 24, 8), '#B8862A', { shadow: 0.4, edge: 2 });
  cut(P_poly([[-90, -166], [90, -166], [10, 0], [90, 166], [-90, 166], [-10, 0]]), rgba('#DCE8FF', 0.35), { shadow: 0, edge: 3 });
  const top = 1 - k; cut(P_poly([[-80 * top, -150 + 140 * (1 - top)], [80 * top, -150 + 140 * (1 - top)], [8, -6], [-8, -6]]), '#F2C860', { shadow: 0, edge: 0 });
  cut(P_poly([[-80, 160], [80, 160], [80 * k * 0.6, 160 - 140 * k], [-80 * k * 0.6, 160 - 140 * k]]), '#F2C860', { shadow: 0, edge: 0 });
  ctx.fillStyle = '#F2C860'; ctx.fillRect(-3, -6, 6, 160 - 140 * k); ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK: temple night, great Nandi facing the glowing sanctum, whisper waves at his ear; ? on कहते (thumbnail)
  { const kh = W_('कहते', 0), nd = W_('नंदी', 0);
    add({ id: 'S01', at: 0, cam: [540, 980], zoom: 0.14, note: 'temple night amber, sanctum arch glowing right, big Nandi left facing it, whisper waves + glowing ear; ? on कहते', draw(lt, d, t) {
      gradSky(TEMPLE); stars(t, 60, -200, 500, 3, 0.5); paperGrain(0.04, 3);
      sanctum(780, 1200, 0.8, t, '#2A1208');
      nandiBull(300 + 20 * (1 - eo(seg(lt, 0, 0.8))), 1500, 1.1, { t, glowEar: lt > nd ? 1 : 0.3, aura: 0.6 });
      if (lt > nd - 0.2) sound(300 + 160 * 1.1, 1500 - 290 * 1.1, t, 0.9, -1);
      ground('#140804', 1520); for (let i = 0; i < 6; i++) diya(80 + i * 190, 1540, 0.6, t, i);
      qmark(lt, kh, 540, 360, 200);
      motes(t, 60, [0, 200, W, 1500], '#FFB060', 0.8, 50, 3, 4); vignette(0.55);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'bell', { gain: 0.6 }); cue(0.1, 'swell', { dur: 2.2, gain: 0.5 }); cue(kh, 'damru', { gain: 0.6 }); }

  // 1 · why does Nandi always look at Mahadev? gaze beam
  { const ky = W_('क्यों', 1), hm = W_('हमेशा', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 950], zoom: 0.08, note: 'wide temple courtyard dusk, Nandi small left, sanctum far right, dotted gold gaze beam; ? on क्यों', draw(lt, d, t) {
      gradSky(SAFFRON); stars(t, 40, -200, 500, 5, 0.3); glow(820, 1000, 500, '#FFB060', 0.35);
      ranges([{ y: 1150, h: 240, col: '#4A1E22', seed: 4, haze: 0.3 }], lt * 20, '#FFB060');
      sanctum(800, 1420, 0.6, t, '#3A1A12');
      nandiBull(230 - lt * 8, 1480, 0.6, { t });
      beam(230 + 284 * 0.6, 1480 - 250 * 0.6, 800, 1300, seg(lt, hm - 0.2, hm + 0.6), t);
      ground('#1E0A08', 1470); qmark(lt, ky, 540, 400, 190);
      motes(t, 40, [0, 200, W, 1500], '#FFD27A', 0.6, 40, 5, 3); vignette(0.5);
    } });
    cue(cut_(1), 'whoosh', { gain: 0.5 }); cue(cut_(1) + ky, 'drum', { gain: 0.7 }); }

  // 2 · sage Shilada had no child
  { const sl = W_('शिलाद', 2), nh = W_('नहीं', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 950], zoom: 0.1, note: 'forest dusk ashram, palms, hut, lone diya, Shilada standing alone; name slip ऋषि शिलाद', draw(lt, d, t) {
      gradSky(FOREST); glow(540, 1050, 500, '#FFC080', 0.3); stars(t, 40, -200, 400, 7, 0.3);
      ranges([{ y: 1050, h: 300, col: '#1E3A24', seed: 6, haze: 0.4 }, { y: 1250, h: 200, col: '#122A18', seed: 9 }], lt * 25, '#C89A5A');
      hut(780, 1450, 0.9); palm(120, 1480, 700, '#0A1A10', 0.12, t); palm(1000, 1500, 600, '#0A1A10', -0.15, t);
      rishi(430, 1470, { s: 0.95, t, pose: 'stand' });
      mist(1350, 200, '#5A7A5A', 0.3, t); ground('#0A1A0E', 1460); diya(620, 1470, 0.7, t, 2, 1 - 0.6 * seg(lt, nh, nh + 0.8));
      slipAt(lt, sl, 'ऋषि शिलाद', 540, 280, 60);
      motes(t, 30, [0, 300, W, 1500], '#C8FFA0', 0.5, 20, 7, 3); vignette(0.5);
    } });
    cue(cut_(2), 'swell', { dur: 1.6, gain: 0.4 }); }

  // 3 · asked Mahadev for an immortal son
  { const am = W_('अमर', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 950], zoom: 0.1, note: 'boon gold: Shilada small with folded hands, Shiva fades in huge in the clouds above, god rays; slip अमर बेटा', draw(lt, d, t) {
      gradSky(BOON); godRays(540, 500, 0, TAU, 28, 1300, '#FFF0C0', 0.18, t);
      clouds(t, ['#C8862A', '#FFE0A0', '#8A4A12'], lt * 40, 0.7);
      ctx.save(); ctx.globalAlpha = 0.35 + 0.5 * eo(seg(lt, 0, 1.2)); shiva(540, 1180, { s: 0.75, t, aura: 1, eyes: 0 }); ctx.restore();
      ground('#3A2410', 1550); rishi(540, 1560, { s: 0.6, t, pose: 'namaste' });
      slipAt(lt, am, 'अमर बेटा', 540, 260, 60); motes(t, 50, [0, 200, W, 1500], A.paleGold, 0.7, 30, 9, 3); vignette(0.45);
    } });
    cue(cut_(3), 'bell', { gain: 0.5 }); cue(cut_(3) + am, 'sparkle', { gain: 0.5 }); }

  // 4 · one day, ploughing the sacrificial field
  { const yg = W_('यज्ञ', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 950], zoom: 0.08, note: 'rose dawn field, furrows sliding, Shilada pulling a plough, yajna smoke; slip यज्ञ भूमि', draw(lt, d, t) {
      dawnSky(t, 0.8, 1100, 11); ranges([{ y: 1100, h: 200, col: '#5A2A3A', seed: 12, haze: 0.4 }], lt * 30, '#F08A6A');
      cut(P_rr(-400, 1250, W + 800, H, 0), '#7A3E22', { shadow: 0, edge: 0 }); furrows(1270, t, '#4A2412', lt * 200);
      const x = lerp(260, 560, eio(seg(lt, 0, d)));
      plough(x + 120, 1500, 0.9); rishi(x, 1510, { s: 0.75, t, pose: 'pull' });
      for (let i = 0; i < 5; i++) { const k = (lt * 0.3 + i / 5) % 1; glow(900, 1200 - k * 500, 60 + 40 * k, '#E8D8C8', 0.25 * (1 - k)); }
      slipAt(lt, yg, 'यज्ञ भूमि', 540, 280, 60); motes(t, 30, [0, 300, W, 1500], '#FFD8A0', 0.5, 20, 11, 3); vignette(0.45);
    } });
    cue(cut_(4), 'whoosh', { gain: 0.5 }); cue(cut_(4) + yg, 'thud', { gain: 0.4 }); }

  // 5 · WOW: a shining child rises from the earth
  { const bl = W_('बालक', 5), dh = W_('धरती', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 980], zoom: 0.14, note: 'earth cracks with light, child Nandi rises glowing, shockwave ring + flash on बालक; Shilada stunned at the side', draw(lt, d, t) {
      dawnSky(t, 1, 1300, 13); const op = seg(lt, dh, bl);
      godRays(540, 1350, Math.PI, TAU, 30, 1500, '#FFF0C0', 0.1 + 0.2 * op, t);
      cut(P_rr(-400, 1380, W + 800, H, 0), '#6A3218', { shadow: 0, edge: 0 }); furrows(1400, t, '#3A1A0A');
      ctx.save(); ctx.strokeStyle = rgba('#FFE6A0', 0.3 + 0.7 * op); ctx.lineWidth = 10; for (let i = 0; i < 6; i++) { const ang = (i - 2.5) * 0.5; ctx.beginPath(); ctx.moveTo(540, 1400); ctx.lineTo(540 + Math.sin(ang) * 420 * (0.3 + op), 1400 + 40 + Math.cos(ang) * 60); ctx.stroke(); } ctx.restore();
      glow(540, 1340, 120 + 400 * op, '#FFE6A0', 0.3 + 0.4 * op);
      const up = eob(seg(lt, bl - 0.5, bl + 0.4));
      ctx.save(); ctx.beginPath(); ctx.rect(-400, -400, W + 800, 1800); ctx.clip(); glow(540, 1150, 320 * up + 1, '#FFFFFF', 0.4 * up); kid(540, 1400 + 600 * (1 - up), 560, t); ctx.restore();
      rishi(170, 1540, { s: 0.7, t, pose: 'stand' });
      ring(lt, bl, 540, 1300, '#FFE6A0', 1.0, 900); flash(lt, bl, '#FFF6D8', 0.7, 0.6);
      motes(t, 60, [0, 200, W, 1500], '#FFE6A0', 0.8, 60, 13, 4); vignette(0.45);
    } });
    cue(cut_(5) + dh, 'swell', { dur: 1.2, gain: 0.6 }); cue(cut_(5) + bl, 'drum', { gain: 0.9 }); cue(cut_(5) + bl + 0.05, 'bell', { gain: 0.6 }); }

  // 6 · named Nandi: the giver of joy
  { const nd = W_('नंदी', 6), an = W_('आनंद', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 920], zoom: 0.1, note: 'rose dawn ashram, Shilada and the child side by side, petals falling; ribbon नंदी, slip आनंद', draw(lt, d, t) {
      gradSky(ROSE); glow(540, 900, 600, '#FFD8A0', 0.35); clouds(t, ['#C86A7A', '#FFD8C0', '#7A3A5A'], lt * 50, 0.7);
      hut(870, 1450, 0.7, '#7A4A2A', '#C89A4A'); palm(60, 1480, 600, '#3A1A2A', 0.12, t);
      ground('#3A1A22', 1490); rishi(360, 1500, { s: 0.85, t, pose: 'stand' }); glow(640, 1150, 220, '#FFF0C0', 0.4); kid(640, 1500, 520, t);
      ribbonAt(lt, nd, 'नंदी', 540, 330, 120); slipAt(lt, an, 'आनंद देने वाला', 540, 500, 52);
      petals(t, 24, 3); vignette(0.45);
    } });
    cue(cut_(6) + nd, 'bell', { gain: 0.7 }); cue(cut_(6) + an, 'sparkle', { gain: 0.5 }); }

  // 7 · seven years later, two sages arrive: Mitra and Varuna
  { const st = W_('सात', 7), ds = W_('दो', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 950], zoom: 0.08, note: 'forest afternoon, two sages walk in from the right, child older; slips 7 साल बाद, मित्र · वरुण', draw(lt, d, t) {
      gradSky(FOREST); glow(300, 700, 500, '#FFE0A0', 0.3); godRays(200, 200, 0, Math.PI, 16, 1400, '#FFF0C0', 0.1, t);
      ranges([{ y: 1100, h: 280, col: '#2A4A2A', seed: 15, haze: 0.4 }], lt * 30, '#C89A5A');
      ground('#122A16', 1490); hut(200, 1460, 0.8); kid(420, 1490, 640, t);
      const wx = lerp(1150, 760, eo(seg(lt, 0, 1.6))), wk = lt < 1.6 ? 'walk' : 'stand';
      rishi(wx + 200, 1500, { s: 0.75, t: t + 0.4, pose: wk, dir: -1 }); rishi(wx, 1500, { s: 0.8, t, pose: wk, dir: -1 });
      slipAt(lt, st, '7 साल बाद', 540, 260, 56); slipAt(lt, ds, 'मित्र · वरुण', 820, 800, 50, 0.03);
      motes(t, 30, [0, 300, W, 1500], '#FFF0C0', 0.5, 20, 15, 3); vignette(0.5);
    } });
    cue(cut_(7), 'whoosh', { gain: 0.5 }); cue(cut_(7) + st, 'tock', { gain: 0.5 }); }

  // 8 · the prophecy: only one more year
  { const ek = W_('एक', 8), jg = W_('जिएगा', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 950], zoom: 0.1, note: 'prophecy slate: hourglass huge in the sky draining, child small below; big 1 साल on एक; thud on जिएगा', draw(lt, d, t) {
      gradSky(SLATE); stars(t, 80, -200, 900, 17, 0.6); clouds(t, ['#24283A', '#3A4058', '#141824'], lt * 40, 0.7);
      hourglass(540, 820, 1.4, seg(lt, 0, d + 1), t);
      ground('#0E1018', 1510); kid(540, 1520, 480, t);
      if (lt > ek) { ctx.save(); ctx.globalAlpha = eo(seg(lt, ek, ek + 0.3)); ctx.shadowColor = rgba('#BFD8FF', 0.8); ctx.shadowBlur = 30; bigText('1 साल', 540, 330, 130, '#DCE8FF'); ctx.restore(); }
      motes(t, 30, [0, 200, W, 1500], '#BFD8FF', 0.4, -20, 17, 3); vignette(0.6);
    } });
    cue(cut_(8) + ek, 'heartbeat', { gain: 0.7 }); cue(cut_(8) + jg, 'thud', { gain: 0.8 }); }

  // 9 · father weeps
  { const ro = W_('रो', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 920], zoom: 0.12, note: 'grief indigo rain, Shilada beside the child, single diya flickering; slow push-in', draw(lt, d, t) {
      gradSky(GRIEF); stars(t, 40, -200, 600, 19, 0.3); clouds(t, ['#141C34', '#2A3458', '#0A0E1A'], lt * 30, 0.8);
      hut(820, 1450, 0.8, '#2A2030', '#3A3048'); glow(480, 1200, 300, '#FFB060', 0.25 + 0.08 * Math.sin(t * 9));
      ground('#080A14', 1500); rishi(380, 1520, { s: 0.85, t, pose: 'stand' }); kid(580, 1520, 480, t);
      diya(720, 1500, 0.7, t, 5); rain(t, 0.6);
      slipAt(lt, ro, 'पिता के आँसू', 540, 280, 54); vignette(0.65);
    } });
    cue(cut_(9), 'swell', { dur: 2, gain: 0.35 }); }

  // 10 · open loop: but the real turn was still to come
  { const md = W_('मोड़', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 950], zoom: 0.12, note: 'dark field under stars, the child alone glowing faintly, distant Kailash; single ? glows', draw(lt, d, t) {
      gradSky(MOON); stars(t, 140, -200, 1100, 21, 0.8);
      ctx.save(); ctx.translate(540, 1250); ctx.scale(0.8, 0.8); ctx.translate(-540, -1250); kailashPeak(0, 0, 0, '#1E2640', '#5A6A90'); ctx.restore();
      mist(1250, 300, '#5A6A90', 0.35, t); glow(540, 1250, 260, '#FFE6A0', 0.25 + 0.1 * Math.sin(t * 3));
      ground('#080A18', 1510); kid(540, 1520, 480, t); qmark(lt, md, 540, 360, 200); vignette(0.6);
    } });
    cue(cut_(10) + md, 'heartbeat', { gain: 0.6 }); }

  // 11 · Nandi smiles: father, don't fear
  { const dr = W_('डरिए', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 820], zoom: 0.1, note: 'warm close-up of child Nandi, serene, halo of lamp light; slip डरिए मत', draw(lt, d, t) {
      gradSky(BOON); glow(540, 700, 600, '#FFE6A0', 0.35); godRays(540, 600, 0, TAU, 20, 1200, '#FFF0C0', 0.12, t);
      kid(540, 1900, 1250, t); for (let i = 0; i < 5; i++) diya(140 + i * 200, 1600, 0.6, t, i + 2);
      slipAt(lt, dr, 'डरिए मत', 540, 260, 64);
      motes(t, 50, [0, 200, W, 1500], A.paleGold, 0.7, 30, 23, 3); vignette(0.45);
    } });
    cue(cut_(11), 'bell', { gain: 0.5 }); }

  // 12 · I will win over death through Mahadev
  { const jt = W_('जीतूँगा', 12), mr = W_('मृत्यु', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 950], zoom: 0.1, note: 'dusk violet, child small on a rock facing distant golden Kailash; slip मृत्यु → ribbon जीतूँगा', draw(lt, d, t) {
      dawnSky(t, 0.5, 900, 25); ctx.save(); ctx.translate(540, 800); ctx.scale(0.7, 0.7); ctx.translate(-540, -1250); kailashPeak(0, 0, 0, '#4A3A6A', '#FFE8C8'); ctx.restore();
      glow(540, 560, 260, '#FFE6A0', 0.4); ranges([{ y: 1250, h: 200, col: '#2A1A3A', seed: 27 }], lt * 40, '#D2503A');
      ground('#120A18', 1580); cut(P_poly([[300, 1600], [420, 1440], [660, 1430], [800, 1600]]), '#1A0E22', { shadow: 0.5, edge: 3 });
      kid(540, 1450, 460, t);
      slipAt(lt, mr, 'मृत्यु', 300, 300, 56); ribbonAt(lt, jt, 'जीतूँगा', 540, 440, 100);
      motes(t, 30, [0, 200, W, 1500], '#FFD27A', 0.6, 30, 25, 3); vignette(0.5);
    } });
    cue(cut_(12) + jt, 'drum', { gain: 0.8 }); }

  // 13 · by the river, day and night, chanting Shiva's name
  { const dn = W_('दिन', 13), sv = W_('शिव', 13);
    add({ id: 'S14', at: cut_(13), cam: [540, 950], zoom: 0.08, note: 'river night teal, child in tapas on a rock, moon arcing fast (days passing), ॐ rising; slip ॐ नमः शिवाय', draw(lt, d, t) {
      gradSky(RIVER); ctx.save(); ctx.translate(540, 900); ctx.rotate(lt * 0.5); ctx.translate(-540, -900); stars(t, 200, -800, 2200, 29, 0.8); ctx.restore();
      const ma = -Math.PI + seg(lt, dn - 0.3, d) * Math.PI; const mx = 540 + Math.cos(ma) * 420, my = 760 + Math.sin(ma) * 380;
      glow(mx, my, 200, '#EAF0FF', 0.4); cut(P_circ(mx, my, 50), '#F4F6FF', { shadow: 0, edge: 0 });
      ranges([{ y: 1100, h: 200, col: '#0A2A2E', seed: 31, haze: 0.3 }], lt * 20, '#5AA0A0');
      water(t, 1330, ['#1A5A60', '#0E3A40'], '#DCF0FF', 0.5);
      cut(P_poly([[360, 1480], [430, 1400], [650, 1395], [720, 1480]]), '#1A2228', { shadow: 0.5, edge: 3 });
      glow(540, 1250, 220, '#FFE6A0', 0.35); kid(540, 1420, 420, t, { pose: 'tapas' });
      for (let i = 0; i < 4; i++) { const k = (lt * 0.4 + i / 4) % 1; om(400 + (i * 97) % 280, 1150 - k * 800, 60 + 20 * (i % 2), (1 - k) * 0.8); }
      slipAt(lt, sv, 'ॐ नमः शिवाय', 540, 260, 56); vignette(0.5);
    } });
    cue(cut_(13), 'swell', { dur: 2, gain: 0.45 }); cue(cut_(13) + sv, 'bell', { gain: 0.5 }); }

  // 14 · darkest moment: no hunger, no thirst, no fear
  { const bh = W_('भूख', 14), py = W_('प्यास', 14), dr = W_('डर', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 950], zoom: 0.12, note: 'storm slate, lightning + rain, child still in tapas glowing steady; three slips stack on each word', draw(lt, d, t) {
      gradSky(SLATE); clouds(t, ['#1E2234', '#3A4058', '#0E1018'], lt * 120, 0.9);
      if (lt > bh) lightning(260, -50, 900, t, 0.8, Math.floor(lt * 3));
      if (lt > dr) lightning(820, -50, 950, t, 0.9, 7 + Math.floor(lt * 3));
      water(t, 1360, ['#1A2A3A', '#0E1A28'], '#BFD8FF', 0.3);
      cut(P_poly([[360, 1500], [430, 1420], [650, 1415], [720, 1500]]), '#141A20', { shadow: 0.5, edge: 3 });
      glow(540, 1260, 240, '#FFE6A0', 0.45 + 0.1 * Math.sin(t * 4)); kid(540, 1440, 440, t, { pose: 'tapas' });
      rain(t, 1); slipAt(lt, bh, 'न भूख', 300, 300, 56, -0.05); slipAt(lt, py, 'न प्यास', 760, 420, 56, 0.04); slipAt(lt, dr, 'न डर', 540, 560, 70, -0.02);
      flash(lt, dr, '#DDE6FF', 0.4, 0.4); vignette(0.6);
    } });
    cue(cut_(14) + bh, 'thud', { gain: 0.6 }); cue(cut_(14) + py, 'thud', { gain: 0.6 }); cue(cut_(14) + dr, 'slam', { gain: 0.8 }); }

  // 15 · WOW: Mahadev himself comes from Kailash
  { const mh = W_('महादेव', 15), kl = W_('कैलाश', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 900], zoom: 0.14, note: 'storm parts into gold, Kailash glows behind, Shiva descends in a blaze; flash + conch on महादेव', draw(lt, d, t) {
      const k = seg(lt, kl - 0.3, mh);
      gradSky(lt < mh - 0.1 ? SLATE : BOON);
      godRays(540, 600, 0, TAU, 34, 1500, '#FFF0C0', 0.08 + 0.22 * k, t);
      kailashPeak(0, 100, 0, lt < mh - 0.1 ? '#3A4A6A' : '#8A6A4A', '#FFF2D8');
      const dn = eo(seg(lt, mh - 0.4, mh + 0.8));
      ground('#2A1808', 1540);
      ctx.save(); ctx.globalAlpha = dn; shiva(540, lerp(1100, 1560, dn), { s: 1.0, t, aura: 1.4, eyes: 0 }); ctx.restore();
      ring(lt, mh, 540, 900, '#FFE6A0', 1.2, 1000); flash(lt, mh, '#FFF6D8', 0.7, 0.7);
      motes(t, 70, [0, 200, W, 1500], A.paleGold, 0.8, 40, 33, 4); vignette(0.45);
      slipAt(lt, kl, 'कैलाश से', 540, 240, 56);
    } });
    cue(cut_(15) + kl, 'swell', { dur: 1.2, gain: 0.6 }); cue(cut_(15) + mh, 'conch', { dur: 2.2, gain: 0.7 }); cue(cut_(15) + mh + 0.05, 'drum', { gain: 0.9 }); }

  // 16 · made Nandi immortal
  { const am = W_('अमर', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 900], zoom: 0.1, note: 'divine gold: Shiva right, child left, gold rings spiral round the child; ribbon अमर + bell', draw(lt, d, t) {
      gradSky(BOON); godRays(700, 500, 0, TAU, 28, 1400, '#FFF0C0', 0.2, t);
      ground('#3A2410', 1530); shiva(740, 1560, { s: 0.8, t, aura: 1.2, eyes: 0 });
      const k = seg(lt, am - 0.3, am + 0.8); glow(300, 1250, 260 + 200 * k, '#FFFFFF', 0.3 + 0.3 * k);
      kid(300, 1540, 560, t);
      ctx.save(); ctx.strokeStyle = rgba('#FFE6A0', 0.8 * k); ctx.lineWidth = 8; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.ellipse(300, 1500 - i * 180 - k * 60, 180, 40, 0, t * 3 + i, t * 3 + i + Math.PI * 1.6); ctx.stroke(); } ctx.restore();
      ribbonAt(lt, am, 'अमर', 540, 360, 130); ring(lt, am, 300, 1250, '#FFE6A0', 0.9, 600);
      motes(t, 60, [0, 200, W, 1500], A.paleGold, 0.8, 50, 35, 4); vignette(0.45);
    } });
    cue(cut_(16) + am, 'drum', { gain: 0.9 }); cue(cut_(16) + am + 0.05, 'bell', { gain: 0.7 }); }

  // 17 · WOW: his vahana, lord of the ganas
  { const vh = W_('वाहन', 17), sw = W_('स्वामी', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 980], zoom: 0.14, note: 'moonlit Kailash, a blaze becomes the great white bull Nandi with garland beside Shiva; gana silhouettes; slips वाहन, गणों का स्वामी', draw(lt, d, t) {
      gradSky(MOON); stars(t, 140, -200, 900, 37, 0.7); glow(540, 400, 400, '#EAF0FF', 0.3);
      kailashPeak(0, -60, 0, '#4A5A8A', '#F2F5FF'); mist(1150, 300, '#AFC4F0', 0.35, t);
      ctx.save(); ctx.globalAlpha = 0.6 * seg(lt, sw - 1, sw); for (let i = 0; i < 8; i++) { const gx = 60 + i * 140; cut(() => { ctx.beginPath(); ctx.ellipse(gx, 1400, 36, 70, 0, 0, TAU); ctx.moveTo(gx + 26, 1310); ctx.arc(gx, 1310, 26, 0, TAU); }, '#0E1428', { shadow: 0, edge: 0 }); } ctx.restore();
      ground('#141C34', 1530); shiva(780, 1540, { s: 0.6, t, aura: 1, eyes: 0 });
      const k = eo(seg(lt, vh - 0.6, vh + 0.3)); glow(360, 1300, 400, '#FFFFFF', 0.6 * (1 - k) + 0.2);
      ctx.save(); ctx.globalAlpha = k; nandiBull(280, 1540, 0.9, { t, aura: 1 }); ctx.restore();
      ring(lt, vh, 360, 1300, '#FFFFFF', 1.0, 800); flash(lt, vh, '#FFFFFF', 0.6, 0.6);
      slipAt(lt, vh, 'वाहन', 300, 300, 66); slipAt(lt, sw, 'गणों का स्वामी', 620, 460, 54, 0.03);
      motes(t, 50, [0, 200, W, 1500], '#DCE8FF', 0.7, 30, 37, 3); vignette(0.5);
    } });
    cue(cut_(17), 'whoosh', { gain: 0.5 }); cue(cut_(17) + vh, 'slam', { gain: 0.8 }); cue(cut_(17) + vh + 0.05, 'bell', { gain: 0.6 }); cue(cut_(17) + sw, 'damru', { gain: 0.6 }); }

  // 18 · since then Nandi only looks at Shiva (temple today)
  { const ts = W_('तब', 18), dk = W_('देखते', 18);
    add({ id: 'S19', at: cut_(18), cam: [540, 950], zoom: 0.1, note: 'temple dusk saffron today, bull in the mandapa facing the sanctum, gaze beam on देखते; bells sway', draw(lt, d, t) {
      gradSky(SAFFRON); glow(540, 900, 600, '#FFB060', 0.3);
      sanctum(780, 1450, 0.75, t, '#4A1E12', 0.6 + 0.4 * seg(lt, dk - 0.3, dk + 0.4));
      for (const px of [70, 1010]) { cut(P_rr(px - 40, 200, 80, 1300, 10), '#5A2A16', { shadow: 0.6, edge: 3 }); const sw = Math.sin(t * 2 + px) * 0.2; ctx.save(); ctx.translate(px, 200); ctx.rotate(sw); ctx.strokeStyle = '#B8862A'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 260); ctx.stroke(); cut(P_poly([[-30, 300], [30, 300], [16, 250], [-16, 250]]), '#E2B24A', { shadow: 0.3, edge: 2 }); ctx.restore(); }
      ground('#1E0A08', 1500); nandiBull(280, 1540, 0.8, { t });
      beam(280 + 284 * 0.8, 1540 - 250 * 0.8, 780, 1330, seg(lt, dk - 0.3, dk + 0.4), t);
      slipAt(lt, ts, 'तब से... आज तक', 540, 260, 54);
      motes(t, 40, [0, 200, W, 1500], '#FFD27A', 0.6, 40, 39, 3); vignette(0.5);
    } });
    cue(cut_(18), 'bell', { gain: 0.5 }); cue(cut_(18) + dk, 'sparkle', { gain: 0.5 }); }

  // 19 · belief: words spoken into his ear...
  { const kn = W_('कान', 19), bt = W_('बात', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 900], zoom: 0.12, note: 'close on Nandi, a devotee with folded hands whispering near his ear, sound waves into the glowing ear; slip कान में', draw(lt, d, t) {
      gradSky(TEMPLE); glow(540, 900, 600, '#FFB060', 0.3);
      nandiBull(0, 1560, 1.9, { t, glowEar: 0.2 + 0.8 * seg(lt, kn - 0.2, bt) });
      devi({ x: 860, y: 1560, h: 900, t, pose: 'namaste', sari: '#C0392B', dir: -1, eyes: 0 });
      if (lt > kn - 0.3) sound(206 * 1.9 + 60, 1560 - 286 * 1.9, t, 0.9, 1);
      ground('#140804', 1560); for (let i = 0; i < 5; i++) diya(100 + i * 220, 1580, 0.6, t, i + 9);
      slipAt(lt, kn, 'कान में', 540, 260, 60); motes(t, 40, [0, 200, W, 1500], '#FFB060', 0.6, 40, 41, 3); vignette(0.5);
    } });
    cue(cut_(19) + kn, 'bell', { gain: 0.4 }); cue(cut_(19) + bt, 'heartbeat', { gain: 0.5 }); }

  // 20 · ...reaches Mahadev directly (loop)
  { const mh = W_('महादेव', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 900], zoom: 0.12, note: 'a golden thread of light rises from the temple Nandi into the sky to Shiva on Kailash; ribbon महादेव तक + flash', draw(lt, d, t) {
      gradSky(COSMIC_GOLD); stars(t, 160, -200, 1000, 43, 0.7);
      ctx.save(); ctx.translate(540, 760); ctx.scale(0.55, 0.55); ctx.translate(-540, -1250); kailashPeak(0, 0, 0, '#4A3A6A', '#FFE8C8'); ctx.restore();
      shiva(540, 560, { s: 0.3, t, aura: 1.5, eyes: 0 });
      const ex = 250 + 206 * 0.7, ey = 1500 - 286 * 0.7, k = eo(seg(lt, 0, mh + 0.3)), ty = lerp(ey, 420, k);
      ctx.save(); ctx.strokeStyle = rgba('#FFE6A0', 0.9); ctx.lineWidth = 10; ctx.shadowColor = '#FFE6A0'; ctx.shadowBlur = 30; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.quadraticCurveTo(lerp(ex, 760, k), lerp(ey, 900, k), 540, ty); ctx.stroke(); ctx.restore();
      glow(540, ty, 80, '#FFFFFF', 0.8);
      ground('#120A18', 1500); nandiBull(250, 1500, 0.7, { t, glowEar: 1 });
      ribbonAt(lt, mh, 'महादेव तक', 540, 1250, 90); ring(lt, mh + 0.2, 540, 450, '#FFE6A0', 0.9, 500); flash(lt, mh + 0.2, '#FFF6D8', 0.5, 0.6);
      motes(t, 60, [0, 200, W, 1500], A.paleGold, 0.8, 50, 43, 4); vignette(0.5);
    } });
    cue(cut_(20), 'swell', { dur: 1.4, gain: 0.5 }); cue(cut_(20) + mh, 'drum', { gain: 0.8 }); cue(cut_(20) + mh + 0.05, 'bell', { gain: 0.7 }); }

  // 21-22 · end card
  { const st = cut_(21), f = Wd('फ़ॉलो', 22) - st;
    add({ id: 'S22', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: temple night, Nandi facing glowing sanctum, diyas, Untold Stories in gold', draw(lt, d, t) {
      gradSky(TEMPLE); stars(t, 60, -200, 500, 45, 0.4);
      sanctum(800, 1500, 0.55, t, '#2A1208'); ground('#140804', 1500); nandiBull(250, 1520, 0.6, { t });
      for (let i = 0; i < 6; i++) diya(80 + i * 190, 1540, 0.5, t, i + 3);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 440, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 590, 80, '#FFE6C8'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 740, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
