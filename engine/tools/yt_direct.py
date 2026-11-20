"""Direct YouTube upload + Telegram alerts, no Zapier. Free (YouTube Data API quota: 1,600 units per upload of 10,000/day).

  python tools/yt_direct.py upload  renders/<slug>-yt.mp4 meta.json [--privacy private|public]   -> prints the video id
  python tools/yt_direct.py publish <video_id>                                                  -> sets it public
  python tools/yt_direct.py latest                                                              -> last 3 uploads (watchdog)
  python tools/yt_direct.py telegram "message text"                                             -> sends to the user

Credentials come from the environment or from ~/.untold/secrets.json (never commit them):
  YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN, TG_BOT_TOKEN, TG_CHAT_ID
Needs these hosts allowed for the session (claude.ai Settings → Capabilities): oauth2.googleapis.com,
www.googleapis.com, api.telegram.org.
meta.json: {"title", "description", "tags": [], "category_id": "27", "language": "hi"}
"""
import json, os, sys, urllib.request, urllib.parse
from pathlib import Path

def secrets():
    s = {}
    f = Path.home() / '.untold/secrets.json'
    if f.exists(): s.update(json.loads(f.read_text()))
    for k in ['YT_CLIENT_ID', 'YT_CLIENT_SECRET', 'YT_REFRESH_TOKEN', 'TG_BOT_TOKEN', 'TG_CHAT_ID']:
        if os.environ.get(k): s[k] = os.environ[k]
    return s

def http(url, data=None, headers=None, method=None, raw=None):
    body = raw if raw is not None else (json.dumps(data).encode() if isinstance(data, (dict, list)) else (urllib.parse.urlencode(data).encode() if data else None))
    req = urllib.request.Request(url, data=body, headers=headers or {}, method=method)
    with urllib.request.urlopen(req, timeout=600) as r:
        return r.status, dict(r.headers), r.read()

def token(S):
    _, _, b = http('https://oauth2.googleapis.com/token', {'client_id': S['YT_CLIENT_ID'], 'client_secret': S['YT_CLIENT_SECRET'],
                   'refresh_token': S['YT_REFRESH_TOKEN'], 'grant_type': 'refresh_token'})
    return json.loads(b)['access_token']

def upload(path, meta, privacy='private'):
    S = secrets(); at = token(S); data = Path(path).read_bytes()
    body = {'snippet': {'title': meta['title'][:100], 'description': meta['description'][:4900], 'tags': meta.get('tags', [])[:15],
                        'categoryId': str(meta.get('category_id', '27')), 'defaultLanguage': meta.get('language', 'hi'),
                        'defaultAudioLanguage': meta.get('language', 'hi')},
            'status': {'privacyStatus': privacy, 'selfDeclaredMadeForKids': False, 'embeddable': True, 'license': 'youtube'}}
    st, h, _ = http('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status&notifySubscribers=true',
                    raw=json.dumps(body).encode(), method='POST',
                    headers={'Authorization': f'Bearer {at}', 'Content-Type': 'application/json; charset=UTF-8',
                             'X-Upload-Content-Type': 'video/mp4', 'X-Upload-Content-Length': str(len(data))})
    loc = h.get('Location') or h.get('location')
    st, _, b = http(loc, raw=data, method='PUT', headers={'Authorization': f'Bearer {at}', 'Content-Type': 'video/mp4'})
    v = json.loads(b); print(v['id'], v['status']['privacyStatus']); return v['id']

def publish(vid):
    S = secrets(); at = token(S)
    _, _, b = http('https://www.googleapis.com/youtube/v3/videos?part=status', method='PUT',
                   raw=json.dumps({'id': vid, 'status': {'privacyStatus': 'public', 'embeddable': True, 'license': 'youtube',
                                   'publicStatsViewable': True, 'selfDeclaredMadeForKids': False}}).encode(),
                   headers={'Authorization': f'Bearer {at}', 'Content-Type': 'application/json'})
    st = json.loads(b)['status']['privacyStatus']; print(vid, st)
    if st != 'public': raise SystemExit(f'still {st}: an unaudited API project keeps uploads private (see docs/youtube-api-setup.md)')

def latest():
    S = secrets(); at = token(S)
    _, _, b = http('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true', headers={'Authorization': f'Bearer {at}'})
    up = json.loads(b)['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    _, _, b = http(f'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&maxResults=3&playlistId={up}', headers={'Authorization': f'Bearer {at}'})
    for it in json.loads(b).get('items', []): print(it['snippet']['publishedAt'], it['status']['privacyStatus'], it['snippet']['title'])

def telegram(text):
    S = secrets()
    http(f"https://api.telegram.org/bot{S['TG_BOT_TOKEN']}/sendMessage", {'chat_id': S.get('TG_CHAT_ID', '1289292985'), 'text': text})
    print('sent')

if __name__ == '__main__':
    cmd = sys.argv[1]
    if cmd == 'upload':
        priv = sys.argv[sys.argv.index('--privacy') + 1] if '--privacy' in sys.argv else 'private'
        upload(sys.argv[2], json.loads(Path(sys.argv[3]).read_text()), priv)
    elif cmd == 'publish': publish(sys.argv[2])
    elif cmd == 'latest': latest()
    elif cmd == 'telegram': telegram(sys.argv[2])
