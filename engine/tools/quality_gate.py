"""Quality gate: run on the finished video BEFORE uploading. Prints PASS or FAIL with reasons (and writes review/quality.json).

  python tools/quality_gate.py . renders/<slug>-yt.mp4

Checks: 1080x1920 · 30-150 s · audio present and loud enough · voice clearly above the music (>= 9 dB) ·
voice really exists (narration not silent, lines timed) · every script line has captions · no black gaps · no frozen
video · file under 35 MB. Exit code 0 = PASS, 1 = FAIL.
"""
import json, re, subprocess, sys
from pathlib import Path
import numpy as np

P = Path(sys.argv[1]); MP4 = Path(sys.argv[2]); fails, notes = [], []
def run(cmd): return subprocess.run(cmd, capture_output=True, text=True)

# 1. format
pr = json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,width,height:format=duration,size', '-of', 'json', str(MP4)]).stdout or '{}')
streams = pr.get('streams', []); fmt = pr.get('format', {})
v = [s for s in streams if s.get('codec_type') == 'video']; a = [s for s in streams if s.get('codec_type') == 'audio']
dur = float(fmt.get('duration', 0)); size = int(fmt.get('size', 0))
if not v or (v[0].get('width'), v[0].get('height')) != (1080, 1920): fails.append(f"video is not 1080x1920 ({v[0].get('width') if v else '-'}x{v[0].get('height') if v else '-'})")
if not a: fails.append('no audio track')
if not 30 <= dur <= 150: fails.append(f'length {dur:.1f} s is outside 30-150 s')
if size > 35 * 1024 * 1024: fails.append(f'file is {size / 1048576:.1f} MB (> 35 MB)')

# 2. audio level + voice clarity
def load(f, af=None, sr=24000):
    out = run(['ffmpeg', '-v', 'error', '-i', str(f)] + (['-af', af] if af else []) + ['-ac', '1', '-ar', str(sr), '-f', 'f32le', '-']).stdout
    return np.frombuffer(out.encode('latin1') if isinstance(out, str) else out, dtype=np.float32).astype(float)
def loadb(f, af=None, sr=24000):
    out = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(f)] + (['-af', af] if af else []) + ['-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(out, dtype=np.float32).astype(float)
db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9) if len(x) else -120
try:
    S = json.loads((P / 'script.json').read_text()); Lj = json.loads((P / 'data/lines.json').read_text())['lines']
    mix = loadb(MP4); nar = loadb(P / 'data/narration.wav', S.get('voice_fx'))
    if db(mix) < -30: fails.append(f'audio too quiet ({db(mix):.1f} dB)')
    if db(nar) < -40: fails.append('narration is silent: the voice was not generated')
    lv = json.loads((P / 'data/levels.json').read_text()); notes.append(f"voice above music: {lv['gap_db']:.1f} dB")
    if lv['gap_db'] < 9: fails.append(f"music too loud under the voice (voice only {lv['gap_db']:.1f} dB above, need >= 9)")
    ref = loadb(P / 'data/mix.wav'); k = min(len(ref), len(mix), 24000 * 20)
    if k > 24000 and abs(np.corrcoef(ref[:k], mix[:k])[0, 1]) < 0.6: fails.append('the video does not contain the current mix (audio mismatch): re-render')
    if len(Lj) != len(S['lines']): fails.append(f"voice timing has {len(Lj)} lines but the script has {len(S['lines'])}")
    if any(l['end'] - l['start'] < 0.25 for l in Lj): fails.append('some narration lines are empty or cut off')
except Exception as e: fails.append(f'audio check crashed: {e}')

# 3. captions: every line must produce at least one caption chunk
try:
    chk = run(['node', 'tools/capture.mjs', 'check']).stdout if (P / 'tools/capture.mjs').exists() else ''
    if 'CHECK OK' not in chk: fails.append('engine check failed (shots or captions broken)')
    caps = [ln for ln in chk.splitlines() if re.match(r'\s+\d+\.\d+–\d+\.\d+\s+\S', ln)]
    if len(caps) < len(S['lines']): fails.append(f'captions missing: {len(caps)} caption chunks for {len(S["lines"])} lines')
    words = json.loads((P / 'data/words.json').read_text())
    if len(words) < 3 * len(S['lines']): fails.append('word timing is missing (subtitles would not sync)')
except Exception as e: fails.append(f'caption check crashed: {e}')

# 4. black or frozen picture
bd = run(['ffmpeg', '-v', 'info', '-i', str(MP4), '-vf', 'blackdetect=d=0.5:pix_th=0.06', '-an', '-f', 'null', '-']).stderr
for m in re.finditer(r'black_start:([\d.]+) black_end:([\d.]+)', bd):
    s0, s1 = float(m.group(1)), float(m.group(2))
    if s0 < dur - 0.8: fails.append(f'black screen from {s0:.1f} s to {s1:.1f} s')
fz = run(['ffmpeg', '-v', 'info', '-i', str(MP4), '-vf', 'freezedetect=n=0.0008:d=4', '-an', '-f', 'null', '-']).stderr
for m in re.finditer(r'freeze_start: ([\d.]+)', fz):
    if float(m.group(1)) < dur - 4.5: fails.append(f'picture frozen for 4+ s starting at {float(m.group(1)):.1f} s')

res = {'pass': not fails, 'fails': fails, 'notes': notes, 'duration': round(dur, 2), 'size_mb': round(size / 1048576, 1)}
(P / 'review').mkdir(exist_ok=True); (P / 'review/quality.json').write_text(json.dumps(res, ensure_ascii=False, indent=1))
print(('PASS' if not fails else 'FAIL'), json.dumps(res, ensure_ascii=False))
sys.exit(0 if not fails else 1)
