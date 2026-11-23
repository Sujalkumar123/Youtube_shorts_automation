// रावण का नाम 'रावण' किसने रखा? How Ravana got his name — cinematic cut paper.
// Valmiki Ramayana, Uttara Kanda, Sarga 16.
// Palette: blood-red night (hook) → Alaka gold (Kubera's city) → flight dusk violet → moonlit Kailash blue →
// curse crimson → quake slate → divine gold (Shiva) → cosmic indigo (1000 years) → name blaze → Lanka dawn saffron.
import { ctx, W, H, TAU, clamp, lerp, seg, eo, eio, eob, rnd, circle } from './core/lib.js';
import { L, Wd } from './core/timing.js';
import * as K from './core/kit.js';
import { A, gradSky, paperGrain, stars, glow, rgba, godRays, mist, ranges, motes, vignette, dawnSky, cloud, skyline } from './atmos.js';
import { raja, devi, shiva, hanuman, lightning } from './cast.js';
const { cut, P_rr, P_poly, P_circ } = K;

const BLOOD = [[0, '#070206'], [0.5, '#3A0A12'], [0.85, '#8A1A1A'], [1, '#C8401E']];
const ALAKA = [[0, '#2A1406'], [0.5, '#8A5A12'], [0.85, '#F2C860'], [1, '#FFE8A8']];
const DUSK = [[0, '#120A2A'], [0.45, '#4A2260'], [0.75, '#C8506A'], [1, '#F6A070']];
const MOON = [[0, '#060A1E'], [0.45, '#13204A'], [0.8, '#2A3C72'], [1, '#4A5E92']];
const CURSE = [[0, '#0A0204'], [0.5, '#4A0A14'], [1, '#9A1A22']];
const QUAKE = [[0, '#05070E'], [0.5, '#161C2E'], [1, '#34405A']];
const GOLDEN = [[0, '#2A1206'], [0.5, '#8A4A12'], [1, '#F6C860']];
const COSMIC = [[0, '#03020C'], [0.5, '#140E3A'], [1, '#2E1A5A']];
const RAV = { robe: '#4A0E1E', sash: '#D9A83C' };
const NANDI = { robe: '#F2EEE6', sash: '#3A6AC8' };

function bigText(text, x, y, size, col) { ctx.font = `700 ${size}px Martel`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = col; ctx.fillText(text, x, y); }
function slipAt(lt, w, text, x, y, size = 56, rot = -0.03) { if (lt > w - 0.1) K.slip(text, x, y, eob(seg(lt, w - 0.1, w + 0.2)), rot, size); }
function qmark(lt, w, x, y, size = 220) { if (lt > w - 0.1) { const p = eob(seg(lt, w - 0.1, w + 0.25)); ctx.save(); ctx.translate(x, y); ctx.scale(p, p); glow(0, 0, 180, A.gold, 0.5); bigText('?', 0, 10, size, '#FCE7B0'); ctx.restore(); } }
function ribbonAt(lt, w, text, x, y, size = 110) { if (lt > w - 0.15) K.ribbon(text, x, y, eob(seg(lt, w - 0.15, w + 0.2)), size); }
function ground(col, y = 1440) { cut(P_rr(-400, y, W + 800, H, 0), col, { shadow: 0, edge: 0 }); const g = ctx.createLinearGradient(0, y, 0, y + 400); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.5)'); ctx.fillStyle = g; ctx.fillRect(-400, y, W + 800, 500); }
function flash(lt, w, col = '#FFFBEA', a = 0.8, len = 0.8) { if (lt > w) { ctx.fillStyle = rgba(col, a * (1 - seg(lt, w, w + len))); ctx.fillRect(-300, -300, W + 600, H + 600); } }
function ring(lt, w, x, y, col = '#FFE6A0', len = 0.9, R = 900) { if (lt > w && lt < w + len) { const k = seg(lt, w, w + len); ctx.save(); ctx.strokeStyle = rgba(col, 0.8 * (1 - k)); ctx.lineWidth = 30 * (1 - k) + 4; ctx.beginPath(); ctx.ellipse(x, y, R * eo(k), R * 0.4 * eo(k), 0, 0, TAU); ctx.stroke(); ctx.restore(); } }
function clouds(t, cols, px = 0, a = 0.85) { for (const [cx, cy, s] of [[180, 420, 1.2], [880, 300, 1.0], [600, 1250, 1.4], [120, 1100, 0.9], [1000, 980, 1.1]]) cloud(((cx - px) % 1500 + 1500) % 1500 - 200, cy, s, cols[0], cols[1], cols[2], a); }
function speedLines(t, a = 1, col = '#FFF2D0') { ctx.save(); ctx.strokeStyle = rgba(col, 0.35 * a); ctx.lineCap = 'round'; for (let i = 0; i < 26; i++) { const y = rnd(i) * H, x = W - ((t * 2600 + rnd(i + 7) * 3000) % 3000) + 600, l = 160 + 260 * rnd(i + 3); ctx.lineWidth = 3 + 6 * rnd(i + 1); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + l, y + l * 0.35); ctx.stroke(); } ctx.restore(); }

