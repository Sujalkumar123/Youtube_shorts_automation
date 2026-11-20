"""Sync the video to YOUR narration file (e.g. ElevenLabs) without Whisper.

  python tools/align_own.py . path/to/voice.mp3 [--trim]

The recording must read script.json's lines in order. Each line boundary is placed on a real pause in the recording:
candidate pauses are found from the loudness envelope, and a dynamic program picks, for the 24 boundaries, the pauses that
best match where the reference voice (data/lines_ref.json, the Kokoro read of the same script) put them, scaled to the
recording's length. Sentence ends (. ? !) prefer longer pauses. Writes data/narration.wav, data/lines.json, data/words.json.
"""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np

P = Path(sys.argv[1]); SRC = sys.argv[2]; SR = 24000
S = json.loads((P / 'script.json').read_text()); n_lines = len(S['lines'])
REF = json.loads((P / 'data/lines_ref.json').read_text())['lines']

raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
x = x / (np.abs(x).max() + 1e-9) * 0.9
hop = int(0.01 * SR); nf = len(x) // hop
rms = np.sqrt(np.mean(x[:nf * hop].reshape(nf, hop) ** 2, axis=1)); db = 20 * np.log10(rms + 1e-9)
floor = np.percentile(db, 10); peak = np.percentile(db, 95); thr = floor + (peak - floor) * 0.28
speech = db > thr
on = np.where(speech)[0]; s0, s1 = on[0] * 0.01, (on[-1] + 1) * 0.01
# candidate pauses: loudness valleys inside the speech span (true silences and short breaths)
k = 3; sm = np.convolve(db, np.ones(k) / k, mode='same')
sil = []; f = on[0] + 5
while f < on[-1] - 5:
    w0, w1 = max(on[0], f - 40), min(on[-1], f + 40)
    if sm[f] == sm[w0:w1 + 1].min() and min(sm[w0:f].max(), sm[f:w1 + 1].max()) - sm[f] >= 9:
        lvl = sm[f] + 4; a = f; b = f
        while a > on[0] and sm[a - 1] < lvl: a -= 1
        while b < on[-1] and sm[b + 1] < lvl: b += 1
        if not sil or a * 0.01 > sil[-1][1] + 0.05: sil.append((a * 0.01, (b + 1) * 0.01))
        f = b + 3
    else: f += 1
print(f'speech {s0:.2f}-{s1:.2f} s, {len(sil)} pauses found')

# reference boundaries (between line i-1 end and line i start), scaled to this recording
r0, r1 = REF[0]['start'], REF[-1]['end']
exp = [s0 + ((REF[i - 1]['end'] + REF[i]['start']) / 2 - r0) / (r1 - r0) * (s1 - s0) for i in range(1, n_lines)]
ends = [bool(re.search(r'[.?!]["\')]*$', S['lines'][i - 1]['text'].strip())) for i in range(1, n_lines)]
C = len(sil); mid = np.array([(a + b) / 2 for a, b in sil]); ln = np.array([b - a for a, b in sil])
INF = 1e18
def cost(k, c):
    d = (mid[c] - exp[k]); pen = d * d * 4
    pen -= (0.6 if ends[k] else 0.25) * min(ln[c], 0.6)     # reward real pauses, more so at sentence ends
    if ends[k] and ln[c] < 0.18: pen += 0.4
    return pen
B = n_lines - 1
if C < B: raise SystemExit(f'only {C} pauses found for {B} line boundaries: is this the same script?')
dp = np.full((B, C), INF); bk = np.zeros((B, C), dtype=int)
for c in range(C): dp[0, c] = cost(0, c)
for k in range(1, B):
    best, arg = INF, -1
    for c in range(C):
        if c - 1 >= 0 and dp[k - 1, c - 1] < best: best, arg = dp[k - 1, c - 1], c - 1
        if best < INF: dp[k, c] = best + cost(k, c); bk[k, c] = arg
c = int(np.argmin(dp[B - 1])); pick = [c]
for k in range(B - 1, 0, -1): c = bk[k, c]; pick.append(c)
pick = pick[::-1]

lead = 0.4; offset = lead - s0      # start the voice 0.4 s into the video
outro = float(S.get('outro', 1.4))
lines = []
for i in range(n_lines):
    a = s0 if i == 0 else sil[pick[i - 1]][1]
    b = s1 if i == n_lines - 1 else sil[pick[i]][0]
    lines.append({'i': i, 'text': S['lines'][i]['text'], 'start': round(a + offset, 3), 'end': round(b + offset, 3)})
    print(f"{i:2d} {a + offset:6.2f}-{b + offset:6.2f}  (ref {REF[i]['end'] - REF[i]['start']:.2f}s, got {b - a:.2f}s)  {S['lines'][i]['text']}")
seg = x[int(s0 * SR):int(s1 * SR)]
out = np.concatenate([np.zeros(int(lead * SR)), seg, np.zeros(int(outro * SR))])
from scipy.io import wavfile
wavfile.write(P / 'data/narration.wav', SR, (out * 32767).astype(np.int16))
dur = len(out) / SR
(P / 'data/lines.json').write_text(json.dumps({'duration': round(dur, 3), 'voice': 'own', 'lines': lines}, indent=1, ensure_ascii=False))
sys.path.insert(0, str(P / 'tools')); import words as WD
WD.inline_fallback(P, S)
print(f'data/narration.wav ({dur:.2f} s) + lines.json + words.json. Next: node tools/capture.mjs check → cues → mix.py')
