"""Repair collapsed word timings: when Whisper misses a line, words.py stacks its words at one instant (0-length),
so captions flash or vanish. For any line where > 1/3 of words are < 0.06 s long, spread the words over the line's
start..end by character length.  Usage: python tools/fix_words.py <project dir>   (run after words.py)"""
import json, sys, pathlib
P = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.')
W = json.loads((P / 'data/words.json').read_text()); Ls = json.loads((P / 'data/lines.json').read_text())['lines']
fixed = []
for l in Ls:
    ws = [w for w in W if w['line'] == l['i']]
    if ws and sum(1 for w in ws if w['e'] - w['s'] < 0.06) > len(ws) / 3:
        tot = sum(len(w['w']) + 2 for w in ws); t = l['start']; span = l['end'] - l['start']
        for w in ws:
            d = span * (len(w['w']) + 2) / tot; w['s'] = round(t, 3); w['e'] = round(t + d, 3); t += d
        fixed.append(l['i'])
(P / 'data/words.json').write_text(json.dumps(W, ensure_ascii=False))
print('fixed lines', fixed)