// ---------- new kit ----------
// one crowned head (local coords: face centre at 0,0, ~64 x 76)
function head(x, y, sc, o = {}) {
  const eyes = o.eyes ?? 1, skin = o.skin || '#D49A68', glowEye = o.glowEye || 0;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0); ctx.scale(sc, sc);
  cut(() => { ctx.beginPath(); ctx.moveTo(-60, -10); ctx.quadraticCurveTo(-80, 80, -40, 120); ctx.lineTo(40, 120); ctx.quadraticCurveTo(80, 80, 60, -10); ctx.closePath(); }, '#1A0C10', { shadow: 0.3, edge: 2 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 64, 76, 0, 0, TAU); }, skin);
  ctx.strokeStyle = '#1A0C10'; ctx.lineWidth = 7; ctx.lineCap = 'round';
  for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 10, -24); ctx.lineTo(k * 44, -34); ctx.stroke(); }
  for (const k of [-1, 1]) { if (eyes > 0.5) { cut(() => { ctx.beginPath(); ctx.ellipse(k * 24, -10, 13, 8, 0, 0, TAU); }, '#F7EFDC', { shadow: 0, edge: 0 }); circle(k * 24, -10, 5, '#2A0A0A'); if (glowEye) glow(k * 24, -10, 26, '#FF3A1A', glowEye); } else { ctx.strokeStyle = '#1A0C10'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(k * 24, -14, 11, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); } }
  cut(() => { ctx.beginPath(); ctx.moveTo(-44, 26); ctx.quadraticCurveTo(-20, 8, 0, 22); ctx.quadraticCurveTo(20, 8, 44, 26); ctx.quadraticCurveTo(20, 20, 0, 32); ctx.quadraticCurveTo(-20, 20, -44, 26); ctx.closePath(); }, '#1A0C10', { shadow: 0, edge: 0 });
  if (o.laugh) cut(() => { ctx.beginPath(); ctx.ellipse(0, 46, 20, 8 + 10 * o.laugh, 0, 0, TAU); }, '#5A0A10', { shadow: 0, edge: 0 });
  circle(0, -46, 6, '#C0392B');
  cut(() => { ctx.beginPath(); ctx.moveTo(-62, -52); ctx.lineTo(-72, -120); ctx.lineTo(-38, -98); ctx.lineTo(-20, -150); ctx.lineTo(0, -110); ctx.lineTo(20, -150); ctx.lineTo(38, -98); ctx.lineTo(72, -120); ctx.lineTo(62, -52); ctx.closePath(); }, '#E2B24A', { shadow: 0.4, edge: 3 });
  cut(P_rr(-64, -66, 128, 18, 6), '#B8862A', { shadow: 0.2, edge: 2 }); circle(0, -86, 8, '#C0392B');
  ctx.restore();
}
// Ravana: ten crowned heads (4 left + centre + 5 right), dark robe; poses stand | lift (twenty arms raised) | pray | strain
export function ravana(x, y, o = {}) {
  const h = o.h || 900, s = h / 1150, t = o.t || 0, pose = o.pose || 'stand', laugh = o.laugh || 0, n = o.heads ?? 10, dir = o.dir || 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * dir, s);
  if (o.aura) glow(0, -900, 700, '#FF3A1A', 0.3 * o.aura);
  if (pose === 'lift' || pose === 'strain') {
    ctx.lineCap = 'round';
    for (let i = 0; i < 9; i++) for (const k of [-1, 1]) {
      const a = k * (0.12 + i * 0.11), sx = k * 96, sy = -720, L1 = pose === 'lift' ? 270 : 230, L2 = pose === 'lift' ? 270 : 160 + Math.sin(t * 3 + i) * 6;
      const ex = sx + Math.sin(a) * L1, ey = sy - Math.cos(a) * L1, hx = ex + Math.sin(a * 0.6) * L2, hy = ey - Math.cos(a * 0.6) * L2;
      ctx.strokeStyle = i % 2 ? '#A8744A' : '#C08658'; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = '#E2B24A'; ctx.lineWidth = 50; ctx.beginPath(); ctx.moveTo(lerp(ex, hx, 0.2), lerp(ey, hy, 0.2)); ctx.lineTo(lerp(ex, hx, 0.26), lerp(ey, hy, 0.26)); ctx.stroke();
      circle(hx, hy, 28, '#C08658');
    }
  }
  const order = [-4, 5, -3, 4, -2, 3, -1, 2, 1].slice(0, Math.max(0, n - 1));
  for (const k of order) { const bob = laugh ? Math.sin(t * 14 + k) * 8 * laugh : 0; head(k * 112, -896 + Math.abs(k) * 14 + bob, 0.86, { eyes: o.eyes ?? 1, laugh, glowEye: o.glowEye || 0, rot: k * 0.03 }); }
  raja({ x: 0, y: 0, h: 1150, t, pose: pose === 'pray' ? 'tapas' : 'stand', robe: RAV.robe, sash: RAV.sash, eyes: o.eyes ?? 1 });
  head(0, -900, 1.08, { eyes: o.eyes ?? 1, laugh, glowEye: o.glowEye || 0 });
  ctx.restore();
}
// Pushpaka vimana: golden flying temple-chariot on a cloud
export function pushpak(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 8 * (o.bob ?? 1)); ctx.scale(s, s);
  glow(0, -200, 520, '#FFD27A', 0.35 * (o.glowA ?? 1));
  for (const [cx, cy, cs] of [[-220, 40, 0.9], [0, 60, 1.1], [220, 40, 0.9]]) cloud(cx, cy, cs, '#F2E2F0', '#FFF6E6', '#C8A2C8', 0.95);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, 0, 360, 60, 0, 0, TAU); }, '#B8862A', { shadow: 0.6, edge: 4 });
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -16, 330, 44, 0, 0, TAU); }, '#E2B24A', { shadow: 0.3, edge: 3 });
  for (let i = -3; i <= 3; i++) { cut(P_rr(i * 90 - 12, -170, 24, 150, 6), '#D9A83C', { shadow: 0.4, edge: 2 }); }
  cut(P_rr(-300, -190, 600, 30, 8), '#B8862A', { shadow: 0.4, edge: 3 });
  for (let k = 0; k < 4; k++) { const w = 240 - k * 50, yy = -190 - k * 80; cut(P_poly([[-w, yy], [w, yy], [w - 30, yy - 80], [-w + 30, yy - 80]]), k % 2 ? '#E2B24A' : '#F2C860', { shadow: 0.4, edge: 3 }); }
  cut(P_poly([[-70, -510], [70, -510], [0, -640]]), '#F2C860', { shadow: 0.4, edge: 3 }); circle(0, -650, 16, '#FFE8A8');
  for (const k of [-1, 1]) { const fx = k * 280; cut(P_rr(fx - 4, -330, 8, 150, 3), '#6A4A22', { shadow: 0.2, edge: 0 }); cut(() => { ctx.beginPath(); ctx.moveTo(fx, -330); ctx.quadraticCurveTo(fx + k * 60, -320 + Math.sin(t * 6) * 10, fx + k * 110, -300); ctx.lineTo(fx, -280); ctx.closePath(); }, '#C0392B', { shadow: 0.2, edge: 2 }); }
  for (let i = 0; i < 9; i++) circle(-260 + i * 65, -16, 6, i % 2 ? '#C0392B' : '#FFF6E6');
  ctx.restore();
}
function kailashPeak(px = 0, py = 0, rot = 0, col = '#6A7CAE', snow = '#F2F5FF') {
  ctx.save(); ctx.translate(540 + px, 1250 + py); ctx.rotate(rot); ctx.translate(-540, -1250);
  cut(P_poly([[60, 1250], [380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [1020, 1250]]), col, { shadow: 0.8, edge: 4 });
  cut(P_poly([[380, 760], [470, 640], [540, 560], [610, 640], [700, 760], [640, 740], [590, 790], [540, 730], [490, 790], [440, 740]]), snow, { shadow: 0.3, edge: 3 });
  cut(P_poly([[160, 1250], [420, 900], [520, 1250]]), rgba('#2A3460', 0.6), { shadow: 0, edge: 0 });
  ctx.restore();
}
function kailashSky(t, moon = 1) {
  gradSky(MOON); stars(t, 140, -200, 1000, 4); paperGrain(0.05, 4);
  if (moon) { glow(830, 330, 380, '#EAF0FF', 0.4); cut(P_circ(830, 330, 90), '#F4F6FF', { shadow: 0, edge: 0 }); }
}
// Nandi as the gana of Kailash: tall white-robed guardian with a trident, bull-horn crown
export function nandi(x, y, h, t, o = {}) {
  const s = h / 1150;
  glow(x, y - h * 0.7, h * 0.7, '#CFE4FF', 0.35 * (o.aura ?? 1));
  ctx.save(); ctx.translate(x + 170 * s * (o.dir || 1), y); ctx.scale(s, s);
  cut(P_rr(-10, -1380, 20, 1380, 6), '#C9CED8', { shadow: 0.5, edge: 2 });
  for (const d of [-1, 0, 1]) cut(P_poly([[d * 70 - 10, -1380], [d * 70 + 10, -1380], [d * 70, -1520 + Math.abs(d) * 40]]), '#E6EAF2', { shadow: 0.4, edge: 2 });
  cut(P_rr(-80, -1390, 160, 20, 6), '#D9A83C', { shadow: 0.3, edge: 2 });
  if (o.tglow) glow(0, -1450, 200, o.tcol || '#FF4A3A', o.tglow);
  ctx.restore();
  raja({ x, y, h, t, pose: o.pose || 'stand', robe: NANDI.robe, sash: NANDI.sash, eyes: o.eyes ?? 1, dir: o.dir || 1 });
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const k of [-1, 1]) cut(() => { ctx.beginPath(); ctx.moveTo(k * 60, -1000); ctx.quadraticCurveTo(k * 170, -1030, k * 160, -1160); ctx.quadraticCurveTo(k * 130, -1060, k * 40, -1040); ctx.closePath(); }, '#F2E8D0', { shadow: 0.4, edge: 3 });
  ctx.restore();
}
// glowing divine foot pressing from above (symbolic, light only)
function lightFoot(x, y, s, a) {
  if (a <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a;
  glow(0, 0, 420, '#FFE6A0', 0.6);
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -60, 120, 220, 0, 0, TAU); }, '#FFE8B8', { shadow: 0.2, edge: 3 });
  for (let i = 0; i < 5; i++) cut(P_circ(-80 + i * 40, 150 - Math.abs(i - 1) * 8 + (i === 0 ? -10 : 0), i === 0 ? 34 : 26 - i * 2), '#FFF2D0', { shadow: 0.2, edge: 2 });
  ctx.strokeStyle = rgba('#FFFFFF', 0.6); ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(0, -60, 140, 240, 0, 0, TAU); ctx.stroke();
  ctx.restore();
}
function om(x, y, size, a, col = '#FFE6A0') { ctx.save(); ctx.globalAlpha = a; glow(x, y, size, col, 0.4); bigText('ॐ', x, y, size, col); ctx.restore(); }
function vanara(x, y, s, t, i = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const b = Math.sin(t * 5 + i) * 8;
  cut(() => { ctx.beginPath(); ctx.ellipse(0, -150 + b, 60, 90, 0, 0, TAU); ctx.moveTo(46, -270 + b); ctx.ellipse(0, -270 + b, 46, 50, 0, 0, TAU); }, '#1A0A08', { shadow: 0, edge: 0 });
  ctx.strokeStyle = '#1A0A08'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(40, -100 + b); ctx.quadraticCurveTo(140, -120, 120, -260 + Math.sin(t * 3 + i) * 20); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-20, -80 + b); ctx.lineTo(-40, 0); ctx.moveTo(20, -80 + b); ctx.lineTo(40, 0); ctx.moveTo(-40, -200 + b); ctx.lineTo(-90, -300 + b); ctx.stroke(); ctx.restore(); }

