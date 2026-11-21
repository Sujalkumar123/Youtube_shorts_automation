"""ElevenLabs narration (the user's paid voice, e.g. "Sahir"), same outputs as voice.py:
data/narration.wav + data/lines.json, so words.py / capture / mix.py work unchanged.

  ~/.faceless-shorts/venv/bin/python tools/voice_eleven.py <project> [--voice-name Sahir] [--test]

API key: env ELEVENLABS_API_KEY or ~/.untold/secrets.json {"ELEVENLABS_API_KEY": ...}. NEVER commit it.
Needs api.elevenlabs.io allowed in claude.ai Settings > Capabilities (new sessions only).
script.json keys used: lines[].text/gap/speed, "eleven_voice" (name or id, default "Sahir"),
"eleven_model" (default eleven_multilingual_v2), "eleven_stability" (0.4), "eleven_style" (0.35), lead, outro, gap.
Each line is spoken separately with previous_text/next_text so the flow stays natural; exact line times for free.
"""
import argparse, json, os, subprocess, sys, tempfile, urllib.request, urllib.error, urllib.parse
from pathlib import Path
import numpy as np
from scipy.io import wavfile

SR = 24000
API = 'https://api.elevenlabs.io'


def key():
    k = os.environ.get('ELEVENLABS_API_KEY')
    if not k:
        p = Path.home() / '.untold/secrets.json'
        if p.exists(): k = json.loads(p.read_text()).get('ELEVENLABS_API_KEY')
    if not k: sys.exit('ELEVENLABS_API_KEY missing (env or ~/.untold/secrets.json)')
    return k


def req(path, body=None, raw=False, method=None):
    r = urllib.request.Request(API + path, data=json.dumps(body).encode() if body is not None else None,
                               headers={'xi-api-key': key(), 'Content-Type': 'application/json', 'Accept': '*/*'}, method=method)
    try:
        with urllib.request.urlopen(r, timeout=120) as f:
            d = f.read()
    except urllib.error.HTTPError as e:
        sys.exit(f'ElevenLabs {path}: HTTP {e.code} {e.read()[:400].decode(errors="replace")}')
    except Exception as e:
        sys.exit(f'ElevenLabs {path}: cannot connect ({e}). Is api.elevenlabs.io allowed for this session?')
    return d if raw else json.loads(d)


def find_voice(name):
    if len(name) >= 18 and name.isalnum(): return name, name           # already an id
    mine = req('/v1/voices')['voices']
    for v in mine:
        if v['name'].lower().startswith(name.lower()): return v['voice_id'], v['name']
    # not in "My Voices": look in the Voice Library and add it
    sh = req(f'/v1/shared-voices?search={urllib.parse.quote(name)}&page_size=20').get('voices', [])
    sh = [v for v in sh if v['name'].lower().startswith(name.lower())] or sh
    if not sh: sys.exit(f'voice "{name}" not found in My Voices or the Voice Library')
    v = sorted(sh, key=lambda v: (v.get('language') != 'hi', -(v.get('cloned_by_count') or 0)))[0]
    r = req(f"/v1/voices/add/{v['public_owner_id']}/{v['voice_id']}", {'new_name': v['name']})
    return r.get('voice_id', v['voice_id']), v['name']


def tighten(x, max_pause=0.26):
    """RMS-based trim of both ends + shorten long pauses inside the line (ElevenLabs leaves ~1 s of air)."""
    w = int(0.02 * SR); n = len(x) // w
    if n < 3: return x
    r = np.sqrt((x[:n * w].reshape(n, w) ** 2).mean(1)); thr = max(r.max() * 0.04, 1e-4)
    on = np.where(r > thr)[0]
    if not len(on): return x
    a, b = max(0, on[0] - 1), min(n, on[-1] + 4)                       # keep 80 ms of tail
    keep, run = [], 0
    for i in range(a, b):
        run = run + 1 if r[i] <= thr else 0
        if run * 0.02 <= max_pause: keep.append(i)
    return np.concatenate([x[i * w:(i + 1) * w] for i in keep])


def decode(mp3):
    with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as f: f.write(mp3)
    out = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', f.name, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'],
                         capture_output=True, check=True).stdout
    os.unlink(f.name)
    return tighten(np.frombuffer(out, np.int16).astype(np.float64) / 32768)


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('project', nargs='?'); ap.add_argument('--voice-name')
    ap.add_argument('--test', action='store_true', help='only check access + voice, print credits left')
    a = ap.parse_args()
    if a.test:
        s = req('/v1/user/subscription'); vid, vn = find_voice(a.voice_name or 'Sahir')
        print(f"OK tier={s.get('tier')} credits_left={s.get('character_limit', 0) - s.get('character_count', 0)} voice={vn} ({vid})"); return
    P = Path(a.project); S = json.loads((P / 'script.json').read_text())
    vid, vn = find_voice(a.voice_name or S.get('eleven_voice', 'Sahir'))
    model = S.get('eleven_model', 'eleven_multilingual_v2'); L = S['lines']
    out = [np.zeros(int(S.get('lead', 0.4) * SR))]; t = len(out[0]) / SR; lines = []
    for i, ln in enumerate(L):
        body = {'text': ln['text'], 'model_id': model,
                'previous_text': ' '.join(l['text'] for l in L[max(0, i - 2):i]) or None,
                'next_text': ' '.join(l['text'] for l in L[i + 1:i + 2]) or None,
                'voice_settings': {'stability': S.get('eleven_stability', 0.4), 'similarity_boost': 0.8,
                                   'style': S.get('eleven_style', 0.35), 'use_speaker_boost': True,
                                   'speed': max(0.7, min(1.2, float(ln.get('speed') or S.get('eleven_speed', 1.1))))}}
        import hashlib
        cd = P / 'data/eleven'; cd.mkdir(parents=True, exist_ok=True)
        cf = cd / (hashlib.sha1(json.dumps([vid, body], ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:16] + '.mp3')
        if not cf.exists(): cf.write_bytes(req(f'/v1/text-to-speech/{vid}?output_format=mp3_44100_128', body, raw=True))
        x = decode(cf.read_bytes())
        lines.append({'i': i, 'text': ln['text'], 'start': round(t, 3), 'end': round(t + len(x) / SR, 3)})
        print(f'{i:2d} {lines[-1]["start"]:6.2f}-{lines[-1]["end"]:6.2f}  {ln["text"]}', flush=True)
        end_sent = ln['text'].strip().endswith(('.', '?', '!')) or ln.get('break')
        g = float(ln.get('gap', S.get('gap', 0.3))) if end_sent else 0.12
        if i == len(L) - 1: g = 0
        out += [x, np.zeros(int(g * SR))]; t += len(x) / SR + g
    out.append(np.zeros(int(float(S.get('outro', 0.9)) * SR)))
    y = np.concatenate(out); y = y / (np.abs(y).max() + 1e-9) * 0.9
    (P / 'data').mkdir(exist_ok=True)
    wavfile.write(P / 'data/narration.wav', SR, (y * 32767).astype(np.int16))
    (P / 'data/lines.json').write_text(json.dumps({'duration': round(len(y) / SR, 3), 'voice': f'eleven:{vn}', 'speed': 1.0, 'lines': lines}, indent=1))
    print(f'data/narration.wav ({len(y) / SR:.2f} s, ElevenLabs {vn}) + data/lines.json. Next: words.py')


if __name__ == '__main__':
    main()