export function buildShots() {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut_ = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const W_ = (w, i) => Wd(w, i) - cut_(i);

  // 0 · HOOK: giant ten-headed Ravana against a blood-red sky; ? on नहीं (thumbnail)
  { const nh = W_('नहीं', 0);
    add({ id: 'S01', at: 0, cam: [540, 980], zoom: 0.14, note: 'blood-red night, giant ten-headed Ravana, glowing eyes, embers; ? on नहीं', draw(lt, d, t) {
      gradSky(BLOOD); stars(t, 80, -200, 700, 3, 0.6); paperGrain(0.04, 3);
      godRays(540, 260, 0, TAU, 24, 1200, '#FF8A50', 0.12, t);
      ranges([{ y: 1150, h: 300, col: '#3A0A12', seed: 3, haze: 0.3 }, { y: 1300, h: 220, col: '#1E060A', seed: 8 }], lt * 20, '#C8401E');
      ravana(540, 1520 + 30 * (1 - eo(seg(lt, 0, 0.8))), { h: 980, t, glowEye: 0.6, aura: 1 });
      ground('#100306', 1500); qmark(lt, nh, 540, 300, 200);
      motes(t, 60, [0, 200, W, 1500], '#FF8A3A', 0.8, 60, 3, 4); vignette(0.55);
    } });
    cue(0, 'drum', { gain: 0.9 }); cue(0.05, 'whoosh', { gain: 0.6 }); cue(0.1, 'swell', { dur: 2.2, gain: 0.6 }); cue(nh, 'damru', { gain: 0.7 }); }

  // 1 · who gave him this name?
  { const ks = W_('किसने', 1);
    add({ id: 'S02', at: cut_(1), cam: [540, 950], zoom: 0.08, note: 'storm slate, ten heads, golden letters रावण, big ? on किसने, lightning', draw(lt, d, t) {
      gradSky(QUAKE); stars(t, 60, -200, 800, 5, 0.5); clouds(t, ['#24283A', '#3A4058', '#141824'], lt * 60, 0.8);
      ravana(540, 1560, { h: 900, t, eyes: 1, glowEye: 0.8 });
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.1, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 40; bigText('रावण', 540, 380, 190, '#F6D98A'); ctx.restore();
      if (lt > ks - 0.6) lightning(800, -50, 700, t, 0.8, 3);
      qmark(lt, ks, 860, 560, 200); flash(lt, ks - 0.05, '#DDE6FF', 0.5, 0.5); vignette(0.55);
    } });
    cue(cut_(1), 'whoosh', { gain: 0.5 }); cue(cut_(1) + ks, 'drum', { gain: 0.8 }); }

  // 2 · Dashanan: the heads appear one by one
  { const ds = W_('दशानन', 2), dsr = W_('दस', 2);
    add({ id: 'S03', at: cut_(2), cam: [540, 900], zoom: 0.1, note: 'Lanka night, heads appear one by one (count to 10); slip दशानन', draw(lt, d, t) {
      gradSky(CURSE); stars(t, 80, -200, 800, 7, 0.5); glow(540, 800, 700, '#FF6A3A', 0.25);
      skyline(1420, '#1A0408', 1.2, 540 - lt * 20);
      const n = 1 + Math.floor(clamp((lt - dsr + 0.2) / 0.14, 0, 9));
      ravana(540, 1540, { h: 860, t, heads: lt < dsr - 0.2 ? 1 : n, aura: 0.6 });
      ground('#12040A', 1520);
      slipAt(lt, ds, 'दशानन', 540, 300, 64); if (lt > dsr) bigText(String(n), 920, 560, 120, rgba('#FCE7B0', 0.85));
      motes(t, 40, [0, 300, W, 1500], '#FFB060', 0.6, 40, 5, 3); vignette(0.5);
    } });
    for (let k = 0; k < 9; k++) cue(cut_(2) + dsr - 0.2 + k * 0.14, 'tock', { gain: 0.35 }); }

  // 3 · Kubera defeated: Pushpaka rises from the golden city
  { const pv = W_('पुष्पक', 3);
    add({ id: 'S04', at: cut_(3), cam: [540, 900], zoom: 0.12, note: 'Alaka gold city, Pushpaka rising, Ravana on it; slip पुष्पक विमान', draw(lt, d, t) {
      gradSky(ALAKA); godRays(540, 300, 0, TAU, 28, 1300, '#FFF0C0', 0.16, t); glow(540, 400, 600, '#FFF0C0', 0.4);
      ranges([{ y: 1100, h: 260, col: '#C8962E', seed: 2, haze: 0.4 }], lt * 30, '#FFE8A8');
      skyline(1380, '#8A5A1A', 1.0, 540 + lt * 30);
      const ry = lerp(1350, 1050, eio(seg(lt, 0.2, d)));
      pushpak(540, ry, 0.9, t); ravana(540 - 190, ry - 20 + Math.sin(t * 2) * 8, { h: 360, t });
      ground('#5A3A12', 1460); slipAt(lt, pv, 'पुष्पक विमान', 540, 300, 60);
      motes(t, 50, [0, 200, W, 1500], '#FFF0C0', 0.7, 40, 9, 3); vignette(0.45);
    } });
    cue(cut_(3), 'swell', { dur: 2, gain: 0.5 }); cue(cut_(3) + pv, 'sparkle', { gain: 0.6 }); }

  // 4 · flying in pride toward Kailash
  { const kl = W_('कैलाश', 4);
    add({ id: 'S05', at: cut_(4), cam: [540, 950], zoom: 0.1, note: 'violet dusk clouds rushing past, vimana flying toward distant Kailash; slip कैलाश', draw(lt, d, t) {
      gradSky(DUSK); stars(t, 60, -200, 600, 9, 0.4); glow(900, 900, 500, '#FFC080', 0.35);
      ctx.save(); ctx.translate(380, -80); ctx.scale(0.55, 0.55); kailashPeak(0, 0, 0, '#5A4A8A', '#F2E8FF'); ctx.restore();
      clouds(t, ['#6A3A7A', '#E8A0B0', '#3A1E4A'], lt * 520, 0.9);
      const x = lerp(260, 520, eio(seg(lt, 0, d)));
      pushpak(x, 980, 0.75, t); ravana(x - 150, 965 + Math.sin(t * 2) * 8, { h: 300, t });
      speedLines(t, 0.9); slipAt(lt, kl, 'कैलाश', 540, 300, 60);
      vignette(0.5);
    } });
    cue(cut_(4), 'whoosh', { gain: 0.8 }); }

  // 5 · suddenly the vimana stops dead
  { const rk = W_('रुक', 5);
    add({ id: 'S06', at: cut_(5), cam: [540, 900], zoom: 0.06, note: 'moonlit sky, vimana jolts to a stop, shock ring; on रुक', draw(lt, d, t) {
      kailashSky(t); clouds(t, ['#3A4A7A', '#8FA4D8', '#1E2A4A'], lt < rk ? lt * 500 : rk * 500, 0.8);
      const jolt = lt > rk ? Math.sin((lt - rk) * 40) * 30 * (1 - seg(lt, rk, rk + 0.6)) : 0;
      pushpak(540 + jolt, 1100, 1.0, t, { bob: 0 }); ravana(540 - 200 + jolt, 1084, { h: 380, t, glowEye: lt > rk ? 0.5 : 0 });
      if (lt < rk) speedLines(t, 0.8); ring(lt, rk, 540, 1080, '#BFD8FF', 0.8, 700);
      slipAt(lt, rk + 0.1, 'रुक गया!', 540, 300, 60); vignette(0.5);
    } });
    cue(cut_(5), 'whoosh', { gain: 0.6 }); cue(cut_(5) + rk, 'slam', { gain: 0.8 }); }

  // 6 · WOW: Nandi stands before him
  { const nd = W_('नंदी', 6);
    add({ id: 'S07', at: cut_(6), cam: [540, 950], zoom: 0.12, note: 'moonlit Kailash, Nandi the white-robed gana with trident rises in a blaze; name slip नंदी', draw(lt, d, t) {
      kailashSky(t); kailashPeak(0, 0); mist(1100, 300, '#AFC4F0', 0.3, t);
      godRays(540, 500, 0, TAU, 30, 1200, '#DCE8FF', 0.18 * eo(seg(lt, 0, 1)), t);
      nandi(540, 1500 + 60 * (1 - eo(seg(lt, 0, 0.9))), 980, t, { aura: 1.2 });
      ranges([{ y: 1380, h: 120, col: '#1E2A4A', seed: 12 }], lt * 40, '#8FA4D8'); ground('#141C34', 1490);
      slipAt(lt, nd, 'नंदी', 540, 250, 66); motes(t, 50, [0, 200, W, 1500], '#DCE8FF', 0.7, 30, 4, 3); vignette(0.5);
    } });
    cue(cut_(6), 'conch', { dur: 2, gain: 0.6 }); cue(cut_(6) + nd, 'bell', { gain: 0.6 }); }

  // 7 · Nandi warns: do not go further
  { const mt = W_('मत', 7);
    add({ id: 'S08', at: cut_(7), cam: [540, 950], zoom: 0.08, note: 'Nandi left, trident glows, vimana with small Ravana right; slip आगे मत जाओ', draw(lt, d, t) {
      kailashSky(t, 0); ctx.save(); ctx.translate(lt * -14, 0); kailashPeak(0, 0); ctx.restore(); mist(1150, 300, '#AFC4F0', 0.3, t);
      glow(540, 600, 260, '#FFF6D8', 0.35 + 0.1 * Math.sin(t * 2));
      nandi(300, 1500, 820, t, { aura: 0.8, tglow: lt > mt ? 0.5 : 0, tcol: '#BFE0FF' });
      pushpak(820, 1100, 0.6, t); ravana(700, 1090 + Math.sin(t * 2) * 8, { h: 300, t, dir: -1 });
      ground('#141C34', 1490); slipAt(lt, mt, 'आगे मत जाओ', 540, 250, 56); vignette(0.5);
    } });
    cue(cut_(7) + mt, 'thud', { gain: 0.6 }); }

  // 8 · Ravana laughs at Nandi's monkey-like face
  { const hs = W_('हँसा', 8);
    add({ id: 'S09', at: cut_(8), cam: [540, 900], zoom: 0.1, note: 'close on Ravana, ten heads bobbing with laughter, crimson light', draw(lt, d, t) {
      gradSky(CURSE); glow(540, 700, 600, '#FF5A3A', 0.3); clouds(t, ['#4A0A14', '#8A2A2A', '#24060A'], lt * 80, 0.7);
      const lg = lt > hs - 0.1 ? eo(seg(lt, hs - 0.1, hs + 0.3)) : 0;
      ravana(540, 2050, { h: 1500, t, laugh: lg, glowEye: 0.3 });
      motes(t, 40, [0, 200, W, 1500], '#FF8A3A', 0.6, 40, 7, 3); vignette(0.55);
      slipAt(lt, hs, 'हा हा हा!', 540, 250, 60);
    } });
    cue(cut_(8) + hs, 'boing', { gain: 0.3 }); }

  // 9 · the curse: vanaras will destroy you
  { const sh = W_('श्राप', 9), vn = W_('वानर', 9);
    add({ id: 'S10', at: cut_(9), cam: [540, 950], zoom: 0.1, note: 'curse crimson, Nandi trident blazes red, ring; ghost vanara silhouettes in the sky; slip श्राप', draw(lt, d, t) {
      gradSky(CURSE); stars(t, 60, -200, 700, 11, 0.4);
      const va = lt > vn ? eo(seg(lt, vn, vn + 0.8)) : 0;
      ctx.save(); ctx.globalAlpha = 0.6 * va; for (let i = 0; i < 7; i++) vanara(120 + i * 140, 760 + (i % 2) * 60, 0.9, t, i); ctx.restore();
      nandi(540, 1520, 900, t, { aura: 0.6, tglow: lt > sh ? 0.9 : 0.2, tcol: '#FF3A2A' });
      ring(lt, sh, 680, 300, '#FF6A4A', 1.0, 800); ground('#1A0406', 1500);
      slipAt(lt, sh, 'श्राप', 300, 250, 66); motes(t, 50, [0, 200, W, 1500], '#FF6A3A', 0.6, 60, 3, 3); vignette(0.55);
    } });
    cue(cut_(9) + sh, 'drum', { gain: 0.8 }); cue(cut_(9) + vn, 'damru', { gain: 0.5 }); }

  // 10 · open loop
  { const mo = W_('मोड़', 10);
    add({ id: 'S11', at: cut_(10), cam: [540, 950], zoom: 0.12, note: 'dark Kailash silhouette, slow push-in, single ? glows above the peak', draw(lt, d, t) {
      gradSky(QUAKE); stars(t, 120, -200, 1000, 13, 0.7); kailashPeak(0, 0, 0, '#1E2640', '#5A6A90');
      mist(1150, 300, '#5A6A90', 0.35, t); glow(540, 520, 300, '#FFE6A0', 0.2 + 0.1 * Math.sin(t * 3));
      qmark(lt, mo, 540, 360, 200); vignette(0.6);
    } });
    cue(cut_(10) + mo, 'heartbeat', { gain: 0.6 }); }

  // 11 · WOW: Ravana lifts Kailash
  { const ut = W_('उठा', 11);
    add({ id: 'S12', at: cut_(11), cam: [540, 980], zoom: 0.12, note: 'twenty arms raise the whole snow mountain; rocks fall, dust; shake on उठा', draw(lt, d, t) {
      gradSky(QUAKE); stars(t, 80, -200, 600, 15, 0.5); glow(540, 1200, 700, '#FF6A3A', 0.25);
      const up = eio(seg(lt, ut - 0.6, ut + 0.4)), sh = lt > ut ? Math.sin(lt * 40) * 6 : 0;
      kailashPeak(sh, -340 * up, 0.04 * Math.sin(lt * 3) * up, '#4A5A8A', '#E8EEFF');
      ravana(540, 1560, { h: 640, t, pose: 'lift', glowEye: 0.5 });
      for (let i = 0; i < 12; i++) { const k = ((lt * 0.9 + rnd(i)) % 1); cut(P_circ(200 + rnd(i + 3) * 680, 900 + k * 600, 10 + 14 * rnd(i + 5)), '#3A4058', { shadow: 0.2, edge: 1 }); }
      mist(1300, 300, '#8A8AA0', 0.4, t); ground('#0E1018', 1520);
      slipAt(lt, ut, 'पूरा कैलाश!', 540, 200, 58); vignette(0.5);
    } });
    cue(cut_(11), 'swell', { dur: 1.6, gain: 0.6 }); cue(cut_(11) + ut, 'slam', { gain: 0.9 }); }

  // 12 · the mountain trembles, Mother Parvati is afraid
  { const pr = W_('पार्वती', 12);
    add({ id: 'S13', at: cut_(12), cam: [540, 900], zoom: 0.08, note: 'on Kailash: Parvati beside Shiva, ground tilting, snow falling', draw(lt, d, t) {
      kailashSky(t); const tilt = 0.05 * Math.sin(lt * 6);
      ctx.save(); ctx.translate(540, 1500); ctx.rotate(tilt); ctx.translate(-540, -1500);
      cut(P_poly([[-200, 1500], [300, 1250], [540, 1200], [780, 1250], [1280, 1500], [1280, H + 300], [-200, H + 300]]), '#E8EEFF', { shadow: 0.5, edge: 4 });
      shiva(680, 1420, { s: 0.8, t, aura: 0.8, eyes: 0 });
      devi({ x: 340, y: 1420, h: 760, t, pose: 'namaste', sari: '#C0392B', dir: 1 });
      ctx.restore(); slipAt(lt, pr, 'माँ पार्वती', 540, 200, 56);
      motes(t, 40, [0, 200, W, 1500], '#F4F6FF', 0.6, -30, 17, 3); vignette(0.5);
    } });
    cue(cut_(12), 'thud', { gain: 0.7 }); }

  // 13 · then Mahadev smiled
  { add({ id: 'S14', at: cut_(13), cam: [540, 820], zoom: 0.1, note: 'Shiva close-up, eyes closed, serene, halo turning, gold rays', draw(lt, d, t) {
      gradSky(GOLDEN); godRays(540, 560, 0, TAU, 30, 1200, '#FFF0C0', 0.2, t); stars(t, 60, -200, 600, 19, 0.4);
      shiva(540, 1900, { s: 1.35, t, aura: 1.2, eyes: 0 });
      motes(t, 60, [0, 200, W, 1500], A.paleGold, 0.7, 30, 19, 3); vignette(0.5);
    } });
    cue(cut_(13), 'bell', { gain: 0.6 }); }

  // 14 · WOW: just the toe, pressed lightly
  { const db = W_('दबाया', 14), ag = W_('अँगूठा', 14);
    add({ id: 'S15', at: cut_(14), cam: [540, 950], zoom: 0.1, note: 'Shiva small on the snow peak in a golden glow, presses down: gold shockwave + flash on दबाया', draw(lt, d, t) {
      kailashSky(t, 0); kailashPeak(0, lt > db ? 40 * eo(seg(lt, db, db + 0.4)) : 0);
      const pk = lt > db ? 40 * eo(seg(lt, db, db + 0.4)) : 0;
      godRays(540, 560 + pk, Math.PI * 0.1, Math.PI * 0.9, 18, 900, '#FFE6A0', 0.1 + 0.25 * seg(lt, db - 0.5, db), t);
      shiva(540, 600 + pk, { s: 0.36, t, aura: 1.2, eyes: 0 });
      if (lt > db - 0.4) { glow(540, 590 + pk, 180, '#FFE6A0', 0.6 * seg(lt, db - 0.4, db)); }
      ring(lt, db, 540, 600, '#FFE6A0', 1.0, 900); flash(lt, db, '#FFF2C0', 0.7, 0.6);
      mist(1150, 300, '#AFC4F0', 0.3, t); slipAt(lt, ag, 'बस एक अँगूठा', 540, 1420, 54);
      vignette(0.5);
    } });
    cue(cut_(14) + db, 'drum', { gain: 0.9 }); cue(cut_(14) + db + 0.05, 'bell', { gain: 0.6 }); }

  // 15 · arms pinned under the mountain
  { const dg = W_('दब', 15);
    add({ id: 'S16', at: cut_(15), cam: [540, 1000], zoom: 0.06, note: 'mountain sinks onto Ravana, arms bent under the weight, dust burst', draw(lt, d, t) {
      gradSky(QUAKE); stars(t, 60, -200, 600, 21, 0.4);
      const dn = eio(seg(lt, 0, dg + 0.2));
      kailashPeak(0, -360 + 260 * dn, 0, '#4A5A8A', '#E8EEFF');
      ravana(540, 1600, { h: 600, t, pose: 'strain', eyes: 0 });
      if (lt > dg) mist(1300, 300, '#AAAAC0', 0.5 * (1 - seg(lt, dg, dg + 1.5)) + 0.2, t);
      ground('#0E1018', 1530); vignette(0.55);
    } });
    cue(cut_(15) + dg, 'thud', { gain: 0.9 }); }

  // 16 · WOW: the cry that shook the three worlds
  { const ch = W_('चीख़', 16), tl = W_('तीनों', 16);
    add({ id: 'S17', at: cut_(16), cam: [540, 950], zoom: 0.14, note: 'Ravana pinned under Kailash, eyes blazing, sound rings burst from him, whole frame shakes, lightning', draw(lt, d, t) {
      const sh = lt > ch ? Math.sin(lt * 50) * 10 * (1 - seg(lt, ch + 1.5, d)) : 0;
      ctx.save(); ctx.translate(sh, sh * 0.4);
      gradSky(QUAKE); stars(t, 120, -200, 900, 23, 0.6); glow(540, 1150, 600, '#FF5A3A', 0.3);
      ranges([{ y: 1250, h: 200, col: '#1E2236', seed: 25 }], lt * 30, '#5A6A90');
      kailashPeak(0, -110, 0, '#4A5A8A', '#E8EEFF');
      ravana(540, 1560, { h: 600, t, pose: 'strain', eyes: 1, glowEye: lt > ch ? 0.8 : 0 });
      ground('#0E1018', 1530);
      ctx.restore();
      for (let k = 0; k < 3; k++) ring(lt, ch + k * 0.3, 540, 1080, '#FFFFFF', 1.2, 1100);
      if (lt > tl) lightning(200 + 600 * rnd(Math.floor(lt * 4)), -50, 900, t, 0.7, Math.floor(lt * 4));
      flash(lt, ch, '#FFFFFF', 0.4, 0.4); slipAt(lt, tl, 'तीनों लोक काँपे', 540, 1430, 54); vignette(0.5);
    } });
    cue(cut_(16) + ch, 'slam', { gain: 1.0 }); cue(cut_(16) + tl, 'drum', { gain: 0.8 }); }

  // 17 · a thousand years of praise
  { const hz = W_('हज़ार', 17);
    add({ id: 'S18', at: cut_(17), cam: [540, 950], zoom: 0.08, note: 'cosmic indigo, star wheel spinning, Ravana in prayer at the foot of the mountain, glowing ॐ rising; slip 1000 साल', draw(lt, d, t) {
      gradSky(COSMIC);
      ctx.save(); ctx.translate(540, 700); ctx.rotate(lt * 0.9); ctx.translate(-540, -700); stars(t, 220, -800, 2400, 27, 0.9); ctx.restore();
      kailashPeak(0, 160, 0, '#2A3460', '#B8C4E8'); glow(540, 1300, 400, '#FFD27A', 0.3);
      ravana(540, 1540, { h: 520, t, pose: 'pray', eyes: 0 });
      for (let i = 0; i < 5; i++) { const k = (lt * 0.35 + i / 5) % 1; om(260 + (i * 137) % 560, 1200 - k * 900, 70 + 30 * (i % 2), (1 - k) * 0.9); }
      ground('#0A0818', 1530); slipAt(lt, hz, '1000 साल', 540, 250, 60);
      vignette(0.5);
    } });
    cue(cut_(17), 'swell', { dur: 2.4, gain: 0.5 }); cue(cut_(17) + hz, 'bell', { gain: 0.5 }); }

  // 18 · Mahadev speaks
  { add({ id: 'S19', at: cut_(18), cam: [540, 900], zoom: 0.1, note: 'Shiva appears in a golden blaze above Kailash, Ravana bowed small below', draw(lt, d, t) {
      gradSky(GOLDEN); godRays(540, 600, 0, TAU, 32, 1400, '#FFF0C0', 0.22, t);
      kailashPeak(0, 200, 0, '#8A6A4A', '#FFF2D8');
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0, 0.6)); shiva(540, 1250, { s: 0.85, t, aura: 1.3, eyes: 0 }); ctx.restore();
      ravana(540, 1560, { h: 300, t, pose: 'pray', eyes: 0 });
      ground('#3A2410', 1540); motes(t, 60, [0, 200, W, 1500], A.paleGold, 0.8, 30, 29, 3); vignette(0.45);
    } });
    cue(cut_(18), 'conch', { dur: 2.2, gain: 0.6 }); }

  // 19 · WOW: the name — रावण
  { const rv = W_('रावण', 19), nm = W_('नाम', 19);
    add({ id: 'S20', at: cut_(19), cam: [540, 950], zoom: 0.12, note: 'blaze: ten heads, gold ring, ? on नाम then ribbon रावण, flash + drum + bell', draw(lt, d, t) {
      gradSky(BLOOD); godRays(540, 700, 0, TAU, 30, 1400, '#FFD27A', 0.2 + 0.2 * seg(lt, rv - 0.3, rv), t);
      glow(540, 800, 600, '#FFD27A', 0.3 + 0.3 * seg(lt, rv - 0.3, rv));
      ravana(540, 1560, { h: 820, t, eyes: 0, aura: 0.8 });
      if (lt < rv - 0.1) qmark(lt, nm, 540, 400, 170);
      ribbonAt(lt, rv, 'रावण', 540, 400, 140); ring(lt, rv, 540, 400, '#FFE6A0', 1.0, 800); flash(lt, rv, '#FFF6D8', 0.7, 0.6);
      ground('#100306', 1530); motes(t, 60, [0, 200, W, 1500], '#FFD27A', 0.8, 50, 31, 4); vignette(0.5);
    } });
    cue(cut_(19) + nm, 'heartbeat', { gain: 0.5 }); cue(cut_(19) + rv, 'drum', { gain: 1.0 }); cue(cut_(19) + rv + 0.05, 'bell', { gain: 0.7 }); }

  // 20 · Nandi's curse came true: the vanara army
  { const vs = W_('वानरों', 20), sc = W_('सच', 20);
    add({ id: 'S21', at: cut_(20), cam: [540, 950], zoom: 0.1, note: 'saffron dawn sea, Lanka skyline far right, vanara silhouettes on a ridge, Hanuman leaping across; slip नंदी का श्राप', draw(lt, d, t) {
      dawnSky(t, 1, 1150, 33); glow(820, 1100, 500, '#FF8A30', 0.4);
      skyline(1150, '#3A1A1A', 0.7, 860);
      ctx.save(); ctx.globalAlpha = 0.6; for (let i = 0; i < 8; i++) { const k = (lt * 0.4 + i / 8) % 1; glow(700 + 300 * rnd(i), 1100 - k * 400, 30, '#FFB040', (1 - k) * 0.5); } ctx.restore();
      cut(() => { ctx.beginPath(); ctx.moveTo(-200, 1460); ctx.quadraticCurveTo(300, 1300, 700, 1420); ctx.lineTo(700, H + 200); ctx.lineTo(-200, H + 200); ctx.closePath(); }, '#2A140E', { shadow: 0.5, edge: 3 });
      const n = lt > vs ? Math.min(9, 1 + Math.floor((lt - vs) / 0.12)) : 3;
      for (let i = 0; i < n; i++) vanara(40 + i * 75, 1420 - Math.sin(i * 0.5) * 40, 0.7, t, i);
      if (lt > sc - 0.6) hanuman(lerp(300, 760, eio(seg(lt, sc - 0.6, d))), lerp(1100, 700, eio(seg(lt, sc - 0.6, d))), { s: 0.5, t, pose: 'fly', rot: 0.9, eyes: 1, aura: 0.6 });
      slipAt(lt, 0.2, 'नंदी का श्राप', 540, 250, 56); if (lt > sc) ribbonAt(lt, sc, 'सच हुआ', 540, 420, 90);
      motes(t, 40, [0, 200, W, 1500], '#FFD27A', 0.6, 40, 35, 3); vignette(0.5);
    } });
    cue(cut_(20), 'whoosh', { gain: 0.6 }); cue(cut_(20) + sc, 'drum', { gain: 0.8 }); }

  // 21-22 · end card
  { const st = cut_(21), f = Wd('फ़ॉलो', 22) - st;
    add({ id: 'S22', at: st, cam: [540, 900], zoom: 0.05, note: 'end card: moonlit Kailash, tiny Pushpaka passing, Untold Stories in gold', draw(lt, d, t) {
      kailashSky(t); kailashPeak(0, 150); mist(1250, 300, '#AFC4F0', 0.3, t);
      pushpak(lerp(150, 400, seg(lt, 0, d)), 980, 0.3, t);
      ctx.save(); ctx.globalAlpha = eo(seg(lt, 0.2, 0.6)); ctx.shadowColor = rgba(A.gold, 0.8); ctx.shadowBlur = 30; bigText('Untold Stories', 540, 440, 120, '#F6D98A'); ctx.shadowBlur = 0; bigText('अनकही कहानियाँ', 540, 590, 80, '#DCE6FF'); ctx.restore();
      if (lt > f) K.slip('फ़ॉलो करें', 540, 740, eob(seg(lt, f, f + 0.3)), -0.03, 60);
      motes(t, 40, [0, 200, W, 1400], A.paleGold, 0.6, 30, 13, 3); vignette(0.5);
    } });
    cue(st, 'bell', { gain: 0.7 }); cue(st + 0.1, 'conch', { dur: 2.2, gain: 0.5 }); cue(st + f, 'drum', { gain: 0.6 }); }

  return { shots: S, cues: CUES };
}
